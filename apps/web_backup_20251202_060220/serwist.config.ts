export default {
  swDest: "dist/sw.js",

  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,html,svg,png,jpg,jpeg,webp,ico,json,woff2}", "**/fonts/*", "**/images/*"],

  runtimeCaching: [
    {
      // HTML documents / app shell
      urlPattern: ({ request }: { request: Request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "html-pages",
        expiration: { maxEntries: 50 },
      },
    },
    {
      // JS bundles
      urlPattern: ({ request }: { request: Request }) => request.destination === "script",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "js-cache",
      },
    },
    {
      // CSS
      urlPattern: ({ request }: { request: Request }) => request.destination === "style",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "css-cache",
      },
    },
    {
      // Images
      urlPattern: ({ request }: { request: Request }) => request.destination === "image",
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: { maxEntries: 200 },
      },
    },
  ],

  navigateFallback: "/index.html",
};
