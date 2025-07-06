import { trpc } from "@/lib/trpc/client";
import { useCallback } from "react";
import type {
  CreateNoteInput,
  UpdateNoteInput,
} from "@/server/services/note/schema";

export const useNotesTrpc = () => {
  const utils = trpc.useUtils();

  // Queries
  const {
    data: notes,
    isLoading: isLoadingNotes,
    error: notesError,
  } = trpc.note.getAll.useQuery({});

  const getNoteById = useCallback((id: string) => {
    return trpc.note.getById.useQuery({ id });
  }, []);

  const getRelatedNotes = useCallback((id: string) => {
    return trpc.note.getRelated.useQuery({ id });
  }, []);

  // Mutations
  const createNoteMutation = trpc.note.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch notes after creating
      utils.note.getAll.invalidate();
    },
  });

  const updateNoteMutation = trpc.note.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch notes after updating
      utils.note.getAll.invalidate();
    },
  });

  const deleteNoteMutation = trpc.note.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch notes after deleting
      utils.note.getAll.invalidate();
    },
  });

  const reorderNotesMutation = trpc.note.reorder.useMutation({
    onSuccess: () => {
      // Invalidate and refetch notes after reordering
      utils.note.getAll.invalidate();
    },
  });

  // Helper functions
  const createNote = useCallback(
    (input: CreateNoteInput) => {
      return createNoteMutation.mutate(input);
    },
    [createNoteMutation]
  );

  const updateNote = useCallback(
    (id: string, input: UpdateNoteInput) => {
      return updateNoteMutation.mutate({ id, ...input });
    },
    [updateNoteMutation]
  );

  const deleteNote = useCallback(
    (id: string) => {
      return deleteNoteMutation.mutate({ id });
    },
    [deleteNoteMutation]
  );

  const reorderNotes = useCallback(
    (noteOrders: { id: string; order: number }[]) => {
      return reorderNotesMutation.mutate({ noteOrders });
    },
    [reorderNotesMutation]
  );

  // Search notes with filters
  const useFilteredNotes = useCallback(
    (filters: { search?: string; tags?: string[]; folderId?: string }) => {
      return trpc.note.getAll.useQuery(filters);
    },
    []
  );

  return {
    // Data
    notes,
    isLoadingNotes,
    notesError,

    // Query functions
    getNoteById,
    getRelatedNotes,
    useFilteredNotes,

    // Mutations
    createNote,
    updateNote,
    deleteNote,
    reorderNotes,

    // Mutation states
    isCreatingNote: createNoteMutation.isPending,
    isUpdatingNote: updateNoteMutation.isPending,
    isDeletingNote: deleteNoteMutation.isPending,
    isReorderingNotes: reorderNotesMutation.isPending,

    // Utils for manual cache invalidation
    invalidateNotes: () => utils.note.getAll.invalidate(),
  };
};
