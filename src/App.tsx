import { useState } from 'react'
import type { User } from 'firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { usePartners } from '@/hooks/usePartners'
import { signInWithEmail } from '@/services/authService'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { FuvarokPage } from '@/pages/FuvarokPage'
import { AppHeader } from '@/components/organisms/AppHeader'
import { MainLayout } from '@/components/templates/MainLayout'
import { MarginCalculator } from '@/components/molecules/MarginCalculator'
import { exportPartners } from '@/utils/exportCsv'

type Page = 'partnerek' | 'fuvarok'

function BottomNav({ page, onPage }: { page: Page; onPage: (p: Page) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200 flex md:hidden">
      {([
        { id: 'partnerek', label: 'Partnerek', icon: '👥' },
        { id: 'fuvarok', label: 'Fuvarok', icon: '🚛' },
      ] as const).map(item => (
        <button
          key={item.id}
          onClick={() => onPage(item.id)}
          className={[
            'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
            page === item.id ? 'text-blue-600' : 'text-gray-400',
          ].join(' ')}
        >
          <span className="text-xl leading-tight">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}

function DesktopNav({ page, onPage }: { page: Page; onPage: (p: Page) => void }) {
  return (
    <div className="hidden md:flex gap-1 border-b border-gray-200 bg-white px-4">
      {([
        { id: 'partnerek', label: 'Partnerek' },
        { id: 'fuvarok', label: 'Fuvarok' },
      ] as const).map(item => (
        <button
          key={item.id}
          onClick={() => onPage(item.id)}
          className={[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors -mb-px',
            page === item.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700',
          ].join(' ')}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

function AuthenticatedApp({ user, onSignOut }: { user: User; onSignOut: () => void }) {
  const [page, setPage] = useState<Page>('partnerek')
  const [showCalc, setShowCalc] = useState(false)
  const { partners, loading: partnersLoading, addPartner, updatePartner, deletePartner } = usePartners(user.uid)

  const header = (
    <>
      <AppHeader
        user={user}
        onSignOut={onSignOut}
        onCalc={() => setShowCalc(true)}
        onExport={page === 'partnerek' ? () => exportPartners(partners) : undefined}
      />
      <DesktopNav page={page} onPage={setPage} />
    </>
  )

  return (
    <>
      <MainLayout
        header={header}
        nav={<BottomNav page={page} onPage={setPage} />}
      >
        {page === 'partnerek' && (
          <DashboardPage
            user={user}
            partners={partners}
            partnersLoading={partnersLoading}
            addPartner={addPartner}
            updatePartner={updatePartner}
            deletePartner={deletePartner}
          />
        )}
        {page === 'fuvarok' && (
          <FuvarokPage user={user} partners={partners} />
        )}
      </MainLayout>

      {showCalc && <MarginCalculator onClose={() => setShowCalc(false)} />}
    </>
  )
}

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const { user, loading, signOut } = useAuth()
  if (loading) return <Spinner />
  if (!user) return <LoginPage onSignIn={signInWithEmail} />
  return <AuthenticatedApp user={user} onSignOut={signOut} />
}
