import { Button } from '@/components/atoms/Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={e => { if (e.target === e.currentTarget) onCancel() }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={onCancel} autoFocus>
            Mégsem
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Törlés
          </Button>
        </div>
      </div>
    </div>
  )
}
