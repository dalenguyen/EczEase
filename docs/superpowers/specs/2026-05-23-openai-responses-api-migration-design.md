# OpenAI Responses API Migration

**Date:** 2026-05-23  
**Status:** Approved

## Context

OpenAI is deprecating the Assistants API on August 26, 2026. The Responses API is now at feature parity. This spec covers migrating all Assistants API usage in this project.

## Scope

Three files change, one file renamed, two env vars updated.

## Files Changed

### `webapp/src/server/routes/api/v1/chat.post.ts`
- Replace `openai.beta.threads.create/retrieve` with `openai.responses.create()`
- Replace `openai.beta.threads.messages.create` + `runs.createAndPoll` with a single `openai.responses.create()` call
- Accept `previousResponseId` in request body (was `threadId`)
- Pass `previous_response_id` to the Responses API when present for conversation continuity
- Pass `file_search` tool with `vector_store_ids: [OPENAI_VECTOR_STORE_ID]`
- Inline system instructions (previously stored on the assistant object)
- Return `previousResponseId: response.id` in the response body

### `webapp/src/app/services/chat.service.ts`
- Rename `threadId` signal → `previousResponseId`
- Update `ChatResponse` interface: `data.threadId` → `data.previousResponseId`
- No behavioral change — same pattern: store ID in memory, send with each request

### `tools/scripts/upload-pdf-to-assistant.ts` → `upload-pdf-to-vectorstore.ts`
- Remove all `openai.beta.assistants` calls (create, retrieve, update, delete)
- Keep vector store create/clear/upload logic unchanged
- Output prints `vectorStoreId` only
- Script still accepts optional existing vector store ID as second arg

### `.env-template` and `.env`
- Replace `OPENAI_ASSISTANT_ID` with `OPENAI_VECTOR_STORE_ID`

## API Contract Change

**Request body:** `{ message, previousResponseId }` (was `threadId`)  
**Response body:** `{ success, data: { message, previousResponseId } }` (was `threadId`)

## System Instructions

Move from the assistant object to inline in `chat.post.ts`:

```
You are a helpful assistant specializing in eczema. Answer questions based on the provided documents.
If the answer isn't in the documents, state that you don't know. Focus solely on information related
to eczema and the provided materials.
```

## Testing

After implementation, verify with Chrome DevTools MCP:
- Send a first message, confirm response and `previousResponseId` returned
- Send a follow-up referencing the first message, confirm context is maintained
- Test file search: ask a question answerable from the uploaded PDF
