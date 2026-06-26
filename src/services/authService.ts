import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from './firebase'

const provider = new GoogleAuthProvider()

// Throws on error — callers handle and display the message
export const signInWithGoogle = () => signInWithPopup(auth, provider)

export const signOut = () => firebaseSignOut(auth)
