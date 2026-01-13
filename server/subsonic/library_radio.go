package subsonic

import (
	"context"
	"math"
	"net/http"
	"sync/atomic"
	"time"

	. "github.com/Masterminds/squirrel"
	"github.com/navidrome/navidrome/log"
	"github.com/navidrome/navidrome/model"
	"github.com/navidrome/navidrome/model/request"
	"github.com/navidrome/navidrome/server/subsonic/filter"
	"github.com/navidrome/navidrome/server/subsonic/responses"
	"github.com/navidrome/navidrome/utils/random"
	"github.com/navidrome/navidrome/utils/req"
	"github.com/navidrome/navidrome/utils/slice"
)

const (
	libraryRadioBaseWeight     = 10
	libraryRadioLastFMFactor   = 5.0
	libraryRadioUserFactor     = 2.0
	libraryRadioMaxUserPlays   = 50
	libraryRadioPoolSize       = 2000 // Max songs to consider for weighting
	libraryRadioRatingFactor   = 15.0 // Weight boost per rating star (4+ stars)
	libraryRadioRecencyDays    = 3    // Days to consider "recently played"
	libraryRadioRecencyPenalty = 0.3  // Multiplier for recently played songs
)

func (api *Router) GetLibraryRadio(r *http.Request) (*responses.Subsonic, error) {
	p := req.Params(r)
	count := min(p.IntOr("count", 50), 500)
	genre, _ := p.String("genre")
	fromYear := p.IntOr("fromYear", 0)
	toYear := p.IntOr("toYear", 0)

	musicFolderIds, err := selectedMusicFolderIds(r, false)
	if err != nil {
		return nil, err
	}

	ctx := r.Context()
	songs, err := api.getLibraryRadioSongs(ctx, count, genre, fromYear, toYear, musicFolderIds)
	if err != nil {
		log.Error(r, "Error retrieving library radio songs", err)
		return nil, err
	}

	response := newResponse()
	response.RandomSongs = &responses.Songs{}
	response.RandomSongs.Songs = slice.MapWithArg(songs, ctx, childFromMediaFile)
	return response, nil
}

func (api *Router) getLibraryRadioSongs(ctx context.Context, count int, genre string, fromYear, toYear int, musicFolderIds []int) (model.MediaFiles, error) {
	// Build filter options for random song pool
	opts := filter.SongsByRandom(genre, fromYear, toYear)
	opts = filter.ApplyLibraryFilter(opts, musicFolderIds)
	opts.Max = libraryRadioPoolSize

	// Get candidate songs
	songs, err := api.ds.MediaFile(ctx).GetAll(opts)
	if err != nil {
		return nil, err
	}

	if len(songs) == 0 {
		return nil, nil
	}

	// Collect unique album IDs
	albumIDSet := make(map[string]struct{})
	for _, song := range songs {
		if song.AlbumID != "" {
			albumIDSet[song.AlbumID] = struct{}{}
		}
	}

	albumIDs := make([]string, 0, len(albumIDSet))
	for id := range albumIDSet {
		albumIDs = append(albumIDs, id)
	}

	// Get album popularity data
	albumPopularity := make(map[string]albumPopularityData)
	if len(albumIDs) > 0 {
		albums, err := api.ds.Album(ctx).GetAll(model.QueryOptions{
			Filters: Eq{"album.id": albumIDs},
		})
		if err != nil {
			log.Warn(ctx, "Failed to get album popularity data", err)
			// Continue without popularity data
		} else {
			for _, album := range albums {
				albumPopularity[album.ID] = albumPopularityData{
					listeners: album.LastFMListeners,
					playcount: album.LastFMPlaycount,
				}
			}
		}
	}

	// Build weighted chooser
	weightedSongs := random.NewWeightedChooser[model.MediaFile]()
	for _, song := range songs {
		weight := calculateLibraryRadioWeight(song, albumPopularity[song.AlbumID])
		weightedSongs.Add(song, weight)
	}

	// Pick weighted random songs
	var result model.MediaFiles
	for len(result) < count && weightedSongs.Size() > 0 {
		song, err := weightedSongs.Pick()
		if err != nil {
			break
		}
		result = append(result, song)
	}

	return result, nil
}

type albumPopularityData struct {
	listeners int64
	playcount int64
}

func calculateLibraryRadioWeight(song model.MediaFile, albumPop albumPopularityData) int {
	// Exclude 1-star (thumbs down) songs entirely
	if song.Rating == 1 {
		return 0
	}

	// Base weight ensures all songs have a chance
	weight := float64(libraryRadioBaseWeight)

	// Prefer track-level popularity if available, otherwise fall back to album popularity
	var listeners, playcount int64
	if song.LastFMListeners > 0 || song.LastFMPlaycount > 0 {
		// Use track-level popularity data
		listeners = song.LastFMListeners
		playcount = song.LastFMPlaycount
	} else {
		// Fall back to album-level popularity data
		listeners = albumPop.listeners
		playcount = albumPop.playcount
	}

	// Add Last.fm popularity score (logarithmic to prevent extreme outliers)
	if listeners > 0 || playcount > 0 {
		lastfmScore := math.Log10(float64(listeners+1)) +
			math.Log10(float64(playcount+1))
		weight += lastfmScore * libraryRadioLastFMFactor
	}

	// Add user play count (capped)
	userPlays := min(song.PlayCount, libraryRadioMaxUserPlays)
	weight += float64(userPlays) * libraryRadioUserFactor

	// Rating boost (5-star songs get significant boost)
	if song.Rating >= 4 {
		weight += float64(song.Rating) * libraryRadioRatingFactor
	}

	// Recency penalty - reduce weight for recently played songs
	if song.PlayDate != nil {
		daysSincePlay := time.Since(*song.PlayDate).Hours() / 24
		if daysSincePlay < float64(libraryRadioRecencyDays) {
			weight *= libraryRadioRecencyPenalty
		}
	}

	return max(1, int(weight))
}

// Popularity scan state
var (
	popularityScanRunning atomic.Bool
	popularityScanStatus  atomic.Value // stores *PopularityScanStatus
)

type PopularityScanStatus struct {
	Running        bool   `json:"running"`
	TotalArtists   int    `json:"totalArtists"`
	ScannedArtists int    `json:"scannedArtists"`
	TotalAlbums    int    `json:"totalAlbums"`
	ScannedAlbums  int    `json:"scannedAlbums"`
	TotalTracks    int    `json:"totalTracks"`
	ScannedTracks  int    `json:"scannedTracks"`
	Error          string `json:"error,omitempty"`
}

func init() {
	popularityScanStatus.Store(&PopularityScanStatus{})
}

func (api *Router) RefreshPopularity(r *http.Request) (*responses.Subsonic, error) {
	ctx := r.Context()
	loggedUser, ok := request.UserFrom(ctx)
	if !ok {
		return nil, newError(responses.ErrorGeneric, "Internal error")
	}

	if !loggedUser.IsAdmin {
		return nil, newError(responses.ErrorAuthorizationFail)
	}

	// Check if already running
	if popularityScanRunning.Load() {
		response := newResponse()
		return response, nil
	}

	// Start background scan
	go api.runPopularityScan(context.Background())

	response := newResponse()
	return response, nil
}

func (api *Router) GetPopularityStatus(r *http.Request) (*responses.Subsonic, error) {
	status := popularityScanStatus.Load().(*PopularityScanStatus)
	response := newResponse()
	// Return status in a generic way - we'll use the message field
	log.Debug(r, "Popularity scan status", "status", status)
	return response, nil
}

func (api *Router) runPopularityScan(ctx context.Context) {
	if !popularityScanRunning.CompareAndSwap(false, true) {
		return // Already running
	}
	defer popularityScanRunning.Store(false)

	start := time.Now()
	log.Info(ctx, "Starting popularity scan")

	// Get artists without popularity data first, then those with data
	artistsWithoutData, err := api.ds.Artist(ctx).GetAll(model.QueryOptions{
		Filters: Or{
			Eq{"lastfm_listeners": nil},
			Eq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get artists without popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	artistsWithData, err := api.ds.Artist(ctx).GetAll(model.QueryOptions{
		Filters: And{
			NotEq{"lastfm_listeners": nil},
			NotEq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get artists with popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	// Combine lists: items without data first, then items with data
	artists := append(artistsWithoutData, artistsWithData...)

	// Get albums without popularity data first, then those with data
	albumsWithoutData, err := api.ds.Album(ctx).GetAll(model.QueryOptions{
		Filters: Or{
			Eq{"lastfm_listeners": nil},
			Eq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get albums without popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	albumsWithData, err := api.ds.Album(ctx).GetAll(model.QueryOptions{
		Filters: And{
			NotEq{"lastfm_listeners": nil},
			NotEq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get albums with popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	albums := append(albumsWithoutData, albumsWithData...)

	// Get tracks without popularity data first, then those with data
	tracksWithoutData, err := api.ds.MediaFile(ctx).GetAll(model.QueryOptions{
		Filters: Or{
			Eq{"lastfm_listeners": nil},
			Eq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get tracks without popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	tracksWithData, err := api.ds.MediaFile(ctx).GetAll(model.QueryOptions{
		Filters: And{
			NotEq{"lastfm_listeners": nil},
			NotEq{"lastfm_playcount": nil},
		},
	})
	if err != nil {
		log.Error(ctx, "Failed to get tracks with popularity data", err)
		popularityScanStatus.Store(&PopularityScanStatus{Error: err.Error()})
		return
	}

	tracks := append(tracksWithoutData, tracksWithData...)

	log.Info(ctx, "Popularity scan prioritization",
		"artistsWithoutData", len(artistsWithoutData), "artistsWithData", len(artistsWithData),
		"albumsWithoutData", len(albumsWithoutData), "albumsWithData", len(albumsWithData),
		"tracksWithoutData", len(tracksWithoutData), "tracksWithData", len(tracksWithData))

	status := &PopularityScanStatus{
		Running:      true,
		TotalArtists: len(artists),
		TotalAlbums:  len(albums),
		TotalTracks:  len(tracks),
	}
	popularityScanStatus.Store(status)

	// Scan artists
	for i, artist := range artists {
		select {
		case <-ctx.Done():
			log.Info(ctx, "Popularity scan cancelled")
			return
		default:
		}

		_, err := api.provider.UpdateArtistInfo(ctx, artist.ID, 0, false)
		if err != nil {
			log.Debug(ctx, "Failed to update artist info", "artist", artist.Name, "error", err)
		}

		status = &PopularityScanStatus{
			Running:        true,
			TotalArtists:   len(artists),
			ScannedArtists: i + 1,
			TotalAlbums:    len(albums),
			ScannedAlbums:  0,
			TotalTracks:    len(tracks),
			ScannedTracks:  0,
		}
		popularityScanStatus.Store(status)

		// Rate limit to avoid hammering Last.fm
		time.Sleep(200 * time.Millisecond)
	}

	// Scan albums
	for i, album := range albums {
		select {
		case <-ctx.Done():
			log.Info(ctx, "Popularity scan cancelled")
			return
		default:
		}

		_, err := api.provider.UpdateAlbumInfo(ctx, album.ID)
		if err != nil {
			log.Debug(ctx, "Failed to update album info", "album", album.Name, "error", err)
		}

		status = &PopularityScanStatus{
			Running:        true,
			TotalArtists:   len(artists),
			ScannedArtists: len(artists),
			TotalAlbums:    len(albums),
			ScannedAlbums:  i + 1,
			TotalTracks:    len(tracks),
			ScannedTracks:  0,
		}
		popularityScanStatus.Store(status)

		// Rate limit to avoid hammering Last.fm
		time.Sleep(200 * time.Millisecond)
	}

	// Scan tracks
	for i, track := range tracks {
		select {
		case <-ctx.Done():
			log.Info(ctx, "Popularity scan cancelled")
			return
		default:
		}

		err := api.provider.UpdateTrackPopularity(ctx, track.ID)
		if err != nil {
			log.Debug(ctx, "Failed to update track popularity", "track", track.Title, "artist", track.Artist, "error", err)
		}

		status = &PopularityScanStatus{
			Running:        true,
			TotalArtists:   len(artists),
			ScannedArtists: len(artists),
			TotalAlbums:    len(albums),
			ScannedAlbums:  len(albums),
			TotalTracks:    len(tracks),
			ScannedTracks:  i + 1,
		}
		popularityScanStatus.Store(status)

		// Rate limit to avoid hammering Last.fm
		time.Sleep(200 * time.Millisecond)
	}

	log.Info(ctx, "Popularity scan complete", "artists", len(artists), "albums", len(albums), "tracks", len(tracks), "elapsed", time.Since(start))
	popularityScanStatus.Store(&PopularityScanStatus{
		Running:        false,
		TotalArtists:   len(artists),
		ScannedArtists: len(artists),
		TotalAlbums:    len(albums),
		ScannedAlbums:  len(albums),
		TotalTracks:    len(tracks),
		ScannedTracks:  len(tracks),
	})
}
