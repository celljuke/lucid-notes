import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/modules/analytics/components/analytics-dashboard";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto min-h-0">
        <div className="container mx-auto p-6">
          <AnalyticsDashboard />
        </div>
      </div>
    </div>
  );
}
