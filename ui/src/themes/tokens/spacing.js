/**
 * Spacing tokens for Tidal/Roon-inspired theme
 * 4px base grid system for consistent spacing
 */

// Base unit in pixels
export const baseUnit = 4

// Spacing scale (multiples of 4px)
export const spacing = {
  0: 0,
  0.5: baseUnit * 0.5, // 2px
  1: baseUnit, // 4px
  1.5: baseUnit * 1.5, // 6px
  2: baseUnit * 2, // 8px
  2.5: baseUnit * 2.5, // 10px
  3: baseUnit * 3, // 12px
  3.5: baseUnit * 3.5, // 14px
  4: baseUnit * 4, // 16px
  5: baseUnit * 5, // 20px
  6: baseUnit * 6, // 24px
  7: baseUnit * 7, // 28px
  8: baseUnit * 8, // 32px
  9: baseUnit * 9, // 36px
  10: baseUnit * 10, // 40px
  11: baseUnit * 11, // 44px
  12: baseUnit * 12, // 48px
  14: baseUnit * 14, // 56px
  16: baseUnit * 16, // 64px
  20: baseUnit * 20, // 80px
  24: baseUnit * 24, // 96px
  28: baseUnit * 28, // 112px
  32: baseUnit * 32, // 128px
}

// Named spacing for common use cases
export const named = {
  // Component internal padding
  xs: spacing[1], // 4px
  sm: spacing[2], // 8px
  md: spacing[4], // 16px
  lg: spacing[6], // 24px
  xl: spacing[8], // 32px
  '2xl': spacing[12], // 48px
  '3xl': spacing[16], // 64px

  // Page-level spacing
  pagePadding: spacing[6], // 24px
  pageMaxWidth: 1440,

  // Grid gaps
  gridGapSm: spacing[3], // 12px
  gridGapMd: spacing[4], // 16px
  gridGapLg: spacing[6], // 24px

  // Card spacing
  cardPadding: spacing[4], // 16px
  cardGap: spacing[4], // 16px

  // List item spacing
  listItemPadding: spacing[3], // 12px
  listItemGap: spacing[2], // 8px

  // Inline element spacing
  inlineGap: spacing[2], // 8px
  iconGap: spacing[2], // 8px

  // Section spacing
  sectionGap: spacing[8], // 32px
  sectionPadding: spacing[6], // 24px
}

// Container max widths
export const container = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

// Export all spacing as a single object
export const spacingTokens = {
  baseUnit,
  scale: spacing,
  named,
  container,
}

export default spacingTokens
