import React, { useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { IconButton, makeStyles } from '@material-ui/core'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbDownOutlinedIcon from '@material-ui/icons/ThumbDownOutlined'
import { useRecordContext, useDataProvider, useNotify } from 'react-admin'
import subsonic from '../subsonic'

const useStyles = makeStyles({
  thumbUp: {
    color: (props) => (props.active ? '#4caf50' : 'inherit'),
  },
  thumbDown: {
    color: (props) => (props.active ? '#f44336' : 'inherit'),
  },
})

export const ThumbUpButton = ({
  resource = 'song',
  size = 'small',
  className,
  disabled,
  ...rest
}) => {
  const record = useRecordContext(rest) || {}
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const mountedRef = useRef(false)
  const [loading, setLoading] = useState(false)
  const isActive = record?.rating === 5
  const classes = useStyles({ active: isActive })

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleClick = useCallback(
    async (e) => {
      e.stopPropagation()
      const id = record.mediaFileId || record.id
      const newRating = isActive ? 0 : 5
      setLoading(true)
      try {
        await subsonic.setRating(id, newRating)
        await dataProvider.getOne(resource, { id: record.id })
      } catch (err) {
        notify('ra.page.error', 'warning')
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    },
    [record, isActive, dataProvider, resource, notify],
  )

  return (
    <IconButton
      onClick={handleClick}
      size={size}
      className={`${className || ''} ${classes.thumbUp}`}
      disabled={disabled || loading || record?.missing}
    >
      {isActive ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
    </IconButton>
  )
}

ThumbUpButton.propTypes = {
  resource: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}

export const ThumbDownButton = ({
  resource = 'song',
  size = 'small',
  className,
  disabled,
  ...rest
}) => {
  const record = useRecordContext(rest) || {}
  const dataProvider = useDataProvider()
  const notify = useNotify()
  const mountedRef = useRef(false)
  const [loading, setLoading] = useState(false)
  const isActive = record?.rating === 1
  const classes = useStyles({ active: isActive })

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const handleClick = useCallback(
    async (e) => {
      e.stopPropagation()
      const id = record.mediaFileId || record.id
      const newRating = isActive ? 0 : 1
      setLoading(true)
      try {
        await subsonic.setRating(id, newRating)
        await dataProvider.getOne(resource, { id: record.id })
      } catch (err) {
        notify('ra.page.error', 'warning')
      } finally {
        if (mountedRef.current) {
          setLoading(false)
        }
      }
    },
    [record, isActive, dataProvider, resource, notify],
  )

  return (
    <IconButton
      onClick={handleClick}
      size={size}
      className={`${className || ''} ${classes.thumbDown}`}
      disabled={disabled || loading || record?.missing}
    >
      {isActive ? <ThumbDownIcon /> : <ThumbDownOutlinedIcon />}
    </IconButton>
  )
}

ThumbDownButton.propTypes = {
  resource: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
}
