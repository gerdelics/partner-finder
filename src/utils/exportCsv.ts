import type { Partner } from '@/types/partner'
import type { Fuvar } from '@/types/fuvar'

function download(filename: string, csv: string) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function row(cells: (string | number | null | undefined)[]): string {
  return cells.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(';')
}

export function exportPartners(partners: Partner[]) {
  const header = row(['Név', 'Telefon', 'Email', 'Országok', 'Járműtípus', 'Kapacitás (t)', 'Hátfal', 'ADR', 'Részrakm.', 'Értékelés', 'Szabad', 'Megjegyzés'])
  const lines = partners.map(p => row([
    p.name, p.phone, p.email,
    p.countries.join(', '), p.vehicleTypes.join(', '),
    p.capacity, p.tailLift ? 'Igen' : 'Nem',
    p.adr ? 'Igen' : 'Nem', p.partialLoad ? 'Igen' : 'Nem',
    p.rating ?? '', p.available ? 'Igen' : 'Nem', p.notes,
  ]))
  download(`partnerek_${new Date().toISOString().slice(0, 10)}.csv`, [header, ...lines].join('\n'))
}

export function exportFuvarok(fuvarok: Fuvar[]) {
  const header = row(['Ügyfél', 'Honnan', 'Hova', 'Rakomány', 'Tömeg (t)', 'Dátum', 'Ügyfél ár (EUR)', 'Fuvarozó', 'Fuvarozó ár (EUR)', 'Árrés (EUR)', 'Státusz', 'Megjegyzés'])
  const lines = fuvarok.map(f => {
    const arres = f.ugyfelAr != null && f.fuvarozóAr != null ? f.ugyfelAr - f.fuvarozóAr : ''
    return row([
      f.ugyfelNev, f.fromCountry, f.toCountry,
      f.rakomanytipus, f.tomeg, f.datum,
      f.ugyfelAr, f.partnerNev, f.fuvarozóAr, arres,
      f.statusz, f.megjegyzes,
    ])
  })
  download(`fuvarok_${new Date().toISOString().slice(0, 10)}.csv`, [header, ...lines].join('\n'))
}
