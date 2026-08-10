import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="py-24 font-mono">
      <p className="text-sm text-ink-faint">
        <span className="text-primary-500">$</span> cat $REQUESTED_PATH
      </p>
      <p className="mt-3 text-sm text-ink-muted">
        cat: no such file or directory <span className="text-ink">(404)</span>
      </p>
      <p className="mt-8 max-w-md font-serif text-base leading-relaxed text-ink-muted">
        That page isn&apos;t here. Plenty of other things are.
      </p>
      <div className="mt-8 flex flex-wrap gap-4 text-sm">
        <Link href="/" className="bracket-link">
          home
        </Link>
        <Link href="/blog" className="bracket-link">
          blog
        </Link>
        <Link href="/tags" className="bracket-link">
          tags
        </Link>
      </div>
    </div>
  )
}
