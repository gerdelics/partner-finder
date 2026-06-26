import { useState } from 'react'
import { SearchBar } from '@/components/molecules/SearchBar'
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
        <div className="flex-1 w-full">
          <SearchBar value={query} onChange={onQueryChange} onReset={onReset} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowFilters(s => !s)}
            className={[
              'px-3 py-2 text-sm rounded-md border transition-colors flex items-center gap-1.5',
              hasActiveFilters
                ? 'bg-blue-700 text-white border-blue-700'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50',
            ].join(' ')}
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Szűrők
            {hasActiveFilters && (
              <span className="bg-white text-blue-700 rounded-full text-xs px-1 font-bold">!</span>
            )}
          </button>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {resultCount === totalCount
              ? `${totalCount} partner`
              : `${resultCount} / ${totalCount} partner`}
          </span>
        </div>
      </div>

      {showFilters && (
        <div className="border-t border-gray-100 pt-3">
          <FilterPanel filters={filters} onChange={onFiltersChange} />
        </div>
      )}
    </div>
  )
}
