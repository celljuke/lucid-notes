import { noteRouter } from "./routers/note";
import { folderRouter } from "./routers/folder";
import { aiRouter } from "./routers/ai";
import { router } from "./trpc";

export const appRouter = router({
  note: noteRouter,
  folder: folderRouter,
  ai: aiRouter,
});

export type AppRouter = typeof appRouter;
