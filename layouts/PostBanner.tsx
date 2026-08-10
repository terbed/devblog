import { ReactNode } from 'react'
import Image from '@/components/Image'
import Bleed from 'pliny/ui/Bleed'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostMinimal({ content, next, prev, children }: LayoutProps) {
  const { slug, title, images } = content
  const displayImage =
    images && images.length > 0 ? images[0] : 'https://picsum.photos/seed/picsum/800/400'

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article>
        <div>
          <div className="space-y-1 border-b border-rule pb-8">
            <div className="w-full">
              <Bleed>
                <div className="relative aspect-[2/1] w-full">
                  <Image src={displayImage} alt={title} fill className="object-cover" />
                </div>
              </Bleed>
            </div>
            <div className="relative pt-10">
              <PageTitle>{title}</PageTitle>
            </div>
          </div>
          <div className="prose py-10 dark:prose-invert">{children}</div>
          {siteMetadata.comments && (
            <div className="border-t border-rule pt-8" id="comment">
              <Comments slug={slug} />
            </div>
          )}
          <footer>
            <nav className="grid gap-4 border-t border-rule py-6 sm:grid-cols-2">
              {prev && prev.path ? (
                <div>
                  <div className="rule-label mb-2">prev</div>
                  <Link
                    href={`/${prev.path}`}
                    className="font-mono text-sm text-ink transition-colors hover:text-primary-500"
                    aria-label={`Previous post: ${prev.title}`}
                  >
                    &larr; {prev.title}
                  </Link>
                </div>
              ) : (
                <div />
              )}
              {next && next.path && (
                <div className="sm:text-right">
                  <div className="rule-label mb-2 sm:flex-row-reverse">next</div>
                  <Link
                    href={`/${next.path}`}
                    className="font-mono text-sm text-ink transition-colors hover:text-primary-500"
                    aria-label={`Next post: ${next.title}`}
                  >
                    {next.title} &rarr;
                  </Link>
                </div>
              )}
            </nav>
          </footer>
        </div>
      </article>
    </SectionContainer>
  )
}
