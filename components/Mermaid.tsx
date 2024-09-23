'use client'

import React, { useEffect, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes' // Assuming you're using `next-themes` for dark/light mode

const Mermaid = ({ chart, caption }) => {
  const { theme } = useTheme() // Get the current theme (dark or light)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true) // Ensure that the component only runs on the client
    if (isClient) {
      mermaid.initialize({
        startOnLoad: true,
        theme: theme === 'dark' ? 'dark' : 'default', // Apply the correct theme for Mermaid
      })
      mermaid.contentLoaded()
    }
  }, [theme, isClient]) // Re-run when theme changes and after client is ready

  if (!isClient) {
    return null // Don't render anything on the server
  }

  return (
    <div className="my-6 flex flex-col items-center">
      {/* Center the chart */}
      <div className="mermaid max-w-2xl">{chart}</div>

      {/* Caption with smaller size and gray shade */}
      {caption && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{caption}</p>
      )}
    </div>
  )
}

export default Mermaid
