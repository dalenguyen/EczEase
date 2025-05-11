import { defineEventHandler, readBody, H3Event } from 'h3'
import resendService from '../../services/resend.service'

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read request body
    const { responseId, isHelpful, comment, question, answer } = await readBody(event)

    // Validate input
    if (responseId === undefined || isHelpful === undefined) {
      return {
        success: false,
        message: 'Response ID and feedback type are required',
      }
    }

    // Send email notification about the feedback
    const emailSubject = `[EczEase] New Chat Feedback: ${isHelpful ? 'Helpful' : 'Not Helpful'}`

    // Create HTML content for the email with question and answer
    const htmlContent = `
      <h2>New Feedback Received</h2>
      <p><strong>Response ID:</strong> ${responseId}</p>
      <p><strong>Feedback:</strong> ${isHelpful ? '👍 Helpful' : '👎 Not Helpful'}</p>
      ${comment ? `<p><strong>Additional Comment:</strong> ${comment}</p>` : ''}
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
        <h3>Conversation</h3>
        ${question ? `
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px;">User Question:</p>
            <div style="padding: 10px; background-color: #f0f9ff; border-radius: 8px;">${question}</div>
          </div>
        ` : ''}
        ${answer ? `
          <div style="margin-bottom: 15px;">
            <p style="font-weight: bold; margin-bottom: 5px;">AI Response:</p>
            <div style="padding: 10px; background-color: #f0fff4; border-radius: 8px;">${answer}</div>
          </div>
        ` : ''}
      </div>
    `

    // Send the notification email
    const emailResponse = await resendService.sendEmail(
      process.env['ADMIN_EMAIL'] || 'dale@eczease.com',
      emailSubject,
      htmlContent
    )

    if (emailResponse.error) {
      console.error('Email notification error:', emailResponse.error)
      // Still return success to the client even if email fails
      // We don't want the user experience to be affected by email issues
    }

    // Store feedback in database or perform other operations as needed
    // This would be implemented in a future iteration

    return {
      success: true,
      message: 'Feedback received. Thank you!',
    }
  } catch (error) {
    console.error('Feedback submission error:', error)
    return {
      success: false,
      message: 'An error occurred while processing your feedback',
    }
  }
})
