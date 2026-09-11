import { escape } from 'pliny/utils/htmlEscaper'
import type { Blog } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'

const rssItem = (post: Blog) => `
    <item>
      <guid>${siteMetadata.siteUrl}/blog/${post.slug}</guid>
      <title>${escape(post.title)}</title>
      <link>${siteMetadata.siteUrl}/blog/${post.slug}</link>
      ${post.summary ? `<description>${escape(post.summary)}</description>` : ''}
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${siteMetadata.email} (${siteMetadata.author})</author>
      ${(post.tags ?? []).map((t) => `<category>${escape(t)}</category>`).join('')}
    </item>`

/**
 * Renders an RSS 2.0 document. `page` is the feed's own path, used for the
 * atom:link self-reference, e.g. 'feed.xml' or 'tags/ml/feed.xml'.
 */
export function generateRss(posts: Blog[], page = 'feed.xml') {
  const lastBuildDate = posts.length
    ? new Date(posts[0].date).toUTCString()
    : new Date().toUTCString()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(siteMetadata.title)}</title>
    <link>${siteMetadata.siteUrl}/blog</link>
    <description>${escape(siteMetadata.description)}</description>
    <language>${siteMetadata.language}</language>
    <managingEditor>${siteMetadata.email} (${siteMetadata.author})</managingEditor>
    <webMaster>${siteMetadata.email} (${siteMetadata.author})</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${siteMetadata.siteUrl}/${page}" rel="self" type="application/rss+xml"/>${posts
      .map(rssItem)
      .join('')}
  </channel>
</rss>
`
}

export const rssHeaders = {
  'Content-Type': 'application/rss+xml; charset=utf-8',
}
