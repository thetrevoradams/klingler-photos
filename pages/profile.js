import { Router } from 'next/router'
import Nav from '../src/nav'
import verifySession from '../utils/verifySession'

const Profile = ({ user }) => {
  return (
    <div className="bg-gray-100 h-screen w-full">
      <Nav user={user} />
      <div className="flex flex-wrap p-10 justify-center">
        Hey {user.firstName}. You&apos;ll eventually see stuff here, but nothing special yet.
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    return {
      props: { user },
    }
  }
  if (typeof window === 'undefined') {
    ctx.res.writeHeader(307, { Location: '/login' })
    ctx.res.end()
  } else if (Router) Router.replace('/login')

  return { props: {} }
}

export default Profile
