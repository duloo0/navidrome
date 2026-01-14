import { useCallback, useEffect, useState } from 'react'
import {
  Collapse,
  makeStyles,
  Typography,
  useMediaQuery,
  withWidth,
} from '@material-ui/core'
import {
  ArrayField,
  ChipField,
  Link,
  SingleFieldList,
  useRecordContext,
  useTranslate,
} from 'react-admin'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import subsonic from '../subsonic'
import {
  ArtistLinkField,
  CollapsibleComment,
  DurationField,
  formatRange,
  LoveButton,
  RatingField,
  SizeField,
  useAlbumsPerPage,
} from '../common'
import config from '../config'
import { formatFullDate, intersperse } from '../utils'
import AlbumExternalLinks from './AlbumExternalLinks'

const useStyles = makeStyles(
  (theme) => ({
    // Hero container with blurred background
    heroContainer: {
      position: 'relative',
      width: '100%',
      minHeight: '380px',
      display: 'flex',
      alignItems: 'flex-end',
      padding: theme.spacing(4),
      paddingTop: theme.spacing(10),
      overflow: 'hidden',
      borderRadius: 0,
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '450px',
        padding: theme.spacing(3),
        paddingTop: theme.spacing(6),
      },
    },
    // Blurred background image
    backgroundBlur: {
      position: 'absolute',
      top: '-30%',
      left: '-15%',
      right: '-15%',
      bottom: '-30%',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      filter: 'blur(80px)',
      opacity: 0.35,
      transform: 'scale(1.3)',
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
        ${theme.palette.background.default}70 40%,
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
      gap: theme.spacing(5),
      width: '100%',
      maxWidth: '1400px',
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing(3),
      },
    },
    // Cover image container
    coverContainer: {
      flexShrink: 0,
    },
    // Album cover with enhanced shadow
    cover: {
      width: '280px',
      height: '280px',
      borderRadius: '12px',
      objectFit: 'cover',
      cursor: 'pointer',
      boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, opacity 0.3s ease',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: '0 28px 72px rgba(0, 0, 0, 0.6)',
      },
      [theme.breakpoints.down('lg')]: {
        width: '240px',
        height: '240px',
      },
      [theme.breakpoints.down('sm')]: {
        width: '200px',
        height: '200px',
      },
    },
    coverLoading: {
      opacity: 0.5,
    },
    // Info section
    infoSection: {
      flex: 1,
      minWidth: 0,
      paddingBottom: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        width: '100%',
        paddingBottom: 0,
      },
    },
    // Type label
    typeLabel: {
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
    },
    // Album name
    recordName: {
      fontSize: 'clamp(1.75rem, 4vw, 3rem)',
      fontWeight: 700,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(0.5),
      wordBreak: 'break-word',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
        fontSize: 'clamp(1.5rem, 5vw, 2rem)',
      },
    },
    loveButton: {
      marginLeft: theme.spacing(0.5),
    },
    // Album version
    albumVersion: {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1),
      fontStyle: 'italic',
    },
    // Artist name
    recordArtist: {
      fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
      fontWeight: 500,
      color: theme.palette.text.primary,
      marginBottom: theme.spacing(1.5),
      '& a': {
        color: 'inherit',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        '&:hover': {
          color: theme.palette.primary.main,
        },
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.1rem',
      },
    },
    // Meta info (date, songs, duration)
    recordMeta: {
      fontSize: '14px',
      color: theme.palette.text.secondary,
      marginBottom: theme.spacing(1.5),
      display: 'flex',
      flexWrap: 'wrap',
      gap: theme.spacing(0.5),
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    // Rating section
    ratingSection: {
      marginBottom: theme.spacing(1.5),
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'center',
      },
    },
    // Genre list
    genreList: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      '& .MuiChip-root': {
        margin: theme.spacing(0.25),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
      },
      [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
      },
    },
    // External links
    externalLinks: {
      marginTop: theme.spacing(1.5),
    },
    // Notes/description section
    notesSection: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '8px',
      [theme.breakpoints.down('sm')]: {
        marginTop: theme.spacing(3),
        width: '100%',
      },
    },
    notes: {
      display: 'inline-block',
      wordBreak: 'break-word',
      cursor: 'pointer',
      color: theme.palette.text.secondary,
      lineHeight: 1.6,
    },
  }),
  {
    name: 'NDAlbumDetails',
  },
)

const useGetHandleGenreClick = (width) => {
  const [perPage] = useAlbumsPerPage(width)

  return (id) => {
    return `/album?filter={"genre_id":["${id}"]}&order=ASC&sort=name&perPage=${perPage}`
  }
}

const GenreChipField = withWidth()(({ width, ...rest }) => {
  const record = useRecordContext(rest)
  const genreLink = useGetHandleGenreClick(width)

  return (
    <Link to={genreLink(record.id)} onClick={(e) => e.stopPropagation()}>
      <ChipField
        source="name"
        // Workaround to force ChipField to be clickable
        onClick={() => {}}
      />
    </Link>
  )
})

const GenreList = () => {
  const classes = useStyles()
  return (
    <ArrayField className={classes.genreList} source={'genres'}>
      <SingleFieldList linkType={false}>
        <GenreChipField />
      </SingleFieldList>
    </ArrayField>
  )
}

export const Details = (props) => {
  const isXsmall = useMediaQuery((theme) => theme.breakpoints.down('xs'))
  const translate = useTranslate()
  const record = useRecordContext(props)

  // Create an array of detail elements
  let details = []
  const addDetail = (obj) => {
    const id = details.length
    details.push(<span key={`detail-${record.id}-${id}`}>{obj}</span>)
  }

  // Calculate date related fields
  const yearRange = formatRange(record, 'year')
  const date = record.date ? formatFullDate(record.date) : yearRange

  const originalDate = record.originalDate
    ? formatFullDate(record.originalDate)
    : formatRange(record, 'originalYear')
  const releaseDate = record?.releaseDate && formatFullDate(record.releaseDate)

  const dateToUse = originalDate || date
  const isOriginalDate = originalDate && dateToUse !== date
  const showDate = dateToUse && dateToUse !== releaseDate

  // Get label for the main date display
  const getDateLabel = () => {
    if (isXsmall) return '♫'
    if (isOriginalDate) return translate('resources.album.fields.originalDate')
    return null
  }

  // Get label for release date display
  const getReleaseDateLabel = () => {
    if (!isXsmall) return translate('resources.album.fields.releaseDate')
    if (showDate) return '○'
    return null
  }

  // Display dates with appropriate labels
  if (showDate) {
    addDetail(<>{[getDateLabel(), dateToUse].filter(Boolean).join('  ')}</>)
  }

  if (releaseDate) {
    addDetail(
      <>{[getReleaseDateLabel(), releaseDate].filter(Boolean).join('  ')}</>,
    )
  }
  addDetail(
    <>
      {record.songCount +
        ' ' +
        translate('resources.song.name', {
          smart_count: record.songCount,
        })}
    </>,
  )
  !isXsmall && addDetail(<DurationField source={'duration'} />)
  !isXsmall && addDetail(<SizeField source="size" />)

  // Return the details rendered with separators
  return <>{intersperse(details, ' · ')}</>
}

const AlbumDetails = (props) => {
  const record = useRecordContext(props)
  const isXsmall = useMediaQuery((theme) => theme.breakpoints.down('xs'))
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const classes = useStyles()
  const [isLightboxOpen, setLightboxOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [albumInfo, setAlbumInfo] = useState()
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  let notes =
    albumInfo?.notes?.replace(new RegExp('<.*>', 'g'), '') || record.notes

  if (notes !== undefined) {
    notes += '..'
  }

  useEffect(() => {
    subsonic
      .getAlbumInfo(record.id)
      .then((resp) => resp.json['subsonic-response'])
      .then((data) => {
        if (data.status === 'ok') {
          setAlbumInfo(data.albumInfo)
        }
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('error on album page', e)
      })
  }, [record])

  // Reset image state when album changes
  useEffect(() => {
    setImageLoading(true)
    setImageError(false)
  }, [record.id])

  const imageUrl = subsonic.getCoverArtUrl(record, 500)
  const fullImageUrl = subsonic.getCoverArtUrl(record)

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

  const handleCloseLightbox = useCallback(() => setLightboxOpen(false), [])

  return (
    <>
      {/* Hero section with blurred background */}
      <div className={classes.heroContainer}>
        {/* Blurred background */}
        <div
          className={classes.backgroundBlur}
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {/* Gradient overlay */}
        <div className={classes.gradientOverlay} />

        {/* Content */}
        <div className={classes.content}>
          {/* Album cover */}
          <div className={classes.coverContainer}>
            <img
              key={record.id}
              src={imageUrl}
              alt={record.name}
              className={`${classes.cover} ${imageLoading ? classes.coverLoading : ''}`}
              onClick={handleOpenLightbox}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ cursor: imageError ? 'default' : 'pointer' }}
            />
          </div>

          {/* Info section */}
          <div className={classes.infoSection}>
            {/* Type label */}
            <Typography className={classes.typeLabel}>Album</Typography>

            {/* Album name with love button */}
            <Typography className={classes.recordName}>
              {record.name}
              <LoveButton
                className={classes.loveButton}
                record={record}
                resource={'album'}
                size={isDesktop ? 'default' : 'small'}
                aria-label="love"
                color="primary"
              />
            </Typography>

            {/* Album version if present */}
            {record?.tags?.['albumversion'] && (
              <Typography className={classes.albumVersion}>
                {record.tags['albumversion']}
              </Typography>
            )}

            {/* Artist name */}
            <Typography className={classes.recordArtist}>
              <ArtistLinkField record={record} />
            </Typography>

            {/* Meta info */}
            <Typography component={'div'} className={classes.recordMeta}>
              <Details />
            </Typography>

            {/* Rating */}
            {config.enableStarRating && (
              <div className={classes.ratingSection}>
                <RatingField
                  record={record}
                  resource={'album'}
                  size={isDesktop ? 'medium' : 'small'}
                />
              </div>
            )}

            {/* Genres */}
            {isDesktop ? (
              <GenreList />
            ) : (
              record.genre && (
                <Typography component={'p'} className={classes.recordMeta}>
                  {record.genre}
                </Typography>
              )
            )}

            {/* External links */}
            {!isXsmall && config.enableExternalServices && (
              <AlbumExternalLinks className={classes.externalLinks} />
            )}
          </div>
        </div>
      </div>

      {/* Notes section - outside hero */}
      {notes && (
        <div className={classes.notesSection}>
          <Collapse
            collapsedHeight={isDesktop ? '3em' : '2em'}
            in={expanded}
            timeout={'auto'}
          >
            <Typography
              variant={'body2'}
              className={classes.notes}
              onClick={() => setExpanded(!expanded)}
            >
              <span dangerouslySetInnerHTML={{ __html: notes }} />
            </Typography>
          </Collapse>
        </div>
      )}

      {/* Comment section */}
      {record['comment'] && <CollapsibleComment record={record} />}

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
    </>
  )
}

export default AlbumDetails
