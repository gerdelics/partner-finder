import { useState } from 'react'
import type { User } from 'firebase/auth'
import { AppHeader } from '@/components/organisms/AppHeader'
import { FilterBar } from '@/components/organisms/FilterBar'
import { PartnerTable } from '@/components/organisms/PartnerTable'
import { PartnerModal } from '@/components/organisms/PartnerModal'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { Button } from '@/components/atoms/Button'
import { MainLayout } from '@/components/templates/MainLayout'
import { usePartners } from '@/hooks/usePartners'
import { useSearch } from '@/hooks/useSearch'
import { signOut } from '@/services/authService'
import type { PartnerInput } from '@/types/partner'

interface DashboardPageProps {
  user: User
}

type ModalMode = 'add' | 'edit' | null

export function DashboardPage({ user }: DashboardPageProps) {
  const { partners, loading, addPartner, updatePartner, deletePartner } = usePartners(user.uid)
  const { results, query, setQuery, filters, setFilters, reset } = useSearch(partners)

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const selectedPartner = partners.find(p => p.id === selectedId) ?? null

  const handleSave = async (input: PartnerInput) => {
    if (modalMode === 'add') {
      await addPartner(input)
    } else if (modalMode === 'edit' && selectedId) {
      await updatePartner(selectedId, input)
    }
  }

  const handleDelete = async () => {
    if (!selectedId) return
    await deletePartner(selectedId)
    setSelectedId(null)
    setShowConfirm(false)
  }

  const handleSelect = (id: string | null) => {
    setSelectedId(id)
  }

  return (
    <MainLayout header={<AppHeader user={user} onSignOut={signOut} />}>
      <div className="flex flex-col gap-4">
        <FilterBar
          query={query}
          filters={filters}
          onQueryChange={setQuery}
          onFiltersChange={setFilters}
          onReset={reset}
          resultCount={results.length}
          totalCount={partners.length}
        />

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setModalMode('add')}
          >
            + Új partner
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!selectedId}
            onClick={() => setModalMode('edit')}
          >
            Szerkesztés
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedId}
            onClick={() => setShowConfirm(true)}
          >
            Törlés
          </Button>
          {selectedPartner && (
            <span className="text-sm text-gray-500 ml-1">
              Kijelölve: <strong>{selectedPartner.name}</strong>
            </span>
          )}
        </div>

        <PartnerTable
          partners={results}
          selectedId={selectedId}
          onSelect={handleSelect}
          isLoading={loading}
        />
      </div>

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
        message={`Biztosan törölni szeretnéd: ${selectedPartner?.name}? Ez a művelet nem vonható vissza.`}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </MainLayout>
  )
}
