import { z } from "zod";

// Input schemas for AI operations
export const summarizeSchema = z.object({
  content: z
    .string()
    .min(100, "Content must be at least 100 characters long to summarize"),
  noteId: z.string().optional(),
});

export const expandSchema = z.object({
  shorthand: z
    .string()
    .min(10, "Shorthand must be at least 10 characters long to expand"),
  noteId: z.string().optional(),
});

export const generateTitleSchema = z.object({
  content: z
    .string()
    .min(20, "Content must be at least 20 characters long to generate title"),
  noteId: z.string().optional(),
});

// Response schemas
export const summarizeResponseSchema = z.object({
  summary: z.string(),
});

export const expandResponseSchema = z.object({
  expandedContent: z.string(),
});

export const generateTitleResponseSchema = z.object({
  title: z.string(),
});

// Response types
export type SummarizeInput = z.infer<typeof summarizeSchema>;
export type ExpandInput = z.infer<typeof expandSchema>;
export type GenerateTitleInput = z.infer<typeof generateTitleSchema>;
export type SummarizeResponse = z.infer<typeof summarizeResponseSchema>;
export type ExpandResponse = z.infer<typeof expandResponseSchema>;
export type GenerateTitleResponse = z.infer<typeof generateTitleResponseSchema>;
