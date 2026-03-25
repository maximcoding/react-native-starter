// src/features/home/screens/StoryScreen.tsx

import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Animated, Pressable, StyleSheet, View } from 'react-native'
import Svg, { Path, Polyline } from 'react-native-svg'
import WebView from 'react-native-webview'
import type {
  WebViewNavigation,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes'
import type { RootStackParamList } from '@/navigation/root-param-list'
import { ROUTES } from '@/navigation/routes'
import { ScreenWrapper } from '@/shared/components/ui/ScreenWrapper'
import { Text } from '@/shared/components/ui/Text'
import { spacing } from '@/shared/theme/tokens/spacing'
import { useTheme } from '@/shared/theme/useTheme'

type Props = NativeStackScreenProps<
  RootStackParamList,
  typeof ROUTES.HOME_STORY
>

// ─── Layout constants (derived from design tokens, never raw numbers) ─────────
const HEADER_HEIGHT = spacing.xxxxxl // 56 — matches ScreenHeader
const ICON_SIZE = spacing.lg // 20
const ICON_STROKE = 2.2
const PROGRESS_BAR_HEIGHT = spacing.xxs // 4

const HN_ITEM_BASE = 'https://news.ycombinator.com/item?id='

export default function StoryScreen({ route, navigation }: Props) {
  const { id, title, url, domain } = route.params
  const { theme } = useTheme()
  const c = theme.colors
  const sp = theme.spacing
  const ty = theme.typography
  const r = theme.radius

  const uri = url ?? `${HN_ITEM_BASE}${id}`
  const displayHost = domain ?? 'news.ycombinator.com'

  const [isLoading, setIsLoading] = useState(true)
  const [canGoBack, setCanGoBack] = useState(false)
  const webViewRef = useRef<WebView>(null)
  const loadProgress = useRef(new Animated.Value(0)).current

  const iconProps = useMemo(
    () => ({
      width: ICON_SIZE,
      height: ICON_SIZE,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: c.textPrimary,
      strokeWidth: ICON_STROKE,
      strokeLinecap: 'round' as const,
      strokeLinejoin: 'round' as const,
    }),
    [c.textPrimary],
  )

  const handleClose = useCallback(() => navigation.goBack(), [navigation])

  const handleBack = useCallback(() => {
    if (canGoBack) {
      webViewRef.current?.goBack()
    } else {
      navigation.goBack()
    }
  }, [canGoBack, navigation])

  const handleNavigationStateChange = useCallback(
    (state: WebViewNavigation) => setCanGoBack(state.canGoBack),
    [],
  )

  const handleLoadStart = useCallback(() => {
    loadProgress.setValue(0)
    setIsLoading(true)
  }, [loadProgress])

  const handleLoadEnd = useCallback(() => setIsLoading(false), [])

  const handleLoadProgress = useCallback(
    ({ nativeEvent }: WebViewProgressEvent) => {
      Animated.timing(loadProgress, {
        toValue: nativeEvent.progress,
        duration: 80,
        useNativeDriver: false,
      }).start()
    },
    [loadProgress],
  )

  const progressWidth = loadProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <ScreenWrapper
      header={
        <View
          style={[
            styles.header,
            {
              height: HEADER_HEIGHT,
              paddingHorizontal: sp.md,
              backgroundColor: c.background,
              borderBottomColor: c.border,
              gap: sp.xs,
            },
          ]}
        >
          <Pressable
            onPress={handleBack}
            hitSlop={{ top: sp.xs, bottom: sp.xs, left: sp.xs, right: sp.xs }}
            accessibilityRole="button"
            accessibilityLabel={canGoBack ? 'Go back in page' : 'Back to feed'}
            style={styles.iconBtn}
          >
            <Svg {...iconProps}>
              <Polyline points="15 18 9 12 15 6" />
            </Svg>
          </Pressable>

          <View style={styles.titleSlot}>
            <Text
              style={[ty.labelMedium, { color: c.textSecondary }]}
              numberOfLines={1}
            >
              {displayHost}
            </Text>
          </View>

          <Pressable
            onPress={handleClose}
            hitSlop={{ top: sp.xs, bottom: sp.xs, left: sp.xs, right: sp.xs }}
            accessibilityRole="button"
            accessibilityLabel="Close article"
            style={[
              styles.iconBtn,
              { backgroundColor: c.surfaceSecondary, borderRadius: r.pill },
            ]}
          >
            <Svg {...iconProps} stroke={c.textTertiary}>
              <Path d="M18 6 6 18M6 6l12 12" />
            </Svg>
          </Pressable>
        </View>
      }
    >
      <WebView
        ref={webViewRef}
        source={{ uri }}
        accessibilityLabel={title}
        style={{ flex: 1, backgroundColor: c.background }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onLoadProgress={handleLoadProgress}
        onNavigationStateChange={handleNavigationStateChange}
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction
        startInLoadingState={false}
      />

      {isLoading && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.progressBar,
            {
              height: PROGRESS_BAR_HEIGHT,
              backgroundColor: c.primary,
              width: progressWidth,
            },
          ]}
        />
      )}
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleSlot: {
    flex: 1,
    alignItems: 'center',
  },
  iconBtn: {
    width: spacing.xxxl,
    height: spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
})
