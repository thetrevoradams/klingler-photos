import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

import "rc-pagination/assets/index.css";
import Pagination from 'rc-pagination';
import Card from './card'
const PAGE_SIZE = 50


const Grid = ({ images, }) => {
  const router = useRouter()
  const { current } = router.query
  const to = PAGE_SIZE * (current || 1)
  const from = to - PAGE_SIZE
  const [displayedImages, setDisplayedImages] = useState(images?.slice(from, to) ?? [])

  const updateImages = (currentPage) => {
    const newTo = PAGE_SIZE * parseInt(currentPage)
    const newFrom = newTo - PAGE_SIZE
    const newPageSet = images.slice(newFrom, newTo)

    setDisplayedImages(newPageSet)
  }

  useEffect(() => {
    // Always do navigations after the first render
    if (!router.query?.current) {
      router.push('/?current=1', undefined, { shallow: true })
    }
  }, [])

  useEffect(() => {
    updateImages(current ?? 1)
  }, [router.query.current])

  const onPageChange = (currentPage) => {
    updateImages(currentPage)
    router.push(`/?current=${currentPage}`, undefined, { shallow: true })
  }

  return (
    <main className="flex flex-col items-center">
      <section className="flex flex-wrap justify-center">
        {displayedImages.map(({ id, ...props }) => (
          <Card key={id} id={id} {...props} />
        ))}
      </section>
      <Pagination current={parseInt(current ?? 1)} pageSize={PAGE_SIZE} total={images?.length} onChange={onPageChange} showTitle={false} />
    </main>
  )
}

export default Grid
