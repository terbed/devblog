'use client'

import { useRef, useState } from 'react'

interface Props {
  title?: string
  apiUrl?: string
}

type State = 'idle' | 'submitting' | 'done' | 'error'

/**
 * Replaces pliny's NewsletterForm, which discarded the API's message and
 * reported every success as "subscribed" — including contacts that are only
 * PENDING because the list uses double opt-in.
 */
export default function NewsletterForm({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
}: Props) {
  const inputEl = useRef<HTMLInputElement>(null)
  const [state, setState] = useState<State>('idle')
  const [message, setMessage] = useState('')

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('submitting')

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inputEl.current?.value }),
      })

      // A non-JSON body means the endpoint is missing or misrouted; treating
      // that as anything but a failure is what hid the original bug.
      const data = await res.json().catch(() => null)

      if (!res.ok || !data || data.error) {
        setState('error')
        setMessage(data?.message ?? 'Something went wrong. Please try again later.')
        return
      }

      if (inputEl.current) inputEl.current.value = ''
      setState('done')
      setMessage(data.message)
    } catch {
      setState('error')
      setMessage('Could not reach the server. Please try again later.')
    }
  }

  const done = state === 'done'

  return (
    <div>
      <div className="pb-2 font-mono text-sm text-ink-muted">{title}</div>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
        onSubmit={subscribe}
      >
        <label htmlFor="email-input" className="sm:w-72">
          <span className="sr-only">Email address</span>
          <input
            autoComplete="email"
            className="w-full rounded-md border border-rule bg-transparent px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint focus:border-rule focus:outline-none focus:ring-2 focus:ring-primary-500/60 disabled:opacity-70"
            id="email-input"
            name="email"
            placeholder={done ? 'Thank you!' : 'Enter your email'}
            ref={inputEl}
            required
            type="email"
            disabled={done || state === 'submitting'}
          />
        </label>
        <button
          className={`shrink-0 rounded-md bg-primary-500 px-4 py-2 font-mono text-sm font-medium text-paper transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/60 focus:ring-offset-2 focus:ring-offset-paper ${
            done || state === 'submitting' ? 'cursor-default opacity-70' : 'hover:bg-primary-600'
          }`}
          type="submit"
          disabled={done || state === 'submitting'}
        >
          {done ? 'Done' : state === 'submitting' ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      {message && (
        <div
          className={`max-w-sm pt-2 font-mono text-sm ${
            state === 'error' ? 'text-red-500 dark:text-red-400' : 'text-ink-muted'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
