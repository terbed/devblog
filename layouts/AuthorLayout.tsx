import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import Image from '@/components/Image'
import PageHeader from '@/components/PageHeader'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, linkedin, github } = content

  const links: { label: string; href?: string }[] = [
    { label: 'mail', href: email ? `mailto:${email}` : undefined },
    { label: 'github', href: github },
    { label: 'linkedin', href: linkedin },
    { label: 'x', href: twitter },
  ]

  return (
    <>
      <PageHeader title="about" />

      <div className="flex flex-col gap-10 border-t border-rule pt-10 md:flex-row md:gap-12">
        <aside className="shrink-0 md:w-56">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            {avatar && (
              <Image
                src={avatar}
                alt=""
                width={192}
                height={192}
                // Square, not a circle — it reads as an ID photo, not an avatar bubble.
                className="h-24 w-24 border border-rule object-cover md:h-40 md:w-40"
              />
            )}
            <div className="space-y-1 font-mono text-xs">
              <div className="text-sm font-medium text-ink">{name}</div>
              {occupation && <div className="text-ink-muted">{occupation}</div>}
              {company && <div className="text-ink-faint">{company}</div>}
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-x-3 gap-y-2" aria-label="Contact links">
            {links
              .filter((l) => l.href)
              .map(({ label, href }) => (
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
        </aside>

        <div className="prose min-w-0 flex-1 pb-8 dark:prose-invert">{children}</div>
      </div>
    </>
  )
}
