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
  const [noteCounter, setNoteCounter] = useState(1)

  useEffect(() => {
    const references = document.querySelectorAll('[note-ref-id]')
    const notesContent: Note[] = []
    let counter = noteCounter

    references.forEach((ref) => {
      const noteId = ref.getAttribute('note-ref-id')
      const noteContent = ref.getAttribute('content')
      const numbered = ref.getAttribute('numbered')

      const isNumbered = numbered === 'true'

      if (noteId && noteContent) {
        const verticalDistance = ref.getBoundingClientRect().top

        const note: Note = {
          noteId,
          content: noteContent,
          isNumbered,
          noteNumber: isNumbered ? counter : undefined,
          verticalDistance,
        }

        if (isNumbered && !ref.querySelector('sup')) {
          const supElement = document.createElement('sup')
          supElement.classList.add('text-primary-500')
          supElement.textContent = counter.toString()
          ref.appendChild(supElement)
          counter += 1
        }

        notesContent.push(note)
      }
    })

    setNotes(notesContent)
    setNoteCounter(counter)
  }, [noteCounter]) // Only run once

  let lastNoteBottom = 0 // This tracks the position of the last note

  return (
    <div id="notes-container" className="relative mt-5">
      {notes.length > 0 && (
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Margin Notes ↓
        </h2>
      )}

      {notes.map(({ noteId, content, isNumbered, noteNumber, verticalDistance }) => {
        const spacing = 5 // Minimal spacing
        let topPosition = verticalDistance || 0

        // Adjust the position to prevent overlap with the last note
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
