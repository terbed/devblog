import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import { isoDate } from '@/components/PostList'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import MarginNoteManager from '@/components/MarginNoteManager'
import FloatingToc from '@/components/FloatingToc'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const readingTime = (content as { readingTime?: { minutes?: number } }).readingTime
  const minutes = readingTime?.minutes ? Math.max(1, Math.round(readingTime.minutes)) : null
  const hasNotes = Boolean((content as { hasMarginNotes?: boolean }).hasMarginNotes)

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <FloatingToc toc={content.toc} />
      {/* Keep the header aligned with the ruled columns below it rather than
          letting it run to the full container width. */}
      <article className={`xl:mx-auto ${hasNotes ? 'xl:max-w-[64rem]' : 'xl:max-w-[48rem]'}`}>
        <header className="border-b border-rule pb-8 pt-10">
          <PageTitle>{title}</PageTitle>

          {/* One dense status line carries every piece of post metadata. */}
          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 font-mono text-xs text-ink-faint">
            <time dateTime={date} className="tabular-nums">
              {isoDate(date)}
            </time>
            {minutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{minutes} min read</span>
              </>
            )}
            {authorDetails.map((author) => (
              <span key={author.name} className="flex items-center gap-2">
                <span aria-hidden="true">·</span>
                {author.avatar && (
                  <Image
                    src={author.avatar}
                    width={20}
                    height={20}
                    alt=""
                    className="h-5 w-5 rounded-full"
                  />
                )}
                {author.twitter ? (
                  <Link href={author.twitter} className="text-ink-muted hover:text-primary-500">
                    {author.name}
                  </Link>
                ) : (
                  <span className="text-ink-muted">{author.name}</span>
                )}
              </span>
            ))}
            {tags?.length > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex flex-wrap gap-x-2.5 gap-y-1">
                  {tags.map((tag) => (
                    <Tag key={tag} text={tag} />
                  ))}
                </span>
              </>
            )}
          </div>
        </header>

        {/* Text column first, note rail second: the reading column starts at the
            container's left edge and notes sit out to the right, Tufte-style.
            The rail is only laid out when the post actually has notes, so posts
            without them are not paying for an empty quarter of the page. */}
        <div
          className={`pb-8 ${
            hasNotes ? 'xl:grid xl:grid-cols-[minmax(0,46rem)_minmax(0,18rem)]' : ''
          }`}
        >
          {/* Hairlines rule the reading measure like a ledger column. They only
              appear at xl, where there is room for them to read as margins. The
              padding is the gutter the hanging `##` markers live in. */}
          <div className="min-w-0 xl:max-w-[48rem] xl:border-x xl:border-rule xl:px-12">
            {/* No `max-w-none` here on purpose: the 76ch measure from the
                typography config is the whole point of the reading column. */}
            <div className="prose pb-10 pt-10 dark:prose-invert">{children}</div>

            {/* One footer block, one rule. Every utility link lives on a single
                muted command line so the end of the post stays quiet. */}
            <footer className="border-t border-rule pt-8">
              {(next?.path || prev?.path) && (
                <nav className="grid gap-6 pb-8 sm:grid-cols-2">
                  {prev?.path ? (
                    <div className="min-w-0">
                      <div className="mb-1.5 font-mono text-xs text-ink-faint">previous</div>
                      <Link
                        href={`/${prev.path}`}
                        className="font-mono text-sm leading-snug text-ink transition-colors hover:text-primary-500"
                      >
                        &larr; {prev.title}
                      </Link>
                    </div>
                  ) : (
                    <div />
                  )}
                  {next?.path && (
                    <div className="min-w-0 sm:text-right">
                      <div className="mb-1.5 font-mono text-xs text-ink-faint">next</div>
                      <Link
                        href={`/${next.path}`}
                        className="font-mono text-sm leading-snug text-ink transition-colors hover:text-primary-500"
                      >
                        {next.title} &rarr;
                      </Link>
                    </div>
                  )}
                </nav>
              )}

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pb-8 font-mono text-xs text-ink-faint">
                <span aria-hidden="true">$</span>
                <Link href={discussUrl(path)} rel="nofollow" className="hover:text-primary-500">
                  discuss
                </Link>
                <span aria-hidden="true">·</span>
                <Link href={editUrl(filePath)} className="hover:text-primary-500">
                  source
                </Link>
                {siteMetadata.kofi && (
                  <>
                    <span aria-hidden="true">·</span>
                    <a
                      href={siteMetadata.kofi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary-500"
                    >
                      coffee
                    </a>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <Link href={`/${basePath}`} className="hover:text-primary-500">
                  cd ..
                </Link>
              </div>
            </footer>

            {siteMetadata.comments && (
              <div className="border-t border-rule pt-8" id="comment">
                <Comments slug={slug} />
              </div>
            )}
          </div>

          {/* Note rail. Renders nothing below xl, where notes fall inline.
              Deliberately unruled — the text column's own lines are enough. */}
          {hasNotes && (
            <aside className="xl:pl-4 xl:pr-4 xl:pt-10">
              <div id="notes-container" className="relative">
                <MarginNoteManager />
              </div>
            </aside>
          )}
        </div>
      </article>
    </SectionContainer>
  )
}
