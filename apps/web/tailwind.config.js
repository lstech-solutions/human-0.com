/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // brand palette
        "human-bg-dark": "#050B10",
        "human-bg-light": "#F5F7F6",
        "human-surface-dark": "#091018",
        "human-surface-light": "#FFFFFF",

        "human-primary": "#00FF9C",
        "human-primary-muted": "#1ED88A",

        "human-text-dark": "#E6ECE8",
        "human-text-light": "#101418",
        "human-muted-dark": "#8F9DA2",
        "human-muted-light": "#6C767F",

        "human-border": "#1D2630",
        "human-error": "#FF4B6E",
        "human-warning": "#F5A623",
        "human-success": "#27AE60",
      },
      fontFamily: {
        space: ["spacegrotesk-regular", "System"],
        "space-semibold": ["spacegrotesk-semibold", "System"],
        inter: ["inter-regular", "System"],
      },
      borderRadius: {
        xl: 16,
        "2xl": 24,
      },
      spacing: {
        18: 72,
      },
      boxShadow: {
        "human-soft": "0 12px 40px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [],
};
