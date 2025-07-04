"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AiUsageData } from "../types";

interface AiUsageChartProps {
  data?: AiUsageData;
  isLoading: boolean;
}

export function AiUsageChart({ data, isLoading }: AiUsageChartProps) {
  const pieData = useMemo(() => {
    if (!data) return [];
    return data.byFeature.map((item) => ({
      name: item.feature,
      value: item.count,
      percentage: item.percentage,
    }));
  }, [data]);

  const lineData = useMemo(() => {
    if (!data) return [];
    return data.dailyUsage.slice(-14); // Last 14 days
  }, [data]);

  const chartConfig = {
    title: {
      label: "Title Generation",
      color: "hsl(var(--chart-1))",
    },
    expand: {
      label: "Text Expansion",
      color: "hsl(var(--chart-2))",
    },
    summarize: {
      label: "Summarization",
      color: "hsl(var(--chart-3))",
    },
  };

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
  ];

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  if (!data || !pieData.length) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-muted-foreground">No AI usage data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Feature Usage Distribution */}
      <div className="h-[200px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value} uses`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Feature Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {pieData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm capitalize">{item.name}</span>
            <span className="text-xs text-muted-foreground">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      {/* Recent Daily Usage */}
      <div className="h-[200px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fontSize: 10 }}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <YAxis className="text-xs" tick={{ fontSize: 10 }} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="title"
                stroke="var(--color-title)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="expand"
                stroke="var(--color-expand)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="summarize"
                stroke="var(--color-summarize)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
