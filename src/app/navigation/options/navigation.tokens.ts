import { useTheme } from '@/core/theme/useTheme';
import { useT } from '@/core/i18n/useT';

function useBaseNavTokens() {
  const { theme } = useTheme();
  const t = useT();

  const colors: any = theme.colors ?? {};

  const primaryTextColor: string =
    colors.textPrimary ?? colors.text ?? '#000000';

  const secondaryTextColor: string =
    colors.textSecondary ??
    colors.textTertiary ??
    colors.text ??
    primaryTextColor;

  const backgroundColor: string = colors.background ?? '#FFFFFF';

  const surfaceColor: string = colors.surface ?? backgroundColor;

  const borderColor: string = colors.border ?? colors.divider ?? surfaceColor;

  const primaryColor: string = colors.primary ?? primaryTextColor;

  const headerTitleBase =
    (theme.typography as any).h3 ?? (theme.typography as any).body ?? {};

  return {
    t,
    headerStyle: {
      backgroundColor,
    },
    headerTintColor: primaryTextColor,
    headerTitleStyle: {
      ...headerTitleBase,
      color: primaryTextColor,
    },
    tabBarActiveTintColor: primaryColor,
    tabBarInactiveTintColor: secondaryTextColor,
    tabBarStyle: {
      backgroundColor: surfaceColor,
      borderTopColor: borderColor,
    },
  };
}

/**
 * Старый хук — оставляем, чтобы не ломать AppStack
 */
export function useNavigationTokens() {
  const { theme } = useTheme();
  const t = useT();

  return {
    // Titles
    headerTitle: (key: string) => t(key),

    // Header
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTintColor: theme.colors.textPrimary,
    headerTitleStyle: {
      color: theme.colors.textPrimary,
    },

    // Tabs
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.textSecondary,
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopColor: theme.colors.border,
    },
  };
}

/**
 * Токены для Stack-пересетов
 */
export function useStackTokens() {
  const base = useBaseNavTokens();

  return {
    base: {
      headerStyle: base.headerStyle,
      headerTintColor: base.headerTintColor,
      headerTitleStyle: base.headerTitleStyle,
    },
    noHeader: {
      headerShown: false as const,
    },
    header: {
      headerShown: true as const,
    },
    transparent: {
      headerShown: true as const,
      headerTransparent: true as const,
    },
  };
}

/**
 * Токены для Tabs
 */
export function useTabTokens() {
  const base = useBaseNavTokens();

  return {
    tabBarActiveTintColor: base.tabBarActiveTintColor,
    tabBarInactiveTintColor: base.tabBarInactiveTintColor,
    tabBarStyle: base.tabBarStyle,
  };
}

/**
 * Токены для модалок
 */
export function useModalTokens() {
  const base = useBaseNavTokens();

  return {
    full: {
      presentation: 'modal' as const,
      animation: 'fade' as const,
      headerShown: false as const,
    },
    half: {
      presentation: 'transparentModal' as const,
      animation: 'slide_from_bottom' as const,
      headerShown: false as const,
    },
  };
}
