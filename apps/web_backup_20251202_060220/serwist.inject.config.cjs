module.exports = {
  swSrc: "sw-src.ts",
  swDest: "dist/sw.js",
  globDirectory: "dist",
  globPatterns: [
    "**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,json,woff2}",
    "**/fonts/*",
    "**/images/*",
  ],
};
