'use client'

import { useEffect, useState } from 'react'

const FilledCircle = ({ color }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill={color} />
  </svg>
)

const ColorSwitch = () => {
  const [primaryColor, setPrimaryColor] = useState('pink') // Default color is pink

  // Handle color switch between pink and green
  const handleColorSwitch = () => {
    const newColor = primaryColor === 'pink' ? 'green' : 'pink'
    setPrimaryColor(newColor)

    // Apply the new primary color by adding a class to the <html> element
    document.documentElement.classList.remove(`theme-${primaryColor}`)
    document.documentElement.classList.add(`theme-${newColor}`)
  }

  useEffect(() => {
    // On mount, ensure the correct color class is applied to <html>
    document.documentElement.classList.add(`theme-${primaryColor}`)
  }, [])

  return (
    <div className="flex items-center space-x-4">
      {/* Color Switcher with Circle SVG */}
      <div className="mr-5 flex items-center">
        <button aria-label="Color switcher" onClick={handleColorSwitch}>
          <FilledCircle color={primaryColor === 'pink' ? '#ec407a' : '#40ecb2'} />
        </button>
      </div>
    </div>
  )
}

export default ColorSwitch
