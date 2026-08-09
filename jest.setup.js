// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Safely polyfill fetch if missing (Node < 18) without requiring node-fetch
if (typeof fetch === 'undefined') {
  global.fetch = jest.fn();
}
