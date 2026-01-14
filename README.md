# Naviamp

### A Smart Music Server for Audiophiles

*A fork of [Navidrome](https://github.com/navidrome/navidrome) with intelligent music discovery and premium audio features*

---

Naviamp is a personal music server that goes beyond simple streaming. It learns your taste through ratings, leverages Last.fm popularity data, and uses sophisticated algorithms to create the perfect listening experience. Think of it as your personal DJ that actually understands what you want to hear.

## What Makes Naviamp Different

While Navidrome provides an excellent foundation for self-hosted music streaming, Naviamp adds intelligent curation and audiophile-focused features:

- **Smart Library Radio** - Weighted song selection based on multiple factors
- **Last.fm Popularity Integration** - Community listening data informs recommendations
- **Rating-Based Curation** - Your ratings directly influence what you hear
- **Synchronized Lyrics** - Follow along with click-to-seek functionality
- **Signal Path Visualization** - See exactly how your audio is being processed
- **Audio Quality Badges** - Instant identification of Hi-Res, DSD, and Lossless content
- **Premium Theme** - Tidal/Roon-inspired design with glassmorphism effects

---

## Features

### Library Radio

The heart of Naviamp. Library Radio uses a multi-factor weighted algorithm to select songs, creating a personalized radio experience that improves as you use it.

**How the Algorithm Works:**

| Factor | Effect |
|--------|--------|
| **Last.fm Popularity** | Songs with more listeners and plays get a boost (logarithmic scaling prevents mega-hits from dominating) |
| **Your Ratings** | 4-5 star songs are prioritized; 1-star songs are **completely excluded** |
| **Artist Quality Score** | Artists with more 5-star songs (relative to 1-star) get boosted across their catalog |
| **Recency** | Songs played in the last 3 days are penalized 70% to keep things fresh |
| **Play Count** | Your personal play history influences selection (capped to prevent overplay) |

**Radio Presets:**
- **Smart Mix** - The full algorithm across your entire library
- **Random** - Pure shuffle when you want serendipity
- **Favorites Radio** - Weighted selection from your starred tracks
- **Top Rated** - Only 4+ star songs
- **Most Played** - Your personal hits
- **By Decade** - Filter by era (2020s, 2010s, 2000s, 90s, 80s, 70s, 60s & older)
- **By Genre** - Focus on specific genres

---

### Last.fm Popularity Integration

Naviamp fetches popularity data from Last.fm for your entire library:

- **Track-level data** - Individual song listeners and play counts
- **Album-level data** - Album popularity metrics
- **Artist-level data** - Artist global popularity

**Using the Popularity Scanner:**
1. Configure your Last.fm API key (see Configuration section)
2. Go to Settings > Personal
3. Click "Scan Popularity" to fetch data for your library
4. The scanner runs in the background with progress tracking
5. Items without data are prioritized, then existing data is refreshed

This data is automatically used by Library Radio to weight song selection toward tracks that resonate with the broader music community, while still respecting your personal ratings.

---

### Synchronized Lyrics

Naviamp parses LRC format lyrics for a karaoke-style experience:

- **Auto-scroll** - Lyrics automatically scroll to the current line
- **Click-to-seek** - Click any lyric line to jump to that point in the song
- **Visual highlighting** - Current, past, and upcoming lines are visually distinct
- **Timestamp display** - Hover to see exact timestamps
- **Plain text fallback** - Non-synced lyrics display cleanly

---

### Full-Screen Now Playing

An immersive playback experience:

- **Ken Burns animation** - Subtle zoom/pan on album artwork background
- **Large album art** - 500x500px display with quality-aware glow effects
- **Integrated panels** - Expandable lyrics and signal path visualization
- **Full controls** - Play/pause, next/previous, shuffle, repeat
- **Quick actions** - Rating buttons and love/favorite toggle
- **Metadata display** - Year, play count, and quality information

---

### Signal Path Visualization

See exactly how your audio flows from source to output:

```
[Source] → [Transcoding] → [Replay Gain] → [Output]
  FLAC       (if needed)      -3.2 dB       Browser
 24/96
```

- **Format detection** - Shows source format, sample rate, and bit depth
- **Transcoding indicator** - See when and how audio is being converted
- **Replay Gain display** - Shows applied gain values
- **Quality-specific styling** - Color-coded nodes (gold for Hi-Res, purple for DSD)

---

### Audio Quality System

Instant identification of audio quality:

| Tier | Detection | Badge Color |
|------|-----------|-------------|
| **DSD** | DSF, DFF formats | Purple |
| **Hi-Res** | >44.1kHz or >16-bit | Gold |
| **Lossless** | FLAC, ALAC, WAV, AIFF, APE, WV, TTA | Green |
| **Lossy** | MP3, AAC, OGG, etc. | Gray |

Badges appear throughout the UI with tooltips showing detailed specs (sample rate, bit depth, bitrate).

---

### Premium Theme

A Tidal/Roon-inspired visual design:

- **Glassmorphism effects** - Frosted glass aesthetics with blur and transparency
- **Quality-aware styling** - Hi-Res content gets gold accents, Lossless gets green
- **Smooth animations** - Hover effects, transitions, and micro-interactions
- **Dark mode optimized** - High contrast for comfortable viewing
- **Responsive design** - Works on desktop, tablet, and mobile

---

### Enhanced Artist Pages

Rich artist presentation:

- **Hero section** - Large artist display
- **Top tracks** - Quick access to an artist's best songs
- **Rating statistics** - See your 5-star and 1-star counts per artist
- **Rating score** - Visual indicator of how much you like this artist

---

## Inherited from Navidrome

Naviamp includes all the great features from Navidrome:

- Handles very **large music collections**
- Streams virtually **any audio format**
- Reads and uses all your beautifully curated **metadata**
- Great support for **compilations** and **box sets**
- **Multi-user** support with individual preferences
- Very **low resource usage**
- **Multi-platform** (macOS, Linux, Windows, Docker, Raspberry Pi)
- **Subsonic API compatible** with all Subsonic/Madsonic/Airsonic clients
- **Transcoding** on the fly with Opus support
- **Themeable** web interface

For complete Navidrome documentation, see: https://www.navidrome.org/docs

---

## Installation

### Docker (Recommended)

```yaml
version: "3"
services:
  naviamp:
    image: naviamp/naviamp:latest
    ports:
      - "4533:4533"
    environment:
      ND_SCANSCHEDULE: 1h
      ND_LOGLEVEL: info
      ND_LASTFM_APIKEY: your_lastfm_api_key
      ND_LASTFM_SECRET: your_lastfm_secret
    volumes:
      - "/path/to/your/music:/music:ro"
      - "/path/to/data:/data"
```

### Pre-built Binaries

1. Download the latest release for your platform
2. Extract the archive
3. Run the binary:
   ```bash
   ./naviamp --musicfolder /path/to/music --datafolder /path/to/data
   ```

### Build from Source

Requirements: Go 1.21+, Node.js 18+, Make

```bash
git clone https://github.com/yourusername/naviamp.git
cd naviamp
make setup
make build
```

---

## Configuration

### Last.fm Setup (Required for Popularity Features)

1. Create a Last.fm API account at https://www.last.fm/api/account/create
2. Add your credentials to the configuration:

**Environment variables:**
```bash
ND_LASTFM_ENABLED=true
ND_LASTFM_APIKEY=your_api_key
ND_LASTFM_SECRET=your_secret
```

**Or in navidrome.toml:**
```toml
[LastFM]
Enabled = true
ApiKey = "your_api_key"
Secret = "your_secret"
```

### Key Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `ND_LASTFM_ENABLED` | true | Enable Last.fm integration |
| `ND_LASTFM_APIKEY` | - | Your Last.fm API key |
| `ND_LASTFM_SECRET` | - | Your Last.fm API secret |
| `ND_LASTFM_LANGUAGE` | en | Language for Last.fm data |

For all configuration options, see the [Navidrome configuration docs](https://www.navidrome.org/docs/usage/configuration-options/).

---

## Screenshots

*Screenshots coming soon*

---

## Credits

Naviamp is a fork of [Navidrome](https://github.com/navidrome/navidrome), created by Deluan Quintão and contributors. We're grateful for their excellent work in building the foundation that makes Naviamp possible.

---

## License

Naviamp is licensed under the GNU GPL v3. See [LICENSE](LICENSE) for details.
