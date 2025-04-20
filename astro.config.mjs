// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import svgr from "vite-plugin-svgr";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),

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
