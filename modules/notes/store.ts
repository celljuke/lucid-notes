import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { Note, Folder, CreateNoteData, UpdateNoteData } from "./types";

interface CreateFolderData {
  name: string;
  color: string;
}

interface UpdateFolderData {
  name?: string;
  color?: string;
}

interface NotesState {
  // Notes state
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

  // Actions
  setNotes: (notes: Note[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  setFolders: (folders: Folder[]) => void;
  setFoldersLoading: (loading: boolean) => void;

  setSearch: (search: string) => void;
  setSelectedTags: (tags: string[]) => void;
  setSelectedFolderId: (folderId: string | null) => void;
  setViewMode: (mode: "grid" | "list") => void;
  setIsEditorOpen: (open: boolean) => void;
  setSelectedNoteId: (noteId: string | null) => void;
  setIsFolderManagerOpen: (open: boolean) => void;

  // Async actions
  searchNotes: (params?: {
    search?: string;
    tags?: string[];
    folderId?: string | null;
  }) => Promise<void>;
  createNote: (data: CreateNoteData) => Promise<Note>;
  updateNote: (noteId: string, data: UpdateNoteData) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<void>;
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

    // Sync actions
    setNotes: (notes) => set({ notes }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    setFolders: (folders) => set({ folders }),
    setFoldersLoading: (foldersLoading) => set({ foldersLoading }),

    setSearch: (search) => set({ search }),
    setSelectedTags: (selectedTags) => set({ selectedTags }),
    setSelectedFolderId: (selectedFolderId) => set({ selectedFolderId }),
    setViewMode: (viewMode) => set({ viewMode }),
    setIsEditorOpen: (isEditorOpen) => set({ isEditorOpen }),
    setSelectedNoteId: (selectedNoteId) => set({ selectedNoteId }),
    setIsFolderManagerOpen: (isFolderManagerOpen) =>
      set({ isFolderManagerOpen }),

    // Async actions
    searchNotes: async (params = {}) => {
      const { search, tags, folderId } = params;
      const currentState = get();

      // Use provided params or current state
      const searchTerm = search !== undefined ? search : currentState.search;
      const searchTags = tags !== undefined ? tags : currentState.selectedTags;
      const searchFolderId =
        folderId !== undefined ? folderId : currentState.selectedFolderId;

      set({ isLoading: true, error: null });

      try {
        const searchParams = new URLSearchParams();
        if (searchTerm) searchParams.append("search", searchTerm);
        if (searchTags?.length)
          searchParams.append("tags", searchTags.join(","));
        if (searchFolderId) searchParams.append("folderId", searchFolderId);

        const response = await fetch(`/api/notes?${searchParams.toString()}`);
        if (!response.ok) {
          throw new Error("Failed to fetch notes");
        }

        const notes = await response.json();
        set({ notes, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          isLoading: false,
        });
      }
    },

    createNote: async (data) => {
      set({ error: null });

      try {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create note");
        }

        const newNote = await response.json();

        // Add the new note to the beginning of the list
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));

        return newNote;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
        });
        throw error;
      }
    },

    updateNote: async (noteId, data) => {
      set({ error: null });

      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update note");
        }

        const updatedNote = await response.json();

        // Update the note in the list
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? updatedNote : note
          ),
        }));

        return updatedNote;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
        });
        throw error;
      }
    },

    deleteNote: async (noteId) => {
      set({ error: null });

      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete note");
        }

        // Remove the note from the list
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
        });
        throw error;
      }
    },

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

// Auto-search when search/filter parameters change
useNotesStore.subscribe(
  (state) => ({
    search: state.search,
    selectedTags: state.selectedTags,
    selectedFolderId: state.selectedFolderId,
  }),
  (params) => {
    useNotesStore.getState().searchNotes(params);
  },
  {
    equalityFn: (a, b) =>
      a.search === b.search &&
      JSON.stringify(a.selectedTags) === JSON.stringify(b.selectedTags) &&
      a.selectedFolderId === b.selectedFolderId,
  }
);
