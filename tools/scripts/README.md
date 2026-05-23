# OpenAI Vector Store Tools

This directory contains utility scripts for managing OpenAI Vector Stores used by the Eczease chat feature.

## PDF Upload Script

The `upload-pdf-to-vectorstore.ts` script uploads a PDF file to an OpenAI Vector Store.

- If no `vectorStoreId` is provided, it creates a new vector store and uploads the PDF.
- If a `vectorStoreId` is provided, it clears the existing store's files and uploads the new PDF into it. If the store has expired, a new one is created automatically.

### Prerequisites

- Node.js and pnpm installed (`npm install -g pnpm`)
- OpenAI API key set in `webapp/.env`
- PDF file to upload

### Usage

```bash
# Create a new vector store and upload PDF
pnpm ts-node tools/scripts/upload-pdf-to-vectorstore.ts path/to/your/file.pdf

# Replace content in an existing vector store
pnpm ts-node tools/scripts/upload-pdf-to-vectorstore.ts path/to/your/file.pdf vs_abc123

# Using the npm script shorthand
pnpm upload-pdf path/to/your/file.pdf [vectorStoreId]
```

### Arguments

1. `pdfPath` (required): Path to the PDF file to upload.
2. `vectorStoreId` (optional): ID of an existing vector store whose content should be replaced.

### Output

The script prints the vector store ID and the env var to set:

```
--- Operation Complete ---
Vector Store ID: vs_abc123
Set in webapp/.env: OPENAI_VECTOR_STORE_ID=vs_abc123
--------------------------
```

Copy the `OPENAI_VECTOR_STORE_ID` value into `webapp/.env`.

### Notes

- The script loads the OpenAI API key from `webapp/.env`.
- Vector stores are created with a 90-day inactivity expiry.
- The script exits with code 1 on error.
