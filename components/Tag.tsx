import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
  count?: number
  active?: boolean
}

const Tag = ({ text, count, active = false }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className={`font-mono text-xs lowercase transition-colors ${
        active ? 'text-primary-500' : 'text-ink-muted hover:text-primary-500'
      }`}
    >
      <span className={active ? 'text-primary-500' : 'text-ink-faint'}>#</span>
      {text.split(' ').join('-')}
      {count !== undefined && <span className="text-ink-faint">{`(${count})`}</span>}
    </Link>
  )
}

export default Tag
