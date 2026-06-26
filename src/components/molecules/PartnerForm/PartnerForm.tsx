import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Checkbox } from '@/components/atoms/Checkbox'
import type { Partner, PartnerInput } from '@/types/partner'
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
  name: '',
  phone: '',
  email: '',
  countries: [],
  vehicleTypes: [],
  capacity: null,
  tailLift: false,
  adr: false,
  partialLoad: false,
  notes: '',
})

export function PartnerForm({ initialValues, onSubmit, onCancel, isLoading }: PartnerFormProps) {
  const [form, setForm] = useState<PartnerInput>(() => ({
    ...emptyForm(),
    ...(initialValues
      ? {
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
        }
      : {}),
  }))
  const [errors, setErrors] = useState<FormErrors>({})

  const set = <K extends keyof PartnerInput>(key: K, value: PartnerInput[K]) =>
    setForm(f => ({ ...f, [key]: value }))

  const toggleCountry = (code: string) =>
    set(
      'countries',
      form.countries.includes(code)
        ? form.countries.filter(c => c !== code)
        : [...form.countries, code]
    )

  const toggleVehicle = (v: string) =>
    set(
      'vehicleTypes',
      form.vehicleTypes.includes(v)
        ? form.vehicleTypes.filter(x => x !== v)
        : [...form.vehicleTypes, v]
    )

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
        <Input
          id="form-name"
          label="Név *"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          error={errors.name}
          placeholder="pl. Müller Trans GmbH"
        />
        <Input
          id="form-phone"
          label="Telefonszám"
          value={form.phone}
          onChange={e => set('phone', e.target.value)}
          placeholder="+49 89 123456"
        />
        <Input
          id="form-email"
          label="Email"
          type="email"
          value={form.email}
          onChange={e => set('email', e.target.value)}
          error={errors.email}
          placeholder="info@example.com"
        />
        <Input
          id="form-capacity"
          label="Teherbírás (t)"
          type="number"
          value={form.capacity ?? ''}
          onChange={e => set('capacity', e.target.value ? Number(e.target.value) : null)}
          placeholder="pl. 18"
        />
      </div>

      {/* Countries */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Országok *{' '}
          {errors.countries && (
            <span className="text-red-600 font-normal text-xs">{errors.countries}</span>
          )}
        </p>
        <div className="border rounded-md p-3 max-h-40 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-1">
          {COUNTRY_OPTIONS.map(({ code, label }) => (
            <Checkbox
              key={code}
              id={`form-country-${code}`}
              label={`${code} – ${label}`}
              checked={form.countries.includes(code)}
              onChange={() => toggleCountry(code)}
            />
          ))}
        </div>
      </div>

      {/* Vehicle types */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Jármű típusa</p>
        <div className="flex flex-wrap gap-3">
          {VEHICLE_OPTIONS.map(({ value, label }) => (
            <Checkbox
              key={value}
              id={`form-vehicle-${value}`}
              label={label}
              checked={form.vehicleTypes.includes(value)}
              onChange={() => toggleVehicle(value)}
            />
          ))}
        </div>
      </div>

      {/* Boolean flags */}
      <div className="flex flex-wrap gap-4">
        <Checkbox
          id="form-taillift"
          label="Emelőhátfal"
          checked={form.tailLift}
          onChange={v => set('tailLift', v)}
        />
        <Checkbox
          id="form-adr"
          label="ADR"
          checked={form.adr}
          onChange={v => set('adr', v)}
        />
        <Checkbox
          id="form-partialload"
          label="Részrakomány"
          checked={form.partialLoad}
          onChange={v => set('partialLoad', v)}
        />
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1">
        <label htmlFor="form-notes" className="text-sm font-medium text-gray-700">
          Megjegyzés
        </label>
        <textarea
          id="form-notes"
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          placeholder="Egyéb megjegyzések..."
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Mégsem
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Mentés...' : 'Mentés'}
        </Button>
      </div>
    </form>
  )
}
