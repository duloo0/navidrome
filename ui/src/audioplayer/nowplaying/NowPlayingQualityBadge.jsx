import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { MdHighQuality, MdMusicNote } from 'react-icons/md'
import { RiSoundModuleFill } from 'react-icons/ri'
import config from '../../config'

const useStyles = makeStyles((theme) => ({
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 1.5),
    borderRadius: 6,
    border: '1px solid',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    transition: 'all 200ms ease',
    '&:hover': {
      transform: 'scale(1.02)',
    },
  },
  icon: {
    fontSize: '1rem',
  },
  text: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  subtext: {
    fontSize: '0.65rem',
    fontWeight: 500,
    opacity: 0.8,
  },
  // Quality variants
  hiRes: {
    borderColor: '#FFD700',
    color: '#FFD700',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
    '& $icon': {
      color: '#FFD700',
    },
  },
  lossless: {
    borderColor: '#00FF88',
    color: '#00FF88',
    boxShadow: '0 0 16px rgba(0, 255, 136, 0.15)',
    '& $icon': {
      color: '#00FF88',
    },
  },
  dsd: {
    borderColor: '#9B59B6',
    color: '#9B59B6',
    boxShadow: '0 0 20px rgba(155, 89, 182, 0.2)',
    '& $icon': {
      color: '#9B59B6',
    },
  },
  standard: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'rgba(255, 255, 255, 0.7)',
    '& $icon': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    alignItems: 'center',
  },
}))

// Check if format is lossless
const isLosslessFormat = (suffix) => {
  const losslessFormats = config.losslessFormats?.split(',') || [
    'flac', 'alac', 'wav', 'aiff', 'ape', 'dsd', 'dsf', 'dff',
  ]
  return losslessFormats.includes(suffix?.toLowerCase())
}

// Check if DSD
const isDsdFormat = (suffix) => {
  const dsdFormats = ['dsd', 'dsf', 'dff']
  return dsdFormats.includes(suffix?.toLowerCase())
}

// Check if hi-res
const isHiResAudio = (sampleRate, bitDepth) => {
  return (sampleRate && sampleRate > 44100) || (bitDepth && bitDepth > 16)
}

// Format sample rate for display
const formatSampleRate = (rate) => {
  if (!rate) return null
  if (rate >= 1000) {
    return `${(rate / 1000).toFixed(1)}kHz`
  }
  return `${rate}Hz`
}

const NowPlayingQualityBadge = ({ song }) => {
  const classes = useStyles()

  const qualityInfo = useMemo(() => {
    if (!song?.suffix) return null

    const suffix = song.suffix.toUpperCase()
    const sampleRate = song.sampleRate
    const bitDepth = song.bitDepth
    const bitRate = song.bitRate
    const isDsd = isDsdFormat(song.suffix)
    const isLossless = isLosslessFormat(song.suffix)
    const isHiRes = isHiResAudio(sampleRate, bitDepth)

    let quality = 'standard'
    let label = suffix
    let sublabel = bitRate ? `${bitRate} kbps` : null
    let Icon = RiSoundModuleFill

    if (isDsd) {
      quality = 'dsd'
      label = 'DSD'
      sublabel = sampleRate ? formatSampleRate(sampleRate) : null
      Icon = MdHighQuality
    } else if (isHiRes) {
      quality = 'hiRes'
      label = 'Hi-Res'
      sublabel = `${bitDepth}-bit / ${formatSampleRate(sampleRate)}`
      Icon = MdHighQuality
    } else if (isLossless) {
      quality = 'lossless'
      label = suffix
      sublabel = sampleRate && bitDepth
        ? `${bitDepth}-bit / ${formatSampleRate(sampleRate)}`
        : 'Lossless'
      Icon = MdMusicNote
    }

    return { quality, label, sublabel, Icon, suffix }
  }, [song])

  if (!qualityInfo) return null

  const { quality, label, sublabel, Icon, suffix } = qualityInfo

  return (
    <Box className={classes.container}>
      <Box className={`${classes.badge} ${classes[quality]}`}>
        <Icon className={classes.icon} />
        <Box>
          <Typography className={classes.text}>
            {label}
          </Typography>
          {sublabel && (
            <Typography className={classes.subtext}>
              {sublabel}
            </Typography>
          )}
        </Box>
      </Box>
      {/* Show format badge separately if different from quality label */}
      {quality !== 'standard' && suffix !== label && (
        <Box className={`${classes.badge} ${classes.standard}`}>
          <Typography className={classes.text}>
            {suffix}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

NowPlayingQualityBadge.propTypes = {
  song: PropTypes.object,
}

export default NowPlayingQualityBadge
