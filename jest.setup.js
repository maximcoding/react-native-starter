// Mock worklets completely FIRST

jest.mock('react-native-config', () => ({
  __esModule: true,
  default: {
    USE_MOCK_API: 'true',
    API_BASE_URL: 'http://localhost',
    API_TIMEOUT_MS: '15000',
  },
}));


jest.mock('react-native-bootsplash', () => ({
  hide: jest.fn().mockResolvedValue(undefined),
  show: jest.fn().mockResolvedValue(undefined),
  getVisibilityStatus: jest.fn().mockResolvedValue('hidden'),
}));

jest.mock('react-native-worklets', () => {
  const mockSerializable = {
    set: jest.fn(),
    get: jest.fn(),
  };

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
  };
});

// Don't use the reanimated mock - create our own
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, ScrollView } = require('react-native');

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
  };
});

// Mock gesture handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;
  return {
    GestureDetector: View,
    GestureHandlerRootView: View,
    Gesture: {
      Pan: jest.fn(() => ({ enabled: jest.fn().mockReturnThis() })),
      Tap: jest.fn(() => ({ enabled: jest.fn().mockReturnThis() })),
    },
  };
});
