import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import config from '../config'

// Animation keyframes
const signalPathKeyframes = {
  '@keyframes signalFlow': {
    '0%': {
      backgroundPosition: '200% 0',
    },
    '100%': {
      backgroundPosition: '-200% 0',
    },
  },
  '@keyframes nodePulse': {
    '0%, 100%': {
      boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.1)',
    },
    '50%': {
      boxShadow: '0 0 12px 2px rgba(255, 255, 255, 0.08)',
    },
  },
  '@keyframes glowPulse': {
    '0%, 100%': {
      opacity: 0.6,
    },
    '50%': {
      opacity: 1,
    },
  },
}

const useStyles = makeStyles((theme) => ({
  ...signalPathKeyframes,
  container: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2.5),
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    fontSize: '0.65rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: theme.spacing(2.5),
    textAlign: 'center',
  },
  pathContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  node: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(1.5, 2.5),
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 10,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    minWidth: 90,
    position: 'relative',
    transition: 'all 200ms ease',
    animation: '$nodePulse 3s ease-in-out infinite',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      transform: 'translateY(-2px)',
    },
  },
  nodeLabel: {
    fontSize: '0.55rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'rgba(255, 255, 255, 0.35)',
    marginBottom: theme.spacing(0.5),
  },
  nodeValue: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center',
    letterSpacing: '-0.01em',
  },
  nodeSubValue: {
    fontSize: '0.65rem',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.55)',
    textAlign: 'center',
    marginTop: 3,
    fontFamily: '"JetBrains Mono", monospace',
  },
  // Animated connection arrow
  arrow: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    position: 'relative',
  },
  arrowLine: {
    width: 40,
    height: 2,
    borderRadius: 1,
    background: `linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.3) 20%,
      rgba(255, 255, 255, 0.6) 50%,
      rgba(255, 255, 255, 0.3) 80%,
      transparent 100%
    )`,
    backgroundSize: '200% 100%',
    animation: '$signalFlow 2s linear infinite',
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      right: -6,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '6px solid rgba(255, 255, 255, 0.5)',
    },
  },
  // Quality-specific node styles
  lossless: {
    borderColor: 'rgba(0, 255, 136, 0.35)',
    backgroundColor: 'rgba(0, 255, 136, 0.06)',
    '& $nodeValue': {
      color: '#00FF88',
    },
    '& $nodeLabel': {
      color: 'rgba(0, 255, 136, 0.6)',
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 255, 136, 0.1)',
      borderColor: 'rgba(0, 255, 136, 0.5)',
    },
  },
  hiRes: {
    borderColor: 'rgba(255, 215, 0, 0.4)',
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.1)',
    '& $nodeValue': {
      color: '#FFD700',
    },
    '& $nodeLabel': {
      color: 'rgba(255, 215, 0, 0.7)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 215, 0, 0.12)',
      borderColor: 'rgba(255, 215, 0, 0.6)',
    },
  },
  dsd: {
    borderColor: 'rgba(155, 89, 182, 0.4)',
    backgroundColor: 'rgba(155, 89, 182, 0.08)',
    boxShadow: '0 0 20px rgba(155, 89, 182, 0.1)',
    '& $nodeValue': {
      color: '#BB86FC',
    },
    '& $nodeLabel': {
      color: 'rgba(155, 89, 182, 0.7)',
    },
    '&:hover': {
      backgroundColor: 'rgba(155, 89, 182, 0.12)',
    },
  },
  lossy: {
    borderColor: 'rgba(255, 152, 0, 0.35)',
    backgroundColor: 'rgba(255, 152, 0, 0.05)',
    '& $nodeValue': {
      color: '#FF9800',
    },
    '& $nodeLabel': {
      color: 'rgba(255, 152, 0, 0.6)',
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 152, 0, 0.1)',
    },
  },
  // Processing nodes
  processing: {
    borderColor: 'rgba(0, 191, 255, 0.35)',
    backgroundColor: 'rgba(0, 191, 255, 0.06)',
    '& $nodeValue': {
      color: '#00BFFF',
    },
    '& $nodeLabel': {
      color: 'rgba(0, 191, 255, 0.6)',
    },
  },
  replayGain: {
    borderColor: 'rgba(206, 147, 216, 0.35)',
    backgroundColor: 'rgba(156, 39, 176, 0.08)',
    '& $nodeValue': {
      color: '#CE93D8',
    },
    '& $nodeLabel': {
      color: 'rgba(206, 147, 216, 0.6)',
    },
  },
  output: {
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    '& $nodeValue': {
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
  // Quality summary badge
  summary: {
    marginTop: theme.spacing(2.5),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    justifyContent: 'center',
  },
  summaryBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(0.75, 2),
    borderRadius: 20,
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    animation: '$glowPulse 3s ease-in-out infinite',
  },
  summaryHiRes: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    color: '#FFD700',
    border: '1px solid rgba(255, 215, 0, 0.3)',
  },
  summaryLossless: {
    backgroundColor: 'rgba(0, 255, 136, 0.12)',
    color: '#00FF88',
    border: '1px solid rgba(0, 255, 136, 0.25)',
  },
  summaryLossy: {
    backgroundColor: 'rgba(255, 152, 0, 0.12)',
    color: '#FF9800',
    border: '1px solid rgba(255, 152, 0, 0.25)',
  },
  summaryDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}))

// Check if format is lossless
const isLosslessFormat = (suffix) => {
  const losslessFormats = config.losslessFormats?.split(',') || ['flac', 'alac', 'wav', 'aiff', 'ape', 'dsd', 'dsf', 'dff']
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

const SignalPath = ({ song }) => {
  const classes = useStyles()
  const gainInfo = useSelector((state) => state.replayGain)

  const pathNodes = useMemo(() => {
    if (!song) return []

    const nodes = []
    const suffix = song.suffix?.toUpperCase() || 'Unknown'
    const sampleRate = song.sampleRate
    const bitDepth = song.bitDepth
    const bitRate = song.bitRate
    const isDsd = isDsdFormat(song.suffix)
    const isLossless = isLosslessFormat(song.suffix)
    const isHiRes = isHiResAudio(sampleRate, bitDepth)

    // Determine source node style
    let sourceClassName = classes.lossy
    if (isDsd) {
      sourceClassName = classes.dsd
    } else if (isHiRes) {
      sourceClassName = classes.hiRes
    } else if (isLossless) {
      sourceClassName = classes.lossless
    }

    // Source node
    nodes.push({
      id: 'source',
      label: 'Source',
      value: suffix,
      subValue: isLossless || isDsd
        ? bitDepth && sampleRate
          ? `${bitDepth}-bit / ${formatSampleRate(sampleRate)}`
          : isDsd ? 'DSD' : 'Lossless'
        : bitRate
          ? `${bitRate} kbps`
          : null,
      className: sourceClassName,
    })

    // Check for transcoding
    const transcodedFormat = config.defaultDownsamplingFormat
    const maxBitRate = config.maxBitRate
    const needsTranscode = maxBitRate && bitRate && bitRate > parseInt(maxBitRate, 10)

    if (needsTranscode) {
      nodes.push({
        id: 'transcode',
        label: 'Transcode',
        value: transcodedFormat?.toUpperCase() || 'MP3',
        subValue: `${maxBitRate} kbps`,
        className: classes.processing,
      })
    }

    // Replay Gain processing
    if (gainInfo.gainMode && gainInfo.gainMode !== 'none') {
      const gainType = gainInfo.gainMode === 'album' ? 'Album' : 'Track'
      const gain = gainInfo.gainMode === 'album' ? song.rgAlbumGain : song.rgTrackGain

      nodes.push({
        id: 'replayGain',
        label: 'Replay Gain',
        value: gainType,
        subValue: gain !== undefined
          ? `${gain >= 0 ? '+' : ''}${gain?.toFixed(2)} dB`
          : 'No data',
        className: classes.replayGain,
      })
    }

    // Output node
    nodes.push({
      id: 'output',
      label: 'Output',
      value: 'Browser',
      subValue: 'Web Audio',
      className: classes.output,
    })

    return nodes
  }, [song, gainInfo, classes])

  // Calculate signal path quality summary
  const pathSummary = useMemo(() => {
    if (!song) return null

    const isDsd = isDsdFormat(song.suffix)
    const isLossless = isLosslessFormat(song.suffix)
    const isHiRes = isHiResAudio(song.sampleRate, song.bitDepth)

    if (isDsd) {
      return { text: 'DSD Audio Path', quality: 'hiRes' }
    } else if (isHiRes) {
      return { text: 'Hi-Res Lossless', quality: 'hiRes' }
    } else if (isLossless) {
      return { text: 'Lossless Path', quality: 'lossless' }
    } else {
      return { text: 'Compressed Audio', quality: 'lossy' }
    }
  }, [song])

  if (!song) {
    return null
  }

  const getSummaryClass = () => {
    switch (pathSummary?.quality) {
      case 'hiRes':
        return classes.summaryHiRes
      case 'lossless':
        return classes.summaryLossless
      default:
        return classes.summaryLossy
    }
  }

  return (
    <Box className={classes.container}>
      <Typography className={classes.title}>
        Signal Path
      </Typography>

      <Box className={classes.pathContainer}>
        {pathNodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {index > 0 && (
              <Box className={classes.arrow}>
                <div className={classes.arrowLine} />
              </Box>
            )}
            <Box className={`${classes.node} ${node.className}`}>
              <Typography className={classes.nodeLabel}>
                {node.label}
              </Typography>
              <Typography className={classes.nodeValue}>
                {node.value}
              </Typography>
              {node.subValue && (
                <Typography className={classes.nodeSubValue}>
                  {node.subValue}
                </Typography>
              )}
            </Box>
          </React.Fragment>
        ))}
      </Box>

      {pathSummary && (
        <Box className={classes.summary}>
          <Box className={`${classes.summaryBadge} ${getSummaryClass()}`}>
            <span className={classes.summaryDot} />
            {pathSummary.text}
          </Box>
        </Box>
      )}
    </Box>
  )
}

SignalPath.propTypes = {
  song: PropTypes.object,
}

export default SignalPath
