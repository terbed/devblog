'use client' // Ensures it's a client-side component

import React, { useState, useEffect } from 'react'

let sideNoteCounter = 0 // Global counter to maintain numbering

interface SideNoteProps {
  children: React.ReactNode
  noteId: string // unique ID for tracking the note's position
}

const SideNote = ({ children, noteId }: SideNoteProps) => {
  const [noteNumber, setNoteNumber] = useState(0)

  useEffect(() => {
    sideNoteCounter += 1
    setNoteNumber(sideNoteCounter)

    const sideNote = document.getElementById(`side-note-${noteId}`)
    const ref = document.getElementById(`ref-${noteId}`)

    if (sideNote && ref) {
      const refRect = ref.getBoundingClientRect()
      const noteContainer = sideNote.parentElement

      if (noteContainer) {
        const previousNote = sideNote.previousElementSibling as HTMLElement | null
        const previousNoteBottom = previousNote ? previousNote.getBoundingClientRect().bottom : 0
        const refTop = refRect.top + window.scrollY - noteContainer.offsetTop
        const topOffset = Math.max(refTop, previousNoteBottom + 20) // 20px padding between notes

        sideNote.style.top = `${topOffset}px`
      }
    }
  }, [noteId])

  return (
    <div
      id={`side-note-${noteId}`}
      className="absolute left-0 w-48 italic text-gray-700 dark:text-gray-300"
    >
      <sup>{noteNumber}</sup> {children}
    </div>
  )
}

export default SideNote
