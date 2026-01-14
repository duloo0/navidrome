import React from 'react'
import {
  GridList,
  GridListTile,
  useMediaQuery,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'
import { useListContext, Loading } from 'react-admin'
import AlbumCard from './AlbumCard'

const useStyles = makeStyles(
  (theme) => ({
    root: {
      padding: theme.spacing(3),
      paddingTop: theme.spacing(2),
      maxWidth: '1800px',
      margin: '0 auto',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(1),
      },
    },
    gridList: {
      // Override GridList default styles for better spacing
      margin: '-8px !important', // Compensate for tile margins
      [theme.breakpoints.up('lg')]: {
        margin: '-12px !important',
      },
    },
    gridListTile: {
      // Remove default tile styling to let AlbumCard handle everything
      overflow: 'visible',
      padding: '8px !important',
      [theme.breakpoints.up('lg')]: {
        padding: '12px !important',
      },
    },
  }),
  { name: 'NDAlbumGridView' },
)

const getColsForWidth = (width) => {
  if (width === 'xs') return 2
  if (width === 'sm') return 3
  if (width === 'md') return 4
  if (width === 'lg') return 5
  return 7 // xl - fewer columns for larger cards
}

const LoadedAlbumGrid = ({ ids, data, basePath, width }) => {
  const classes = useStyles()
  const { filterValues } = useListContext()
  const isArtistView = !!(filterValues && filterValues.artist_id)

  return (
    <div className={classes.root}>
      <GridList
        className={classes.gridList}
        component="div"
        cellHeight="auto"
        cols={getColsForWidth(width)}
        spacing={0}
      >
        {ids.map((id) => (
          <GridListTile className={classes.gridListTile} key={id}>
            <AlbumCard
              record={data[id]}
              basePath={basePath}
              showArtist={!isArtistView}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}

const AlbumGridView = ({ albumListType, loaded, loading, ...props }) => {
  const hide =
    (loading && albumListType === 'random') || !props.data || !props.ids
  return hide ? <Loading /> : <LoadedAlbumGrid {...props} />
}

const AlbumGridViewWithWidth = withWidth()(AlbumGridView)

export default AlbumGridViewWithWidth
