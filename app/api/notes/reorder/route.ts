import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reorderNotesSchema = z.object({
  noteOrders: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = reorderNotesSchema.parse(body);

    // Update all notes with their new order positions
    const updatePromises = validatedData.noteOrders.map(({ id, order }) =>
      prisma.note.updateMany({
        where: {
          id,
          userId: session.user?.id, // Ensure user owns the note
        },
        data: {
          order,
        },
      })
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error reordering notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
