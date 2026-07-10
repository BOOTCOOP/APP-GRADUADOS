// Comparación de versiones semver "x.y.z" sin dependencias externas.
// Tolera partes faltantes o no numéricas (se tratan como 0).
// Retorna -1 si a < b, 0 si son iguales, 1 si a > b.
export function compareVersions(a: string, b: string): number {
  const partsA = String(a || '').split('.');
  const partsB = String(b || '').split('.');

  for (let i = 0; i < 3; i++) {
    const numA = parseInt(partsA[i], 10) || 0;
    const numB = parseInt(partsB[i], 10) || 0;

    if (numA < numB) return -1;
    if (numA > numB) return 1;
  }

  return 0;
}
