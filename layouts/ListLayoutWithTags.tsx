/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageHeader from '@/components/PageHeader'
import PostList from '@/components/PostList'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname.split('/')[1]
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  const linkClass = 'text-ink-muted transition-colors hover:text-primary-500'
  const mutedClass = 'text-ink-faint/60'

  return (
    <nav className="flex items-center justify-between border-t border-rule py-6 font-mono text-sm">
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className={linkClass}
        >
          &larr; prev
        </Link>
      ) : (
        <span className={mutedClass}>&larr; prev</span>
      )}

      <span className="text-xs tabular-nums text-ink-faint">
        {currentPage} / {totalPages}
      </span>

      {nextPage ? (
        <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className={linkClass}>
          next &rarr;
        </Link>
      ) : (
        <span className={mutedClass}>next &rarr;</span>
      )}
    </nav>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const onAllPosts = pathname.startsWith('/blog')
  const activeTag = pathname.split('/tags/')[1]

  return (
    <>
      <PageHeader title={title} meta={`${posts.length} post${posts.length === 1 ? '' : 's'}`} />

      <div className="flex flex-col gap-10 md:flex-row md:gap-12">
        {/* Filter rail — a plain list, no card, no shadow. */}
        <aside className="shrink-0 md:w-48 md:border-r md:border-rule md:pr-8">
          <h2 className="rule-label mb-4">filter</h2>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs md:flex-col md:gap-y-2.5">
            <li>
              <Link
                href="/blog"
                aria-current={onAllPosts ? 'page' : undefined}
                className={`transition-colors ${
                  onAllPosts ? 'text-primary-500' : 'text-ink-muted hover:text-primary-500'
                }`}
              >
                <span className={onAllPosts ? 'text-primary-500' : 'text-ink-faint'}>*</span> all
              </Link>
            </li>
            {sortedTags.map((t) => {
              const isActive = activeTag === slug(t)
              return (
                <li key={t}>
                  <Link
                    href={`/tags/${slug(t)}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`View posts tagged ${t}`}
                    className={`transition-colors ${
                      isActive ? 'text-primary-500' : 'text-ink-muted hover:text-primary-500'
                    }`}
                  >
                    <span className={isActive ? 'text-primary-500' : 'text-ink-faint'}>#</span>
                    {t}
                    <span className="text-ink-faint/70"> {tagCounts[t]}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>

        <div className="min-w-0 flex-1">
          <PostList posts={displayPosts} />
          {pagination && pagination.totalPages > 1 && (
            <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
          )}
        </div>
      </div>
    </>
  )
}
