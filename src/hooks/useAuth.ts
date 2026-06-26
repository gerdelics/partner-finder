import { useEffect, useState } from 'react'
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { signInWithGoogle, signOut } from '@/services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    // Process the pending redirect result (if coming back from Google login)
    getRedirectResult(auth)
      .then(result => {
        if (result?.user) {
          // User signed in via redirect — onAuthStateChanged will fire next
          setAuthError(null)
        }
      })
      .catch(err => {
        const code: string = (err as { code?: string }).code ?? ''
        if (code === 'auth/unauthorized-domain') {
          setAuthError(
            'Ez a domain nincs engedélyezve Firebase-ben. ' +
            'Firebase Console → Authentication → Settings → Authorized domains → add: ' +
            window.location.hostname
          )
        } else if (code !== 'auth/no-auth-event') {
          // auth/no-auth-event is normal (no pending redirect) — ignore it
          setAuthError(`Bejelentkezési hiba: ${code}`)
        }
        setLoading(false)
      })

    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  return { user, loading, authError, signInWithGoogle, signOut }
}
