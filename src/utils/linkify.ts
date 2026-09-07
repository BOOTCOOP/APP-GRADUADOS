// Convierte texto plano en segmentos, marcando las URLs que contiene.
//
// Los beneficios no tienen columna de link: la URL para acceder al descuento
// viene escrita dentro de la descripción. Como la app la pintaba con `{{ }}`,
// quedaba como texto muerto y no había forma de abrirla.

export interface TextSegment {
  type: 'text' | 'link'
  /** Lo que se muestra (la URL tal cual fue escrita, en los links). */
  value: string
  /** Sólo en links: la URL normalizada con esquema, lista para abrir. */
  href?: string
}

// http(s):// explícito, o algo que arranque con www. Se corta antes de la
// puntuación final para que "visitá www.ejemplo.com." no se lleve el punto.
const URL_PATTERN = /((?:https?:\/\/|www\.)[^\s<>"')]+)/gi

/** Puntuación de cierre que suele quedar pegada al final de una URL en prosa. */
const TRAILING = /[.,;:!?)\]}>'"]+$/

export function linkify(text?: string | null): TextSegment[] {
  if (!text) return []

  const segments: TextSegment[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const start = match.index ?? 0
    let raw = match[0]

    // Devolvemos la puntuación final al texto: no es parte de la URL.
    const trailing = raw.match(TRAILING)?.[0] ?? ''
    if (trailing) raw = raw.slice(0, -trailing.length)

    if (!raw) continue

    if (start > lastIndex) {
      segments.push({ type: 'text', value: text.slice(lastIndex, start) })
    }

    segments.push({
      type: 'link',
      value: raw,
      href: raw.startsWith('www.') ? `https://${raw}` : raw,
    })

    lastIndex = start + raw.length
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', value: text.slice(lastIndex) })
  }

  return segments
}

/** `true` si el texto tiene al menos una URL. */
export function hasLinks(text?: string | null): boolean {
  return linkify(text).some((segment) => segment.type === 'link')
}
