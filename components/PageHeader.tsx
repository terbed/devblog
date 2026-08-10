import { ReactNode } from 'react'

interface Props {
  title: string
  description?: ReactNode
  /** Right-hand slot for a count, filter state, or any short status string. */
  meta?: ReactNode
}

/**
 * Page-level heading. Uses the same `#` marker language as the prose headings
 * (`##` for h2, `###` for h3), so the hierarchy is legible as markdown source.
 */
export default function PageHeader({ title, description, meta }: Props) {
  return (
    <div className="pb-8 pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="font-mono text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          <span className="select-none text-primary-500/45">#</span>{' '}
          <span className="lowercase">{title}</span>
        </h1>
        {meta && <span className="font-mono text-xs text-ink-faint">{meta}</span>}
      </div>
      {description && (
        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-ink-muted">
          {description}
        </p>
      )}
    </div>
  )
}
