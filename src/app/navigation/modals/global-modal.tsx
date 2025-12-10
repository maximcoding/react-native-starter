/**
 * GLOBAL MODAL (FULL SCREEN)
 * ------------------------------------------------------------------
 * Purpose:
 *   A full-screen modal shell used for modal routes in navigation.
 *   It provides:
 *     - background theming
 *     - safe-area handling
 *     - consistent modal container for any screen
 *
 * How to use:
 *   1) Create a screen that returns <GlobalModal> with content:
 *
 *      export default function ProfileImageModal() {
 *        return (
 *          <GlobalModal>
 *            <YourContent />
 *          </GlobalModal>
 *        );
 *      }
 *
 *   2) Register it in navigation:
 *
 *      <Stack.Screen
 *        name={ROUTES.MODAL_IMAGE}
 *        component={ProfileImageModal}
 *        options={nav.modal(ROUTES.MODAL_IMAGE)}
 *      />
 *
 *   3) Open it:
 *        navigation.navigate(ROUTES.MODAL_IMAGE)
 *
 * Notes:
 *   - This is ONLY a visual shell. Logic & UI belong to child screens.
 *   - GlobalModal does NOT handle gestures or animations.
 *   - Use this for screens that should cover 100% height.
 * ------------------------------------------------------------------
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/core/theme';
import ScreenWrapper from '@/app/components/ScreenWrapper';

export default function GlobalModal({ children }: { children?: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {children}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
