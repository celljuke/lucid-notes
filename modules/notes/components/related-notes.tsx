"use client";

import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotesStore } from "../store";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

interface RelatedNotesProps {
  noteId: string;
  className?: string;
  onCountChange?: (count: number) => void;
}

export function RelatedNotes({
  noteId,
  className,
  onCountChange,
}: RelatedNotesProps) {
  const { setSelectedNoteId, setIsEditorOpen } = useNotesStore();

  // Use tRPC hook to get related notes
  const {
    data: relatedNotesData,
    isLoading,
    error,
  } = trpc.note.getRelated.useQuery({ id: noteId }, { enabled: !!noteId });

  const relatedNotes = relatedNotesData?.relatedNotes || [];

  useEffect(() => {
    onCountChange?.(relatedNotes.length);
  }, [relatedNotes.length, onCountChange]);

  const handleNoteClick = (relatedNoteId: string) => {
    setSelectedNoteId(relatedNoteId);
    setIsEditorOpen(true);
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.8) return "bg-green-100 text-green-800";
    if (similarity >= 0.6) return "bg-blue-100 text-blue-800";
    if (similarity >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-600 ${className}`}>
        <p>Error loading related notes:</p>
        <p className="text-xs mt-1">{error.message}</p>
      </div>
    );
  }

  if (relatedNotes.length === 0) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-4 w-4 text-gray-400" />
          <span>No related notes found</span>
        </div>
        <p className="text-xs">
          Update this note to generate embeddings and find related content.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {relatedNotes.map((note) => (
        <div
          key={note.id}
          className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-sm transition-shadow cursor-pointer"
          onClick={() => handleNoteClick(note.id)}
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
              {note.title}
            </h4>
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <Badge
                variant="secondary"
                className={`text-xs px-2 py-0.5 ${getSimilarityColor(
                  note.similarity
                )}`}
              >
                {Math.round(note.similarity * 100)}%
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNoteClick(note.id);
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
            {note.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {note.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{note.tags.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs text-gray-500">
              {note.folder && (
                <span
                  className="px-1.5 py-0.5 rounded text-white text-xs"
                  style={{ backgroundColor: note.folder.color }}
                >
                  {note.folder.name}
                </span>
              )}
              <span>
                {note.updatedAt &&
                  formatDistanceToNow(new Date(note.updatedAt), {
                    addSuffix: true,
                  })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
