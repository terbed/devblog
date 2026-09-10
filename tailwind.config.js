// @ts-check

/**
 * "Terminal paper" theme.
 *
 * Two type layers do all the work: IBM Plex Serif for everything you read —
 * body prose and titles alike — and Adwaita Mono for the machine-readable
 * remainder: nav, metadata, tags, tables, code. Colour is a single accent
 * over a warm paper /
 * true-black terminal neutral ramp. The accent steps are CSS variables that
 * flip in dark mode, so `text-primary-500` stays legible on both grounds
 * without a `dark:` variant.
 */

const MONO = [
  'var(--font-mono)',
  'AdwaitaMonoNerdIcons',
  'ui-monospace',
  'SFMono-Regular',
  'Menlo',
  'Consolas',
  'monospace',
]

const SERIF = [
  'var(--font-serif)',
  'IBM Plex Serif',
  'Charter',
  'Bitstream Charter',
  'Cambria',
  'Georgia',
  'serif',
]

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // One size ladder for the whole site, so nav, metadata, captions, cards
      // and prose all sit on the same steps. Leading opens up as the text gets
      // smaller and denser, and tightens as it gets larger — a 13px label and a
      // 36px title should not share a multiplier. Adwaita Mono's x-height is
      // 0.52em, tall enough that these read larger than the same numbers in a
      // serif; nothing here needed inflating to stay legible, but the old
      // 10-12px chrome did, and now bottoms out at 13px.
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.55' }],
        base: ['1rem', { lineHeight: '1.65' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.25rem', { lineHeight: '1.45' }],
        '2xl': ['1.5rem', { lineHeight: '1.35' }],
        '3xl': ['1.875rem', { lineHeight: '1.25' }],
        '4xl': ['2.25rem', { lineHeight: '1.2' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.05' }],
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        // `sans` deliberately resolves to the monospace stack: Tailwind's
        // preflight puts `fontFamily.sans` on <html>, so this is the document
        // default, and the default voice of this site is the terminal. Prose
        // and any other long-form copy opt into the reading face explicitly
        // via `font-serif` (or the typography plugin, below).
        //
        // `AdwaitaMonoNerdIcons` sits behind the mono text faces: they carry no
        // Private Use Area glyphs, so the browser falls through to it per
        // character and only fetches it on a page that renders a nerd glyph.
        // See css/tailwind.css for that @font-face.
        sans: MONO,
        mono: MONO,
        serif: SERIF,
      },

      colors: {
        paper: {
          DEFAULT: 'rgb(var(--paper) / <alpha-value>)',
          soft: 'rgb(var(--paper-soft) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted: 'rgb(var(--ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
        },
        rule: 'rgb(var(--rule) / <alpha-value>)',
        code: {
          bg: 'rgb(var(--code-bg) / <alpha-value>)',
          rule: 'rgb(var(--code-rule) / <alpha-value>)',
        },
        primary: {
          50: 'rgb(var(--primary-300) / 0.08)',
          100: 'rgb(var(--primary-300) / 0.16)',
          200: 'rgb(var(--primary-300) / 0.32)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-700) / <alpha-value>)',
          900: 'rgb(var(--primary-700) / <alpha-value>)',
        },
        // Neutral ink ramp. Kept under the `gray` key so the existing `gray-*`
        // utilities scattered through the app inherit the new palette.
        gray: {
          50: 'rgb(250 250 251 / <alpha-value>)',
          100: 'rgb(244 244 246 / <alpha-value>)',
          200: 'rgb(228 229 232 / <alpha-value>)',
          300: 'rgb(200 202 206 / <alpha-value>)',
          400: 'rgb(155 160 166 / <alpha-value>)',
          500: 'rgb(107 113 120 / <alpha-value>)',
          600: 'rgb(76 83 89 / <alpha-value>)',
          700: 'rgb(35 42 47 / <alpha-value>)',
          800: 'rgb(20 24 27 / <alpha-value>)',
          900: 'rgb(16 19 22 / <alpha-value>)',
          950: 'rgb(11 13 15 / <alpha-value>)',
        },
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '50%': { transform: 'rotate(-1deg)' },
          '75%': { transform: 'rotate(1deg)' },
        },
        subtlePulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.02)', opacity: 1 },
        },
        pendulum: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(45deg)' },
          '50%': { transform: 'rotate(-45deg)' },
          '75%': { transform: 'rotate(45deg)' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
        pendulum: 'pendulum 1s ease-in-out',
        subtlePulse: 'subtlePulse 8s ease-in-out infinite',
      },
      typography: ({ theme }) => {
        // Both the default and the inverted variant resolve to the same token
        // set, because the tokens themselves already flip in dark mode.
        const palette = {
          '--tw-prose-body': 'rgb(var(--ink) / 0.9)',
          '--tw-prose-headings': 'rgb(var(--ink))',
          '--tw-prose-lead': 'rgb(var(--ink-muted))',
          '--tw-prose-links': 'rgb(var(--primary-500))',
          '--tw-prose-bold': 'rgb(var(--ink))',
          '--tw-prose-counters': 'rgb(var(--ink-faint))',
          '--tw-prose-bullets': 'rgb(var(--primary-500) / 0.55)',
          '--tw-prose-hr': 'rgb(var(--rule))',
          '--tw-prose-quotes': 'rgb(var(--ink-muted))',
          '--tw-prose-quote-borders': 'rgb(var(--primary-500) / 0.4)',
          '--tw-prose-captions': 'rgb(var(--ink-faint))',
          '--tw-prose-code': 'rgb(var(--ink))',
          '--tw-prose-pre-code': 'rgb(214 222 235)',
          '--tw-prose-pre-bg': 'rgb(var(--code-bg))',
          '--tw-prose-th-borders': 'rgb(var(--rule))',
          '--tw-prose-td-borders': 'rgb(var(--rule))',
        }

        const css = {
          ...palette,

          // Body metrics are lifted verbatim from the reference this theme was
          // measured against (mitchellh.com, `md:prose-base`): 16px on 1.75,
          // with 1.25em between paragraphs. The measure is the layout's call,
          // not the plugin's — see maxWidth below.
          fontFamily: theme('fontFamily.serif').join(', '),
          fontSize: '1rem',
          lineHeight: '1.75',
          // A backstop, not the measure. PostLayout sets its own 37rem column
          // and everything in it fills that edge to edge; this is here so the
          // layouts that drop `prose` straight into the 64rem section container
          // — author, PostSimple, PostBanner — do not run to ~137 characters.
          // 65ch is 624px in this face, near enough to the 592px column that
          // the two agree rather than fight.
          maxWidth: '65ch',

          p: { marginTop: '1.25em', marginBottom: '1.25em' },

          // Titles are the same face as the text under them, so a heading and
          // its paragraph read as one voice rather than a label bolted onto a
          // body. That puts the whole burden of hierarchy on weight and size,
          // which is why the steps below are small and the weight is 600: the
          // reference gets away with 15px headings *because* it switches to a
          // sans there, and a same-family heading at that size would simply
          // vanish. 600 rather than 700 because Plex Serif's Bold is a heavy,
          // high-contrast face — at heading sizes it stops reading as emphasis
          // and starts reading as a slab.
          'h1, h2, h3, h4, h5, h6': {
            fontFamily: theme('fontFamily.serif').join(', '),
            fontWeight: '600',
            letterSpacing: '0',
          },
          // Heading margins are the reference's own (h2 2em/1em, h3 1.6em/0.6em).
          h1: { fontSize: '1.75em', fontWeight: '600', lineHeight: '1.25', marginBottom: '0.8em' },
          h2: {
            fontSize: '1.25em',
            fontWeight: '600',
            lineHeight: '1.4',
            marginTop: '2em',
            marginBottom: '1em',
          },
          h3: {
            fontSize: '1.1em',
            fontWeight: '600',
            lineHeight: '1.5',
            marginTop: '1.6em',
            marginBottom: '0.6em',
          },
          h4: {
            fontSize: '1em',
            fontWeight: '600',
            lineHeight: '1.5',
            marginTop: '1.5em',
            marginBottom: '0.5em',
          },

          // Links carry a faint accent underline that firms up on hover,
          // which reads more quietly than a colour swap mid-sentence.
          a: {
            fontWeight: '400',
            textDecoration: 'underline',
            textDecorationColor: 'rgb(var(--primary-500) / 0.35)',
            textDecorationThickness: '1px',
            textUnderlineOffset: '0.2em',
            transition: 'text-decoration-color 150ms, color 150ms',
            '&:hover': {
              textDecorationColor: 'rgb(var(--primary-500))',
            },
          },

          // Inline code: a tinted chip, no stray backticks. 0.875em is the
          // reference's size, and it is also what keeps a monospace from
          // out-measuring the serif around it and lumping the sentence.
          code: {
            fontFamily: theme('fontFamily.mono').join(', '),
            fontWeight: '400',
            fontSize: '0.875em',
            backgroundColor: 'rgb(var(--primary-500) / 0.09)',
            color: 'rgb(var(--primary-500))',
            padding: '0.15em 0.4em',
            borderRadius: '2px',
          },
          'code::before': { content: 'none' },
          'code::after': { content: 'none' },
          'a code': { color: 'rgb(var(--primary-500))' },

          // Code blocks keep the terminal ground in both themes. 0.875em of a
          // 16px body is 14px, the reference's size and a real terminal size.
          pre: {
            fontFamily: theme('fontFamily.mono').join(', '),
            fontSize: '0.875em',
            lineHeight: '1.7',
            marginTop: '1.6em',
            marginBottom: '1.6em',
            borderRadius: '0.75rem',
            border: '1px solid rgb(var(--code-rule))',
            padding: '1.35rem 1.5rem',
          },
          'pre code': {
            backgroundColor: 'transparent',
            color: 'inherit',
            padding: '0',
            fontSize: 'inherit',
          },

          blockquote: {
            fontStyle: 'normal',
            fontWeight: '400',
            borderLeftWidth: '2px',
            marginTop: '1.6em',
            marginBottom: '1.6em',
            paddingLeft: '1em',
          },
          'blockquote p:first-of-type::before': { content: 'none' },
          'blockquote p:last-of-type::after': { content: 'none' },

          hr: {
            borderTopStyle: 'dashed',
            marginTop: '3em',
            marginBottom: '3em',
          },

          // Tables read as data: monospace, hairlines, no zebra.
          'thead th': {
            fontFamily: theme('fontFamily.mono').join(', '),
            fontSize: '0.8em',
            fontWeight: '600',
            textTransform: 'lowercase',
            letterSpacing: '0.03em',
            color: 'rgb(var(--ink-muted))',
          },
          'tbody td': { fontFamily: theme('fontFamily.mono').join(', '), fontSize: '0.85rem' },

          'figcaption, .footnotes': {
            fontFamily: theme('fontFamily.mono').join(', '),
            fontSize: '0.8125rem',
          },

          // Blockquotes are still something you read, so they keep the serif
          // and only lose a step of colour.
          'blockquote p': { fontFamily: theme('fontFamily.serif').join(', ') },

          // 600, both because that is the reference's weight and because it is
          // the only bold this family ships — asking for 700 would fall back to
          // it anyway, or worse, be synthesised.
          strong: { fontWeight: '600' },
          'blockquote strong, thead th strong, a strong': { fontWeight: '600' },
        }

        return {
          DEFAULT: { css },
          invert: { css: palette },
        }
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
