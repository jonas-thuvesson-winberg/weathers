const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      screens: {
        ...defaultTheme.screens,
        xs: "300px",
        // sm: "600px",
        // md: "700px",
        // lg: "1000px",
        // xl: "1300px",
        // "2xl": "1536px",
      },
    },
  },
  plugins: [],
};
