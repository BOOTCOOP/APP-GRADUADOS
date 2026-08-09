import {
  laptopOutline,
  locationOutline,
  swapHorizontalOutline,
} from 'ionicons/icons'

export type ModalityKind = 'virtual' | 'presencial' | 'hibrida'

/**
 * El backend manda la modalidad como texto libre ("Virtual", "Presencial",
 * "Híbrida", "A distancia"...), así que se normaliza por coincidencia y cae
 * en presencial cuando no reconoce nada.
 */
export function modalityKind(modality?: string | null): ModalityKind {
  const text = (modality ?? '').toLowerCase()

  if (
    text.includes('virtual') ||
    text.includes('online') ||
    text.includes('distancia')
  ) {
    return 'virtual'
  }

  if (
    text.includes('brid') ||
    text.includes('mixta') ||
    text.includes('combinada')
  ) {
    return 'hibrida'
  }

  return 'presencial'
}

export function modalityIcon(kind: ModalityKind) {
  if (kind === 'virtual') return laptopOutline
  if (kind === 'hibrida') return swapHorizontalOutline
  return locationOutline
}
