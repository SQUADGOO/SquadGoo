module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'], // Same as 'baseUrl' in tsconfig.json
        alias: {
          '@': './src', // Direct '@' to 'src' folder
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
