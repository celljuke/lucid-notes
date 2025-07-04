import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateEmbedding, prepareTextForEmbedding } from "@/lib/embeddings";

const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  folderId: z.string().optional(),
  color: z.string().default("#FFE066"),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const tags = searchParams.get("tags")?.split(",").filter(Boolean);
    const folderId = searchParams.get("folderId");

    // Build where clause dynamically
    const where: {
      userId: string;
      OR?: Array<{
        title?: { contains: string; mode: "insensitive" };
        content?: { contains: string; mode: "insensitive" };
        tags?: { hasSome: string[] };
      }>;
      tags?: { hasSome: string[] };
      folderId?: string;
    } = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { hasSome: [search] } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    if (folderId) {
      where.folderId = folderId;
    }

    const notes = await prisma.note.findMany({
      where,
      include: {
        folder: true,
      },
      orderBy: [{ isPinned: "desc" }, { updatedAt: "desc" }],
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createNoteSchema.parse(body);

    // Generate embedding for the note
    let embedding: number[] = [];
    try {
      const textForEmbedding = prepareTextForEmbedding(
        validatedData.title,
        validatedData.content
      );
      embedding = await generateEmbedding(textForEmbedding);
    } catch (error) {
      console.error("Failed to generate embedding:", error);
      // Continue without embedding - it can be generated later
    }

    const note = await prisma.note.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        embedding,
      },
      include: {
        folder: true,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
