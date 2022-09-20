import 'firebase/auth'
import getFirebaseAdmin from '../firebase/admin'
import { getAuth } from "firebase/auth";

async function verifyCookie(cookie) {
  let user
  let bAuth = false
  try {
    const admin = await getFirebaseAdmin()
    if (!admin) return null
    // validate cookie
    const cookieResp = await admin.auth().verifySessionCookie(cookie, true /** checkRevoked */)
    if (cookieResp) bAuth = true
    try {
      const userData = await admin
        .firestore()
        .collection('users')
        .doc(`${cookieResp.uid}`)
        .get()

      user = userData.data()
    } catch (error) {
      user = error
    }
  } catch (error) {
    // Session cookie is unavailable or invalid. Force user to login.
    bAuth = false
  }

  return {
    authenticated: bAuth,
    user,
  }
}

export default verifyCookie
