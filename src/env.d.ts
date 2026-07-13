/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API (definida en .env) */
  readonly VITE_API_URL: string;
  /** Deriva las claves de localStorage — NO cambiar el valor "graduados" o los usuarios pierden la sesión */
  readonly VITE_APPLICATION_NAME: string;
  /** Versión del bundle JS (inyectada por define() en vite.config.ts desde package.json) */
  readonly VITE_APP_VERSION: string;
  /** Override del manifiesto OTA, solo para pruebas (otaUpdate.ts tiene fallback a Pages) */
  readonly VITE_OTA_MANIFEST_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
