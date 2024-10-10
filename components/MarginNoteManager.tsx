'use client'

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react'

interface Note {
  noteId: string
  content: string
  isNumbered: boolean
  noteNumber?: number
  verticalDistance?: number
  referenceElement?: Element
}

const MarginNoteManager = () => {
  const [notes, setNotes] = useState<Note[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const notesContainerRef = useRef<HTMLDivElement>(null)

  // Function to detect mobile view
  const detectMobile = () => {
    setIsMobile(window.innerWidth < 1280) // Adjust breakpoint as needed
  }

  useEffect(() => {
    detectMobile()
    window.addEventListener('resize', detectMobile)
    return () => window.removeEventListener('resize', detectMobile)
  }, [])

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
        // Use the ref element as the reference element
        const referenceElement = ref

        if (!isMobile) {
          // Add <sup> only if it doesn't exist
          if (isNumbered && !ref.querySelector('sup')) {
            const supElement = document.createElement('sup')
            supElement.classList.add('text-primary-500')
            supElement.textContent = `(${counter})` // Number in parentheses
            ref.appendChild(supElement)
          }
        }

        const refRect = referenceElement.getBoundingClientRect()
        let verticalDistance = refRect.top - containerRect.top

        // Ensure note is positioned below the last note, with proper spacing
        const spacing = 20 // Minimum spacing between posts
        if (verticalDistance < lastNoteBottom + spacing) {
          verticalDistance = lastNoteBottom + spacing
        }

        // Calculate the actual height of the note content
        const tempDiv = document.createElement('div')
        tempDiv.style.visibility = 'hidden'
        tempDiv.style.position = 'absolute'
        tempDiv.style.width = '350px' // Use the same width as the note
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
          referenceElement: ref,
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

    // Recalculate positions when the window resizes (desktop only)
    if (!isMobile) {
      window.addEventListener('resize', calculatePositions)
    }

    return () => {
      window.removeEventListener('resize', calculatePositions)
    }
  }, [isMobile])

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

  useEffect(() => {
    // Add event listener for 'mermaidRendered' event
    const handleMermaidRendered = () => {
      calculatePositions()
    }

    window.addEventListener('mermaidRendered', handleMermaidRendered)

    return () => {
      window.removeEventListener('mermaidRendered', handleMermaidRendered)
    }
  }, [calculatePositions])

  useEffect(() => {
    if (isMobile) {
      // Insert posts inline after their references
      notes.forEach((note) => {
        const { referenceElement, content } = note
        if (referenceElement) {
          // Check if note is already inserted
          if (!referenceElement.nextElementSibling?.classList.contains('inline-note')) {
            const noteSpan = document.createElement('span')
            noteSpan.classList.add('inline-note', 'text-sm', 'text-gray-600', 'dark:text-gray-300')
            noteSpan.innerHTML = ` (${content})` // Content in parentheses without numbering
            referenceElement.parentNode?.insertBefore(noteSpan, referenceElement.nextSibling)
          }
        }
      })
    } else {
      // Remove inline posts when switching back to desktop
      const inlineNotes = document.querySelectorAll('.inline-note')
      inlineNotes.forEach((note) => note.remove())
    }
  }, [isMobile, notes])

  return isMobile ? null : (
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
          left: '-40px', // Adjust this value to move the posts closer to the main content
          width: '275px', // Adjust the width to bring posts closer
        }

        return (
          <div
            key={noteId}
            id={`note-${noteId}`}
            className="absolute mt-2 w-48 text-left text-sm text-gray-600 dark:text-gray-300"
            style={noteStyle}
            // Use dangerouslySetInnerHTML to render HTML content
            dangerouslySetInnerHTML={{
              __html: `${
                isNumbered ? `<sup class="text-primary-500">(${noteNumber})</sup> ` : ''
              }${content}`,
            }}
          />
        )
      })}
    </div>
  )
}

export default MarginNoteManager
