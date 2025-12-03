import {fonts} from './fonts';

export const typography = {
  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },

  // Body text
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
  },

  // Small text
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.regular,
    fontWeight: '400' as const,
  },

  // Labels
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.medium,
    fontWeight: '500' as const,
  },
  labelCaps: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.semiBold,
    fontWeight: '600' as const,
    textTransform: 'uppercase' as const,
  },

  // Mono
  mono: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.mono,
    fontWeight: '400' as const,
  },
} as const;

export type Typography = typeof typography;
