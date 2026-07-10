#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
// Empaqueta el build nativo (dist/) como un bundle OTA para @capgo/capacitor-updater.
//
// Uso: npm run ota:build   (corre build:native y después este script)
//
// Genera bundle-<version>.zip en la raíz del repo, con el CONTENIDO de dist/
// en la raíz del zip (index.html arriba de todo, NO dentro de una carpeta dist/),
// que es el formato que espera CapacitorUpdater.download().

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");

function abort(mensaje) {
  console.error(`\n[make-bundle] ERROR: ${mensaje}\n`);
  process.exit(1);
}

// --- Versión desde package.json -------------------------------------------
let version;
try {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
  version = pkg.version;
} catch (e) {
  abort(`No pude leer package.json en la raíz del repo: ${e.message}`);
}
if (!version || typeof version !== "string") {
  abort("package.json no tiene un campo \"version\" válido.");
}

// --- Validación del dist ----------------------------------------------------
const distDir = path.join(ROOT, "dist");
const indexPath = path.join(distDir, "index.html");

if (!fs.existsSync(indexPath)) {
  abort("No existe dist/index.html. Corré npm run ota:build (usa build:native).");
}

const indexHtml = fs.readFileSync(indexPath, "utf8");

// Un build web (GitHub Pages) tiene <base href="/APP-GRADUADOS/">: si lo
// empaquetamos como bundle OTA, la app nativa no resuelve ningún asset.
if (indexHtml.includes('href="/APP-GRADUADOS/"')) {
  abort("El dist actual es un build web (Pages). Corré npm run ota:build (usa build:native).");
}
if (!indexHtml.includes('<base href="/"/>') && !indexHtml.includes('<base href="/">')) {
  abort(
    'dist/index.html no contiene <base href="/">. ' +
      "Verificá que el build sea nativo (npm run ota:build usa build:native)."
  );
}

// --- Zip --------------------------------------------------------------------
let AdmZip;
try {
  AdmZip = require("adm-zip");
} catch (e) {
  abort("Falta el paquete adm-zip. Instalalo con: npm install -D adm-zip");
}

const zipName = `bundle-${version}.zip`;
const zipPath = path.join(ROOT, zipName);

try {
  const zip = new AdmZip();
  // Contenido de dist/ en la raíz del zip (index.html en la raíz, sin carpeta dist/).
  // Se excluye ota/: ahí viven el manifiesto y los zips de bundles anteriores
  // (artefactos del servidor, no de la app) — sin esto, cada bundle contendría
  // los zips de los bundles previos y crecería sin límite.
  zip.addLocalFolder(distDir, "", (p) => !p.replace(/\\/g, "/").startsWith("ota/"));
  zip.writeZip(zipPath);
} catch (e) {
  abort(`No pude generar el zip: ${e.message}`);
}

const sizeMB = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);

console.log(`\n[make-bundle] Bundle generado: ${zipName} (${sizeMB} MB)\n`);
console.log("Próximos pasos:");
console.log(`  1. gh release create bundle-${version} ${zipName}`);
console.log(`  2. Actualizar public/ota/latest.json (version: "${version}" y url del release).`);
console.log("  3. commit + push (el deploy de Pages publica el nuevo latest.json).\n");
