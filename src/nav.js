import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useRequireAuth from './useRequireAuth'

const Nav = () => {
  const [monogram, setMonogram] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const { user, signOut } = useRequireAuth()
  useEffect(() => {
    if (user?.firstName) {
      const { firstName: f, lastName: l } = user
      setMonogram(`${f[0]}${l[0]}`)
    }
  }, [user])

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
        <button
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          className="relative z-10 block rounded-md bg-white"
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
          <div className="origin-top-right top-14 overflow-hidden absolute right-2 mt-2 w-56 rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5">
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
