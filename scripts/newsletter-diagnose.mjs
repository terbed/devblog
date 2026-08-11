/**
 * Diagnoses the EmailOctopus newsletter setup without deploying anything.
 *
 *   EMAILOCTOPUS_API_KEY_V2=... EMAILOCTOPUS_LIST_ID=... \
 *     node scripts/newsletter-diagnose.mjs [email-you-tested-with]
 *
 * Reports: whether the key is a working v2 key, which lists it can see, whether
 * EMAILOCTOPUS_LIST_ID matches one of them, whether that list uses double
 * opt-in, and the status of a specific contact.
 */

const API_KEY = process.env.EMAILOCTOPUS_API_KEY_V2
const LIST_ID = process.env.EMAILOCTOPUS_LIST_ID
const EMAIL = process.argv[2]

if (!API_KEY) {
  console.error('EMAILOCTOPUS_API_KEY_V2 is not set. A v2 key is required.')
  process.exit(1)
}

const auth = { Authorization: `Bearer ${API_KEY}` }
const line = (label, value) => console.log(`  ${label.padEnd(22)} ${value}`)

async function getJson(url) {
  const res = await fetch(url, { headers: auth })
  const raw = await res.text()
  try {
    return { res, data: JSON.parse(raw) }
  } catch {
    return { res, data: null, raw }
  }
}

console.log('\n== API key ==')
const { res, data } = await getJson('https://api.emailoctopus.com/lists?limit=100')
if (!res.ok) {
  line('valid v2 key', `no — HTTP ${res.status}: ${data?.detail ?? ''}`)
  console.error('\nThe key was rejected. Create a v2 key at https://emailoctopus.com/api-keys')
  process.exit(1)
}
line('valid v2 key', 'yes')

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
  const url =
    `https://api.emailoctopus.com/lists/${LIST_ID}/contacts/` +
    encodeURIComponent(EMAIL.trim().toLowerCase())
  const { res: cRes, data: contact } = await getJson(url)
  if (cRes.ok) {
    line('status', contact.status)
    line('created at', contact.created_at)
    console.log('\n  The contact exists — it was created, just not where you looked.')
  } else if (cRes.status === 404) {
    console.log('  Not on this list. The subscription never reached EmailOctopus,')
    console.log('  or it went to a different list/account than the one configured.')
  } else {
    line('lookup failed', `HTTP ${cRes.status} ${contact?.detail ?? ''}`)
  }
}

console.log()
