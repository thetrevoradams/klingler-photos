import Image from 'next/image'
import Link from 'next/link'

const Card = ({ id, url, tags = [] }) => {
  return (
    <Link href={`/mem/${id}`} tabIndex={1}>
      <a className="overflow-hidden box-border border-b-4 border-light-blue-500 max-w-96 md:w-80 md:max-h-96 sm:h-80 smMax:max-h-80 xsMax:max-h-72 m-2.5 relative rounded bg-light-blue-100 focus:border-4">
        <Image src={url} alt="People" className="w-full object-cover" width={500} height={500} />
        {tags.length > 0 && (
          <div className="p-4 h-50 absolute bottom-0 w-full bg-gradient-to-b from-transparent to-white">
            <div className="text-sm flex items-center">
              <svg
                className="opacity-75 mr-2 light-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                height="24px"
                width="24px"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <p className="leading-none overflow-ellipsis">{tags.join(', ')}</p>
            </div>
          </div>
        )}
      </a>
    </Link>
  )
}

export default Card
