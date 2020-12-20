import React from 'react'
import fetch from 'isomorphic-unfetch'
import Nav from '../src/nav'
import Card from '../src/card'
import useRequireAuth from '../src/useRequireAuth'

const Homepage = ({ images = [], notFound = false }) => {
  const auth = useRequireAuth()
  if (!auth.user) return null

  return (
    <div className="bg-gray-100 h-full h-min-screen w-full">
      <Nav />
      <div className="flex flex-wrap p-2 justify-center">
        {images.map(({ id, ...props }) => (
          <Card key={id} id={id} {...props} />
        ))}
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${process.env.BASE_URL}/.netlify/functions/next_api_getPhotos`)
  const json = await data.json()

  return {
    props: { images: json.images },
  }
}

export default Homepage
