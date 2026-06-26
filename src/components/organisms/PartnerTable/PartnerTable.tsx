import { useState } from 'react'
import { PartnerRow } from '@/components/molecules/PartnerRow'
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

  const sorted = sortPartners(partners, sortCol, sortDir)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
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
                    <span className="ml-1 text-blue-300">
                      {sortDir === 'asc' ? '↑' : '↓'}
                    </span>
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
                <td colSpan={COLUMNS.length} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-medium">Nincs találat</p>
                    <p className="text-xs">Adj hozzá partnert az + gombbal, vagy módosítsd a keresési feltételeket.</p>
                  </div>
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
