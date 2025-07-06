import { noteRouter } from "./routers/note";
import { router } from "./trpc";

export const appRouter = router({
  note: noteRouter,
});

export type AppRouter = typeof appRouter;
