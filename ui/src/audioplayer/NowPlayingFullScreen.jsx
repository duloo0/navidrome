import React, { useState, useEffect, useCallback, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
  Box,
  Typography,
  IconButton,
  Slider,
  Collapse,
  useMediaQuery,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import QueueMusicIcon from '@material-ui/icons/QueueMusic'
import LyricsIcon from '@material-ui/icons/MusicNote'
import { LoveButton, RatingField, ThumbUpButton, ThumbDownButton } from '../common'
import { setPlayMode } from '../actions'
import subsonic from '../subsonic'
import config from '../config'
import LyricsPanel from './LyricsPanel'
import SignalPath from './SignalPath'
import {
  NowPlayingControls,
  NowPlayingQualityBadge,
  NowPlayingMetadataPanel,
} from './nowplaying'

// Ken Burns animation keyframes
const kenBurnsKeyframes = {
  '@keyframes kenBurns': {
    '0%': {
      transform: 'scale(1.3) translate(0, 0)',
    },
    '25%': {
      transform: 'scale(1.35) translate(-1%, -1%)',
    },
    '50%': {
      transform: 'scale(1.4) translate(0, -2%)',
    },
    '75%': {
      transform: 'scale(1.35) translate(1%, -1%)',
    },
    '100%': {
      transform: 'scale(1.3) translate(0, 0)',
    },
  },
  '@keyframes fadeIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.96)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
  '@keyframes pulseGlow': {
    '0%, 100%': {
      boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.15)',
    },
    '50%': {
      boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 0 80px rgba(255, 215, 0, 0.25)',
    },
  },
}

const useStyles = makeStyles((theme) => ({
  ...kenBurnsKeyframes,
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    animation: '$fadeIn 300ms ease-out',
    backgroundColor: '#000',
  },
  // Animated blurred background with Ken Burns effect
  backgroundBlur: {
    position: 'absolute',
    top: '-20%',
    left: '-20%',
    right: '-20%',
    bottom: '-20%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(100px) saturate(1.2)',
    opacity: 0.5,
    zIndex: 0,
    animation: '$kenBurns 30s ease-in-out infinite',
  },
  // Dark gradient overlay
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.8) 40%,
      rgba(0, 0, 0, 0.95) 100%
    )`,
    zIndex: 1,
  },
  // Main content with fade animation
  content: {
    position: 'relative',
    zIndex: 2,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(8),
    maxWidth: 1400,
    margin: '0 auto',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
      paddingTop: theme.spacing(6),
    },
  },
  // Header with close button
  header: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 3,
  },
  closeButton: {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 150ms ease',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.05)',
    },
  },
  headerButton: {
    color: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 150ms ease',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  headerButtonActive: {
    color: '#00FFFF !important',
  },
  nowPlayingLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  // Main area with album art and info
  mainArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(8),
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      gap: theme.spacing(4),
    },
  },
  // Album art container
  albumArtContainer: {
    flexShrink: 0,
    [theme.breakpoints.down('md')]: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
  },
  // Larger album art with enhanced shadow
  albumArt: {
    width: 500,
    height: 500,
    borderRadius: 16,
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6)',
    objectFit: 'cover',
    cursor: 'pointer',
    transition: 'all 300ms ease',
    '&:hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 40px 100px rgba(0, 0, 0, 0.7)',
    },
    [theme.breakpoints.down('lg')]: {
      width: 400,
      height: 400,
    },
    [theme.breakpoints.down('md')]: {
      width: 320,
      height: 320,
    },
    [theme.breakpoints.down('sm')]: {
      width: 280,
      height: 280,
    },
  },
  // Hi-res glow effect
  albumArtHiRes: {
    animation: '$pulseGlow 4s ease-in-out infinite',
    border: '1px solid rgba(255, 215, 0, 0.2)',
  },
  // Lossless subtle glow
  albumArtLossless: {
    boxShadow: '0 32px 80px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 255, 136, 0.1)',
    border: '1px solid rgba(0, 255, 136, 0.15)',
  },
  // Info section
  infoSection: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  songTitle: {
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 700,
    lineHeight: 1.1,
    color: '#fff',
    wordBreak: 'break-word',
    textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
    letterSpacing: '-0.02em',
  },
  artistName: {
    fontSize: 'clamp(1.25rem, 3vw, 2rem)',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.85)',
    cursor: 'pointer',
    transition: 'color 150ms ease',
    '&:hover': {
      color: '#00FFFF',
    },
  },
  albumName: {
    fontSize: 'clamp(1rem, 2vw, 1.5rem)',
    color: 'rgba(255, 255, 255, 0.6)',
    cursor: 'pointer',
    transition: 'color 150ms ease',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  },
  // Quality and metadata row
  qualityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
    flexWrap: 'wrap',
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
  playCount: {
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  // Actions row
  actionsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center',
    },
  },
  // Progress section at bottom
  progressSection: {
    marginTop: 'auto',
    paddingTop: theme.spacing(3),
  },
  progressBar: {
    color: '#fff',
    height: 6,
    transition: 'height 150ms ease',
    '&:hover': {
      height: 8,
    },
    '& .MuiSlider-thumb': {
      width: 16,
      height: 16,
      transition: 'all 150ms ease',
      '&:hover': {
        boxShadow: '0 0 0 10px rgba(255, 255, 255, 0.16)',
      },
    },
    '& .MuiSlider-track': {
      height: 'inherit',
      borderRadius: 3,
    },
    '& .MuiSlider-rail': {
      height: 'inherit',
      borderRadius: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
  },
  timeText: {
    fontSize: '0.75rem',
    fontFamily: '"JetBrains Mono", "SF Mono", monospace',
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: '0.05em',
  },
  // Expandable panels section
  panelsSection: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  panelWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  lyricsContainer: {
    maxHeight: 350,
    overflow: 'auto',
    padding: theme.spacing(2),
    scrollBehavior: 'smooth',
  },
}))

// Format time from seconds to mm:ss
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Check if format is lossless
const isLossless = (suffix) => {
  const losslessFormats = config.losslessFormats?.split(',') || ['flac', 'alac', 'wav', 'aiff', 'ape', 'dsd']
  return losslessFormats.includes(suffix?.toLowerCase())
}

// Check if hi-res (>44.1kHz or >16-bit)
const isHiRes = (song) => {
  const sampleRate = song?.sampleRate || 0
  const bitDepth = song?.bitDepth || 0
  return sampleRate > 44100 || bitDepth > 16
}

const NowPlayingFullScreen = ({ open, onClose, audioInstance }) => {
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down('sm'))
  const isMedium = useMediaQuery((theme) => theme.breakpoints.down('md'))

  const playerState = useSelector((state) => state.player)
  const current = playerState?.current || {}
  const song = current?.song || {}

  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showSignalPath, setShowSignalPath] = useState(false)

  // Get cover art URL
  const coverArtUrl = useMemo(() => {
    if (song?.id) {
      return subsonic.getCoverArtUrl(song, 800)
    }
    return null
  }, [song])

  // Determine album art quality class
  const albumArtClass = useMemo(() => {
    if (isHiRes(song)) return classes.albumArtHiRes
    if (isLossless(song?.suffix)) return classes.albumArtLossless
    return ''
  }, [song, classes])

  // Track audio progress and playing state
  useEffect(() => {
    if (!audioInstance) return

    const updateProgress = () => {
      setProgress(audioInstance.currentTime || 0)
      setDuration(audioInstance.duration || 0)
    }

    const updatePlayState = () => {
      setIsPlaying(!audioInstance.paused)
    }

    audioInstance.addEventListener('timeupdate', updateProgress)
    audioInstance.addEventListener('loadedmetadata', updateProgress)
    audioInstance.addEventListener('play', updatePlayState)
    audioInstance.addEventListener('pause', updatePlayState)

    // Initial state
    updateProgress()
    updatePlayState()

    return () => {
      audioInstance.removeEventListener('timeupdate', updateProgress)
      audioInstance.removeEventListener('loadedmetadata', updateProgress)
      audioInstance.removeEventListener('play', updatePlayState)
      audioInstance.removeEventListener('pause', updatePlayState)
    }
  }, [audioInstance])

  // Handle seek
  const handleSeek = useCallback((_, value) => {
    if (audioInstance && duration) {
      audioInstance.currentTime = value
      setProgress(value)
    }
  }, [audioInstance, duration])

  // Handle lyrics line click for seek
  const handleLyricsSeek = useCallback((time) => {
    if (audioInstance) {
      audioInstance.currentTime = time
      setProgress(time)
    }
  }, [audioInstance])

  // Playback controls
  const handlePlayPause = useCallback(() => {
    if (!audioInstance) return
    if (audioInstance.paused) {
      audioInstance.play()
    } else {
      audioInstance.pause()
    }
  }, [audioInstance])

  const handlePrevious = useCallback(() => {
    if (audioInstance) {
      audioInstance.playPrev()
    }
  }, [audioInstance])

  const handleNext = useCallback(() => {
    if (audioInstance) {
      audioInstance.playNext()
    }
  }, [audioInstance])

  // Shuffle toggle
  const handleShuffleToggle = useCallback(() => {
    const newMode = playerState.shuffle ? 'order' : 'shufflePlay'
    dispatch(setPlayMode(newMode))
  }, [dispatch, playerState.shuffle])

  // Repeat toggle: none -> all -> one -> none
  const handleRepeatToggle = useCallback(() => {
    const currentMode = playerState.mode
    let newMode = 'order'
    if (currentMode !== 'orderLoop' && currentMode !== 'singleLoop') {
      newMode = 'orderLoop' // none -> all
    } else if (currentMode === 'orderLoop') {
      newMode = 'singleLoop' // all -> one
    }
    dispatch(setPlayMode(newMode))
  }, [dispatch, playerState.mode])

  // Navigate to artist
  const handleArtistClick = useCallback(() => {
    if (song?.artistId) {
      onClose()
      history.push(`/artist/${song.artistId}/show`)
    }
  }, [song?.artistId, history, onClose])

  // Navigate to album
  const handleAlbumClick = useCallback(() => {
    if (song?.albumId) {
      onClose()
      history.push(`/album/${song.albumId}/show`)
    }
  }, [song?.albumId, history, onClose])

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ' && e.target === document.body) {
        e.preventDefault()
        handlePlayPause()
      }
    }

    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, handlePlayPause])

  if (!open) return null

  const subtitle = song?.tags?.['subtitle']
  const title = song?.title + (subtitle ? ` (${subtitle})` : '')

  return ReactDOM.createPortal(
    <div className={classes.root}>
        {/* Animated blurred background with Ken Burns effect */}
        {coverArtUrl && (
          <div
            className={classes.backgroundBlur}
            style={{ backgroundImage: `url(${coverArtUrl})` }}
          />
        )}

        {/* Dark overlay */}
        <div className={classes.overlay} />

        {/* Header */}
        <div className={classes.header}>
          <Typography className={classes.nowPlayingLabel}>
            Now Playing
          </Typography>
          <Box display="flex" alignItems="center" style={{ gap: 4 }}>
            {song?.lyrics && (
              <IconButton
                size="small"
                className={`${classes.headerButton} ${showLyrics ? classes.headerButtonActive : ''}`}
                onClick={() => setShowLyrics(!showLyrics)}
                title="Lyrics"
              >
                <LyricsIcon fontSize="small" />
              </IconButton>
            )}
            <IconButton
              size="small"
              className={`${classes.headerButton} ${showSignalPath ? classes.headerButtonActive : ''}`}
              onClick={() => setShowSignalPath(!showSignalPath)}
              title="Signal Path"
            >
              <QueueMusicIcon fontSize="small" />
            </IconButton>
            <IconButton
              className={classes.closeButton}
              onClick={onClose}
              title="Close (Esc)"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </div>

        {/* Main content */}
        <div className={classes.content}>
          <div className={classes.mainArea}>
            {/* Album Art */}
            <div className={classes.albumArtContainer}>
              {coverArtUrl ? (
                <img
                  src={coverArtUrl}
                  alt={song?.album || 'Album Art'}
                  className={`${classes.albumArt} ${albumArtClass}`}
                  onClick={handleAlbumClick}
                />
              ) : (
                <div className={classes.albumArt} style={{ backgroundColor: '#333' }} />
              )}
            </div>

            {/* Song Info */}
            <div className={classes.infoSection}>
              <Typography className={classes.songTitle}>
                {title || 'Unknown Title'}
              </Typography>

              <Typography
                className={classes.artistName}
                onClick={handleArtistClick}
              >
                {song?.artist || 'Unknown Artist'}
              </Typography>

              <Typography
                className={classes.albumName}
                onClick={handleAlbumClick}
              >
                {song?.album || 'Unknown Album'}
                {song?.year ? ` • ${song.year}` : ''}
              </Typography>

              {/* Quality Badge */}
              <div className={classes.qualityRow}>
                <NowPlayingQualityBadge song={song} />
                {song?.playCount > 0 && (
                  <span className={classes.playCount}>
                    {song.playCount} plays
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className={classes.actionsRow}>
                <LoveButton
                  record={song}
                  resource="song"
                  size="default"
                  color="primary"
                />
                <ThumbDownButton
                  record={song}
                  resource="song"
                  size="small"
                />
                <ThumbUpButton
                  record={song}
                  resource="song"
                  size="small"
                />
                {config.enableStarRating && (
                  <RatingField
                    record={song}
                    resource="song"
                    size="small"
                  />
                )}
              </div>

              {/* Playback Controls */}
              <NowPlayingControls
                isPlaying={isPlaying}
                shuffle={playerState?.shuffle}
                repeatMode={playerState?.mode === 'orderLoop' ? 'all' : playerState?.mode === 'singleLoop' ? 'one' : 'none'}
                onPlayPause={handlePlayPause}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onShuffleToggle={handleShuffleToggle}
                onRepeatToggle={handleRepeatToggle}
              />

              {/* Signal Path - Collapsible */}
              <Collapse in={showSignalPath}>
                <SignalPath song={song} />
              </Collapse>

              {/* Metadata Panel */}
              <NowPlayingMetadataPanel song={song} />
            </div>
          </div>

          {/* Lyrics - Collapsible panel at bottom */}
          {song?.lyrics && (
            <Collapse in={showLyrics}>
              <div className={classes.panelsSection}>
                <div className={classes.panelWrapper}>
                  <div className={classes.lyricsContainer}>
                    <LyricsPanel
                      lyrics={song.lyrics}
                      currentTime={progress}
                      onLineClick={handleLyricsSeek}
                    />
                  </div>
                </div>
              </div>
            </Collapse>
          )}

          {/* Progress */}
          <div className={classes.progressSection}>
            <Slider
              className={classes.progressBar}
              value={progress}
              max={duration || 100}
              onChange={handleSeek}
            />
            <div className={classes.timeRow}>
              <Typography className={classes.timeText}>
                {formatTime(progress)}
              </Typography>
              <Typography className={classes.timeText}>
                {formatTime(duration)}
              </Typography>
            </div>
          </div>
        </div>
      </div>,
    document.body
  )
}

export default NowPlayingFullScreen
