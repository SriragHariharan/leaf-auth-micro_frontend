const { tailwindTheme } = require("../host/src/design-system/tailwindTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: tailwindTheme,
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
