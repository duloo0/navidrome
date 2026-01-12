import React from 'react'
import { Button, useNotify, useTranslate } from 'react-admin'
import { useDispatch } from 'react-redux'
import { IoRadio } from 'react-icons/io5'
import { playTracks } from '../actions'
import subsonic from '../subsonic'
import PropTypes from 'prop-types'

export const LibraryRadioButton = ({ filters }) => {
  const translate = useTranslate()
  const dispatch = useDispatch()
  const notify = useNotify()

  const handleOnClick = () => {
    subsonic
      .getLibraryRadio({
        count: 100,
        ...(filters.genre && { genre: filters.genre }),
      })
      .then((res) => {
        const data = res.json['subsonic-response']
        if (data.status !== 'ok') {
          throw new Error(data.error?.message || 'Unknown error')
        }
        const songs = data.randomSongs?.song || []
        if (!songs.length) {
          notify('message.noSongsFound', { type: 'warning' })
          return
        }
        const songData = {}
        songs.forEach((song) => {
          songData[song.id] = song
        })
        dispatch(playTracks(songData))
      })
      .catch(() => {
        notify('ra.page.error', { type: 'warning' })
      })
  }

  return (
    <Button
      onClick={handleOnClick}
      label={translate('resources.song.actions.libraryRadio')}
    >
      <IoRadio />
    </Button>
  )
}

LibraryRadioButton.propTypes = {
  filters: PropTypes.object,
}

LibraryRadioButton.defaultProps = {
  filters: {},
}
