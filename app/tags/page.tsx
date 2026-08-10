import Link from '@/components/Link'
import PageHeader from '@/components/PageHeader'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const max = Math.max(1, ...Object.values(tagCounts))

  return (
    <>
      <PageHeader
        title="tags"
        description="Everything I write about, by frequency."
        meta={`${sortedTags.length} tags`}
      />

      {sortedTags.length === 0 ? (
        <p className="font-mono text-sm text-ink-faint">no tags found.</p>
      ) : (
        // A histogram, not a cloud: the bar encodes the count so the list
        // stays alphabetically scannable and quantitatively honest.
        <ul className="divide-y divide-rule border-t border-rule font-mono text-sm">
          {sortedTags.map((t) => (
            <li key={t}>
              <Link
                href={`/tags/${slug(t)}`}
                aria-label={`View posts tagged ${t}`}
                className="group grid grid-cols-[1fr_6rem_2.5rem] items-center gap-4 py-3 transition-colors hover:text-primary-500"
              >
                <span className="truncate text-ink-muted transition-colors group-hover:text-primary-500">
                  <span className="text-ink-faint">#</span>
                  {t}
                </span>
                <span aria-hidden="true" className="h-1.5 bg-rule">
                  <span
                    className="block h-full bg-primary-500/45 transition-colors group-hover:bg-primary-500"
                    style={{ width: `${(tagCounts[t] / max) * 100}%` }}
                  />
                </span>
                <span className="text-right text-xs tabular-nums text-ink-faint">
                  {tagCounts[t]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
