import { Injectable, signal, computed } from '@angular/core'
import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id?: string;
  isLoading?: boolean;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    message: string;
    threadId: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient)

  private readonly messages = signal<ChatMessage[]>([])
  private readonly threadId = signal<string | null>(null)
  private readonly loading = signal(false)
  private readonly loadingMessageId = signal<string | null>(null)

  readonly messageList = computed(() => this.messages())
  readonly isLoading = computed(() => this.loading())

  /**
   * Removes reference markers from the message content
   * @param content The message content to clean
   * @returns The cleaned message content
   */
  private cleanReferenceMarkers(content: string): string {
    // Remove patterns like 【4:1†source】
    return content.replace(/【\d+:\d+†[^】]+】/g, '')
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  async sendMessage(content: string) {
    if (!content.trim()) return

    // Add user message immediately
    this.messages.update(msgs => [...msgs, { role: 'user', content }])
    this.loading.set(true)

    // Add loading message
    const loadingMessageId = this.generateMessageId()
    this.loadingMessageId.set(loadingMessageId)
    this.messages.update(msgs => [...msgs, {
      role: 'assistant',
      content: 'Thinking',
      id: loadingMessageId,
      isLoading: true
    }])

    try {
      const response = await lastValueFrom(this.http.post<ChatResponse>('/api/v1/chat', {
        message: content,
        threadId: this.threadId()
      }))

      if (response?.success && response.data) {
        // Update thread ID if received
        this.threadId.set(response.data.threadId)

        // Clean and replace loading message with actual response
        const cleanedMessage = this.cleanReferenceMarkers(response.data.message)
        this.messages.update(msgs => msgs.map(msg =>
          msg.id === loadingMessageId
            ? { role: 'assistant', content: cleanedMessage }
            : msg
        ))
      } else {
        throw new Error(response?.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      // Replace loading message with error message
      this.messages.update(msgs => msgs.map(msg =>
        msg.id === loadingMessageId
          ? { role: 'assistant', content: 'Sorry, I encountered an error processing your message.' }
          : msg
      ))
    } finally {
      this.loading.set(false)
      this.loadingMessageId.set(null)
    }
  }
}
