import { sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import { generateRss, rssHeaders } from '@/lib/rss'

export const dynamic = 'force-static'

export function GET() {
  const posts = sortPosts(allBlogs.filter((post) => post.draft !== true))
  return new Response(generateRss(posts), { headers: rssHeaders })
}
