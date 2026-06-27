/**
 * Seed script: 10 partner + 10 fuvar a Firebase RTDB-be.
 * Futtatás: node seed.mjs <email> <jelszo>
 *
 * Az API key és DB URL a .env fájlból olvasódik (VITE_ prefix nélkül is próbálja).
 */

import https from 'https'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// .env betöltése kézi parse-szal (nincs npm dotenv szükség)
const __dirname = dirname(fileURLToPath(import.meta.url))
function loadEnv() {
  try {
    const raw = readFileSync(join(__dirname, '.env'), 'utf8')
    const env = {}
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([\w]+)\s*=\s*(.*)$/)
      if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '')
    }
    return env
  } catch {
    return {}
  }
}

const env = loadEnv()
const API_KEY = env.VITE_FIREBASE_API_KEY
const DB_URL = env.VITE_FIREBASE_DATABASE_URL?.replace(/\/$/, '')

if (!API_KEY || !DB_URL) {
  console.error('Hiányzik a .env fájlból: VITE_FIREBASE_API_KEY és/vagy VITE_FIREBASE_DATABASE_URL')
  process.exit(1)
}

const [,, email, password] = process.argv
if (!email || !password) {
  console.error('Használat: node seed.mjs <email> <jelszo>')
  process.exit(1)
}

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function request(method, url, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : undefined
    const parsed = new URL(url)
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }
    const req = https.request(options, res => {
      let raw = ''
      res.on('data', c => { raw += c })
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch { resolve(raw) }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

// ── Auth ─────────────────────────────────────────────────────────────────────

async function signIn(email, password) {
  const res = await request(
    'POST',
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    { email, password, returnSecureToken: true }
  )
  if (res.error) throw new Error(res.error.message)
  return { idToken: res.idToken, uid: res.localId }
}

// ── RTDB helpers ─────────────────────────────────────────────────────────────

function now() { return new Date().toISOString() }

function objMap(arr) {
  return arr.length ? Object.fromEntries(arr.map(v => [v, true])) : undefined
}

async function pushPartner(uid, idToken, data) {
  const res = await request(
    'POST',
    `${DB_URL}/users/${uid}/partners.json?auth=${idToken}`,
    data
  )
  return res.name
}

async function pushFuvar(uid, idToken, data) {
  const res = await request(
    'POST',
    `${DB_URL}/users/${uid}/fuvarok.json?auth=${idToken}`,
    data
  )
  return res.name
}

// ── Seed data ─────────────────────────────────────────────────────────────────

const PARTNERS = [
  {
    name: 'Müller Transport GmbH',
    phone: '+49 89 4521 8800',
    email: 'info@mueller-transport.de',
    countries: ['DE', 'AT', 'CH'],
    vehicleTypes: ['tautliner'],
    capacity: 24, tailLift: false, adr: true, partialLoad: false,
    notes: 'Megbízható, pontos. ADR I-VIII osztály.',
    rating: 5, available: true,
    priceHistory: {
      [Date.now() - 86400000]: { datum: '2026-06-15', fromCountry: 'HU', toCountry: 'DE', ar: 1350, elfogadva: true, megjegyzes: '' },
      [Date.now() - 172800000]: { datum: '2026-06-01', fromCountry: 'HU', toCountry: 'AT', ar: 900, elfogadva: false, megjegyzes: 'Drágállta' },
    },
  },
  {
    name: 'Ionescu Cargo SRL',
    phone: '+40 21 317 5500',
    email: 'disp@ionescucargo.ro',
    countries: ['RO', 'BG', 'GR'],
    vehicleTypes: ['tautliner', 'reefer'],
    capacity: 22, tailLift: true, adr: false, partialLoad: false,
    notes: 'Balkán specialista. Hátfalas is van.',
    rating: 4, available: false,
    priceHistory: {
      [Date.now() - 90000000]: { datum: '2026-06-10', fromCountry: 'RO', toCountry: 'DE', ar: 1450, elfogadva: true, megjegyzes: 'Jó ár' },
    },
  },
  {
    name: 'Kowalski Spedycja Sp. z o.o.',
    phone: '+48 22 640 3300',
    email: 'transport@kowalski.pl',
    countries: ['PL', 'DE', 'CZ', 'SK'],
    vehicleTypes: ['tautliner', 'flatbed'],
    capacity: 24, tailLift: true, adr: true, partialLoad: true,
    notes: 'PL–DE vonalon kiváló. Részrakományos is vállal.',
    rating: 4, available: true,
    priceHistory: {
      [Date.now() - 200000000]: { datum: '2026-05-20', fromCountry: 'PL', toCountry: 'FR', ar: 1800, elfogadva: true, megjegyzes: '' },
    },
  },
  {
    name: 'Bauer Logistik GmbH',
    phone: '+43 1 890 2244',
    email: 'office@bauer-logistik.at',
    countries: ['AT', 'DE', 'CH', 'IT'],
    vehicleTypes: ['box', 'tautliner'],
    capacity: 18, tailLift: true, adr: false, partialLoad: false,
    notes: 'Alpesi fuvarokra specializált.',
    rating: 3, available: false,
    priceHistory: {},
  },
  {
    name: 'Franzen & Söhne KG',
    phone: '+31 20 521 9900',
    email: 'planning@franzen.nl',
    countries: ['NL', 'BE', 'DE', 'FR', 'GB'],
    vehicleTypes: ['mega', 'tautliner'],
    capacity: 25, tailLift: false, adr: false, partialLoad: true,
    notes: 'Benelux körzet. Mega pótkocsik.',
    rating: 5, available: true,
    priceHistory: {
      [Date.now() - 300000000]: { datum: '2026-05-10', fromCountry: 'HU', toCountry: 'NL', ar: 1900, elfogadva: true, megjegyzes: 'Egyből igent mondott' },
    },
  },
  {
    name: 'Trans Italia Srl',
    phone: '+39 02 6611 4400',
    email: 'trasporti@transitalia.it',
    countries: ['IT', 'HR', 'SI', 'AT'],
    vehicleTypes: ['tautliner'],
    capacity: 22, tailLift: false, adr: false, partialLoad: false,
    notes: 'Olasz–Balkán tengely.',
    rating: 4, available: true,
    priceHistory: {},
  },
  {
    name: 'Magyar Fuvarozó Kft.',
    phone: '+36 1 430 5500',
    email: 'diszpecs@magyarfuvarozo.hu',
    countries: ['HU', 'SK', 'CZ', 'AT', 'RO'],
    vehicleTypes: ['tautliner', 'reefer'],
    capacity: 24, tailLift: true, adr: true, partialLoad: false,
    notes: 'Helyi partner, megbízható, ADR jogosult.',
    rating: 5, available: true,
    priceHistory: {
      [Date.now() - 100000000]: { datum: '2026-06-05', fromCountry: 'HU', toCountry: 'DE', ar: 1200, elfogadva: true, megjegyzes: '' },
    },
  },
  {
    name: 'Novak Transport s.r.o.',
    phone: '+421 2 4342 1100',
    email: 'disp@novaktransport.sk',
    countries: ['SK', 'CZ', 'AT', 'HU', 'PL'],
    vehicleTypes: ['flatbed', 'tautliner'],
    capacity: 20, tailLift: false, adr: false, partialLoad: true,
    notes: 'Platós speciális rakományokra is alkalmas.',
    rating: 3, available: false,
    priceHistory: {},
  },
  {
    name: 'Nordic Cargo AB',
    phone: '+46 8 667 7700',
    email: 'booking@nordiccargo.se',
    countries: ['SE', 'NO', 'DK', 'FI'],
    vehicleTypes: ['reefer', 'tautliner'],
    capacity: 20, tailLift: false, adr: false, partialLoad: false,
    notes: 'Skandináv körzet specialista.',
    rating: 4, available: false,
    priceHistory: {},
  },
  {
    name: 'Iberian Lines SL',
    phone: '+34 91 555 8800',
    email: 'ops@iberianlines.es',
    countries: ['ES', 'PT', 'FR'],
    vehicleTypes: ['tautliner'],
    capacity: 24, tailLift: false, adr: false, partialLoad: false,
    notes: 'Ibér-félsziget, hosszú fuvarok.',
    rating: 4, available: true,
    priceHistory: {
      [Date.now() - 400000000]: { datum: '2026-04-28', fromCountry: 'HU', toCountry: 'ES', ar: 2400, elfogadva: true, megjegyzes: 'Kicsit alkudtunk, 2400-ra jött le' },
    },
  },
]

const FUVAROK = [
  { ugyfelNev: 'Hartmann Handels GmbH', fromCountry: 'HU', toCountry: 'DE', rakomanytipus: 'tautliner', tomeg: 22, datum: '2026-07-03', ugyfelAr: 1800, fuvarozóAr: 1380, statusz: 'megrendelve', partnerNev: 'Müller Transport GmbH', megjegyzes: '' },
  { ugyfelNev: 'Alimenta Kft.', fromCountry: 'HU', toCountry: 'AT', rakomanytipus: 'reefer', tomeg: 18, datum: '2026-07-05', ugyfelAr: 1100, fuvarozóAr: 820, statusz: 'ajanlat', partnerNev: 'Magyar Fuvarozó Kft.', megjegyzes: 'Hűtős kell, 2-4 fok' },
  { ugyfelNev: 'Polska Chemia S.A.', fromCountry: 'PL', toCountry: 'FR', rakomanytipus: 'tautliner', tomeg: 24, datum: '2026-06-30', ugyfelAr: 2200, fuvarozóAr: 1750, statusz: 'teljesitve', partnerNev: 'Kowalski Spedycja Sp. z o.o.', megjegyzes: 'Teljesítve, számla kiállítva' },
  { ugyfelNev: 'RomAgro SRL', fromCountry: 'RO', toCountry: 'DE', rakomanytipus: 'tautliner', tomeg: 24, datum: '2026-07-08', ugyfelAr: 1650, fuvarozóAr: 1280, statusz: 'ajanlat', partnerNev: 'Ionescu Cargo SRL', megjegyzes: '' },
  { ugyfelNev: 'Baumax AG', fromCountry: 'AT', toCountry: 'IT', rakomanytipus: 'flatbed', tomeg: 15, datum: '2026-07-10', ugyfelAr: 1900, fuvarozóAr: 1500, statusz: 'megrendelve', partnerNev: 'Bauer Logistik GmbH', megjegyzes: 'Nyitott platform kell' },
  { ugyfelNev: 'ElektroStar Kft.', fromCountry: 'HU', toCountry: 'NL', rakomanytipus: 'mega', tomeg: 25, datum: '2026-07-02', ugyfelAr: 2400, fuvarozóAr: 1950, statusz: 'teljesitve', partnerNev: 'Franzen & Söhne KG', megjegyzes: '' },
  { ugyfelNev: 'Mercado Iberica SA', fromCountry: 'HU', toCountry: 'ES', rakomanytipus: 'tautliner', tomeg: 24, datum: '2026-07-15', ugyfelAr: 2600, fuvarozóAr: 2100, statusz: 'ajanlat', partnerNev: 'Iberian Lines SL', megjegyzes: 'Hosszú fuvar, előleg egyeztetés folyamatban' },
  { ugyfelNev: 'Scandi Foods AB', fromCountry: 'HU', toCountry: 'SE', rakomanytipus: 'reefer', tomeg: 20, datum: '2026-07-12', ugyfelAr: 3100, fuvarozóAr: 2500, statusz: 'megrendelve', partnerNev: 'Nordic Cargo AB', megjegyzes: 'Fagyasztott áru' },
  { ugyfelNev: 'AutoDíly s.r.o.', fromCountry: 'CZ', toCountry: 'DE', rakomanytipus: 'box', tomeg: 18, datum: '2026-07-04', ugyfelAr: 950, fuvarozóAr: 720, statusz: 'teljesitve', partnerNev: 'Novak Transport s.r.o.', megjegyzes: '' },
  { ugyfelNev: 'Balkán Build d.o.o.', fromCountry: 'HR', toCountry: 'DE', rakomanytipus: 'flatbed', tomeg: 20, datum: '2026-07-18', ugyfelAr: 1750, fuvarozóAr: 1400, statusz: 'ajanlat', partnerNev: 'Trans Italia Srl', megjegyzes: 'Acélszerkezet, túlméretes engedély lehet' },
]

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`Bejelentkezés: ${email}`)
  const { idToken, uid } = await signIn(email, password)
  console.log(`OK, UID: ${uid}\n`)

  console.log('Partnerek feltöltése...')
  const partnerIdsByName = {}
  for (const p of PARTNERS) {
    const { countries, vehicleTypes, priceHistory, ...rest } = p
    const id = await pushPartner(uid, idToken, {
      ...rest,
      countries: objMap(countries),
      vehicleTypes: objMap(vehicleTypes),
      priceHistory: Object.keys(priceHistory).length ? priceHistory : undefined,
      createdAt: now(), updatedAt: now(),
    })
    partnerIdsByName[p.name] = id
    console.log(`  ✓ ${p.name} → ${id}`)
  }

  console.log('\nFuvarok feltöltése...')
  for (const f of FUVAROK) {
    const partnerId = partnerIdsByName[f.partnerNev] ?? null
    const id = await pushFuvar(uid, idToken, {
      ...f,
      partnerId,
      createdAt: now(), updatedAt: now(),
    })
    console.log(`  ✓ ${f.ugyfelNev} (${f.fromCountry}→${f.toCountry}) → ${id}`)
  }

  console.log('\nKész! 10 partner + 10 fuvar feltöltve.')
}

main().catch(e => { console.error(e.message); process.exit(1) })
