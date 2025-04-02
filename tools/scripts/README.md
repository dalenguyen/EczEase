# OpenAI Assistant Tools

This directory contains utility scripts for working with OpenAI Assistants API.

## PDF Upload Script

The `upload-pdf-to-assistant.ts` script uploads a PDF file to an OpenAI Vector Store and links that store to an OpenAI Assistant using the `file_search` tool.

- If no `assistantId` is provided, it creates a _new_ assistant and a _new_ vector store.
- If an `assistantId` _is_ provided, it retrieves the assistant, finds the linked vector store, _clears_ it, and uploads the new PDF content into the _existing_ vector store. If the assistant has no linked store, it creates a new one and links it.

### Prerequisites

- Node.js and pnpm installed (`npm install -g pnpm`)
- OpenAI API key set in `webapp/.env` (ensure the path in the script `.config()` is correct relative to the script location)
- PDF file to upload

### Usage

You can run the script using `pnpm` with `ts-node` (or `tsx` if preferred and installed globally/locally):

```bash
# Create a new assistant and vector store, upload PDF, and link them
pnpm ts-node tools/scripts/upload-pdf-to-assistant.ts path/to/your/file.pdf

# Replace content in the vector store linked to an existing assistant
pnpm ts-node tools/scripts/upload-pdf-to-assistant.ts path/to/your/file.pdf your_existing_asst_id

# Using nx (if configured in package.json to run the ts-node command)
# nx run upload-pdf path/to/your/file.pdf [assistant-id]
```

### Arguments

1.  `pdfPath` (required): Path to the PDF file you want to upload.
2.  `assistantId` (optional): ID of an existing assistant whose linked vector store content should be replaced.

### Example

```bash
pnpm ts-node tools/scripts/upload-pdf-to-assistant.ts ./docs/example.pdf asst_abc123xyz
```

### Output

The script will output:

- `Assistant ID`: The ID of the new or existing assistant.
- `Vector Store ID`: The ID of the new or existing vector store linked to the assistant.
- Status messages throughout the process.
- Error messages if something goes wrong.

### Notes

- The script uses the OpenAI API key from `webapp/.env`.
- It uses the Vector Stores API and the `file_search` tool, not the older `retrieval` tool or direct file attachments.
- If an existing assistant ID is provided, the script _replaces_ the content in its associated vector store, assuming one is linked. Be cautious when using this with important assistants.
- The script will exit with code 1 if there's an error during the process.
