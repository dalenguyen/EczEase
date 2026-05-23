import { defineEventHandler, readBody, H3Event } from 'h3'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY']
})

const VECTOR_STORE_ID = process.env['OPENAI_VECTOR_STORE_ID']

if (!VECTOR_STORE_ID) {
  throw new Error('OPENAI_VECTOR_STORE_ID is not set')
}

const INSTRUCTIONS = `You are a helpful assistant specializing in eczema. Answer questions based on the provided documents. If the answer isn't in the documents, state that you don't know. Focus solely on information related to eczema and the provided materials.`

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { message, previousResponseId } = await readBody(event)

    if (!message) {
      return {
        success: false,
        message: 'Message is required',
      }
    }

    const response = await openai.responses.create({
      model: 'gpt-4o-mini',
      instructions: INSTRUCTIONS,
      input: message,
      ...(previousResponseId ? { previous_response_id: previousResponseId } : {}),
      tools: [{ type: 'file_search', vector_store_ids: [String(VECTOR_STORE_ID)] }],
    })

    return {
      success: true,
      data: {
        message: response.output_text,
        previousResponseId: response.id,
      },
    }
  } catch (error) {
    console.error('Chat error:', error)
    return {
      success: false,
      message: 'Failed to process chat request',
    }
  }
})
