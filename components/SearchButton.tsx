import { AlgoliaButton } from 'pliny/search/AlgoliaButton'
import { KBarButton } from 'pliny/search/KBarButton'
import { Search } from '@/components/PixelIcons'
import siteMetadata from '@/data/siteMetadata'

const SearchButton = () => {
  if (
    siteMetadata.search &&
    (siteMetadata.search.provider === 'algolia' || siteMetadata.search.provider === 'kbar')
  ) {
    const SearchButtonWrapper =
      siteMetadata.search.provider === 'algolia' ? AlgoliaButton : KBarButton

    return (
      <SearchButtonWrapper aria-label="Search">
        <span className="flex items-center gap-1.5 text-ink-muted transition-colors hover:text-primary-500">
          <Search />
          {/* The shortcut is the real affordance; show it where there's room. */}
          <kbd className="hidden border border-rule px-1.5 py-0.5 font-mono text-xs leading-none text-ink-faint md:inline-block">
            ⌘K
          </kbd>
        </span>
      </SearchButtonWrapper>
    )
  }
}

export default SearchButton
