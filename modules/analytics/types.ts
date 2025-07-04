// Analytics Types
export interface AnalyticsData {
  notesCreated: NotesCreatedData;
  aiUsage: AiUsageData;
  tagPopularity: TagPopularityData;
}

export interface NotesCreatedData {
  daily: NotesCreatedPoint[];
  weekly: NotesCreatedPoint[];
  totalNotes: number;
  thisWeek: number;
  lastWeek: number;
  growthRate: number;
}

export interface NotesCreatedPoint {
  date: string;
  count: number;
  label: string;
}

export interface AiUsageData {
  totalUsage: number;
  byFeature: AiFeatureUsage[];
  dailyUsage: AiUsagePoint[];
  successRate: number;
}

export interface AiFeatureUsage {
  feature: string;
  count: number;
  percentage: number;
  successRate: number;
}

export interface AiUsagePoint {
  date: string;
  title: number;
  expand: number;
  summarize: number;
  total: number;
}

export interface TagPopularityData {
  tags: TagUsage[];
  totalTags: number;
  averageTagsPerNote: number;
}

export interface TagUsage {
  tag: string;
  count: number;
  percentage: number;
}

// API Response Types
export interface AnalyticsApiResponse {
  success: boolean;
  data: AnalyticsData;
  error?: string;
}

// Component Props
export interface AnalyticsOverviewProps {
  data: AnalyticsData;
  isLoading: boolean;
}

export interface NotesCreatedChartProps {
  data: NotesCreatedData;
  period: "daily" | "weekly";
}

export interface AiUsageChartProps {
  data: AiUsageData;
}

export interface TagPopularityChartProps {
  data: TagPopularityData;
}

// Date Range Types
export interface DateRange {
  from: Date;
  to: Date;
}

export interface AnalyticsFilters {
  dateRange?: DateRange;
  period: "daily" | "weekly";
}
