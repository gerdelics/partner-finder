import { useState } from 'react'
import { PartnerForm } from '@/components/molecules/PartnerForm'
import type { Partner, PartnerInput } from '@/types/partner'

interface PartnerModalProps {
  mode: 'add' | 'edit'
  partner?: Partner
  onSave: (input: PartnerInput) => Promise<void>
  onClose: () => void
}

export function PartnerModal({ mode, partner, onSave, onClose }: PartnerModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async (input: PartnerInput) => {
    setIsLoading(true)
    setError(null)
    try {
      await onSave(input)
      onClose()
    } catch {
      setError('Hiba történt a mentés során. Kérjük próbáld újra.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Sheet slides up from bottom on mobile, centered dialog on sm+ */}
      <div className="bg-white w-full rounded-t-2xl sm:rounded-xl sm:max-w-2xl shadow-2xl flex flex-col max-h-[95dvh] sm:max-h-[90vh]">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          {/* Mobile drag handle */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full sm:hidden" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mt-1 sm:mt-0">
            {mode === 'add' ? 'Új partner' : 'Partner szerkesztése'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
            aria-label="Bezárás"
          >
            ×
          </button>
        </div>
        <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          <PartnerForm
            initialValues={partner}
            onSubmit={handleSave}
            onCancel={onClose}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
