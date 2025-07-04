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
import { NotesCreatedData } from "../types";

interface NotesCreatedChartProps {
  data?: NotesCreatedData;
  period: "daily" | "weekly";
  isLoading: boolean;
}

export function NotesCreatedChart({
  data,
  period,
  isLoading,
}: NotesCreatedChartProps) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return period === "daily" ? data.daily : data.weekly;
  }, [data, period]);

  const chartConfig = {
    count: {
      label: "Notes Created",
      color: "hsl(var(--chart-1))",
    },
  };

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">No data available</div>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="label"
            className="text-xs"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis className="text-xs" tick={{ fontSize: 12 }} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
