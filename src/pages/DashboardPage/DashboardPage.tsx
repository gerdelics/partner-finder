import { useState } from 'react'
import type { User } from 'firebase/auth'
import { FilterBar } from '@/components/organisms/FilterBar'
import { PartnerTable } from '@/components/organisms/PartnerTable'
import { PartnerModal } from '@/components/organisms/PartnerModal'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { Button } from '@/components/atoms/Button'
import { useSearch } from '@/hooks/useSearch'
import type { Partner, PartnerInput } from '@/types/partner'

interface DashboardPageProps {
  user: User
  partners: Partner[]
  partnersLoading: boolean
  addPartner: (input: PartnerInput) => Promise<void>
  updatePartner: (id: string, input: PartnerInput) => Promise<void>
  deletePartner: (id: string) => Promise<void>
}

type ModalMode = 'add' | 'edit' | null

export function DashboardPage({ partners, partnersLoading, addPartner, updatePartner, deletePartner }: DashboardPageProps) {
  const { results, query, setQuery, filters, setFilters, reset } = useSearch(partners)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const selectedPartner = partners.find(p => p.id === selectedId) ?? null

  const handleSave = async (input: PartnerInput) => {
    if (modalMode === 'add') await addPartner(input)
    else if (modalMode === 'edit' && selectedId) await updatePartner(selectedId, input)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    await deletePartner(selectedId)
    setSelectedId(null)
    setShowConfirm(false)
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <FilterBar
        query={query} filters={filters}
        onQueryChange={setQuery} onFiltersChange={setFilters}
        onReset={reset} resultCount={results.length} totalCount={partners.length}
      />

      {/* Desktop toolbar */}
      <div className="hidden md:flex flex-wrap gap-2 items-center">
        <Button variant="primary" size="sm" onClick={() => setModalMode('add')}>+ Új partner</Button>
        <Button variant="ghost" size="sm" disabled={!selectedId} onClick={() => setModalMode('edit')}>Szerkesztés</Button>
        <Button variant="danger" size="sm" disabled={!selectedId} onClick={() => setShowConfirm(true)}>Törlés</Button>
        {selectedPartner && (
          <span className="text-sm text-gray-500 ml-1">Kijelölve: <strong>{selectedPartner.name}</strong></span>
        )}
      </div>

      <PartnerTable
        partners={results} selectedId={selectedId}
        onSelect={id => setSelectedId(id)} isLoading={partnersLoading}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => setModalMode('add')}
        className={[
          'fixed md:hidden z-30 w-14 h-14 rounded-full bg-blue-700 text-white shadow-xl',
          'flex items-center justify-center text-3xl leading-none active:scale-95 transition-transform',
          selectedId ? 'bottom-20 right-5' : 'bottom-20 right-5',
        ].join(' ')}
        aria-label="Új partner"
      >+</button>

      {/* Mobile action bar */}
      {selectedId && (
        <div className="fixed bottom-16 left-0 right-0 md:hidden z-20 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center px-3 py-2 gap-1">
            <span className="flex-1 text-sm font-medium text-gray-700 truncate pl-1">{selectedPartner?.name}</span>
            <Button variant="ghost" size="sm" onClick={() => setModalMode('edit')} className="shrink-0">Szerkesztés</Button>
            <Button variant="danger" size="sm" onClick={() => setShowConfirm(true)} className="shrink-0">Törlés</Button>
            <button onClick={() => setSelectedId(null)} className="ml-1 p-1.5 text-gray-400 hover:text-gray-600">✕</button>
          </div>
        </div>
      )}

      {modalMode && (
        <PartnerModal
          mode={modalMode}
          partner={modalMode === 'edit' ? selectedPartner ?? undefined : undefined}
          onSave={handleSave}
          onClose={() => setModalMode(null)}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        title="Partner törlése"
        message={`Biztosan törölni szeretnéd: ${selectedPartner?.name}?`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}
