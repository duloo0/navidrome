import React from 'react'
import RadioIcon from '@material-ui/icons/Radio'
import RadioOutlinedIcon from '@material-ui/icons/RadioOutlined'
import ShuffleIcon from '@material-ui/icons/Shuffle'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import MusicNoteIcon from '@material-ui/icons/MusicNote'
import CategoryIcon from '@material-ui/icons/Category'
import DateRangeIcon from '@material-ui/icons/DateRange'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import config from '../config'
import DynamicMenuIcon from '../layout/DynamicMenuIcon'

// Library Radio options - smart weighted radio playback
const libraryRadioLists = {
  // All songs radio - random weighted mix
  all: {
    icon: (
      <DynamicMenuIcon
        path={'libraryRadio/all'}
        icon={RadioOutlinedIcon}
        activeIcon={RadioIcon}
      />
    ),
    params: {},
    description: 'Smart mix of your entire library',
  },
  // Random shuffle
  random: {
    icon: <ShuffleIcon />,
    params: { sort: 'random' },
    description: 'Completely random tracks',
  },
  // Favorites only
  ...(config.enableFavourites && {
    favorites: {
      icon: (
        <DynamicMenuIcon
          path={'libraryRadio/favorites'}
          icon={FavoriteBorderIcon}
          activeIcon={FavoriteIcon}
        />
      ),
      params: { starred: true },
      description: 'Radio from your starred tracks',
    },
  }),
  // Top rated
  ...(config.enableStarRating && {
    topRated: {
      icon: (
        <DynamicMenuIcon
          path={'libraryRadio/topRated'}
          icon={StarBorderIcon}
          activeIcon={StarIcon}
        />
      ),
      params: { minRating: 4 },
      description: 'Highly rated tracks only',
    },
  }),
  // Recently added
  recentlyAdded: {
    icon: <MusicNoteIcon />,
    params: { recentlyAdded: true },
    description: 'Focus on new additions',
  },
  // Most played
  mostPlayed: {
    icon: <TrendingUpIcon />,
    params: { mostPlayed: true },
    description: 'Your most played tracks',
  },
}

// Decade presets for year-based filtering
export const decadePresets = [
  { label: '2020s', fromYear: 2020, toYear: 2029 },
  { label: '2010s', fromYear: 2010, toYear: 2019 },
  { label: '2000s', fromYear: 2000, toYear: 2009 },
  { label: '90s', fromYear: 1990, toYear: 1999 },
  { label: '80s', fromYear: 1980, toYear: 1989 },
  { label: '70s', fromYear: 1970, toYear: 1979 },
  { label: '60s & older', fromYear: 1900, toYear: 1969 },
]

export default libraryRadioLists
