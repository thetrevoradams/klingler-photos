import { Router } from 'next/router'
import Nav from '../src/nav'
import { useCollection } from 'swr-firebase'
import verifySession from '../utils/verifySession'
import Grid from '../src/Grid';
import Loader from '../src/Loader';

const Homepage = ({ user }) => {
  const { data: images, error } = useCollection(`images`)
  
  return (
    <div className="bg-gray-100 h-full min-h-screen w-full p-2">
      <Nav user={user} />
      {!images && !error ? (
        <div className="flex flex-1 flex-wrap h-full w-full text-center flex-col justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-wrap p-10 justify-center text-red-400">
              Whoops! There was an error fetching the photos.
            </div>
          ) : (
            <Grid images={images} />
          )}
        </>
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    const pageProps = { user: user || '' }

    return {
      props: pageProps,
    }
  }
  if (typeof window === 'undefined') {
    ctx.res.writeHeader(307, { Location: '/login' })
    ctx.res.end()
  } else if (Router) Router.replace('/login')

  return { props: {} }
}

export default Homepage
