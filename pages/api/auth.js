import { serialize } from 'cookie'
import getFirebaseAdmin from '../../firebase/admin'

export default async function auth(req, res) {
  const expiresIn = 3 * 60 * 60 * 1000
  if (req.method === 'POST') {
    const idToken = req.body.token

    const admin = await getFirebaseAdmin()
    const cookie = await admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedIdToken) => {
        // Only process if the user just signed in in the last 3 hours.
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 180 * 60) {
          // Create session cookie and set it.
          return admin.auth().createSessionCookie(idToken, { expiresIn })
        }
        // A user that was not recently signed in is trying to set a session cookie.
        // To guard against ID token theft, require re-authentication.
        res.status(401).send(JSON.stringify({ error: 'Recent sign in required' }))
      })

    if (cookie) {
      const options = {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === 'true',
        path: '/',
      }
      res.setHeader('Set-Cookie', serialize('user', cookie, options))
      res.status(200).end(JSON.stringify({ response: 'Succesfully logged in' }))
    } else {
      res.status(401).send(JSON.stringify({ error: 'Invalid authentication' }))
    }
  }
}
