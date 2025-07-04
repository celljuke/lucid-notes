import { useState } from "react";

interface UseAiActionsReturn {
  // Loading states
  isSummarizing: boolean;
  isExpanding: boolean;
  isGeneratingTitle: boolean;

  // Error states
  error: string | null;

  // Actions
  summarizeNote: (content: string) => Promise<string | null>;
  expandShorthand: (shorthand: string) => Promise<string | null>;
  generateTitle: (content: string) => Promise<string | null>;
  clearError: () => void;
}

export function useAiActions(): UseAiActionsReturn {
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const summarizeNote = async (content: string): Promise<string | null> => {
    if (!content || content.length < 100) {
      setError("Content must be at least 100 characters long to summarize");
      return null;
    }

    setIsSummarizing(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to summarize note");
      }

      return data.summary;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to summarize note";
      setError(errorMessage);
      return null;
    } finally {
      setIsSummarizing(false);
    }
  };

  const expandShorthand = async (shorthand: string): Promise<string | null> => {
    if (!shorthand || shorthand.length < 10) {
      setError("Shorthand must be at least 10 characters long to expand");
      return null;
    }

    setIsExpanding(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/expand", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shorthand }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to expand shorthand");
      }

      return data.expandedContent;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to expand shorthand";
      setError(errorMessage);
      return null;
    } finally {
      setIsExpanding(false);
    }
  };

  const generateTitle = async (content: string): Promise<string | null> => {
    if (!content || content.length < 20) {
      setError("Content must be at least 20 characters long to generate title");
      return null;
    }

    setIsGeneratingTitle(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/title", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate title");
      }

      return data.title;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate title";
      setError(errorMessage);
      return null;
    } finally {
      setIsGeneratingTitle(false);
    }
  };

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
