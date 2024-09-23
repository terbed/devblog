'use client'

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react'

interface Note {
  noteId: string
  content: string
  isNumbered: boolean
  noteNumber?: number
  verticalDistance?: number
}

const MarginNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const notesContainerRef = useRef<HTMLDivElement>(null)

  const calculatePositions = () => {
    const notesContainer = notesContainerRef.current
    if (!notesContainer) return

    const containerRect = notesContainer.getBoundingClientRect()

    const references = document.querySelectorAll('[note-ref-id]')
    const notesContent: Note[] = []
    let counter = 1
    let lastNoteBottom = 0 // Track bottom of the last note to avoid overlaps

    references.forEach((ref) => {
      const noteId = ref.getAttribute('note-ref-id')
      const noteContent = ref.getAttribute('content')
      const isNumbered = ref.getAttribute('numbered') === 'true'

      if (noteId && noteContent) {
        const refRect = ref.getBoundingClientRect()
        let verticalDistance = refRect.top - containerRect.top

        // Ensure note is positioned below the last note, with proper spacing
        const spacing = 20 // Minimum spacing between notes
        if (verticalDistance < lastNoteBottom + spacing) {
          verticalDistance = lastNoteBottom + spacing
        }

        // Calculate the actual height of the note content
        const tempDiv = document.createElement('div')
        tempDiv.style.visibility = 'hidden'
        tempDiv.style.position = 'absolute'
        tempDiv.style.width = '275px' // Use the same width as the note
        tempDiv.innerHTML = isNumbered ? `<sup>(${counter})</sup> ${noteContent}` : noteContent
        document.body.appendChild(tempDiv)
        const noteHeight = tempDiv.getBoundingClientRect().height
        document.body.removeChild(tempDiv)

        lastNoteBottom = verticalDistance + noteHeight

        const note: Note = {
          noteId,
          content: noteContent,
          isNumbered,
          noteNumber: isNumbered ? counter : undefined,
          verticalDistance,
        }

        // Add <sup> only if it doesn't exist
        if (isNumbered && !ref.querySelector('sup')) {
          const supElement = document.createElement('sup')
          supElement.classList.add('text-primary-500')
          supElement.textContent = `(${counter})` // Number in parentheses
          ref.appendChild(supElement)
        }

        notesContent.push(note)
        if (isNumbered) counter++
      }
    })

    setNotes(notesContent)
  }

  useLayoutEffect(() => {
    // Run the initial calculation
    calculatePositions()

    // Recalculate positions when the window resizes
    window.addEventListener('resize', calculatePositions)

    return () => {
      window.removeEventListener('resize', calculatePositions)
    }
  }, [])

  useEffect(() => {
    // Check if all images have loaded
    const images = Array.from(document.querySelectorAll('img'))
    let imagesLoaded = 0

    const onImageLoad = () => {
      imagesLoaded++
      if (imagesLoaded === images.length) {
        // All images are loaded, recalculate positions
        calculatePositions()
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        imagesLoaded++
      } else {
        img.addEventListener('load', onImageLoad)
      }
    })

    if (imagesLoaded === images.length) {
      // All images were already loaded
      calculatePositions()
    }

    // Clean up event listeners
    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', onImageLoad)
      })
    }
  }, [])

  return (
    <div id="notes-container" className="relative mt-1" ref={notesContainerRef}>
      {notes.length > 0 && (
        <h2 className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
          Margin Notes ↓
        </h2>
      )}

      {notes.map(({ noteId, content, isNumbered, noteNumber, verticalDistance }) => {
        const noteStyle: React.CSSProperties = {
          position: 'absolute',
          top: `${verticalDistance}px`,
          left: '-40px', // Adjust this value to move the notes closer to the main content
          width: '275px', // Adjust the width to bring notes closer
        }

        return (
          <div
            key={noteId}
            id={`note-${noteId}`}
            className="absolute mt-2 w-48 text-justify text-sm text-gray-600 dark:text-gray-300"
            style={noteStyle}
          >
            {isNumbered && <sup className="text-primary-500">({noteNumber})</sup>} {content}
          </div>
        )
      })}
    </div>
  )
}

export default MarginNoteManager
