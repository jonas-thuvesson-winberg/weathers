// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import solidJs from "@astrojs/solid-js";
import svgr from "vite-plugin-svgr";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  prefetch: true,

  vite: {
    plugins: [
      tailwindcss(),
      svgr({
        include: "**/*.svg?component",
      }),
    ],
  },

  integrations: [solidJs()],
});
