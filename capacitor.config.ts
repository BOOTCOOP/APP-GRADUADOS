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
    CapacitorUpdater: {
      // Modo manual/self-hosted: la app decide cuándo descargar y aplicar
      // (ver src/uses/otaUpdate.ts y docs/releases-y-actualizaciones.md).
      autoUpdate: false,
    },
  },
};

export default config;
