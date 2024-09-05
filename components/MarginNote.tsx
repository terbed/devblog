// TODO: This is not working properly. We have to define a right margin outside the main panel somehow...
'use client' // Ensures it's a client-side component

import React, { useEffect, useState } from 'react'

type MarginNoteProps = {
  children: React.ReactNode
}

const MarginNote = ({ children }: MarginNoteProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust the breakpoint as needed
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <span
      className={`relative ${isMobile ? 'inline-block' : 'float-right ml-4 w-1/4 pl-4 text-sm'}`}
      style={{
        color: '#dc66d0',
        fontStyle: 'italic',
        borderLeft: isMobile ? 'none' : '2px solid #ddd',
        clear: 'both',
        marginBottom: isMobile ? '1em' : '0',
      }}
    >
      {children}
    </span>
  )
}

export default MarginNote
