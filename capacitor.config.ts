import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ar.uba.derecho.graduados",
  appName: "Graduados Derecho",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    SystemBars: {
      // Íconos oscuros de status/nav bar: la app es light-only (header claro).
      // Con targetSdk 36 el WebView es edge-to-edge; los insets los maneja
      // el puente CSS de src/theme/global.css.
      style: "DARK",
    },
    CapacitorUpdater: {
      // Modo manual/self-hosted: la app decide cuándo descargar y aplicar
      // (ver src/uses/otaUpdate.ts y docs/releases-y-actualizaciones.md).
      autoUpdate: false,
    },
  },
};

export default config;
