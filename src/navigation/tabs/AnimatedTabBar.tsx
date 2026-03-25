// src/navigation/tabs/AnimatedTabBar.tsx
//
// Floating tab bar with rounded-square indicators.
// Active tab: icon + label (vertical) inside a rounded-square (primaryAmbient bg).
// Inactive tab: icon + label, dimmed, no background.
// The bar is an elevated card that floats above the screen edge.

import { IconName } from '@assets/icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { memo, useEffect } from 'react'
import { Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useT } from '@/i18n/useT'
import { ROUTES } from '@/navigation/routes'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import type { LightTheme } from '@/shared/theme'
import { useTheme } from '@/shared/theme'

// ─── Constants ─────────────────────────────────────────────────────

const ICON_SIZE = 22
const TAB_MIN_TOUCH = 44
const INACTIVE_OPACITY = 0.45

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 180,
  mass: 0.7,
} as const

// ─── Helpers ───────────────────────────────────────────────────────

function iconForRoute(routeName: string): IconName {
  switch (routeName) {
    case ROUTES.TAB_HOME:
      return IconName.HOME
    case ROUTES.TAB_SETTINGS:
      return IconName.SETTINGS
    default:
      return IconName.USER
  }
}

function labelForRoute(routeName: string, t: ReturnType<typeof useT>): string {
  switch (routeName) {
    case ROUTES.TAB_HOME:
      return t('home.title')
    case ROUTES.TAB_SETTINGS:
      return t('settings.title')
    default:
      return routeName
  }
}

// ─── TabItem ───────────────────────────────────────────────────────

type TabItemProps = {
  isFocused: boolean
  label: string
  routeName: string
  theme: LightTheme
  onPress: () => void
  onLongPress: () => void
}

const TabItem = memo(function TabItem({
  isFocused,
  label,
  routeName,
  theme,
  onPress,
  onLongPress,
}: TabItemProps) {
  const { colors: c, radius: r, spacing: sp, typography: ty } = theme

  const progress = useSharedValue(isFocused ? 1 : 0)

  useEffect(() => {
    progress.value = withSpring(isFocused ? 1 : 0, SPRING_CONFIG)
  }, [isFocused, progress])

  const indicatorStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ['transparent', c.primaryAmbient],
    ),
    opacity: interpolate(progress.value, [0, 1], [INACTIVE_OPACITY, 1]),
  }))

  const tabColor = isFocused ? c.primary : c.textTertiary

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      accessibilityRole="tab"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={label}
      style={styles.tabItem}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            borderRadius: r.xl,
            paddingVertical: sp.xs,
            paddingHorizontal: sp.md,
            gap: sp.xxs,
          },
          indicatorStyle,
        ]}
      >
        <IconSvg
          name={iconForRoute(routeName)}
          size={ICON_SIZE}
          color={tabColor}
        />
        <Text style={[ty.labelSmall, { color: tabColor }]} numberOfLines={1}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  )
})

// ─── AnimatedTabBar ────────────────────────────────────────────────

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useTheme()
  const t = useT()
  const insets = useSafeAreaInsets()
  const { colors: c, spacing: sp, radius: r, elevation: el } = theme

  return (
    <View
      style={[
        styles.outerContainer,
        {
          paddingBottom: Math.max(insets.bottom, sp.sm),
          paddingHorizontal: sp.lg,
          backgroundColor: c.background,
        },
      ]}
    >
      <View
        style={[
          styles.bar,
          {
            backgroundColor: c.surface,
            borderRadius: r.xxxl,
            paddingVertical: sp.xs,
            paddingHorizontal: sp.md,
            gap: sp.xs,
            ...Platform.select({
              ios: {
                shadowColor: el.floating.shadowColor,
                shadowOpacity: el.floating.shadowOpacity,
                shadowRadius: el.floating.shadowRadius,
                shadowOffset: el.floating.shadowOffset,
              },
              android: { elevation: el.floating.elevation },
            }),
          },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : labelForRoute(route.name, t)

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name)
            }
          }

          const onLongPress = () =>
            navigation.emit({ type: 'tabLongPress', target: route.key })

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              label={label}
              routeName={route.name}
              theme={theme}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          )
        })}
      </View>
    </View>
  )
}

// ─── Styles ────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItem: {
    minWidth: TAB_MIN_TOUCH,
    minHeight: TAB_MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})
