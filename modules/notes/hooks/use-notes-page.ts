import { useState, useEffect } from "react";
import { useNotes } from "./use-notes";
import { useFolders } from "./use-folders";

export function useNotesPage() {
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isFolderManagerOpen, setIsFolderManagerOpen] = useState(false);

  const { notes, isLoading, searchNotes, createNote, updateNote, deleteNote } =
    useNotes();
  const {
    folders,
    isLoading: foldersLoading,
    deleteFolder,
    fetchFolders,
  } = useFolders();

  useEffect(() => {
    searchNotes({ search, tags: selectedTags, folderId: selectedFolderId });
  }, [search, selectedTags, selectedFolderId, searchNotes]);

  const handleCreateNote = () => {
    setSelectedNoteId(null);
    setIsEditorOpen(true);
  };

  const handleCreateNoteWithColor = (color: string) => {
    createNote({
      title: "Untitled Note",
      content: "",
      tags: ["new"],
      color,
      folderId: selectedFolderId || undefined,
    });
  };

  const handleEditNote = (noteId: string) => {
    setSelectedNoteId(noteId);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedNoteId(null);
  };

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFolderSelect = (folderId: string | null) => {
    setSelectedFolderId(folderId);
  };

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId);
    // Refresh folders to update note counts on badges
    await fetchFolders();
  };

  const handleDeleteFolder = async (folderId: string) => {
    await deleteFolder(folderId);
    // If the deleted folder was selected, switch to "All Notes"
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  const handleSaveNote = async (data: {
    title: string;
    content: string;
    tags: string[];
    folderId?: string;
    color: string;
    isPinned: boolean;
  }) => {
    if (selectedNoteId) {
      await updateNote(selectedNoteId, data);
    } else {
      await createNote(data);
    }
    // Refresh folders to update note counts on badges
    await fetchFolders();
  };

  return {
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
    handleCreateNoteWithColor,
    handleEditNote,
    handleCloseEditor,
    handleTagClick,
    handleFolderSelect,
    handleDeleteNote,
    handleDeleteFolder,
    handleSaveNote,
    fetchFolders,
  };
}
