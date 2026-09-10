# Fonts

Two families, split by job.

- **IBM Plex Serif** — everything you read. Body prose *and* every title, so a
  heading and the paragraph under it speak in one voice. Also post summaries,
  card descriptions, margin-note bodies, footnotes, résumé copy.
- **Adwaita Mono** — the machine-readable remainder. Navigation, post metadata,
  tags, tables, code.

The split exists because a monospace distributes its whitespace evenly: `i` and
`l` are padded out to the same advance as `m`, so every word carries visible
internal gaps. That is exactly right for a column of code and exhausting for a
column of prose — it was what made long-form reading here feel spread out, and
it is not something leading or margins can fix, because the airiness is inside
the words. See `tailwind.config.js` for how the two are wired to `font-mono` /
`font-serif`.

## Adwaita Mono Nerd Font (subset)

Source: Adwaita Mono Nerd Font (Nerd Fonts patch of GNOME's Adwaita Mono,
itself derived from Iosevka).

## Text faces — 184 KB total

Four faces: Regular, Italic, Bold, Bold Italic. A terminal has one weight and
one bold, so that is what ships; `font-medium` (500) resolves to Regular and
`font-semibold` (600) to Bold, which is the intent in both cases.

Adwaita Mono keeps the same 0.600em advance as the JetBrains Mono it replaced,
so the reading column still lands on exactly 80 characters at 16px and the size
ladder in `tailwind.config.js` needed no change. Its x-height is 0.520 against
JetBrains Mono's 0.550, so it reads a little finer at the same nominal size —
which is the point of the swap.

Subsetted to what the site actually uses plus headroom: Latin-1, Latin
Extended-A (Hungarian ő/ű), punctuation, sub/superscripts, currency, letterlike
(ℝ ™ №), arrows, math operators, misc technical (⌘), box drawing, geometric
shapes, and the check/cross marks:

    pyftsubset AdwaitaMonoNerdFont-Regular.ttf \
      --output-file=adwaita-mono-400.woff2 --flavor=woff2 \
      --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2200-22FF,U+2300-23FF,U+2500-257F,U+25A0-25FF,U+2713-2717,U+FEFF,U+FFFD" \
      --layout-features="kern,liga,calt,ccmp,mark,mkmk,locl" --no-hinting

Emoji are deliberately not covered — the system emoji font handles those.

## Icon face — 493 KB, lazily loaded

`adwaita-mono-nerd-icons.woff2` carries the Nerd Font glyphs (Powerline,
Devicons, Font Awesome, Octicons, Codicons, Seti, Font Logos, Weather —
everything except the ~7,000-glyph Material Design block).

It is declared in `css/tailwind.css` as a separate family with a
`unicode-range` restricted to those Private Use Area blocks, and sits _after_
the text faces in the font stack. The text subset has no glyphs in those
ranges, so the browser falls through to it per character — meaning the 493 KB
is fetched only on a page that actually renders a nerd glyph. No post does
today, so it currently costs nothing, and ``keeps working the moment you
paste one into an`.mdx`.

Licensed under the SIL Open Font License — see `LICENSE`.

## IBM Plex Serif (subset) — 81 KB total

Source: [google/fonts `ofl/ibmplexserif`](https://github.com/google/fonts/tree/main/ofl/ibmplexserif)
(IBM / Bold Monday). Four faces: Regular, Italic, SemiBold, SemiBold Italic.

**400 and 600, not 400 and 700.** Plex Serif's Bold is a heavy, high-contrast
face; at heading sizes it stops reading as emphasis and starts reading as a
slab, which is exactly the "too fat" the previous pass had. SemiBold carries
the same hierarchy at a fraction of the weight. A CSS request for 700 falls to
600 under font matching, so `font-bold` remains safe to write anywhere.

Its 0.516em x-height sits almost exactly on Adwaita Mono's 0.520em, so the
serif and the mono chrome around it read at the same optical size with no
compensating step — which is why body prose is a plain 16px here. The
frequency-weighted average advance is 0.4637em, putting the 37rem reading
column at ~79 characters.

Subsetted to the same ranges as the mono faces, minus the box-drawing and
technical blocks a serif has no business carrying:

    pyftsubset IBMPlexSerif-Regular.ttf \
      --output-file=plex-serif-400.woff2 --flavor=woff2 \
      --unicodes="U+0000-00FF,U+0100-017F,U+2000-206F,U+2070-209F,U+20A0-20CF,U+2100-214F,U+2190-21FF,U+2212,U+2215,U+FEFF,U+FFFD" \
      --layout-features="kern,liga,calt,ccmp,mark,mkmk,locl" --no-hinting

Licensed under the SIL Open Font License — see `LICENSE-IBM-Plex-Serif.txt`.
