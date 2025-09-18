"use server";

import OpenAI from "openai";
import pdfParse from "pdf-parse";
import { revalidatePath } from "next/cache";
import { createServer } from "@/lib/supabase/server";

const openai = new OpenAI({
  apiKey: process.env.NEXT_OPENAI_API_KEY!,
});

/**
 * Generate embedding dari teks menggunakan OpenAI
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
}

/**
 * Split teks panjang ke beberapa chunk
 */
function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  let current = "";

  for (const sentence of sentences) {
    if (current.length + sentence.length > maxChunkSize && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current.length > 0 ? " " : "") + sentence;
    }
  }

  if (current.trim().length > 0) chunks.push(current.trim());

  return chunks.filter((c) => c.length > 20);
}

/**
 * Ekstrak teks dari file PDF (EdgeStore URL → Buffer → Text)
 */
async function extractPdfText(fileUrl: string): Promise<string> {
  const res = await fetch(fileUrl);
  if (!res.ok) throw new Error(`Gagal download file: ${res.statusText}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // ⬇️ Import baru saat fungsi dipanggil (tidak di-evaluate Turbopack)
  const pdfParse = (await import("pdf-parse")).default;

  const parsed = await pdfParse(buffer);
  return parsed.text || "";
}

/**
 * Proses konten dokumen → split → generate embedding → simpan ke DB
 */
export async function processDocumentEmbeddings(
  documentId: string,
  agentId: string,
  content: string
) {
  const supabase = await createServer();

  try {
    const chunks = splitIntoChunks(content, 1000);

    const embeddingsPayload = await Promise.all(
      chunks.map(async (chunk) => ({
        content: chunk,
        embedding: await generateEmbedding(chunk),
        document_id: documentId,
        agent_id: agentId,
      }))
    );

    const { error: insertError } = await supabase
      .from("embeddings")
      .insert(embeddingsPayload);

    if (insertError) throw insertError;

    await supabase
      .from("documents")
      .update({
        processing_status: "ready",
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    return { success: true, chunks: embeddingsPayload.length };
  } catch (error) {
    console.error("❌ Embedding error:", error);

    await supabase
      .from("documents")
      .update({
        processing_status: "error",
        updated_at: new Date().toISOString(),
      })
      .eq("id", documentId);

    return { success: false, error: (error as Error).message };
  }
}

/**
 * Upload metadata dokumen → extract content → generate embedding
 */
export async function uploadDocuments({
  user_id,
  agent_id,
  documents,
}: {
  user_id: string;
  agent_id: string;
  documents: { url: string; name: string; size: number; type: string }[];
}) {
  const supabase = await createServer();

  const res = await fetch(
    `https://n8n.ahmadfiqrioemry.com/webhook-test/d4c5a07f-b8ea-4475-97dd-6a6a4071d949`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, agent_id, documents }),
    }
  );
  return null;
  // try {
  //   // 1. Insert documents with status processing
  //   const { data: insertedDocs, error } = await supabase
  //     .from("documents")
  //     .insert(
  //       documents.map((doc) => ({
  //         name: doc.name,
  //         file_path: doc.url, // EdgeStore public URL
  //         file_type: doc.type,
  //         file_size: doc.size,
  //         user_id,
  //         agent_id,
  //         processing_status: "processing",
  //       }))
  //     )
  //     .select();

  //   if (error) throw new Error("DB Insert Error: " + error.message);

  //   // 2. Proses tiap dokumen → extract → embeddings
  //   for (const doc of insertedDocs) {
  //     try {
  //       let content = "";

  //       if (doc.file_type === "application/pdf") {
  //         content = await extractPdfText(doc.file_path);
  //       } else if (doc.file_type === "text/plain") {
  //         const res = await fetch(doc.file_path);
  //         content = await res.text();
  //       } else {
  //         console.warn(`⚠️ Extractor belum support untuk ${doc.file_type}`);
  //         content = "";
  //       }

  //       if (content.trim().length > 0) {
  //         await processDocumentEmbeddings(doc.id, agent_id, content);
  //       } else {
  //         throw new Error("Konten kosong setelah extract");
  //       }
  //     } catch (err) {
  //       console.error(`❌ Failed to process ${doc.name}:`, err);

  //       await supabase
  //         .from("documents")
  //         .update({ processing_status: "error" })
  //         .eq("id", doc.id);
  //     }
  //   }

  //   revalidatePath(`/dashboard/agents/${agent_id}`);

  //   return {
  //     success: true,
  //     message: "Documents uploaded & processed",
  //     data: insertedDocs,
  //   };
  // } catch (err: any) {
  //   return { success: false, error: err.message };
  // }
}

/**
 * Ambil semua dokumen per agent
 */
export const getDocumentsByAgent = async (agentId: string) => {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};
