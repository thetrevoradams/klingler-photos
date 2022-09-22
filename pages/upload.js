/* eslint-disable no-nested-ternary */
import { useState, useRef } from 'react'
import { Router } from 'next/router'
import Image from 'next/image'
import Nav from '../src/nav'
import verifySession from '../utils/verifySession'
import Toast from '../src/toast'
import uploadFiles from '../src/useUpload'

const Upload = ({ user }) => {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [files, setFiles] = useState([])
  const uploadRef = useRef()

  const handleFileSelect = () => {
    uploadRef.current.click()
  }
  const onChange = (e) => {
    setFiles(Array.from(e.target.files))
  }
  const removeImage = (e) => {
    const index = files.findIndex((item) => item.name === e.currentTarget.dataset.name)
    if (index > -1) {
      const copy = [...files]
      copy.splice(index, 1)
      setFiles(copy)
    }
  }
  const processUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const uploadResp = await uploadFiles(files, user)
      setLoading(false)
      if (uploadResp.success) {
        setSuccessMsg('Successfully uploaded file(s)')
        setFiles([])
      } else {
        setErrorMsg(`There was a problem uploading your file(s): ${uploadResp.error}`)
      }
    } catch (error) {
      setErrorMsg(`There was a problem uploading your file(s): ${error}`)
    }
  }

  return (
    <div className="bg-gray-100 h-full min-h-screen w-full flex flex-col">
      <Nav user={user} />
      {errorMsg && <Toast type="error" msg={errorMsg} onComplete={setErrorMsg} />}
      {successMsg && <Toast type="success" msg={successMsg} onComplete={setSuccessMsg} />}
      <section className="h-full overflow-auto p-8 w-full flex flex-col flex-grow">
        <div className="rounded border border-2 border-gray-300 py-12 px-4 flex flex-col justify-center items-center">
          <p className="mb-3 font-semibold text-gray-600 flex flex-wrap justify-center">
            <span>Start by selecting your file(s)</span>
          </p>
          <input ref={uploadRef} type="file" multiple className="hidden" onChange={onChange} accept="image/*" />
          <button
            onClick={handleFileSelect}
            type="button"
            className="mt-4 border border-light-blue-500 text-light-blue-500 rounded-sm font-bold py-2 px-4 flex items-center hover:bg-light-blue-500  hover:text-white focus:text-white focus:bg-light-blue-500 transition-opacity duration-200"
          >
            Upload a file
          </button>
        </div>

        <h1 className="pt-8 pb-3 font-semibold sm:text-lg text-gray-600">To Upload</h1>

        {files.length > 0 ? (
          <div className="flex flex-wrap justify-center">
            {files.map((image, index) => {
              const num = index
              return (
                <div key={`${image.name}-${num}`} className="relative rounded">
                  <div className="max-w-96 md:w-80 md:max-h-96 smMax:max-h-80 xsMax:max-h-72 m-3 overflow-hidden">
                    <img
                      alt={image.name}
                      src={URL.createObjectURL(image)}
                      className="w-full object-cover"
                      height="500px"
                      width="500px"
                    />
                  </div>
                  <button
                    data-name={image.name}
                    type="button"
                    onClick={removeImage}
                    className="rounded-full h-6 w-6 absolute border border-red-500  bg-red-100 flex justify-center items-center border-red-400 top-0 right-0"
                  >
                    <svg
                      className="text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      height="20px"
                      width="20px"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-1 flex-wrap h-full w-full text-center flex-col justify-center items-center">
            <Image className="mx-auto w-32" src="/no_image.png" alt="no data" width="184" height="152" />
            <span className="text-small text-gray-500">No files selected</span>
          </div>
        )}
      </section>
      <div className="flex justify-end p-4 bg-white align-center fixed bottom-0 w-full">
        <button
          type="button"
          onClick={() => setFiles([])}
          className="mr-3 rounded-sm px-3 py-1 text-gray-500 focus:bg-gray-400 focus:text-white hover:bg-gray-400 hover:text-white transition-color duration-200"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={processUpload}
          disabled={files.length > 0 && !loading ? undefined : true}
          className={`bg-light-blue-500 text-white rounded-sm font-bold py-2 px-4 mr-2 flex items-center disabled:opacity-60 hover:bg-light-blue-500 focus:bg-light-blue-500  transition-color duration-200 ${
            files.length && !loading ? 'cursor-pointer' : 'cursor-not-allowed'
          }`}
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {loading ? 'Processing' : files.length ? `Upload (${files.length})` : 'Upload'}
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    return {
      props: { user },
    }
  }
  if (typeof window === 'undefined') {
    ctx.res.writeHeader(307, { Location: '/login' })
    ctx.res.end()
  } else if (Router) Router.replace('/login')

  return { props: {} }
}

export default Upload
