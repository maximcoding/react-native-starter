/**
 * @format
 */

import React from 'react'
import ReactTestRenderer, { act } from 'react-test-renderer'
import { OfflineBanner } from '@/shared/components/ui/OfflineBanner'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'

// Mutable ref so individual tests can flip the network state before rendering.
const networkState = { isOffline: false }

jest.mock('@/shared/hooks/useOnlineStatus', () => ({
  useOnlineStatus: () => ({
    isOffline: networkState.isOffline,
    isOnline: !networkState.isOffline,
  }),
}))

function wrap(ui: React.ReactElement) {
  return <ThemeProvider>{ui}</ThemeProvider>
}

describe('OfflineBanner', () => {
  afterEach(() => {
    networkState.isOffline = false
  })

  test('renders nothing when online', async () => {
    networkState.isOffline = false
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<OfflineBanner />))
    })
    expect(renderer!.toJSON()).toBeNull()
  })

  test('renders banner when offline', async () => {
    networkState.isOffline = true
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<OfflineBanner />))
    })
    expect(renderer!.toJSON()).not.toBeNull()
  })

  test('shows default offline message', async () => {
    networkState.isOffline = true
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<OfflineBanner />))
    })
    expect(JSON.stringify(renderer!.toJSON())).toContain('offline')
  })

  test('shows custom message when provided', async () => {
    networkState.isOffline = true
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(
        wrap(<OfflineBanner message="No connection" />),
      )
    })
    expect(JSON.stringify(renderer!.toJSON())).toContain('No connection')
  })

  test('has accessibilityRole=alert when offline', async () => {
    networkState.isOffline = true
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<OfflineBanner />))
    })
    const alert = renderer!.root.findByProps({ accessibilityRole: 'alert' })
    expect(alert).toBeDefined()
  })
})
