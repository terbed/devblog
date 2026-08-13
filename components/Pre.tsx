'use client'

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'

export default function Pre({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const preRef = useRef<HTMLPreElement>(null)
  const resetTimer = useRef<ReturnType<typeof setTimeout>>()
  const [copied, setCopied] = useState(false)

  useEffect(() => () => clearTimeout(resetTimer.current), [])

  const copyCode = async () => {
    const code = preRef.current?.textContent
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code-block relative">
      <button
        type="button"
        className="code-copy-button"
        data-copied={copied || undefined}
        onClick={copyCode}
        aria-label={copied ? 'Code copied' : 'Copy code'}
      >
        <span aria-hidden="true">{copied ? '✓' : '$'}</span>
        {copied ? 'copied' : 'copy'}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}
