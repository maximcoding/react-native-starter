import React from 'react';
import {
  View,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/core/theme';
import {
  SafeAreaView,
  useSafeAreaInsets,
  EdgeInsets,
} from 'react-native-safe-area-context';

interface Props {
  children?: React.ReactNode;
  scroll?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  disableTopInset?: boolean;
  disableBottomInset?: boolean;
}

export default function ScreenWrapper({
  children,
  scroll = false,
  header,
  footer,
  disableTopInset = false,
  disableBottomInset = false,
}: Props) {
  const { theme, mode } = useTheme();
  const insets: EdgeInsets = useSafeAreaInsets();

  const bg = theme.colors.background;
  const barStyle = mode === 'dark' ? 'light-content' : 'dark-content';

  const paddingTop = disableTopInset ? 0 : insets.top;
  const paddingBottom = disableBottomInset ? 0 : insets.bottom;

  const Content = scroll ? ScrollView : View;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bg }]}
      edges={['top', 'left', 'right']}
    >
      <StatusBar barStyle={barStyle} backgroundColor={bg} />

      {header ? <View style={styles.header}>{header}</View> : null}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Content
          style={[
            styles.container,
            {
              backgroundColor: bg,
              paddingTop,
              paddingBottom,
            },
          ]}
          contentContainerStyle={scroll ? styles.scrollContent : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Content>
      </KeyboardAvoidingView>

      {footer ? (
        <SafeAreaView
          style={[styles.footer, { backgroundColor: bg }]}
          edges={['bottom']}
        >
          {footer}
        </SafeAreaView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  container: { flex: 1 },
  header: { width: '100%' },
  footer: { width: '100%' },
  scrollContent: { flexGrow: 1 },
});
