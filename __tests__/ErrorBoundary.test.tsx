/**
 * @format
 */

import '@/i18n/i18n'
import React, { useState } from 'react'
import { Pressable, View } from 'react-native'
import ReactTestRenderer, { act } from 'react-test-renderer'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'

function ThrowingChild() {
  throw new Error('expected test error')
}

function Harness() {
  const [boom, setBoom] = useState(false)
  return (
    <ThemeProvider>
      <ErrorBoundary>
        {boom ? <ThrowingChild /> : <View testID="safe" />}
      </ErrorBoundary>
      <Pressable testID="trigger-boom" onPress={() => setBoom(true)} />
    </ThemeProvider>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('ErrorBoundary shows fallback when child throws', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer

    await act(async () => {
      renderer = ReactTestRenderer.create(<Harness />)
    })

    await act(async () => {
      renderer!.root.findByProps({ testID: 'trigger-boom' }).props.onPress()
    })

    const treeStr = JSON.stringify(renderer!.toJSON())
    expect(treeStr).toContain('Something went wrong')
    expect(treeStr).toContain('Try again')
  })

  test('ErrorBoundary retry works after the throwing child is removed', async () => {
    function RecoveryHarness() {
      const [phase, setPhase] = useState<'ok' | 'error' | 'recovered'>('ok')
      return (
        <ThemeProvider>
          <ErrorBoundary>
            {phase === 'error' ? <ThrowingChild /> : <View testID="content" />}
          </ErrorBoundary>
          <Pressable testID="to-error" onPress={() => setPhase('error')} />
          <Pressable testID="recover" onPress={() => setPhase('recovered')} />
        </ThemeProvider>
      )
    }

    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(<RecoveryHarness />)
    })

    await act(async () => {
      renderer!.root.findByProps({ testID: 'to-error' }).props.onPress()
    })

    expect(JSON.stringify(renderer!.toJSON())).toContain('Something went wrong')

    await act(async () => {
      renderer!.root.findByProps({ testID: 'recover' }).props.onPress()
    })

    await act(async () => {
      renderer!.root
        .findByProps({ testID: 'error-boundary-retry' })
        .props.onPress()
    })

    expect(renderer!.root.findByProps({ testID: 'content' })).toBeDefined()
  })
})
