import { tailwindTheme } from '@srirag/leaf-design-system/tailwindTheme';

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: tailwindTheme,
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
