import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import { isoDate } from '@/components/PostList'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import FloatingToc from '@/components/FloatingToc'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title } = content
  const basePath = path.split('/')[0]
  const readingTime = (content as { readingTime?: { minutes?: number } }).readingTime
  const minutes = readingTime?.minutes ? Math.max(1, Math.round(readingTime.minutes)) : null

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <FloatingToc toc={content.toc} />
      <article>
        <header className="border-b border-rule pb-8 pt-10">
          <PageTitle>{title}</PageTitle>
          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 font-mono text-xs text-ink-faint">
            <time dateTime={date} className="tabular-nums">
              {isoDate(date)}
            </time>
            {minutes && (
              <>
                <span aria-hidden="true">·</span>
                <span>{minutes} min read</span>
              </>
            )}
          </div>
        </header>

        <div className="prose pb-10 pt-10 dark:prose-invert">{children}</div>

        <footer className="border-t border-rule pt-8">
          {(next?.path || prev?.path) && (
            <nav className="grid gap-6 pb-8 sm:grid-cols-2">
              {prev?.path ? (
                <div className="min-w-0">
                  <div className="mb-1.5 font-mono text-xs text-ink-faint">previous</div>
                  <Link
                    href={`/${prev.path}`}
                    className="font-mono text-sm leading-snug text-ink transition-colors hover:text-primary-500"
                    aria-label={`Previous post: ${prev.title}`}
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
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </nav>
          )}

          <div className="flex flex-wrap items-center gap-x-2 pb-8 font-mono text-xs text-ink-faint">
            <span aria-hidden="true">$</span>
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
      </article>
    </SectionContainer>
  )
}
