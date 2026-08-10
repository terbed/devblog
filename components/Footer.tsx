import Link from './Link'
import siteMetadata from '@/data/siteMetadata'

// Bracketed text links instead of icon soup — fewer shapes, same affordance.
const socials: { label: string; href?: string }[] = [
  { label: 'mail', href: siteMetadata.email ? `mailto:${siteMetadata.email}` : undefined },
  { label: 'github', href: siteMetadata.github },
  { label: 'x', href: siteMetadata.x },
  { label: 'linkedin', href: siteMetadata.linkedin },
  { label: 'twitter', href: siteMetadata.twitter },
  { label: 'youtube', href: siteMetadata.youtube },
  { label: 'instagram', href: siteMetadata.instagram },
  { label: 'threads', href: siteMetadata.threads },
  { label: 'facebook', href: siteMetadata.facebook },
  { label: 'mastodon', href: siteMetadata.mastodon },
  { label: 'ko-fi', href: siteMetadata.kofi },
]

export default function Footer() {
  const active = socials.filter((s) => s.href)

  return (
    <footer className="mt-24">
      <div className="h-px w-full bg-rule" />
      <div className="flex flex-col gap-4 py-8 font-mono text-xs sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-muted">
            <span className="text-ink">{siteMetadata.author}</span>
            <span className="text-ink-faint">·</span>
            <span>© {new Date().getFullYear()}</span>
            <span className="text-ink-faint">·</span>
            <Link href="/" className="hover:text-primary-500">
              {siteMetadata.title}
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-faint">
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer license"
              className="hover:text-primary-500"
            >
              cc by 4.0
            </a>
            <span>·</span>
            <Link href="/feed.xml" className="hover:text-primary-500">
              rss
            </Link>
            <span>·</span>
            <span>just keep going patiently 🚀</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-3 gap-y-2 sm:justify-end" aria-label="Social links">
          {active.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="bracket-link text-xs"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
