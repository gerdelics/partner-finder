import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, provider)
  } catch (err) {
    if ((err as { code?: string }).code === 'auth/popup-blocked') {
      return signInWithRedirect(auth, provider)
    }
    throw err
  }
}

export const signOut = () => firebaseSignOut(auth)
