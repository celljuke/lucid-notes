"use client";

import { useState } from "react";
import { Pin, Edit, Trash2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { NotesGridProps } from "@/modules/notes/types";

export function NotesGrid({
  notes,
  onEdit,
  onDelete,
  onTagClick,
}: NotesGridProps) {
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 150
      ? plainText.substring(0, 150) + "..."
      : plainText;
  };

  const getCardStyle = (color: string) => ({
    backgroundColor: color,
    border: `1px solid ${color}`,
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 relative overflow-hidden"
          style={getCardStyle(note.color)}
          onMouseEnter={() => setHoveredNote(note.id)}
          onMouseLeave={() => setHoveredNote(null)}
          onClick={() => onEdit(note.id)}
        >
          {note.isPinned && (
            <div className="absolute top-2 right-2 z-10">
              <Pin className="h-4 w-4 text-gray-600 fill-current" />
            </div>
          )}

          <CardContent className="p-4 h-60 flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2">
                {note.title}
              </h3>
              {hoveredNote === note.id && (
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(note.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-black/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(note.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                {getPreviewText(note.content)}
              </p>
            </div>

            <div className="space-y-3 mt-auto">
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map((tag) => (
                    <button
                      key={tag}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTagClick?.(tag);
                      }}
                      className="inline-flex items-center px-2 py-1 bg-white/60 hover:bg-white/80 text-gray-700 rounded-full text-xs transition-colors"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 bg-white/60 text-gray-600 rounded-full text-xs">
                      +{note.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  {note.folder && (
                    <div className="flex items-center space-x-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: note.folder.color }}
                      />
                      <span>{note.folder.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {note.updatedAt &&
                      formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                      })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
