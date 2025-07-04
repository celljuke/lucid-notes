"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNotesStore } from "../store";
import { createFolderSchema, type CreateFolderData } from "../schema";
import { FOLDER_COLOR_OPTIONS } from "../types";

interface FolderManagerProps {
  folders: Array<{
    id: string;
    name: string;
    color: string;
    _count?: { notes: number };
  }>;
  open: boolean;
  onClose: () => void;
  onFolderCreated?: () => void;
  onFolderDeleted?: () => void;
}

export function FolderManager({
  folders,
  open,
  onClose,
  onFolderCreated,
  onFolderDeleted,
}: FolderManagerProps) {
  const [deleteFolderId, setDeleteFolderId] = useState<string | null>(null);
  const { createFolder, deleteFolder } = useNotesStore();

  const form = useForm<CreateFolderData>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      color: FOLDER_COLOR_OPTIONS[0].value,
    },
  });

  const onSubmit = async (data: CreateFolderData) => {
    try {
      await createFolder(data);
      form.reset();
      onClose();
      // Notify parent component to refresh folders
      onFolderCreated?.();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const confirmDeleteFolder = async () => {
    if (deleteFolderId) {
      try {
        await deleteFolder(deleteFolderId);
        setDeleteFolderId(null);
        // Notify parent component to refresh folders
        onFolderDeleted?.();
      } catch (error) {
        console.error("Failed to delete folder:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Folders</DialogTitle>
        </DialogHeader>

        {/* Create New Folder Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter folder name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {FOLDER_COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => field.onChange(color.value)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                            field.value === color.value
                              ? "border-gray-900 dark:border-white ring-2 ring-blue-500"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              Create Folder
            </Button>
          </form>
        </Form>

        {/* Existing Folders List */}
        {folders.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
              Existing Folders
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <div>
                      <span className="font-medium">{folder.name}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {folder._count?.notes || 0} notes
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteFolderId(folder.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>

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
    </Dialog>
  );
}
