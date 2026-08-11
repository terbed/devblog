import Link from '@/components/Link'
import PageHeader from '@/components/PageHeader'
import PostList from '@/components/PostList'
import siteMetadata from '@/data/siteMetadata'
import NewsletterForm from '@/components/NewsletterForm'

const MAX_DISPLAY = 5

export default function Home({ posts }) {
  const shown = posts.slice(0, MAX_DISPLAY)

  return (
    <>
      <PageHeader
        title="latest"
        description={siteMetadata.description}
        meta={`${posts.length} post${posts.length === 1 ? '' : 's'}`}
      />

      <PostList posts={shown} />

      {posts.length > MAX_DISPLAY && (
        <div className="border-t border-rule py-6">
          <Link
            href="/blog"
            className="font-mono text-sm text-ink-muted transition-colors hover:text-primary-500"
            aria-label="All posts"
          >
            <span className="text-ink-faint">$</span> ls ~/blog{' '}
            <span className="text-primary-500">&rarr;</span>
          </Link>
        </div>
      )}

      {siteMetadata.newsletter?.provider && (
        <div className="border-t border-rule pt-8">
          <NewsletterForm
            apiUrl="/.netlify/functions/newsletter"
            title="Subscribe to the newsletter:"
          />
        </div>
      )}
    </>
  )
}
