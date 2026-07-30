/**
 * Feedback táctil para acciones primarias (tocar un acceso rápido, confirmar).
 *
 * `@capacitor/haptics` ya estaba en package.json pero no se usaba en ninguna
 * pantalla. En la web el plugin no está implementado y su promesa rechaza, así
 * que cortamos antes con `isNativePlatform()` y además atrapamos cualquier error
 * (un dispositivo puede no tener motor de vibración o tenerlo deshabilitado):
 * el haptic es un adorno, nunca debe romper la navegación.
 */
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'

export function tapFeedback(style: ImpactStyle = ImpactStyle.Light): void {
  if (!Capacitor.isNativePlatform()) return

  Haptics.impact({ style }).catch(() => {
    /* sin motor de vibración o permiso: se ignora en silencio */
  })
}
