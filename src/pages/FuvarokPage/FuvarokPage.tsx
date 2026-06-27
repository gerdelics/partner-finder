import { useState } from 'react'
import type { User } from 'firebase/auth'
import { FuvarList } from '@/components/organisms/FuvarList'
import { FuvarForm } from '@/components/molecules/FuvarForm'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { useFuvarok } from '@/hooks/useFuvarok'
import { exportFuvarok } from '@/utils/exportCsv'
import type { Fuvar, FuvarInput } from '@/types/fuvar'
import type { Partner } from '@/types/partner'

interface FuvarokPageProps {
  user: User
  partners: Partner[]
}

type ModalMode = 'add' | 'edit' | null
type TimeFilter = 'all' | '30d' | 'this-month' | 'last-month' | 'this-year'

const HU_MONTHS = ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December']

function timeFilterLabel(f: TimeFilter): string {
  const now = new Date()
  if (f === 'all') return 'Összes'
  if (f === '30d') return 'Elmúlt 30 nap'
  if (f === 'this-month') return HU_MONTHS[now.getMonth()]
  if (f === 'last-month') return HU_MONTHS[new Date(now.getFullYear(), now.getMonth() - 1).getMonth()]
  return `${now.getFullYear()}`
}

function applyTimeFilter(fuvarok: Fuvar[], f: TimeFilter): Fuvar[] {
  if (f === 'all') return fuvarok
  const now = new Date()
  if (f === '30d') {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
    const s = cutoff.toISOString().slice(0, 10)
    return fuvarok.filter(x => x.datum >= s)
  }
  if (f === 'this-month') {
    const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    return fuvarok.filter(x => x.datum.startsWith(prefix))
  }
  if (f === 'last-month') {
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prefix = `${lm.getFullYear()}-${String(lm.getMonth() + 1).padStart(2, '0')}`
    return fuvarok.filter(x => x.datum.startsWith(prefix))
  }
  // this-year
  return fuvarok.filter(x => x.datum.startsWith(`${now.getFullYear()}`))
}

const TIME_FILTERS: TimeFilter[] = ['all', '30d', 'this-month', 'last-month', 'this-year']

export function FuvarokPage({ user, partners }: FuvarokPageProps) {
  const { fuvarok, loading, addFuvar, updateFuvar, deleteFuvar } = useFuvarok(user.uid)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editTarget, setEditTarget] = useState<Fuvar | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('this-month')

  const filtered = applyTimeFilter(fuvarok, timeFilter)

  const handleSave = async (input: FuvarInput) => {
    setSaving(true)
    try {
      if (modalMode === 'add') await addFuvar(input)
      else if (modalMode === 'edit' && editTarget) await updateFuvar(editTarget.id, input)
      setModalMode(null)
      setEditTarget(null)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (f: Fuvar) => {
    setEditTarget(f)
    setModalMode('edit')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteFuvar(deleteTarget)
    setDeleteTarget(null)
  }

  const totalArres = filtered.reduce((sum, f) =>
    f.ugyfelAr != null && f.fuvarozóAr != null ? sum + f.ugyfelAr - f.fuvarozóAr : sum, 0)

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Time filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {TIME_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setTimeFilter(f)}
            className={[
              'shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              timeFilter === f
                ? 'bg-slate-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
            ].join(' ')}
          >
            {timeFilterLabel(f)}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 shadow-sm">
          <p className="text-xs text-gray-400">Fuvarok</p>
          <p className="font-bold text-gray-800">{filtered.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 px-3 py-2.5 shadow-sm">
          <p className="text-xs text-gray-400">Teljesítve</p>
          <p className="font-bold text-gray-800">{filtered.filter(f => f.statusz === 'teljesitve').length}</p>
        </div>
        <div className={`rounded-xl border px-3 py-2.5 shadow-sm ${totalArres >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <p className="text-xs text-gray-400">Össz. árrés</p>
          <p className={`font-bold text-sm ${totalArres >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {totalArres > 0 ? '+' : ''}{totalArres} €
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="hidden md:flex gap-2 items-center">
        <button onClick={() => { setEditTarget(null); setModalMode('add') }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg">
          + Új fuvar
        </button>
        {filtered.length > 0 && (
          <button onClick={() => exportFuvarok(filtered)}
            className="px-4 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-sm rounded-lg">
            Exportálás (CSV)
          </button>
        )}
      </div>

      <FuvarList
        fuvarok={filtered}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={id => setDeleteTarget(id)}
      />

      {/* Mobile FAB */}
      <button
        onClick={() => { setEditTarget(null); setModalMode('add') }}
        className="fixed bottom-20 right-5 md:hidden z-30 w-14 h-14 rounded-full bg-blue-600 text-white shadow-xl flex items-center justify-center text-3xl leading-none active:scale-95 transition-transform"
        aria-label="Új fuvar"
      >
        +
      </button>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
          onClick={e => { if (e.target === e.currentTarget) setModalMode(null) }}>
          <div className="bg-white w-full rounded-t-2xl sm:rounded-xl sm:max-w-2xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mt-1 sm:mt-0">
                {modalMode === 'add' ? 'Új fuvar' : 'Fuvar szerkesztése'}
              </h2>
              <button onClick={() => setModalMode(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1">×</button>
            </div>
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
              <FuvarForm
                initialValues={editTarget ?? undefined}
                partners={partners}
                onSubmit={handleSave}
                onCancel={() => setModalMode(null)}
                isLoading={saving}
              />
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Fuvar törlése"
        message="Biztosan törölni szeretnéd ezt a fuvart? Ez a művelet nem vonható vissza."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
