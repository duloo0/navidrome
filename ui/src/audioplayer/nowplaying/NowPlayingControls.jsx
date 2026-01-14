import React from 'react'
import PropTypes from 'prop-types'
import { Box, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import PauseIcon from '@material-ui/icons/Pause'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import RepeatIcon from '@material-ui/icons/Repeat'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    marginTop: theme.spacing(3),
  },
  controlButton: {
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'all 150ms ease',
    '&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      transform: 'scale(1.05)',
    },
  },
  playButton: {
    width: 64,
    height: 64,
    backgroundColor: '#fff',
    color: '#000',
    transition: 'all 200ms ease',
    '&:hover': {
      backgroundColor: '#fff',
      transform: 'scale(1.08)',
      boxShadow: '0 8px 32px rgba(255, 255, 255, 0.3)',
    },
    '& svg': {
      fontSize: '2rem',
    },
  },
  skipButton: {
    width: 48,
    height: 48,
    '& svg': {
      fontSize: '1.75rem',
    },
  },
  modeButton: {
    width: 40,
    height: 40,
    '& svg': {
      fontSize: '1.25rem',
    },
  },
  activeMode: {
    color: '#00FFFF !important',
    '&:hover': {
      color: '#00FFFF !important',
    },
  },
}))

const NowPlayingControls = ({
  isPlaying,
  shuffle,
  repeatMode,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffleToggle,
  onRepeatToggle,
}) => {
  const classes = useStyles()

  const getRepeatIcon = () => {
    if (repeatMode === 'one') {
      return <RepeatOneIcon />
    }
    return <RepeatIcon />
  }

  return (
    <Box className={classes.container}>
      {/* Shuffle */}
      <IconButton
        className={`${classes.controlButton} ${classes.modeButton} ${
          shuffle ? classes.activeMode : ''
        }`}
        onClick={onShuffleToggle}
        title="Shuffle"
      >
        <ShuffleIcon />
      </IconButton>

      {/* Previous */}
      <IconButton
        className={`${classes.controlButton} ${classes.skipButton}`}
        onClick={onPrevious}
        title="Previous"
      >
        <SkipPreviousIcon />
      </IconButton>

      {/* Play/Pause */}
      <IconButton
        className={classes.playButton}
        onClick={onPlayPause}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
      </IconButton>

      {/* Next */}
      <IconButton
        className={`${classes.controlButton} ${classes.skipButton}`}
        onClick={onNext}
        title="Next"
      >
        <SkipNextIcon />
      </IconButton>

      {/* Repeat */}
      <IconButton
        className={`${classes.controlButton} ${classes.modeButton} ${
          repeatMode !== 'none' ? classes.activeMode : ''
        }`}
        onClick={onRepeatToggle}
        title={`Repeat: ${repeatMode}`}
      >
        {getRepeatIcon()}
      </IconButton>
    </Box>
  )
}

NowPlayingControls.propTypes = {
  isPlaying: PropTypes.bool,
  shuffle: PropTypes.bool,
  repeatMode: PropTypes.oneOf(['none', 'all', 'one']),
  onPlayPause: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onShuffleToggle: PropTypes.func,
  onRepeatToggle: PropTypes.func,
}

NowPlayingControls.defaultProps = {
  isPlaying: false,
  shuffle: false,
  repeatMode: 'none',
}

export default NowPlayingControls
