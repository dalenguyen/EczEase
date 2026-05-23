import { Injectable, signal, computed } from '@angular/core'
import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { lastValueFrom } from 'rxjs'

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  isLoading?: boolean;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    message: string;
    previousResponseId: string;
  };
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private readonly http = inject(HttpClient)

  private readonly messages = signal<ChatMessage[]>([])
  private readonly previousResponseId = signal<string | null>(null)
  private readonly loading = signal(false)
  private readonly loadingMessageId = signal<string | null>(null)

  readonly messageList = computed(() => this.messages())
  readonly isLoading = computed(() => this.loading())

  private cleanReferenceMarkers(content: string): string {
    return content.replace(/【\d+:\d+†[^】]+】/g, '')
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  async sendMessage(content: string) {
    if (!content.trim()) return

    const userMessageId = this.generateMessageId()
    this.messages.update(msgs => [...msgs, { role: 'user', content, id: userMessageId }])
    this.loading.set(true)

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
        previousResponseId: this.previousResponseId()
      }))

      if (response?.success && response.data) {
        this.previousResponseId.set(response.data.previousResponseId)

        const cleanedMessage = this.cleanReferenceMarkers(response.data.message)
        const responseId = this.generateMessageId()
        this.messages.update(msgs => msgs.map(msg =>
          msg.id === loadingMessageId
            ? { role: 'assistant', content: cleanedMessage, id: responseId }
            : msg
        ))
      } else {
        throw new Error(response?.message || 'Unknown error')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorId = this.generateMessageId()
      this.messages.update(msgs => msgs.map(msg =>
        msg.id === loadingMessageId
          ? { role: 'assistant', content: 'Sorry, I encountered an error processing your message.', id: errorId }
          : msg
      ))
    } finally {
      this.loading.set(false)
      this.loadingMessageId.set(null)
    }
  }
}
