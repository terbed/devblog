'use client'

import { useEffect, useMemo, useState } from 'react'

export interface TocItem {
  value: string
  url: string
  depth: number
}

/** How far down the viewport a heading must pass to count as "current". */
const ACTIVE_LINE_OFFSET = 140

/**
 * Floating table of contents.
 *
 * Sits in the viewport margin beside the article as a minimap: one tick per
 * heading, indented by depth, with the current section marked. Ticks only at
 * xl — there is no room for labels until 2xl, where they appear alongside.
 */
export default function FloatingToc({ toc }: { toc?: TocItem[] }) {
  const items = useMemo(
    () => (toc ?? []).filter((item) => typeof item?.url === 'string' && item.url.startsWith('#')),
    [toc]
  )
  const [active, setActive] = useState('')
  // Which headings were actually found in the page. `null` until measured, so
  // the first client render matches the server's and hydration stays clean.
  const [resolved, setResolved] = useState<string[] | null>(null)

  useEffect(() => {
    if (!items.length) return
    const ids = items.map((item) => item.url.slice(1))

    // Measured once and re-measured on resize rather than per scroll event.
    let positions: { id: string; top: number }[] = []
    const measure = () => {
      positions = ids.flatMap((id) => {
        const el = document.getElementById(id)
        return el ? [{ id, top: el.getBoundingClientRect().top + window.scrollY }] : []
      })
      // Drop entries with no target. The TOC slugs come from the markdown
      // source and can drift from the ids rehype puts in the rendered output;
      // showing a tick that scrolls nowhere is worse than showing nothing.
      const found = positions.map((position) => position.id)
      setResolved((prev) => (prev?.join() === found.join() ? prev : found))
    }

    let frame = 0
    const update = () => {
      frame = 0
      if (!positions.length) return

      // At the very bottom nothing new can cross the line, so the last heading
      // would otherwise never light up.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (atBottom) {
        setActive(positions[positions.length - 1].id)
        return
      }

      const line = window.scrollY + ACTIVE_LINE_OFFSET
      let current = positions[0].id
      for (const position of positions) {
        if (position.top <= line) current = position.id
        else break
      }
      setActive(current)
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const remeasure = () => {
      measure()
      onScroll()
    }

    measure()
    update()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    // Images, KaTeX and mermaid all settle after mount and move the headings.
    const observer = new ResizeObserver(remeasure)
    observer.observe(document.body)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
      observer.disconnect()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [items])

  const visible = resolved ? items.filter((item) => resolved.includes(item.url.slice(1))) : items

  // A single-heading contents list tells the reader nothing.
  if (visible.length < 2) return null

  const minDepth = Math.min(...visible.map((item) => item.depth))

  return (
    <nav
      aria-label="Table of contents"
      className="no-scrollbar fixed left-5 top-1/2 z-40 hidden max-h-[70vh] -translate-y-1/2 overflow-y-auto xl:block"
    >
      <ul className="space-y-2 py-2 2xl:space-y-3">
        {visible.map((item) => {
          const id = item.url.slice(1)
          const isActive = active === id
          const indent = Math.min(item.depth - minDepth, 2) * 8

          return (
            <li key={item.url} style={{ paddingLeft: `${indent}px` }}>
              <a
                href={item.url}
                title={item.value}
                aria-current={isActive ? 'location' : undefined}
                className="group flex items-start gap-2"
              >
                {/* Nudged down at 2xl so the tick meets the label's first line
                    once headings wrap onto several. */}
                <span
                  aria-hidden="true"
                  className={`h-px shrink-0 transition-all duration-200 2xl:mt-[7px] ${
                    isActive
                      ? 'w-7 bg-primary-500'
                      : 'w-3.5 bg-ink-faint/45 group-hover:w-5 group-hover:bg-ink-faint'
                  }`}
                />
                {/* Wrapped, never truncated: the whole heading has to be
                    readable for the list to work as a table of contents. */}
                <span
                  className={`hidden w-40 font-mono text-[11px] leading-snug transition-colors 2xl:block ${
                    isActive ? 'text-primary-500' : 'text-ink-faint group-hover:text-ink-muted'
                  }`}
                >
                  {item.value}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
