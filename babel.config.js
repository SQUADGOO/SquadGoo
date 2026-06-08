module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true, // missing keys -> undefined, handled by fallbacks in appConfig
      },
    ],
    'react-native-worklets/plugin', // Reanimated 4 — MUST be the last plugin
  ],
};
