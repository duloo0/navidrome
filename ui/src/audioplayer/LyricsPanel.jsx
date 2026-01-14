import React, { useRef, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(2),
    position: 'relative',
  },
  line: {
    fontSize: '1rem',
    lineHeight: 1.8,
    color: 'rgba(255, 255, 255, 0.35)',
    transition: 'all 400ms cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
    padding: theme.spacing(1, 2),
    borderRadius: 8,
    textAlign: 'center',
    position: 'relative',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  lineClickable: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '&:active': {
      transform: 'scale(0.98)',
    },
  },
  activeLine: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    textShadow: '0 2px 12px rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.02)',
    padding: theme.spacing(1.5, 2),
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      width: 3,
      height: '60%',
      backgroundColor: '#00FFFF',
      borderRadius: 2,
    },
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      color: '#fff',
    },
  },
  passedLine: {
    color: 'rgba(255, 255, 255, 0.55)',
  },
  upcomingLine: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  // For the next line (preview)
  nextLine: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '1.05rem',
  },
  instrumental: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.3)',
    textAlign: 'center',
    padding: theme.spacing(4, 0),
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
  },
  noLyrics: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.35)',
    padding: theme.spacing(4, 0),
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  // Fade gradient at top and bottom
  fadeOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 60,
    pointerEvents: 'none',
    zIndex: 1,
  },
  fadeTop: {
    top: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
  },
  fadeBottom: {
    bottom: 0,
    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
  },
  // Timestamp display
  timestamp: {
    fontSize: '0.65rem',
    fontFamily: '"JetBrains Mono", monospace',
    color: 'rgba(255, 255, 255, 0.25)',
    marginLeft: theme.spacing(1),
    opacity: 0,
    transition: 'opacity 200ms ease',
  },
  lineWithTimestamp: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(0.5),
    '&:hover $timestamp': {
      opacity: 1,
    },
  },
}))

// Parse LRC format lyrics into array of {time, text} objects
const parseLrcLyrics = (lyrics) => {
  if (!lyrics) return []

  const lines = lyrics.split('\n')
  const parsed = []

  // LRC timestamp pattern: [mm:ss.xx] or [mm:ss]
  const timestampRegex = /\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\]/g

  for (const line of lines) {
    // Skip metadata lines like [ar:Artist], [al:Album], etc.
    if (/^\[[a-z]{2}:/.test(line)) continue

    // Extract all timestamps from line
    const timestamps = []
    let match
    while ((match = timestampRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10)
      const seconds = parseInt(match[2], 10)
      const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
      timestamps.push(minutes * 60 + seconds + ms / 1000)
    }

    // Get the text after all timestamps
    const text = line.replace(timestampRegex, '').trim()

    // Add entry for each timestamp (some lines have multiple for repeating lyrics)
    for (const time of timestamps) {
      if (text) {
        parsed.push({ time, text })
      }
    }
  }

  // Sort by timestamp
  return parsed.sort((a, b) => a.time - b.time)
}

// Check if lyrics are in LRC format (have timestamps)
const isLrcFormat = (lyrics) => {
  if (!lyrics) return false
  return /\[\d{2}:\d{2}/.test(lyrics)
}

// Format time for display
const formatTime = (seconds) => {
  if (!seconds && seconds !== 0) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const LyricsPanel = ({ lyrics, currentTime, onLineClick }) => {
  const classes = useStyles()
  const containerRef = useRef(null)
  const activeLineRef = useRef(null)

  // Parse lyrics based on format
  const { parsedLyrics, isSynced } = useMemo(() => {
    if (!lyrics) return { parsedLyrics: [], isSynced: false }

    if (isLrcFormat(lyrics)) {
      return {
        parsedLyrics: parseLrcLyrics(lyrics),
        isSynced: true,
      }
    }

    // Plain text lyrics - split by newline
    const lines = lyrics.split('\n')
      .map((text, index) => ({ time: null, text: text.trim() }))
      .filter((line) => line.text)

    return { parsedLyrics: lines, isSynced: false }
  }, [lyrics])

  // Find current line index based on time
  const currentLineIndex = useMemo(() => {
    if (!isSynced || currentTime === undefined) return -1

    for (let i = parsedLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= parsedLyrics[i].time) {
        return i
      }
    }
    return -1
  }, [parsedLyrics, currentTime, isSynced])

  // Auto-scroll to active line
  useEffect(() => {
    if (activeLineRef.current && containerRef.current) {
      const container = containerRef.current
      const line = activeLineRef.current

      const lineTop = line.offsetTop - container.offsetTop
      const lineHeight = line.offsetHeight
      const containerHeight = container.clientHeight
      const scrollTop = container.scrollTop

      // Calculate ideal scroll position (center the line)
      const idealScroll = lineTop - containerHeight / 2 + lineHeight / 2

      // Smooth scroll if not too far
      const distance = Math.abs(idealScroll - scrollTop)
      if (distance < containerHeight * 2) {
        container.scrollTo({
          top: idealScroll,
          behavior: 'smooth',
        })
      } else {
        container.scrollTop = idealScroll
      }
    }
  }, [currentLineIndex])

  if (!lyrics) {
    return (
      <Typography className={classes.noLyrics}>
        No lyrics available
      </Typography>
    )
  }

  if (parsedLyrics.length === 0) {
    return (
      <Typography className={classes.instrumental}>
        Instrumental
      </Typography>
    )
  }

  const getLineClass = (index) => {
    const isActive = index === currentLineIndex
    const isPassed = isSynced && index < currentLineIndex
    const isNext = isSynced && index === currentLineIndex + 1
    const isClickable = isSynced && onLineClick

    let classNames = classes.line
    if (isClickable) classNames += ` ${classes.lineClickable}`
    if (isActive) classNames += ` ${classes.activeLine}`
    else if (isPassed) classNames += ` ${classes.passedLine}`
    else if (isNext) classNames += ` ${classes.nextLine}`
    else classNames += ` ${classes.upcomingLine}`

    return classNames
  }

  return (
    <div ref={containerRef} className={classes.container}>
      {parsedLyrics.map((line, index) => {
        const isActive = index === currentLineIndex

        return (
          <div
            key={`${index}-${line.time}`}
            ref={isActive ? activeLineRef : null}
            className={`${getLineClass(index)} ${isSynced ? classes.lineWithTimestamp : ''}`}
            onClick={() => onLineClick && isSynced && onLineClick(line.time)}
          >
            <span>{line.text}</span>
            {isSynced && line.time !== null && (
              <span className={classes.timestamp}>
                {formatTime(line.time)}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

LyricsPanel.propTypes = {
  lyrics: PropTypes.string,
  currentTime: PropTypes.number,
  onLineClick: PropTypes.func,
}

LyricsPanel.defaultProps = {
  currentTime: 0,
}

export default LyricsPanel
