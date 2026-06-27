import { useMemo, useState } from 'react'
import type { Partner, SearchFilters } from '@/types/partner'
import { parseNLPQuery, matchesQuery } from '@/utils/nlpSearch'

const DEFAULT_FILTERS: SearchFilters = {
  countries: [],
  vehicleTypes: [],
  minCapacity: null,
  tailLift: null,
  adr: null,
  partialLoad: null,
  minRating: null,
  availableOnly: false,
}

function isFiltersEmpty(f: SearchFilters) {
  return (
    f.countries.length === 0 &&
    f.vehicleTypes.length === 0 &&
    f.minCapacity === null &&
    f.tailLift === null &&
    f.adr === null &&
    f.partialLoad === null &&
    f.minRating === null &&
    !f.availableOnly
  )
}

export function useSearch(partners: Partner[]) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS)

  const results = useMemo(() => {
    if (!query.trim() && isFiltersEmpty(filters)) return partners
    const parsed = parseNLPQuery(query)
    return partners.filter(p => {
      if (!matchesQuery(p, parsed, filters)) return false
      if (filters.minRating !== null && (p.rating ?? 0) < filters.minRating) return false
      if (filters.availableOnly && !p.available) return false
      return true
    })
  }, [partners, query, filters])

  const reset = () => {
    setQuery('')
    setFilters(DEFAULT_FILTERS)
  }

  return { results, query, setQuery, filters, setFilters, reset }
}
