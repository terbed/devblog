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
      <div className="pb-1 font-mono text-sm text-ink-muted">{title}</div>
      <form className="flex flex-col sm:flex-row" onSubmit={subscribe}>
        <div>
          <label htmlFor="email-input">
            <span className="sr-only">Email address</span>
            <input
              autoComplete="email"
              className="w-72 rounded-md border border-rule bg-transparent px-4 py-2 text-ink placeholder:text-ink-faint focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600"
              id="email-input"
              name="email"
              placeholder={done ? 'Thank you!' : 'Enter your email'}
              ref={inputEl}
              required
              type="email"
              disabled={done || state === 'submitting'}
            />
          </label>
        </div>
        <div className="mt-2 flex w-full rounded-md shadow-sm sm:ml-3 sm:mt-0">
          <button
            className={`w-full rounded-md bg-primary-500 px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 dark:ring-offset-black ${
              done || state === 'submitting'
                ? 'cursor-default opacity-70'
                : 'hover:bg-primary-700 dark:hover:bg-primary-400'
            }`}
            type="submit"
            disabled={done || state === 'submitting'}
          >
            {done ? 'Done' : state === 'submitting' ? 'Signing up…' : 'Sign up'}
          </button>
        </div>
      </form>
      {message && (
        <div
          className={`w-72 pt-2 text-sm sm:w-96 ${
            state === 'error' ? 'text-red-500 dark:text-red-400' : 'text-ink-muted'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  )
}
