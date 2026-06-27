import { useState } from 'react'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Button } from '@/components/atoms/Button'
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
  const [form, setForm] = useState<FuvarInput>(() => {
    if (!initialValues) return EMPTY
    const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = initialValues
    if (!rest.partnerId && rest.partnerNev) {
      const match = partners.find(p => p.name === rest.partnerNev)
      if (match) return { ...rest, partnerId: match.id }
    }
    return rest
  })

  const set = (field: keyof FuvarInput, value: FuvarInput[keyof FuvarInput]) =>
    setForm(f => ({ ...f, [field]: value }))

  const handlePartnerSelect = (partnerId: string) => {
    const p = partners.find(p => p.id === partnerId)
    setForm(f => ({ ...f, partnerId: partnerId || null, partnerNev: p?.name ?? '' }))
  }

  const arres = form.ugyfelAr != null && form.fuvarozóAr != null
    ? form.ugyfelAr - form.fuvarozóAr
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Ügyfél */}
      <fieldset className="border border-gray-200 rounded-xl p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Ügyfél</legend>
        <Input
          id="fuvar-ugyfelnev"
          label="Ügyfél neve *"
          labelSize="xs"
          required
          value={form.ugyfelNev}
          onChange={e => set('ugyfelNev', e.target.value)}
          placeholder="Cégnév / személy"
        />
        <Input
          id="fuvar-ugyfelar"
          label="Ügyfél ára (EUR)"
          labelSize="xs"
          type="number"
          inputMode="decimal"
          value={form.ugyfelAr ?? ''}
          onChange={e => set('ugyfelAr', e.target.value ? Number(e.target.value) : null)}
          placeholder="0"
        />
      </fieldset>

      {/* Útvonal + rakomány */}
      <fieldset className="border border-gray-200 rounded-xl p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Útvonal / Rakomány</legend>
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="fuvar-from"
            label="Honnan *"
            labelSize="xs"
            required
            value={form.fromCountry}
            onChange={e => set('fromCountry', e.target.value)}
          >
            <option value="">Ország…</option>
            {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </Select>
          <Select
            id="fuvar-to"
            label="Hova *"
            labelSize="xs"
            required
            value={form.toCountry}
            onChange={e => set('toCountry', e.target.value)}
          >
            <option value="">Ország…</option>
            {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            id="fuvar-rakomany"
            label="Rakománytípus"
            labelSize="xs"
            value={form.rakomanytipus}
            onChange={e => set('rakomanytipus', e.target.value)}
          >
            <option value="">–</option>
            {VEHICLE_OPTIONS.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </Select>
          <Input
            id="fuvar-tomeg"
            label="Tömeg (t)"
            labelSize="xs"
            type="number"
            inputMode="decimal"
            value={form.tomeg ?? ''}
            onChange={e => set('tomeg', e.target.value ? Number(e.target.value) : null)}
            placeholder="0"
          />
        </div>
        <Input
          id="fuvar-datum"
          label="Szükséges dátum"
          labelSize="xs"
          type="date"
          value={form.datum}
          onChange={e => set('datum', e.target.value)}
        />
      </fieldset>

      {/* Fuvarozó */}
      <fieldset className="border border-gray-200 rounded-xl p-3 flex flex-col gap-3">
        <legend className="text-xs font-semibold text-gray-500 px-1">Fuvarozó</legend>
        <Select
          id="fuvar-partner"
          label="Partner kiválasztása"
          labelSize="xs"
          value={form.partnerId ?? ''}
          onChange={e => handlePartnerSelect(e.target.value)}
        >
          <option value="">– Nincs hozzárendelve –</option>
          {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
        <Input
          id="fuvar-fuvarozóar"
          label="Fuvarozó ára (EUR)"
          labelSize="xs"
          type="number"
          inputMode="decimal"
          value={form.fuvarozóAr ?? ''}
          onChange={e => set('fuvarozóAr', e.target.value ? Number(e.target.value) : null)}
          placeholder="0"
        />
        {arres !== null && (
          <div className={`rounded-lg px-3 py-2 text-sm font-semibold text-center ${arres >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            Árrés: {arres > 0 ? '+' : ''}{arres.toFixed(0)} EUR
            {form.ugyfelAr ? ` (${((arres / form.ugyfelAr) * 100).toFixed(1)}%)` : ''}
          </div>
        )}
      </fieldset>

      {/* Státusz + megjegyzés */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          id="fuvar-statusz"
          label="Státusz"
          labelSize="xs"
          value={form.statusz}
          onChange={e => set('statusz', e.target.value as Fuvar['statusz'])}
        >
          {STATUSZ_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </Select>
        <Input
          id="fuvar-megjegyzes"
          label="Megjegyzés"
          labelSize="xs"
          value={form.megjegyzes}
          onChange={e => set('megjegyzes', e.target.value)}
          placeholder="…"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button variant="ghost" type="button" onClick={onCancel} className="flex-1">Mégsem</Button>
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? 'Mentés...' : 'Mentés'}
        </Button>
      </div>
    </form>
  )
}
