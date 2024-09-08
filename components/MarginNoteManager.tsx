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
    let counter = noteCounter // local variable for counter

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
          // Only add the number if no <sup> exists
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
  }, [noteCounter]) // Empty dependency array to run only once

  return (
    <div id="notes-container" className="relative mt-10">
      {notes.length > 0 && (
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Margin Notes ↓
        </h2>
      )}

      {notes.map(({ noteId, content, isNumbered, noteNumber, verticalDistance }) => {
        const noteStyle: React.CSSProperties = {
          position: 'absolute',
          top: `${verticalDistance}px`,
        }

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
