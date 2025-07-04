import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AnalyticsDashboard } from "@/modules/analytics/components/analytics-dashboard";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="overflow-y-auto">
      <div className="container mx-auto p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
