"use client";

import { useState } from "react";
import {
  AppSidebar,
  MobileMenuButton,
  MobileDrawerContent,
  MobileFloatingCreateButton,
} from "@/components/ui/app-sidebar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NoteEditor } from "@/modules/notes/components/note-editor";
import { useNotesStore } from "@/modules/notes/store";
import { useNotesTrpc } from "@/modules/notes/hooks/use-notes-trpc";
import { useFoldersTrpc } from "@/modules/folders/hooks/use-folders-trpc";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    // State
    isEditorOpen,
    selectedNoteId,
    setIsEditorOpen,
    setSelectedNoteId,
  } = useNotesStore();

  // Use tRPC for note and folder operations
  const { createNote, updateNote } = useNotesTrpc();
  const { folders } = useFoldersTrpc();

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNoteId(null);
  };

  const handleSaveNote = async (data: {
    title: string;
    content: string;
    tags: string[];
    folderId?: string;
    color: string;
    isPinned: boolean;
  }) => {
    try {
      if (selectedNoteId) {
        await updateNote(selectedNoteId, data);
      } else {
        await createNote(data);
      }
      // Folders automatically refresh with tRPC
    } catch (error) {
      console.error("Error saving note:", error);
      // Error handling is already done in the tRPC hooks
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-950">
      {/* Desktop Sidebar - unchanged */}
      <AppSidebar />

      {/* Mobile Sheet Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Lucid
            </SheetTitle>
          </SheetHeader>
          <MobileDrawerContent onClose={() => setIsMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <MobileMenuButton onOpenMenu={() => setIsMobileMenuOpen(true)} />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Lucid
          </h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>

      {/* Mobile Floating Create Button */}
      <MobileFloatingCreateButton />

      {/* Global Note Editor Modal */}
      <NoteEditor
        noteId={selectedNoteId}
        folders={folders}
        open={isEditorOpen}
        onClose={handleCloseEditor}
        onSave={handleSaveNote}
      />
    </div>
  );
}
