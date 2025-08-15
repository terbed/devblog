import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import Mermaid from './Mermaid'
import CitationGenerator from './CitationGenerator'
import MarginNote from './MarginNote'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  Mermaid,
  CitationGenerator,
  // New: Allow using <MarginNote> in MDX for LaTeX/MDX-enabled margin notes
  MarginNote,
}
