const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    ...defaultConfig.resolver,
    sourceExts: [...defaultConfig.resolver.sourceExts, 'jsx', 'js', 'ts', 'tsx'],
    // Resolve the "@/..." alias at the Metro resolver level (absolute path), so it does
    // not depend solely on the babel module-resolver transform (which was flaky on iOS).
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === '@' || moduleName.startsWith('@/')) {
        const subPath = moduleName === '@' ? '' : moduleName.slice(2);
        return context.resolveRequest(
          context,
          path.resolve(__dirname, 'src', subPath),
          platform,
        );
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
