import { defineEventHandler, readBody, H3Event } from 'h3'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

const ASSISTANT_ID = process.env['OPENAI_ASSISTANT_ID']

if (!ASSISTANT_ID) {
  throw new Error('OPENAI_ASSISTANT_ID is not set')
}


export default defineEventHandler(async (event: H3Event) => {
  try {
    // Read request body
    const { message, threadId } = await readBody(event)

    // Validate input
    if (!message) {
      return {
        success: false,
        message: 'Message is required',
      }
    }

    // Create or retrieve thread
    const thread = threadId
      ? await openai.beta.threads.retrieve(threadId)
      : await openai.beta.threads.create()

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message
    })

     // Run the thread and wait for the result
     const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: String(ASSISTANT_ID),
    })

    // Get messages
    const messages = await openai.beta.threads.messages.list(run.thread_id)

    const lastMessage = messages.data[0]

    if (lastMessage?.role !== 'assistant') {
      throw new Error('No assistant message found')
    }

    const responseMessage = lastMessage.content[0].type === 'text' ? lastMessage.content[0].text.value : 'No message'

    return {
      success: true,
      data: {
        message: responseMessage,
        threadId: thread.id
      }
    }
  } catch (error) {
    console.error('Chat error:', error)
    return {
      success: false,
      message: 'Failed to process chat request',
    }
  }
})
