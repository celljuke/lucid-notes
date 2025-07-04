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

    const { shorthand } = await request.json();

    if (!shorthand || typeof shorthand !== "string") {
      return Response.json(
        { error: "Shorthand text is required" },
        { status: 400 }
      );
    }

    if (shorthand.length < 10) {
      return Response.json(
        { error: "Shorthand is too short to expand" },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Expand the following shorthand notes into a well-structured, detailed note. Maintain the original meaning and add context, proper formatting, and clarity. Make it professional and easy to read:

Shorthand: ${shorthand}

Expanded Note:`,
      maxTokens: 500,
      temperature: 0.4,
    });

    return Response.json({ expandedContent: text.trim() });
  } catch (error) {
    console.error("AI Expand error:", error);
    return Response.json(
      { error: "Failed to expand shorthand" },
      { status: 500 }
    );
  }
}
