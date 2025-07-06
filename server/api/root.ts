import { noteRouter } from "./routers/note";
import { folderRouter } from "./routers/folder";
import { aiRouter } from "./routers/ai";
import { analyticsRouter } from "./routers/analytics";
import { router } from "./trpc";

export const appRouter = router({
  note: noteRouter,
  folder: folderRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
