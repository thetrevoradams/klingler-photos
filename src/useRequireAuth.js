import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from './useAuth'

const useRequireAuth = () => {
  const auth = useAuth()
  const { user, setRedirectPath } = auth
  const router = useRouter()

  useEffect(() => {
    let path = router.pathname
    if (path === '/mem/[id]') path = `/mem/${router.query.id}`
    console.log(`useEffect -> path`, path)
    setRedirectPath(path)
    if (!user) {
      console.log('useRequireAuth -> no user')
      router.push('/login')
    }
  }, [user, router, setRedirectPath])

  return auth
}

export default useRequireAuth
