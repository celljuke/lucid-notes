import { noteRouter } from "./routers/note";
import { folderRouter } from "./routers/folder";
import { router } from "./trpc";

export const appRouter = router({
  note: noteRouter,
  folder: folderRouter,
});

export type AppRouter = typeof appRouter;
