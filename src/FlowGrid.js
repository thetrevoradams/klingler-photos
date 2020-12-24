import React from 'react'
import { Observable } from './useObservable'
import Ghost from './Ghost'
import Card from './card'

const imagePartitions = (images, columnCount) => {
  const maxItemCount = 100
  let imagesCount = images.length
  if (imagesCount > maxItemCount) imagesCount = Math.round(maxItemCount / columnCount) * columnCount
  return images.reduce((partitions, imageItem, index) => {
    const needsNewPartition = index % imagesCount === 0
    if (needsNewPartition) partitions.push([])
    const partition = partitions[partitions.length - 1]
    partition.push(imageItem)
    return partitions
  }, [])
}

const FlowGrid = ({ heightEstimate, images }) => {
  const gridWidth = window.innerWidth - 16 // represents 8px each side (p-2)

  const numColumns = Math.floor(gridWidth / heightEstimate)
  const partitions = imagePartitions([...images], numColumns)

  return (
    <Observable>
      {partitions.map((partitionItems, index) => {
        const partitionRowCount = Math.ceil(partitionItems.length / numColumns)
        return (
          // eslint-disable-next-line react/no-array-index-key
          <Ghost key={index} heightEstimate={heightEstimate * partitionRowCount + (partitionRowCount - 1)}>
            <div className="flex flex-wrap justify-center">
              {partitionItems.map(({ id, ...props }) => (
                <Card key={id} id={id} {...props} />
              ))}
            </div>
          </Ghost>
        )
      })}
    </Observable>
  )
}

export default FlowGrid
