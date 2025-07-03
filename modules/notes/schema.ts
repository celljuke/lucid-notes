import { z } from "zod";

// Note Schemas
export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  content: z.string(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  folderId: z.string().optional().or(z.literal("")),
  color: z.string(),
  isPinned: z.boolean(),
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required").optional(),
  folderId: z.string().optional(),
  color: z.string().optional(),
  isPinned: z.boolean().optional(),
});

// Folder Schemas
export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(50, "Name must be less than 50 characters"),
  color: z.string(),
});

export const updateFolderSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(50, "Name must be less than 50 characters")
    .optional(),
  color: z.string().optional(),
});

// Search and Filter Schemas
export const notesSearchSchema = z.object({
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  folderId: z.string().optional(),
});

// API Parameter Schemas
export const noteIdSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
});

export const folderIdSchema = z.object({
  id: z.string().min(1, "Folder ID is required"),
});

// Query Parameter Schemas
export const notesQuerySchema = z.object({
  search: z.string().optional(),
  tags: z
    .string()
    .optional()
    .transform((str) => (str ? str.split(",").filter(Boolean) : undefined)),
  folderId: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 20)),
});

export const foldersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((str) => (str ? parseInt(str, 10) : 50)),
});

// Validation Schemas for Color Options
export const noteColorSchema = z.enum([
  "#FFE066", // Yellow
  "#FF8A65", // Orange
  "#F06292", // Pink
  "#BA68C8", // Purple
  "#4FC3F7", // Blue
  "#66BB6A", // Green
  "#26A69A", // Teal
  "#90A4AE", // Gray
]);

export const folderColorSchema = z.enum([
  "#4F46E5", // Blue
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
]);

// Tag Validation
export const tagSchema = z
  .string()
  .min(1, "Tag cannot be empty")
  .max(30, "Tag must be less than 30 characters")
  .regex(
    /^[a-zA-Z0-9\s-_]+$/,
    "Tag can only contain letters, numbers, spaces, hyphens, and underscores"
  );

// Refined Schemas with additional validation
export const createNoteSchemaRefined = createNoteSchema
  .refine((data) => data.tags.length <= 10, {
    message: "Maximum 10 tags allowed",
    path: ["tags"],
  })
  .refine(
    (data) => data.tags.every((tag) => tagSchema.safeParse(tag).success),
    {
      message: "Invalid tag format",
      path: ["tags"],
    }
  )
  .refine((data) => noteColorSchema.safeParse(data.color).success, {
    message: "Invalid note color",
    path: ["color"],
  });

export const createFolderSchemaRefined = createFolderSchema.refine(
  (data) => folderColorSchema.safeParse(data.color).success,
  {
    message: "Invalid folder color",
    path: ["color"],
  }
);

// Type inference from schemas
export type CreateNoteData = z.infer<typeof createNoteSchema>;
export type UpdateNoteData = z.infer<typeof updateNoteSchema>;
export type CreateFolderData = z.infer<typeof createFolderSchema>;
export type UpdateFolderData = z.infer<typeof updateFolderSchema>;
export type NotesSearchParams = z.infer<typeof notesSearchSchema>;
export type NotesQueryParams = z.infer<typeof notesQuerySchema>;
export type FoldersQueryParams = z.infer<typeof foldersQuerySchema>;
export type NoteColor = z.infer<typeof noteColorSchema>;
export type FolderColor = z.infer<typeof folderColorSchema>;
export type Tag = z.infer<typeof tagSchema>;
