import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Box, Typography, Collapse, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import AlbumIcon from '@material-ui/icons/Album'
import PersonIcon from '@material-ui/icons/Person'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import CategoryIcon from '@material-ui/icons/Category'
import BusinessIcon from '@material-ui/icons/Business'
import DateRangeIcon from '@material-ui/icons/DateRange'

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1.5, 2),
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  headerTitle: {
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  expandIcon: {
    color: 'rgba(255, 255, 255, 0.5)',
    padding: 4,
  },
  content: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: theme.spacing(2),
  },
  metaItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(1.5),
  },
  metaIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '1.1rem',
    marginTop: 2,
  },
  metaContent: {
    flex: 1,
    minWidth: 0,
  },
  metaLabel: {
    fontSize: '0.65rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: '0.875rem',
    color: 'rgba(255, 255, 255, 0.9)',
    wordBreak: 'break-word',
  },
  metaValueSecondary: {
    fontSize: '0.8rem',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  participantsSection: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  },
  participantsTitle: {
    fontSize: '0.7rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: theme.spacing(1.5),
  },
  participantsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
  },
  participantChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 4,
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  participantRole: {
    fontSize: '0.65rem',
    color: 'rgba(255, 255, 255, 0.5)',
    fontStyle: 'italic',
  },
  comment: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
    borderLeft: '3px solid rgba(0, 255, 255, 0.4)',
  },
  commentText: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
    fontStyle: 'italic',
    lineHeight: 1.6,
  },
}))

const NowPlayingMetadataPanel = ({ song }) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  if (!song) return null

  // Check if there's meaningful metadata to show
  const hasMetadata = song.genre || song.recordLabel || song.compilation ||
    song.composer || song.comment || (song.participants && song.participants.length > 0)

  if (!hasMetadata) return null

  const metadataItems = []

  if (song.genre) {
    metadataItems.push({
      icon: <CategoryIcon className={classes.metaIcon} />,
      label: 'Genre',
      value: song.genre,
    })
  }

  if (song.recordLabel) {
    metadataItems.push({
      icon: <BusinessIcon className={classes.metaIcon} />,
      label: 'Record Label',
      value: song.recordLabel,
    })
  }

  if (song.year) {
    metadataItems.push({
      icon: <DateRangeIcon className={classes.metaIcon} />,
      label: 'Year',
      value: song.year.toString(),
    })
  }

  if (song.compilation) {
    metadataItems.push({
      icon: <AlbumIcon className={classes.metaIcon} />,
      label: 'Album Type',
      value: 'Compilation',
    })
  }

  if (song.composer) {
    metadataItems.push({
      icon: <MusicNoteIcon className={classes.metaIcon} />,
      label: 'Composer',
      value: song.composer,
    })
  }

  if (song.albumArtist && song.albumArtist !== song.artist) {
    metadataItems.push({
      icon: <PersonIcon className={classes.metaIcon} />,
      label: 'Album Artist',
      value: song.albumArtist,
    })
  }

  return (
    <Box className={classes.container}>
      <Box
        className={classes.header}
        onClick={() => setExpanded(!expanded)}
      >
        <Typography className={classes.headerTitle}>
          Track Details
        </Typography>
        <IconButton className={classes.expandIcon} size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      <Collapse in={expanded}>
        <Box className={classes.content}>
          {metadataItems.length > 0 && (
            <Box className={classes.grid}>
              {metadataItems.map((item, index) => (
                <Box key={index} className={classes.metaItem}>
                  {item.icon}
                  <Box className={classes.metaContent}>
                    <Typography className={classes.metaLabel}>
                      {item.label}
                    </Typography>
                    <Typography className={classes.metaValue}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Participants (credits) */}
          {song.participants && song.participants.length > 0 && (
            <Box className={classes.participantsSection}>
              <Typography className={classes.participantsTitle}>
                Credits
              </Typography>
              <Box className={classes.participantsList}>
                {song.participants.map((participant, index) => (
                  <Box key={index} className={classes.participantChip}>
                    <span>{participant.name}</span>
                    {participant.role && (
                      <span className={classes.participantRole}>
                        ({participant.role})
                      </span>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Comment */}
          {song.comment && (
            <Box className={classes.comment}>
              <Typography className={classes.commentText}>
                {song.comment}
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  )
}

NowPlayingMetadataPanel.propTypes = {
  song: PropTypes.object,
}

export default NowPlayingMetadataPanel
