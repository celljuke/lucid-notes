import { trpc } from "@/lib/trpc/client";
import { useCallback } from "react";

export const useAiTrpc = () => {
  // Mutations
  const summarizeMutation = trpc.ai.summarize.useMutation();
  const expandMutation = trpc.ai.expand.useMutation();
  const generateTitleMutation = trpc.ai.generateTitle.useMutation();

  // Helper functions
  const summarizeNote = useCallback(
    async (content: string, noteId?: string): Promise<string | null> => {
      try {
        const result = await summarizeMutation.mutateAsync({ content, noteId });
        return result.summary;
      } catch (error) {
        console.error("Failed to summarize note:", error);
        return null;
      }
    },
    [summarizeMutation]
  );

  const expandShorthand = useCallback(
    async (shorthand: string, noteId?: string): Promise<string | null> => {
      try {
        const result = await expandMutation.mutateAsync({ shorthand, noteId });
        return result.expandedContent;
      } catch (error) {
        console.error("Failed to expand shorthand:", error);
        return null;
      }
    },
    [expandMutation]
  );

  const generateTitle = useCallback(
    async (content: string, noteId?: string): Promise<string | null> => {
      try {
        const result = await generateTitleMutation.mutateAsync({
          content,
          noteId,
        });
        return result.title;
      } catch (error) {
        console.error("Failed to generate title:", error);
        return null;
      }
    },
    [generateTitleMutation]
  );

  const clearError = useCallback(() => {
    summarizeMutation.reset();
    expandMutation.reset();
    generateTitleMutation.reset();
  }, [summarizeMutation, expandMutation, generateTitleMutation]);

  return {
    // Loading states
    isSummarizing: summarizeMutation.isPending,
    isExpanding: expandMutation.isPending,
    isGeneratingTitle: generateTitleMutation.isPending,

    // Error states
    error:
      summarizeMutation.error?.message ||
      expandMutation.error?.message ||
      generateTitleMutation.error?.message ||
      null,

    // Actions
    summarizeNote,
    expandShorthand,
    generateTitle,
    clearError,
  };
};
