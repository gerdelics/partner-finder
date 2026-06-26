interface LoginPageProps {
  onSignIn: () => void
  authError?: string | null
}

export function LoginPage({ onSignIn, authError }: LoginPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          PF
        </div>
        <h1 className="text-white text-2xl font-semibold tracking-tight">PartnerFinder</h1>
        {authError && (
          <p className="text-red-400 text-sm text-center max-w-xs">{authError}</p>
        )}
        <button
          onClick={onSignIn}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium rounded-xl transition-colors"
        >
          Bejelentkezés
        </button>
      </div>
    </div>
  )
}
