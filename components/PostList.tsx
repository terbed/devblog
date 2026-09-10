import Link from '@/components/Link'
import Tag from '@/components/Tag'
import type { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

/**
 * ISO date, taken straight off the front matter string so it can't drift by a
 * day through the reader's timezone. Fixed-width dates also let the whole
 * index align into a column, which is what makes it scan like `ls -lt`.
 */
export function isoDate(date: string) {
  const iso = new Date(date).toISOString()
  return iso.slice(0, 10)
}

function readingMinutes(post: CoreContent<Blog>) {
  const rt = (post as { readingTime?: { minutes?: number } }).readingTime
  return rt?.minutes ? Math.max(1, Math.round(rt.minutes)) : null
}

interface ItemProps {
  post: CoreContent<Blog>
  href: string
  /** Hide the summary on dense listings. */
  showSummary?: boolean
}

export function PostListItem({ post, href, showSummary = true }: ItemProps) {
  const { date, title, summary, tags } = post
  const minutes = readingMinutes(post)

  return (
    <li className="group relative">
      <article className="grid gap-y-2 py-6 sm:grid-cols-[7rem_1fr] sm:gap-x-6">
        {/* Left rail: the metadata column. */}
        <div className="flex items-baseline gap-2 sm:flex-col sm:gap-1">
          <time
            dateTime={date}
            className="font-mono text-xs tabular-nums text-ink-faint transition-colors group-hover:text-primary-500"
          >
            {isoDate(date)}
          </time>
          {minutes && (
            <span className="font-mono text-xs text-ink-faint">
              <span className="sm:hidden">· </span>
              {minutes} min
            </span>
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <h2 className="font-serif text-lg font-semibold leading-snug tracking-tight">
            <Link
              href={href}
              className="text-ink decoration-primary-500/40 underline-offset-4 transition-colors hover:text-primary-500 hover:underline"
            >
              {title}
            </Link>
          </h2>

          {showSummary && summary && (
            <p className="font-serif text-[0.9375rem] leading-relaxed text-ink-muted">{summary}</p>
          )}

          {tags?.length > 0 && (
            <div className="relative z-10 flex flex-wrap gap-x-3 gap-y-1 pt-0.5">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </li>
  )
}

interface ListProps {
  posts: CoreContent<Blog>[]
  /** Build the link for a post; defaults to its computed path. */
  hrefFor?: (post: CoreContent<Blog>) => string
  showSummary?: boolean
  emptyMessage?: string
}

export default function PostList({
  posts,
  hrefFor = (post) => `/${post.path}`,
  showSummary = true,
  emptyMessage = 'no posts found.',
}: ListProps) {
  if (!posts.length) {
    return <p className="py-8 font-mono text-sm text-ink-faint">{emptyMessage}</p>
  }

  return (
    <ul className="divide-y divide-rule border-t border-rule">
      {posts.map((post) => (
        <PostListItem key={post.path} post={post} href={hrefFor(post)} showSummary={showSummary} />
      ))}
    </ul>
  )
}
