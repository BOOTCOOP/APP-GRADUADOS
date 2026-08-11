import { sortByStartDate } from '@/utils/activities'

describe('sortByStartDate', () => {
  it('ordena por fecha de inicio ascendente', () => {
    const items = [
      { id: 3, start: '20/03/2026' },
      { id: 1, start: '05/01/2026' },
      { id: 2, start: '12/02/2026' },
    ]

    expect(sortByStartDate(items).map((a) => a.id)).toEqual([1, 2, 3])
  })

  it('mezcla los formatos de fecha que devuelve la API', () => {
    const items = [
      { id: 'iso', start: '2026-05-10' },
      { id: 'guiones', start: '01-04-2026' },
      { id: 'barras', start: '15/03/2026' },
    ]

    expect(sortByStartDate(items).map((a) => a.id)).toEqual([
      'barras',
      'guiones',
      'iso',
    ])
  })

  it('manda al final las actividades sin fecha válida', () => {
    const items = [
      { id: 'sin-fecha' },
      { id: 'basura', start: 'a confirmar' },
      { id: 'con-fecha', start: '12/02/2026' },
    ]

    expect(sortByStartDate(items).map((a) => a.id)).toEqual([
      'con-fecha',
      'sin-fecha',
      'basura',
    ])
  })

  it('invierte el orden con direction "desc" (histórico)', () => {
    const items = [
      { id: 1, start: '05/01/2026' },
      { id: 3, start: '20/03/2026' },
      { id: 2, start: '12/02/2026' },
    ]

    expect(sortByStartDate(items, 'desc').map((a) => a.id)).toEqual([3, 2, 1])
  })

  it('no muta el array original y respeta el orden del backend en empates', () => {
    const items = [
      { id: 'b', start: '12/02/2026' },
      { id: 'a', start: '12/02/2026' },
    ]

    expect(sortByStartDate(items).map((a) => a.id)).toEqual(['b', 'a'])
    expect(items.map((a) => a.id)).toEqual(['b', 'a'])
  })
})
