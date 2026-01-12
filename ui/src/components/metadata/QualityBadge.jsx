import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Tooltip, Typography } from '@material-ui/core'
import clsx from 'clsx'

/**
 * Audio quality detection utilities
 */
const LOSSLESS_FORMATS = ['flac', 'alac', 'wav', 'aiff', 'ape', 'wv', 'tta']
const DSD_FORMATS = ['dsf', 'dff', 'dsd']
const LOSSY_FORMATS = ['mp3', 'aac', 'm4a', 'ogg', 'opus', 'wma']

const isLossless = (suffix) => LOSSLESS_FORMATS.includes(suffix?.toLowerCase())
const isDSD = (suffix) => DSD_FORMATS.includes(suffix?.toLowerCase())
const isLossy = (suffix) => LOSSY_FORMATS.includes(suffix?.toLowerCase())

const isHiRes = (sampleRate, bitDepth) => {
  // Hi-Res is typically defined as >44.1kHz sample rate or >16-bit depth
  return (sampleRate && sampleRate > 44100) || (bitDepth && bitDepth > 16)
}

const formatSampleRate = (sampleRate) => {
  if (!sampleRate) return null
  if (sampleRate >= 1000) {
    return `${(sampleRate / 1000).toFixed(sampleRate % 1000 === 0 ? 0 : 1)}kHz`
  }
  return `${sampleRate}Hz`
}

const formatBitRate = (bitRate) => {
  if (!bitRate) return null
  if (bitRate >= 1000) {
    return `${Math.round(bitRate / 1000)}kbps`
  }
  return `${bitRate}bps`
}

const useStyles = makeStyles(
  (theme) => ({
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 6px',
      fontSize: '10px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      borderRadius: '4px',
      lineHeight: 1.4,
      whiteSpace: 'nowrap',
    },
    hiRes: {
      backgroundColor: 'rgba(255, 215, 0, 0.15)',
      color: '#FFD700',
      border: '1px solid rgba(255, 215, 0, 0.4)',
    },
    lossless: {
      backgroundColor: 'rgba(0, 255, 136, 0.12)',
      color: '#00FF88',
      border: '1px solid rgba(0, 255, 136, 0.35)',
    },
    dsd: {
      backgroundColor: 'rgba(138, 43, 226, 0.15)',
      color: '#BA68C8',
      border: '1px solid rgba(138, 43, 226, 0.4)',
    },
    lossy: {
      backgroundColor: theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.08)',
      color: theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.6)'
        : 'rgba(0, 0, 0, 0.6)',
      border: theme.palette.type === 'dark'
        ? '1px solid rgba(255, 255, 255, 0.15)'
        : '1px solid rgba(0, 0, 0, 0.15)',
    },
    container: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
    },
    specs: {
      fontSize: '10px',
      color: theme.palette.type === 'dark'
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(0, 0, 0, 0.5)',
      fontFamily: 'ui-monospace, SFMono-Regular, SF Mono, Menlo, monospace',
    },
  }),
  { name: 'NDQualityBadge' },
)

/**
 * QualityBadge component displays audio quality indicators
 *
 * @param {Object} props
 * @param {Object} props.record - Media file record with suffix, sampleRate, bitDepth, bitRate
 * @param {boolean} props.showSpecs - Whether to show detailed specs (sample rate, bit depth)
 * @param {string} props.className - Additional CSS class
 * @param {string} props.size - Badge size: 'small' | 'medium' (default: 'medium')
 */
const QualityBadge = ({
  record,
  showSpecs = false,
  className,
  size = 'medium',
}) => {
  const classes = useStyles()

  if (!record) return null

  const { suffix, sampleRate, bitDepth, bitRate } = record
  const hiRes = isHiRes(sampleRate, bitDepth)
  const lossless = isLossless(suffix)
  const dsd = isDSD(suffix)
  const lossy = isLossy(suffix)

  // Determine quality level and styling
  let badgeClass
  let badgeText
  let tooltipText

  if (dsd) {
    badgeClass = classes.dsd
    badgeText = 'DSD'
    tooltipText = `DSD Audio (${suffix?.toUpperCase()})`
  } else if (hiRes && lossless) {
    badgeClass = classes.hiRes
    badgeText = 'Hi-Res'
    tooltipText = `Hi-Res Lossless: ${formatSampleRate(sampleRate)}${bitDepth ? ` / ${bitDepth}-bit` : ''}`
  } else if (hiRes) {
    badgeClass = classes.hiRes
    badgeText = 'Hi-Res'
    tooltipText = `Hi-Res: ${formatSampleRate(sampleRate)}${bitDepth ? ` / ${bitDepth}-bit` : ''}`
  } else if (lossless) {
    badgeClass = classes.lossless
    badgeText = 'Lossless'
    tooltipText = `Lossless: ${suffix?.toUpperCase()}${sampleRate ? ` ${formatSampleRate(sampleRate)}` : ''}${bitDepth ? ` / ${bitDepth}-bit` : ''}`
  } else if (lossy) {
    badgeClass = classes.lossy
    badgeText = suffix?.toUpperCase() || 'Audio'
    tooltipText = `${suffix?.toUpperCase()}${bitRate ? ` @ ${formatBitRate(bitRate)}` : ''}`
  } else {
    // Unknown format, show extension
    badgeClass = classes.lossy
    badgeText = suffix?.toUpperCase() || 'Audio'
    tooltipText = suffix?.toUpperCase() || 'Audio'
  }

  // Build specs string for detailed view
  const specsString = [
    formatSampleRate(sampleRate),
    bitDepth ? `${bitDepth}-bit` : null,
    lossy && bitRate ? formatBitRate(bitRate) : null,
  ].filter(Boolean).join(' / ')

  return (
    <Tooltip title={tooltipText} placement="top">
      <span className={clsx(classes.container, className)}>
        <span className={clsx(classes.badge, badgeClass)}>
          {badgeText}
        </span>
        {showSpecs && specsString && (
          <span className={classes.specs}>
            {specsString}
          </span>
        )}
      </span>
    </Tooltip>
  )
}

/**
 * Simplified quality indicator that just shows the tier
 */
export const QualityTier = ({ record, className }) => {
  const classes = useStyles()

  if (!record) return null

  const { suffix, sampleRate, bitDepth } = record

  if (isDSD(suffix)) {
    return <span className={clsx(classes.badge, classes.dsd, className)}>DSD</span>
  }
  if (isHiRes(sampleRate, bitDepth)) {
    return <span className={clsx(classes.badge, classes.hiRes, className)}>Hi-Res</span>
  }
  if (isLossless(suffix)) {
    return <span className={clsx(classes.badge, classes.lossless, className)}>Lossless</span>
  }
  return null // Don't show anything for lossy
}

/**
 * Format string display (e.g., "FLAC 96kHz/24-bit")
 */
export const FormatDisplay = ({ record, className }) => {
  const classes = useStyles()

  if (!record) return null

  const { suffix, sampleRate, bitDepth, bitRate } = record
  const lossy = isLossy(suffix)

  const parts = [
    suffix?.toUpperCase(),
    formatSampleRate(sampleRate),
    bitDepth ? `${bitDepth}-bit` : null,
    lossy && bitRate ? formatBitRate(bitRate) : null,
  ].filter(Boolean)

  return (
    <Typography
      component="span"
      className={clsx(classes.specs, className)}
      variant="caption"
    >
      {parts.join(' / ')}
    </Typography>
  )
}

export default QualityBadge
