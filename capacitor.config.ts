import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // appId: "com.kamecode.graduados",
  appId: "com.kamecode.graduados",
  appName: "Graduados Derecho",
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    allowNavigation: ["*"],
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
