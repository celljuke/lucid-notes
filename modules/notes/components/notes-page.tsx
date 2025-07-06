"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
import { FolderBookmarks } from "./folder-bookmarks";
import { FolderManager } from "./folder-manager";
import { SortableNotesGrid } from "./sortable-notes-grid";
import { useNotesStore } from "../store";
import { useNotesTrpc } from "../hooks/use-notes-trpc";
import { useFoldersTrpc } from "@/modules/folders/hooks/use-folders-trpc";
import type { Note } from "../types";

export function NotesPage() {
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const {
    // UI State from store
    search,
    setSearch,
    selectedFolderId,
    isFolderManagerOpen,
    setIsFolderManagerOpen,
    setIsEditorOpen,
    setSelectedNoteId,
    setSelectedFolderId,
  } = useNotesStore();

  // Use tRPC hooks for folder operations
  const { folders, deleteFolder } = useFoldersTrpc();

  // Use tRPC hooks for note operations
  const { notes, isLoadingNotes, deleteNote, reorderNotes, useFilteredNotes } =
    useNotesTrpc();

  // Get filtered notes based on search and selectedFolderId
  const { data: filteredNotes, isLoading: isLoadingFiltered } =
    useFilteredNotes({
      search: search || undefined,
      folderId: selectedFolderId || undefined,
    });

  // Use filtered notes if available, otherwise fall back to all notes
  const displayNotes = (filteredNotes || notes || []) as Note[];
  const isLoading = isLoadingFiltered || isLoadingNotes;

  // Handlers
  const handleEditNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    // Folders automatically refresh with tRPC
  };

  const handleDeleteFolder = async (folderId: string) => {
    await deleteFolder(folderId);
    // If the deleted folder was selected, switch to "All Notes"
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const confirmDeleteNote = async () => {
    if (deleteNoteId) {
      await handleDeleteNote(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-3 border-b border-gray-100 dark:border-gray-800">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 border-none bg-background focus:ring-0 focus:border-none ring-0 shadow-none"
          />
        </div>
      </div>

      {/* Folder Bookmarks */}
      <FolderBookmarks
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        onCreateFolder={() => setIsFolderManagerOpen(true)}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* Notes Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading notes...</div>
          </div>
        ) : displayNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-center mb-6">
              Click the + button to create your first note
            </p>
          </div>
        ) : (
          <SortableNotesGrid
            notes={displayNotes}
            onEdit={handleEditNote}
            onDelete={(noteId) => setDeleteNoteId(noteId)}
            onReorder={reorderNotes}
          />
        )}
      </div>

      {/* Folder Manager Modal */}
      <FolderManager
        folders={folders}
        open={isFolderManagerOpen}
        onClose={() => setIsFolderManagerOpen(false)}
        onFolderCreated={() => {
          // Folders automatically refresh with tRPC
        }}
        onFolderDeleted={() => {
          // Folders automatically refresh with tRPC
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteNoteId}
        onOpenChange={() => setDeleteNoteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteNote}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
