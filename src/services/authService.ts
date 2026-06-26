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
    await signInWithPopup(auth, provider)
  } catch (err) {
    const code = (err as { code?: string }).code ?? ''
    // Popup blocked or not supported (PWA standalone / WebView)
    // → fall back to redirect. Requires Firebase Hosting to be deployed.
    if (
      code === 'auth/popup-blocked' ||
      code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, provider)
    }
    // auth/popup-closed-by-user = user cancelled — do nothing
  }
}

export const signOut = () => firebaseSignOut(auth)
