/**
 * Tidal/Roon-inspired CSS overrides for the external audio player
 * Heavy styling for react-jinke-music-player
 */

import { colors, typography, spacing, animations, borders } from './tokens'

const tidalRoonCSS = `
/* Base player container */
.react-jinke-music-player-main {
  font-family: ${typography.fontFamily.primary} !important;
}

/* Mini player bar at bottom */
.react-jinke-music-player {
  background-color: ${colors.background.paper} !important;
  border-top: 1px solid ${colors.border.subtle} !important;
  backdrop-filter: blur(16px) !important;
}

/* Panel/full-screen mode */
.music-player-panel {
  background: linear-gradient(180deg, ${colors.background.elevated} 0%, ${colors.background.default} 100%) !important;
  backdrop-filter: blur(32px) !important;
}

/* Glass effect overlay */
.glass-bg {
  background: ${colors.background.paper} !important;
  opacity: 0.95 !important;
}

/* Album artwork */
.img-content {
  border-radius: ${borders.radius.lg} !important;
  box-shadow: ${borders.shadows.xl} !important;
}

/* Rotating album art (disabled rotation for cleaner look) */
.img-rotate {
  animation: none !important;
  border-radius: ${borders.radius.xl} !important;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6) !important;
}

/* Full screen large album art */
.music-player-panel .img-content {
  width: 300px !important;
  height: 300px !important;
  border-radius: ${borders.radius.xl} !important;
}

@media screen and (min-width: 768px) {
  .music-player-panel .img-content {
    width: 360px !important;
    height: 360px !important;
  }
}

@media screen and (min-width: 1200px) {
  .music-player-panel .img-content {
    width: 420px !important;
    height: 420px !important;
  }
}

/* Song title */
.audio-title,
.music-player-panel .audio-title {
  color: ${colors.text.primary} !important;
  font-weight: ${typography.fontWeight.medium} !important;
  font-size: ${typography.fontSize.base} !important;
}

/* Artist name / subtitle */
.audio-title span,
.music-player-panel .audio-title span {
  color: ${colors.text.secondary} !important;
  font-weight: ${typography.fontWeight.regular} !important;
}

/* Progress bar container */
.progress-bar-content {
  background-color: ${colors.border.subtle} !important;
  border-radius: ${borders.radius.full} !important;
  height: 4px !important;
}

/* Progress bar filled */
.progress-bar-content .progress {
  background-color: ${colors.text.primary} !important;
  border-radius: ${borders.radius.full} !important;
}

/* Progress bar hover state */
.progress-bar-content:hover {
  height: 6px !important;
}

.progress-bar-content:hover .progress {
  background-color: ${colors.accent.cyan} !important;
}

/* Time display */
.current-time,
.duration {
  color: ${colors.text.tertiary} !important;
  font-size: ${typography.fontSize.xs} !important;
  font-family: ${typography.fontFamily.mono} !important;
}

/* Control buttons container */
.player-content {
  gap: ${spacing.sm} !important;
}

/* All control buttons base */
.react-jinke-music-player-main svg,
.music-player-controller svg {
  color: ${colors.text.secondary} !important;
  transition: ${animations.transitions.all.fast} !important;
}

.react-jinke-music-player-main svg:hover,
.music-player-controller svg:hover {
  color: ${colors.text.primary} !important;
}

/* Play/Pause button - emphasized */
.play-btn,
.pause-btn,
.group:first-child button[class*="play"],
.group:first-child button[class*="pause"] {
  width: 56px !important;
  height: 56px !important;
  border-radius: ${borders.radius.full} !important;
  background-color: ${colors.text.primary} !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: ${animations.transitions.all.fast} !important;
  box-shadow: ${borders.shadows.md} !important;
}

.play-btn:hover,
.pause-btn:hover {
  transform: scale(1.05) !important;
  box-shadow: ${borders.shadows.lg} !important;
}

.play-btn svg,
.pause-btn svg {
  color: ${colors.background.default} !important;
  width: 24px !important;
  height: 24px !important;
}

/* Previous/Next buttons */
.prev-btn,
.next-btn,
[class*="prev"],
[class*="next"] {
  width: 40px !important;
  height: 40px !important;
}

/* Secondary control buttons (shuffle, repeat, volume, etc) */
.shuffle-btn,
.order-btn,
.loop-btn,
.lyric-btn,
.reload-btn,
.destroy-btn {
  opacity: 0.7 !important;
  transition: ${animations.transitions.all.fast} !important;
}

.shuffle-btn:hover,
.order-btn:hover,
.loop-btn:hover,
.lyric-btn:hover,
.reload-btn:hover,
.destroy-btn:hover {
  opacity: 1 !important;
}

/* Active state for shuffle/repeat */
.shuffle-btn.active,
.loop-btn.active,
.order-btn.active {
  color: ${colors.accent.cyan} !important;
  opacity: 1 !important;
}

/* Volume controls */
.sound-operation {
  color: ${colors.text.secondary} !important;
}

/* Volume slider */
.rc-slider {
  padding: ${spacing.xs} 0 !important;
}

.rc-slider-rail {
  background-color: ${colors.border.subtle} !important;
  height: 4px !important;
  border-radius: ${borders.radius.full} !important;
}

.rc-slider-track {
  background-color: ${colors.text.primary} !important;
  height: 4px !important;
  border-radius: ${borders.radius.full} !important;
}

.rc-slider-handle {
  width: 12px !important;
  height: 12px !important;
  border: none !important;
  background-color: ${colors.text.primary} !important;
  box-shadow: ${borders.shadows.sm} !important;
  margin-top: -4px !important;
}

.rc-slider-handle:hover,
.rc-slider-handle:active {
  box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.2) !important;
}

/* Playlist/queue panel */
.audio-lists-panel {
  background-color: ${colors.background.elevated} !important;
  border-left: 1px solid ${colors.border.subtle} !important;
  backdrop-filter: blur(16px) !important;
}

.audio-lists-panel-header {
  background-color: ${colors.background.paper} !important;
  border-bottom: 1px solid ${colors.border.subtle} !important;
  color: ${colors.text.primary} !important;
  font-weight: ${typography.fontWeight.semibold} !important;
}

.audio-lists-panel-content {
  background-color: transparent !important;
}

/* Playlist items */
.audio-item {
  background-color: transparent !important;
  border-radius: ${borders.radius.md} !important;
  margin: ${spacing.xxs} ${spacing.sm} !important;
  padding: ${spacing.sm} !important;
  transition: ${animations.transitions.all.fast} !important;
}

.audio-item:hover {
  background-color: ${colors.background.overlay} !important;
}

.audio-item.playing {
  background-color: ${colors.background.overlay} !important;
}

.audio-item .group {
  color: ${colors.text.primary} !important;
}

.audio-item .player-singer {
  color: ${colors.text.secondary} !important;
  font-size: ${typography.fontSize.xs} !important;
}

/* Mobile mini player adjustments */
@media screen and (max-width: 768px) {
  .react-jinke-music-player {
    height: 64px !important;
  }

  .play-btn,
  .pause-btn {
    width: 44px !important;
    height: 44px !important;
  }

  .play-btn svg,
  .pause-btn svg {
    width: 20px !important;
    height: 20px !important;
  }
}

/* Lyrics display */
.lyric-content {
  background: linear-gradient(180deg, rgba(0,0,0,0) 0%, ${colors.background.default} 100%) !important;
}

.lyric-content p {
  color: ${colors.text.secondary} !important;
  font-size: ${typography.fontSize.lg} !important;
  transition: ${animations.transitions.all.normal} !important;
}

.lyric-content p.highlight {
  color: ${colors.text.primary} !important;
  font-size: ${typography.fontSize.xl} !important;
  font-weight: ${typography.fontWeight.medium} !important;
}

/* Hide unnecessary elements for cleaner look */
.react-jinke-music-player-main .loading {
  color: ${colors.text.secondary} !important;
}

/* Tooltips */
.rc-slider-tooltip {
  background-color: ${colors.background.elevated} !important;
  border-radius: ${borders.radius.sm} !important;
  padding: ${spacing.xs} ${spacing.sm} !important;
}

.rc-slider-tooltip-inner {
  background-color: transparent !important;
  color: ${colors.text.primary} !important;
  font-size: ${typography.fontSize.xs} !important;
  box-shadow: none !important;
}

/* Quality badge area (custom addition) */
.audio-quality-badge {
  display: inline-flex !important;
  align-items: center !important;
  padding: 2px 6px !important;
  margin-left: ${spacing.sm} !important;
  font-size: 10px !important;
  font-weight: ${typography.fontWeight.semibold} !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  border-radius: ${borders.radius.xs} !important;
}

.audio-quality-badge.hi-res {
  background-color: rgba(255, 215, 0, 0.2) !important;
  color: ${colors.quality.hiRes} !important;
  border: 1px solid ${colors.quality.hiRes} !important;
}

.audio-quality-badge.lossless {
  background-color: rgba(0, 255, 136, 0.15) !important;
  color: ${colors.quality.lossless} !important;
  border: 1px solid ${colors.quality.lossless} !important;
}

.audio-quality-badge.dsd {
  background-color: rgba(138, 43, 226, 0.2) !important;
  color: ${colors.quality.dsd} !important;
  border: 1px solid ${colors.quality.dsd} !important;
}
`

export default tidalRoonCSS
