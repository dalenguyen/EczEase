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
