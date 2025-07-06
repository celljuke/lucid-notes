import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";
import type {
  CreateFolderInput,
  UpdateFolderInput,
  GetFolderInput,
  GetFoldersInput,
} from "./schema";

export class FolderService {
  async getFolders(input: GetFoldersInput, userId: string) {
    try {
      const folders = await prisma.folder.findMany({
        where: {
          userId,
        },
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return folders;
    } catch (error) {
      console.error("Error fetching folders:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch folders",
      });
    }
  }

  async getFolder(input: GetFolderInput, userId: string) {
    try {
      const folder = await prisma.folder.findFirst({
        where: {
          id: input.id,
          userId,
        },
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      return folder;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error fetching folder:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch folder",
      });
    }
  }

  async createFolder(input: CreateFolderInput, userId: string) {
    try {
      const folder = await prisma.folder.create({
        data: {
          ...input,
          userId,
        },
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });

      return folder;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create folder",
      });
    }
  }

  async updateFolder(id: string, input: UpdateFolderInput, userId: string) {
    try {
      const folder = await prisma.folder.findFirst({
        where: { id, userId },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      const updatedFolder = await prisma.folder.update({
        where: { id },
        data: input,
        include: {
          _count: {
            select: {
              notes: true,
            },
          },
        },
      });

      return updatedFolder;
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error updating folder:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to update folder",
      });
    }
  }

  async deleteFolder(id: string, userId: string) {
    try {
      const folder = await prisma.folder.findFirst({
        where: { id, userId },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      await prisma.folder.delete({
        where: { id },
      });

      return { message: "Folder deleted successfully" };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      console.error("Error deleting folder:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete folder",
      });
    }
  }
}

export const folderService = new FolderService();
