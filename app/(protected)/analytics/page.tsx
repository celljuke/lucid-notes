import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AnalyticsPageContent } from "./analytics-content";

export default async function AnalyticsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <AnalyticsPageContent />;
}
