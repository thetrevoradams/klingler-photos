import '../styles/globals.css'
import { useRouter } from 'next/router'
import 'firebase/firestore'
import 'firebase/auth'
import { Fuego, FuegoProvider } from 'swr-firebase'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}
const fuego = new Fuego(firebaseConfig)

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  return (
  <FuegoProvider fuego={fuego}>
    <Component {...pageProps} key={router.route} />
    </FuegoProvider>)
}

export default MyApp
