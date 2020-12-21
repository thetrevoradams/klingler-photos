import React from 'react'
import { DiscussionEmbed } from 'disqus-react'
import fetch from 'isomorphic-unfetch'
import Nav from '../../src/nav'

const MemoryPage = ({ image: { id, contributorName, url, filename, date, tags } }) => {
  const disqusShortname = filename
  const disqusConfig = {
    url: `https://klingler.theburrow.us/${id}`,
    identifier: id,
    title: filename,
  }

  return (
    <div>
      <Nav />
      <div className="bg-gray-100 flex justify-center items-center" style={{ height: '60vh' }}>
        <img src={url} alt={filename} className="object-contain h-full" />
      </div>
      <div className="bg-white">
        <div className="mx-32">
          <h1 className="text-6xl font-bold mt-16">{filename}</h1>

          {contributorName && (
            <div className="py-2 mt-16 ">
              <span className="uppercase font-light text-gray-500">Uploaded By</span>
              <p className="text-2xl text-gray-900 font-semibold pt-2">{contributorName}</p>
            </div>
          )}

          <div className="description w-full md:w-2/3 my-16 text-gray-500 text-sm">
            <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const data = await fetch(`${process.env.BASE_URL}/api/getPhoto?id=${query.id}`)
  const json = data ? await data.json() : { image: {} }

  return {
    props: { image: json.image },
  }
}

export default MemoryPage
