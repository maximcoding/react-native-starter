/**
 * @format
 */

import React from 'react'
import ReactTestRenderer, { act } from 'react-test-renderer'
import { Button } from '@/shared/components/ui/Button'
import { ThemeProvider } from '@/shared/theme/ThemeProvider'

function wrap(ui: React.ReactElement) {
  return <ThemeProvider>{ui}</ThemeProvider>
}

describe('Button', () => {
  test('renders title text', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<Button title="Press me" />))
    })
    expect(JSON.stringify(renderer!.toJSON())).toContain('Press me')
  })

  test('has accessibilityRole=button and accessibilityLabel=title', async () => {
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(wrap(<Button title="Sign in" />))
    })
    const pressable = renderer!.root.findByProps({
      accessibilityRole: 'button',
    })
    expect(pressable.props.accessibilityLabel).toBe('Sign in')
    expect(pressable.props.accessibilityState.disabled).toBe(false)
  })

  test('calls onPress when enabled', async () => {
    const onPress = jest.fn()
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(
        wrap(<Button title="Go" onPress={onPress} />),
      )
    })
    await act(async () => {
      renderer!.root
        .findByProps({ accessibilityRole: 'button' })
        .props.onPress()
    })
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  test('does not fire onPress when disabled', async () => {
    const onPress = jest.fn()
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(
        wrap(<Button title="Go" onPress={onPress} disabled />),
      )
    })
    const pressable = renderer!.root.findByProps({
      accessibilityRole: 'button',
    })
    expect(pressable.props.onPress).toBeUndefined()
    expect(pressable.props.accessibilityState.disabled).toBe(true)
  })

  test('does not fire onPress when loading', async () => {
    const onPress = jest.fn()
    let renderer: ReactTestRenderer.ReactTestRenderer
    await act(async () => {
      renderer = ReactTestRenderer.create(
        wrap(<Button title="Go" onPress={onPress} loading />),
      )
    })
    const pressable = renderer!.root.findByProps({
      accessibilityRole: 'button',
    })
    expect(pressable.props.onPress).toBeUndefined()
    expect(pressable.props.accessibilityState.disabled).toBe(true)
  })

  test('renders all variants without crashing', async () => {
    for (const variant of ['primary', 'secondary', 'outline'] as const) {
      await act(async () => {
        ReactTestRenderer.create(
          wrap(<Button title="Test" variant={variant} />),
        )
      })
    }
  })

  test('renders both sizes without crashing', async () => {
    for (const size of ['md', 'lg'] as const) {
      await act(async () => {
        ReactTestRenderer.create(wrap(<Button title="Test" size={size} />))
      })
    }
  })
})
