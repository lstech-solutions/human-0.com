// Dynamic Expo config generated from app.json
// Switches web.output between 'server' and 'static' based on WEB_OUTPUT env

/** @type {import('@expo/config-types').ExpoConfig} */
const baseConfig = {
  name: "human-0",
  slug: "human-0",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "human-0",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    output: "server",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-font",
    "expo-web-browser",
  ],
  experiments: {
    typedRoutes: true,
    baseUrl: "/",
  },
};

/**
 * @param {{ config: import('@expo/config-types').ExpoConfig }} param0
 * @returns {import('@expo/config-types').ExpoConfig}
 */
module.exports = ({ config }) => {
  const output = process.env.WEB_OUTPUT || config.web?.output || baseConfig.web.output;

  return {
    ...config,
    ...baseConfig,
    web: {
      ...baseConfig.web,
      ...config.web,
      output,
    },
  };
};
