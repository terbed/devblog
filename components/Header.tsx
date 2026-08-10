'use client'

import { usePathname } from 'next/navigation'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const host = siteMetadata.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')

// The author's initials, ASCII-folded: `dt@terbed.dev` matches how the site
// already refers to itself, and a login name with an accent in it reads wrong.
const user = siteMetadata.author
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .split(/\s+/)
  .map((part) => part[0])
  .join('')
  .toLowerCase()

const Header = () => {
  const pathname = usePathname()

  // The shell prompt doubles as a breadcrumb: it always shows where you are.
  const cwd = pathname === '/' ? '~' : `~${pathname.replace(/\/$/, '')}`

  let headerClass = 'w-full bg-paper'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <div className="flex items-center justify-between gap-4 py-6">
        <Link
          href="/"
          aria-label={siteMetadata.headerTitle}
          className="flex min-w-0 items-center gap-2.5 font-mono text-sm"
        >
          <Logo className="h-5 w-auto shrink-0" />
          <span className="min-w-0 truncate">
            <span className="text-primary-500">{`${user}@${host}`}</span>
            <span className="text-ink-faint">:</span>
            <span className="text-ink-muted">{cwd}</span>
            <span className="text-ink-faint">$</span>
          </span>
          <span className="caret shrink-0" aria-hidden="true" />
        </Link>

        <div className="flex shrink-0 items-center gap-4 sm:gap-5">
          <nav className="no-scrollbar hidden items-center gap-5 overflow-x-auto sm:flex">
            {headerNavLinks
              .filter((link) => link.href !== '/')
              .map((link) => {
                const active = pathname === link.href || pathname.startsWith(`${link.href}/`)
                return (
                  <Link
                    key={link.title}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={`font-mono text-sm lowercase transition-colors ${
                      active
                        ? 'text-primary-500'
                        : 'text-ink-muted hover:text-ink dark:hover:text-ink'
                    }`}
                  >
                    <span className={active ? 'text-primary-500' : 'text-ink-faint'}>/</span>
                    {link.title}
                  </Link>
                )
              })}
          </nav>
          <div className="flex items-center text-ink-muted">
            <SearchButton />
            <ThemeSwitch />
            <MobileNav />
          </div>
        </div>
      </div>
      <div className="h-px w-full bg-rule" />
    </header>
  )
}

export default Header
