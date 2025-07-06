import { trpc } from "@/lib/trpc/client";

export const useTagsTrpc = () => {
  // Query for all tags
  const tagsQuery = trpc.tags.getAll.useQuery({});

  return {
    // Data
    tags: tagsQuery.data || [],

    // Loading states
    isLoading: tagsQuery.isLoading,

    // Error states
    error: tagsQuery.error?.message || null,

    // Actions
    refetch: tagsQuery.refetch,

    // Query state
    isSuccess: tagsQuery.isSuccess,
    isError: tagsQuery.isError,
  };
};
