import React from 'react'

const Loader = () => {
  return (
    <svg
      className="mr-3"
      version="1.1"
      id="L4"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      height="100px"
      width="100px"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 0 0"
      xmlSpace="preserve"
    >
      <circle fill="#0EA1E3" stroke="none" cx="6" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
      </circle>
      <circle fill="#0EA1E3" stroke="none" cx="26" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
      </circle>
      <circle fill="#0EA1E3" stroke="none" cx="46" cy="50" r="6">
        <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
      </circle>
    </svg>
  )
}

export default Loader
