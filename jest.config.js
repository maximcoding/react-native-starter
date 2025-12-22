module.exports = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.js'], // Change to .js
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|react-native-config)/)',
  ],
};
