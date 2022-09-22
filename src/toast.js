import { useEffect, useState } from 'react'

const Toast = ({ type = 'error', msg, persist, onComplete }) => {
  const [showing, setShowing] = useState(true)
  let toastClass
  let title
  switch (type) {
    case 'warn':
      title = 'Warning'
      toastClass = 'bg-yellow-50 border-yellow-500 text-yellow-600'
      break

    case 'error':
      title = 'Error'
      toastClass = 'bg-red-50 border-red-500 text-red-600'
      break

    case 'success':
      title = 'Success'
      toastClass = 'bg-green-50 border-green-500 text-green-600'
      break

    default:
      break
  }

  useEffect(() => {
    let visibleTime
    let fadeTime
    if (showing && !persist) {
      visibleTime = setTimeout(() => {
        // Give time for user to see toast
        setShowing(false)
      }, 4500)
    }
    if (!persist) {
      fadeTime = setTimeout(() => {
        // Allow fade out to complete
        onComplete()
      }, 4600)
    }
    return () => {
      clearTimeout(visibleTime)
      clearTimeout(fadeTime)
    }
  }, [showing, persist, onComplete])

  return (
    <div
      className={`${toastClass} ${
        showing ? 'slideInRight' : 'slideOutRight'
      } border-l-4 p-4 w-80 fixed top-10 right-0 z-20`}
      role="alert"
    >
      <p className="font-bold">{title}</p>
      <p>{msg}</p>
    </div>
  )
}

export default Toast
