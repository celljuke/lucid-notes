"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TagPopularityData } from "../types";

interface TagPopularityChartProps {
  data?: TagPopularityData;
  isLoading: boolean;
}

export function TagPopularityChart({
  data,
  isLoading,
}: TagPopularityChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];

    // Get top 10 tags for better visualization
    return data.tags.slice(0, 10).map((tag) => ({
      tag: tag.tag,
      count: tag.count,
      percentage: tag.percentage,
    }));
  }, [data]);

  const chartConfig = {
    count: {
      label: "Usage Count",
      color: "var(--chart-2)",
    },
  };

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (!data || !chartData.length) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">No tag data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Horizontal Bar Chart */}
      <div className="h-[400px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                type="number"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="tag"
                className="text-xs"
                tick={{ fontSize: 12 }}
                width={70}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number) => [`${value} uses`, "Usage Count"]}
                labelFormatter={(tag: string) => `Tag: ${tag}`}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Tag Statistics */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {data.totalTags}
          </div>
          <div className="text-sm text-muted-foreground">Total Unique Tags</div>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {data.averageTagsPerNote.toFixed(1)}
          </div>
          <div className="text-sm text-muted-foreground">
            Average Tags per Note
          </div>
        </div>
      </div>

      {/* Top Tags List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">Top Tags</h4>
        <div className="flex flex-wrap gap-2">
          {chartData.slice(0, 5).map((tag) => (
            <div
              key={tag.tag}
              className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-full"
            >
              <span className="text-sm font-medium">#{tag.tag}</span>
              <span className="text-xs text-muted-foreground">
                {tag.count} uses
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
