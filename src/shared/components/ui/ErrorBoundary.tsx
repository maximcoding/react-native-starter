/**
 * Class error boundary — hooks live only in the themed fallback child.
 * Wrap feature trees or the app shell inside ThemeProvider so fallback can use useTheme.
 * Pass `labels` (via useT at the call site) for translated strings; falls back to English defaults.
 */

import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTheme } from '@/shared/theme/useTheme'
import { Button } from './Button'
import { Text } from './Text'

type ErrorBoundaryLabels = {
  title?: string
  hint?: string
  retry?: string
}

type ErrorBoundaryProps = {
  children: ReactNode
  /** Optional hook for Sentry / logging — do not log secrets or PII */
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  /** Translated strings — pass via useT() at the call site */
  labels?: ErrorBoundaryLabels
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    if (__DEV__) {
      console.error('[ErrorBoundary]', error.message, errorInfo.componentStack)
    }
  }

  reset = () => {
    this.setState({ error: null })
  }

  override render() {
    const { error } = this.state
    if (error) {
      return (
        <ErrorBoundaryFallback
          error={error}
          onRetry={this.reset}
          labels={this.props.labels}
        />
      )
    }
    return this.props.children
  }
}

function ErrorBoundaryFallback({
  error,
  onRetry,
  labels,
}: {
  error: Error
  onRetry: () => void
  labels?: ErrorBoundaryLabels
}) {
  const { theme } = useTheme()

  const title = labels?.title ?? 'Something went wrong'
  const hint =
    labels?.hint ??
    'Please try again. If the problem continues, restart the app.'
  const retry = labels?.retry ?? 'Try again'

  return (
    <View
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      accessibilityRole="alert"
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { padding: theme.spacing.lg, gap: theme.spacing.md },
        ]}
      >
        <Text
          style={[
            theme.typography.headlineSmall,
            { color: theme.colors.textPrimary },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            theme.typography.bodyMedium,
            { color: theme.colors.textSecondary },
          ]}
        >
          {hint}
        </Text>
        {__DEV__ ? (
          <Text
            style={[
              theme.typography.bodySmall,
              { color: theme.colors.textTertiary },
            ]}
            selectable
          >
            {error.message}
            {error.stack ? `\n\n${error.stack}` : ''}
          </Text>
        ) : null}
        <Button
          title={retry}
          variant="primary"
          onPress={onRetry}
          testID="error-boundary-retry"
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center' },
})
