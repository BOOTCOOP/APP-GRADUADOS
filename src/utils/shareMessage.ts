/**
 * Armado del mensaje y del link que se comparten desde el detalle de un
 * contenido (`SocialShare.vue`).
 *
 * Antes el mensaje de WhatsApp terminaba en una referencia inútil del estilo
 * "Taller #2062": quien lo recibía no tenía cómo llegar a la actividad. Ahora
 * siempre cierra con el link público al contenido, o al listado de la sección
 * si no sabemos la ruta exacta.
 *
 * Vive en `utils/` (y no dentro del componente) porque es lógica pura: así se
 * testea sin montar Ionic.
 */

import { publicUrl } from '@/uses/externalLinks'

export type ShareType = 'noticia' | 'taller' | 'curso' | 'empleo' | 'actividad'

export interface ShareData {
  title: string
  /** Bajada corta (docentes, fecha, empresa…). Se recorta a 100 caracteres. */
  text?: string
  /** URL pública ya armada. Si viene, gana sobre `path`. */
  url?: string
  /** Ruta interna del contenido, ej. `/taller/2062`. */
  path?: string
  type?: ShareType
}

/** Máximo de la bajada: un mensaje de WhatsApp que no se lee de un vistazo no se lee. */
const MAX_TEXT_LENGTH = 100

const PREFIJO: Record<ShareType, string> = {
  noticia: '📰 Noticia: ',
  taller: '🎓 Taller: ',
  curso: '📚 Curso: ',
  empleo: '💼 Empleo: ',
  actividad: '🎯 Actividad: ',
}

/** Invitación a abrir el link, según qué se está compartiendo. */
const INVITACION: Record<ShareType, string> = {
  noticia: 'Leé la noticia completa acá:',
  taller: 'Mirá el detalle e inscribite acá:',
  curso: 'Mirá el detalle e inscribite acá:',
  empleo: 'Mirá la búsqueda completa acá:',
  actividad: 'Mirá el detalle acá:',
}

/**
 * Listado de cada sección: es el fallback cuando no tenemos la ruta del ítem.
 * Coincide con los `path` de `src/router/index.ts`.
 */
const LISTADO: Record<ShareType, string> = {
  noticia: '/noticias',
  taller: '/talleres',
  curso: '/cursos',
  empleo: '/busqueda-laboral',
  actividad: '/talleres',
}

const FIRMA = 'Centro de Graduados - Facultad de Derecho (UBA)'

/**
 * Link público del contenido. Prioridad: `url` explícita → `path` explícito →
 * ruta actual del router → listado de la sección → inicio de la app.
 *
 * `currentPath` es `route.path`, no `window.location.href`: en el shell nativo
 * la segunda apunta al WebView (ver `publicUrl`).
 */
export function buildShareUrl(data: ShareData, currentPath?: string): string {
  if (data.url) return data.url

  const path =
    data.path ||
    (currentPath && currentPath !== '/' ? currentPath : '') ||
    (data.type ? LISTADO[data.type] : '')

  return publicUrl(path || '/')
}

/**
 * Mensaje para WhatsApp / portapapeles. El link va último y en su propia línea
 * para que WhatsApp lo detecte y le genere la previsualización.
 */
export function buildShareMessage(data: ShareData, url: string): string {
  const bloques = [`${data.type ? PREFIJO[data.type] : '📱 '}${data.title}`]

  const bajada = data.text?.trim()
  if (bajada) {
    bloques.push(
      bajada.length > MAX_TEXT_LENGTH
        ? `${bajada.substring(0, MAX_TEXT_LENGTH - 3)}...`
        : bajada
    )
  }

  bloques.push(FIRMA)
  bloques.push(`${data.type ? INVITACION[data.type] : 'Mirá más acá:'}\n${url}`)

  return bloques.join('\n\n')
}

/** Cuerpo del mail: mismo contenido, formato de carta. */
export function buildShareEmailBody(data: ShareData, url: string): string {
  const bajada = data.text?.trim()

  return [
    'Hola,',
    'Te comparto esta información del Centro de Graduados de la Facultad de Derecho (UBA):',
    [data.title, bajada].filter(Boolean).join('\n\n'),
    `Ver más: ${url}`,
    `--\n${FIRMA}`,
  ].join('\n\n')
}
