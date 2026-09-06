// Datos de la cuenta del Centro de Graduados y los mails de contacto.
//
// Única copia en el frontend: antes vivían hardcodeados dentro de
// views/inscriptions/AccountData.vue. El backend tiene los suyos en
// config/inscripciones.php (los usa el mail de inscripción a cursos), así que
// si cambia un CBU hay que tocar los dos lados — o pasar a servirlos desde la
// API, que sería lo correcto si esto se mueve seguido.

export const TRANSFERENCIA = {
  banco: 'Banco Nación Argentina — Sucursal Azcuénaga N° 18',
  domicilio: 'Av. Santa Fe 2299, C.A.B.A., Buenos Aires, Argentina',
  cuenta: 'Cuenta corriente N° 141434/89 — Facultad de Derecho UBA',
  cuit: '30-54666656-1',
  cbu: '01100037-20000141434894',
  swift: 'NACNARBA',
} as const

/** El comprobante va a contaduría; el título, al Centro de Graduados. */
export const EMAIL_COMPROBANTE = 'contablepos@derecho.uba.ar'
export const EMAIL_CONTACTO = 'graduados@derecho.uba.ar'

/** Las filas de la cuenta, listas para pintar como lista de etiqueta/valor. */
export const DATOS_TRANSFERENCIA: Array<{ label: string; value: string }> = [
  { label: 'Banco', value: TRANSFERENCIA.banco },
  { label: 'Domicilio', value: TRANSFERENCIA.domicilio },
  { label: 'Cuenta', value: TRANSFERENCIA.cuenta },
  { label: 'CUIT', value: TRANSFERENCIA.cuit },
  { label: 'CBU', value: TRANSFERENCIA.cbu },
  { label: 'SWIFT', value: TRANSFERENCIA.swift },
]
