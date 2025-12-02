// ⚠️ Important: `@walletconnect/react-native-compat` needs to be imported before other `wagmi` packages.
// This is because it applies a polyfill necessary for the TextEncoder API.
import '@walletconnect/react-native-compat';

// Polyfills for Web3Modal
if (typeof btoa === 'undefined') {
  global.btoa = function (str: string) {
    return Buffer.from(str, 'binary').toString('base64');
  };
}

if (typeof atob === 'undefined') {
  global.atob = function (b64Encoded: string) {
    return Buffer.from(b64Encoded, 'base64').toString('binary');
  };
}
