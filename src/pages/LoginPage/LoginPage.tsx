import { useState } from 'react'

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<unknown>
}

export function LoginPage({ onSignIn }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSignIn(email, password)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ''
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
        setError('Hibás email cím vagy jelszó.')
      } else if (code === 'auth/too-many-requests') {
        setError('Túl sok sikertelen kísérlet. Próbáld újra később.')
      } else {
        setError(code || 'Ismeretlen hiba')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full max-w-xs px-4">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
          PF
        </div>
        <h1 className="text-white text-2xl font-semibold tracking-tight">PartnerFinder</h1>

        <div className="w-full flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Jelszó"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
        >
          {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
        </button>
      </form>
    </div>
  )
}
