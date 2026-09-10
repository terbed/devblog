import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import localFont from 'next/font/local'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'

/**
 * Two faces, two jobs.
 *
 * IBM Plex Serif is the reading face — body prose and every title with it, so
 * a heading and the paragraph under it speak in one voice.
 *
 * Adwaita Mono is what is left: navigation, post metadata, tags, footnotes,
 * tables, code. Machine-readable things, not sentences.
 *
 * The split exists because a monospace distributes its whitespace evenly —
 * every `i` and `l` is padded out to the same advance as an `m` — which is
 * fine for a column of code and exhausting for a column of prose: the gaps
 * inside the words are what made long-form reading here feel spread out, and
 * no amount of tightening leading or margins reaches them.
 *
 * The serif ships at 400 and 600, not 400 and 700. IBM Plex Serif's Bold is a
 * heavy, high-contrast face that turns every heading into a slab; SemiBold
 * carries the same hierarchy without the weight blooming. A request for 700
 * falls to 600 under CSS font matching, so `font-bold` stays safe to write.
 *
 * The Nerd Font icon glyphs live in a separate family declared in
 * `css/tailwind.css`, which the browser only fetches if a page renders one.
 *
 * See fonts/README.md for provenance, subsetting and licences.
 */
const mono = localFont({
  src: [
    { path: '../fonts/adwaita-mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/adwaita-mono-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/adwaita-mono-700.woff2', weight: '700', style: 'normal' },
    { path: '../fonts/adwaita-mono-700-italic.woff2', weight: '700', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
  adjustFontFallback: false,
})

const serif = localFont({
  src: [
    { path: '../fonts/plex-serif-400.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/plex-serif-400-italic.woff2', weight: '400', style: 'italic' },
    { path: '../fonts/plex-serif-600.woff2', weight: '600', style: 'normal' },
    { path: '../fonts/plex-serif-600-italic.woff2', weight: '600', style: 'italic' },
  ],
  display: 'swap',
  variable: '--font-serif',
  fallback: ['IBM Plex Serif', 'Charter', 'Bitstream Charter', 'Cambria', 'Georgia', 'serif'],
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className={`${mono.variable} ${serif.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <link
        rel="apple-touch-icon"
        sizes="76x76"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <link
        rel="mask-icon"
        href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
        color="#5bbad5"
      />
      <meta name="msapplication-TileColor" content="#0b0d0f" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0b0d0f" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-paper pl-[calc(100vw-100%)] text-ink">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
              <Header />
              <main className="mb-auto">{children}</main>
            </SearchProvider>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
