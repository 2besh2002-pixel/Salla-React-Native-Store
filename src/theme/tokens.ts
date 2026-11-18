/**
 * @file src/theme/tokens.ts
 * Global Design Tokens: Spacing, Typography Scale, Shadows, and Elevation.
 */

import { Platform } from 'react-native';

export const SPACING = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const TYPOGRAPHY = {
  scale: {
    caption: {
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    bodySm: {
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 0,
    },
    body: {
      fontSize: 15,
      lineHeight: 22,
      letterSpacing: 0,
    },
    bodyLg: {
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    titleSm: {
      fontSize: 17,
      lineHeight: 24,
      letterSpacing: -0.2,
      fontWeight: '600' as const,
    },
    title: {
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: -0.3,
      fontWeight: '700' as const,
    },
    headline: {
      fontSize: 24,
      lineHeight: 32,
      letterSpacing: -0.4,
      fontWeight: '700' as const,
    },
    display: {
      fontSize: 30,
      lineHeight: 38,
      letterSpacing: -0.5,
      fontWeight: '800' as const,
    },
  },
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    android: {
      elevation: 1,
    },
    default: {
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 3,
    },
    default: {
      boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
    },
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 6,
    },
    default: {
      boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
    },
  }),
};
