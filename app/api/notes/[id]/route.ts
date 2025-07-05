import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { generateEmbedding, prepareTextForEmbedding } from "@/lib/embeddings";

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
  folderId: z.string().optional(),
  color: z.string().optional(),
  isPinned: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        folder: true,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = updateNoteSchema.parse(body);

    const note = await prisma.note.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Generate new embedding if title or content changed
    let dataToUpdate: typeof validatedData & { embedding?: number[] } = {
      ...validatedData,
    };
    if (
      validatedData.title !== undefined ||
      validatedData.content !== undefined
    ) {
      try {
        const newTitle = validatedData.title ?? note.title;
        const newContent = validatedData.content ?? note.content;
        const textForEmbedding = prepareTextForEmbedding(newTitle, newContent);
        const embedding = await generateEmbedding(textForEmbedding);
        dataToUpdate = { ...dataToUpdate, embedding };
      } catch (error) {
        console.error("Failed to generate embedding:", error);
        // Continue without updating embedding
      }
    }

    const updatedNote = await prisma.note.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
      include: {
        folder: true,
      },
    });

    return NextResponse.json(updatedNote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await prisma.note.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
