"use client";

import { useState, useEffect, useCallback } from "react";
import { AnalyticsData, AnalyticsApiResponse } from "../types";

interface UseAnalyticsOptions {
  days?: number;
  period?: "daily" | "weekly";
  autoFetch?: boolean;
}

export function useAnalytics(options: UseAnalyticsOptions = {}) {
  const { days = 30, period = "daily", autoFetch = true } = options;

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        days: days.toString(),
        period,
      });

      const response = await fetch(`/api/analytics?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch analytics data");
      }

      const result: AnalyticsApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch analytics data");
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [days, period]);

  useEffect(() => {
    if (autoFetch) {
      fetchAnalytics();
    }
  }, [fetchAnalytics, autoFetch]);

  const refresh = useCallback(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    refresh,
    fetchAnalytics,
  };
}
