import {
  GoogleAuthProvider,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

// Using redirect instead of popup — popup is blocked in PWA standalone mode
// and triggers Google's "Use secure browsers policy" error in some contexts.
export const signInWithGoogle = () => signInWithRedirect(auth, provider)

export const signOut = () => firebaseSignOut(auth)
