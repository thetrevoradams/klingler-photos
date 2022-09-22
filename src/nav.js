import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import useAuth from './useAuth'

const Nav = ({ user }) => {
  const [monogram, setMonogram] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const { signOut } = useAuth()
  const modalRef = useRef()

  useEffect(() => {
    if (user?.firstName) {
      const { firstName: f, lastName: l } = user
      setMonogram(`${f[0]}${l[0]}`)
    }
  }, [user])

  useEffect(() => {
    const clickOutside = (e) => {
      if (e.type === 'keydown') {
        if (e.key === 'Escape') setNavOpen(false)
      } else if (modalRef.current && !modalRef.current.contains(e.target)) {
        // Need to ensure button 'onClick' doesn't toggle the visible state
        setTimeout(() => {
          setNavOpen(false)
        }, 50)
      }
    }
    document.addEventListener('mouseup', clickOutside)
    document.addEventListener('keydown', clickOutside)
    return () => {
      document.removeEventListener('mouseup', clickOutside)
      document.removeEventListener('keydown', clickOutside)
    }
  }, [modalRef])

  return (
    <div className="w-full shadow-sm sticky top-0 z-10">
      <div className="px-6 py-4 flex justify-end w-full bg-white">
        <Link href="/">
          <a className="flex flex-row items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              stroke="currentColor"
              className="flex-shrink-0 h-5 w-5 text-cyan-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <div className="uppercase tracking-wide text-sm text-light-blue-500 font-semibold ml-2">
              Klingler Photos
            </div>
          </a>
        </Link>
        <div className="flex-grow" />
        <Link href="/upload">
          <a className="text-gray-300 self-center mx-4 hover:text-light-blue-500 transition-colors duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              height="24px"
              width="24px"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
          </a>
        </Link>
        <button
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          className="border-l border-gray-300  pl-4 relative z-10 block bg-white"
          aria-haspopup="true"
          aria-expanded={navOpen}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 relative flex justify-center items-center">
              <div className="shadow-inner absolute inset-0 rounded-full bg-light-blue-500" />
              <div title="profile" className="absolute rounded-full ">
                <span className="uppercase p-2 text-center text-white">{monogram}</span>
              </div>
            </div>
            <div className="relative ml-2 flex justify-center items-center text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </button>
        {navOpen && (
          <div
            role="dialog"
            aria-modal="true"
            ref={modalRef}
            className="origin-top-right top-14 overflow-hidden absolute right-2 mt-2 w-56 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5"
          >
            <Link href="/profile">
              <a className="w-full block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-light-blue-500 hover:text-white text-center">
                your profile
              </a>
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="w-full block px-4 py-2 text-sm capitalize text-gray-700 hover:bg-light-blue-500 hover:text-white"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Nav
