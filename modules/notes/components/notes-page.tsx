"use client";

import { useState } from "react";
import { Search, Star, Folder, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { motion } from "motion/react";
import { FolderBookmarks } from "./folder-bookmarks";
import { NoteEditor } from "./note-editor";
import { FolderManager } from "./folder-manager";
import { useNotesPage } from "../hooks/use-notes-page";

export function NotesPage() {
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const {
    // State
    search,
    setSearch,
    selectedFolderId,
    isEditorOpen,
    selectedNoteId,
    isFolderManagerOpen,
    setIsFolderManagerOpen,

    // Data
    notes,
    folders,
    isLoading,

    // Handlers
    handleEditNote,
    handleCloseEditor,
    handleDeleteNote,
    handleDeleteFolder,
    handleFolderSelect,
    handleSaveNote,
    fetchFolders,
  } = useNotesPage();

  const confirmDeleteNote = async () => {
    if (deleteNoteId) {
      await handleDeleteNote(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  return (
    <>
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
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">No notes yet</h3>
            <p className="text-center mb-6">
              Click the + button to create your first note
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-72"
              >
                <motion.div
                  className="rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 relative group h-full flex flex-col"
                  style={{ backgroundColor: note.color }}
                  onClick={() => handleEditNote(note.id)}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteNoteId(note.id);
                      }}
                      className="w-6 h-6 cursor-pointer flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </div>

                  {/* Pin indicator */}
                  {note.isPinned && (
                    <motion.div
                      className="absolute bottom-4 right-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      <div className="w-7 h-7 bg-amber-100/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-amber-200/50">
                        <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
                      </div>
                    </motion.div>
                  )}

                  {/* Note content */}
                  <div className="flex-1 flex flex-col pt-2">
                    {/* Top tags and folder */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Folder tag */}
                      {note.folder && (
                        <Badge
                          variant="secondary"
                          className="text-xs font-medium border-0 shadow-sm"
                          style={{
                            backgroundColor: `${note.folder.color}20`,
                            color: note.folder.color,
                            borderLeft: `3px solid ${note.folder.color}`,
                          }}
                        >
                          <Folder className="w-3 h-3 mr-1" />
                          {note.folder.name}
                        </Badge>
                      )}

                      {/* Tags */}
                      {note.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs font-normal bg-white/60 text-gray-600 border-gray-300/60 hover:bg-white/80 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-xs font-normal bg-white/60 text-gray-500 border-gray-300/60"
                        >
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Title and content */}
                    <div className="flex-1 flex flex-col">
                      {note.title && (
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                          {note.title}
                        </h3>
                      )}
                      {note.content && (
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">
                          {note.content}
                        </p>
                      )}
                    </div>

                    {/* Date at bottom */}
                    {note.createdAt && (
                      <div className="mt-auto pt-3 text-xs text-gray-500 font-medium">
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Note Editor Modal */}
      <NoteEditor
        noteId={selectedNoteId}
        folders={folders}
        open={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />

      {/* Folder Manager Modal */}
      <FolderManager
        folders={folders}
        open={isFolderManagerOpen}
        onClose={() => setIsFolderManagerOpen(false)}
        onFolderCreated={async () => {
          // Refresh folders to show newly created folder
          await fetchFolders();
        }}
        onFolderDeleted={async () => {
          // Refresh folders to remove deleted folder
          await fetchFolders();
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
    </>
  );
}
