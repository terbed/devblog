import { slug } from 'github-slugger'
import { sortPosts } from 'pliny/utils/contentlayer'
import { allBlogs } from 'contentlayer/generated'
import tagData from 'app/tag-data.json'
import { generateRss, rssHeaders } from '@/lib/rss'

export const dynamic = 'force-static'

export const generateStaticParams = async () =>
  Object.keys(tagData as Record<string, number>).map((tag) => ({ tag: encodeURI(tag) }))

export function GET(request: Request, { params }: { params: { tag: string } }) {
  const tag = decodeURI(params.tag)
  const posts = sortPosts(
    allBlogs.filter(
      (post) => post.draft !== true && post.tags && post.tags.map((t) => slug(t)).includes(tag)
    )
  )
  return new Response(generateRss(posts, `tags/${tag}/feed.xml`), { headers: rssHeaders })
}
