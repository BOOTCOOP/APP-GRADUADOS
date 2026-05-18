import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // appId: "com.kamecode.graduados",
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
  },
};

export default config;
