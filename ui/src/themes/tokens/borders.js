/**
 * Border tokens for Tidal/Roon-inspired theme
 * Rounded corners and subtle borders for modern feel
 */

// Border radius values
export const radius = {
  none: '0',
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
}

// Named border radius for common components
export const componentRadius = {
  // Small elements
  badge: radius.sm, // 4px
  chip: radius.full, // pill shape
  tag: radius.sm, // 4px

  // Medium elements
  button: radius.md, // 8px
  input: radius.md, // 8px
  card: radius.lg, // 12px
  menu: radius.lg, // 12px

  // Large elements
  modal: radius.xl, // 16px
  panel: radius.xl, // 16px

  // Special
  avatar: radius.full, // circular
  albumArt: radius.lg, // 12px
  thumbnail: radius.md, // 8px
}

// Border widths
export const width = {
  none: '0',
  thin: '1px',
  medium: '2px',
  thick: '4px',
}

// Border styles
export const style = {
  solid: 'solid',
  dashed: 'dashed',
  dotted: 'dotted',
}

// Predefined borders using color tokens (colors imported separately)
// These use CSS custom properties for dynamic theming
export const borders = {
  none: 'none',
  default: `${width.thin} ${style.solid} rgba(255, 255, 255, 0.08)`,
  light: `${width.thin} ${style.solid} rgba(255, 255, 255, 0.12)`,
  strong: `${width.thin} ${style.solid} rgba(255, 255, 255, 0.24)`,
  focus: `${width.medium} ${style.solid} rgba(0, 255, 255, 0.5)`,
  error: `${width.thin} ${style.solid} #FF4757`,
}

// Box shadow values
export const shadows = {
  none: 'none',

  // Subtle elevations
  xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.3)',
  md: '0 4px 8px rgba(0, 0, 0, 0.3)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.4)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.4)',
  '2xl': '0 16px 32px rgba(0, 0, 0, 0.5)',

  // Card hover effect
  cardHover: '0 12px 32px rgba(0, 0, 0, 0.5)',

  // Album art shadow
  albumArt: '0 8px 24px rgba(0, 0, 0, 0.4)',
  albumArtHover: '0 16px 48px rgba(0, 0, 0, 0.5)',

  // Player shadow
  player: '0 -4px 24px rgba(0, 0, 0, 0.5)',

  // Modal/dialog shadow
  modal: '0 24px 48px rgba(0, 0, 0, 0.6)',

  // Inner shadow (inset)
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',

  // Glow effects
  glow: {
    primary: '0 0 20px rgba(255, 255, 255, 0.15)',
    accent: '0 0 20px rgba(0, 255, 255, 0.25)',
    hiRes: '0 0 12px rgba(255, 215, 0, 0.3)',
  },
}

// Export all borders as a single object
export const borderTokens = {
  radius,
  componentRadius,
  width,
  style,
  borders,
  shadows,
}

export default borderTokens
