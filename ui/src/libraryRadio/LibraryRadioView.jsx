import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useDataProvider, useTranslate, useNotify } from 'react-admin'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  makeStyles,
} from '@material-ui/core'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import RefreshIcon from '@material-ui/icons/Refresh'
import { useDispatch } from 'react-redux'
import { playTracks, shuffleTracks } from '../actions'
import libraryRadioLists, { decadePresets } from './libraryRadioLists'
import subsonic from '../subsonic'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 800,
    margin: '0 auto',
  },
  header: {
    marginBottom: theme.spacing(3),
  },
  controls: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
  },
  button: {
    minWidth: 120,
  },
  filters: {
    display: 'flex',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 150,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  description: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  trackCount: {
    marginTop: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
}))

const LibraryRadioView = () => {
  const classes = useStyles()
  const { type } = useParams()
  const location = useLocation()
  const translate = useTranslate()
  const notify = useNotify()
  const dataProvider = useDataProvider()
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('')
  const [trackCount, setTrackCount] = useState(50)
  const [selectedYear, setSelectedYear] = useState('')

  // Parse decade from URL if present
  const decadeMatch = location.pathname.match(/\/decade\/(\d+)-(\d+)/)
  const urlFromYear = decadeMatch ? parseInt(decadeMatch[1]) : null
  const urlToYear = decadeMatch ? parseInt(decadeMatch[2]) : null

  // Determine active year filters (URL decade takes precedence, then manual year selector)
  const fromYear = urlFromYear || (selectedYear ? parseInt(selectedYear) : null)
  const toYear = urlToYear || (selectedYear ? parseInt(selectedYear) : null)

  // Get current radio config
  const radioConfig = libraryRadioLists[type] || libraryRadioLists.all
  const isDecadeMode = !!urlFromYear
  const isGenreMode = type === 'byGenre'

  // Generate year options (current year back to 1950)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i)

  // Load available genres
  useEffect(() => {
    const loadGenres = async () => {
      try {
        const { data } = await dataProvider.getList('genre', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'name', order: 'ASC' },
          filter: {},
        })
        setGenres(data || [])
      } catch (error) {
        console.error('Failed to load genres:', error)
      }
    }
    loadGenres()
  }, [dataProvider])

  // Start radio playback
  const startRadio = useCallback(
    async (shuffle = false) => {
      setLoading(true)
      try {
        // Build options for the library radio endpoint
        const options = {
          count: trackCount,
        }

        if (selectedGenre) {
          options.genre = selectedGenre
        }
        if (fromYear) {
          options.fromYear = fromYear
        }
        if (toYear) {
          options.toYear = toYear
        }

        // Call the library radio API endpoint
        const res = await subsonic.getLibraryRadio(options)
        const data = res.json['subsonic-response']

        // Check for API errors
        if (data.status !== 'ok') {
          const errorMsg = data.error?.message || 'Unknown error'
          console.error('Library Radio API error:', errorMsg, data.error)
          throw new Error(`Error fetching library radio: ${errorMsg}`)
        }

        // Extract songs from the response
        const songs = data.randomSongs?.song || []

        if (songs.length > 0) {
          if (shuffle) {
            dispatch(shuffleTracks(songs))
          } else {
            dispatch(playTracks(songs))
          }
          notify(
            translate('resources.libraryRadio.notifications.started', {
              _: `Playing ${songs.length} tracks`,
            }),
            'info',
          )
        } else {
          notify(
            translate('resources.libraryRadio.notifications.noTracks', {
              _: 'No tracks found matching criteria',
            }),
            'warning',
          )
        }
      } catch (error) {
        console.error('Failed to start radio:', error)
        notify(
          translate('resources.libraryRadio.notifications.error', {
            _: 'Failed to start radio',
          }),
          'error',
        )
      } finally {
        setLoading(false)
      }
    },
    [
      dispatch,
      notify,
      translate,
      selectedGenre,
      fromYear,
      toYear,
      trackCount,
    ],
  )

  // Get title based on mode
  const getTitle = () => {
    if (isDecadeMode) {
      const preset = decadePresets.find(
        (d) => d.fromYear === fromYear && d.toYear === toYear,
      )
      return preset
        ? `${preset.label} Radio`
        : `${fromYear}-${toYear} Radio`
    }
    if (isGenreMode) {
      return selectedGenre
        ? `${selectedGenre} Radio`
        : translate('resources.libraryRadio.lists.byGenre', { _: 'By Genre' })
    }
    return translate(`resources.libraryRadio.lists.${type}`, {
      _: 'Library Radio',
    })
  }

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Box className={classes.header}>
            <Typography variant="h5" gutterBottom>
              {getTitle()}
            </Typography>
            {radioConfig.description && !isDecadeMode && !isGenreMode && (
              <Typography className={classes.description}>
                {radioConfig.description}
              </Typography>
            )}
          </Box>

          {/* Filters */}
          <Box className={classes.filters}>
            {/* Genre selector (always available) */}
            <FormControl className={classes.formControl} variant="outlined" size="small">
              <InputLabel>
                {translate('resources.libraryRadio.filters.genre', {
                  _: 'Genre',
                })}
              </InputLabel>
              <Select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                label={translate('resources.libraryRadio.filters.genre', {
                  _: 'Genre',
                })}
              >
                <MenuItem value="">
                  <em>
                    {translate('resources.libraryRadio.filters.allGenres', {
                      _: 'All Genres',
                    })}
                  </em>
                </MenuItem>
                {genres.map((genre) => (
                  <MenuItem key={genre.id} value={genre.name}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Year selector (disabled if decade mode active) */}
            <FormControl className={classes.formControl} variant="outlined" size="small" disabled={isDecadeMode}>
              <InputLabel>
                {translate('resources.libraryRadio.filters.year', {
                  _: 'Year',
                })}
              </InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label={translate('resources.libraryRadio.filters.year', {
                  _: 'Year',
                })}
              >
                <MenuItem value="">
                  <em>
                    {translate('resources.libraryRadio.filters.allYears', {
                      _: 'All Years',
                    })}
                  </em>
                </MenuItem>
                {yearOptions.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Track count */}
            <FormControl className={classes.formControl} variant="outlined" size="small">
              <InputLabel>
                {translate('resources.libraryRadio.filters.trackCount', {
                  _: 'Tracks',
                })}
              </InputLabel>
              <Select
                value={trackCount}
                onChange={(e) => setTrackCount(e.target.value)}
                label={translate('resources.libraryRadio.filters.trackCount', {
                  _: 'Tracks',
                })}
              >
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={200}>200</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active filters display */}
          {(selectedGenre || selectedYear || isDecadeMode) && (
            <Box mb={2}>
              {selectedGenre && (
                <Chip
                  label={selectedGenre}
                  onDelete={() => setSelectedGenre('')}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              )}
              {selectedYear && !isDecadeMode && (
                <Chip
                  label={selectedYear}
                  onDelete={() => setSelectedYear('')}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              )}
              {isDecadeMode && (
                <Chip
                  label={`${urlFromYear}-${urlToYear}`}
                  className={classes.chip}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
          )}

          {/* Control buttons */}
          <Box className={classes.controls}>
            <Button
              variant="contained"
              color="primary"
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
              onClick={() => startRadio(false)}
              disabled={loading}
              className={classes.button}
            >
              {translate('resources.libraryRadio.actions.play', { _: 'Play' })}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<ShuffleIcon />}
              onClick={() => startRadio(true)}
              disabled={loading}
              className={classes.button}
            >
              {translate('resources.libraryRadio.actions.shuffle', {
                _: 'Shuffle',
              })}
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => startRadio(false)}
              disabled={loading}
            >
              {translate('resources.libraryRadio.actions.refresh', {
                _: 'New Mix',
              })}
            </Button>
          </Box>

          <Typography className={classes.trackCount}>
            {translate('resources.libraryRadio.help', {
              _: 'Click Play to start a smart radio mix based on your library and listening history.',
            })}
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}

export default LibraryRadioView
