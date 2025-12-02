const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Allow .cjs + ESM packages used by wagmi/viem
config.resolver.sourceExts = [
  'ts',
  'tsx',
  'js',
  'jsx',
  'json',
  'cjs'
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
try {
  config.resolver.alias = {
    ...config.resolver.alias,
    '@noble/hashes/crypto': require.resolve('@noble/hashes/lib/crypto.js'),
    '@supabase/postgrest-js': require.resolve('../../node_modules/.pnpm/@supabase+postgrest-js@1.21.4/node_modules/@supabase/postgrest-js'),
  };
} catch (e) {
  // Fallback if alias resolution fails
  console.warn('Could not resolve aliases:', e.message);
}

// Force resolution of CJS builds for viem/wagmi
config.resolver.unstable_conditionNames = ['require', 'react-native'];

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
