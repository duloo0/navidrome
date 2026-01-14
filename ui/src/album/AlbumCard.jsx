import React, { useState, useCallback, useEffect } from 'react'
import { Typography, useMediaQuery, Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { linkToRecord } from 'react-admin'
import { useDrag } from 'react-dnd'
import { withContentRect } from 'react-measure'
import clsx from 'clsx'
import subsonic from '../subsonic'
import { AlbumContextMenu, PlayButton, ArtistLinkField } from '../common'
import { DraggableTypes } from '../consts'
import { AlbumDatesField } from './AlbumDatesField.jsx'

const useStyles = makeStyles(
  (theme) => ({
    // Main card container with hover effects
    albumContainer: {
      position: 'relative',
      borderRadius: theme.overrides?.NDAlbumGridView?.albumContainer?.borderRadius || '12px',
      padding: theme.overrides?.NDAlbumGridView?.albumContainer?.padding || '12px',
      backgroundColor: theme.overrides?.NDAlbumGridView?.albumContainer?.backgroundColor ||
        (theme.palette.type === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: theme.overrides?.NDAlbumGridView?.albumContainer?.['&:hover']?.backgroundColor ||
          (theme.palette.type === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'),
        transform: 'translateY(-6px)',
        boxShadow: '0 16px 40px rgba(0,0,0,0.35)',
      },
      '&:hover $playOverlay': {
        opacity: 1,
        transform: 'translateY(0)',
      },
      '&:hover $contextMenu': {
        opacity: 1,
      },
      '&:hover $cover': {
        transform: 'scale(1.02)',
      },
    },
    missingAlbum: {
      opacity: 0.4,
    },
    // Cover image wrapper
    coverWrapper: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '8px',
      aspectRatio: '1',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    cover: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'opacity 0.3s ease-in-out, transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    coverLoading: {
      opacity: 0.5,
    },
    // Play button overlay
    playOverlay: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      opacity: 0,
      transform: 'translateY(10px)',
      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 2,
    },
    playButton: {
      backgroundColor: theme.overrides?.NDAlbumGridView?.albumPlayButton?.backgroundColor ||
        theme.palette.primary.main,
      borderRadius: '50%',
      width: '48px',
      height: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
      transition: 'all 150ms ease',
      '&:hover': {
        transform: 'scale(1.1)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        backgroundColor: theme.overrides?.NDAlbumGridView?.albumPlayButton?.['&:hover']?.background ||
          theme.palette.primary.main,
      },
      '& svg': {
        color: theme.palette.type === 'dark' ? '#000' : '#fff',
        fontSize: '24px',
      },
    },
    // Context menu (three dots)
    contextMenu: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      opacity: 0,
      transition: 'opacity 200ms ease',
      zIndex: 2,
      '& svg': {
        color: 'white',
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))',
      },
    },
    // Gradient overlay on hover
    hoverGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)',
      opacity: 0,
      transition: 'opacity 200ms ease',
      borderRadius: '0 0 8px 8px',
      pointerEvents: 'none',
    },
    albumContainerHover: {
      '& $hoverGradient': {
        opacity: 1,
      },
    },
    // Album info section
    albumInfo: {
      marginTop: '12px',
      textDecoration: 'none',
      display: 'block',
    },
    albumName: {
      fontSize: theme.overrides?.NDAlbumGridView?.albumName?.fontSize || '14px',
      fontWeight: theme.overrides?.NDAlbumGridView?.albumName?.fontWeight || 600,
      color: theme.overrides?.NDAlbumGridView?.albumName?.color ||
        (theme.palette.type === 'dark' ? '#fff' : '#000'),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      lineHeight: 1.4,
      marginTop: theme.overrides?.NDAlbumGridView?.albumName?.marginTop || '8px',
      transition: 'color 0.15s ease',
      '&:hover': {
        color: theme.palette.primary.main,
      },
    },
    albumVersion: {
      fontSize: '11px',
      color: theme.palette.type === 'dark' ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginTop: '3px',
      fontStyle: 'italic',
    },
    albumSubtitle: {
      fontSize: theme.overrides?.NDAlbumGridView?.albumSubtitle?.fontSize || '13px',
      color: theme.overrides?.NDAlbumGridView?.albumSubtitle?.color ||
        (theme.palette.type === 'dark' ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'),
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginTop: theme.overrides?.NDAlbumGridView?.albumSubtitle?.marginTop || '4px',
      transition: 'color 0.15s ease',
      '& a:hover': {
        color: theme.palette.primary.main,
      },
    },
    // Link styles
    coverLink: {
      display: 'block',
      textDecoration: 'none',
      position: 'relative',
    },
  }),
  { name: 'NDAlbumCard' },
)

// Cover component with measurement and drag support
const Cover = withContentRect('bounds')(({
  record,
  measureRef,
  contentRect,
  classes,
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [, dragAlbumRef] = useDrag(
    () => ({
      type: DraggableTypes.ALBUM,
      item: { albumIds: [record.id] },
      options: { dropEffect: 'copy' },
    }),
    [record],
  )

  useEffect(() => {
    setImageLoading(true)
  }, [record.id])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])

  const handleImageError = useCallback(() => {
    setImageLoading(false)
  }, [])

  return (
    <div ref={measureRef} className={classes.coverWrapper}>
      <div ref={dragAlbumRef} style={{ width: '100%', height: '100%' }}>
        <img
          key={record.id}
          src={subsonic.getCoverArtUrl(record, 300, true)}
          alt={record.name}
          className={clsx(classes.cover, imageLoading && classes.coverLoading)}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
      <div className={classes.hoverGradient} />
    </div>
  )
})

const AlbumCard = ({ record, basePath, showArtist = true }) => {
  const classes = useStyles()
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('md'), {
    noSsr: true,
  })
  const [isHovered, setIsHovered] = useState(false)

  if (!record) {
    return null
  }

  const containerClasses = clsx(
    classes.albumContainer,
    record.missing && classes.missingAlbum,
    isHovered && classes.albumContainerHover,
  )

  return (
    <div
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        className={classes.coverLink}
        to={linkToRecord(basePath, record.id, 'show')}
      >
        <Cover record={record} classes={classes} />

        {/* Context menu - always mounted but fades in on hover */}
        <div className={classes.contextMenu}>
          <AlbumContextMenu record={record} color="white" />
        </div>
      </Link>

      {/* Play button overlay */}
      {!record.missing && (
        <div className={classes.playOverlay}>
          <PlayButton
            className={classes.playButton}
            record={record}
            size={isDesktop ? 'medium' : 'small'}
          />
        </div>
      )}

      {/* Album info */}
      <Link
        className={classes.albumInfo}
        to={linkToRecord(basePath, record.id, 'show')}
      >
        <Typography className={classes.albumName}>
          {record.name}
        </Typography>
        {record.tags?.albumversion && (
          <Typography className={classes.albumVersion}>
            {record.tags.albumversion}
          </Typography>
        )}
      </Link>

      {showArtist ? (
        <ArtistLinkField record={record} className={classes.albumSubtitle} />
      ) : (
        <AlbumDatesField record={record} className={classes.albumSubtitle} />
      )}
    </div>
  )
}

export default AlbumCard
