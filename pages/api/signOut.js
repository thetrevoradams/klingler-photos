import { parseCookies, destroyCookie } from 'nookies'
import getFirebaseAdmin from '../../firebase/admin'

export default async function signOut(req, res) {
  try {
    const cookies = parseCookies({ req })
    const admin = await getFirebaseAdmin()
    admin
      .auth()
      .verifySessionCookie(cookies.user)
      .then((decodedClaims) => {
        admin
          .auth()
          .revokeRefreshTokens(decodedClaims.sub)
          .then(() => {
            destroyCookie({ req }, 'user')
            res.status(200).end(JSON.stringify({ response: 'Succesfully logged out' }))
          })
      })
  } catch (error) {
    res.status(401).send(JSON.stringify({ error: 'Issue with sign out' }))
  }
}
