import { trpc } from "@/lib/trpc/client";
import { useCallback } from "react";

export const useFoldersTrpc = () => {
  const utils = trpc.useUtils();

  // Queries
  const foldersQuery = trpc.folder.getAll.useQuery({});
  const getFolderQuery = useCallback(
    (id: string) => trpc.folder.getById.useQuery({ id }),
    []
  );

  // Mutations
  const createFolderMutation = trpc.folder.create.useMutation({
    onSuccess: () => {
      // Invalidate and refetch folders
      utils.folder.getAll.invalidate();
    },
  });

  const updateFolderMutation = trpc.folder.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch folders
      utils.folder.getAll.invalidate();
    },
  });

  const deleteFolderMutation = trpc.folder.delete.useMutation({
    onSuccess: () => {
      // Invalidate and refetch folders
      utils.folder.getAll.invalidate();
    },
  });

  // Helper functions
  const createFolder = useCallback(
    (input: { name: string; color?: string }) => {
      return createFolderMutation.mutateAsync(input);
    },
    [createFolderMutation]
  );

  const updateFolder = useCallback(
    (id: string, data: { name?: string; color?: string }) => {
      return updateFolderMutation.mutateAsync({ id, data });
    },
    [updateFolderMutation]
  );

  const deleteFolder = useCallback(
    (id: string) => {
      return deleteFolderMutation.mutateAsync({ id });
    },
    [deleteFolderMutation]
  );

  return {
    // Queries
    folders: foldersQuery.data ?? [],
    foldersLoading: foldersQuery.isLoading,
    foldersError: foldersQuery.error,
    refetchFolders: foldersQuery.refetch,
    getFolderQuery,

    // Mutations
    createFolder,
    updateFolder,
    deleteFolder,

    // Loading states
    isCreating: createFolderMutation.isPending,
    isUpdating: updateFolderMutation.isPending,
    isDeleting: deleteFolderMutation.isPending,

    // Error states
    createError: createFolderMutation.error,
    updateError: updateFolderMutation.error,
    deleteError: deleteFolderMutation.error,
  };
};
