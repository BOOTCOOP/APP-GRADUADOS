import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import { version } from "./package.json";

// CAPACITOR_BUILD=1 → build para el shell nativo (el WebView sirve desde /).
// Sin la flag, el build de producción usa la base de GitHub Pages. Dev siempre "/".
export default defineConfig(({ command }) => {
  const esCapacitor = process.env.CAPACITOR_BUILD === "1";
  return {
    base: esCapacitor || command === "serve" ? "/" : "/APP-GRADUADOS/",
    plugins: [vue()],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    server: { port: 8080 },
    define: {
      // Versión del bundle JS (fuente de verdad: package.json); la leen Menu.vue y otaUpdate.ts
      "import.meta.env.VITE_APP_VERSION": JSON.stringify(version),
      // Flags de Vue: la app usa Options API en algunas vistas + Vuex
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    build: {
      outDir: "dist",
      // Piso de transpilación alineado a .browserslistrc: los bundles OTA van a
      // WebViews de instalaciones existentes, no subir sin coordinar con un release.
      target: ["chrome61", "firefox63", "safari13", "edge79"],
    },
    test: {
      globals: true,
      environment: "jsdom",
      include: ["tests/unit/**/*.spec.ts"],
    },
  };
});
