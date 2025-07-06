import { router, protectedProcedure } from "../trpc";
import { noteService } from "@/server/services/note";
import {
  createNoteSchema,
  updateNoteSchema,
  getNoteSchema,
  getNotesSchema,
  reorderNotesSchema,
  getRelatedNotesSchema,
} from "@/server/services/note/schema";

export const noteRouter = router({
  // Get all notes with optional filtering
  getAll: protectedProcedure
    .input(getNotesSchema)
    .query(async ({ input, ctx }) => {
      return await noteService.getNotes(input, ctx.auth.user.id);
    }),

  // Get a single note by ID
  getById: protectedProcedure
    .input(getNoteSchema)
    .query(async ({ input, ctx }) => {
      return await noteService.getNote(input, ctx.auth.user.id);
    }),

  // Create a new note
  create: protectedProcedure
    .input(createNoteSchema)
    .mutation(async ({ input, ctx }) => {
      return await noteService.createNote(input, ctx.auth.user.id);
    }),

  // Update an existing note
  update: protectedProcedure
    .input(updateNoteSchema.extend({ id: getNoteSchema.shape.id }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input;
      return await noteService.updateNote(id, updateData, ctx.auth.user.id);
    }),

  // Delete a note
  delete: protectedProcedure
    .input(getNoteSchema)
    .mutation(async ({ input, ctx }) => {
      return await noteService.deleteNote(input.id, ctx.auth.user.id);
    }),

  // Reorder notes
  reorder: protectedProcedure
    .input(reorderNotesSchema)
    .mutation(async ({ input, ctx }) => {
      return await noteService.reorderNotes(input, ctx.auth.user.id);
    }),

  // Get related notes using AI similarity
  getRelated: protectedProcedure
    .input(getRelatedNotesSchema)
    .query(async ({ input, ctx }) => {
      return await noteService.getRelatedNotes(input, ctx.auth.user.id);
    }),
});
