import { useRouter } from 'next/router'
import getFirebase from '../firebase/firebase'
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";


const useAuth = () => {
  const router = useRouter()

  // *** Auth Services ***
  const postUserToken = async (token) => {
    const resp = await fetch(`${process.env.BASE_URL}/api/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
    const postTokenResp = resp.json()
    return postTokenResp
  }

  const signIn = async (email, password) => {
    try {
      const firebase = await getFirebase()
      const auth = await getAuth()
      const authResp = await signInWithEmailAndPassword(auth, email, password)
      if (authResp?.user) {
        const userToken = await authResp?.user.getIdToken()
        const postResp = await postUserToken(userToken)
        return postResp
      }
      return null
    } catch (error) {
      return { error }
    }
  }

  const signOut = async () => {
    if (window.snapshotObserver) window.snapshotObserver()
    await fetch(`${process.env.BASE_URL}/api/signOut`)
    const auth = await getFirebase.auth()
    await signOut(auth)

    router.push('/login')
  }

  const passwordReset = async (email) => {
    try {
      // TODO: Test this and see if it needs to be updated to await auth() and sendPasswordResetEmail(auth, email)
      const auth = await getFirebase.auth()
      const emailResp = await auth.sendPasswordResetEmail(email)
      return emailResp
    } catch (error) {
      return { error }
    }
  }

  return {
    signIn,
    signOut,
    passwordReset,
  }
}

export default useAuth
