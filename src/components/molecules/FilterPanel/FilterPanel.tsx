import { useState } from 'react'
import { Checkbox } from '@/components/atoms/Checkbox'
import { Input } from '@/components/atoms/Input'
import { StarRating } from '@/components/atoms/StarRating'
import type { SearchFilters } from '@/types/partner'
import { COUNTRY_OPTIONS, VEHICLE_OPTIONS } from '@/types/partner'

interface FilterPanelProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}

function TriFilter({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex gap-2">
        {(['null', 'true', 'false'] as const).map(v => (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v === 'null' ? null : v === 'true')}
            className={[
              'px-2 py-1 text-xs rounded border transition-colors',
              (v === 'null' ? value === null : value === (v === 'true'))
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
            ].join(' ')}
          >
            {v === 'null' ? 'Bármely' : v === 'true' ? 'Igen' : 'Nem'}
          </button>
        ))}
      </div>
    </div>
  )
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [showCountries, setShowCountries] = useState(false)

  const toggleCountry = (code: string) => {
    const next = filters.countries.includes(code)
      ? filters.countries.filter(c => c !== code)
      : [...filters.countries, code]
    onChange({ ...filters, countries: next })
  }

  const toggleVehicle = (v: string) => {
    const next = filters.vehicleTypes.includes(v)
      ? filters.vehicleTypes.filter(x => x !== v)
      : [...filters.vehicleTypes, v]
    onChange({ ...filters, vehicleTypes: next })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {/* Countries */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setShowCountries(s => !s)}
          className="text-sm font-medium text-gray-700 text-left flex items-center gap-1"
        >
          Ország {filters.countries.length > 0 && (
            <span className="bg-blue-700 text-white text-xs rounded-full px-1.5">
              {filters.countries.length}
            </span>
          )}
          <span className="ml-auto text-gray-400">{showCountries ? '▲' : '▼'}</span>
        </button>
        {showCountries && (
          <div className="overflow-y-auto max-h-40 border border-gray-200 rounded p-2 grid grid-cols-2 gap-1">
            {COUNTRY_OPTIONS.map(({ code, label }) => (
              <Checkbox
                key={code}
                id={`country-${code}`}
                label={`${code} – ${label}`}
                checked={filters.countries.includes(code)}
                onChange={() => toggleCountry(code)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Vehicle types */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Jármű típusa</span>
        <div className="flex flex-col gap-1">
          {VEHICLE_OPTIONS.map(({ value, label }) => (
            <Checkbox
              key={value}
              id={`vehicle-${value}`}
              label={label}
              checked={filters.vehicleTypes.includes(value)}
              onChange={() => toggleVehicle(value)}
            />
          ))}
        </div>
      </div>

      {/* Min capacity */}
      <div>
        <Input
          id="filter-capacity"
          type="number"
          label="Min. teherbírás (t)"
          placeholder="pl. 18"
          value={filters.minCapacity ?? ''}
          onChange={e =>
            onChange({
              ...filters,
              minCapacity: e.target.value ? Number(e.target.value) : null,
            })
          }
        />
      </div>

      {/* Boolean filters */}
      <div className="flex flex-col gap-3">
        <TriFilter
          label="Emelőhátfal"
          value={filters.tailLift}
          onChange={v => onChange({ ...filters, tailLift: v })}
        />
        <TriFilter
          label="ADR"
          value={filters.adr}
          onChange={v => onChange({ ...filters, adr: v })}
        />
        <TriFilter
          label="Részrakomány"
          value={filters.partialLoad}
          onChange={v => onChange({ ...filters, partialLoad: v })}
        />
      </div>

      {/* Rating + availability */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">Min. értékelés</span>
          <div className="flex items-center gap-2">
            <StarRating
              value={filters.minRating}
              onChange={v => onChange({ ...filters, minRating: v })}
              size="sm"
            />
            {filters.minRating && (
              <button type="button" onClick={() => onChange({ ...filters, minRating: null })}
                className="text-xs text-gray-400 hover:text-gray-600">törlés</button>
            )}
          </div>
        </div>
        <Checkbox
          id="filter-available"
          label="Csak szabad kapacitás"
          checked={filters.availableOnly}
          onChange={v => onChange({ ...filters, availableOnly: v })}
        />
      </div>
    </div>
  )
}
