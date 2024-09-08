'use client'

import React, { useEffect, useState } from 'react'

interface Note {
  noteId: string
  content: string
  isNumbered: boolean
  noteNumber?: number
  verticalDistance?: number
}

const MarginNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [noteCounter, setNoteCounter] = useState(1) // Shared counter between references and notes

  useEffect(() => {
    const references = document.querySelectorAll('[note-ref-id]')
    const notesContent: Note[] = []
    let counter = 1 // Counter initialized here

    references.forEach((ref) => {
      const noteId = ref.getAttribute('note-ref-id')
      const noteContent = ref.getAttribute('content')
      const isNumbered = ref.getAttribute('numbered') === 'true' // Ensure it's boolean

      if (noteId && noteContent) {
        const verticalDistance = ref.getBoundingClientRect().top

        const note: Note = {
          noteId,
          content: noteContent,
          isNumbered,
          noteNumber: isNumbered ? counter : undefined, // Use the shared counter
          verticalDistance,
        }

        // Add <sup> only if it doesn't exist
        if (isNumbered && !ref.querySelector('sup')) {
          const supElement = document.createElement('sup')
          supElement.classList.add('text-primary-500') // Add Tailwind's primary color
          supElement.textContent = counter.toString() // Number in main content
          ref.appendChild(supElement)
        }

        notesContent.push(note)
        if (isNumbered) counter++ // Increment counter after processing each numbered note
      }
    })

    setNotes(notesContent)
  }, [noteCounter]) // Empty dependency array to ensure it runs once

  let lastNoteBottom = 0 // Track bottom of the last note to avoid overlaps

  return (
    <div id="notes-container" className="relative mt-10">
      {notes.length > 0 && (
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Margin Notes ↓
        </h2>
      )}

      {notes.map(({ noteId, content, isNumbered, noteNumber, verticalDistance }) => {
        const spacing = 20 // Minimum spacing between notes
        let topPosition = verticalDistance || 0

        // Ensure note is positioned below the last note, with proper spacing
        if (topPosition < lastNoteBottom + spacing) {
          topPosition = lastNoteBottom + spacing
        }

        const noteStyle: React.CSSProperties = {
          position: 'relative',
          top: `${topPosition - lastNoteBottom}px`, // Set position relative to the previous one
        }

        // Update last note bottom position after rendering this note
        const noteHeight = 50 // Approximate note height
        lastNoteBottom = topPosition + noteHeight

        return (
          <div key={noteId} id={`note-${noteId}`} className="relative w-48" style={noteStyle}>
            {isNumbered && <sup className="text-primary-500">{noteNumber}</sup>} {content}
          </div>
        )
      })}
    </div>
  )
}

export default MarginNoteManager
