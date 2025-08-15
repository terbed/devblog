'use client'

import React from 'react'

/**
 * MarginNote (MDX-friendly)
 *
 * Usage in MDX (preferred):
 *   <MarginNote numbered>
 *     This supports MDX and LaTeX like $e^{i\pi}+1=0$ and **bold** text.
 *   </MarginNote>
 *
 * Legacy inline HTML (still supported for backward compatibility):
 *   <span className="reference" note-ref-id="2" numbered="true" content="<strong>Analogy:</strong> ..."></span>
 *
 * Implementation details:
 * - We render a span.reference with attributes note-ref-id and numbered.
 * - Children are placed into a hidden .reference-content element so that the MarginNoteManager
 *   can extract compiled innerHTML (including KaTeX-rendered LaTeX) and place it as a margin note.
 */
let marginNoteCounter = 1 // Global counter for unique IDs

type Props = { children: React.ReactNode; numbered?: boolean }

const MarginNote = ({ children, numbered = false }: Props) => {
  const noteId = `margin-note-${marginNoteCounter++}`
  return (
    <span
      note-ref-id={noteId}
      // @ts-ignore - allow boolean attribute via string
      numbered={numbered.toString()}
      className="reference"
    >
      {/* Keep content hidden inside, but allow the outer span to remain visible for numbered markers */}
      <span className="reference-content" style={{ display: 'none' }}>
        {children}
      </span>
    </span>
  )
}

export default MarginNote
