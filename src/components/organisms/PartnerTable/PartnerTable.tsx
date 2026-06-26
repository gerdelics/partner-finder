import { useState } from 'react'
import { PartnerRow } from '@/components/molecules/PartnerRow'
import { Badge } from '@/components/atoms/Badge'
import type { Partner } from '@/types/partner'

interface PartnerTableProps {
  partners: Partner[]
  selectedId: string | null
  onSelect: (id: string | null) => void
  isLoading: boolean
}

type SortColumn = keyof Partner
type SortDir = 'asc' | 'desc'

const COLUMNS: { key: SortColumn; label: string; className?: string }[] = [
  { key: 'name', label: 'Név' },
  { key: 'phone', label: 'Telefon' },
  { key: 'email', label: 'Email' },
  { key: 'countries', label: 'Országok' },
  { key: 'vehicleTypes', label: 'Jármű' },
  { key: 'capacity', label: 'Teherbírás', className: 'text-right' },
  { key: 'tailLift', label: 'Hátfal', className: 'text-center' },
  { key: 'adr', label: 'ADR', className: 'text-center' },
  { key: 'partialLoad', label: 'Részrakm.', className: 'text-center' },
  { key: 'notes', label: 'Megjegyzés' },
]

function sortPartners(partners: Partner[], col: SortColumn, dir: SortDir): Partner[] {
  return [...partners].sort((a, b) => {
    const av = Array.isArray(a[col]) ? (a[col] as string[]).join(',') : (a[col] ?? '')
    const bv = Array.isArray(b[col]) ? (b[col] as string[]).join(',') : (b[col] ?? '')
    if (typeof av === 'number' && typeof bv === 'number') {
      return dir === 'asc' ? av - bv : bv - av
    }
    const cmp = String(av).localeCompare(String(bv), 'hu')
    return dir === 'asc' ? cmp : -cmp
  })
}

// ── Mobile card ──────────────────────────────────────────────────────────────

function PartnerCard({
  partner,
  isSelected,
  onClick,
}: {
  partner: Partner
  isSelected: boolean
  onClick: (id: string) => void
}) {
  const hasFlags = partner.tailLift || partner.adr || partner.partialLoad

  return (
    <div
      onClick={() => onClick(partner.id)}
      className={[
        'px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors active:bg-gray-100',
        isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : '',
      ].join(' ')}
    >
      {/* Row 1: name + country badges */}
      <div className="flex items-start justify-between gap-2">
        <span className="font-semibold text-gray-900 text-sm leading-tight">{partner.name}</span>
        <div className="flex flex-wrap gap-1 justify-end shrink-0">
          {partner.countries.slice(0, 4).map(c => (
            <Badge key={c} label={c} variant="country" />
          ))}
          {partner.countries.length > 4 && (
            <Badge label={`+${partner.countries.length - 4}`} variant="default" />
          )}
        </div>
      </div>

      {/* Row 2: vehicle + capacity */}
      {(partner.vehicleTypes.length > 0 || partner.capacity !== null) && (
        <div className="flex flex-wrap items-center gap-1 mt-1.5">
          {partner.vehicleTypes.map(v => (
            <Badge key={v} label={v} variant="vehicle" />
          ))}
          {partner.capacity !== null && (
            <span className="text-xs text-gray-500 font-medium">{partner.capacity} t</span>
          )}
        </div>
      )}

      {/* Row 3: phone (tappable) */}
      {partner.phone && (
        <a
          href={`tel:${partner.phone}`}
          onClick={e => e.stopPropagation()}
          className="flex items-center gap-1.5 mt-2 text-blue-700 text-sm font-medium"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {partner.phone}
        </a>
      )}

      {/* Row 4: flags + notes */}
      <div className="flex items-center justify-between mt-1.5 gap-2">
        {hasFlags && (
          <div className="flex gap-2 text-xs">
            {partner.tailLift && <span className="text-green-700 font-medium">✓ Hátfal</span>}
            {partner.adr && <span className="text-green-700 font-medium">✓ ADR</span>}
            {partner.partialLoad && <span className="text-green-700 font-medium">✓ Részrakm.</span>}
          </div>
        )}
        {partner.notes && (
          <p className="text-xs text-gray-400 truncate flex-1 text-right">{partner.notes}</p>
        )}
      </div>
    </div>
  )
}

// ── Empty / skeleton shared ──────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center text-gray-400">
      <svg className="w-10 h-10 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <p className="font-medium">Nincs találat</p>
      <p className="text-xs mt-1">Adj hozzá partnert a + gombbal, vagy módosítsd a keresési feltételeket.</p>
    </div>
  )
}

// ── Main export ──────────────────────────────────────────────────────────────

export function PartnerTable({ partners, selectedId, onSelect, isLoading }: PartnerTableProps) {
  const [sortCol, setSortCol] = useState<SortColumn>('updatedAt')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (col: SortColumn) => {
    if (sortCol === col) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const handleCardClick = (id: string) => {
    onSelect(selectedId === id ? null : id)
  }

  const sorted = sortPartners(partners, sortCol, sortDir)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

      {/* ── Mobile: card list (hidden on md+) ─────────────────────────────── */}
      <div className="md:hidden">
        {isLoading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-100 flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          ))
        )}
        {!isLoading && sorted.length === 0 && <EmptyState />}
        {!isLoading && sorted.map(partner => (
          <PartnerCard
            key={partner.id}
            partner={partner}
            isSelected={selectedId === partner.id}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {/* ── Desktop: table (hidden below md) ──────────────────────────────── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-800 text-white text-left">
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={[
                    'px-3 py-3 font-medium cursor-pointer select-none whitespace-nowrap',
                    'hover:bg-slate-700 transition-colors',
                    col.className ?? '',
                  ].join(' ')}
                >
                  {col.label}
                  {sortCol === col.key && (
                    <span className="ml-1 text-blue-300">{sortDir === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {COLUMNS.map(col => (
                    <td key={col.key} className="px-3 py-3">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            )}
            {!isLoading && sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length}>
                  <EmptyState />
                </td>
              </tr>
            )}
            {!isLoading && sorted.map(partner => (
              <PartnerRow
                key={partner.id}
                partner={partner}
                isSelected={selectedId === partner.id}
                onClick={id => onSelect(id || null)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
