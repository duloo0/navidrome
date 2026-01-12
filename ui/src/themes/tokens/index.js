/**
 * Design Token System for Tidal/Roon-inspired theme
 * Centralized exports for all design tokens
 */

import colorsModule from './colors'
import typographyModule from './typography'
import spacingModule from './spacing'
import animationsModule from './animations'
import bordersModule from './borders'

// Re-export colors with flat structure
export const colors = colorsModule

// Re-export typography with flat structure
export const typography = typographyModule

// Flatten spacing for easier access (spacing.sm instead of spacing.named.sm)
export const spacing = {
  ...spacingModule.named,
  xxs: '2px',
  xxl: '48px',
  scale: spacingModule.scale,
  container: spacingModule.container,
}

// Re-export animations
export const animations = animationsModule

// Flatten borders for easier access
export const borders = {
  radius: bordersModule.radius,
  shadows: bordersModule.shadows,
  width: bordersModule.width,
  style: bordersModule.style,
  componentRadius: bordersModule.componentRadius,
}

// Combined tokens object for easy access
export const tokens = {
  colors,
  typography,
  spacing,
  animations,
  borders,
}

export default tokens
