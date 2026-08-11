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

// --- Validación de la versión contra el último OTA publicado -----------------
// OTA y tienda comparten una única línea de versiones siempre creciente: la app
// compara la versión del manifiesto contra la del bundle que corre
// (evaluateManifest() en src/uses/otaUpdate.ts), así que un bundle con versión
// igual o menor que la publicada se ve como "up-to-date" y NUNCA se aplica, en
// silencio. Mismo criterio que src/utils/semver.ts.
function compararVersiones(a, b) {
  const partesA = String(a || "").split(".");
  const partesB = String(b || "").split(".");
  for (let i = 0; i < 3; i++) {
    const numA = parseInt(partesA[i], 10) || 0;
    const numB = parseInt(partesB[i], 10) || 0;
    if (numA !== numB) return numA < numB ? -1 : 1;
  }
  return 0;
}

const manifestPath = path.join(ROOT, "public", "ota", "latest.json");
if (!fs.existsSync(manifestPath)) {
  console.warn(
    "\n[make-bundle] AVISO: no encontré public/ota/latest.json, no puedo verificar que la versión suba.\n"
  );
} else {
  let publicada;
  try {
    publicada = JSON.parse(fs.readFileSync(manifestPath, "utf8")).version;
  } catch (e) {
    abort(`public/ota/latest.json no es JSON válido: ${e.message}`);
  }

  if (compararVersiones(version, publicada) <= 0 && !process.env.OTA_ALLOW_SAME_VERSION) {
    abort(
      `La versión de package.json (${version}) no supera la del último OTA publicado (${publicada}).\n` +
        "  Un bundle con versión igual o menor nunca se aplica: la app lo ve como \"up-to-date\".\n" +
        "  Bumpeá package.json a un número mayor.\n" +
        "  Si editaste public/ota/latest.json antes de generar el zip, volvé a dejarle la versión\n" +
        "  anterior: el manifiesto se actualiza DESPUÉS (paso 4 del proceso OTA).\n" +
        "  Para reempaquetar a propósito una versión ya publicada: OTA_ALLOW_SAME_VERSION=1 npm run ota:build"
    );
  }
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
// Regex y no string exacto: Vite emite <base href="/" /> (con espacio antes de />).
if (!/<base href="\/"\s*\/?>/.test(indexHtml)) {
  abort(
    'dist/index.html no contiene <base href="/">. ' +
      "Verificá que el build sea nativo (npm run ota:build usa build:native)."
  );
}

// --- Validación de URL de API ------------------------------------------------
// VITE_API_URL queda embebida en el JS en build time. Si el build se hizo con
// el .env local (localhost / IP de LAN), el bundle rompe la app en los teléfonos.
// Escaneo recursivo: Vite emite a dist/assets/, pero no dependemos de la ruta.
function listarJs(dir) {
  const resultado = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    const relativo = path.relative(distDir, p).replace(/\\/g, "/");
    if (entrada.isDirectory()) {
      if (relativo === "ota") continue; // artefactos del servidor OTA, no de la app
      resultado.push(...listarJs(p));
    } else if (entrada.name.endsWith(".js")) {
      resultado.push(p);
    }
  }
  return resultado;
}

// Solo URLs de API de desarrollo (terminan en /api, como en .env): un
// "localhost:3000" suelto dentro de una librería de terceros no es problema.
const devUrl = /https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+):\d+\/api/;
for (const archivo of listarJs(distDir)) {
  const m = fs.readFileSync(archivo, "utf8").match(devUrl);
  if (m) {
    const relativo = path.relative(distDir, archivo).replace(/\\/g, "/");
    abort(
      `El build tiene una URL de desarrollo embebida ("${m[0]}" en ${relativo}). ` +
        "Tu .env local está pisando VITE_API_URL. Corré el build forzando la URL de producción:\n" +
        '  $env:VITE_API_URL="https://graduados.derecho.uba.ar/api"; npm run ota:build'
    );
  }
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
