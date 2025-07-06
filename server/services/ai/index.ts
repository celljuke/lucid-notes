import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { TRPCError } from "@trpc/server";
import { trackAiUsage } from "@/lib/ai-usage-tracker";
import type {
  SummarizeInput,
  ExpandInput,
  GenerateTitleInput,
  SummarizeResponse,
  ExpandResponse,
  GenerateTitleResponse,
} from "./schema";

export class AiService {
  async summarize(
    input: SummarizeInput,
    userId: string
  ): Promise<SummarizeResponse> {
    let success = false;

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Please provide a concise, clear summary of the following note content. Focus on the main points and key information. Keep it brief but comprehensive:

${input.content}

Summary:`,
        maxTokens: 200,
        temperature: 0.3,
      });

      success = true;

      // Track AI usage
      await trackAiUsage(userId, "summarize", success, input.noteId);

      return { summary: text.trim() };
    } catch (error) {
      console.error("AI Summarize error:", error);

      // Track failed usage
      await trackAiUsage(userId, "summarize", success);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate summary",
      });
    }
  }

  async expand(input: ExpandInput, userId: string): Promise<ExpandResponse> {
    let success = false;

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Expand the following shorthand notes into a well-structured, detailed note. Maintain the original meaning and add context, proper formatting, and clarity. Make it professional and easy to read:

Shorthand: ${input.shorthand}

Expanded Note:`,
        maxTokens: 500,
        temperature: 0.4,
      });

      success = true;

      // Track AI usage
      await trackAiUsage(userId, "expand", success, input.noteId);

      return { expandedContent: text.trim() };
    } catch (error) {
      console.error("AI Expand error:", error);

      // Track failed usage
      await trackAiUsage(userId, "expand", success);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to expand shorthand",
      });
    }
  }

  async generateTitle(
    input: GenerateTitleInput,
    userId: string
  ): Promise<GenerateTitleResponse> {
    let success = false;

    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        prompt: `Generate a clear, concise, and descriptive title for the following note content. The title should capture the main topic or purpose of the note. Keep it under 60 characters:

Content: ${input.content}

Title:`,
        maxTokens: 50,
        temperature: 0.3,
      });

      // Clean up the title (remove quotes, extra spaces, etc.)
      const cleanTitle = text.trim().replace(/^["']|["']$/g, "");

      success = true;

      // Track AI usage
      await trackAiUsage(userId, "title", success, input.noteId);

      return { title: cleanTitle };
    } catch (error) {
      console.error("AI Title error:", error);

      // Track failed usage
      await trackAiUsage(userId, "title", success);

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to generate title",
      });
    }
  }
}

export const aiService = new AiService();
