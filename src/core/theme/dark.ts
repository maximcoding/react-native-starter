import {spacing} from './tokens/spacing';
import {radius} from './tokens/radius';
import {typography} from './tokens/typography';
import {elevation} from './tokens/elevation';

export const darkTheme = {
  colors: {
    background: '#000000',
    surface: '#121212',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    primary: '#887CFF',
    primaryDark: '#5F52D9',
    danger: '#FF6B6B',
    success: '#41D97C',
    border: '#333333',
  },
  spacing,
  radius,
  typography,
  elevation,
} as const;

export type DarkTheme = typeof darkTheme;
