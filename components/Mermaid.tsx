'use client'

import React, { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from 'next-themes'

const Mermaid = ({ chart, caption }) => {
  const { theme } = useTheme()
  const [isClient, setIsClient] = useState(false)
  const mermaidDiv = useRef(null)
  const chartId = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && mermaidDiv.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default',
        flowchart: {
          useMaxWidth: false,
        },
        securityLevel: 'loose',
      })

      // Use mermaid.render to render the diagram
      const renderMermaid = async () => {
        try {
          const { svg } = await mermaid.render(chartId.current, chart)
          // @ts-ignore
          mermaidDiv.current.innerHTML = svg
          // Dispatch event after rendering
          if (typeof window !== 'undefined') {
            const event = new Event('mermaidRendered')
            window.dispatchEvent(event)
          }
        } catch (error) {
          console.error('Mermaid render error:', error)
        }
      }

      renderMermaid()
    }
  }, [isClient, theme, chart])

  if (!isClient) {
    return null
  }

  return (
    <div className="my-6">
      {/* Diagram container */}
      <div className="diagram-container">
        <div ref={mermaidDiv} className="mermaid" />
      </div>
      {/* Caption */}
      {caption && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">{caption}</p>
      )}
    </div>
  )
}

export default Mermaid
