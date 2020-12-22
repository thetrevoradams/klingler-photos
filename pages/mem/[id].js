import React, { useEffect } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import fetch from 'isomorphic-unfetch'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import Nav from '../../src/nav'
import verifySession from '../../utils/verifySession'

const MemoryPage = ({ image: { id, contributorName, url, filename, date, tags }, nextId, prevId, user }) => {
  const router = useRouter()
  const disqusShortname = `klingler`
  const disqusConfig = {
    url: `https://klingler.theburrow.us/mem/${id}`,
    identifier: `${id}`,
    title: `${filename}`,
  }

  useEffect(() => {
    const handleKeyNavigate = (e) => {
      if (e.key === 'ArrowLeft' && prevId) router.push(`/mem/${prevId}`)
      if (e.key === 'ArrowRight' && nextId) router.push(`/mem/${nextId}`)
    }
    document.addEventListener('keydown', handleKeyNavigate)
    return () => {
      document.removeEventListener('keydown', handleKeyNavigate)
    }
  }, [nextId, prevId, router])

  return (
    <>
      <Nav user={user} />
      <div className="bg-gray-100 flex justify-center items-center h-45vh lg:h-60vh relative">
        <img src={url} alt={filename} className="object-contain h-full" />
        {prevId && (
          <Link href={`/mem/${prevId}`}>
            <a className="absolute top-1/2 left-0 px-5 py-8 opacity-50 hover:opacity-100 transition-opacity">
              <button
                type="button"
                className="rounded-full text-white bg-gray-700 font-bold h-10 w-10 flex items-center justify-center"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </a>
          </Link>
        )}
        {nextId && (
          <Link href={`/mem/${nextId}`}>
            <a className="absolute top-1/2 right-0 px-5 py-8 opacity-50 hover:opacity-100">
              <button
                type="button"
                className="rounded-full text-white bg-gray-700 font-bold h-10 w-10 flex items-center justify-center transition-opacity"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </a>
          </Link>
        )}
      </div>
      <div className="bg-white flex xl:justify-center">
        <div className="mx-8 w-full xl:w-4/5 max-w-screen-xl">
          <h1 className="text-6xl smMax:text-2xl mdMax:text-5xl lgMax:text-5xl font-bold mt-8">{filename}</h1>

          {contributorName && (
            <div className="py-2 mt-16 ">
              <span className="uppercase font-light text-gray-500">Uploaded By</span>
              <p className="text-2xl text-gray-900 font-semibold pt-2">{contributorName}</p>
            </div>
          )}

          <div className="description w-full my-16 text-gray-500 text-sm">
            <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
          </div>
        </div>
      </div>
    </>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    const data = await fetch(`${process.env.BASE_URL}/api/getPhoto?id=${ctx.query.id}`)
    const json = data ? await data.json() : { image: {} }
    const props = { image: json.image, user }
    if (json.nextId) props.nextId = json.nextId
    if (json.prevId) props.prevId = json.prevId

    return {
      props,
    }
  }
  if (typeof window === 'undefined') {
    ctx.res.writeHeader(307, { Location: '/login' })
    ctx.res.end()
  } else if (Router) Router.replace('/login')

  return { props: {} }
}

export default MemoryPage
