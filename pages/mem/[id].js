/* eslint-disable no-underscore-dangle */
import React, { useEffect, useRef, useReducer } from 'react'
import { DiscussionEmbed } from 'disqus-react'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import DatePicker from 'react-datepicker'
import Nav from '../../src/nav'
import verifySession from '../../utils/verifySession'
import 'react-datepicker/dist/react-datepicker.css'
import updateFileData from '../../src/updateFileData'
import Toast from '../../src/toast'
import getPhotos from '../../src/getPhotos'

const initialState = {
  image: { id: '', filename: '', date: { s: 0 } },
  errorMsg: '',
  error: false,
  successMsg: false,
  editing: false,
  loading: true,
  updating: false,
  dateVal: 0,
}

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState
    case 'loading':
      return { ...state, loading: true }
    case 'loaded': {
      const { dateTime, filename, img, prev, next } = action.data
      let formattedDate
      if (dateTime) {
        const newDate = new Date(dateTime * 1000)
        formattedDate = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(
          newDate
        )
      }
      return {
        ...state,
        successMsg: '',
        errorMsg: '',
        error: '',
        dateVal: new Date(dateTime * 1000),
        displayedDate: formattedDate,
        displayedFilename: filename,
        filenameVal: filename,
        image: img,
        prevId: prev,
        nextId: next,
        loading: false,
      }
    }
    case 'clearMsg':
      return { ...state, successMsg: '', errorMsg: '' }
    case 'notEditing':
      return { ...state, editing: false }
    case 'toggleEdit':
      return { ...state, editing: !state.editing }
    case 'dateValChanged':
      return { ...state, dateVal: action.data.dateVal }
    case 'filenameValChange':
      return { ...state, filenameVal: action.data.filenameVal }
    case 'error':
      return { ...state, loading: false, error: true }
    case 'updating':
      return { ...state, updating: true }
    case 'successfulEdit': {
      let formattedDate
      if (state.dateVal) {
        formattedDate = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(
          state.dateVal
        )
      }
      return {
        ...state,
        updating: false,
        editing: false,
        displayedFilename: state.filenameVal,
        displayedDate: formattedDate,
        successMsg: 'Successfully saved your changes',
      }
    }
    case 'failedEdit':
      return { ...state, updating: false, editing: false, errorMsg: action.data.errorMsg }
    default:
      return state
  }
}

const MemoryPage = ({ user, imageId }) => {
  // image: {
  //   id,
  //   contributorName,
  //   url,
  //   filename,
  //   date: { _seconds: s },
  //   tags,
  // },
  // nextId,
  // prevId,
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    image: { id, contributorName, url },
    nextId,
    prevId,
    loading,
    editing,
    updating,
    displayedDate,
    displayedFilename,
    errorMsg,
    successMsg,
    filenameVal,
    dateVal,
    error,
  } = state
  const editModalRef = useRef()

  const router = useRouter()
  const disqusShortname = `klingler`
  const disqusConfig = {
    url: `https://klingler.theburrow.us/mem/${id}`,
    identifier: `${id}`,
    title: `${displayedFilename}`,
  }

  useEffect(() => {
    dispatch({ type: 'loading' })
    if (user) {
      dispatch({ type: 'reset' })
      const fetchData = async () => {
        try {
          const { imgResp } = await getPhotos()
          if (imgResp) {
            const imageIndex = imgResp.findIndex((item) => item.id === imageId)
            if (imageIndex >= 0) {
              let next
              let prev
              if (imageIndex !== imgResp.length - 1) next = imgResp[imageIndex + 1].id
              if (imageIndex !== 0) prev = imgResp[imageIndex - 1].id
              const img = imgResp[imageIndex]
              dispatch({
                type: 'loaded',
                data: { dateTime: img.date.seconds, filename: img.filename, img, prev, next },
              })
            }
          } else {
            dispatch({ type: 'error' })
          }
        } catch (fetchError) {
          dispatch({ type: 'error' })
        }
      }
      fetchData()
    }
  }, [imageId, user])

  useEffect(() => {
    const handleKeyNavigate = (e) => {
      if (e.key === 'ArrowLeft' && prevId) router.push(`/mem/${prevId}`)
      if (e.key === 'ArrowRight' && nextId) router.push(`/mem/${nextId}`)
    }
    document.addEventListener('keydown', handleKeyNavigate)
    return () => {
      document.removeEventListener('keydown', handleKeyNavigate)
    }
  }, [nextId, prevId, router])

  useEffect(() => {
    document.body.style.overflow = editing ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [editing])

  useEffect(() => {
    const clickOutside = (e) => {
      if (e.type === 'keydown') {
        if (e.key === 'Escape') dispatch({ type: 'notEditing' })
      } else if (editModalRef.current && !editModalRef.current.contains(e.target)) {
        // Need to ensure button 'onClick' doesn't toggle the visible state
        setTimeout(() => {
          dispatch({ type: 'notEditing' })
        }, 50)
      }
    }
    document.addEventListener('mouseup', clickOutside)
    document.addEventListener('keydown', clickOutside)
    return () => {
      document.removeEventListener('mouseup', clickOutside)
      document.removeEventListener('keydown', clickOutside)
    }
  }, [editModalRef])

  const handleUpdate = async () => {
    dispatch({ type: 'updating' })
    try {
      const resp = await updateFileData(imageId, { filenameVal, dateVal })
      if (!resp.error) {
        dispatch({ type: 'successfulEdit' })
      } else {
        dispatch({ type: 'failedEdit', data: { errorMsg: `There was a problem saving your changes: ${resp.error}` } })
      }
    } catch (err) {
      dispatch({ type: 'failedEdit', data: { errorMsg: `There was a problem saving your changes: ${err}` } })
    }
  }

  const onChange = ({ target }) => {
    if (target.name === 'filename') dispatch({ type: 'filenameValChange', data: { filenameVal: target.value } })
  }

  return (
    <div className="h-full min-h-screen w-full">
      <Nav user={user} />

      {loading ? (
        <div className="flex flex-1 flex-wrap h-full w-full text-center flex-col justify-center items-center">
          <svg
            className="animate-spin mt-28 h-16 w-16 opacity-70 text-light-blue-600"
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
        </div>
      ) : (
        <>
          {error ? (
            <div className="flex flex-wrap p-10 justify-center text-red-400">
              Whoops! There was an error fetching the photo.
            </div>
          ) : (
            <>
              <div className="bg-gray-100 flex justify-center items-center h-45vh lg:h-60vh relative">
                {errorMsg && <Toast type="error" msg={errorMsg} onComplete={() => dispatch({ type: 'clearMsg' })} />}
                {successMsg && (
                  <Toast type="success" msg={successMsg} onComplete={() => dispatch({ type: 'clearMsg' })} />
                )}
                <img src={url} alt={displayedFilename} className="object-contain h-full" />
                {prevId && (
                  <Link href={`/mem/${prevId}`}>
                    <a className="absolute top-3/5 left-0 px-5 py-8 opacity-50 hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        className="rounded-full text-white bg-gray-700 font-bold h-10 w-10 flex items-center justify-center"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    </a>
                  </Link>
                )}
                {nextId && (
                  <Link href={`/mem/${nextId}`}>
                    <a className="absolute top-3/5 right-0 px-5 py-8 opacity-50 hover:opacity-100">
                      <button
                        type="button"
                        className="rounded-full text-white bg-gray-700 font-bold h-10 w-10 flex items-center justify-center transition-opacity"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </a>
                  </Link>
                )}
              </div>
              <div className="bg-white flex xl:justify-center">
                <div className="mx-8 w-full xl:w-4/5 max-w-screen-xl">
                  <div className="flex justify-between items-center mt-8">
                    <h1 className="text-6xl smMax:text-2xl mdMax:text-5xl lgMax:text-5xl font-bold ">
                      {displayedFilename}
                    </h1>
                    <button
                      type="button"
                      onClick={() => dispatch({ type: 'toggleEdit' })}
                      className="text-gray-400 hover:text-light-blue-500 transition-colors duration-200 pl-2 py-4"
                    >
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div
                    className="grid gap-2 mt-8"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
                  >
                    {contributorName && (
                      <div className="py-2">
                        <span className="uppercase font-light text-gray-500">Uploaded By</span>
                        <p className="text-2xl text-gray-900 font-semibold pt-2">{contributorName}</p>
                      </div>
                    )}
                    {displayedDate && (
                      <div className="py-2">
                        <span className="uppercase font-light text-gray-500">Date</span>
                        <p className="text-2xl text-gray-900 font-semibold pt-2">{displayedDate}</p>
                      </div>
                    )}
                  </div>
                  <div className="description w-full my-16 text-gray-500 text-sm">
                    <p className="italic text-center">
                      This comment service requires you to create an account and be signed in to be able to post a
                      comment. There are links to sign up shown below.
                    </p>
                    <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
                  </div>
                </div>
                {editing && (
                  <div
                    ref={editModalRef}
                    role="dialog"
                    aria-modal="true"
                    className="origin-top-right top-0 smMax:h-screen sm:top-1/3 left-0 right-0 fixed mx-auto my-0 sm:w-1/2 lg:w-1/3 max-w-screen-sm rounded-md shadow-2xl bg-white ring-1 ring-black ring-opacity-5 flex flex-col z-20"
                  >
                    <div className="p-4">
                      <p className="uppercase font-light text-gray-500">Edit Info</p>
                    </div>

                    <div className="p-4 flex-grow">
                      <label className="block">
                        <span className="text-gray-700">Name</span>
                        <input
                          name="filename"
                          onChange={onChange}
                          value={filenameVal}
                          className="border border-gray-300 rounded-md p-2 mt-1 block w-full"
                          placeholder={filenameVal}
                        />
                      </label>
                      <div className="mt-4 flex flex-col">
                        <span className="text-gray-700">Date</span>
                        <DatePicker
                          selected={dateVal}
                          onChange={(date) => dispatch({ type: 'dateValChanged', data: { dateVal: date } })}
                          inputPlaceholder="Select a date"
                          showYearDropdown
                          dateFormat="MM/dd/yyyy"
                          className="w-full"
                          customInput={
                            <input
                              className="border border-gray-300 rounded-md mt-1 p-2 w-full"
                              placeholder={dateVal}
                            />
                          }
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-md">
                      <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={updating ? true : undefined}
                        className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-light-blue-600 text-base font-medium text-white hover:bg-light-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-60 ${
                          updating ? 'cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        {updating && (
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                        )}
                        {updating ? 'Processing' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'notEditing' })}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export async function getServerSideProps(ctx) {
  const { authenticated, user } = await verifySession(ctx)
  if (authenticated) {
    return {
      props: { user, imageId: ctx.query.id },
    }
  }
  if (typeof window === 'undefined') {
    ctx.res.writeHeader(307, { Location: '/login' })
    ctx.res.end()
  } else if (Router) Router.replace('/login')

  return { props: {} }
}

export default MemoryPage
