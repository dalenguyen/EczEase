# OpenAI Responses API Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all OpenAI Assistants API usage with the Responses API before the August 26, 2026 deprecation deadline.

**Architecture:** The server route creates a stateless Responses API call per message, passing `previous_response_id` for conversation continuity. The vector store ID moves from an assistant-linked resource to a direct env var passed as a `file_search` tool per request. The Angular service renames `threadId` → `previousResponseId` throughout.

**Tech Stack:** AnalogJS (Nitro/H3 server routes), Angular 17+, vitest, OpenAI Node SDK, Chrome DevTools MCP

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `webapp/src/server/routes/api/v1/chat.post.ts` | Replace threads/runs with `openai.responses.create()` |
| Modify | `webapp/src/app/services/chat.service.ts` | Rename `threadId` → `previousResponseId` in signal + interface |
| Rename+Modify | `tools/scripts/upload-pdf-to-assistant.ts` → `upload-pdf-to-vectorstore.ts` | Remove assistant calls, keep vector store logic |
| Modify | `webapp/.env-template` | Replace `OPENAI_ASSISTANT_ID` with `OPENAI_VECTOR_STORE_ID` |
| Modify | `webapp/.env` | Same as above (your local env) |

---

### Task 1: Update env files

**Files:**
- Modify: `webapp/.env-template`
- Modify: `webapp/.env`

- [ ] **Step 1: Update `.env-template`**

Replace:
```
OPENAI_ASSISTANT_ID=
```
With:
```
OPENAI_VECTOR_STORE_ID=
```

- [ ] **Step 2: Update `.env`**

In `webapp/.env`, rename the key:
```
OPENAI_VECTOR_STORE_ID=<paste your existing vector store ID here>
```

Remove the `OPENAI_ASSISTANT_ID` line.

> Your vector store ID can be found in the OpenAI dashboard under Storage → Vector Stores, or from the output of the upload script (it starts with `vs_`).

- [ ] **Step 3: Commit**

```bash
git add webapp/.env-template
git commit -m "chore(webapp): rename OPENAI_ASSISTANT_ID to OPENAI_VECTOR_STORE_ID"
```

> Do NOT commit `.env` — it's gitignored and contains secrets.

---

### Task 2: Migrate chat server route

**Files:**
- Modify: `webapp/src/server/routes/api/v1/chat.post.ts`

- [ ] **Step 1: Replace the file contents**

```typescript
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd webapp && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add webapp/src/server/routes/api/v1/chat.post.ts
git commit -m "feat(webapp): migrate chat route from Assistants to Responses API"
```

---

### Task 3: Update Angular chat service

**Files:**
- Modify: `webapp/src/app/services/chat.service.ts`

- [ ] **Step 1: Write the failing test**

Create `webapp/src/app/services/chat.service.spec.ts`:

```typescript
import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { ChatService, ChatResponse } from './chat.service'

describe('ChatService', () => {
  let service: ChatService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService],
    })
    service = TestBed.inject(ChatService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => httpMock.verify())

  it('sends previousResponseId in request body', async () => {
    const sendPromise = service.sendMessage('hello')

    const req = httpMock.expectOne('/api/v1/chat')
    expect(req.request.body).toEqual({ message: 'hello', previousResponseId: null })
    req.flush({
      success: true,
      data: { message: 'Hi there', previousResponseId: 'resp_abc123' },
    } satisfies ChatResponse)

    await sendPromise
    expect(service.messageList().at(-1)?.content).toBe('Hi there')
  })

  it('uses previousResponseId from previous response in next request', async () => {
    // First message
    const p1 = service.sendMessage('first')
    const req1 = httpMock.expectOne('/api/v1/chat')
    req1.flush({
      success: true,
      data: { message: 'First reply', previousResponseId: 'resp_first' },
    } satisfies ChatResponse)
    await p1

    // Second message should send the stored previousResponseId
    const p2 = service.sendMessage('second')
    const req2 = httpMock.expectOne('/api/v1/chat')
    expect(req2.request.body.previousResponseId).toBe('resp_first')
    req2.flush({
      success: true,
      data: { message: 'Second reply', previousResponseId: 'resp_second' },
    } satisfies ChatResponse)
    await p2
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
nx test webapp --testFile=src/app/services/chat.service.spec.ts
```

Expected: FAIL — `previousResponseId` is not a known property

- [ ] **Step 3: Update `chat.service.ts`**

Full replacement:

```typescript
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
```

- [ ] **Step 4: Run test to verify it passes**

```bash
nx test webapp --testFile=src/app/services/chat.service.spec.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Run full test suite to check for regressions**

```bash
nx test webapp
```

Expected: all tests pass

- [ ] **Step 6: Commit**

```bash
git add webapp/src/app/services/chat.service.ts webapp/src/app/services/chat.service.spec.ts
git commit -m "feat(webapp): rename threadId to previousResponseId in chat service"
```

---

### Task 4: Migrate upload script

**Files:**
- Rename+Modify: `tools/scripts/upload-pdf-to-assistant.ts` → `tools/scripts/upload-pdf-to-vectorstore.ts`

- [ ] **Step 1: Create the new script file**

Create `tools/scripts/upload-pdf-to-vectorstore.ts`:

```typescript
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../webapp/.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const clearVectorStore = async (vectorStoreId: string): Promise<void> => {
  console.log(`Clearing files from vector store: ${vectorStoreId}`);
  try {
    const files = await openai.vectorStores.files.list(vectorStoreId);
    const deletionPromises = files.data.map(file =>
      openai.vectorStores.files.del(vectorStoreId, file.id)
        .then(result => ({ fileId: file.id, success: result.deleted }))
        .catch(error => ({ fileId: file.id, success: false, error }))
    );

    const results = await Promise.allSettled(deletionPromises);
    let deletedCount = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const value = result.value as { fileId: string; success: boolean; error?: unknown };
        if (value.success) {
          console.log(`Deleted file: ${value.fileId}`);
          deletedCount++;
        } else if ('error' in value) {
          console.error(`Failed to delete file: ${value.fileId}`, value.error);
        }
      } else {
        console.error(`Deletion operation failed:`, result.reason);
      }
    });

    if (files.data.length === 0) {
      console.log(`Vector store ${vectorStoreId} was already empty.`);
    } else {
      console.log(`Attempted ${files.data.length} deletions. Deleted: ${deletedCount}.`);
    }
  } catch (error) {
    console.error(`Error listing files in vector store ${vectorStoreId}:`, error);
  }
};

const uploadFileToVectorStore = async (vectorStoreId: string, filePath: string): Promise<void> => {
  console.log(`Uploading ${filePath} to vector store ${vectorStoreId}`);
  const fileStream = fs.createReadStream(path.resolve(filePath));

  const uploadResult = await openai.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, {
    files: [fileStream]
  });

  console.log(`Upload status: ${uploadResult.status}`);
  console.log('File counts:', uploadResult.file_counts);

  if (uploadResult.status !== 'completed') {
    throw new Error(`File batch processing failed with status: ${uploadResult.status}`);
  }
  console.log(`Successfully uploaded ${path.basename(filePath)}.`);
};

const createStoreAndUpload = async (filePath: string) => {
  console.log(`Creating new vector store for: ${filePath}`);

  const vectorStore = await openai.vectorStores.create({
    name: `Eczease File Store - ${path.basename(filePath)} - ${Date.now()}`,
    expires_after: {
      anchor: 'last_active_at',
      days: 90,
    },
  });
  console.log(`Created vector store: ${vectorStore.id}`);

  await uploadFileToVectorStore(vectorStore.id, filePath);
  return vectorStore;
};

async function uploadPdfToVectorStore(pdfPath: string, vectorStoreId?: string): Promise<{ vectorStoreId: string }> {
  let storeId = vectorStoreId;

  if (storeId) {
    try {
      console.log(`Using existing vector store: ${storeId}`);
      await clearVectorStore(storeId);
      await uploadFileToVectorStore(storeId, pdfPath);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('expired')) {
        console.log(`Vector store ${storeId} has expired. Creating a new one.`);
        storeId = undefined;
      } else {
        throw error;
      }
    }
  }

  if (!storeId) {
    const newStore = await createStoreAndUpload(pdfPath);
    storeId = newStore.id;
  }

  return { vectorStoreId: storeId };
}

// CLI entry point
const pdfPath = process.argv[2];
const existingVectorStoreId = process.argv[3];

if (!pdfPath) {
  console.error('Usage: pnpm ts-node tools/scripts/upload-pdf-to-vectorstore.ts <path/to/file.pdf> [existingVectorStoreId]');
  process.exit(1);
}

uploadPdfToVectorStore(pdfPath, existingVectorStoreId)
  .then(({ vectorStoreId }) => {
    console.log('\n--- Operation Complete ---');
    console.log(`Vector Store ID: ${vectorStoreId}`);
    console.log('Set in webapp/.env: OPENAI_VECTOR_STORE_ID=' + vectorStoreId);
    console.log('--------------------------');
  })
  .catch(error => {
    console.error('\n--- Operation Failed ---', error);
    process.exit(1);
  });
```

- [ ] **Step 2: Delete the old script**

```bash
git rm tools/scripts/upload-pdf-to-assistant.ts
```

- [ ] **Step 3: Commit**

```bash
git add tools/scripts/upload-pdf-to-vectorstore.ts
git commit -m "refactor(tools): replace upload-pdf-to-assistant with upload-pdf-to-vectorstore"
```

---

### Task 5: Integration test with Chrome DevTools MCP

**Goal:** Verify the full chat flow works end-to-end in the running app.

- [ ] **Step 1: Start the dev server**

```bash
nx serve webapp
```

Wait for: `Local: http://localhost:4200`

- [ ] **Step 2: Open the app in Chrome via MCP**

Use `mcp__chrome-devtools__navigate_page` to open `http://localhost:4200`.

Take a screenshot with `mcp__chrome-devtools__take_screenshot` to confirm the app loads.

- [ ] **Step 3: Navigate to the chat page**

Use `mcp__chrome-devtools__navigate_page` to go to `http://localhost:4200/chat`.

Take a screenshot to confirm the chat UI renders.

- [ ] **Step 4: Send a first message**

Use `mcp__chrome-devtools__fill` to type a message in the chat input (e.g. "What is eczema?").

Use `mcp__chrome-devtools__click` to submit.

Wait for the response with `mcp__chrome-devtools__wait_for`.

Use `mcp__chrome-devtools__take_screenshot` to confirm a reply appears.

Check network requests with `mcp__chrome-devtools__list_network_requests` — verify the POST to `/api/v1/chat` returns `previousResponseId` (not `threadId`).

- [ ] **Step 5: Send a follow-up to verify conversation continuity**

Type a follow-up message like "What treatments are available?" and submit.

In the network request body, verify `previousResponseId` is populated with the ID from the previous response.

Confirm the reply shows context-aware behavior.

- [ ] **Step 6: Commit completion note**

No code change — just confirm all steps passed. The migration is complete.
