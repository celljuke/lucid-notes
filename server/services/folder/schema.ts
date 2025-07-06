import { z } from "zod";

// Base folder schema
export const folderSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  _count: z
    .object({
      notes: z.number(),
    })
    .optional(),
});

// Input schemas for mutations
export const createFolderSchema = z.object({
  name: z.string().min(1).max(100),
  color: z.string().default("#4F46E5"),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  color: z.string().optional(),
});

// Query schemas
export const getFolderSchema = z.object({
  id: z.string(),
});

export const getFoldersSchema = z.object({
  // No input needed for getting all folders
});

// Response types
export type Folder = z.infer<typeof folderSchema>;
export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
export type GetFolderInput = z.infer<typeof getFolderSchema>;
export type GetFoldersInput = z.infer<typeof getFoldersSchema>;
