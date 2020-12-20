import React from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router'
import { useAuth, AuthProvider } from '../src/useAuth'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const { user } = useAuth()
  if (!user) {
    return router.push('/login')
  }

  return (
    <AuthProvider>
      <Component {...pageProps} key={router.route} />
    </AuthProvider>
  )
}

export default MyApp
