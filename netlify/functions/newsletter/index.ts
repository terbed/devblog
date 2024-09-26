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

    // Prepare the data to be sent
    const data = {
      api_key: process.env.EMAILOCTOPUS_API_KEY,
      email_address: email,
    }

    // Call the EmailOctopus API directly
    const response = await fetch(
      `https://emailoctopus.com/api/1.6/lists/${process.env.EMAILOCTOPUS_LIST_ID}/contacts`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    const responseData = await response.json()

    // Log the response for debugging
    console.log('EmailOctopus response:', responseData)

    // Handle API response
    if (responseData.error) {
      // Check if the user is already subscribed
      if (responseData.error.type === 'MEMBER_EXISTS_WITH_EMAIL_ADDRESS') {
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
