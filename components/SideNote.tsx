'use client'

import React, { useEffect, useState } from 'react'

// A shared ref that both MarginNote and SideNote can access
const lastNoteBottomRef = { current: 0 } // Tracks the bottom position of the last placed note

interface SideNoteProps {
  children: React.ReactNode
  noteId: string
}

const SideNote = ({ children, noteId }: SideNoteProps) => {
  const [noteNumber, setNoteNumber] = useState(0)

  useEffect(() => {
    const sideNote = document.getElementById(`side-note-${noteId}`)
    const ref = document.getElementById(`ref-${noteId}`)
    const noteContainer = document.getElementById('notes-container')

    if (sideNote && ref && noteContainer) {
      const refRect = ref.getBoundingClientRect()

      // Calculate the top position based on the reference element's position
      const refTop = refRect.top + window.scrollY - noteContainer.getBoundingClientRect().top

      // Get the last placed note's position from the shared ref
      const lastNoteBottom = lastNoteBottomRef.current
      const topOffset = Math.max(refTop, lastNoteBottom + 20)

      // Position the side note
      sideNote.style.top = `${topOffset}px`

      // Update the shared ref with the current note's bottom position
      lastNoteBottomRef.current = sideNote.getBoundingClientRect().bottom + window.scrollY
    }
  }, [noteId])

  return (
    <div
      id={`side-note-${noteId}`}
      className="absolute w-48 italic text-gray-700 dark:text-gray-300"
    >
      <sup>{noteNumber}</sup> {children}
    </div>
  )
}

export default SideNote
