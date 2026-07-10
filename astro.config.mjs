// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// Sitio de proyecto en GitHub Pages: https://thewiche.github.io/WajiraLand-Otherworld/
export default defineConfig({
  site: "https://thewiche.github.io",
  base: "/WajiraLand-Otherworld",
  trailingSlash: "ignore",

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
