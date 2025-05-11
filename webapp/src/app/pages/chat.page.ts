import { Component, inject, model, ViewChild, ElementRef, effect } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ChatService } from '../services/chat.service'
import { RouterLink } from '@angular/router'
import { MarkdownComponent } from '@analogjs/content'
import { FeedbackComponent } from '../components/feedback.component'

@Component({
  selector: 'webapp-chat',
  imports: [CommonModule, FormsModule, RouterLink, FormsModule, MarkdownComponent, FeedbackComponent],
  template: `
    <div class="container mx-auto max-w-4xl p-4 h-[100vh] flex flex-col">
      <div class="flex items-center justify-between mb-6 flex-shrink-0 flex-wrap">
        <a
          routerLink="/"
          class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          Back to Home
        </a>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-800">Eczema AI Health Assistant</h1>
          <span class="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">BETA</span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-lg flex flex-col flex-grow overflow-hidden">
        <!-- Messages Container -->
        <div
          #messagesContainer
          class="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
        >
          @for (message of chatService.messageList(); track $index) {
            <div class="flex" [class.justify-end]="message.role === 'user'">
              <div
                class="max-w-[70%] rounded-lg p-3"
                [class]="message.role === 'user' ?
                  'bg-blue-500 text-white' :
                  'bg-gray-100 text-gray-800'"
              >
                @if (message.isLoading) {
                  <div class="flex items-center gap-2">
                    <div class="flex gap-1">
                      <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                      <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                      <div class="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                    </div>
                    <span class="text-gray-600">{{ message.content }}</span>
                  </div>
                } @else {
                  <analog-markdown [content]="message.content" />

                  <!-- Show feedback component only for assistant messages -->
                  @if (message.role === 'assistant' && !message.isLoading) {
                    <webapp-feedback
                      [responseId]="message.id"
                      [question]="getPrecedingUserQuestion(message.id)"
                      [answer]="message.content"
                    />
                  }
                }
              </div>
            </div>
          }
        </div>

        <!-- Input Area -->
        <div class="border-t p-4 bg-white flex-shrink-0">
          <form (ngSubmit)="sendMessage()" class="flex gap-2">
            <input
              type="text"
              [(ngModel)]="newMessage"
              name="message"
              class="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              [disabled]="chatService.isLoading()"
              autocomplete="off"
            />
            <button
              type="submit"
              class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              [disabled]="chatService.isLoading()"
            >
              @if (chatService.isLoading()) {
                <span>Sending...</span>
              } @else {
                <span>Send</span>
              }
            </button>
          </form>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3 flex-shrink-0">
        <svg class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-amber-800">This AI assistant provides general information only. Always consult healthcare professionals for medical advice.</p>
      </div>
    </div>
  `
})
export default class ChatPageComponent {
  readonly chatService = inject(ChatService)
  readonly newMessage = model('')

  // TODO: should we scroll to the bottom after receiving the response?
  @ViewChild('messagesContainer') private readonly messagesContainer!: ElementRef<HTMLDivElement>

  constructor() {
    // Create an effect to watch for message list changes
    // effect(() => {
    //   // Access the signal to create the dependency
    //   const messages = this.chatService.messageList()

    //   // Wait for the next render cycle to ensure content is updated
    //   setTimeout(() => {
    //     this.scrollToBottom()
    //   }, 0)
    // })
  }

  private scrollToBottom() {
    const container = this.messagesContainer?.nativeElement
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }

  /**
   * Get the user question that precedes an assistant's response
   * @param assistantMessageId The ID of the assistant message
   * @returns The preceding user question or empty string if not found
   */
  getPrecedingUserQuestion(assistantMessageId: string): string {
    const messages = this.chatService.messageList()
    const assistantIndex = messages.findIndex(m => m.id === assistantMessageId)

    if (assistantIndex > 0) {
      const previousMessage = messages[assistantIndex - 1]
      if (previousMessage.role === 'user') {
        return previousMessage.content
      }
    }

    return ''
  }

  async sendMessage() {
    if (!this.newMessage().trim()) return
    await this.chatService.sendMessage(this.newMessage())
    this.newMessage.set('')
  }
}
