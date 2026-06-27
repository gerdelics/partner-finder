import { useState } from 'react'
import { COUNTRY_OPTIONS, VEHICLE_OPTIONS } from '@/types/partner'
import { STATUSZ_OPTIONS } from '@/types/fuvar'
import type { Fuvar, FuvarInput } from '@/types/fuvar'
import type { Partner } from '@/types/partner'

interface FuvarFormProps {
  initialValues?: Fuvar
  partners: Partner[]
  onSubmit: (input: FuvarInput) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

const EMPTY: FuvarInput = {
  ugyfelNev: '', ugyfelAr: null,
  fromCountry: '', toCountry: '',
  rakomanytipus: '', tomeg: null,
  datum: new Date().toISOString().slice(0, 10),
  partnerId: null, partnerNev: '',
  fuvarozóAr: null,
  statusz: 'ajanlat', megjegyzes: '',
}

export function FuvarForm({ initialValues, partners, onSubmit, onCancel, isLoading }: FuvarFormProps) {
  const [form, setForm] = useState<FuvarInput>(
    initialValues
      ? (({ id, createdAt, updatedAt, ...rest }) => rest)(initialValues)
      : EMPTY
  )

  const set = (field: keyof FuvarInput, value: FuvarInput[keyof FuvarInput]) =>
    setForm(f => ({ ...f, [field]: value }))

  const handlePartnerSelect = (partnerId: string) => {
    const p = partners.find(p => p.id === partnerId)
    set('partnerId', partnerId || null)
    set('partnerNev', p?.name ?? '')
  }

  const arres = form.ugyfelAr != null && form.fuvarozóAr != null
    ? form.ugyfelAr - form.fuvarozóAr
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  const input = 'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const select = input + ' bg-white'
  const label = 'flex flex-col gap-1'
  const labelText = 'text-xs font-medium text-gray-600'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Ügyfél */}
      <fieldset className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Ügyfél</legend>
        <label className={label}>
          <span className={labelText}>Ügyfél neve *</span>
          <input className={input} required value={form.ugyfelNev}
            onChange={e => set('ugyfelNev', e.target.value)} placeholder="Cégnév / személy" />
        </label>
        <label className={label}>
          <span className={labelText}>Ügyfél ára (EUR)</span>
          <input className={input} type="number" inputMode="decimal" value={form.ugyfelAr ?? ''}
            onChange={e => set('ugyfelAr', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
        </label>
      </fieldset>

      {/* Útvonal + rakomány */}
      <fieldset className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Útvonal / Rakomány</legend>
        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            <span className={labelText}>Honnan *</span>
            <select className={select} required value={form.fromCountry}
              onChange={e => set('fromCountry', e.target.value)}>
              <option value="">Ország…</option>
              {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </label>
          <label className={label}>
            <span className={labelText}>Hova *</span>
            <select className={select} required value={form.toCountry}
              onChange={e => set('toCountry', e.target.value)}>
              <option value="">Ország…</option>
              {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className={label}>
            <span className={labelText}>Rakománytípus</span>
            <select className={select} value={form.rakomanytipus}
              onChange={e => set('rakomanytipus', e.target.value)}>
              <option value="">–</option>
              {VEHICLE_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </label>
          <label className={label}>
            <span className={labelText}>Tömeg (t)</span>
            <input className={input} type="number" inputMode="decimal" value={form.tomeg ?? ''}
              onChange={e => set('tomeg', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
          </label>
        </div>
        <label className={label}>
          <span className={labelText}>Szükséges dátum</span>
          <input className={input} type="date" value={form.datum}
            onChange={e => set('datum', e.target.value)} />
        </label>
      </fieldset>

      {/* Fuvarozó */}
      <fieldset className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Fuvarozó</legend>
        <label className={label}>
          <span className={labelText}>Partner kiválasztása</span>
          <select className={select} value={form.partnerId ?? ''}
            onChange={e => handlePartnerSelect(e.target.value)}>
            <option value="">– Nincs hozzárendelve –</option>
            {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label className={label}>
          <span className={labelText}>Fuvarozó ára (EUR)</span>
          <input className={input} type="number" inputMode="decimal" value={form.fuvarozóAr ?? ''}
            onChange={e => set('fuvarozóAr', e.target.value ? Number(e.target.value) : null)} placeholder="0" />
        </label>
        {arres !== null && (
          <div className={`rounded-lg px-3 py-2 text-sm font-semibold text-center ${arres >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            Árrés: {arres > 0 ? '+' : ''}{arres.toFixed(0)} EUR
            {form.ugyfelAr ? ` (${((arres / form.ugyfelAr) * 100).toFixed(1)}%)` : ''}
          </div>
        )}
      </fieldset>

      {/* Státusz + megjegyzés */}
      <div className="grid grid-cols-2 gap-3">
        <label className={label}>
          <span className={labelText}>Státusz</span>
          <select className={select} value={form.statusz}
            onChange={e => set('statusz', e.target.value as Fuvar['statusz'])}>
            {STATUSZ_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </label>
        <label className={label}>
          <span className={labelText}>Megjegyzés</span>
          <input className={input} value={form.megjegyzes}
            onChange={e => set('megjegyzes', e.target.value)} placeholder="…" />
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          Mégse
        </button>
        <button type="submit" disabled={isLoading}
          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium">
          {isLoading ? 'Mentés...' : 'Mentés'}
        </button>
      </div>
    </form>
  )
}
