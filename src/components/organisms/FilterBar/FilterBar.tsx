import { useState } from 'react'
import { FilterPanel } from '@/components/molecules/FilterPanel'
import type { SearchFilters } from '@/types/partner'

interface FilterBarProps {
  query: string
  filters: SearchFilters
  onQueryChange: (q: string) => void
  onFiltersChange: (f: SearchFilters) => void
  onReset: () => void
  resultCount: number
  totalCount: number
}

export function FilterBar({
  query,
  filters,
  onQueryChange,
  onFiltersChange,
  onReset,
  resultCount,
  totalCount,
}: FilterBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters =
    filters.countries.length > 0 ||
    filters.vehicleTypes.length > 0 ||
    filters.minCapacity !== null ||
    filters.tailLift !== null ||
    filters.adr !== null ||
    filters.partialLoad !== null

  const hasAny = query.trim() || hasActiveFilters

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
      {/* Search row */}
      <div className="flex gap-2 items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            placeholder="Keresés… (pl. 18t hátfalas román)"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter toggle */}
        <button
          type="button"
          onClick={() => setShowFilters(s => !s)}
          className={[
            'shrink-0 px-3 py-2 text-sm rounded-lg border transition-colors flex items-center gap-1.5',
            hasActiveFilters
              ? 'bg-blue-700 text-white border-blue-700'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
          ].join(' ')}
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="hidden sm:inline">Szűrők</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-white/80 sm:hidden" />
          )}
        </button>

        {/* Clear button (only when something active) */}
        {hasAny && (
          <button
            type="button"
            onClick={onReset}
            className="shrink-0 px-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Törlés"
          >
            ✕
          </button>
        )}
      </div>

      {/* Result count — subtle, below search */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-0.5">
        <span>
          {resultCount === totalCount
            ? `${totalCount} partner`
            : `${resultCount} találat / ${totalCount} partner`}
        </span>
        {hasActiveFilters && (
          <span className="text-blue-600 font-medium">Szűrő aktív</span>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="border-t border-gray-100 pt-3">
          <FilterPanel filters={filters} onChange={onFiltersChange} />
        </div>
      )}
    </div>
  )
}
