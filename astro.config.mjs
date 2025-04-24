// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import svgr from "vite-plugin-svgr";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),

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