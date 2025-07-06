import { z } from "zod";

// Input schema for getting tags
export const getTagsSchema = z.object({
  // No input needed for getting all unique tags
});

// Response schema
export const tagsResponseSchema = z.array(z.string());

// Response types
export type GetTagsInput = z.infer<typeof getTagsSchema>;
export type TagsResponse = z.infer<typeof tagsResponseSchema>;
