"use client";

import { useAnalyticsTrpc } from "./use-analytics-trpc";

interface UseAnalyticsOptions {
  days?: number;
  period?: "daily" | "weekly";
  autoFetch?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { days = 30, period = "daily" } = options;

  // Use tRPC hooks instead of REST API
  const { data, isLoading, error, refresh, fetchAnalytics } = useAnalyticsTrpc({
    days,
    period,
  });

  // Note: autoFetch is handled automatically by tRPC queries

  return {
    data,
    isLoading,
    error,
    refresh,
    fetchAnalytics,
  };
}
