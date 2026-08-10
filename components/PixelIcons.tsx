/**
 * Icon set drawn on a 9×9 pixel grid.
 *
 * Every glyph is plain `<rect>`s with `shapeRendering="crispEdges"` — no paths,
 * no curves, nothing antialiased. Diagonals step one pixel at a time so they
 * stay on the grid instead of being smoothed into a line.
 *
 * They render at 18px, an exact 2× of the grid, so one source pixel is always
 * two whole screen pixels. Changing the size to a non-multiple of 9 puts edges
 * on half-pixels and the crispness is lost, which is the whole point.
 */
const PIXEL = 'h-[18px] w-[18px]'

type GlyphProps = { className?: string }

const Glyph = ({ children, className }: GlyphProps & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 9 9"
    shapeRendering="crispEdges"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    className={className ?? PIXEL}
  >
    {children}
  </svg>
)

export const ArrowUp = (props: GlyphProps) => (
  <Glyph {...props}>
    {/* Head widens by one pixel per row so the diagonal lands on the grid. */}
    <rect x="4" y="0" width="1" height="1" />
    <rect x="3" y="1" width="3" height="1" />
    <rect x="2" y="2" width="5" height="1" />
    <rect x="1" y="3" width="7" height="1" />
    <rect x="0" y="4" width="9" height="1" />
    <rect x="3" y="5" width="3" height="4" />
  </Glyph>
)

export const SpeechBubble = (props: GlyphProps) => (
  <Glyph {...props}>
    <rect x="1" y="0" width="7" height="1" />
    <rect x="0" y="1" width="1" height="4" />
    <rect x="8" y="1" width="1" height="4" />
    <rect x="1" y="5" width="7" height="1" />
    {/* Ellipsis, centred in the box */}
    <rect x="2" y="2" width="1" height="1" />
    <rect x="4" y="2" width="1" height="1" />
    <rect x="6" y="2" width="1" height="1" />
    {/* Tail */}
    <rect x="2" y="6" width="2" height="1" />
    <rect x="2" y="7" width="1" height="1" />
  </Glyph>
)

export const Search = (props: GlyphProps) => (
  <Glyph {...props}>
    {/* Lens: a 5×5 ring in the top-left */}
    <rect x="1" y="0" width="3" height="1" />
    <rect x="0" y="1" width="1" height="3" />
    <rect x="4" y="1" width="1" height="3" />
    <rect x="1" y="4" width="3" height="1" />
    {/* Handle: a stepped diagonal, two pixels thick */}
    <rect x="5" y="5" width="2" height="1" />
    <rect x="6" y="6" width="2" height="1" />
    <rect x="7" y="7" width="2" height="1" />
  </Glyph>
)

export const Sun = (props: GlyphProps) => (
  <Glyph {...props}>
    {/* Disc */}
    <rect x="3" y="3" width="3" height="3" />
    {/* Cardinal rays */}
    <rect x="4" y="0" width="1" height="2" />
    <rect x="4" y="7" width="1" height="2" />
    <rect x="0" y="4" width="2" height="1" />
    <rect x="7" y="4" width="2" height="1" />
    {/* Corner rays */}
    <rect x="1" y="1" width="1" height="1" />
    <rect x="7" y="1" width="1" height="1" />
    <rect x="1" y="7" width="1" height="1" />
    <rect x="7" y="7" width="1" height="1" />
  </Glyph>
)

export const Moon = (props: GlyphProps) => (
  <Glyph {...props}>
    {/* Crescent: a rasterised disc with a second disc bitten out of its right,
        so the outer edge stays convex while the inner one curves back in. A
        constant-width arc reads as a bracket rather than a moon. */}
    <rect x="3" y="0" width="3" height="1" />
    <rect x="1" y="1" width="4" height="1" />
    <rect x="1" y="2" width="3" height="1" />
    <rect x="0" y="3" width="4" height="3" />
    <rect x="1" y="6" width="3" height="1" />
    <rect x="1" y="7" width="4" height="1" />
    <rect x="3" y="8" width="3" height="1" />
  </Glyph>
)

export const Monitor = (props: GlyphProps) => (
  <Glyph {...props}>
    {/* Screen */}
    <rect x="0" y="0" width="9" height="1" />
    <rect x="0" y="1" width="1" height="4" />
    <rect x="8" y="1" width="1" height="4" />
    <rect x="0" y="5" width="9" height="1" />
    {/* Neck and base */}
    <rect x="4" y="6" width="1" height="1" />
    <rect x="2" y="7" width="5" height="1" />
  </Glyph>
)
