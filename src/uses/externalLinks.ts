/**
 * Enlaces externos del Centro de Graduados en un solo lugar.
 *
 * Antes cada vista repetía la URL a mano (la playlist de YouTube estaba escrita
 * en tres archivos distintos), así que un cambio de canal obligaba a buscar y
 * reemplazar. Acá viven las constantes y los helpers que las abren.
 *
 * Apertura: `window.open(url, '_system')`. En Capacitor el bridge intercepta el
 * target `_system` y delega la URL al SO, que la resuelve con la app nativa
 * correspondiente (WhatsApp, YouTube, Instagram…) o, si no está instalada, con
 * el navegador. En la web es simplemente una pestaña nueva.
 */

/**
 * Playlist "Actividades Online" del Centro.
 *
 * OJO: no es lo mismo que el canal de abajo. "Actividades Online" (atajo del
 * inicio y ítem del menú) va a ESTA playlist; el "Canal de YouTube" de la
 * pantalla de Contacto va al canal de la Facultad. Son dos destinos distintos a
 * propósito, así que no los unifiques.
 */
export const YOUTUBE_PLAYLIST_URL =
  'https://www.youtube.com/playlist?list=PL9y1i2ILzxlA0gHxYkXcWlq31_UjsmDRj'

/** Canal de YouTube de la Facultad (link de la pantalla de Contacto). */
export const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@DerechoUBA'

/**
 * Teléfono de atención y consultas, en formato internacional sin `+` ni
 * separadores.
 *
 * Ojo con el `9` después del 54: para celulares argentinos WhatsApp exige
 * 54 + 9 + área + número. El valor que tenía la app (`541138315897`, sin el 9)
 * no resuelve a un chat. El sitio del Centro usa `wa.me/+5491138315897`, así que
 * ese es el número correcto.
 */
export const WHATSAPP_PHONE = '5491138315897'

/**
 * Link de WhatsApp. Usamos `wa.me` (el formato oficial de "click to chat") y NO
 * `web.whatsapp.com`: `wa.me` está declarado como App Link / Universal Link por
 * WhatsApp, así que en el celular el SO lo intercepta y abre la app nativa
 * directamente. `web.whatsapp.com` fuerza el cliente web —que en un celular
 * muestra el cartel de "usá WhatsApp en tu teléfono"— y era el motivo de que
 * tocar el contacto terminara en una página en vez de en el chat.
 */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_PHONE}`

/**
 * Link para compartir un texto por WhatsApp, sin destinatario fijo (lo elige la
 * persona en la app).
 *
 * Misma regla que arriba, y por el mismo motivo: `wa.me` es App Link / Universal
 * Link, así que en el celular el SO abre WhatsApp con el mensaje ya cargado.
 * `api.whatsapp.com/send` —que era lo que usaba el botón de compartir— mete una
 * página intermedia ("Continuar al chat") que en Android rearma el mensaje y en
 * la práctica entregaba SOLO el link del final, perdiendo título y datos. En
 * escritorio los dos funcionan, así que el bug solo se veía en el teléfono.
 */
export function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/** Casilla de consultas del Centro (soporte de cuentas, mails que no llegan). */
export const GRADUADOS_EMAIL = 'graduados@derecho.uba.ar'

/**
 * Base de la app web pública (GitHub Pages, la misma base `/APP-GRADUADOS/` que
 * arma `vite.config.ts` para el build web).
 *
 * Es el origen de TODO link que se comparte hacia afuera. `window.location.href`
 * no sirve para eso: en el shell nativo la app se sirve desde el WebView, así que
 * la URL es `capacitor://localhost/taller/2062` (iOS) o `http://localhost/...`
 * (Android) y no abre nada en el teléfono de quien recibe el mensaje. La web
 * pública, en cambio, resuelve para cualquiera, tenga o no la app instalada.
 */
export const PUBLIC_WEB_URL = 'https://bootcoop.github.io/APP-GRADUADOS'

/**
 * Convierte una ruta interna del router (`/taller/2062`) en un link público
 * compartible. Las rutas que llegan acá son las de `src/router/index.ts`: el
 * router ya descuenta la base, así que solo hay que prefijarla de nuevo.
 */
export function publicUrl(path = '/'): string {
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return `${PUBLIC_WEB_URL}${withSlash === '/' ? '' : withSlash}`
}

export const FACEBOOK_URL = 'https://www.facebook.com/Centrodegraduadasygraduados'
export const TWITTER_URL = 'https://x.com/graduadodchouba'
export const INSTAGRAM_URL = 'https://www.instagram.com/centrodegraduados'

/** Abre una URL fuera de la app (app nativa si existe, navegador si no). */
export function openExternal(url: string): void {
  window.open(url, '_system')
}

/** Actividades Online: va derecho a la playlist, sin pantalla intermedia. */
export function openYoutubePlaylist(): void {
  openExternal(YOUTUBE_PLAYLIST_URL)
}

/** Canal de YouTube de la Facultad (Contacto). */
export function openYoutubeChannel(): void {
  openExternal(YOUTUBE_CHANNEL_URL)
}

/** Atención y consultas: abre el chat en la app de WhatsApp. */
export function openWhatsapp(): void {
  openExternal(WHATSAPP_URL)
}

/** Consultas por mail: abre el cliente de correo con la casilla del Centro. */
export function openGraduadosMail(subject?: string): void {
  const query = subject ? `?subject=${encodeURIComponent(subject)}` : ''
  openExternal(`mailto:${GRADUADOS_EMAIL}${query}`)
}
