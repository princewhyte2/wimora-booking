import { Platform } from 'react-native';

const palette = {
  light: {
    background: '#FAF7F4',
    surface: '#FFFFFF',
    surfaceMuted: '#F3EDE7',
    border: '#E8DFD7',
    text: '#1F1915',
    textSecondary: '#6B5F57',
    textTertiary: '#9A8D84',
    primary: '#8E3B2B',
    primaryPressed: '#73301F',
    onPrimary: '#FFFFFF',
    primarySoft: '#F6E6E1',
    rating: '#B7791F',
    success: '#2F7A4D',
    successSoft: '#E3F2E8',
    danger: '#B42318',
    dangerSoft: '#FDECEA',
  },
  dark: {
    background: '#13100E',
    surface: '#1D1916',
    surfaceMuted: '#28221E',
    border: '#352D28',
    text: '#F6F0EB',
    textSecondary: '#B9ACA2',
    textTertiary: '#857870',
    primary: '#E2876F',
    primaryPressed: '#C9705A',
    onPrimary: '#1F1915',
    primarySoft: '#3A2620',
    rating: '#E4B04A',
    success: '#6CC08D',
    successSoft: '#1D3326',
    danger: '#F27A6E',
    dangerSoft: '#3A1E1B',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type ThemeColors = { [K in keyof (typeof palette)['light']]: string };

export const colors: Record<ColorScheme, ThemeColors> = palette;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  largeTitle: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700' },
  headline: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  callout: { fontSize: 15, lineHeight: 20, fontWeight: '500' },
  subhead: { fontSize: 14, lineHeight: 19, fontWeight: '400' },
  footnote: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '600' },
} as const;

export type TypographyVariant = keyof typeof typography;

/** Keeps content readable on tablets and desktop web. */
export const MAX_CONTENT_WIDTH = 640;

export const fontFamily = Platform.select({
  web: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  default: undefined,
});
