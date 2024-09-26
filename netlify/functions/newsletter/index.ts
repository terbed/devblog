export const handler = async (event) => {
  try {
    // Parse the body to get the email
    const { email } = JSON.parse(event.body)

    // Check if email is provided
    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: true, message: 'Email is required' }),
      }
    }

    // Call the EmailOctopus API directly with the API key in the query parameter
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts?api_key=${process.env.EMAILOCTOPUS_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
        }),
      }
    )

    const responseData = await response.json()

    // Handle API response
    if (!response.ok) {
      // Check if the user is already subscribed
      if (responseData.error && responseData.error.type === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: true, message: 'This email is already subscribed!' }),
        }
      }

      // Handle other errors
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: true,
          message: responseData.error.message || 'Subscription failed',
        }),
      }
    }

    // Success
    return {
      statusCode: 200,
      body: JSON.stringify({ error: false, message: 'Successfully subscribed!' }),
    }
  } catch (error) {
    console.error('Error in Netlify Function:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: true, message: 'Internal Server Error' }),
    }
  }
}
