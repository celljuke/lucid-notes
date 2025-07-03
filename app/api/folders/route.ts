import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().default("#4F46E5"),
});

const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const folders = await prisma.folder.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
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
    const validatedData = createFolderSchema.parse(body);

    const folder = await prisma.folder.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            notes: true,
          },
        },
      },
    });

    return NextResponse.json(folder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Error creating folder:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
