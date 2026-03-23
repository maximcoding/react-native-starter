// src/navigation/tabs/AnimatedTabBar.tsx
//
// Floating tab bar with rounded-square indicators.
// Active tab: icon + label (vertical) inside a rounded-square (primaryAmbient bg).
// Inactive tab: icon + label, dimmed, no background.
// The bar is an elevated card that floats above the screen edge.

import { IconName } from '@assets/icons'
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import React, { useEffect, useRef } from 'react'
import { Animated, Platform, Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ROUTES } from '@/navigation/routes'
import { IconSvg } from '@/shared/components/ui/IconSvg'
import { Text } from '@/shared/components/ui/Text'
import { useTheme } from '@/shared/theme'

const ICON_SIZE = 22
const TAB_MIN_TOUCH = 44

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

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()
  const c = theme.colors
  const sp = theme.spacing
  const r = theme.radius
  const ty = theme.typography
  const el = theme.elevation

  const progress = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0)),
  ).current

  // biome-ignore lint/correctness/useExhaustiveDependencies: progress is a stable ref; routes are fixed for this bar
  useEffect(() => {
    state.routes.forEach((_, i) => {
      Animated.spring(progress[i], {
        toValue: i === state.index ? 1 : 0,
        useNativeDriver: false,
        damping: 20,
        stiffness: 180,
        mass: 0.7,
      }).start()
    })
  }, [state.index])

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
      {/* Floating card */}
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
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : typeof options.title === 'string'
                ? options.title
                : route.name

          const isFocused = state.index === index
          const p = progress[index]

          // Rounded-square bg: transparent → primaryAmbient
          const squareBg = p.interpolate({
            inputRange: [0, 1],
            outputRange: ['transparent', c.primaryAmbient],
          })

          // Content opacity: dim when inactive
          const contentOpacity = p.interpolate({
            inputRange: [0, 1],
            outputRange: [0.45, 1],
          })

          const iconColor = isFocused ? c.primary : c.textTertiary
          const labelColor = isFocused ? c.primary : c.textTertiary

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

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              accessibilityRole="tab"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={label}
              style={styles.tabItem}
            >
              <Animated.View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: squareBg,
                    borderRadius: r.xl,
                    paddingVertical: sp.xs,
                    paddingHorizontal: sp.md,
                    gap: sp.xxs,
                    opacity: contentOpacity,
                  },
                ]}
              >
                {/* Icon */}
                <IconSvg
                  name={iconForRoute(route.name)}
                  size={ICON_SIZE}
                  color={iconColor}
                />

                {/* Label — always visible, below icon */}
                <Text
                  style={[ty.labelSmall, { color: labelColor }]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Animated.View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
