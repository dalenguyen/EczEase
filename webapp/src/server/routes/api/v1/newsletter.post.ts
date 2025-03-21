import { defineEventHandler, readBody, H3Event } from 'h3'
import resendService from '../../services/resend.service'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read request body
    const { name, email } = await readBody(event)

    // Validate input
    if (!name || !email) {
      return {
        success: false,
        message: 'Name and email are required',
      }
    }

    // Split name into firstName and lastName
    const nameParts = name.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    // Add to Resend audience using the shared service
    const audienceResponse = await resendService.addContactToAudience(
      email,
      firstName,
      lastName
    )

    if (audienceResponse.error) {
      console.error('Resend API error:', audienceResponse.error)
      return {
        success: false,
        message: 'Failed to add to newsletter',
      }
    }

    return {
      success: true,
      message: 'Successfully added to newsletter',
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return {
      success: false,
      message: 'An error occurred while processing your request',
    }
  }
})
