import { router, protectedProcedure } from "../trpc";
import { folderService } from "@/server/services/folder";
import {
  createFolderSchema,
  updateFolderSchema,
  getFolderSchema,
  getFoldersSchema,
} from "@/server/services/folder/schema";
import { z } from "zod";

export const folderRouter = router({
  // Get all folders
  getAll: protectedProcedure
    .input(getFoldersSchema)
    .query(async ({ input, ctx }) => {
      return folderService.getFolders(input, ctx.auth.user.id);
    }),

  // Get single folder by ID
  getById: protectedProcedure
    .input(getFolderSchema)
    .query(async ({ input, ctx }) => {
      return folderService.getFolder(input, ctx.auth.user.id);
    }),

  // Create new folder
  create: protectedProcedure
    .input(createFolderSchema)
    .mutation(async ({ input, ctx }) => {
      return folderService.createFolder(input, ctx.auth.user.id);
    }),

  // Update folder
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        data: updateFolderSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      return folderService.updateFolder(input.id, input.data, ctx.auth.user.id);
    }),

  // Delete folder
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return folderService.deleteFolder(input.id, ctx.auth.user.id);
    }),
});
