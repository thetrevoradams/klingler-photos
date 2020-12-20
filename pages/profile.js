import React from 'react'
import useRequireAuth from '../src/useRequireAuth'

const Profile = () => {
  const auth = useRequireAuth()
  if (!auth.user) return null

  return (
    <div className="bg-gray-100 h-screen w-full">
      <div className="flex flex-wrap p-2 justify-center">
        Hey {auth.user.firstName}. You&apos;ll eventually see stuff here, but nothing special yet.
      </div>
    </div>
  )
}

export default Profile
