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
type QuickFilter = 'all' | '30d' | 'last-month' | 'custom'

function lastMonthPrefix(): string {
  const now = new Date()
  const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return `${lm.getFullYear()}-${String(lm.getMonth() + 1).padStart(2, '0')}`
}

function applyFilter(fuvarok: Fuvar[], q: QuickFilter, from: string, to: string): Fuvar[] {
  if (q === 'all') return fuvarok
  if (q === '30d') {
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30)
    const s = cutoff.toISOString().slice(0, 10)
    return fuvarok.filter(x => x.datum >= s)
  }
  if (q === 'last-month') {
    const prefix = lastMonthPrefix()
    return fuvarok.filter(x => x.datum.startsWith(prefix))
  }
  // custom
  return fuvarok.filter(x =>
    (!from || x.datum >= from) && (!to || x.datum <= to)
  )
}

const QUICK: { value: QuickFilter; label: string }[] = [
  { value: 'all', label: 'Összes' },
  { value: '30d', label: 'Elmúlt 30 nap' },
  { value: 'last-month', label: 'Előző hónap' },
  { value: 'custom', label: 'Egyéni' },
]

const inputCls = 'border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'

export function FuvarokPage({ user, partners }: FuvarokPageProps) {
  const { fuvarok, loading, addFuvar, updateFuvar, deleteFuvar } = useFuvarok(user.uid)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editTarget, setEditTarget] = useState<Fuvar | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const filtered = applyFilter(fuvarok, quickFilter, fromDate, toDate)

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

  const handleEdit = (f: Fuvar) => { setEditTarget(f); setModalMode('edit') }
  const handleDelete = async () => {
    if (!deleteTarget) return
    await deleteFuvar(deleteTarget)
    setDeleteTarget(null)
  }

  const totalArres = filtered.reduce((sum, f) =>
    f.ugyfelAr != null && f.fuvarozóAr != null ? sum + f.ugyfelAr - f.fuvarozóAr : sum, 0)

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Quick filter chips */}
      <div className="flex flex-wrap gap-2">
        {QUICK.map(q => (
          <button
            key={q.value}
            onClick={() => setQuickFilter(q.value)}
            className={[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              quickFilter === q.value
                ? 'bg-slate-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50',
            ].join(' ')}
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Date range picker — only when custom is selected */}
      {quickFilter === 'custom' && (
        <div className="flex flex-wrap items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <span className="text-xs text-gray-500 font-medium">Időszak:</span>
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
            className={inputCls}
          />
          <span className="text-gray-400 text-sm">–</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
            className={inputCls}
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(''); setToDate('') }}
              className="text-xs text-gray-400 hover:text-gray-600 underline"
            >
              Törlés
            </button>
          )}
        </div>
      )}

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

      {/* Desktop toolbar */}
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
      >+</button>

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
