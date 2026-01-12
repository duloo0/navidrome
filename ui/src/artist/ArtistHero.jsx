import React, { useState, useCallback, useEffect } from 'react'
import { Typography, Collapse, Box, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import Lightbox from 'react-image-lightbox'
import ArtistExternalLinks from './ArtistExternalLink'
import config from '../config'
import { LoveButton, RatingField } from '../common'
import ExpandInfoDialog from '../dialogs/ExpandInfoDialog'
import AlbumInfo from '../album/AlbumInfo'
import subsonic from '../subsonic'

const useStyles = makeStyles(
  (theme) => ({
    // Full-width hero container
    heroContainer: {
      position: 'relative',
      width: '100%',
      minHeight: '320px',
      display: 'flex',
      alignItems: 'flex-end',
      padding: theme.spacing(4),
      paddingTop: theme.spacing(8),
      overflow: 'hidden',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '400px',
        padding: theme.spacing(3),
        paddingTop: theme.spacing(4),
      },
    },
    // Blurred background image
    backgroundBlur: {
      position: 'absolute',
      top: '-20%',
      left: '-10%',
      right: '-10%',
      bottom: '-20%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(60px)',
      opacity: 0.4,
      transform: 'scale(1.2)',
      zIndex: 0,
    },
    // Gradient overlay for readability
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(
        180deg,
        transparent 0%,
        ${theme.palette.background.default}80 50%,
        ${theme.palette.background.default} 100%
      )`,
      zIndex: 1,
    },
    // Content wrapper
    content: {
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      alignItems: 'flex-end',
      gap: theme.spacing(4),
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(3),
      },
    },
    // Artist image container
    imageContainer: {
      flexShrink: 0,
    },
    // Artist image
    artistImage: {
      width: '200px',
      height: '200px',
      borderRadius: '50%',
      objectFit: 'cover',
      cursor: 'pointer',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
      },
      [theme.breakpoints.down('sm')]: {
        width: '160px',
        height: '160px',
      },
    },
    imageLoading: {
      opacity: 0.5,
    },
    // Info section
    infoSection: {
      flex: 1,
      minWidth: 0, // Allow text truncation
      paddingBottom: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        paddingBottom: 0,
      },
    },
    // Artist type label
    typeLabel: {
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    // Artist name
    artistName: {
      fontSize: 'clamp(2rem, 5vw, 4rem)',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(2),
      wordBreak: 'break-word',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    loveButton: {
      marginLeft: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        marginLeft: 0,
      },
    },
    // Rating section
    ratingSection: {
      marginBottom: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    // Biography section
    biographySection: {
      marginTop: theme.spacing(2),
    },
    biographyText: {
      fontSize: '14px',
      lineHeight: 1.7,
      color: theme.palette.text.secondary,
      maxWidth: '800px',
      '& a': {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    },
    biographyToggle: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: theme.spacing(0.5),
      marginTop: theme.spacing(1),
      fontSize: '13px',
      color: theme.palette.text.secondary,
      cursor: 'pointer',
      transition: 'color 0.2s ease',
      '&:hover': {
        color: theme.palette.text.primary,
      },
    },
    // External links
    externalLinks: {
      marginTop: theme.spacing(2),
      display: 'flex',
      gap: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    // Stats section (optional - for album count, etc.)
    statsSection: {
      display: 'flex',
      gap: theme.spacing(4),
      marginTop: theme.spacing(2),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
        gap: theme.spacing(3),
      },
    },
    statItem: {
      textAlign: 'left',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    statValue: {
      fontSize: '20px',
      fontWeight: 600,
      color: theme.palette.text.primary,
      lineHeight: 1.2,
    },
    statLabel: {
      fontSize: '12px',
      color: theme.palette.text.secondary,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  }),
  { name: 'NDArtistHero' },
)

const ArtistHero = ({
  artistInfo,
  record,
  biography,
  albumCount,
  songCount,
}) => {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [isLightboxOpen, setLightboxOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const imageUrl = subsonic.getCoverArtUrl(record, 300)
  const fullImageUrl = subsonic.getCoverArtUrl(record)

  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
  }, [record.id])

  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setImageLoading(false)
    setImageError(true)
  }, [])

  const handleOpenLightbox = useCallback(() => {
    if (!imageError) {
      setLightboxOpen(true)
    }
  }, [imageError])

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const toggleBiography = useCallback(() => {
    setExpanded((prev) => !prev)
  }, [])

  // Check if biography is long enough to need expansion
  const biographyNeedsExpand = biography && biography.length > 300

  return (
    <>
      <div className={classes.heroContainer}>
        {/* Blurred background */}
        {artistInfo && !imageError && (
          <div
            className={classes.backgroundBlur}
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}

        {/* Gradient overlay */}
        <div className={classes.gradientOverlay} />

        {/* Main content */}
        <div className={classes.content}>
          {/* Artist image */}
          <div className={classes.imageContainer}>
            {artistInfo && (
              <img
                key={record.id}
                src={imageUrl}
                alt={record.name}
                className={`${classes.artistImage} ${imageLoading ? classes.imageLoading : ''}`}
                onClick={handleOpenLightbox}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ cursor: imageError ? 'default' : 'pointer' }}
              />
            )}
          </div>

          {/* Info section */}
          <div className={classes.infoSection}>
            <Typography className={classes.typeLabel}>
              Artist
            </Typography>

            <Typography component="h1" className={classes.artistName}>
              {record.name}
              <LoveButton
                className={classes.loveButton}
                record={record}
                resource="artist"
                size="default"
                color="primary"
              />
            </Typography>

            {config.enableStarRating && (
              <div className={classes.ratingSection}>
                <RatingField
                  record={record}
                  resource="artist"
                  size="small"
                />
              </div>
            )}

            {/* Stats */}
            {(albumCount || songCount) && (
              <div className={classes.statsSection}>
                {albumCount > 0 && (
                  <div className={classes.statItem}>
                    <Typography className={classes.statValue}>
                      {albumCount}
                    </Typography>
                    <Typography className={classes.statLabel}>
                      {albumCount === 1 ? 'Album' : 'Albums'}
                    </Typography>
                  </div>
                )}
                {songCount > 0 && (
                  <div className={classes.statItem}>
                    <Typography className={classes.statValue}>
                      {songCount}
                    </Typography>
                    <Typography className={classes.statLabel}>
                      {songCount === 1 ? 'Song' : 'Songs'}
                    </Typography>
                  </div>
                )}
              </div>
            )}

            {/* Biography */}
            {biography && (
              <div className={classes.biographySection}>
                <Collapse
                  in={expanded || !biographyNeedsExpand}
                  collapsedHeight={biographyNeedsExpand ? 72 : 'auto'}
                >
                  <Typography
                    component="div"
                    className={classes.biographyText}
                  >
                    <span dangerouslySetInnerHTML={{ __html: biography }} />
                  </Typography>
                </Collapse>
                {biographyNeedsExpand && (
                  <Typography
                    component="span"
                    className={classes.biographyToggle}
                    onClick={toggleBiography}
                  >
                    {expanded ? (
                      <>
                        Show less <ExpandLessIcon fontSize="small" />
                      </>
                    ) : (
                      <>
                        Read more <ExpandMoreIcon fontSize="small" />
                      </>
                    )}
                  </Typography>
                )}
              </div>
            )}

            {/* External links */}
            {config.enableExternalServices && artistInfo && (
              <div className={classes.externalLinks}>
                <ArtistExternalLinks artistInfo={artistInfo} record={record} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && !imageError && (
        <Lightbox
          imagePadding={50}
          animationDuration={200}
          imageTitle={record.name}
          mainSrc={fullImageUrl}
          onCloseRequest={handleCloseLightbox}
        />
      )}

      <ExpandInfoDialog content={<AlbumInfo />} />
    </>
  )
}

export default ArtistHero
