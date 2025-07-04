import { openai } from "@ai-sdk/openai";
import { embed } from "ai";

/**
 * Generate embeddings for note content using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Combine title and content for better semantic understanding
    const cleanText = text.trim().replace(/\s+/g, " ");

    if (!cleanText) {
      throw new Error("Text cannot be empty");
    }

    const { embedding } = await embed({
      model: openai.textEmbeddingModel("text-embedding-3-small"),
      value: cleanText,
    });

    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dotProduct / (normA * normB);
}

/**
 * Prepare text for embedding by combining title and content
 */
export function prepareTextForEmbedding(
  title: string,
  content: string
): string {
  // Combine title and content with proper weighting
  // Give more weight to title as it's usually more focused
  const titleWeight = 2;
  const combinedText = `${title} `.repeat(titleWeight) + content;

  // Limit text length to avoid token limits (approximately 8000 tokens max)
  const maxLength = 6000;
  return combinedText.length > maxLength
    ? combinedText.substring(0, maxLength) + "..."
    : combinedText;
}

/**
 * Find similar notes by comparing embeddings
 */
export function findSimilarNotes(
  targetEmbedding: number[],
  notes: Array<{
    id: string;
    embedding: number[];
    title: string;
    content: string;
    tags: string[];
  }>,
  threshold: number = 0.5,
  limit: number = 5
): Array<{
  id: string;
  title: string;
  content: string;
  tags: string[];
  similarity: number;
}> {
  const similarities = notes
    .map((note) => ({
      ...note,
      similarity: cosineSimilarity(targetEmbedding, note.embedding),
    }))
    .filter((note) => note.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarities;
}
