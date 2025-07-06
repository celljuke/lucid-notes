import { prisma } from "@/lib/prisma";
import {
  generateEmbedding,
  prepareTextForEmbedding,
  findSimilarNotes,
} from "@/lib/embeddings";
import { trackAiUsage } from "@/lib/ai-usage-tracker";
import { TRPCError } from "@trpc/server";
import type {
  CreateNoteInput,
  UpdateNoteInput,
  GetNotesInput,
  GetNoteInput,
  ReorderNotesInput,
  GetRelatedNotesInput,
} from "./schema";

export class NoteService {
  async getNotes(input: GetNotesInput, userId: string) {
    try {
      // Build where clause dynamically
      const where: {
        userId: string;
        OR?: Array<{
          title?: { contains: string; mode: "insensitive" };
          content?: { contains: string; mode: "insensitive" };
          tags?: { hasSome: string[] };
        }>;
        tags?: { hasSome: string[] };
        folderId?: string;
      } = {
        userId,
      };

      if (input.search) {
        where.OR = [
          { title: { contains: input.search, mode: "insensitive" } },
          { content: { contains: input.search, mode: "insensitive" } },
          { tags: { hasSome: [input.search] } },
        ];
      }

      if (input.tags && input.tags.length > 0) {
        where.tags = { hasSome: input.tags };
      }

      if (input.folderId) {
        where.folderId = input.folderId;
      }

      const notes = await prisma.note.findMany({
        where,
        include: {
          folder: true,
        },
        orderBy: [
          { isPinned: "desc" },
          { order: "asc" },
          { updatedAt: "desc" },
        ],
      });

      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch notes",
      });
    }
  }

  async getNote(input: GetNoteInput, userId: string) {
    try {
      const note = await prisma.note.findFirst({
        where: {
          id: input.id,
          userId,
        },
        include: {
          folder: true,
        },
      });

      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      return note;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch note",
      });
    }
  }

  async createNote(input: CreateNoteInput, userId: string) {
    try {
      // Generate embedding for the note
      let embedding: number[] = [];
      try {
        const textForEmbedding = prepareTextForEmbedding(
          input.title,
          input.content
        );
        embedding = await generateEmbedding(textForEmbedding);
      } catch (error) {
        console.error("Failed to generate embedding:", error);
        // Continue without embedding - it can be generated later
      }

      // Get the highest order value for the user's notes to assign the new note
      const maxOrderNote = await prisma.note.findFirst({
        where: { userId },
        orderBy: { order: "desc" },
        select: { order: true },
      });

      const nextOrder = (maxOrderNote?.order || 0) + 1;

      const note = await prisma.note.create({
        data: {
          ...input,
          userId,
          order: nextOrder,
          embedding,
        },
        include: {
          folder: true,
        },
      });

      return note;
    } catch (error) {
      console.error("Error creating note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create note",
      });
    }
  }

  async updateNote(id: string, input: UpdateNoteInput, userId: string) {
    try {
      const note = await prisma.note.findFirst({
        where: { id, userId },
      });

      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      // Generate new embedding if title or content changed
      let dataToUpdate: typeof input & { embedding?: number[] } = { ...input };

      if (input.title !== undefined || input.content !== undefined) {
        try {
          const newTitle = input.title ?? note.title;
          const newContent = input.content ?? note.content;
          const textForEmbedding = prepareTextForEmbedding(
            newTitle,
            newContent
          );
          const embedding = await generateEmbedding(textForEmbedding);
          dataToUpdate = { ...dataToUpdate, embedding };
        } catch (error) {
          console.error("Failed to generate embedding:", error);
          // Continue without updating embedding
        }
      }

      const updatedNote = await prisma.note.update({
        where: { id },
        data: dataToUpdate,
        include: {
          folder: true,
        },
      });

      return updatedNote;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error updating note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update note",
      });
    }
  }

  async deleteNote(id: string, userId: string) {
    try {
      const note = await prisma.note.findFirst({
        where: { id, userId },
      });

      if (!note) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      await prisma.note.delete({
        where: { id },
      });

      return { message: "Note deleted successfully" };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error deleting note:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete note",
      });
    }
  }

  async reorderNotes(input: ReorderNotesInput, userId: string) {
    try {
      // Update all notes with their new order positions
      const updatePromises = input.noteOrders.map(({ id, order }) =>
        prisma.note.updateMany({
          where: {
            id,
            userId, // Ensure user owns the note
          },
          data: {
            order,
          },
        })
      );

      await Promise.all(updatePromises);

      return { success: true };
    } catch (error) {
      console.error("Error reordering notes:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to reorder notes",
      });
    }
  }

  async getRelatedNotes(input: GetRelatedNotesInput, userId: string) {
    let success = false;

    try {
      // Get the target note
      const targetNote = await prisma.note.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });

      if (!targetNote) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Note not found",
        });
      }

      // Check if target note has embedding
      if (!targetNote.embedding || targetNote.embedding.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Note embedding not available. Please update the note to generate embeddings.",
        });
      }

      // Get all other notes for this user that have embeddings
      const allNotes = await prisma.note.findMany({
        where: {
          userId,
          id: { not: input.id }, // Exclude the target note
          NOT: {
            embedding: { equals: [] }, // Only notes with embeddings
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          tags: true,
          embedding: true,
          color: true,
          createdAt: true,
          updatedAt: true,
          folder: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });

      // Find similar notes
      const similarNotes = findSimilarNotes(
        targetNote.embedding,
        allNotes,
        0.3, // Lower threshold for more results
        8 // Limit to 8 related notes
      );

      // Format response
      const relatedNotes = similarNotes.map((note) => {
        const noteData = allNotes.find((n) => n.id === note.id);
        return {
          id: note.id,
          title: note.title,
          content:
            note.content.substring(0, 200) +
            (note.content.length > 200 ? "..." : ""),
          tags: note.tags,
          similarity: Math.round(note.similarity * 100) / 100, // Round to 2 decimal places
          color: noteData?.color || "#FFE066",
          createdAt: noteData?.createdAt,
          updatedAt: noteData?.updatedAt,
          folder: noteData?.folder,
        };
      });

      success = true;

      // Track AI usage for similarity search
      await trackAiUsage(userId, "similarity", success, input.id);

      return {
        relatedNotes,
        totalFound: relatedNotes.length,
      };
    } catch (error) {
      console.error("Error finding related notes:", error);

      // Track failed usage
      await trackAiUsage(userId, "similarity", success);

      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to find related notes",
      });
    }
  }
}

export const noteService = new NoteService();
