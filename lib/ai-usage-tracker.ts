import { prisma } from "@/lib/prisma";

export async function trackAiUsage(
  userId: string,
  feature: "title" | "expand" | "summarize",
  success: boolean,
  noteId?: string
) {
  try {
    await prisma.aiUsage.create({
      data: {
        userId,
        feature,
        success,
        noteId,
      },
    });
  } catch (error) {
    // Log error but don't throw to avoid breaking the main AI functionality
    console.error("Failed to track AI usage:", error);
  }
}
