"use client";

import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  Bot,
  Hash,
  RefreshCw,
  Clock,
  ChevronDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotesCreatedChart } from "./notes-created-chart";
import { AiUsageChart } from "./ai-usage-chart";
import { TagPopularityChart } from "./tag-popularity-chart";
import { useAnalytics } from "../hooks/use-analytics";

export function AnalyticsDashboard() {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [days, setDays] = useState(30);

  const { data, isLoading, error, refresh } = useAnalytics({ days, period });

  const handlePeriodChange = (newPeriod: "daily" | "weekly") => {
    setPeriod(newPeriod);
  };

  const handleDaysChange = (newDays: number) => {
    setDays(newDays);
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 mb-4">
          Error loading analytics: {error}
        </div>
        <Button onClick={refresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Insights into your note-taking patterns and AI usage
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Period Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                {days} days
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDaysChange(7)}>
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDaysChange(30)}>
                Last 30 days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDaysChange(90)}>
                Last 90 days
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Period Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {period === "daily" ? "Daily" : "Weekly"}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handlePeriodChange("daily")}>
                Daily View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePeriodChange("weekly")}>
                Weekly View
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data?.notesCreated.totalNotes || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <span
                    className={`${
                      (data?.notesCreated.growthRate || 0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {(data?.notesCreated.growthRate || 0) >= 0 ? "+" : ""}
                    {(data?.notesCreated.growthRate || 0).toFixed(1)}%
                  </span>
                  {" from last week"}
                </>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data?.notesCreated.thisWeek || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${data?.notesCreated.lastWeek || 0} last week`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Usage</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data?.aiUsage.totalUsage || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${((data?.aiUsage.successRate || 0) * 100).toFixed(
                    1
                  )}% success rate`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Tags</CardTitle>
            <Hash className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : data?.tagPopularity.totalTags || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Loading..."
                : `${data?.tagPopularity.averageTagsPerNote?.toFixed(
                    1
                  )} avg per note`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notes Created</CardTitle>
            <CardDescription>
              Track your note creation patterns over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NotesCreatedChart
              data={data?.notesCreated}
              period={period}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Feature Usage</CardTitle>
            <CardDescription>
              See how you&apos;re using AI features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AiUsageChart data={data?.aiUsage} isLoading={isLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Tag Popularity */}
      <Card>
        <CardHeader>
          <CardTitle>Tag Popularity</CardTitle>
          <CardDescription>
            Most frequently used tags in your notes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TagPopularityChart
            data={data?.tagPopularity}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
