import { subscribeToNewsletter } from '../../../lib/newsletter'

export const handler = async (event) => {
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body ?? '', 'base64').toString('utf8')
      : (event.body ?? '')

    let email: unknown
    try {
      ;({ email } = JSON.parse(rawBody))
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: true, message: 'Invalid request body.' }),
      }
    }

    const { statusCode, body } = await subscribeToNewsletter(email)
    return { statusCode, body: JSON.stringify(body) }
  } catch (error) {
    console.error('Error in Netlify Function:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: 'Internal Server Error' }),
    }
  }
}
