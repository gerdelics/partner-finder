import type { Partner, SearchFilters } from '@/types/partner'

export interface ParsedQuery {
  countries: string[]
  vehicleTypes: string[]
  minCapacity: number | null
  tailLift: boolean | null
  adr: boolean | null
  partialLoad: boolean | null
  rawTerms: string[]
}

const COUNTRY_MAP: Record<string, string> = {
  'német': 'DE', 'németország': 'DE', 'németországi': 'DE',
  'magyar': 'HU', 'magyarország': 'HU', 'magyarországi': 'HU',
  'osztrák': 'AT', 'ausztria': 'AT', 'ausztriai': 'AT',
  'román': 'RO', 'románia': 'RO', 'romániai': 'RO',
  'lengyel': 'PL', 'lengyelország': 'PL', 'lengyelországi': 'PL',
  'cseh': 'CZ', 'csehország': 'CZ', 'csehországi': 'CZ',
  'szlovák': 'SK', 'szlovákia': 'SK', 'szlovákiai': 'SK',
  'olasz': 'IT', 'olaszország': 'IT', 'olaszországi': 'IT',
  'holland': 'NL', 'hollandia': 'NL', 'hollandiai': 'NL',
  'belga': 'BE', 'belgium': 'BE', 'belgiumi': 'BE',
  'francia': 'FR', 'franciaország': 'FR', 'franciaországi': 'FR',
  'spanyol': 'ES', 'spanyolország': 'ES', 'spanyolországi': 'ES',
  'svájci': 'CH', 'svájc': 'CH',
  'szerb': 'RS', 'szerbia': 'RS', 'szerbiai': 'RS',
  'horvát': 'HR', 'horvátország': 'HR', 'horvátországi': 'HR',
  'szlovén': 'SI', 'szlovénia': 'SI', 'szlovéniai': 'SI',
  'bolgár': 'BG', 'bulgária': 'BG', 'bulgáriai': 'BG',
  'görög': 'GR', 'görögország': 'GR', 'görögországi': 'GR',
  'svéd': 'SE', 'svédország': 'SE', 'svédországi': 'SE',
  'dán': 'DK', 'dánia': 'DK', 'dániai': 'DK',
  'brit': 'GB', 'angol': 'GB', 'britannia': 'GB',
  'finn': 'FI', 'finnország': 'FI', 'finnországi': 'FI',
  'norvég': 'NO', 'norvégia': 'NO', 'norvégiai': 'NO',
  'portugál': 'PT', 'portugália': 'PT',
  'ukrán': 'UA', 'ukrajna': 'UA', 'ukrajnai': 'UA',
}

const VEHICLE_MAP: Record<string, string> = {
  'tautliner': 'tautliner', 'ponyva': 'tautliner', 'ponyvás': 'tautliner',
  'függönyös': 'tautliner', 'függöny': 'tautliner',
  'hűtős': 'reefer', 'reefer': 'reefer', 'hűtő': 'reefer',
  'platós': 'flatbed', 'plató': 'flatbed', 'flatbed': 'flatbed',
  'rönkös': 'flatbed', 'rönk': 'flatbed', 'nyitott': 'flatbed',
  'dobozos': 'box', 'box': 'box',
  'tartályos': 'tanker', 'tanker': 'tanker', 'tartály': 'tanker',
  'mega': 'mega',
}

const CAPACITY_REGEX = /(\d+(?:[.,]\d+)?)\s*(?:tonn[aá]s?|t(?:\b|on))/gi

export function parseNLPQuery(input: string): ParsedQuery {
  const lower = input.toLowerCase().trim()

  const result: ParsedQuery = {
    countries: [],
    vehicleTypes: [],
    minCapacity: null,
    tailLift: null,
    adr: null,
    partialLoad: null,
    rawTerms: [],
  }

  // Capacity
  const capacityMatch = CAPACITY_REGEX.exec(lower)
  if (capacityMatch) {
    result.minCapacity = parseFloat(capacityMatch[1].replace(',', '.'))
  }
  CAPACITY_REGEX.lastIndex = 0

  // Also match bare numbers like "18" when followed by context words
  if (result.minCapacity === null) {
    const bareNum = lower.match(/\b(\d+)\s+tonn/)
    if (bareNum) result.minCapacity = parseInt(bareNum[1], 10)
  }

  // Booleans
  if (/hátfal|hátsófal|lift|emelőhátfal/.test(lower)) result.tailLift = true
  if (/\badr\b/.test(lower)) result.adr = true
  if (/részrakomány|részrakományos|\bltl\b|part\s?load/.test(lower)) result.partialLoad = true

  // Countries (substring match to handle compound words)
  const foundCountries = new Set<string>()
  for (const [token, code] of Object.entries(COUNTRY_MAP)) {
    if (lower.includes(token)) foundCountries.add(code)
  }
  result.countries = [...foundCountries]

  // Vehicle types
  const foundVehicles = new Set<string>()
  for (const [token, type] of Object.entries(VEHICLE_MAP)) {
    if (lower.includes(token)) foundVehicles.add(type)
  }
  result.vehicleTypes = [...foundVehicles]

  // Raw terms for name/notes fallback
  const tokens = lower.split(/\s+/).filter(Boolean)
  const allKnownTokens = [
    ...Object.keys(COUNTRY_MAP),
    ...Object.keys(VEHICLE_MAP),
    'hátfal', 'hátsófal', 'lift', 'adr', 'részrakomány', 'részrakományos',
    'ltl', 'tonna', 'tonnás', 'emelőhátfal',
  ]
  result.rawTerms = tokens.filter(t => {
    if (/^\d+$/.test(t)) return false
    return !allKnownTokens.some(k => t.includes(k) || k.includes(t))
  })

  return result
}

export function matchesQuery(
  partner: Partner,
  parsed: ParsedQuery,
  structured: SearchFilters
): boolean {
  // NLP criteria
  if (parsed.countries.length > 0 && !parsed.countries.some(c => partner.countries.includes(c)))
    return false
  if (parsed.vehicleTypes.length > 0 && !parsed.vehicleTypes.some(v => partner.vehicleTypes.includes(v)))
    return false
  if (parsed.minCapacity !== null && (partner.capacity === null || partner.capacity < parsed.minCapacity))
    return false
  if (parsed.tailLift === true && !partner.tailLift) return false
  if (parsed.adr === true && !partner.adr) return false
  if (parsed.partialLoad === true && !partner.partialLoad) return false

  // Raw term substring in name/notes/email
  for (const term of parsed.rawTerms) {
    const haystack = `${partner.name} ${partner.notes} ${partner.email}`.toLowerCase()
    if (!haystack.includes(term)) return false
  }

  // Structured filters
  if (structured.countries.length > 0 && !structured.countries.some(c => partner.countries.includes(c)))
    return false
  if (structured.vehicleTypes.length > 0 && !structured.vehicleTypes.some(v => partner.vehicleTypes.includes(v)))
    return false
  if (structured.minCapacity !== null && (partner.capacity === null || partner.capacity < structured.minCapacity))
    return false
  if (structured.tailLift !== null && partner.tailLift !== structured.tailLift) return false
  if (structured.adr !== null && partner.adr !== structured.adr) return false
  if (structured.partialLoad !== null && partner.partialLoad !== structured.partialLoad) return false

  return true
}
