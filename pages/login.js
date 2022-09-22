/* eslint-disable no-nested-ternary */
import { useState } from 'react'
import { useRouter } from 'next/router'
import useAuth from '../src/useAuth'
import Toast from '../src/toast'

const LoginPage = () => {
  const router = useRouter()
  const { signIn, passwordReset } = useAuth()
  const [loading, setLoading] = useState(false)
  const [forgotPass, setForgotPass] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onChange = ({ target }) => {
    if (target.name === 'email') setEmail(target.value)
    if (target.name === 'password') setPassword(target.value)
  }
  const onSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    if (forgotPass) {
      passwordReset(email).then((resp) => {
        setLoading(false)
        if (resp?.error) {
          setErrorMsg('Issue sending email. Verify what email was entered.')
        } else {
          setSuccessMsg('The password reset email has been sent.')
        }
      })
    } else {
      signIn(email, password)
        .then((resp) => {
          setLoading(false)
          setEmail('')
          setPassword('')
          if (resp.error) {
            setErrorMsg('Invalid email or password')
          } else {
            router.push('/')
          }
        })
        .catch(() => {
          setLoading(false)
          setErrorMsg('Invalid email or password')
        })
    }
  }
  const validEmail = () => {
    if (email.length > 1) {
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      const error = valid ? '' : 'Invalid email'
      setErrorMsg(error)
    } else {
      setErrorMsg('')
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
      {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl" />
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex flex-row items-center">
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
              <div className="uppercase tracking-wide text-md text-light-blue-500 font-semibold ml-2">
                Klingler Photos
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <p>A collection of family photos and memories.</p>
                <form method="POST" className="flex flex-col items-start" onSubmit={onSubmit}>
                  <div className="flex flex-col md:flex-row items-start w-full">
                    <input
                      onChange={onChange}
                      onBlur={validEmail}
                      className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 focus:border-blue-500 focus:outline-none"
                      placeholder="Email"
                      type="text"
                      name="email"
                      value={email}
                    />
                    {!forgotPass && (
                      <input
                        onChange={onChange}
                        className="border border-gray-300 bg-white text-gray-900 appearance-none block w-full rounded-md p-2 md:ml-2 mdMax:my-2 smMax:my-2 focus:border-blue-500 focus:outline-none"
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={password}
                      />
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!email || (!password && !forgotPass) || loading}
                    className={`my-4 w-full px-5 py-2 text-sm text-light-blue-500 font-semibold rounded-md border border-light-blue-200 hover:text-white hover:bg-light-blue-500 
                  uppercase hover:border-transparent focus:outline-none focus:ring-2 focus:ring-light-blue-500 focus:ring-offset-2 text-center disabled:opacity-50 ${
                    !email || (!password && !forgotPass) || loading ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  >
                    {loading ? 'Loading...' : forgotPass ? 'Send Password Reset Email' : 'Sign In'}
                  </button>
                  <button className="text-gray-500 text-sm" type="button" onClick={() => setForgotPass(!forgotPass)}>
                    {forgotPass ? 'Back to Sign In' : 'Forgot password?'}
                  </button>
                </form>
              </div>
              <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                <p>Don&apos;t have an account?</p>
                <p className="text-gray-400">Talk to Trevor</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
