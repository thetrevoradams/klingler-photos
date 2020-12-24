import React, { useEffect, useState } from 'react'
import { Router } from 'next/router'
import dynamic from 'next/dynamic'
import Nav from '../src/nav'
import getPhotos from '../src/getPhotos'
import verifySession from '../utils/verifySession'

const FlowGrid = dynamic(import('../src/FlowGrid'), { ssr: false })

const Homepage = ({ user }) => {
  const [loading, setLoading] = useState(true)
  const [images, setImages] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const { imgResp } = await getPhotos()
          if (imgResp) {
            setError(false)
            setImages(imgResp)
            setLoading(false)
          } else {
            setError(true)
          }
        } catch (fetchError) {
          setError(true)
        }
      }
      fetchData()
    }
  }, [])

  return (
    <div className="bg-gray-100 h-full min-h-screen w-full p-2">
      <Nav user={user} />
      {loading ? (
        <div className="flex flex-1 flex-wrap h-full w-full text-center flex-col justify-center items-center">
          <svg
            className="animate-spin mt-28 h-16 w-16 opacity-70 text-light-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-wrap p-10 justify-center text-red-400">
              Whoops! There was an error fetching the photos.
            </div>
          ) : (
            <FlowGrid heightEstimate={340} images={images} />
          )}
        </>
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    const pageProps = { user }

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
