import React, { useState, createContext, useContext, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { auth, db } from '../utils/firebaseSetup'

const useAuthProvider = () => {
  const router = useRouter()
  const [user, setUser] = useState()
  const [redirectPath, setRedirectPath] = useState()
  // *** Auth Services ***
  const getUserData = async (uid) => {
    try {
      const userResp = await db
        .collection('users')
        .doc(uid)
        .get()
      if (userResp.exists) {
        const curUser = userResp.data()
        setUser(curUser)
        return curUser
      }
      return { error: 'No matching user' }
    } catch (error) {
      return { error }
    }
  }

  const signIn = async (email, password) => {
    try {
      const authResp = await auth.signInWithEmailAndPassword(email, password)
      const userData = await getUserData(authResp?.user?.uid)
      return userData
    } catch (error) {
      return { error }
    }
  }

  const signOut = useCallback(() => auth.signOut().then(() => setUser(false)), [])

  const passwordReset = async (email) => {
    try {
      const emailResp = await auth.sendPasswordResetEmail(email)
      return emailResp
    } catch (error) {
      return { error }
    }
  }

  const handleAuthStateChanged = useCallback(
    (curUser) => {
      if (curUser?.uid) {
        getUserData(curUser?.uid)
        if (redirectPath) router.push(redirectPath)
      }
    },
    [redirectPath]
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(handleAuthStateChanged)

    return () => unsubscribe()
  }, [handleAuthStateChanged])

  return {
    user,
    signIn,
    signOut,
    passwordReset,
    setRedirectPath,
  }
}
export const AuthContext = createContext({ user: {} })
export const AuthProvider = ({ children }) => {
  const hookData = useAuthProvider()
  return <AuthContext.Provider value={hookData}>{children}</AuthContext.Provider>
}
export const useAuth = () => {
  return useContext(AuthContext)
}

export default useAuthProvider
