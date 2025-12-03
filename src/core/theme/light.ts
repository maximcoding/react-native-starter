import {spacing} from './tokens/spacing';
import {radius} from './tokens/radius';
import {typography} from './tokens/typography';
import {elevation} from './tokens/elevation';

export const lightTheme = {
  colors: {
    background: '#FFFFFF',
    surface: '#F7F7F7',
    text: '#000000',
    textSecondary: '#555555',
    primary: '#5247E6',
    primaryDark: '#3E39B4',
    danger: '#E04242',
    success: '#28A745',
    border: '#E0E0E0',
  },
  spacing,
  radius,
  typography,
  elevation,
} as const;

export type LightTheme = typeof lightTheme;
