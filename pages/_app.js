import React from 'react'
import '../styles/globals.css'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return <Component {...pageProps} key={router.route} />
}

export default MyApp
