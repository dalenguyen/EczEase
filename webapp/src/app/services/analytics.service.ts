import { Injectable } from '@angular/core'
import Clarity from '@microsoft/clarity'

/**
 * Service for tracking analytics events in the application
 * Currently supports Microsoft Clarity
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  /**
   * Track an event in Microsoft Clarity
   * @param eventName Name of the event to track
   */
  trackEvent(eventName: string): void {
    if (typeof window !== 'undefined') {
      Clarity.event(eventName)
    }
  }

  /**
   * Set a custom tag in Microsoft Clarity
   * @param key The key for the custom tag
   * @param value The value for the custom tag (can be a string or an array of strings)
   */
  setCustomTag(key: string, value: string | string[]): void {
    if (typeof window !== 'undefined') {
      Clarity.setTag(key, value)
    }
  }

  /**
   * Identify a user in Microsoft Clarity
   * @param userId Unique identifier for the user
   * @param sessionId Optional session identifier
   * @param pageId Optional page identifier
   * @param userDisplayName Optional user display name
   */
  identifyUser(
    userId: string,
    sessionId?: string,
    pageId?: string,
    userDisplayName?: string
  ): void {
    if (typeof window !== 'undefined') {
      Clarity.identify(userId, sessionId, pageId, userDisplayName)
    }
  }
}
