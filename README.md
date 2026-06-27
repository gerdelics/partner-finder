# PartnerFinder — for Fodor Bence

Spedíciós munkafolyamatot támogató PWA: fuvarozó partnerek kezelése, fuvarok nyomon követése és árrés optimalizálás.

## Stack

- **React 18 + TypeScript** — Vite 8, Atomic Design
- **Firebase Auth** — email/jelszó bejelentkezés
- **Firebase Realtime Database** — valós idejű adatszinkron, offline localStorage cache
- **Tailwind CSS v4** — mobilra optimalizált UI
- **vite-plugin-pwa** — telepíthető PWA, service worker

## Funkciók

| Funkció | Leírás |
|---|---|
| Partner CRUD | Fuvarozó partnerek kezelése (név, telefon, email, országok, jármű típus, ADR, emelőhátfal, részrakomány) |
| Intelligens keresés | NLP token alapú offline keresés (pl. „18t ADR román") |
| Szűrők | Ország, járműtípus, teherbírás, értékelés, szabad kapacitás |
| Partner értékelés | 1–5 csillag, szabad kapacitás jelzés |
| Ártörténet | Partner szintű árajánlat napló (útvonal, összeg, elfogadva/elutasítva) |
| Fuvar-követő | Fuvarok rögzítése ügyfél- és fuvarozói árakkal, valós idejű árrés számítással |
| Időszűrő | Összes / Elmúlt 30 nap / Előző hónap / Egyéni dátumintervallum |
| Árrés kalkulátor | Gyors overlay számológép telefonálás közben |
| CSV export | Partner- és fuvarlista letöltése Excel-kompatibilis formátumban |
| PWA | Telepíthető mobilra, offline olvasás localStorage cache-ből |

## Fejlesztés

```bash
npm install
npm run dev
```

A `.env` fájlhoz szükséges változók (lokálisan hozd létre, ne commitold):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_DATABASE_URL=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
```

## Adatbázis szabályok deploy

```bash
firebase login
firebase deploy --only database
```

## Seed adatok

10 partner + 10 fuvar betöltése a DB-be:

```bash
node seed.mjs <email> <jelszo>
```

## Deploy

A `main` branch push-ra automatikusan deployol GitHub Pages-re a `.github/workflows/deploy.yml` pipeline via GitHub Actions. A Firebase credentials GitHub Secrets-ként kell beállítani (`VITE_FIREBASE_*`).

Live: `https://gerdelics.github.io/partner-finder/`
