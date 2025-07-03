"use client";

import { useState } from "react";
import { Save, Plus, Edit, Trash2, Folder as FolderIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useFolders } from "@/modules/notes/hooks/use-folders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Folder,
  FolderManagerProps,
  CreateFolderData,
  FOLDER_COLOR_OPTIONS,
} from "@/modules/notes/types";
import { createFolderSchema } from "@/modules/notes/schema";

type FolderFormData = CreateFolderData;

export function FolderManager({ folders, open, onClose }: FolderManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { createFolder, updateFolder, deleteFolder } = useFolders();

  const form = useForm<FolderFormData>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      color: "#4F46E5",
    },
  });

  const handleCreateFolder = async (data: FolderFormData) => {
    try {
      await createFolder(data);
      form.reset();
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder");
    }
  };

  const handleUpdateFolder = async (data: FolderFormData) => {
    if (!editingId) return;

    try {
      await updateFolder(editingId, data);
      form.reset();
      setEditingId(null);
    } catch (error) {
      console.error("Error updating folder:", error);
      alert("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (
      confirm(
        "Are you sure? All notes in this folder will be moved to 'No Folder'."
      )
    ) {
      try {
        await deleteFolder(folderId);
      } catch (error) {
        console.error("Error deleting folder:", error);
        alert("Failed to delete folder");
      }
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingId(folder.id);
    form.reset({
      name: folder.name,
      color: folder.color,
    });
    setIsCreating(false);
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    form.reset({
      name: "",
      color: "#4F46E5",
    });
  };

  const cancelEditing = () => {
    setIsCreating(false);
    setEditingId(null);
    form.reset();
  };

  const isEditing = isCreating || editingId !== null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Folders</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create/Edit Form */}
          {isEditing && (
            <Card>
              <CardContent className="p-4">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(
                      editingId ? handleUpdateFolder : handleCreateFolder
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Folder Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter folder name..."
                              {...field}
                            />
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
                            <div className="flex gap-2">
                              {FOLDER_COLOR_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => field.onChange(option.value)}
                                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                                    field.value === option.value
                                      ? "border-gray-800"
                                      : "border-gray-300"
                                  }`}
                                  style={{ backgroundColor: option.value }}
                                  title={option.name}
                                />
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Save className="h-4 w-4 mr-2" />
                        {editingId ? "Update" : "Create"} Folder
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}

          {/* Create Button */}
          {!isEditing && (
            <Button onClick={startCreating} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create New Folder
            </Button>
          )}

          {/* Existing Folders */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">
              Existing Folders
            </h3>
            {folders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No folders created yet
              </p>
            ) : (
              <div className="space-y-2">
                {folders.map((folder) => (
                  <Card key={folder.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: folder.color }}
                          />
                          <div className="flex items-center space-x-2">
                            <FolderIcon className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{folder.name}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEditing(folder)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
