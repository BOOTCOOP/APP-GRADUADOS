export function asset(path: string): string {
  // por ejemplo: "/storage/benefits/…"
  const base = (import.meta.env.VITE_API_URL || '')
    .replace(/\/api\/?$/, '')   // quita el “/api” del final
  // path puede venir con o sin “/” al inicio:
  return `${base}/${path.replace(/^\/+/, '')}`
}
