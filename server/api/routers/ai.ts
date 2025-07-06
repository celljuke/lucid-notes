import { router, protectedProcedure } from "../trpc";
import { aiService } from "@/server/services/ai";
import {
  summarizeSchema,
  expandSchema,
  generateTitleSchema,
} from "@/server/services/ai/schema";

export const aiRouter = router({
  // Summarize note content
  summarize: protectedProcedure
    .input(summarizeSchema)
    .mutation(async ({ input, ctx }) => {
      return aiService.summarize(input, ctx.auth.user.id);
    }),

  // Expand shorthand notes
  expand: protectedProcedure
    .input(expandSchema)
    .mutation(async ({ input, ctx }) => {
      return aiService.expand(input, ctx.auth.user.id);
    }),

  // Generate title from content
  generateTitle: protectedProcedure
    .input(generateTitleSchema)
    .mutation(async ({ input, ctx }) => {
      return aiService.generateTitle(input, ctx.auth.user.id);
    }),
});
