// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import node from "@astrojs/node";
import solidJs from "@astrojs/solid-js";
import svgr from "vite-plugin-svgr";

import netlify from "@astrojs/netlify";

import mdx from "@astrojs/mdx";

import qwikdev from "@qwikdev/astro";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  vite: {
    plugins: [
      tailwindcss(),
      svgr({
        include: "**/*.svg?component",
      }),
    ],
  },

  integrations: [
    qwikdev({
      include: ["**/qwik/*"],
      exclude: ["**/solid/*"],
    }),
    solidJs({
      include: ["**/solid/*"],
      exclude: ["**/qwik/*"],
    }),
    mdx(),
  ],
});
