export interface Fuvar {
  id: string
  ugyfelNev: string
  ugyfelAr: number | null
  fromCountry: string
  toCountry: string
  rakomanytipus: string
  tomeg: number | null
  datum: string
  partnerId: string | null
  partnerNev: string
  fuvarozóAr: number | null
  statusz: 'ajanlat' | 'megrendelve' | 'teljesitve'
  megjegyzes: string
  createdAt: string
  updatedAt: string
}

export type FuvarInput = Omit<Fuvar, 'id' | 'createdAt' | 'updatedAt'>

export const STATUSZ_OPTIONS = [
  { value: 'ajanlat', label: 'Ajánlat' },
  { value: 'megrendelve', label: 'Megrendelve' },
  { value: 'teljesitve', label: 'Teljesítve' },
] as const

export const STATUSZ_COLORS: Record<Fuvar['statusz'], string> = {
  ajanlat: 'bg-yellow-100 text-yellow-800',
  megrendelve: 'bg-blue-100 text-blue-800',
  teljesitve: 'bg-green-100 text-green-800',
}
