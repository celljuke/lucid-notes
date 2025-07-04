import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import { AnalyticsData } from "@/modules/analytics/types";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const endDate = new Date();
    const startDate = subDays(endDate, days);

    // Get notes created data
    const notesCreatedData = await getNotesCreatedData(
      session.user.id,
      startDate,
      endDate
    );

    // Get AI usage data
    const aiUsageData = await getAiUsageData(
      session.user.id,
      startDate,
      endDate
    );

    // Get tag popularity data
    const tagPopularityData = await getTagPopularityData(session.user.id);

    const analyticsData: AnalyticsData = {
      notesCreated: notesCreatedData,
      aiUsage: aiUsageData,
      tagPopularity: tagPopularityData,
    };

    return NextResponse.json({
      success: true,
      data: analyticsData,
    });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getNotesCreatedData(
  userId: string,
  startDate: Date,
  endDate: Date
) {
  const notes = await prisma.note.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Get total notes count
  const totalNotes = await prisma.note.count({
    where: { userId },
  });

  // Get this week and last week counts
  const thisWeekStart = startOfWeek(new Date());
  const thisWeekEnd = endOfWeek(new Date());
  const lastWeekStart = startOfWeek(subDays(new Date(), 7));
  const lastWeekEnd = endOfWeek(subDays(new Date(), 7));

  const thisWeekCount = await prisma.note.count({
    where: {
      userId,
      createdAt: {
        gte: thisWeekStart,
        lte: thisWeekEnd,
      },
    },
  });

  const lastWeekCount = await prisma.note.count({
    where: {
      userId,
      createdAt: {
        gte: lastWeekStart,
        lte: lastWeekEnd,
      },
    },
  });

  const growthRate =
    lastWeekCount === 0
      ? 100
      : ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;

  // Process daily/weekly data
  const dailyData = new Map<string, number>();
  const weeklyData = new Map<string, number>();

  notes.forEach((note) => {
    const date = new Date(note.createdAt);
    const dayKey = format(date, "yyyy-MM-dd");
    const weekKey = format(startOfWeek(date), "yyyy-MM-dd");

    dailyData.set(dayKey, (dailyData.get(dayKey) || 0) + 1);
    weeklyData.set(weekKey, (weeklyData.get(weekKey) || 0) + 1);
  });

  // Fill in missing days/weeks with 0
  const daily = [];
  const weekly = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayKey = format(d, "yyyy-MM-dd");
    daily.push({
      date: dayKey,
      count: dailyData.get(dayKey) || 0,
      label: format(d, "MMM dd"),
    });
  }

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 7)) {
    const weekKey = format(startOfWeek(d), "yyyy-MM-dd");
    weekly.push({
      date: weekKey,
      count: weeklyData.get(weekKey) || 0,
      label: `Week of ${format(startOfWeek(d), "MMM dd")}`,
    });
  }

  return {
    daily,
    weekly,
    totalNotes,
    thisWeek: thisWeekCount,
    lastWeek: lastWeekCount,
    growthRate,
  };
}

async function getAiUsageData(userId: string, startDate: Date, endDate: Date) {
  // Get all AI usage records for the user in the date range
  const aiUsageRecords = await prisma.aiUsage.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Calculate feature usage statistics
  const featureStats = new Map<string, { total: number; successful: number }>();

  aiUsageRecords.forEach((record) => {
    const current = featureStats.get(record.feature) || {
      total: 0,
      successful: 0,
    };
    current.total += 1;
    if (record.success) {
      current.successful += 1;
    }
    featureStats.set(record.feature, current);
  });

  const totalUsage = aiUsageRecords.length;
  const totalSuccessful = aiUsageRecords.filter(
    (record) => record.success
  ).length;
  const overallSuccessRate = totalUsage > 0 ? totalSuccessful / totalUsage : 0;

  const byFeature = Array.from(featureStats.entries()).map(
    ([feature, stats]) => ({
      feature,
      count: stats.total,
      percentage: totalUsage > 0 ? (stats.total / totalUsage) * 100 : 0,
      successRate: stats.total > 0 ? stats.successful / stats.total : 0,
    })
  );

  // Generate daily usage data
  const dailyUsageMap = new Map<
    string,
    { title: number; expand: number; summarize: number; total: number }
  >();

  // Initialize all days with zero counts
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayKey = format(d, "yyyy-MM-dd");
    dailyUsageMap.set(dayKey, { title: 0, expand: 0, summarize: 0, total: 0 });
  }

  // Fill in actual usage data
  aiUsageRecords.forEach((record) => {
    const dayKey = format(new Date(record.createdAt), "yyyy-MM-dd");
    const dayData = dailyUsageMap.get(dayKey);
    if (dayData) {
      dayData[record.feature as keyof typeof dayData] += 1;
      dayData.total += 1;
    }
  });

  const dailyUsage = Array.from(dailyUsageMap.entries()).map(
    ([date, data]) => ({
      date,
      ...data,
    })
  );

  return {
    totalUsage,
    byFeature,
    dailyUsage,
    successRate: overallSuccessRate,
  };
}

async function getTagPopularityData(userId: string) {
  const notes = await prisma.note.findMany({
    where: { userId },
    select: { tags: true },
  });

  const tagCounts = new Map<string, number>();
  let totalTagInstances = 0;

  notes.forEach((note) => {
    note.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      totalTagInstances++;
    });
  });

  const tags = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({
      tag,
      count,
      percentage: (count / totalTagInstances) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 tags

  return {
    tags,
    totalTags: tagCounts.size,
    averageTagsPerNote: notes.length > 0 ? totalTagInstances / notes.length : 0,
  };
}
