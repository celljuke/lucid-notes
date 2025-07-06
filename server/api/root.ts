import { noteRouter } from "./routers/note";
import { folderRouter } from "./routers/folder";
import { aiRouter } from "./routers/ai";
import { analyticsRouter } from "./routers/analytics";
import { tagsRouter } from "./routers/tags";
import { authRouter } from "./routers/auth";
import { router } from "./trpc";

export const appRouter = router({
  note: noteRouter,
  folder: folderRouter,
  ai: aiRouter,
  analytics: analyticsRouter,
  tags: tagsRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
