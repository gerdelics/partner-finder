import { useAuth } from '@/hooks/useAuth'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Betöltés...</p>
      </div>
    </div>
  )
}

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <LoginPage onSignIn={signInWithGoogle} />
  return <DashboardPage user={user} />
}
