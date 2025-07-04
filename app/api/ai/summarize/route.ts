import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { auth } from "@/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

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

    return Response.json({ summary: text.trim() });
  } catch (error) {
    console.error("AI Summarize error:", error);
    return Response.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
