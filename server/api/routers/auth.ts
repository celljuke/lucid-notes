import { router, publicProcedure } from "../trpc";
import { authService } from "@/server/services/auth";
import { signUpInputSchema } from "@/server/services/auth/schema";

export const authRouter = router({
  // User signup (public procedure - no authentication required)
  signUp: publicProcedure
    .input(signUpInputSchema)
    .mutation(async ({ input }) => {
      return authService.signUp(input);
    }),
});
