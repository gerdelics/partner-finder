import { Button } from '@/components/atoms/Button'
import type { User } from 'firebase/auth'

interface AppHeaderProps {
  user: User
  onSignOut: () => void
}

export function AppHeader({ user, onSignOut }: AppHeaderProps) {
  const initials = (user.displayName ?? user.email ?? 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-sm">
          PF
        </div>
        <h1 className="text-lg font-semibold tracking-tight">PartnerFinder</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-sm text-slate-300">
          {user.displayName ?? user.email}
        </span>
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName ?? 'avatar'}
            className="w-8 h-8 rounded-full border-2 border-slate-600"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
            {initials}
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={onSignOut}
          className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
          Kilépés
        </Button>
      </div>
    </header>
  )
}
