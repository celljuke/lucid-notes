import { trpc } from "@/lib/trpc/client";
import { useCallback } from "react";

interface UseAnalyticsTrpcOptions {
  days?: number;
  period?: "daily" | "weekly";
}

export const useAnalyticsTrpc = (options: UseAnalyticsTrpcOptions = {}) => {
  const { days = 30, period = "daily" } = options;

  // Query
  const analyticsQuery = trpc.analytics.get.useQuery({
    days,
    period,
  });

  // Helper functions
  const refresh = useCallback(() => {
    analyticsQuery.refetch();
  }, [analyticsQuery]);

  const fetchAnalytics = useCallback(() => {
    analyticsQuery.refetch();
  }, [analyticsQuery]);

  return {
    // Data
    data: analyticsQuery.data || null,

    // Loading states
    isLoading: analyticsQuery.isLoading,

    // Error states
    error: analyticsQuery.error?.message || null,

    // Actions
    refresh,
    fetchAnalytics,

    // Query utilities
    refetch: analyticsQuery.refetch,
    invalidate: () => {
      // Future: Add invalidation logic if needed
    },
  };
};
