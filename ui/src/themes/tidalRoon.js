/**
 * Tidal/Roon-inspired theme for Navidrome
 * Minimalist, high-contrast design with rich metadata display
 */

import { colors, typography, spacing, animations, borders } from './tokens'

// Accent colors
const accent = {
  primary: colors.accent.primary,
  secondary: colors.accent.secondary,
  cyan: colors.accent.cyan,
}

// Shared action bar styles for album/playlist/artist views
const musicListActions = {
  padding: `${spacing.lg} 0`,
  alignItems: 'center',
  '@global': {
    button: {
      border: `1px solid ${colors.border.subtle}`,
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      borderRadius: borders.radius.full,
      transition: animations.transitions.all.fast,
      '&:hover': {
        border: `1px solid ${colors.text.primary}`,
        backgroundColor: `${colors.background.overlay} !important`,
        color: colors.text.primary,
      },
    },
    // Primary play button (first button)
    'button:first-child:not(:only-child)': {
      '@media screen and (max-width: 720px)': {
        transform: 'scale(1.5)',
        margin: spacing.md,
        '&:hover': {
          transform: 'scale(1.6) !important',
        },
      },
      transform: 'scale(2)',
      margin: spacing.lg,
      minWidth: 0,
      padding: spacing.xs,
      transition: `transform ${animations.duration.normal} ${animations.easing.smooth}`,
      background: colors.text.primary,
      color: colors.background.default,
      borderRadius: borders.radius.full,
      border: 0,
      '&:hover': {
        transform: 'scale(2.1)',
        backgroundColor: `${colors.text.primary} !important`,
        border: 0,
      },
    },
    'button:only-child': {
      margin: spacing.lg,
    },
    'button:first-child>span:first-child': {
      padding: 0,
    },
    'button:first-child>span:first-child>span': {
      display: 'none',
    },
    'button>span:first-child>span, button:not(:first-child)>span:first-child>svg': {
      color: colors.text.secondary,
    },
  },
}

export default {
  themeName: 'Tidal/Roon',
  typography: {
    fontFamily: typography.fontFamily.primary,
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      letterSpacing: typography.letterSpacing.tight,
      lineHeight: typography.lineHeight.tight,
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.semibold,
      letterSpacing: typography.letterSpacing.tight,
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
    },
    h4: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.medium,
    },
    h5: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.medium,
    },
    h6: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
    },
    body1: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.normal,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    caption: {
      fontSize: typography.fontSize.xs,
      color: colors.text.tertiary,
      textTransform: 'uppercase',
      letterSpacing: typography.letterSpacing.wide,
    },
  },
  palette: {
    primary: {
      light: accent.cyan,
      main: accent.primary,
      dark: colors.background.elevated,
      contrastText: colors.background.default,
    },
    secondary: {
      main: accent.cyan,
      contrastText: colors.background.default,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
    },
    type: 'dark',
  },
  overrides: {
    // Global MUI overrides
    MuiCssBaseline: {
      '@global': {
        '*': {
          scrollbarWidth: 'thin',
          scrollbarColor: `${colors.border.subtle} transparent`,
        },
        '*::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '*::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: colors.border.subtle,
          borderRadius: borders.radius.full,
          '&:hover': {
            backgroundColor: colors.border.default,
          },
        },
      },
    },
    MuiFormGroup: {
      root: {
        color: accent.primary,
      },
    },
    MuiMenuItem: {
      root: {
        fontSize: typography.fontSize.sm,
        borderRadius: borders.radius.sm,
        margin: `0 ${spacing.xs}`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          backgroundColor: colors.background.overlay,
        },
      },
    },
    MuiDivider: {
      root: {
        margin: `${spacing.md} 0`,
        backgroundColor: colors.border.subtle,
      },
    },
    MuiButton: {
      root: {
        background: colors.text.primary,
        color: `${colors.background.default} !important`,
        border: '1px solid transparent',
        borderRadius: borders.radius.full,
        fontWeight: typography.fontWeight.medium,
        textTransform: 'none',
        padding: `${spacing.sm} ${spacing.lg}`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          background: `${colors.text.secondary} !important`,
        },
        '& .MuiButton-label': {
          color: `${colors.background.default} !important`,
        },
      },
      outlined: {
        border: `1px solid ${colors.border.default}`,
        background: 'transparent',
        color: `${colors.text.primary} !important`,
        '&:hover': {
          border: `1px solid ${colors.text.primary} !important`,
          background: `${colors.background.overlay} !important`,
        },
        '& .MuiButton-label': {
          color: `${colors.text.primary} !important`,
        },
      },
      text: {
        background: 'transparent',
        color: `${colors.text.primary} !important`,
        border: `1px solid ${colors.border.subtle}`,
        '&:hover': {
          background: `${colors.background.overlay} !important`,
          border: `1px solid ${colors.border.default}`,
        },
        '& .MuiButton-label': {
          color: `${colors.text.primary} !important`,
        },
      },
      textSecondary: {
        border: `1px solid ${colors.border.default}`,
        background: 'transparent',
        color: `${colors.text.primary} !important`,
        '&:hover': {
          border: `1px solid ${colors.text.primary} !important`,
          background: `${colors.background.overlay} !important`,
        },
        '& .MuiButton-label': {
          color: `${colors.text.primary} !important`,
        },
      },
      label: {
        color: 'inherit !important',
        paddingRight: spacing.md,
        paddingLeft: spacing.sm,
      },
    },
    MuiIconButton: {
      root: {
        color: `${colors.text.primary} !important`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          backgroundColor: `${colors.background.overlay} !important`,
        },
      },
      colorSecondary: {
        color: `${colors.text.secondary} !important`,
        '&:hover': {
          color: `${colors.text.primary} !important`,
        },
      },
    },
    MuiDrawer: {
      root: {
        background: colors.background.default,
      },
      paper: {
        backgroundColor: colors.background.default,
        borderRight: `1px solid ${colors.border.subtle}`,
        transition: `width ${animations.duration.normal} ${animations.easing.smooth} !important`,
      },
      paperAnchorDockedLeft: {
        borderRight: `1px solid ${colors.border.subtle}`,
      },
    },
    // Collapsed sidebar adjustments
    MuiCollapse: {
      root: {
        transition: `height ${animations.duration.normal} ${animations.easing.smooth}`,
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: colors.background.paper,
      },
      rounded: {
        borderRadius: borders.radius.lg,
      },
      elevation1: {
        boxShadow: borders.shadows.sm,
      },
      elevation2: {
        boxShadow: borders.shadows.md,
      },
      elevation3: {
        boxShadow: borders.shadows.lg,
      },
    },
    MuiCard: {
      root: {
        backgroundColor: colors.background.elevated,
        borderRadius: borders.radius.lg,
        transition: animations.transitions.all.normal,
        '&:hover': {
          backgroundColor: colors.background.overlay,
        },
      },
    },
    MuiTableRow: {
      root: {
        padding: `${spacing.sm} 0`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          backgroundColor: `${colors.background.overlay} !important`,
        },
        '@global': {
          'td:nth-child(4)': {
            color: `${colors.text.primary} !important`,
          },
        },
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${colors.border.subtle}`,
        padding: `${spacing.sm} !important`,
        color: `${colors.text.secondary} !important`,
      },
      head: {
        borderBottom: `1px solid ${colors.border.default}`,
        fontSize: typography.fontSize.xs,
        textTransform: 'uppercase',
        letterSpacing: typography.letterSpacing.wide,
        fontWeight: typography.fontWeight.medium,
        color: `${colors.text.tertiary} !important`,
      },
    },
    MuiAppBar: {
      positionFixed: {
        backgroundColor: `${colors.background.paper} !important`,
        boxShadow: 'none',
        borderBottom: `1px solid ${colors.border.default}`,
        backdropFilter: 'blur(12px)',
      },
      colorDefault: {
        backgroundColor: `${colors.background.paper} !important`,
        color: colors.text.primary,
      },
    },
    MuiToolbar: {
      root: {
        '& .MuiIconButton-root': {
          color: `${colors.text.primary} !important`,
          '&:hover': {
            backgroundColor: `${colors.background.overlay} !important`,
          },
        },
        '& .MuiSvgIcon-root': {
          color: `${colors.text.primary} !important`,
        },
        '& .MuiTypography-root': {
          color: `${colors.text.primary} !important`,
        },
        '& .MuiTypography-h6': {
          color: `${colors.text.primary} !important`,
          fontWeight: typography.fontWeight.semibold,
        },
      },
    },
    MuiTypography: {
      colorTextSecondary: {
        color: `${colors.text.secondary} !important`,
      },
    },
    MuiChip: {
      root: {
        backgroundColor: colors.background.overlay,
        color: colors.text.secondary,
        borderRadius: borders.radius.sm,
        fontWeight: typography.fontWeight.medium,
        fontSize: typography.fontSize.xs,
        '&:hover': {
          backgroundColor: colors.border.subtle,
        },
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: colors.background.elevated,
        color: colors.text.primary,
        fontSize: typography.fontSize.xs,
        borderRadius: borders.radius.sm,
        boxShadow: borders.shadows.md,
      },
    },
    MuiDialog: {
      paper: {
        backgroundColor: colors.background.elevated,
        borderRadius: borders.radius.xl,
        boxShadow: borders.shadows.xl,
      },
    },
    MuiSlider: {
      root: {
        color: colors.text.primary,
      },
      thumb: {
        width: 12,
        height: 12,
        '&:hover': {
          boxShadow: `0 0 0 8px ${colors.background.overlay}`,
        },
      },
      track: {
        height: 4,
        borderRadius: borders.radius.full,
      },
      rail: {
        height: 4,
        borderRadius: borders.radius.full,
        backgroundColor: colors.border.subtle,
      },
    },

    // Navidrome custom component overrides
    NDAlbumGridView: {
      albumName: {
        marginTop: spacing.sm,
        fontWeight: typography.fontWeight.semibold,
        textTransform: 'none',
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        lineHeight: typography.lineHeight.tight,
      },
      albumSubtitle: {
        color: colors.text.secondary,
        fontSize: typography.fontSize.xs,
        marginTop: spacing.xxs,
      },
      albumContainer: {
        backgroundColor: colors.background.elevated,
        borderRadius: borders.radius.lg,
        padding: spacing.sm,
        transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
        '&:hover': {
          backgroundColor: colors.background.overlay,
          transform: 'translateY(-4px)',
          boxShadow: borders.shadows.lg,
        },
      },
      albumPlayButton: {
        backgroundColor: colors.text.primary,
        borderRadius: borders.radius.full,
        boxShadow: borders.shadows.md,
        padding: spacing.xs,
        transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
        opacity: 0,
        transform: 'scale(0.9) translateY(8px)',
        '&:hover': {
          background: `${colors.text.primary} !important`,
          transform: 'scale(1.05)',
        },
      },
      // Show play button on container hover
      '@global': {
        '.album-container:hover .album-play-button': {
          opacity: 1,
          transform: 'scale(1) translateY(0)',
        },
      },
    },
    NDPlaylistDetails: {
      container: {
        background: `linear-gradient(180deg, ${colors.background.elevated} 0%, transparent 100%)`,
        borderRadius: 0,
        paddingTop: `${spacing.xxl} !important`,
        boxShadow: 'none',
      },
      title: {
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        fontWeight: typography.fontWeight.bold,
        color: colors.text.primary,
        letterSpacing: typography.letterSpacing.tight,
      },
      details: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
      },
    },
    NDAlbumDetails: {
      root: {
        background: `linear-gradient(180deg, ${colors.background.elevated} 0%, transparent 100%)`,
        borderRadius: 0,
        boxShadow: 'none',
      },
      cardContents: {
        alignItems: 'flex-end',
        paddingTop: spacing.xl,
      },
      recordName: {
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        fontWeight: typography.fontWeight.bold,
        letterSpacing: typography.letterSpacing.tight,
      },
      recordArtist: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
      },
      recordMeta: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
      },
    },
    NDCollapsibleComment: {
      commentBlock: {
        fontSize: typography.fontSize.sm,
        color: colors.text.secondary,
        lineHeight: typography.lineHeight.relaxed,
      },
    },
    NDAlbumShow: {
      albumActions: musicListActions,
    },
    NDPlaylistShow: {
      playlistActions: musicListActions,
    },
    NDArtistShow: {
      actions: {
        padding: `${spacing.xl} 0`,
        alignItems: 'center',
        overflow: 'visible',
        minHeight: '120px',
        '@global': {
          button: {
            border: `1px solid ${colors.border.subtle}`,
            backgroundColor: 'transparent',
            color: colors.text.secondary,
            margin: `0 ${spacing.sm}`,
            borderRadius: borders.radius.full,
            transition: animations.transitions.all.fast,
            '&:hover': {
              border: `1px solid ${colors.text.primary}`,
              backgroundColor: `${colors.background.overlay} !important`,
              color: colors.text.primary,
            },
          },
          // Hide shuffle button label
          'button:first-child>span:first-child>span': {
            display: 'none',
          },
          // Style shuffle button (first button)
          'button:first-child': {
            '@media screen and (max-width: 720px)': {
              transform: 'scale(1.5)',
              margin: spacing.md,
              '&:hover': {
                transform: 'scale(1.6) !important',
              },
            },
            transform: 'scale(2)',
            margin: spacing.lg,
            minWidth: 0,
            padding: spacing.xs,
            transition: `transform ${animations.duration.normal} ${animations.easing.smooth}`,
            background: colors.text.primary,
            color: colors.background.default,
            borderRadius: borders.radius.full,
            border: 0,
            '&:hover': {
              transform: 'scale(2.1)',
              backgroundColor: `${colors.text.primary} !important`,
              border: 0,
            },
          },
          'button:first-child>span:first-child': {
            padding: 0,
          },
          'button>span:first-child>span, button:not(:first-child)>span:first-child>svg': {
            color: colors.text.secondary,
          },
        },
      },
      actionsContainer: {
        overflow: 'visible',
      },
    },
    NDAudioPlayer: {
      audioTitle: {
        color: colors.text.primary,
        fontSize: typography.fontSize.sm,
        textDecoration: 'none',
        '&:hover': {
          color: colors.accent.cyan,
        },
      },
      songTitle: {
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
      },
      songInfo: {
        fontSize: typography.fontSize.xs,
        color: colors.text.secondary,
        marginTop: spacing.xxs,
      },
      songAlbum: {
        fontStyle: 'normal',
        color: colors.text.tertiary,
      },
      qualityInfo: {
        marginTop: spacing.xxs,
        opacity: 1,
        '& span': {
          fontSize: typography.fontSize.xs,
          padding: `${spacing.xxs} ${spacing.xs}`,
          borderRadius: borders.radius.xs,
          backgroundColor: colors.background.overlay,
          color: colors.text.secondary,
        },
      },
      player: {
        // Base player styling
        '& .react-jinke-music-player-main': {
          fontFamily: `${typography.fontFamily.primary} !important`,
        },
        // Mini player bar - enhanced styling
        '& .react-jinke-music-player': {
          backgroundColor: `${colors.background.paper} !important`,
          borderTop: `1px solid ${colors.border.subtle} !important`,
          backdropFilter: 'blur(20px) !important',
          transition: `${animations.transitions.all.normal} !important`,
        },
        // Mini player album art
        '& .react-jinke-music-player .img-content': {
          borderRadius: `${borders.radius.md} !important`,
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4) !important',
          transition: `${animations.transitions.all.normal} !important`,
          cursor: 'pointer !important',
          '&:hover': {
            transform: 'scale(1.05) !important',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5) !important',
          },
        },
        // Full-screen panel
        '& .music-player-panel': {
          background: `linear-gradient(180deg, ${colors.background.elevated} 0%, ${colors.background.default} 100%) !important`,
        },
        // Album artwork in panel
        '& .music-player-panel .img-content': {
          width: '300px !important',
          height: '300px !important',
          borderRadius: `${borders.radius.xl} !important`,
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6) !important',
        },
        // Song title in mini player
        '& .audio-title': {
          color: `${colors.text.primary} !important`,
          fontWeight: `${typography.fontWeight.medium} !important`,
          transition: `color ${animations.duration.fast} ease !important`,
          '&:hover': {
            color: `${colors.accent.cyan} !important`,
          },
        },
        // Progress bar - enhanced with hover expand
        '& .progress-bar-content': {
          backgroundColor: `${colors.border.subtle} !important`,
          borderRadius: `${borders.radius.full} !important`,
          height: '4px !important',
          transition: 'height 150ms ease !important',
          '&:hover': {
            height: '6px !important',
          },
        },
        '& .progress-bar-content .progress': {
          backgroundColor: `${colors.text.primary} !important`,
          borderRadius: `${borders.radius.full} !important`,
          transition: 'background-color 150ms ease !important',
        },
        '& .progress-bar-content:hover .progress': {
          backgroundColor: `${colors.accent.cyan} !important`,
        },
        // Progress bar thumb
        '& .progress-bar-content .progress-load-bar': {
          backgroundColor: 'rgba(255, 255, 255, 0.1) !important',
        },
        // Time display
        '& .current-time, & .duration': {
          color: `${colors.text.tertiary} !important`,
          fontSize: `${typography.fontSize.xs} !important`,
          fontFamily: `${typography.fontFamily.mono} !important`,
          letterSpacing: '0.03em !important',
        },
        // Control buttons
        '& .react-jinke-music-player-main svg': {
          color: `${colors.text.secondary} !important`,
          transition: `all ${animations.duration.fast} ease !important`,
        },
        '& .react-jinke-music-player-main svg:hover': {
          color: `${colors.text.primary} !important`,
          transform: 'scale(1.1) !important',
        },
        // Skip buttons
        '& .prev-audio, & .next-audio': {
          opacity: '0.8 !important',
          transition: `all ${animations.duration.fast} ease !important`,
          '&:hover': {
            opacity: '1 !important',
          },
        },
        // Play/Pause button - enhanced
        '& .play-btn, & .pause-btn': {
          width: '52px !important',
          height: '52px !important',
          borderRadius: `${borders.radius.full} !important`,
          backgroundColor: `${colors.text.primary} !important`,
          boxShadow: '0 4px 20px rgba(255, 255, 255, 0.15) !important',
          transition: `all ${animations.duration.normal} ${animations.easing.smooth} !important`,
        },
        '& .play-btn:hover, & .pause-btn:hover': {
          transform: 'scale(1.08) !important',
          boxShadow: '0 6px 28px rgba(255, 255, 255, 0.25) !important',
        },
        '& .play-btn:active, & .pause-btn:active': {
          transform: 'scale(0.98) !important',
        },
        '& .play-btn svg, & .pause-btn svg': {
          color: `${colors.background.default} !important`,
        },
        // Volume control
        '& .sound-operation': {
          transition: `opacity ${animations.duration.fast} ease !important`,
        },
        '& .rc-slider': {
          transition: `all ${animations.duration.fast} ease !important`,
        },
        '& .rc-slider-rail': {
          backgroundColor: `${colors.border.subtle} !important`,
          borderRadius: `${borders.radius.full} !important`,
        },
        '& .rc-slider-track': {
          backgroundColor: `${colors.text.primary} !important`,
          borderRadius: `${borders.radius.full} !important`,
        },
        '& .rc-slider-handle': {
          backgroundColor: `${colors.text.primary} !important`,
          border: 'none !important',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3) !important',
          transition: `transform ${animations.duration.fast} ease !important`,
          '&:hover': {
            transform: 'scale(1.2) !important',
          },
        },
        // Playlist/Queue panel - enhanced
        '& .audio-lists-panel': {
          backgroundColor: `${colors.background.elevated} !important`,
          borderLeft: `1px solid ${colors.border.subtle} !important`,
          backdropFilter: 'blur(20px) !important',
        },
        '& .audio-lists-panel-header': {
          backgroundColor: `${colors.background.paper} !important`,
          color: `${colors.text.primary} !important`,
          borderBottom: `1px solid ${colors.border.subtle} !important`,
          padding: `${spacing.md} !important`,
        },
        '& .audio-lists-panel-header-title': {
          fontSize: `${typography.fontSize.sm} !important`,
          fontWeight: `${typography.fontWeight.semibold} !important`,
          textTransform: 'uppercase !important',
          letterSpacing: '0.05em !important',
        },
        // Queue items
        '& .audio-item': {
          borderRadius: `${borders.radius.md} !important`,
          transition: `all ${animations.duration.fast} ease !important`,
          margin: `${spacing.xxs} ${spacing.sm} !important`,
          padding: `${spacing.sm} !important`,
        },
        '& .audio-item:hover': {
          backgroundColor: `${colors.background.overlay} !important`,
          transform: 'translateX(4px) !important',
        },
        '& .audio-item.playing': {
          backgroundColor: `${colors.background.overlay} !important`,
          borderLeft: `3px solid ${colors.accent.cyan} !important`,
        },
        '& .audio-item .player-singer': {
          color: `${colors.text.secondary} !important`,
          fontSize: `${typography.fontSize.xs} !important`,
        },
        // Active states for shuffle/repeat
        '& .shuffle-btn, & .loop-btn': {
          transition: `all ${animations.duration.fast} ease !important`,
        },
        '& .shuffle-btn.active, & .loop-btn.active': {
          color: `${colors.accent.cyan} !important`,
        },
        '& .shuffle-btn.active svg, & .loop-btn.active svg': {
          color: `${colors.accent.cyan} !important`,
          filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.4)) !important',
        },
        // Toolbar buttons (love, thumbs, save)
        '& .item': {
          '& .MuiIconButton-root': {
            color: `${colors.text.secondary} !important`,
            transition: `all ${animations.duration.fast} ease !important`,
            '&:hover': {
              color: `${colors.text.primary} !important`,
              backgroundColor: `${colors.background.overlay} !important`,
              transform: 'scale(1.1) !important',
            },
          },
          '& svg': {
            fontSize: '1.25rem',
          },
        },
        // Loved state
        '& .loved svg, & .MuiIconButton-root.loved svg': {
          color: `${colors.accent.error} !important`,
          filter: 'drop-shadow(0 0 4px rgba(255, 71, 87, 0.4)) !important',
        },
        // Destroy/close button
        '& .destroy-btn': {
          opacity: '0.6 !important',
          transition: `all ${animations.duration.fast} ease !important`,
          '&:hover': {
            opacity: '1 !important',
            color: `${colors.accent.error} !important`,
          },
        },
        // Mobile adjustments
        '@media screen and (max-width: 768px)': {
          '& .play-btn, & .pause-btn': {
            width: '44px !important',
            height: '44px !important',
          },
          '& .react-jinke-music-player .img-content': {
            borderRadius: `${borders.radius.sm} !important`,
          },
        },
        '@media screen and (min-width: 768px)': {
          '& .music-player-panel .img-content': {
            width: '360px !important',
            height: '360px !important',
          },
        },
        '@media screen and (min-width: 1200px)': {
          '& .music-player-panel .img-content': {
            width: '420px !important',
            height: '420px !important',
          },
        },
      },
    },
    NDLogin: {
      main: {
        background: colors.background.default,
        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, .85)',
      },
      systemNameLink: {
        color: colors.text.primary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize['2xl'],
      },
      card: {
        backgroundColor: colors.background.elevated,
        border: `1px solid ${colors.border.subtle}`,
        borderRadius: borders.radius.xl,
        boxShadow: borders.shadows.xl,
      },
      avatar: {
        marginBottom: spacing.md,
      },
    },
    NDAppBar: {
      root: {
        color: `${colors.text.secondary} !important`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          color: `${colors.text.primary} !important`,
        },
      },
      active: {
        color: `${colors.text.primary} !important`,
      },
      icon: {
        color: 'inherit',
      },
    },

    // React Admin overrides
    RaLayout: {
      content: {
        padding: '0 !important',
        background: `linear-gradient(180deg, ${colors.background.paper} 0%, ${colors.background.default} 100%)`,
        minHeight: '100vh',
        overflow: 'visible',
      },
    },
    RaList: {
      content: {
        backgroundColor: 'transparent',
        overflow: 'visible',
      },
      main: {
        marginTop: 0,
        overflow: 'visible',
      },
    },
    RaShow: {
      main: {
        marginTop: 0,
      },
      card: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
      },
    },
    RaListToolbar: {
      toolbar: {
        padding: `${spacing.sm} ${spacing.md} !important`,
        overflow: 'visible',
        flexWrap: 'wrap',
        gap: spacing.sm,
      },
    },
    RaSearchInput: {
      input: {
        paddingLeft: spacing.md,
        border: 0,
        '& .MuiInputBase-root': {
          backgroundColor: `${colors.background.overlay} !important`,
          borderRadius: `${borders.radius.full} !important`,
          color: colors.text.primary,
          border: `1px solid ${colors.border.subtle}`,
          transition: animations.transitions.all.fast,
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover': {
            borderColor: colors.border.default,
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
          },
          '&.Mui-focused': {
            borderColor: colors.text.primary,
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
          '& svg': {
            color: `${colors.text.secondary} !important`,
          },
          '& .MuiOutlinedInput-input:-webkit-autofill': {
            borderRadius: `${borders.radius.full} 0 0 ${borders.radius.full}`,
            '-webkit-box-shadow': `0 0 0 100px ${colors.background.overlay} inset`,
            '-webkit-text-fill-color': colors.text.primary,
          },
        },
      },
    },
    RaFilter: {
      form: {
        overflow: 'visible',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.sm,
        '& .MuiOutlinedInput-input:-webkit-autofill': {
          '-webkit-box-shadow': `0 0 0 100px ${colors.background.overlay} inset`,
          '-webkit-text-fill-color': colors.text.primary,
        },
      },
    },
    RaFilterButton: {
      root: {
        marginRight: spacing.sm,
        overflow: 'visible',
      },
    },
    RaFilterForm: {
      form: {
        overflow: 'visible',
        flexWrap: 'wrap',
      },
    },
    RaButton: {
      button: {
        margin: `0 ${spacing.xs} 0 ${spacing.xs}`,
      },
    },
    RaPaginationActions: {
      currentPageButton: {
        border: `1px solid ${colors.text.primary}`,
        color: colors.text.primary,
      },
      button: {
        backgroundColor: 'transparent',
        minWidth: 48,
        margin: `0 ${spacing.xxs}`,
        border: `1px solid ${colors.border.subtle}`,
        color: colors.text.secondary,
        borderRadius: borders.radius.sm,
        transition: animations.transitions.all.fast,
        '&:hover': {
          backgroundColor: colors.background.overlay,
          borderColor: colors.border.default,
        },
        '@global': {
          '> .MuiButton-label': {
            padding: 0,
          },
        },
      },
      actions: {
        '@global': {
          '.next-page': {
            marginLeft: spacing.sm,
            marginRight: spacing.sm,
          },
          '.previous-page': {
            marginRight: spacing.sm,
          },
        },
      },
    },
    RaSidebar: {
      root: {
        height: 'initial',
      },
      drawerPaper: {
        backgroundColor: `${colors.background.default} !important`,
        borderRight: `1px solid ${colors.border.subtle}`,
        width: 260,
        paddingTop: spacing.md,
        '& > div': {
          paddingBottom: '120px', // Space for now playing mini
        },
      },
      fixed: {
        position: 'relative',
      },
    },
    RaMenuItemLink: {
      root: {
        color: colors.text.secondary,
        borderRadius: borders.radius.md,
        marginLeft: spacing.sm,
        marginRight: spacing.sm,
        marginBottom: spacing.xxs,
        padding: `${spacing.sm} ${spacing.md}`,
        transition: animations.transitions.all.fast,
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.regular,
        '&:hover': {
          backgroundColor: colors.background.overlay,
          color: colors.text.primary,
        },
      },
      active: {
        backgroundColor: `${colors.background.overlay} !important`,
        color: `${colors.text.primary} !important`,
        fontWeight: typography.fontWeight.medium,
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '25%',
          bottom: '25%',
          width: 3,
          backgroundColor: colors.accent.cyan,
          borderRadius: borders.radius.full,
        },
      },
      icon: {
        color: 'inherit',
        minWidth: 36,
        '& svg': {
          fontSize: '1.25rem',
        },
      },
    },
    // Navidrome SubMenu styling
    NDSubMenu: {
      icon: {
        color: colors.text.secondary,
        minWidth: 36,
        '& svg': {
          fontSize: '1.25rem',
        },
      },
      menuHeader: {
        borderRadius: borders.radius.md,
        marginLeft: spacing.sm,
        marginRight: spacing.sm,
        marginBottom: spacing.xxs,
        padding: `${spacing.sm} ${spacing.md}`,
        transition: animations.transitions.all.fast,
        '&:hover': {
          backgroundColor: colors.background.overlay,
        },
      },
      headerWrapper: {
        '& .MuiTypography-colorTextSecondary': {
          color: colors.text.secondary,
          fontSize: typography.fontSize.xs,
          fontWeight: typography.fontWeight.semibold,
          textTransform: 'uppercase',
          letterSpacing: typography.letterSpacing.wide,
        },
      },
      sidebarIsOpen: {
        '& a': {
          paddingLeft: `${spacing.xl} !important`,
        },
      },
      sidebarIsClosed: {
        '& a': {
          paddingLeft: `${spacing.md} !important`,
        },
      },
    },
    MuiListItemIcon: {
      root: {
        color: colors.text.secondary,
        minWidth: 36,
        '& svg': {
          fontSize: '1.25rem',
        },
      },
    },
    // Quality badge styling
    NDQualityInfo: {
      chip: {
        transform: 'scale(0.9)',
        backgroundColor: colors.background.overlay,
        borderColor: colors.border.default,
        color: colors.text.secondary,
        fontWeight: typography.fontWeight.medium,
        letterSpacing: typography.letterSpacing.wide,
        '& .MuiChip-label': {
          fontSize: typography.fontSize.xs,
          textTransform: 'uppercase',
        },
      },
    },
    // Artist top tracks section
    NDArtistTopTracks: {
      container: {
        backgroundColor: 'transparent',
      },
      title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.tight,
        color: colors.text.primary,
      },
      trackRow: {
        transition: `all ${animations.duration.fast} ${animations.easing.smooth}`,
        '&:hover': {
          backgroundColor: colors.background.overlay,
        },
      },
      trackTitle: {
        fontWeight: typography.fontWeight.medium,
        color: colors.text.primary,
      },
      trackAlbum: {
        color: colors.text.tertiary,
      },
      duration: {
        fontFamily: typography.fontFamily.mono,
        color: colors.text.tertiary,
      },
    },
    // Album card styling
    NDAlbumCard: {
      albumContainer: {
        backgroundColor: colors.background.elevated,
        borderRadius: borders.radius.lg,
        transition: `all ${animations.duration.normal} ${animations.easing.smooth}`,
        '&:hover': {
          backgroundColor: colors.background.overlay,
          transform: 'translateY(-6px)',
          boxShadow: borders.shadows.xl,
        },
      },
      coverWrapper: {
        borderRadius: borders.radius.md,
        boxShadow: borders.shadows.md,
      },
      albumName: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.text.primary,
        '&:hover': {
          color: colors.accent.cyan,
        },
      },
      albumSubtitle: {
        color: colors.text.secondary,
        '& a:hover': {
          color: colors.accent.cyan,
        },
      },
      playButton: {
        backgroundColor: colors.text.primary,
        boxShadow: borders.shadows.lg,
        '&:hover': {
          backgroundColor: colors.text.primary,
          transform: 'scale(1.1)',
        },
      },
    },
  },
  player: {
    theme: 'dark',
  },
}
