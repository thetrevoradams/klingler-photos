import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Router } from 'next/router'
import Nav from '../src/nav'
import Card from '../src/card'
import verifySession from '../utils/verifySession'

const Homepage = ({ images = [], user, error }) => {
  return (
    <div className="bg-gray-100 h-full min-h-screen w-full">
      <Nav user={user} />
      {error ? (
        <div className="flex flex-wrap p-10 justify-center text-red-400">
          Whoops! There was an error fetching the photos.
        </div>
      ) : (
        <div className="flex flex-wrap p-2 justify-center">
          {images?.map(({ id, ...props }) => (
            <Card key={id} id={id} {...props} />
          ))}
        </div>
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
