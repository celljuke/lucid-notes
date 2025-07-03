"use client";

import { Search, Edit, Trash2, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { NoteSidebar } from "./note-sidebar";
import { NoteEditor } from "./note-editor";
import { FolderManager } from "./folder-manager";
import { useNotesPage } from "../hooks/use-notes-page";

export function NotesPage() {
  const {
    // State
    search,
    setSearch,
    isEditorOpen,
    selectedNoteId,
    isFolderManagerOpen,
    setIsFolderManagerOpen,

    // Data
    notes,
    folders,
    isLoading,

    // Handlers
    handleCreateNoteWithColor,
    handleEditNote,
    handleCloseEditor,
    handleDeleteNote,
    handleSaveNote,
  } = useNotesPage();

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      {/* Minimal Sidebar */}
      <NoteSidebar onCreateNote={handleCreateNoteWithColor} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Search Bar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-none bg-gray-50 dark:bg-gray-900 focus:ring-0 focus:border-none"
            />
          </div>
        </div>

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
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note.id);
                        }}
                        className="w-7 h-7 bg-black/80 rounded-full flex items-center justify-center hover:bg-black/90"
                      >
                        <Edit className="w-3 h-3 text-white" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="w-7 h-7 bg-red-600/80 rounded-full flex items-center justify-center hover:bg-red-600/90"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                    </div>

                    {/* Pin indicator */}
                    {note.isPinned && (
                      <div className="absolute top-2 left-2">
                        <div className="w-6 h-6 bg-black/70 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        </div>
                      </div>
                    )}

                    {/* Note content */}
                    <div className="pr-8 flex-1 flex flex-col">
                      {note.title && (
                        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                          {note.title}
                        </h3>
                      )}
                      {note.content && (
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-6 flex-1">
                          {note.content}
                        </p>
                      )}

                      {/* Date at bottom */}
                      {note.createdAt && (
                        <div className="mt-auto pt-3 text-xs text-gray-600 font-medium">
                          {new Date(note.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
      />
    </div>
  );
}
