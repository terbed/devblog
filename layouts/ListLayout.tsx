'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import PageHeader from '@/components/PageHeader'
import PostList from '@/components/PostList'

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

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  // If initialDisplayPosts exist, display it if no searchValue is specified
  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <PageHeader title={title} meta={`${posts.length} posts`} />

      {/* Search styled as a shell prompt rather than a form field. */}
      <label className="mb-2 flex items-center gap-2 border border-rule bg-paper-soft px-3 py-2 font-mono text-sm focus-within:border-primary-500/60">
        <span className="sr-only">Search articles</span>
        <span aria-hidden="true" className="text-primary-500">
          /
        </span>
        <input
          aria-label="Search articles"
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="filter posts"
          className="w-full border-0 bg-transparent p-0 font-mono text-sm text-ink placeholder:text-ink-faint focus:ring-0"
        />
      </label>

      <PostList posts={displayPosts} emptyMessage="no matches." />

      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
