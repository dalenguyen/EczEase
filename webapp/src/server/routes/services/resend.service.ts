import { Resend } from 'resend'

/**
 * ResendService - A service for handling email operations using Resend
 */
export class ResendService {
  private readonly resend: Resend

  constructor() {
    this.resend = new Resend(process.env['RESEND_API_KEY'])
  }

  /**
   * Add a contact to a Resend audience
   * @param email - The contact's email address
   * @param firstName - The contact's first name
   * @param lastName - The contact's last name (optional)
   * @param audienceId - The ID of the audience to add the contact to (defaults to env variable)
   * @returns The response from the Resend API
   */
  async addContactToAudience(
    email: string,
    firstName: string,
    lastName?: string,
    audienceId?: string
  ) {
    return this.resend.contacts.create({
      email,
      firstName,
      lastName,
      audienceId: audienceId ?? process.env['RESEND_AUDIENCE_ID'] ?? '',
    })
  }

  /**
   * Send a notification email
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param html - Email HTML content
   * @param from - Sender email address (defaults to env variable)
   * @returns The response from the Resend API
   */
  async sendEmail(to: string, subject: string, html: string, from?: string) {
    return this.resend.emails.send({
      from: from ?? process.env['RESEND_FROM_EMAIL'] ?? 'dale@eczease.com',
      to,
      subject,
      html,
    })
  }
}

// Create a singleton instance
const resendService = new ResendService()

export default resendService
