"use client";

import { useState, useEffect } from "react";
import { Save, Tag, Pin, Sparkles, FileText, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Note,
  NoteEditorProps,
  CreateNoteData,
  NOTE_COLOR_OPTIONS,
} from "@/modules/notes/types";
import { createNoteSchema } from "@/modules/notes/schema";
import { useAiActions } from "@/modules/notes/hooks/use-ai-actions";

type NoteFormData = CreateNoteData;

export function NoteEditor({
  noteId,
  folders,
  open,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const {
    isSummarizing,
    isExpanding,
    isGeneratingTitle,
    error: aiError,
    summarizeNote,
    expandShorthand,
    generateTitle,
    clearError,
  } = useAiActions();

  const form = useForm<NoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      folderId: undefined,
      color: "#FFE066",
      isPinned: false,
    },
  });

  useEffect(() => {
    if (noteId && open) {
      setIsLoading(true);
      fetch(`/api/notes/${noteId}`)
        .then((res) => res.json())
        .then((note: Note) => {
          form.reset({
            title: note.title,
            content: note.content,
            tags: note.tags,
            folderId: note.folderId || undefined,
            color: note.color,
            isPinned: note.isPinned,
          });
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    } else if (!noteId && open) {
      form.reset({
        title: "",
        content: "",
        tags: [],
        folderId: undefined,
        color: "#FFE066",
        isPinned: false,
      });
    }
  }, [noteId, open, form]);

  const handleAddTag = () => {
    const currentTags = form.getValues("tags");
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = async (data: NoteFormData) => {
    setIsSaving(true);

    try {
      const saveData = {
        ...data,
        folderId: data.folderId || undefined,
      };

      await onSave(saveData);
      onClose();
    } catch (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSummarize = async () => {
    const content = form.getValues("content");
    const summary = await summarizeNote(content, noteId || undefined);
    if (summary) {
      form.setValue("content", summary);
    }
  };

  const handleExpand = async () => {
    const content = form.getValues("content");
    const expanded = await expandShorthand(content, noteId || undefined);
    if (expanded) {
      form.setValue("content", expanded);
    }
  };

  const handleGenerateTitle = async () => {
    const content = form.getValues("content");
    const title = await generateTitle(content, noteId || undefined);
    if (title) {
      form.setValue("title", title);
    }
  };

  const hasContent = form.watch("content");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{noteId ? "Edit Note" : "Create New Note"}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter note title..."
                        className="text-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your note content here..."
                        rows={8}
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* AI Actions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    AI Actions
                  </h3>
                  {aiError && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearError}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      Clear Error
                    </Button>
                  )}
                </div>

                {aiError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{aiError}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateTitle}
                    disabled={isGeneratingTitle || !hasContent}
                    className="flex items-center space-x-2"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>
                      {isGeneratingTitle ? "Generating..." : "Auto Title"}
                    </span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleExpand}
                    disabled={isExpanding || !hasContent}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>{isExpanding ? "Expanding..." : "Expand Text"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSummarize}
                    disabled={isSummarizing || !hasContent}
                    className="flex items-center space-x-2"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>
                      {isSummarizing ? "Summarizing..." : "Summarize"}
                    </span>
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags * (Required)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Add a tag..."
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            onClick={handleAddTag}
                            variant="outline"
                          >
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {field.value.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Folder */}
              <FormField
                control={form.control}
                name="folderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Folder (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a folder..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {folders.map((folder) => (
                          <SelectItem key={folder.id} value={folder.id}>
                            {folder.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        {NOTE_COLOR_OPTIONS.map((option) => (
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

              {/* Pin */}
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="flex items-center space-x-1 cursor-pointer">
                        <Pin className="h-4 w-4" />
                        <span>Pin this note</span>
                      </FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        )}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving || isLoading}
            onClick={form.handleSubmit(handleSubmit)}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
