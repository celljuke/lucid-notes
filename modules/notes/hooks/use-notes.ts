"use client";

import { useState, useCallback } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  folderId?: string;
  folder?: {
    id: string;
    name: string;
    color: string;
  };
}

interface SearchParams {
  search?: string;
  tags?: string[];
  folderId?: string | null;
}

interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  color?: string;
}

interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  folderId?: string;
  color?: string;
  isPinned?: boolean;
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchNotes = useCallback(async (params: SearchParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.append("search", params.search);
      if (params.tags?.length)
        searchParams.append("tags", params.tags.join(","));
      if (params.folderId) searchParams.append("folderId", params.folderId);

      const response = await fetch(`/api/notes?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNote = useCallback(async (data: CreateNoteData) => {
    setError(null);

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
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const updateNote = useCallback(async (id: string, data: UpdateNoteData) => {
    setError(null);

    try {
      const response = await fetch(`/api/notes/${id}`, {
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
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? updatedNote : note))
      );
      return updatedNote;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const getNote = useCallback(async (id: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch note");
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  return {
    notes,
    isLoading,
    error,
    searchNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
}
