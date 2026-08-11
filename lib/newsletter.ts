/**
 * EmailOctopus subscription logic, shared by the Next.js route handler
 * (`app/api/newsletter/route.ts`) and the Netlify function
 * (`netlify/functions/newsletter/index.ts`).
 *
 * Targets API v2 only. The legacy v1.6 API is deprecated and its error shape
 * differs incompatibly (`{error:{code,message}}` vs RFC 7807), so there is
 * deliberately no fallback: a missing v2 key fails loudly rather than quietly
 * subscribing nobody.
 *
 * Docs: https://emailoctopus.com/api-documentation/v2
 */

const API_BASE = 'https://api.emailoctopus.com'

/** Contact states EmailOctopus can return. PENDING = double opt-in not confirmed yet. */
export type ContactStatus = 'SUBSCRIBED' | 'UNSUBSCRIBED' | 'PENDING'

export type SubscribeResult = {
  statusCode: number
  body: {
    error: boolean
    message: string
    /** Only set on success, so the UI can distinguish PENDING from SUBSCRIBED. */
    contactStatus?: ContactStatus
  }
}

const ok = (message: string, contactStatus: ContactStatus): SubscribeResult => ({
  statusCode: 200,
  body: { error: false, message, contactStatus },
})

const fail = (statusCode: number, message: string): SubscribeResult => ({
  statusCode,
  body: { error: true, message },
})

export async function subscribeToNewsletter(email: unknown): Promise<SubscribeResult> {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return fail(400, 'A valid email address is required.')
  }

  const apiKey = process.env.EMAILOCTOPUS_API_KEY_V2
  const listId = process.env.EMAILOCTOPUS_LIST_ID

  // Without these the request would only be rejected by EmailOctopus, so bail
  // out loudly instead of reporting a misconfiguration as a user error.
  if (!apiKey || !listId) {
    console.error(
      `Newsletter misconfigured: EMAILOCTOPUS_API_KEY_V2 ${apiKey ? 'set' : 'MISSING'}, ` +
        `EMAILOCTOPUS_LIST_ID ${listId ? 'set' : 'MISSING'}`
    )
    return fail(500, 'The newsletter is not configured. Please try again later.')
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}/lists/${listId}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ email_address: email.trim() }),
    })
  } catch (err) {
    console.error('Newsletter: EmailOctopus request failed:', err)
    return fail(502, 'Could not reach the newsletter provider. Please try again later.')
  }

  const raw = await response.text()
  let data: any
  try {
    data = JSON.parse(raw)
  } catch {
    // A non-JSON body means we are not talking to the API we think we are.
    console.error(`Newsletter: non-JSON response (HTTP ${response.status}):`, raw.slice(0, 500))
    return fail(502, 'Unexpected response from the newsletter provider.')
  }

  if (!response.ok) {
    // v2 errors are RFC 7807: {type, title, detail, status}, where `type` is a
    // docs URL whose fragment is the error code.
    const code = data?.type?.split('#').pop() ?? String(response.status)
    console.error(`Newsletter: EmailOctopus rejected the request (HTTP ${response.status})`, {
      code,
      detail: data?.detail ?? raw.slice(0, 200),
    })

    switch (code) {
      case 'conflict':
      case 'already-exists':
        return fail(400, 'This email is already subscribed!')
      case 'bad-request':
      case 'unprocessable-content':
        return fail(400, 'That email address was rejected. Please check it and try again.')
      // Everything else — bad key, wrong list, rate limits — is our problem,
      // not the subscriber's, so it must never surface as a user error.
      default:
        return fail(502, 'Subscription failed. Please try again later.')
    }
  }

  const contactStatus = String(data?.status ?? 'SUBSCRIBED').toUpperCase() as ContactStatus
  console.log(`Newsletter: contact created with status ${contactStatus}`)

  // This list has double opt-in enabled, so API-created contacts land as PENDING
  // and only count as subscribers once they click the confirmation email.
  return contactStatus === 'PENDING'
    ? ok('Almost there — check your inbox to confirm your subscription!', contactStatus)
    : ok('Successfully subscribed!', contactStatus)
}
