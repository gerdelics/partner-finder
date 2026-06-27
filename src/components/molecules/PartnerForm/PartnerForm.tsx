import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import { Textarea } from '@/components/atoms/Textarea'
import { Checkbox } from '@/components/atoms/Checkbox'
import { StarRating } from '@/components/atoms/StarRating'
import type { Partner, PartnerInput, PriceHistoryEntry } from '@/types/partner'
import { COUNTRY_OPTIONS, VEHICLE_OPTIONS } from '@/types/partner'

interface PartnerFormProps {
  initialValues?: Partial<Partner>
  onSubmit: (values: PartnerInput) => void
  onCancel: () => void
  isLoading?: boolean
}

interface FormErrors {
  name?: string
  email?: string
  countries?: string
}

const emptyForm = (): PartnerInput => ({
  name: '', phone: '', email: '',
  countries: [], vehicleTypes: [],
  capacity: null,
  tailLift: false, adr: false, partialLoad: false,
  notes: '',
  rating: null,
  available: false,
  priceHistory: [],
})

export function PartnerForm({ initialValues, onSubmit, onCancel, isLoading }: PartnerFormProps) {
  const [form, setForm] = useState<PartnerInput>(() => ({
    ...emptyForm(),
    ...(initialValues ? {
      name: initialValues.name ?? '',
      phone: initialValues.phone ?? '',
      email: initialValues.email ?? '',
      countries: initialValues.countries ?? [],
      vehicleTypes: initialValues.vehicleTypes ?? [],
      capacity: initialValues.capacity ?? null,
      tailLift: initialValues.tailLift ?? false,
      adr: initialValues.adr ?? false,
      partialLoad: initialValues.partialLoad ?? false,
      notes: initialValues.notes ?? '',
      rating: initialValues.rating ?? null,
      available: initialValues.available ?? false,
      priceHistory: initialValues.priceHistory ?? [],
    } : {}),
  }))
  const [errors, setErrors] = useState<FormErrors>({})
  const [newPrice, setNewPrice] = useState({ fromCountry: '', toCountry: '', ar: '', elfogadva: true, megjegyzes: '' })

  const set = <K extends keyof PartnerInput>(key: K, value: PartnerInput[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const toggleCountry = (code: string) =>
    set('countries', form.countries.includes(code)
      ? form.countries.filter(c => c !== code)
      : [...form.countries, code])

  const toggleVehicle = (v: string) =>
    set('vehicleTypes', form.vehicleTypes.includes(v)
      ? form.vehicleTypes.filter(x => x !== v)
      : [...form.vehicleTypes, v])

  const addPriceEntry = () => {
    if (!newPrice.ar) return
    const entry: PriceHistoryEntry = {
      id: Date.now().toString(),
      datum: new Date().toISOString().slice(0, 10),
      fromCountry: newPrice.fromCountry,
      toCountry: newPrice.toCountry,
      ar: Number(newPrice.ar),
      elfogadva: newPrice.elfogadva,
      megjegyzes: newPrice.megjegyzes,
    }
    set('priceHistory', [...form.priceHistory, entry])
    setNewPrice({ fromCountry: '', toCountry: '', ar: '', elfogadva: true, megjegyzes: '' })
  }

  const removePriceEntry = (id: string) =>
    set('priceHistory', form.priceHistory.filter(e => e.id !== id))

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'A név kötelező'
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Érvénytelen email cím'
    if (form.countries.length === 0) e.countries = 'Legalább egy ország szükséges'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input id="form-name" label="Név *" value={form.name}
          onChange={e => set('name', e.target.value)} error={errors.name} placeholder="pl. Müller Trans GmbH" />
        <Input id="form-phone" label="Telefonszám" value={form.phone}
          onChange={e => set('phone', e.target.value)} placeholder="+49 89 123456" />
        <Input id="form-email" label="Email" type="email" value={form.email}
          onChange={e => set('email', e.target.value)} error={errors.email} placeholder="info@example.com" />
        <Input id="form-capacity" label="Teherbírás (t)" type="number" value={form.capacity ?? ''}
          onChange={e => set('capacity', e.target.value ? Number(e.target.value) : null)} placeholder="pl. 18" />
      </div>

      {/* Értékelés + Elérhetőség */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Értékelés</span>
          <StarRating value={form.rating} onChange={v => set('rating', v)} />
        </div>
        <Checkbox id="form-available" label="Szabad kapacitás most"
          checked={form.available} onChange={v => set('available', v)} />
      </div>

      {/* Countries */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Országok *{' '}
          {errors.countries && <span className="text-red-600 font-normal text-xs">{errors.countries}</span>}
        </p>
        <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1">
          {COUNTRY_OPTIONS.map(({ code, label }) => (
            <Checkbox key={code} id={`form-country-${code}`} label={`${code} – ${label}`}
              checked={form.countries.includes(code)} onChange={() => toggleCountry(code)} />
          ))}
        </div>
      </div>

      {/* Vehicle types */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Jármű típusa</p>
        <div className="flex flex-wrap gap-3">
          {VEHICLE_OPTIONS.map(({ value, label }) => (
            <Checkbox key={value} id={`form-vehicle-${value}`} label={label}
              checked={form.vehicleTypes.includes(value)} onChange={() => toggleVehicle(value)} />
          ))}
        </div>
      </div>

      {/* Boolean flags */}
      <div className="flex flex-wrap gap-4">
        <Checkbox id="form-taillift" label="Emelőhátfal" checked={form.tailLift} onChange={v => set('tailLift', v)} />
        <Checkbox id="form-adr" label="ADR" checked={form.adr} onChange={v => set('adr', v)} />
        <Checkbox id="form-partialload" label="Részrakomány" checked={form.partialLoad} onChange={v => set('partialLoad', v)} />
      </div>

      {/* Ártörténet */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Ártörténet</p>
        {form.priceHistory.length > 0 && (
          <div className="mb-2 flex flex-col gap-1 max-h-32 overflow-y-auto">
            {form.priceHistory.map(e => (
              <div key={e.id} className="flex items-center gap-2 text-xs bg-gray-50 rounded px-2 py-1">
                <span className="text-gray-400">{e.datum}</span>
                <span className="font-medium">{e.fromCountry}→{e.toCountry}</span>
                <span className="font-semibold text-gray-800">{e.ar} EUR</span>
                <span className={e.elfogadva ? 'text-green-600' : 'text-red-500'}>{e.elfogadva ? '✓' : '✗'}</span>
                {e.megjegyzes && <span className="text-gray-400 truncate flex-1">{e.megjegyzes}</span>}
                <button type="button" onClick={() => removePriceEntry(e.id)}
                  className="text-gray-300 hover:text-red-400 ml-auto">×</button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 items-end bg-gray-50 rounded-xl p-2">
          <Select
            size="sm"
            value={newPrice.fromCountry}
            onChange={e => setNewPrice(p => ({ ...p, fromCountry: e.target.value }))}
            className="w-28"
          >
            <option value="">Honnan</option>
            {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </Select>
          <Select
            size="sm"
            value={newPrice.toCountry}
            onChange={e => setNewPrice(p => ({ ...p, toCountry: e.target.value }))}
            className="w-28"
          >
            <option value="">Hova</option>
            {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
          </Select>
          <Input
            size="sm"
            type="number"
            placeholder="EUR"
            value={newPrice.ar}
            onChange={e => setNewPrice(p => ({ ...p, ar: e.target.value }))}
            className="w-20"
          />
          <Checkbox
            id="price-entry-elfogadva"
            label="Elfog."
            checked={newPrice.elfogadva}
            onChange={v => setNewPrice(p => ({ ...p, elfogadva: v }))}
          />
          <Button type="button" size="sm" onClick={addPriceEntry}>+ Hozzáad</Button>
        </div>
      </div>

      {/* Notes */}
      <Textarea
        id="form-notes"
        label="Megjegyzés"
        value={form.notes}
        onChange={e => set('notes', e.target.value)}
        rows={2}
        placeholder="Egyéb megjegyzések..."
      />

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button variant="ghost" type="button" onClick={onCancel}>Mégsem</Button>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Mentés...' : 'Mentés'}</Button>
      </div>
    </form>
  )
}
