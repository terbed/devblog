'use client'

import React from 'react'

let marginNoteCounter = 1 // Global counter for unique IDs

const MarginNote = ({ children, numbered = false }) => {
  const noteId = `margin-note-${marginNoteCounter++}`
  return (
    <span
      note-ref-id={noteId}
      // @ts-ignore
      numbered={numbered.toString()}
      className="reference"
      style={{ display: 'none' }} // Hide the content in the main text
    >
      {children}
    </span>
  )
}

export default MarginNote
