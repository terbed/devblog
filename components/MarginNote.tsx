'use client'

import React, { useEffect } from 'react'

// A shared ref that both MarginNote and SideNote can access
const lastNoteBottomRef = { current: 0 } // Tracks the bottom position of the last placed note

interface MarginNoteProps {
  children: React.ReactNode
  noteId: string
}

const MarginNote = ({ children, noteId }: MarginNoteProps) => {
  useEffect(() => {
    const marginNote = document.getElementById(`margin-note-${noteId}`)
    const ref = document.getElementById(`ref-${noteId}`)
    const noteContainer = document.getElementById('notes-container')

    if (marginNote && ref && noteContainer) {
      const refRect = ref.getBoundingClientRect()

      // Calculate the top position based on the reference element's position
      const refTop = refRect.top + window.scrollY - noteContainer.getBoundingClientRect().top

      // Get the last placed note's position from the shared ref
      const lastNoteBottom = lastNoteBottomRef.current
      const topOffset = Math.max(refTop, lastNoteBottom + 20) // Ensure 20px space between notes

      // Position the margin note
      marginNote.style.top = `${topOffset}px`

      // Update the shared ref with the current note's bottom position
      lastNoteBottomRef.current = marginNote.getBoundingClientRect().bottom + window.scrollY
    }
  }, [noteId])

  return (
    <div
      id={`margin-note-${noteId}`}
      className="absolute w-48 italic text-gray-700 dark:text-gray-300"
    >
      {children}
    </div>
  )
}

export default MarginNote
