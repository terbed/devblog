import Image from './Image'
import Link from './Link'

/**
 * Project card. Flat hairline frame instead of a shadowed rounded box —
 * the border does the containing, nothing floats.
 */
const Card = ({ title, description, imgSrc, href, index }) => {
  const body = (
    <>
      {imgSrc && (
        <div className="relative overflow-hidden border-b border-rule bg-paper-soft">
          <Image
            alt=""
            src={imgSrc}
            className="h-44 w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] sm:h-48"
            width={544}
            height={306}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h2 className="font-serif text-base font-semibold leading-snug text-ink transition-colors group-hover:text-primary-500">
          {title}
        </h2>
        <p className="flex-1 font-serif text-sm leading-relaxed text-ink-muted">{description}</p>
        {href && (
          <span className="font-mono text-xs text-primary-500">
            open <span aria-hidden="true">&rarr;</span>
          </span>
        )}
      </div>
    </>
  )

  const frame =
    'group flex h-full flex-col border border-rule bg-paper transition-colors duration-200'

  return (
    <article className="relative">
      {/* Index number in the gutter — a small nod to a numbered listing. */}
      {typeof index === 'number' && (
        <span
          aria-hidden="true"
          className="absolute -top-3 left-4 z-10 bg-paper px-1.5 font-mono text-xs tabular-nums text-ink-faint"
        >
          {String(index + 1).padStart(2, '0')}
        </span>
      )}
      {href ? (
        <Link
          href={href}
          aria-label={`Link to ${title}`}
          className={`${frame} hover:border-primary-500/50`}
        >
          {body}
        </Link>
      ) : (
        <div className={frame}>{body}</div>
      )}
    </article>
  )
}

export default Card
