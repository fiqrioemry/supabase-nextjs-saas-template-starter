import OpenAI from "openai";
import { createServer } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

export async function processDocumentEmbeddings(
  documentId: string,
  agentId: string,
  content: string
) {
  try {
    const supabase = await createServer();
    // Split content into chunks
    const chunks = splitIntoChunks(content, 1000); // 1000 chars per chunk

    const embeddings = [];

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      embeddings.push({
        content: chunk,
        embedding,
        document_id: documentId,
        agent_id: agentId,
      });
    }

    // Insert embeddings into database
    const { error } = await supabase.from("embeddings").insert(embeddings);

    if (error) {
      throw error;
    }

    return embeddings.length;
  } catch (error) {
    console.error("Error processing document embeddings:", error);
    throw error;
  }
}

function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  let currentChunk = "";

  for (const sentence of sentences) {
    if (
      currentChunk.length + sentence.length > maxChunkSize &&
      currentChunk.length > 0
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk.length > 0 ? ". " : "") + sentence;
    }
  }

  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }

  return chunks.filter((chunk) => chunk.length > 50); // Filter out very small chunks
}
