/**
 * Diagnoses the EmailOctopus newsletter setup without deploying anything.
 *
 *   EMAILOCTOPUS_API_KEY=... EMAILOCTOPUS_LIST_ID=... \
 *     node scripts/newsletter-diagnose.mjs [email-you-tested-with]
 *
 * Reports: whether the key is valid, which lists it can see, whether
 * EMAILOCTOPUS_LIST_ID matches one of them, whether that list uses double
 * opt-in, and the status of a specific contact.
 */
import { createHash } from 'node:crypto'

const API_KEY = process.env.EMAILOCTOPUS_API_KEY
const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID
const EMAIL = process.argv[2]

if (!API_KEY) {
  console.error('EMAILOCTOPUS_API_KEY is not set.')
  process.exit(1)
}

const API_BASE = 'https://emailoctopus.com/api/1.6'
const key = encodeURIComponent(API_KEY)
const line = (label, value) => console.log(`  ${label.padEnd(22)} ${value}`)

async function getJson(url) {
  const res = await fetch(url)
  const raw = await res.text()
  try {
    return { res, data: JSON.parse(raw) }
  } catch {
    return { res, data: null, raw }
  }
}

console.log('\n== API key ==')
const { res, data } = await getJson(`${API_BASE}/lists?api_key=${key}&limit=100`)
if (!res.ok) {
  line('valid', `no — ${data?.error?.code ?? res.status}: ${data?.error?.message ?? ''}`)
  process.exit(1)
}
line('valid', 'yes')

console.log('\n== Lists visible to this key ==')
const lists = data.data ?? []
if (lists.length === 0) console.log('  (none — this key belongs to an account with no lists)')
for (const l of lists) {
  console.log(`  ${l.id}  ${l.name}`)
  console.log(
    `      double opt-in: ${l.double_opt_in}   counts: ${JSON.stringify(l.counts?.[0] ?? l.counts)}`
  )
}

console.log('\n== EMAILOCTOPUS_LIST_ID ==')
if (!LIST_ID) {
  line('configured', 'MISSING — subscriptions cannot work')
} else {
  const match = lists.find((l) => l.id === LIST_ID)
  line('configured', LIST_ID)
  line('matches a list', match ? `yes → "${match.name}"` : 'NO — this key cannot see that list')
  if (match?.double_opt_in) {
    console.log(
      '\n  This list uses double opt-in: contacts added via the API are created as\n' +
        '  PENDING and only appear under the "Pending" status filter until they click\n' +
        '  the confirmation email.'
    )
  }
}

if (EMAIL && LIST_ID) {
  console.log(`\n== Contact "${EMAIL}" ==`)
  const hash = createHash('md5').update(EMAIL.trim().toLowerCase()).digest('hex')
  const { res: cRes, data: contact } = await getJson(
    `${API_BASE}/lists/${LIST_ID}/contacts/${hash}?api_key=${key}`
  )
  if (cRes.ok) {
    line('status', contact.status)
    line('created at', contact.created_at)
  } else if (contact?.error?.code === 'NOT_FOUND') {
    console.log('  Not on this list — the subscription never reached EmailOctopus.')
  } else {
    line('lookup failed', `${cRes.status} ${contact?.error?.code ?? ''}`)
  }
}

console.log()
