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
  const [imagesLoaded, setImagesLoaded] = useState(false)
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
        const spacing = 20 // Minimum spacing between notes
        if (verticalDistance < lastNoteBottom + spacing) {
          verticalDistance = lastNoteBottom + spacing
        }

        // Calculate the actual height of the note content
        const tempDiv = document.createElement('div')
        tempDiv.style.cssText = `
          all: unset;
          visibility: hidden;
          position: absolute;
          width: 275px; // Adjust to match note width
          font-family: ${getComputedStyle(document.body).fontFamily};
        `
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

  // Run calculatePositions on initial render
  useLayoutEffect(() => {
    calculatePositions()
  }, [isMobile])

  // Recalculate positions after images have loaded
  useLayoutEffect(() => {
    if (imagesLoaded) {
      calculatePositions()
    }
  }, [imagesLoaded, isMobile])

  // Handle window resize
  useLayoutEffect(() => {
    if (!isMobile) {
      const handleResize = () => {
        calculatePositions()
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isMobile, imagesLoaded])

  // Image loading handling
  useEffect(() => {
    const images = Array.from(document.querySelectorAll('img'))
    let loadedCount = 0
    const totalImages = images.length

    if (totalImages === 0) {
      setImagesLoaded(true)
      return
    }

    const onImageLoad = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImagesLoaded(true)
      }
    }

    images.forEach((img) => {
      if (img.complete) {
        loadedCount++
      } else {
        img.addEventListener('load', onImageLoad)
      }
    })

    if (loadedCount === totalImages) {
      setImagesLoaded(true)
    }

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', onImageLoad)
      })
    }
  }, [])

  // MutationObserver for dynamically added images
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      let imagesAdded = false

      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'IMG') {
              imagesAdded = true
              const img = node as HTMLImageElement
              if (img.complete) {
                calculatePositions()
              } else {
                img.addEventListener('load', calculatePositions)
              }
            } else if (node instanceof Element) {
              const imgs = node.querySelectorAll('img')
              if (imgs.length > 0) {
                imagesAdded = true
                imgs.forEach((img) => {
                  if (img.complete) {
                    calculatePositions()
                  } else {
                    img.addEventListener('load', calculatePositions)
                  }
                })
              }
            }
          })
        }
      }

      if (imagesAdded) {
        calculatePositions()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  // Handle mermaid diagrams rendering
  useEffect(() => {
    const handleMermaidRendered = () => {
      calculatePositions()
    }

    window.addEventListener('mermaidRendered', handleMermaidRendered)

    return () => {
      window.removeEventListener('mermaidRendered', handleMermaidRendered)
    }
  }, [])

  // Handle mobile view inline notes
  useEffect(() => {
    if (isMobile) {
      // Insert notes inline after their references
      notes.forEach((note) => {
        const { referenceElement, content } = note
        if (referenceElement) {
          if (!referenceElement.nextElementSibling?.classList.contains('inline-note')) {
            const noteSpan = document.createElement('span')
            noteSpan.classList.add('inline-note', 'text-sm', 'text-gray-600', 'dark:text-gray-300')
            noteSpan.innerHTML = ` (${content})` // Content in parentheses without numbering
            referenceElement.parentNode?.insertBefore(noteSpan, referenceElement.nextSibling)
          }
        }
      })
    } else {
      // Remove inline notes when switching back to desktop
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
          left: '-40px', // Adjust this value as needed
          width: '275px', // Adjust the width as needed
        }

        return (
          <div
            key={noteId}
            id={`note-${noteId}`}
            className="absolute mt-2 w-48 text-left text-sm text-gray-600 dark:text-gray-300"
            style={noteStyle}
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
