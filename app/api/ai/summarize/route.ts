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

    if (content.length < 100) {
      return Response.json(
        { error: "Content is too short to summarize" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Please provide a concise, clear summary of the following note content. Focus on the main points and key information. Keep it brief but comprehensive:

${content}

Summary:`,
      maxTokens: 200,
      temperature: 0.3,
    });

    success = true;

    // Track AI usage
    await trackAiUsage(session.user.id!, "summarize", success, noteId);

    return Response.json({ summary: text.trim() });
  } catch (error) {
    console.error("AI Summarize error:", error);

    // Track failed usage
    if (session?.user?.id) {
      await trackAiUsage(session.user.id, "summarize", success);
    }

    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
