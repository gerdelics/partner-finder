import { useState } from 'react'

interface LoginPageProps {
  onSignIn: () => Promise<unknown>
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setLoading(true)
    setError(null)
    try {
      await onSignIn()
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        // user closed the popup — not an error
      } else if (code === 'auth/unauthorized-domain') {
        setError(`Domain nincs engedélyezve Firebase-ben: ${window.location.hostname}`)
      } else {
        setError(code || 'Ismeretlen hiba')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          PF
        </div>
        <h1 className="text-white text-2xl font-semibold tracking-tight">PartnerFinder</h1>
        {error && (
          <p className="text-red-400 text-sm text-center max-w-xs bg-red-950/50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
        >
          {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
        </button>
      </div>
    </div>
  )
}
