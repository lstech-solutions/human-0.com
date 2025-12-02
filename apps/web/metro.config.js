const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Allow .cjs + ESM packages used by wagmi/viem and Supabase
config.resolver.sourceExts = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'cjs',
  'mjs'
];

// Necessary shims for viem + walletconnect in RN
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('react-native-crypto'),
  stream: require.resolve('stream-browserify'),
  buffer: require.resolve('buffer/'),
  events: require.resolve('events/'),
  util: require.resolve('util/'),
  process: require.resolve('process/browser'),
};

// Handle ESM packages and Web3 dependencies
const path = require('path');

// Alias configuration for workspace packages and dependencies
try {
  config.resolver.alias = {
    ...config.resolver.alias,
    '@noble/hashes/crypto': require.resolve('@noble/hashes/crypto'),
    // Workspace packages
    '@human-0/i18n': path.resolve(__dirname, '../../packages/i18n'),
    '@human-0/posh-sdk': path.resolve(__dirname, '../../packages/posh-sdk'),
    '@human-0/ui': path.resolve(__dirname, '../../packages/ui'),
  };
} catch (e) {
  // If @noble/hashes/crypto can't be resolved, skip it but keep workspace aliases
  config.resolver.alias = {
    ...config.resolver.alias,
    '@human-0/i18n': path.resolve(__dirname, '../../packages/i18n'),
    '@human-0/posh-sdk': path.resolve(__dirname, '../../packages/posh-sdk'),
    '@human-0/ui': path.resolve(__dirname, '../../packages/ui'),
  };
}

// Force resolution of CJS builds for viem/wagmi and Supabase
config.resolver.unstable_conditionNames = ['require', 'react-native'];

// Resolve node_modules from workspace root for pnpm
// Also watch workspace packages
config.watchFolders = [
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../packages'),
];

// Add node_modules paths for better resolution
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
  path.resolve(__dirname, '../../node_modules'),
  path.resolve(__dirname, '../../node_modules/.pnpm/node_modules'),
];

// Configure transformer to handle ES modules properly
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

module.exports = withNativeWind(config, { input: "./global.css" });
