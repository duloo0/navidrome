/**
 * Color tokens for Tidal/Roon-inspired theme
 * High-contrast, minimalist palette with rich accent colors for quality indicators
 */

// Primary colors - Clean, minimal accents
export const primary = {
  main: '#FFFFFF',
  light: '#F5F5F5',
  dark: '#E0E0E0',
  contrastText: '#000000',
}

// Secondary colors - Subtle accent for interactions (Roon-inspired cyan)
export const secondary = {
  main: '#00FFFF',
  light: '#80FFFF',
  dark: '#00CCCC',
  contrastText: '#000000',
}

// Background colors - Softer darks for better visibility
export const background = {
  default: '#121212', // Softer dark base (like Spotify)
  paper: '#1E1E1E', // Elevated surfaces
  elevated: '#282828', // Cards, modals, dropdowns
  overlay: '#333333', // Hover states, active states
  surface: '#242424', // Alternative surface color
}

// Text colors - Better readable hierarchy
export const text = {
  primary: '#FFFFFF',
  secondary: 'rgba(255, 255, 255, 0.75)',
  tertiary: 'rgba(255, 255, 255, 0.55)',
  disabled: 'rgba(255, 255, 255, 0.38)',
  hint: 'rgba(255, 255, 255, 0.5)',
}

// Quality badge colors (Roon-inspired)
export const quality = {
  hiRes: '#FFD700', // Gold for Hi-Res (24-bit, >44.1kHz)
  lossless: '#00FF88', // Green for lossless (FLAC, ALAC, WAV)
  mqa: '#FF6B9C', // Pink for MQA (if supported)
  dsd: '#9B59B6', // Purple for DSD
  standard: '#888888', // Gray for standard quality
}

// Accent colors for UI elements
export const accent = {
  primary: '#FFFFFF', // Primary accent (white)
  secondary: '#00FFFF', // Secondary accent (cyan)
  cyan: '#00FFFF', // Tidal/Roon signature cyan
  success: '#00FF88',
  warning: '#FFB800',
  error: '#FF4757',
  info: '#00BFFF',
}

// Interactive state colors - More visible
export const interactive = {
  hover: 'rgba(255, 255, 255, 0.12)',
  active: 'rgba(255, 255, 255, 0.18)',
  focus: 'rgba(0, 255, 255, 0.30)',
  selected: 'rgba(255, 255, 255, 0.22)',
}

// Border colors - More visible
export const border = {
  subtle: 'rgba(255, 255, 255, 0.12)',
  default: 'rgba(255, 255, 255, 0.16)',
  light: 'rgba(255, 255, 255, 0.20)',
  strong: 'rgba(255, 255, 255, 0.32)',
}

// Export all colors as a single object
export const colors = {
  primary,
  secondary,
  background,
  text,
  quality,
  accent,
  interactive,
  border,
}

export default colors
