"use client";

import { useState, useCallback, useEffect } from "react";

interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    notes: number;
  };
}

interface CreateFolderData {
  name: string;
  color?: string;
}

interface UpdateFolderData {
  name?: string;
  color?: string;
}

export function useFolders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/folders");
      if (!response.ok) {
        throw new Error("Failed to fetch folders");
      }

      const data = await response.json();
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFolder = useCallback(async (data: CreateFolderData) => {
    setError(null);

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
      setFolders((prev) => [newFolder, ...prev]);
      return newFolder;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  const updateFolder = useCallback(
    async (id: string, data: UpdateFolderData) => {
      setError(null);

      try {
        const response = await fetch(`/api/folders/${id}`, {
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
        setFolders((prev) =>
          prev.map((folder) => (folder.id === id ? updatedFolder : folder))
        );
        return updatedFolder;
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        throw err;
      }
    },
    []
  );

  const deleteFolder = useCallback(async (id: string) => {
    setError(null);

    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete folder");
      }

      setFolders((prev) => prev.filter((folder) => folder.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    }
  }, []);

  // Fetch folders on mount
  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  return {
    folders,
    isLoading,
    error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
  };
}
