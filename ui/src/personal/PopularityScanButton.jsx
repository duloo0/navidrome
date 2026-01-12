import React, { useState } from 'react'
import {
  Button,
  useNotify,
  useTranslate,
} from 'react-admin'
import {
  FormControl,
  FormHelperText,
  CircularProgress,
  Box,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import TrendingUpIcon from '@material-ui/icons/TrendingUp'
import subsonic from '../subsonic'
import config from '../config'

const useStyles = makeStyles({
  formControl: {
    marginTop: '1em',
  },
  button: {
    marginTop: '0.5em',
  },
  progress: {
    marginTop: '0.5em',
    display: 'flex',
    alignItems: 'center',
    gap: '1em',
  },
})

export const PopularityScanButton = () => {
  const [loading, setLoading] = useState(false)
  const notify = useNotify()
  const translate = useTranslate()
  const classes = useStyles()

  const handleClick = async () => {
    setLoading(true)
    try {
      await subsonic.refreshPopularity()
      notify('message.popularityScanStarted', { type: 'info' })
    } catch (error) {
      notify('ra.page.error', { type: 'warning' })
    } finally {
      setLoading(false)
    }
  }

  if (!config.lastFMEnabled || !config.enableExternalServices) {
    return null
  }

  return (
    <FormControl className={classes.formControl}>
      <Button
        onClick={handleClick}
        disabled={loading}
        label={translate('menu.personal.options.scanPopularity')}
        className={classes.button}
        variant="contained"
      >
        {loading ? <CircularProgress size={20} /> : <TrendingUpIcon />}
      </Button>
      <FormHelperText>
        {translate('menu.personal.options.scanPopularityHelper')}
      </FormHelperText>
    </FormControl>
  )
}
