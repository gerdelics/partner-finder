import { useEffect, useState } from 'react'
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth'
import { auth } from '@/services/firebase'
import { signInWithGoogle, signOut } from '@/services/authService'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle the result of signInWithRedirect (called after returning from Google)
    getRedirectResult(auth).catch(() => {
      // Ignore redirect errors (e.g. user closed Google login page)
    })

    // onAuthStateChanged fires after getRedirectResult completes,
    // so loading stays true until we have a definitive auth state
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, loading, signInWithGoogle, signOut }
}
