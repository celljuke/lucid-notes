import { router, protectedProcedure } from "../trpc";
import { tagsService } from "@/server/services/tags";
import { getTagsSchema } from "@/server/services/tags/schema";

export const tagsRouter = router({
  // Get all unique tags for the user
  getAll: protectedProcedure
    .input(getTagsSchema)
    .query(async ({ input, ctx }) => {
      return tagsService.getTags(input, ctx.auth.user.id);
    }),
});
