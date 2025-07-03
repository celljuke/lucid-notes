"use client";

import { Plus, Search, Tag, Folder, Grid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotesGrid } from "./notes-grid";
import { NotesList } from "./notes-list";
import { NoteSidebar } from "./note-sidebar";
import { NoteEditor } from "./note-editor";
import { FolderManager } from "./folder-manager";
import { useNotesPage } from "../hooks/use-notes-page";

export function NotesPage() {
  const {
    // State
    search,
    setSearch,
    selectedTags,
    selectedFolderId,
    viewMode,
    setViewMode,
    isEditorOpen,
    selectedNoteId,
    isFolderManagerOpen,
    setIsFolderManagerOpen,

    // Data
    notes,
    folders,
    isLoading,
    foldersLoading,

    // Handlers
    handleCreateNote,
    handleEditNote,
    handleCloseEditor,
    handleTagClick,
    handleFolderSelect,
    handleDeleteNote,
    handleSaveNote,
  } = useNotesPage();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <NoteSidebar
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        onCreateFolder={() => setIsFolderManagerOpen(true)}
        selectedTags={selectedTags}
        onTagClick={handleTagClick}
        isLoading={foldersLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Button
              onClick={handleCreateNote}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        {(selectedTags.length > 0 || selectedFolderId) && (
          <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filters:</span>
            {selectedFolderId && (
              <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                <Folder className="h-3 w-3" />
                <span>
                  {folders.find((f) => f.id === selectedFolderId)?.name}
                </span>
                <button
                  onClick={() => handleFolderSelect(null)}
                  className="ml-1 hover:text-blue-900"
                >
                  ×
                </button>
              </div>
            )}
            {selectedTags.map((tag) => (
              <div
                key={tag}
                className="flex items-center space-x-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
              >
                <Tag className="h-3 w-3" />
                <span>{tag}</span>
                <button
                  onClick={() => handleTagClick(tag)}
                  className="ml-1 hover:text-purple-900"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

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
                Create your first note to get started organizing your thoughts
              </p>
              <Button
                onClick={handleCreateNote}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Note
              </Button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <NotesGrid
                  notes={notes}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTagClick={handleTagClick}
                />
              ) : (
                <NotesList
                  notes={notes}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTagClick={handleTagClick}
                />
              )}
            </>
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
