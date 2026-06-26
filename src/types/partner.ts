export interface Partner {
  id: string
  name: string
  phone: string
  email: string
  countries: string[]
  vehicleTypes: string[]
  capacity: number | null
  tailLift: boolean
  adr: boolean
  partialLoad: boolean
  notes: string
  createdAt: string
  updatedAt: string
}

export type PartnerInput = Omit<Partner, 'id' | 'createdAt' | 'updatedAt'>

export interface SearchFilters {
  countries: string[]
  vehicleTypes: string[]
  minCapacity: number | null
  tailLift: boolean | null
  adr: boolean | null
  partialLoad: boolean | null
}

export const VEHICLE_OPTIONS = [
  { value: 'tautliner', label: 'Tautliner / Ponyvás' },
  { value: 'reefer', label: 'Hűtős' },
  { value: 'flatbed', label: 'Platós / Rönkös' },
  { value: 'box', label: 'Dobozos' },
  { value: 'tanker', label: 'Tartályos' },
  { value: 'mega', label: 'Mega' },
] as const

export const COUNTRY_OPTIONS = [
  { code: 'AT', label: 'Ausztria' },
  { code: 'BE', label: 'Belgium' },
  { code: 'BG', label: 'Bulgária' },
  { code: 'CH', label: 'Svájc' },
  { code: 'CZ', label: 'Csehország' },
  { code: 'DE', label: 'Németország' },
  { code: 'DK', label: 'Dánia' },
  { code: 'ES', label: 'Spanyolország' },
  { code: 'FI', label: 'Finnország' },
  { code: 'FR', label: 'Franciaország' },
  { code: 'GB', label: 'Nagy-Britannia' },
  { code: 'GR', label: 'Görögország' },
  { code: 'HR', label: 'Horvátország' },
  { code: 'HU', label: 'Magyarország' },
  { code: 'IT', label: 'Olaszország' },
  { code: 'NL', label: 'Hollandia' },
  { code: 'NO', label: 'Norvégia' },
  { code: 'PL', label: 'Lengyelország' },
  { code: 'PT', label: 'Portugália' },
  { code: 'RO', label: 'Románia' },
  { code: 'RS', label: 'Szerbia' },
  { code: 'SE', label: 'Svédország' },
  { code: 'SI', label: 'Szlovénia' },
  { code: 'SK', label: 'Szlovákia' },
  { code: 'UA', label: 'Ukrajna' },
] as const
