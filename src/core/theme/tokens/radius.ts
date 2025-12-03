export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
  full: 9999,
} as const;

export type Radius = typeof radius;
