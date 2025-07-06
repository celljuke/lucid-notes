import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import type { GetTagsInput, TagsResponse } from "./schema";

export class TagsService {
  async getTags(input: GetTagsInput, userId: string): Promise<TagsResponse> {
    try {
      const notes = await prisma.note.findMany({
        where: {
          userId,
        },
        select: {
          tags: true,
        },
      });

      // Extract unique tags
      const allTags = notes.flatMap((note) => note.tags);
      const uniqueTags = [...new Set(allTags)].sort();

      return uniqueTags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch tags",
      });
    }
  }
}

export const tagsService = new TagsService();
