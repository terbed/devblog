/**
 * Page planning for the rasterised résumé export.
 *
 * Deliberately free of DOM and canvas types: the caller measures elements and
 * hands the numbers over, so all the fiddly logic can be reasoned about — and
 * tested — on its own.
 */

export interface PagePlan {
  top: number
  bottom: number
}

/**
 * A measured element, in any unit, relative to the top of the document.
 *
 * `block` — self-contained; a page may break either side of it, never through.
 * `heading` — may only *start* a page, and must keep the block that follows it.
 */
export interface MeasuredItem {
  kind: 'block' | 'heading'
  top: number
  bottom: number
}

/**
 * Safe cut positions, as fractions (0–1) of `totalHeight`.
 *
 * Fractions rather than absolute pixels on purpose: they survive any difference
 * in scale or size between the measured layout and the raster it is derived
 * from, so the caller can simply multiply by the canvas height.
 *
 * `items` must be in document order.
 */
export function breakFractions(items: MeasuredItem[], totalHeight: number): number[] {
  if (!(totalHeight > 0)) return []

  const points = new Set<number>([0])
  const add = (offset: number) => {
    const fraction = offset / totalHeight
    if (fraction > 0 && fraction < 1) points.add(fraction)
  }

  for (const item of items) {
    add(item.top)
    if (item.kind === 'block') add(item.bottom)
  }

  // Orphan control: a heading must travel with the first block after it, so no
  // break may land between the heading's top and that block's bottom. This also
  // removes the block's own top edge, which is exactly the cut that would have
  // stranded the heading at the foot of the previous page.
  const forbidden: [number, number][] = []
  items.forEach((item, i) => {
    if (item.kind !== 'heading') return
    const next = items.slice(i + 1).find((el) => el.kind === 'block')
    if (next) forbidden.push([item.top / totalHeight, next.bottom / totalHeight])
  })

  return [...points]
    .filter((p) => !forbidden.some(([from, to]) => p > from && p < to))
    .sort((a, b) => a - b)
}

/** Deepest breakpoint strictly after `after` and at or before `limit`. */
function deepestBreak(breakpoints: number[], after: number, limit: number) {
  let found: number | undefined
  for (const p of breakpoints) {
    if (p > limit) break
    if (p > after) found = p
  }
  return found
}

/** Shallowest breakpoint strictly after `after`. */
function nextBreak(breakpoints: number[], after: number) {
  for (const p of breakpoints) if (p > after) return p
  return undefined
}

/**
 * Split a capture of `totalHeight` into slices of at most `pageHeight`.
 *
 * Each page ends at the deepest breakpoint that still fits, so a cut never
 * lands inside a block. `breakpoints` must be sorted ascending.
 *
 * The only thing that forces a cut through content is a block taller than a
 * sheet, which cannot be placed whole on any page. `minFillRatio` guards
 * against burning a near-empty page on that case: an under-filled page is only
 * accepted when the block that follows will actually fit on one of its own.
 */
export function planPages(
  totalHeight: number,
  pageHeight: number,
  breakpoints: number[],
  minFillRatio = 0.2
): PagePlan[] {
  if (!(totalHeight > 0) || !(pageHeight > 0)) return []

  const pages: PagePlan[] = []
  let top = 0

  // Sub-pixel remainders should not earn their own page.
  while (top < totalHeight - 1) {
    const hardBottom = Math.min(top + pageHeight, totalHeight)
    let bottom = hardBottom

    if (hardBottom < totalHeight) {
      const candidate = deepestBreak(breakpoints, top, hardBottom)

      if (candidate !== undefined) {
        if (candidate - top >= pageHeight * minFillRatio) {
          bottom = candidate
        } else {
          // Breaking here leaves the page nearly empty. Worth it only if the
          // straddling block can sit whole on the next page; if it is taller
          // than a sheet it gets split either way, so fill this one instead.
          const following = nextBreak(breakpoints, candidate)
          if (following !== undefined && following - candidate <= pageHeight) bottom = candidate
        }
      }
    }

    // Never stall or walk backwards, whatever the breakpoints say.
    if (!(bottom > top)) bottom = hardBottom

    pages.push({ top, bottom })
    top = bottom
  }

  return pages
}
