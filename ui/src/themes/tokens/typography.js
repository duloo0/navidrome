/**
 * Typography tokens for Tidal/Roon-inspired theme
 * Sophisticated hierarchy with Inter font family
 */

// Font families
export const fontFamily = {
  primary:
    '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", "Fira Code", Consolas, monospace',
}

// Font sizes - rem-based scale
export const fontSize = {
  xs: '0.6875rem', // 11px - Small badges, timestamps
  sm: '0.75rem', // 12px - Quality badges, metadata
  base: '0.8125rem', // 13px - Secondary text
  md: '0.875rem', // 14px - Body text (default)
  lg: '1rem', // 16px - Emphasized body
  xl: '1.125rem', // 18px - Subheadings
  '2xl': '1.25rem', // 20px - Small headings
  '3xl': '1.5rem', // 24px - Section headings
  '4xl': '2rem', // 32px - Page headings
  '5xl': '2.5rem', // 40px - Hero text
  '6xl': '3rem', // 48px - Large hero
}

// Font weights
export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
}

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.2,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
}

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

// Predefined text styles for common use cases
export const textStyles = {
  // Hero/Display text
  hero: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['6xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  // Page headings
  h1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['4xl'],
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  h2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['3xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  h3: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize['2xl'],
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  h4: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.snug,
  },
  // Body text
  body1: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  body2: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  // Small text
  caption: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  overline: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wider,
    textTransform: 'uppercase',
  },
  // Buttons
  button: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none',
  },
  // Code/mono
  code: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.base,
    fontWeight: fontWeight.regular,
  },
}

// Export all typography as a single object
export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  textStyles,
}

export default typography
