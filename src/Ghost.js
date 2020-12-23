import React, { useRef, useCallback, useState, useEffect } from 'react'
import { useObserver } from './useObservable'

export default function Ghost({ heightEstimate, keepVisible, children, ...props }) {
  const ghostRef = useRef()
  const [visible, setVisible] = useState(false)
  const [actualHeight, setActualHeight] = useState(heightEstimate)

  const intersectCallback = useCallback(
    (entry) => setVisible((previouslyVisible) => entry.isIntersecting || (previouslyVisible && keepVisible)),
    [keepVisible]
  )

  useEffect(() => {
    // Measure height when scrolled into view
    if (visible) {
      setActualHeight((previousHeight) => {
        return ghostRef.current.firstElementChild?.offsetHeight || previousHeight
      })
    }
  }, [visible, children])

  useEffect(() => {
    setActualHeight(heightEstimate)
  }, [heightEstimate])

  const resizeCallback = useCallback(() => {
    // Resize when resized. aka whatDoFat
    setActualHeight((previousHeight) => ghostRef.current.firstElementChild?.offsetHeight || previousHeight)
  }, [])

  useObserver(ghostRef, intersectCallback, resizeCallback)
  return (
    <div ref={ghostRef} style={{ height: visible ? undefined : actualHeight }} {...props}>
      <div>{visible && children}</div>
    </div>
  )
}
