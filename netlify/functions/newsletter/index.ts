import fetch from 'node-fetch'

export const handler = async (event) => {
  try {
    // Parse the body to get the email
    const { email } = JSON.parse(event.body)

    // Check if email is provided
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email is required' }),
      }
    }

    // Call the EmailOctopus API directly
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EMAILOCTOPUS_API_KEY}`,
        },
        body: JSON.stringify({
          email_address: email,
        }),
      }
    )

    // Handle API response
    if (!response.ok) {
      const error = await response.json()

      // Check if the user is already subscribed
      if (error.error && error.error.includes('already subscribed')) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'This email is already subscribed!' }),
        }
      }

      // Handle other errors
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.error.message || 'Subscription failed' }),
      }
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully subscribed!' }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }
  }
}
