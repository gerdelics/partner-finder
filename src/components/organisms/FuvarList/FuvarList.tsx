import { useState } from 'react'
import type { Fuvar } from '@/types/fuvar'
import { STATUSZ_COLORS, STATUSZ_OPTIONS } from '@/types/fuvar'
import { COUNTRY_OPTIONS } from '@/types/partner'

interface FuvarListProps {
  fuvarok: Fuvar[]
  isLoading: boolean
  onEdit: (f: Fuvar) => void
  onDelete: (id: string) => void
}

type StatusFilter = Fuvar['statusz'] | 'all'

const countryLabel = (code: string) =>
  COUNTRY_OPTIONS.find(c => c.code === code)?.label ?? code

export function FuvarList({ fuvarok, isLoading, onEdit, onDelete }: FuvarListProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filtered = statusFilter === 'all'
    ? fuvarok
    : fuvarok.filter(f => f.statusz === statusFilter)

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-3 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([{ value: 'all', label: 'Összes' }, ...STATUSZ_OPTIONS] as { value: string; label: string }[]).map(s => (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value as StatusFilter)}
            className={[
              'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              statusFilter === s.value
                ? 'bg-slate-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
            ].join(' ')}
          >
            {s.label}
            {s.value !== 'all' && (
              <span className="ml-1.5 text-xs opacity-70">
                {fuvarok.filter(f => f.statusz === s.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 py-14 text-center text-gray-400">
          <p className="font-medium">Nincs fuvar</p>
          <p className="text-xs mt-1">Adj hozzá az + gombbal.</p>
        </div>
      )}

      {filtered.map(fuvar => {
        const arres = fuvar.ugyfelAr != null && fuvar.fuvarozóAr != null
          ? fuvar.ugyfelAr - fuvar.fuvarozóAr
          : null
        const pct = arres != null && fuvar.ugyfelAr
          ? (arres / fuvar.ugyfelAr) * 100
          : null

        return (
          <div key={fuvar.id}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col gap-3">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-gray-900">{fuvar.ugyfelNev}</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {countryLabel(fuvar.fromCountry)} → {countryLabel(fuvar.toCountry)}
                  {fuvar.tomeg ? ` · ${fuvar.tomeg}t` : ''}
                  {fuvar.datum ? ` · ${fuvar.datum}` : ''}
                </p>
              </div>
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${STATUSZ_COLORS[fuvar.statusz]}`}>
                {STATUSZ_OPTIONS.find(s => s.value === fuvar.statusz)?.label}
              </span>
            </div>

            {/* Ár + árrés */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-xs text-gray-400">Ügyfél</p>
                <p className="font-semibold text-sm text-gray-800">
                  {fuvar.ugyfelAr != null ? `${fuvar.ugyfelAr} €` : '–'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-xs text-gray-400">Fuvarozó</p>
                <p className="font-semibold text-sm text-gray-800">
                  {fuvar.fuvarozóAr != null ? `${fuvar.fuvarozóAr} €` : '–'}
                </p>
              </div>
              <div className={`rounded-lg px-2 py-2 ${arres == null ? 'bg-gray-50' : arres >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-xs text-gray-400">Árrés</p>
                {arres != null ? (
                  <p className={`font-bold text-sm ${arres >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                    {arres > 0 ? '+' : ''}{arres} €
                    {pct != null && <span className="text-xs ml-0.5">({pct.toFixed(0)}%)</span>}
                  </p>
                ) : (
                  <p className="font-semibold text-sm text-gray-400">–</p>
                )}
              </div>
            </div>

            {/* Partner + megjegyzés */}
            {(fuvar.partnerNev || fuvar.megjegyzes) && (
              <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                {fuvar.partnerNev && <span>🚛 {fuvar.partnerNev}</span>}
                {fuvar.megjegyzes && <span className="text-gray-400">{fuvar.megjegyzes}</span>}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button onClick={() => onEdit(fuvar)}
                className="flex-1 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Szerkesztés
              </button>
              <button onClick={() => onDelete(fuvar.id)}
                className="flex-1 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">
                Törlés
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
