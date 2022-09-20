import React, { useState } from 'react'
import "rc-pagination/assets/index.css";
import Pagination from 'rc-pagination';
import Card from './card'
const PAGE_SIZE = 50

const Grid = ({ images }) => {
  const [displayedImages, setDisplayedImages] = useState(images?.slice(0, PAGE_SIZE) ?? [])

  const onPageChange = (currentPage, pageSize) => {
    const to = PAGE_SIZE * currentPage
    const from = to - PAGE_SIZE
    const newPageSet = images.slice(from, to)
    setDisplayedImages(newPageSet)
  }
  return (
    <main className="flex flex-col items-center">
      <section className="flex flex-wrap justify-center">
        {displayedImages.map(({ id, ...props }) => (
          <Card key={id} id={id} {...props} />
        ))}
      </section>
      <Pagination className="ant-pagination" pageSize={PAGE_SIZE} total={images?.length} onChange={onPageChange} />
    </main>
  )
}

export default Grid
