/**
 * Animation tokens for Tidal/Roon-inspired theme
 * Smooth, subtle micro-interactions
 */

// Duration values in milliseconds
export const duration = {
  instant: 0,
  fastest: 100,
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
  slowest: 1000,
}

// Easing functions
export const easing = {
  // Standard Material Design easings
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)', // Entering
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)', // Exiting

  // Custom easings for modern feel
  smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',

  // Linear for specific cases
  linear: 'linear',
}

// Predefined transitions for common use cases
export const transitions = {
  // All properties
  all: {
    fast: `all ${duration.fast}ms ${easing.standard}`,
    normal: `all ${duration.normal}ms ${easing.standard}`,
    slow: `all ${duration.slow}ms ${easing.standard}`,
  },

  // Transform-specific (better performance)
  transform: {
    fast: `transform ${duration.fast}ms ${easing.standard}`,
    normal: `transform ${duration.normal}ms ${easing.standard}`,
    slow: `transform ${duration.slow}ms ${easing.standard}`,
  },

  // Opacity-specific
  opacity: {
    fast: `opacity ${duration.fast}ms ${easing.standard}`,
    normal: `opacity ${duration.normal}ms ${easing.standard}`,
    slow: `opacity ${duration.slow}ms ${easing.standard}`,
  },

  // Background color
  background: {
    fast: `background-color ${duration.fast}ms ${easing.standard}`,
    normal: `background-color ${duration.normal}ms ${easing.standard}`,
  },

  // Color
  color: {
    fast: `color ${duration.fast}ms ${easing.standard}`,
    normal: `color ${duration.normal}ms ${easing.standard}`,
  },

  // Box shadow
  shadow: {
    fast: `box-shadow ${duration.fast}ms ${easing.standard}`,
    normal: `box-shadow ${duration.normal}ms ${easing.standard}`,
  },

  // Combined hover effect (transform + shadow + background)
  hover: `transform ${duration.normal}ms ${easing.standard},
          box-shadow ${duration.normal}ms ${easing.standard},
          background-color ${duration.fast}ms ${easing.standard}`,

  // Fade in/out
  fade: {
    in: `opacity ${duration.normal}ms ${easing.decelerate}`,
    out: `opacity ${duration.fast}ms ${easing.accelerate}`,
  },

  // Scale animations
  scale: {
    in: `transform ${duration.normal}ms ${easing.decelerate}`,
    out: `transform ${duration.fast}ms ${easing.accelerate}`,
    bounce: `transform ${duration.slow}ms ${easing.bounce}`,
  },
}

// Keyframe animation definitions (as strings for use in styled-components)
export const keyframes = {
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `,
  fadeOut: `
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from { transform: scale(0.95); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `,
  slideUp: `
    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `,
  spin: `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `,
}

// Export all animations as a single object
export const animations = {
  duration,
  easing,
  transitions,
  keyframes,
}

export default animations
