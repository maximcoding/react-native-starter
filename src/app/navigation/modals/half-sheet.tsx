/**
 * HALF SHEET MODAL (BOTTOM SHEET)
 * ------------------------------------------------------------------
 * Purpose:
 *   A bottom-docked sheet that supports:
 *     - drag-to-close gesture
 *     - velocity-based dismissal
 *     - animated spring opening
 *     - dimmed backdrop with fade
 *     - tap-outside-to-close
 *     - theme-aware background
 *     - safe-area bottom padding
 *
 * When to use:
 *   - pickers
 *   - filters
 *   - small forms
 *   - route-based sheet UI
 *
 * How it works:
 *   - When mounted → opens automatically from bottom
 *   - Dragging down or tapping backdrop → closes sheet
 *   - When closed → calls onClose() AFTER animation ends
 *
 * How to register in navigation:
 *
 *    function EditProfileSheetScreen() {
 *      return (
 *        <HalfSheet onClose={() => navigation.goBack()}>
 *          <YourContent />
 *        </HalfSheet>
 *      );
 *    }
 *
 *    <Stack.Screen
 *      name={ROUTES.EDIT_PROFILE}
 *      component={EditProfileSheetScreen}
 *      options={nav.half(ROUTES.EDIT_PROFILE)}
 *    />
 *
 * How to open sheet:
 *    navigation.navigate(ROUTES.EDIT_PROFILE);
 *
 * Notes:
 *   - This component is NOT the screen. The screen should wrap it.
 *   - DO NOT use HalfSheet directly as <Stack.Screen component>.
 *   - The sheet height is auto-adjusted but can be customized.
 *   - Gesture logic cannot exist inside navigation options — only here.
 * ------------------------------------------------------------------
 */

import React, { useCallback } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/core/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Animated,
{
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  children?: React.ReactNode;
  /**
   * Called AFTER closing animation finishes.
   * Usually used to call navigation.goBack().
   */
  onClose?: () => void;
}

export default function HalfSheet({ children, onClose }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  /**
   * translateY controls vertical position of sheet.
   * Initial value is off-screen bottom.
   */
  const translateY = useSharedValue(SCREEN_HEIGHT);

  /**
   * Close sheet with animation → then call onClose()
   */
  const closeSheet = useCallback(() => {
    translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20 }, () => {
      if (onClose) runOnJS(onClose)();
    });
  }, []);

  /**
   * Open sheet to ~40% of screen height
   */
  const openSheet = useCallback(() => {
    translateY.value = withSpring(SCREEN_HEIGHT * 0.4, {
      damping: 20,
      stiffness: 150,
    });
  }, []);

  /**
   * Open on mount
   */
  React.useEffect(() => {
    openSheet();
  }, []);

  /**
   * Gesture: drag sheet vertically
   */
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = Math.max(e.translationY + SCREEN_HEIGHT * 0.4, 0);
    })
    .onEnd((e) => {
      const shouldClose =
        e.velocityY > 800 || translateY.value > SCREEN_HEIGHT * 0.65;

      if (shouldClose) closeSheet();
      else openSheet();
    });

  /**
   * Animated sheet style
   */
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  /**
   * Backdrop fade animation
   */
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  return (
    <View style={styles.fullscreen}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={styles.backdropPress} onPress={closeSheet} />
      </Animated.View>

      {/* Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.background,
              paddingBottom: insets.bottom + 12,
            },
            sheetStyle,
          ]}
        >
          {/* handle bar */}
          <View style={styles.handle} />

          {/* sheet content */}
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  backdropPress: {
    flex: 1,
  },

  sheet: {
    width: '100%',
    minHeight: SCREEN_HEIGHT * 0.4,
    maxHeight: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginBottom: 12,
  },
});
