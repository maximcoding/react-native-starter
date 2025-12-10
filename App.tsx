/**
 * FILE: App.tsx
 * ROOT ENTRY POINT
 * -------------------------------------------------------
 * WRAPS:
 *   - ThemeProvider (light/dark)
 *   - i18n initialization
 *   - NavigationContainer
 *   - RootNavigator
 * -------------------------------------------------------
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

// THEME
import { ThemeProvider } from '@/core/theme/ThemeProvider';

// i18n (auto-init)
import '@/core/i18n/i18n';
import RootNavigator from './src/app/navigation/root/root-navigator';

// NAVIGATION ROOT

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}
