import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { trackAiUsage } from "@/lib/ai-usage-tracker";

export async function POST(request: NextRequest) {
  let success = false;
  const session = await auth();

  try {
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content, noteId } = await request.json();

    if (!content || typeof content !== "string") {
      return Response.json({ error: "Content is required" }, { status: 400 });
    }

    if (content.length < 20) {
      return Response.json(
        { error: "Content is too short to generate title" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a clear, concise, and descriptive title for the following note content. The title should capture the main topic or purpose of the note. Keep it under 60 characters:

Content: ${content}

Title:`,
      maxTokens: 50,
      temperature: 0.3,
    });

    // Clean up the title (remove quotes, extra spaces, etc.)
    const cleanTitle = text.trim().replace(/^["']|["']$/g, "");

    success = true;

    // Track AI usage
    await trackAiUsage(session.user.id!, "title", success, noteId);

    return Response.json({ title: cleanTitle });
  } catch (error) {
    console.error("AI Title error:", error);

    // Track failed usage
    if (session?.user?.id) {
      await trackAiUsage(session.user.id, "title", success);
    }

    return Response.json(
      { error: "Failed to generate title" },
      { status: 500 }
    );
  }
}
