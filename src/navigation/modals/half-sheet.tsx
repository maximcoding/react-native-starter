/**
 * HALF SHEET MODAL (BOTTOM SHEET)
 * ------------------------------------------------------------------
 * Uses React Native's built-in Animated API (not Reanimated) so it is
 * compatible with any Reanimated version. Reanimated 4 removed the
 * withSpring completion-callback, so all prior logic was broken.
 *
 * Features:
 *   - Spring open from bottom on mount
 *   - Tap-backdrop-to-close
 *   - Drag-down-to-close (PanResponder)
 *   - Backdrop fade
 *   - Safe-area bottom padding
 *   - Theme-aware colours
 *
 * Usage:
 *   function MySheetScreen() {
 *     const nav = useNavigation()
 *     return (
 *       <HalfSheet onClose={() => nav.goBack()}>
 *         <YourContent />
 *       </HalfSheet>
 *     )
 *   }
 *
 *   <Stack.Screen
 *     name={ROUTES.MY_SHEET}
 *     component={MySheetScreen}
 *     options={{ presentation: 'transparentModal', animation: 'none', gestureEnabled: false }}
 *   />
 * ------------------------------------------------------------------
 */

import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/shared/theme'
import { radius } from '@/shared/theme/tokens/radius'
import { spacing } from '@/shared/theme/tokens/spacing'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface Props {
  children?: React.ReactNode
  /** Called after the closing animation finishes — usually `navigation.goBack()`. */
  onClose?: () => void
}

export default function HalfSheet({ children, onClose }: Props) {
  const { theme } = useTheme()
  const insets = useSafeAreaInsets()

  /** Whether the backdrop / drag gesture may trigger a close. */
  const [interactable, setInteractable] = React.useState(false)

  /** Sheet position. 0 = fully visible, SCREEN_HEIGHT = off-screen. */
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  /** Animate close then call onClose. */
  const closeSheet = useCallback(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.()
    })
  }, [translateY, backdropOpacity, onClose])

  /** Open on mount. Backdrop+drag enabled only after animation completes. */
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        stiffness: 150,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setInteractable(true)
    })
  }, [translateY, backdropOpacity])

  /** Drag-to-close gesture. */
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, { dy, dx }) =>
        Math.abs(dy) > Math.abs(dx) && dy > 5,
      onPanResponderMove: (_, { dy }) => {
        if (dy > 0) translateY.setValue(dy)
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (vy > 0.5 || dy > SCREEN_HEIGHT * 0.25) {
          closeSheet()
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            damping: 20,
            stiffness: 150,
            useNativeDriver: true,
          }).start()
        }
      },
    }),
  ).current

  return (
    <View style={styles.fullscreen}>
      {/* Backdrop */}
      <Animated.View
        style={[
          styles.backdrop,
          {
            backgroundColor: theme.colors.overlayBackdrop,
            opacity: backdropOpacity,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={closeSheet}
          disabled={!interactable}
        />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: insets.bottom + spacing.sm,
            transform: [{ translateY }],
          },
        ]}
        {...(interactable ? panResponder.panHandlers : {})}
      >
        {/* Handle bar */}
        <View
          style={[
            styles.handle,
            { backgroundColor: theme.colors.overlayOnSurface },
          ]}
        />

        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.4,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    overflow: 'hidden',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  handle: {
    width: spacing.xxxxl,
    height: spacing.xxs,
    borderRadius: radius.pill,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
})
