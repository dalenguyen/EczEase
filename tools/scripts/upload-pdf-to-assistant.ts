import OpenAI from 'openai';
import type { Assistant } from 'openai/resources/beta/assistants';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../webapp/.env') }); // Adjust path relative to script location

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to create the Eczease assistant
const createEczeaseAssistant = async (): Promise<Assistant> => {
  console.log('Creating new assistant...');
  const assistant = await openai.beta.assistants.create({
    name: 'Eczema Support Assistant',
    instructions: `You are a helpful assistant specializing in eczema. Answer questions based on the provided documents. If the answer isn't in the documents, state that you don't know. Focus solely on information related to eczema and the provided materials.`,
    // model: 'gpt-4o', // Having server error with this model
    model: 'gpt-4o-mini-2024-07-18',
    tools: [{ type: 'file_search' }],
  });
  console.log(`Created assistant: ${assistant.id}`);
  return assistant;
};

// Helper function to clear all files from a vector store
const clearVectorStore = async (vectorStoreId: string): Promise<void> => {
    console.log(`Clearing files from vector store: ${vectorStoreId}`);
    try {
        const files = await openai.vectorStores.files.list(vectorStoreId);
        const deletionPromises = files.data.map(file =>
            openai.vectorStores.files.del(vectorStoreId, file.id)
              .then(result => ({ fileId: file.id, success: result.deleted }))
              .catch(error => ({ fileId: file.id, success: false, error })) // Catch individual errors
        );

        const results = await Promise.allSettled(deletionPromises);

        let deletedCount = 0;
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                // Handle fulfilled promises (both success and caught errors)
                const value = result.value as { fileId: string; success: boolean; error?: any }; // Type assertion
                if (value.success) {
                    console.log(`Successfully deleted file: ${value.fileId}`);
                    deletedCount++;
                } else if ('error' in value) {
                    // Our catch block added the error property
                    console.error(`Failed to delete file: ${value.fileId}`, value.error);
                } else {
                    // API might return deleted: false even if it worked, or if already deleted
                    console.log(`Deletion status 'false' for file: ${value.fileId} (might be already deleted or API inconsistency)`);
                }
            } else if (result.status === 'rejected') {
                // Handle promises rejected by Promise.allSettled (should be less common with individual catches)
                 console.error(`Failed to run deletion operation for an unknown file:`, result.reason);
            }
        });

        if (files.data.length > 0) {
           console.log(`Attempted deletion for ${files.data.length} files. Successfully deleted/processed: ${deletedCount}.`);
        } else {
           console.log(`Vector store ${vectorStoreId} was already empty.`);
        }

    } catch (error) {
        console.error(`Error listing files in vector store ${vectorStoreId}:`, error);
        // Decide if this should be a fatal error or just a warning
        // For replacement logic, it might be okay to proceed if listing failed but upload might still work
        // throw error; // Re-throw if clearing must succeed
    }
};

// Helper function to upload a file to a specific vector store
const uploadFileToVectorStore = async (vectorStoreId: string, filePath: string): Promise<void> => {
    console.log(`Uploading file ${filePath} to vector store ${vectorStoreId}`);
    const fileStream = fs.createReadStream(path.resolve(filePath));
    try {
        const uploadResult = await openai.vectorStores.fileBatches.uploadAndPoll(vectorStoreId, {
            files: [fileStream]
        });

        console.log(`File upload status: ${uploadResult.status}`);
        console.log('File counts:', uploadResult.file_counts);

        if (uploadResult.status !== 'completed') {
            // Log details if available
             if (uploadResult.file_counts && uploadResult.file_counts.failed > 0) {
                 console.error(`File upload failed. Check OpenAI dashboard for details on vector store ${vectorStoreId}.`);
             }
            throw new Error(`File batch processing failed with status: ${uploadResult.status}`);
        }
         console.log(`Successfully uploaded ${path.basename(filePath)} to ${vectorStoreId}.`);
    } catch (error) {
        console.error(`Error uploading file ${filePath} to vector store ${vectorStoreId}:`, error);
        throw error; // Re-throw to stop the process
    }
};


// Helper function to create a vector store AND upload the initial file
// Returns the created vector store object
const createStoreAndUploadInitialFile = async (filePath: string) => {
  console.log(`Creating new vector store for file: ${filePath}`);

  // Create a vector store
  const vectorStore = await openai.vectorStores.create({
    name: `Eczease File Store - ${path.basename(filePath)} - ${Date.now()}`,
    // Optional: - in case we want to delete the file
    // expires_after: {
    //   anchor: 'last_active_at',
    //   days: 7, // Example: expire after 7 days of inactivity
    // },
  });
  console.log(`Created vector store: ${vectorStore.id}`);

  // Upload the initial file to the new store
  await uploadFileToVectorStore(vectorStore.id, filePath);

  // Return the created vector store object (type inferred)
  return vectorStore;
};


// Helper function to link a vector store to an assistant
const linkVectorStoreToAssistant = async (
  assistantId: string,
  vectorStoreId: string,
): Promise<Assistant> => {
  console.log(`Linking vector store ${vectorStoreId} to assistant ${assistantId}`);
  try {
      const updatedAssistant = await openai.beta.assistants.update(assistantId, {
        // This replaces any existing vector stores.
        // If additive behavior is ever needed, retrieve assistant first and merge IDs.
        tool_resources: { file_search: { vector_store_ids: [vectorStoreId] } },
      });
      console.log(`Successfully linked vector store to assistant.`);
      return updatedAssistant;
  } catch(error) {
       console.error(`Error linking vector store ${vectorStoreId} to assistant ${assistantId}:`, error);
       throw error; // Re-throw
  }
};


// Main function modified to handle replacing files in existing vector store
async function uploadPdfToAssistant(pdfPath: string, assistantId?: string): Promise<{
  assistantId: string;
  vectorStoreId: string;
}> {
  let finalAssistantId = assistantId;
  let vectorStoreIdToUse: string | undefined;
  let assistantCreated = false;

  try {
    // --- Assistant Handling ---
    if (finalAssistantId) {
      // If assistantId is provided, try to retrieve it and find its vector store
      try {
        console.log(`Retrieving existing assistant: ${finalAssistantId}`);
        const assistant = await openai.beta.assistants.retrieve(finalAssistantId);
        const currentVectorStores = assistant.tool_resources?.file_search?.vector_store_ids || [];

        if (currentVectorStores.length > 0) {
            if (currentVectorStores.length > 1) {
                 console.warn(`Assistant ${finalAssistantId} is linked to multiple vector stores (${currentVectorStores.join(', ')}). Replacing content in the first one: ${currentVectorStores[0]}`);
            }
            vectorStoreIdToUse = currentVectorStores[0];
            console.log(`Found existing vector store ${vectorStoreIdToUse} linked to assistant.`);

            // Clear the existing vector store
            await clearVectorStore(vectorStoreIdToUse);

            // Upload the new file to the existing vector store
            await uploadFileToVectorStore(vectorStoreIdToUse, pdfPath);

        } else {
            console.log(`Assistant ${finalAssistantId} exists but has no vector store linked. Will create a new vector store and link it.`);
            // Proceed to createStoreAndUpload flow below
        }
      } catch (err: any) {
        if (err.status === 404) {
           console.error(`Assistant ${finalAssistantId} not found. Creating a new assistant.`);
           finalAssistantId = undefined; // Clear ID so a new one is created
        } else {
           console.error(`Failed to retrieve or process existing assistant ${finalAssistantId}. Will attempt to create a new one.`, err);
           finalAssistantId = undefined; // Attempt to recover by creating a new one
        }
      }
    }

    // --- Vector Store and Linking Handling ---
    if (!vectorStoreIdToUse) { // True if no assistantId provided, assistant not found, or assistant had no store
         if (!finalAssistantId) {
             const newAssistant = await createEczeaseAssistant();
             finalAssistantId = newAssistant.id;
             assistantCreated = true;
         }

         // Create a new vector store and upload the file to it
         const newVectorStore = await createStoreAndUploadInitialFile(pdfPath);
         vectorStoreIdToUse = newVectorStore.id;

         // Link the new vector store to the (potentially new) assistant
         await linkVectorStoreToAssistant(finalAssistantId, vectorStoreIdToUse);
    }


    // Ensure we have the necessary IDs to return
    if (!finalAssistantId || !vectorStoreIdToUse) {
        throw new Error("Failed to obtain valid Assistant ID or Vector Store ID during the process.");
    }

    return {
      assistantId: finalAssistantId,
      vectorStoreId: vectorStoreIdToUse,
    };

  } catch (error) {
    console.error('Error during PDF upload/update process:', error);
    // Optionally, attempt cleanup if needed (e.g., delete newly created assistant if linking failed)
    if (assistantCreated && finalAssistantId) {
       console.log(`Attempting to delete partially created assistant ${finalAssistantId}`);
       await openai.beta.assistants.del(finalAssistantId).catch(delErr => console.error("Cleanup failed:", delErr));
    }
    throw error; // Re-throw the error for the calling code to handle
  }
}

// --- Command line execution ---

// Get command line arguments
const pdfPath = process.argv[2];
const assistantId = process.argv[3]; // Optional existing assistant ID

if (!pdfPath) {
  console.error('Usage: pnpm ts-node tools/scripts/upload-pdf-to-assistant.ts <path/to/your.pdf> [existingAssistantId]');
  process.exit(1);
}

uploadPdfToAssistant(pdfPath, assistantId)
  .then((result) => {
    console.log(
      '\n--- Operation Complete ---' + // Concatenate strings
      '\nAssistant ID: ' + result.assistantId +
      '\nVector Store ID: ' + result.vectorStoreId +
      '\n--------------------------'
    );
  })
  .catch((error) => {
     // Error is already logged within the function
    console.error(
      '\n--- Operation Failed ---' + // Concatenate strings
      '\n------------------------'
    );
    process.exit(1);
  });
