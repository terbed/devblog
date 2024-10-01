'use client'

import React, { useEffect, useState } from 'react'

interface CitationGeneratorProps {
  author: string
  title: string
  date: string
  url?: string
}

const CitationGenerator: React.FC<CitationGeneratorProps> = ({ author, title, date, url }) => {
  const [fullUrl, setFullUrl] = useState<string | null>(null)

  // Run client-side to set the full URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setFullUrl(window.location.origin + (url || window.location.pathname))
    }
  }, [url])

  const formattedDate = new Date(date).toLocaleDateString()

  // Wait until the client has calculated the fullUrl
  if (!fullUrl) {
    return null // or a loader if you'd prefer
  }

  return (
    <div className="mt-8">
      <span className="">For attribution, please cite this work as:</span>
      <div className="mt-1 rounded-md bg-gray-50 p-4 dark:bg-gray-800">
        <p className="">
          <span className="font-bold">{author}</span>, "<span className="">{title}</span>."
          Published on <span className="font-bold">{formattedDate}</span>. Available at:{' '}
          <a href={fullUrl} className="text-primary-600 underline dark:text-primary-500">
            {fullUrl}
          </a>
          .
        </p>
      </div>

      {/* BibTeX Attribution */}
      <details className="mt-4">
        <summary className="cursor-pointer text-primary-600 underline dark:text-primary-500">
          BibTeX Citation
        </summary>
        <pre className="overflow-auto rounded-md bg-gray-100 p-2 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {`@online{${author.replace(/\s/g, '_')}_${new Date(date).getFullYear()},
  author    = {${author}},
  title     = {${title}},
  year      = {${new Date(date).getFullYear()}},
  url       = {${fullUrl}},
  note      = {Accessed: ${new Date().toLocaleDateString()}}
}`}
        </pre>
      </details>
    </div>
  )
}

export default CitationGenerator
