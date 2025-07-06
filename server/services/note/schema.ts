import { z } from "zod";

// Base note schema
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  color: z.string(),
  isPinned: z.boolean(),
  order: z.number(),
  folderId: z.string().nullable(),
  userId: z.string(),
  embedding: z.array(z.number()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Input schemas for mutations
export const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  folderId: z.string().optional(),
  color: z.string().default("#FFE066"),
});

export const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
  folderId: z.string().optional(),
  color: z.string().optional(),
  isPinned: z.boolean().optional(),
});

// Query schemas
export const getNoteSchema = z.object({
  id: z.string(),
});

export const getNotesSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
});

export const reorderNotesSchema = z.object({
  noteOrders: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

export const getRelatedNotesSchema = z.object({
  id: z.string(),
});

// Response types
export type Note = z.infer<typeof noteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type GetNoteInput = z.infer<typeof getNoteSchema>;
export type GetNotesInput = z.infer<typeof getNotesSchema>;
export type ReorderNotesInput = z.infer<typeof reorderNotesSchema>;
export type GetRelatedNotesInput = z.infer<typeof getRelatedNotesSchema>;
