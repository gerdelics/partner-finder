import type { User } from 'firebase/auth'

interface AppHeaderProps {
  user: User
  onSignOut: () => void
  onCalc: () => void
  onExport?: () => void
}

export function AppHeader({ user, onSignOut, onCalc, onExport }: AppHeaderProps) {
  const initials = (user.displayName ?? user.email ?? 'U')
    .split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <header className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
          PF
        </div>
        <div className="flex flex-col leading-tight">
          <h1 className="text-base sm:text-lg font-semibold tracking-tight">PartnerFinder</h1>
          <span className="text-[10px] text-slate-400 tracking-widest uppercase">for Fodor Bence</span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        {/* Árrés kalkulátor */}
        <button
          onClick={onCalc}
          title="Árrés kalkulátor"
          className="p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Árrés kalkulátor"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path strokeLinecap="round" d="M8 7h8M8 11h4M8 15h2M14 15h2M14 19h2" />
          </svg>
        </button>

        {/* Export (csak ha van) */}
        {onExport && (
          <button
            onClick={onExport}
            title="Exportálás CSV"
            className="hidden sm:block p-2 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            aria-label="Exportálás"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        )}

        {/* Avatar */}
        {user.photoURL ? (
          <img src={user.photoURL} alt="avatar"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-slate-600 shrink-0" />
        ) : (
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold shrink-0">
            {initials}
          </div>
        )}

        {/* Sign out */}
        <button
          onClick={onSignOut}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm"
          aria-label="Kilépés"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Kilépés</span>
        </button>
      </div>
    </header>
  )
}
