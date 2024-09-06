'use client'

import React, { useEffect } from 'react'

interface MarginNoteProps {
  children: React.ReactNode
  noteId: string
}

const MarginNote = ({ children, noteId }: MarginNoteProps) => {
  useEffect(() => {
    const marginNote = document.getElementById(`margin-note-${noteId}`)
    const ref = document.getElementById(`ref-${noteId}`)

    if (marginNote && ref) {
      const refRect = ref.getBoundingClientRect()
      const noteContainer = document.getElementById('notes-container')

      if (noteContainer) {
        const previousNote = marginNote.previousElementSibling as HTMLElement | null
        const previousNoteBottom = previousNote ? previousNote.getBoundingClientRect().bottom : 0
        const refTop = refRect.top + window.scrollY - noteContainer.getBoundingClientRect().top
        const topOffset = Math.max(refTop, previousNoteBottom + 20)

        marginNote.style.top = `${topOffset}px`
      }
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
