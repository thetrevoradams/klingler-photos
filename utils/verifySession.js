import { parseCookies } from 'nookies'
import 'firebase/auth'

import verifyCookie from './verifyCookie'

async function verifySession(context) {
  try {
    const cookies = parseCookies(context)
    const props = {
      authenticated: false,
      user: {},
    }

    if (cookies.user) {
      const authentication = await verifyCookie(cookies.user)
      if (authentication) {
        props.authenticated = authentication.authenticated
        props.user = authentication.user
      }
    }

    return props
  } catch (error) {
    return { error }
  }
}

export default verifySession
