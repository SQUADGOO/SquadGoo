module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // NOTE: the '@' -> './src' module-resolver alias is added in the config task.
    'react-native-worklets/plugin', // Reanimated 4 — MUST be the last plugin
  ],
};
