import { router, protectedProcedure } from "../trpc";
import { analyticsService } from "@/server/services/analytics";
import { getAnalyticsSchema } from "@/server/services/analytics/schema";

export const analyticsRouter = router({
  // Get comprehensive analytics data
  get: protectedProcedure
    .input(getAnalyticsSchema)
    .query(async ({ input, ctx }) => {
      return analyticsService.getAnalytics(input, ctx.auth.user.id);
    }),
});
