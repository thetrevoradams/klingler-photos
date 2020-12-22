import { useRouter } from 'next/router'
import getFirebase from '../firebase/firebase'

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
      const auth = await getFirebase().auth()
      const authResp = await auth.signInWithEmailAndPassword(email, password)
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

  /** TODO: handle logout */
  const signOut = async () => {
    await fetch(`${process.env.BASE_URL}/api/signOut`)
    const auth = await getFirebase().auth()
    auth.signOut()

    router.push('/login')
  }

  const passwordReset = async (email) => {
    try {
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
