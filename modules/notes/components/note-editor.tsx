"use client";

import { useState, useEffect } from "react";
import { Save, Tag, Pin, Sparkles, FileText, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RelatedNotes } from "./related-notes";
import { MarkdownEditor } from "./markdown-editor";
import { Badge } from "@/components/ui/badge";

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
  const [relatedNotesCount, setRelatedNotesCount] = useState(0);

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

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    // Submit form on Ctrl+Enter or Cmd+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    // Submit form on Enter in title field (single line input)
    if (e.key === "Enter") {
      e.preventDefault();
      form.handleSubmit(handleSubmit)();
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
      <DialogContent
        className="!w-[95vw] !max-w-4xl !h-[95vh] !max-h-[95vh] flex flex-col !p-0 gap-0"
        onKeyDown={handleFormKeyDown}
      >
        <DialogHeader className="flex-shrink-0 p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {noteId ? "Edit Note" : "Create New Note"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-full flex flex-col lg:flex-row overflow-y-auto lg:overflow-y-visible"
              >
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col p-4 lg:p-6 lg:pr-4 lg:overflow-y-auto">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="mb-4 lg:mb-6">
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Title *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter note title..."
                            onKeyDown={handleTitleKeyDown}
                            className="h-10 lg:h-auto text-base lg:text-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Content Area with MarkdownEditor */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col mb-4 lg:mb-6">
                        <FormControl>
                          <MarkdownEditor
                            title="Description"
                            placeholder="Write your note content here... (Supports Markdown)"
                            initialValue={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Related Notes for existing notes */}
                  {noteId && !isLoading && (
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Related Notes
                        </h3>
                        {relatedNotesCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {relatedNotesCount}
                          </Badge>
                        )}
                      </div>
                      <RelatedNotes
                        noteId={noteId}
                        onCountChange={setRelatedNotesCount}
                      />
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l bg-gray-50 dark:bg-gray-900/50 p-4 lg:p-6 lg:overflow-y-auto lg:flex-initial">
                  <div className="space-y-4 lg:space-y-6">
                    {/* AI Actions */}
                    <div className="space-y-3">
                      <h3 className="text-base lg:text-sm font-semibold text-gray-900 dark:text-white">
                        AI Actions
                      </h3>
                      {aiError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">{aiError}</p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={clearError}
                            className="text-red-600 hover:text-red-700 text-xs mt-1 p-0 h-auto"
                          >
                            Clear Error
                          </Button>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-1 gap-2 lg:space-y-2 lg:gap-0">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleGenerateTitle}
                          disabled={isGeneratingTitle || !hasContent}
                          className="w-full justify-start h-10 lg:h-auto"
                        >
                          <Lightbulb className="h-4 w-4 mr-2" />
                          {isGeneratingTitle ? "Generating..." : "Auto Title"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleExpand}
                          disabled={isExpanding || !hasContent}
                          className="w-full justify-start h-10 lg:h-auto"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {isExpanding ? "Expanding..." : "Expand Text"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleSummarize}
                          disabled={isSummarizing || !hasContent}
                          className="w-full justify-start h-10 lg:h-auto"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isSummarizing ? "Summarizing..." : "Summarize"}
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base lg:text-sm font-semibold text-gray-900 dark:text-white">
                            Tags *
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                <Input
                                  value={tagInput}
                                  onChange={(e) => setTagInput(e.target.value)}
                                  onKeyDown={handleTagKeyDown}
                                  placeholder="Add a tag..."
                                  className="flex-1 h-10 lg:h-8 text-base lg:text-sm"
                                />
                                <Button
                                  type="button"
                                  onClick={handleAddTag}
                                  variant="outline"
                                  size="sm"
                                  className="h-10 lg:h-8 px-3 lg:px-2"
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {field.value.map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                  >
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveTag(tag)}
                                      className="ml-1 text-blue-600 hover:text-blue-800"
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
                          <FormLabel className="text-base lg:text-sm font-semibold text-gray-900 dark:text-white">
                            Folder
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger className="h-10 lg:h-8 text-base lg:text-sm">
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
                          <FormLabel className="text-base lg:text-sm font-semibold text-gray-900 dark:text-white">
                            Color
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-3 lg:gap-2 flex-wrap">
                              {NOTE_COLOR_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => field.onChange(option.value)}
                                  className={`w-8 h-8 lg:w-6 lg:h-6 rounded-full border-2 transition-all hover:scale-110 ${
                                    field.value === option.value
                                      ? "border-gray-800 dark:border-gray-200"
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
                          <div className="flex items-center space-x-3 lg:space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 lg:w-4 lg:h-4"
                              />
                            </FormControl>
                            <FormLabel className="flex items-center space-x-2 lg:space-x-1 cursor-pointer text-base lg:text-sm">
                              <Pin className="h-5 w-5 lg:h-4 lg:w-4" />
                              <span>Pin this note</span>
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </form>
            </Form>
          </div>
        )}

        <DialogFooter className="flex-shrink-0 p-4 border-t">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-3 lg:gap-0">
            <p className="text-xs text-gray-500 hidden lg:block">
              Press{" "}
              <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                Cmd+Enter
              </kbd>{" "}
              to save
            </p>
            <div className="flex gap-2 w-full lg:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 lg:flex-none h-10 lg:h-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving || isLoading}
                onClick={form.handleSubmit(handleSubmit)}
                className="flex-1 lg:flex-none h-10 lg:h-auto"
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
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
