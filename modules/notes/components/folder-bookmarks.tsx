"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Folder {
  id: string;
  name: string;
  color: string;
  _count?: { notes: number };
}

interface FolderBookmarksProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onDeleteFolder: (folderId: string) => void;
}

export function FolderBookmarks({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
}: FolderBookmarksProps) {
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);

  const confirmDeleteFolder = () => {
    if (deleteFolderId) {
      onDeleteFolder(deleteFolderId);
      setDeleteFolderId(null);
    }
  };

  return (
    <div className="flex items-center space-x-2 px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
      {/* All Notes Bookmark */}
      <motion.button
        onClick={() => onFolderSelect(null)}
        className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
          selectedFolderId === null
            ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="w-3 h-3 rounded-full bg-gray-400" />
        <span>All Notes</span>
      </motion.button>

      {/* Folder Bookmarks - Show first 5 only */}
      {folders.slice(0, 5).map((folder) => (
        <div key={folder.id} className="group relative">
          <motion.button
            onClick={() => onFolderSelect(folder.id)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all group-hover:pr-8 ${
              selectedFolderId === folder.id
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: folder.color }}
            />
            <span className="max-w-32 truncate">{folder.name}</span>
            {(folder._count?.notes ?? 0) > 0 && (
              <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs">
                {folder._count!.notes > 99 ? "99+" : folder._count!.notes}
              </Badge>
            )}
          </motion.button>

          {/* Delete button on hover */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteFolderId(folder.id);
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-3 h-3 text-white" />
          </motion.button>
        </div>
      ))}

      {/* Overflow Menu - Show remaining folders */}
      {folders.length > 5 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>+{folders.length - 5}</span>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {folders.slice(5).map((folder) => (
              <DropdownMenuItem
                key={folder.id}
                className="flex items-center justify-between p-2 group"
                asChild
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="flex items-center space-x-2 flex-1 cursor-pointer"
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span className="truncate">{folder.name}</span>
                    {(folder._count?.notes ?? 0) > 0 && (
                      <span className="text-xs text-gray-500">
                        {folder._count!.notes}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteFolderId(folder.id);
                    }}
                    className="ml-2 opacity-0 group-hover:opacity-100 w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-opacity"
                  >
                    <X className="w-2 h-2 text-white" />
                  </button>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Add Folder Button */}
      <motion.button
        onClick={onCreateFolder}
        className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-4 h-4" />
        <span>Add Folder</span>
      </motion.button>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteFolderId}
        onOpenChange={() => setDeleteFolderId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? Notes in this folder
              will not be deleted, but they will no longer be organized under
              this folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteFolder}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
