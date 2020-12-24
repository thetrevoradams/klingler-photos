import React, { createContext, useEffect, useContext, memo, useMemo, useRef } from 'react'
import shallowEqual from './shallowEqual'

const makeObserver = () => {
  const intersectRegistry = new Map()
  const resizeRegistry = new Map()
  const intersections = new Set()
  const intersectCallback = (entries) => {
    entries.forEach((entry) => {
      const whoDis = entry.target
      const whatDo = intersectRegistry.get(whoDis)
      if (whatDo) {
        whatDo(entry)
      }
      if (entry.isIntersecting) {
        intersections.add(entry)
      } else {
        intersections.delete(entry)
      }
    })
  }
  let intersectObserver
  let currentOptions
  return {
    observe: (whoDis, whatDoShow, whatDoFat) => {
      intersectRegistry.set(whoDis, whatDoShow)
      intersectObserver?.observe(whoDis)

      resizeRegistry.set(whoDis, whatDoFat)
    },
    unObserve: (whoDis) => {
      intersectRegistry.delete(whoDis)
      intersectObserver?.unobserve(whoDis)

      resizeRegistry.delete(whoDis)
      intersections.delete(whoDis)
    },
    // NOTE: We use this when a new observer is made. The old observer applies the options to the new one.
    setOptions: (newOptions) => {
      if (!shallowEqual(currentOptions, newOptions)) {
        intersectObserver?.disconnect()
        intersectObserver = new IntersectionObserver(intersectCallback, {
          ...newOptions,
          root: null,
        })
        currentOptions = newOptions
        intersectRegistry.forEach((value, entry) => {
          intersectObserver?.observe(entry)
        })
      }
    },

    updateWidth: () => {
      intersections.forEach((intersection) => {
        const whatDoFat = resizeRegistry.get(intersection.target)
        if (whatDoFat) {
          whatDoFat()
        }
      })
    },
  }
}

const ObserverContext = createContext()

export const Observable = memo(({ children, threshold = 0.01, ...options }) => {
  const observer = useMemo(() => makeObserver(), [])
  const widthRef = useRef()
  useEffect(() => {
    observer.setOptions({ threshold, ...options })
  }, [options, threshold, observer])
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => observer.updateWidth())
    resizeObserver.observe(widthRef.current)
    return () => resizeObserver.disconnect()
  }, [observer])
  return (
    <div ref={widthRef}>
      <ObserverContext.Provider value={observer}>{children}</ObserverContext.Provider>
    </div>
  )
})

export const useObserver = (ref, intersectCallback, resizeCallback) => {
  const observer = useContext(ObserverContext)
  useEffect(() => {
    const elem = ref.current
    if (elem) {
      observer.observe(elem, intersectCallback, resizeCallback)
    }
    return () => {
      observer.unObserve(elem)
    }
  }, [ref, intersectCallback, resizeCallback, observer])
}
