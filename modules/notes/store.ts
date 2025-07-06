import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Note, Folder, CreateFolderData, UpdateFolderData } from "./types";
import { NOTE_COLOR_OPTIONS } from "./types";

interface NotesState {
  // Notes state (managed by tRPC now)
  notes: Note[];
  isLoading: boolean;
  error: string | null;

  // Folders state
  folders: Folder[];
  foldersLoading: boolean;

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

  // Actions for folders
  setFolders: (folders: Folder[]) => void;
  setFoldersLoading: (loading: boolean) => void;

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

  // Folder operations (not migrated to tRPC yet)
  fetchFolders: () => Promise<void>;
  createFolder: (data: CreateFolderData) => Promise<Folder>;
  updateFolder: (folderId: string, data: UpdateFolderData) => Promise<Folder>;
  deleteFolder: (folderId: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    notes: [],
    isLoading: false,
    error: null,

    folders: [],
    foldersLoading: false,

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

    // Sync actions for folders
    setFolders: (folders) => set({ folders }),
    setFoldersLoading: (foldersLoading) => set({ foldersLoading }),

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

    // Folder operations (still using REST API - TODO: migrate to tRPC)
    fetchFolders: async () => {
      set({ foldersLoading: true });

      try {
        const response = await fetch("/api/folders");
        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }

        const folders = await response.json();
        set({ folders, foldersLoading: false });
      } catch (error) {
        console.error("Error fetching folders:", error);
        set({ foldersLoading: false });
      }
    },

    createFolder: async (data) => {
      try {
        const response = await fetch("/api/folders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create folder");
        }

        const newFolder = await response.json();

        // Add the new folder to the list
        set((state) => ({
          folders: [newFolder, ...state.folders],
        }));

        return newFolder;
      } catch (error) {
        console.error("Error creating folder:", error);
        throw error;
      }
    },

    updateFolder: async (folderId, data) => {
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update folder");
        }

        const updatedFolder = await response.json();

        // Update the folder in the list
        set((state) => ({
          folders: state.folders.map((folder) =>
            folder.id === folderId ? updatedFolder : folder
          ),
        }));

        return updatedFolder;
      } catch (error) {
        console.error("Error updating folder:", error);
        throw error;
      }
    },

    deleteFolder: async (folderId) => {
      try {
        const response = await fetch(`/api/folders/${folderId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete folder");
        }

        // Remove the folder from the list
        set((state) => ({
          folders: state.folders.filter((folder) => folder.id !== folderId),
        }));
      } catch (error) {
        console.error("Error deleting folder:", error);
        throw error;
      }
    },
  }))
);
