import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Note } from "./types";
import { NOTE_COLOR_OPTIONS } from "./types";

interface NotesState {
  // Notes state (managed by tRPC now)
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // UI state
  search: string;
  selectedTags: string[];
  selectedFolderId: string | null;
  viewMode: "grid" | "list";
  isEditorOpen: boolean;
  selectedNoteId: string | null;
  isFolderManagerOpen: boolean;
  lastUsedColor: string; // Track last used color for smart random selection

  // Actions for notes (managed by tRPC now)
  setNotes: (notes: Note[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // UI actions
  setSearch: (search: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setIsEditorOpen: (open: boolean) => void;
  setSelectedNoteId: (noteId: string | null) => void;
  setIsFolderManagerOpen: (open: boolean) => void;
  setLastUsedColor: (color: string) => void;

  // Utility functions
  getSmartRandomColor: () => string;
}

export const useNotesStore = create<NotesState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    notes: [],
    isLoading: false,
    error: null,

    search: "",
    selectedTags: [],
    selectedFolderId: null,
    viewMode: "grid",
    isEditorOpen: false,
    selectedNoteId: null,
    isFolderManagerOpen: false,
    lastUsedColor: NOTE_COLOR_OPTIONS[0].value, // Default to first color

    // Sync actions for notes
    setNotes: (notes) => set({ notes }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // UI actions
    setSearch: (search) => set({ search }),
    setSelectedTags: (selectedTags) => set({ selectedTags }),
    setSelectedFolderId: (selectedFolderId) => set({ selectedFolderId }),
    setViewMode: (viewMode) => set({ viewMode }),
    setIsEditorOpen: (isEditorOpen) => set({ isEditorOpen }),
    setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),
    setIsFolderManagerOpen: (isFolderManagerOpen) =>
      set({ isFolderManagerOpen }),
    setLastUsedColor: (lastUsedColor) => set({ lastUsedColor }),

    // Utility function to get a smart random color
    getSmartRandomColor: () => {
      const { lastUsedColor } = get();

      // Filter out the last used color to ensure we get a different one
      const availableColors = NOTE_COLOR_OPTIONS.filter(
        (color) => color.value !== lastUsedColor
      );

      // If somehow all colors are the same (shouldn't happen), use all colors
      const colorsToChooseFrom =
        availableColors.length > 0 ? availableColors : NOTE_COLOR_OPTIONS;

      // Get random color from available options
      const randomIndex = Math.floor(Math.random() * colorsToChooseFrom.length);
      return colorsToChooseFrom[randomIndex].value;
    },

    // Folder operations are now handled by tRPC hooks
  }))
);
