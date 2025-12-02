module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Transform import.meta to prevent eval errors in Metro
      ["babel-plugin-transform-import-meta", {
        "module": "ES6"
      }],
      "react-native-reanimated/plugin",
    ],
  };
};
