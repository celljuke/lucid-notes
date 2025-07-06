import { z } from "zod";

// Input schema for analytics query
export const getAnalyticsSchema = z.object({
  days: z.number().min(1).max(365).default(30),
  period: z.enum(["daily", "weekly"]).default("daily"),
});

// Response schemas
export const notesCreatedPointSchema = z.object({
  date: z.string(),
  count: z.number(),
  label: z.string(),
});

export const notesCreatedDataSchema = z.object({
  daily: z.array(notesCreatedPointSchema),
  weekly: z.array(notesCreatedPointSchema),
  totalNotes: z.number(),
  thisWeek: z.number(),
  lastWeek: z.number(),
  growthRate: z.number(),
});

export const aiFeatureUsageSchema = z.object({
  feature: z.string(),
  count: z.number(),
  percentage: z.number(),
  successRate: z.number(),
});

export const aiUsagePointSchema = z.object({
  date: z.string(),
  title: z.number(),
  expand: z.number(),
  summarize: z.number(),
  total: z.number(),
});

export const aiUsageDataSchema = z.object({
  totalUsage: z.number(),
  byFeature: z.array(aiFeatureUsageSchema),
  dailyUsage: z.array(aiUsagePointSchema),
  successRate: z.number(),
});

export const tagUsageSchema = z.object({
  tag: z.string(),
  count: z.number(),
  percentage: z.number(),
});

export const tagPopularityDataSchema = z.object({
  tags: z.array(tagUsageSchema),
  totalTags: z.number(),
  averageTagsPerNote: z.number(),
});

export const analyticsDataSchema = z.object({
  notesCreated: notesCreatedDataSchema,
  aiUsage: aiUsageDataSchema,
  tagPopularity: tagPopularityDataSchema,
});

// Response types
export type GetAnalyticsInput = z.infer<typeof getAnalyticsSchema>;
export type NotesCreatedPoint = z.infer<typeof notesCreatedPointSchema>;
export type NotesCreatedData = z.infer<typeof notesCreatedDataSchema>;
export type AiFeatureUsage = z.infer<typeof aiFeatureUsageSchema>;
export type AiUsagePoint = z.infer<typeof aiUsagePointSchema>;
export type AiUsageData = z.infer<typeof aiUsageDataSchema>;
export type TagUsage = z.infer<typeof tagUsageSchema>;
export type TagPopularityData = z.infer<typeof tagPopularityDataSchema>;
export type AnalyticsData = z.infer<typeof analyticsDataSchema>;
