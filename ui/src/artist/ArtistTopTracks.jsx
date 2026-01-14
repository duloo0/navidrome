import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import subsonic from '../subsonic'
import { playTracks } from '../actions'
import { DurationField } from '../common'

const useStyles = makeStyles(
  (theme) => ({
    container: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      maxWidth: '1400px',
      margin: '0 auto',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing(2),
    },
    title: {
      fontSize: '20px',
      fontWeight: 600,
      color: theme.palette.text.primary,
      letterSpacing: '-0.01em',
    },
    trackList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    trackRow: {
      display: 'grid',
      gridTemplateColumns: '32px 48px 1fr auto',
      alignItems: 'center',
      gap: theme.spacing(2),
      padding: theme.spacing(1),
      paddingLeft: theme.spacing(1.5),
      paddingRight: theme.spacing(2),
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': {
        backgroundColor: theme.palette.type === 'dark'
          ? 'rgba(255, 255, 255, 0.08)'
          : 'rgba(0, 0, 0, 0.04)',
      },
      '&:hover $trackNumber': {
        opacity: 0,
      },
      '&:hover $playButton': {
        opacity: 1,
      },
      [theme.breakpoints.down('xs')]: {
        gridTemplateColumns: '32px 40px 1fr auto',
        gap: theme.spacing(1.5),
        padding: theme.spacing(0.75),
      },
    },
    numberCell: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    trackNumber: {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      fontWeight: 500,
      transition: 'opacity 150ms ease',
    },
    playButton: {
      position: 'absolute',
      opacity: 0,
      padding: 0,
      transition: 'opacity 150ms ease',
      '& svg': {
        fontSize: '24px',
        color: theme.palette.text.primary,
      },
    },
    coverArt: {
      width: '48px',
      height: '48px',
      borderRadius: '4px',
      objectFit: 'cover',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      [theme.breakpoints.down('xs')]: {
        width: '40px',
        height: '40px',
      },
    },
    trackInfo: {
      minWidth: 0,
      overflow: 'hidden',
    },
    trackTitle: {
      fontSize: '15px',
      fontWeight: 500,
      color: theme.palette.text.primary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      lineHeight: 1.3,
    },
    trackAlbum: {
      fontSize: '13px',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      marginTop: '2px',
    },
    duration: {
      fontSize: '13px',
      color: theme.palette.text.secondary,
      fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
    },
    loading: {
      padding: theme.spacing(4),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    empty: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
      fontSize: '14px',
    },
  }),
  { name: 'NDArtistTopTracks' },
)

const ArtistTopTracks = ({ artistName, maxTracks = 5 }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!artistName) return

    setLoading(true)
    subsonic
      .getTopSongs(artistName, maxTracks)
      .then((resp) => resp.json['subsonic-response'])
      .then((data) => {
        if (data.status === 'ok' && data.topSongs?.song) {
          setTracks(data.topSongs.song)
        } else {
          setTracks([])
        }
      })
      .catch((e) => {
        console.error('Error fetching top tracks:', e)
        setTracks([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [artistName, maxTracks])

  const handlePlayTrack = useCallback((trackId) => {
    // Convert tracks to the format expected by playTracks
    const data = {}
    const ids = tracks.map((t) => {
      data[t.id] = t
      return t.id
    })
    dispatch(playTracks(data, ids, trackId))
  }, [dispatch, tracks])

  const handlePlayAll = useCallback(() => {
    if (tracks.length > 0) {
      handlePlayTrack(tracks[0].id)
    }
  }, [tracks, handlePlayTrack])

  if (loading) {
    return (
      <div className={classes.container}>
        <div className={classes.loading}>Loading top tracks...</div>
      </div>
    )
  }

  if (!tracks || tracks.length === 0) {
    return null // Don't show section if no top tracks
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Typography className={classes.title}>Popular</Typography>
      </div>
      <div className={classes.trackList}>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className={classes.trackRow}
            onClick={() => handlePlayTrack(track.id)}
          >
            <div className={classes.numberCell}>
              <span className={classes.trackNumber}>{index + 1}</span>
              <IconButton className={classes.playButton} size="small">
                <PlayArrowIcon />
              </IconButton>
            </div>
            <img
              src={subsonic.getCoverArtUrl(track, 100)}
              alt={track.album}
              className={classes.coverArt}
            />
            <div className={classes.trackInfo}>
              <Typography className={classes.trackTitle}>
                {track.title}
              </Typography>
              <Typography className={classes.trackAlbum}>
                {track.album}
              </Typography>
            </div>
            <span className={classes.duration}>
              <DurationField record={track} source="duration" />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArtistTopTracks
