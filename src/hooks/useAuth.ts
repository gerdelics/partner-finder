import { useEffect, useState } from 'react'
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { signInWithGoogle, signOut } from '@/services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) setAuthError(null)
      })
      .catch(err => {
        const code = (err as { code?: string }).code ?? ''
        // auth/no-auth-event = no pending redirect, this is normal — ignore silently
        if (code === 'auth/no-auth-event') return
        console.error('getRedirectResult:', code, err)
        if (code === 'auth/unauthorized-domain') {
          setAuthError(`Domain nincs engedélyezve Firebase-ben: ${window.location.hostname}`)
        } else {
          setAuthError(`Bejelentkezési hiba (${code})`)
        }
        // Do NOT call setLoading(false) here — onAuthStateChanged is the
        // single source of truth for loading state.
      })

    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading, authError, signInWithGoogle, signOut }
}
