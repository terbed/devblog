'use client'

import { ArrowUp, SpeechBubble } from '@/components/PixelIcons'
import siteMetadata from '@/data/siteMetadata'
import { useEffect, useState } from 'react'

const buttonClass =
  'flex h-8 w-8 items-center justify-center border border-rule bg-paper text-ink-faint transition-colors hover:border-primary-500/60 hover:text-primary-500'

const ScrollTopAndComment = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 50) setShow(true)
      else setShow(false)
    }

    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const handleScrollTop = () => {
    window.scrollTo({ top: 0 })
  }
  const handleScrollToComment = () => {
    document.getElementById('comment')?.scrollIntoView()
  }

  return (
    <div
      className={`fixed bottom-8 right-8 hidden flex-col gap-2 ${show ? 'md:flex' : 'md:hidden'}`}
    >
      {siteMetadata.comments?.provider && (
        <button
          aria-label="Scroll to comments"
          title="Comments"
          onClick={handleScrollToComment}
          className={buttonClass}
        >
          <SpeechBubble />
        </button>
      )}
      <button
        aria-label="Scroll to top"
        title="Top"
        onClick={handleScrollTop}
        className={buttonClass}
      >
        <ArrowUp />
      </button>
    </div>
  )
}

export default ScrollTopAndComment
