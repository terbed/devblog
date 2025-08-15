'use client'

import React, { useLayoutEffect, useEffect, useState, useRef } from 'react'

/**
 * MarginNoteManager
 *
 * Responsibilities:
 * - Collect all elements with [note-ref-id] in the article.
 * - Extract note HTML content using the following priority:
 *   1) Preferred: hidden child .reference-content innerHTML (new MDX syntax via <MarginNote> children)
 *   2) Fallback: legacy `content` attribute on the reference element
 *   3) Last resort: the element's own innerHTML (with any <sup> removed)
 * - On desktop: position notes in the margin, add numbered <sup> markers next to references when numbered.
 * - On mobile: insert inline notes immediately after references using the same extracted HTML (no numbering).
 * - Recalculate positions on layout/resize/image load/mermaid render.
 *
 * Backward compatibility:
 * - Legacy <span class="reference" note-ref-id="..." numbered="true|false" content="..."></span> continues to work.
 * - New syntax <MarginNote numbered>LaTeX/MDX here</MarginNote> compiles to hidden HTML that we extract.
 */
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
      const isNumbered = ref.getAttribute('numbered') === 'true'
      let noteContent = ref.getAttribute('content')

      // Prefer MDX/HTML content nested inside the reference element (new syntax)
      if (!noteContent) {
        const contentEl = (ref as Element).querySelector('.reference-content') as HTMLElement | null
        if (contentEl) {
          noteContent = contentEl.innerHTML
        } else {
          // Fallback: use the element's own innerHTML (excluding any sup markers)
          const clone = ref.cloneNode(true) as HTMLElement
          clone.querySelectorAll('sup').forEach((el) => el.remove())
          noteContent = clone.innerHTML
        }
      }

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
    requestAnimationFrame(() => {
      calculatePositions()
    })
  }, [isMobile])

  // Recalculate positions after images have loaded
  useEffect(() => {
    const images = Array.from(document.querySelectorAll('img'))

    images.forEach((img) => {
      img.addEventListener('load', () => {
        requestAnimationFrame(() => {
          calculatePositions()
        })
      })
    })

    // Clean up event listeners
    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', calculatePositions)
      })
    }
  }, [])

  // Handle window resize
  useLayoutEffect(() => {
    if (!isMobile) {
      const handleResize = () => {
        requestAnimationFrame(() => {
          calculatePositions()
        })
      }
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isMobile])

  // MutationObserver for dynamically added images
  useEffect(() => {
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeName === 'IMG') {
              const img = node as HTMLImageElement
              img.addEventListener('load', () => {
                requestAnimationFrame(() => {
                  calculatePositions()
                })
              })
            } else if (node instanceof Element) {
              const imgs = node.querySelectorAll('img')
              imgs.forEach((img) => {
                img.addEventListener('load', () => {
                  requestAnimationFrame(() => {
                    calculatePositions()
                  })
                })
              })
            }
          })
        }
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
      requestAnimationFrame(() => {
        calculatePositions()
      })
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
