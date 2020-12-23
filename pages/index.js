import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Router } from 'next/router'
import dynamic from 'next/dynamic'
import Nav from '../src/nav'
import verifySession from '../utils/verifySession'

const FlowGrid = dynamic(import('../src/FlowGrid'), { ssr: false })

const Homepage = ({ images = [], user, error }) => {
  return (
    <div className="bg-gray-100 h-full min-h-screen w-full p-2">
      <Nav user={user} />
      {error ? (
        <div className="flex flex-wrap p-10 justify-center text-red-400">
          Whoops! There was an error fetching the photos.
        </div>
      ) : (
        <FlowGrid heightEstimate={340} images={images} />
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    const data = await fetch(`${process.env.BASE_URL}/api/getPhotos`)
    const imagesResp = data ? await data?.json() : data

    const pageProps = { user }
    if (imagesResp.images) pageProps.images = imagesResp.images
    if (imagesResp.error) pageProps.error = true

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
