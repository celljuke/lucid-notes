"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotesStore } from "../store";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Sparkles } from "lucide-react";

interface RelatedNote {
  id: string;
  title: string;
  content: string;
  tags: string[];
  similarity: number;
  color: string;
  createdAt: string;
  updatedAt: string;
  folder?: {
    id: string;
    name: string;
    color: string;
  };
}

interface RelatedNotesProps {
  noteId: string;
  className?: string;
}

export function RelatedNotes({ noteId, className }: RelatedNotesProps) {
  const [relatedNotes, setRelatedNotes] = useState<RelatedNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedNoteId, setIsEditorOpen } = useNotesStore();

  useEffect(() => {
    if (noteId) {
      fetchRelatedNotes();
    }
  }, [noteId]);

  const fetchRelatedNotes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/notes/${noteId}/related`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch related notes");
      }

      setRelatedNotes(data.relatedNotes || []);
    } catch (error) {
      console.error("Error fetching related notes:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch related notes"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Related Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Related Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRelatedNotes}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (relatedNotes.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Related Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No related notes found yet.</p>
            <p className="text-xs text-gray-400 mt-1">
              Related notes will appear as you create more content.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Related Notes
          <Badge variant="secondary" className="ml-auto">
            {relatedNotes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {relatedNotes.map((note) => (
          <div
            key={note.id}
            className="group relative rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
            style={{ backgroundColor: note.color + "15" }}
            onClick={() => handleNoteClick(note.id)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm line-clamp-1 pr-2">
                {note.title}
              </h4>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs ${getSimilarityColor(note.similarity)}`}
                >
                  {Math.round(note.similarity * 100)}%
                </Badge>
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-3 line-clamp-2">
              {note.content}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {note.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{note.tags.length - 3}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                {note.folder && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: note.folder.color }}
                  />
                )}
                <span>
                  {formatDistanceToNow(new Date(note.updatedAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
