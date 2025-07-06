import { useAiTrpc } from "@/modules/ai/hooks/use-ai-trpc";

interface UseAiActionsReturn {
  // Loading states
  isSummarizing: boolean;
  isExpanding: boolean;
  isGeneratingTitle: boolean;

  // Error states
  error: string | null;

  // Actions
  summarizeNote: (content: string, noteId?: string) => Promise<string | null>;
  expandShorthand: (
    shorthand: string,
    noteId?: string
  ) => Promise<string | null>;
  generateTitle: (content: string, noteId?: string) => Promise<string | null>;
  clearError: () => void;
}

export function useAiActions(): UseAiActionsReturn {
  // Use tRPC hooks instead of REST API
  const {
    isSummarizing,
    isExpanding,
    isGeneratingTitle,
    error,
    summarizeNote,
    expandShorthand,
    generateTitle,
    clearError,
  } = useAiTrpc();

  return {
    // Loading states
    isSummarizing,
    isExpanding,
    isGeneratingTitle,

    // Error state
    error,

    // Actions
    summarizeNote,
    expandShorthand,
    generateTitle,
    clearError,
  };
}
