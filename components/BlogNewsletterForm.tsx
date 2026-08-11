import NewsletterForm from './NewsletterForm'

interface Props {
  title?: string
  apiUrl?: string
}

/** In-post variant of {@link NewsletterForm}, usable as <BlogNewsletterForm /> in MDX. */
export default function BlogNewsletterForm({ title, apiUrl }: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded-md border border-rule p-6 sm:px-14 sm:py-8">
        <NewsletterForm title={title} apiUrl={apiUrl} />
      </div>
    </div>
  )
}
