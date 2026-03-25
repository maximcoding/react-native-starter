// Mock worklets completely FIRST

jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
}))

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    USE_MOCK_API: 'true',
    API_BASE_URL: 'http://localhost',
    API_TIMEOUT_MS: '15000',
    SENTRY_DSN: '',
    SENTRY_ENABLE_IN_DEV: '0',
    SENTRY_TRACES_SAMPLE_RATE: '0',
  },
}))

jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(undefined),
  show: jest.fn().mockResolvedValue(undefined),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
}))

jest.mock('react-native-worklets', () => {
  const mockSerializable = {
    set: jest.fn(),
    get: jest.fn(),
  }

  return {
    useWorklet: jest.fn(),
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useFrameCallback: jest.fn(),
    useAnimatedFrame: jest.fn(),
    init: jest.fn(),
    createSerializable: jest.fn(() => mockSerializable),
    createWorklet: jest.fn(fn => fn),
    Worklets: {
      createRunInJsFn: jest.fn(fn => fn),
      createRunInContextFn: jest.fn(fn => fn),
      defaultContext: {},
    },
    __workletFactory: jest.fn(fn => fn),
  }
})

// Don't use the reanimated mock - create our own
jest.mock('react-native-reanimated', () => {
  const _React = require('react')
  const { View, Text, Image, ScrollView } = require('react-native')

  return {
    default: {
      View,
      Text,
      Image,
      ScrollView,
      FlatList: View,
    },
    View,
    Text,
    Image,
    ScrollView,
    FlatList: View,
    useSharedValue: jest.fn(value => ({ value })),
    useAnimatedStyle: jest.fn(() => ({})),
    useAnimatedProps: jest.fn(() => ({})),
    useDerivedValue: jest.fn(fn => ({ value: fn() })),
    useAnimatedScrollHandler: jest.fn(() => ({})),
    useAnimatedGestureHandler: jest.fn(() => ({})),
    useAnimatedReaction: jest.fn(),
    withTiming: jest.fn(value => value),
    withSpring: jest.fn(value => value),
    withDecay: jest.fn(value => value),
    withDelay: jest.fn((_, value) => value),
    withRepeat: jest.fn(value => value),
    withSequence: jest.fn((...values) => values[0]),
    cancelAnimation: jest.fn(),
    runOnJS: jest.fn(fn => fn),
    runOnUI: jest.fn(fn => fn),
    createAnimatedComponent: jest.fn(Component => Component),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      quad: jest.fn(),
      bezier: jest.fn(),
    },
  }
})

// Mock gesture handler
jest.mock('react-native-mmkv', () => {
  const stores = new Map()
  const createMMKV = ({ id = 'default' } = {}) => {
    if (!stores.has(id)) stores.set(id, new Map())
    const store = stores.get(id)
    return {
      set: (key, value) => store.set(key, value),
      getString: key => store.get(key),
      getBoolean: key => store.get(key),
      getNumber: key => store.get(key),
      remove: key => store.delete(key),
      clearAll: () => store.clear(),
      contains: key => store.has(key),
      getAllKeys: () => [...store.keys()],
    }
  }
  return { createMMKV }
})

jest.mock('react-native-webview', () => {
  const React = require('react')
  const { View } = require('react-native')
  const WebView = React.forwardRef((props, _ref) =>
    React.createElement(View, props),
  )
  WebView.displayName = 'WebView'
  return { __esModule: true, default: WebView }
})

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View
  return {
    GestureDetector: View,
    GestureHandlerRootView: View,
    Gesture: {
      Pan: jest.fn(() => ({ enabled: jest.fn().mockReturnThis() })),
      Tap: jest.fn(() => ({ enabled: jest.fn().mockReturnThis() })),
    },
  }
})

// Drop i18next's promotional Locize message on init (noisy in every suite that imports i18n)
const originalConsoleInfo = console.info.bind(console)
console.info = (...args) => {
  const msg = typeof args[0] === 'string' ? args[0] : ''
  if (msg.includes('Locize') || msg.includes('locize.com')) {
    return
  }
  originalConsoleInfo(...args)
}
