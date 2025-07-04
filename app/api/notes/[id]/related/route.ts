import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { findSimilarNotes } from "@/lib/embeddings";
import { trackAiUsage } from "@/lib/ai-usage-tracker";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let success = false;
  const session = await auth();

  try {
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Get the target note
    const targetNote = await prisma.note.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!targetNote) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Check if target note has embedding
    if (!targetNote.embedding || targetNote.embedding.length === 0) {
      return NextResponse.json(
        {
          error:
            "Note embedding not available. Please update the note to generate embeddings.",
        },
        { status: 400 }
      );
    }

    // Get all other notes for this user that have embeddings
    const allNotes = await prisma.note.findMany({
      where: {
        userId: session.user.id,
        id: { not: id }, // Exclude the target note
        NOT: {
          embedding: { equals: [] }, // Only notes with embeddings
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        embedding: true,
        color: true,
        createdAt: true,
        updatedAt: true,
        folder: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
      },
    });

    // Find similar notes
    const similarNotes = findSimilarNotes(
      targetNote.embedding,
      allNotes,
      0.3, // Lower threshold for more results
      8 // Limit to 8 related notes
    );

    // Format response
    const relatedNotes = similarNotes.map((note) => {
      const noteData = allNotes.find((n) => n.id === note.id);
      return {
        id: note.id,
        title: note.title,
        content:
          note.content.substring(0, 200) +
          (note.content.length > 200 ? "..." : ""),
        tags: note.tags,
        similarity: Math.round(note.similarity * 100) / 100, // Round to 2 decimal places
        color: noteData?.color || "#FFE066",
        createdAt: noteData?.createdAt,
        updatedAt: noteData?.updatedAt,
        folder: noteData?.folder,
      };
    });

    success = true;

    // Track AI usage for similarity search
    await trackAiUsage(session.user.id, "similarity", success, id);

    return NextResponse.json({
      relatedNotes,
      totalFound: relatedNotes.length,
    });
  } catch (error) {
    console.error("Error finding related notes:", error);

    // Track failed usage
    if (session?.user?.id) {
      await trackAiUsage(session.user.id, "similarity", success);
    }

    return NextResponse.json(
      { error: "Failed to find related notes" },
      { status: 500 }
    );
  }
}
