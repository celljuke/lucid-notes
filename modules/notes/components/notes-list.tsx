"use client";

import { useState } from "react";
import { Pin, Edit, Trash2, Tag, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { NotesListProps } from "@/modules/notes/types";

export function NotesList({
  notes,
  onEdit,
  onDelete,
  onTagClick,
}: NotesListProps) {
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 200
      ? plainText.substring(0, 200) + "..."
      : plainText;
  };

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <Card
          key={note.id}
          className="group cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 hover:border-l-blue-500"
          style={{ borderLeftColor: note.color }}
          onMouseEnter={() => setHoveredNote(note.id)}
          onMouseLeave={() => setHoveredNote(null)}
          onClick={() => onEdit(note.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {note.isPinned && (
                    <Pin className="h-4 w-4 text-gray-600 fill-current flex-shrink-0" />
                  )}
                  <h3 className="font-semibold text-gray-900 text-lg truncate">
                    {note.title}
                  </h3>
                  {note.folder && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: note.folder.color }}
                      />
                      <span className="truncate">{note.folder.name}</span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {getPreviewText(note.content)}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 4).map((tag) => (
                          <button
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              onTagClick?.(tag);
                            }}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs transition-colors"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </button>
                        ))}
                        {note.tags.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            +{note.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs text-gray-500">
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

              {hoveredNote === note.id && (
                <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(note.id);
                    }}
                    className="h-8 w-8 p-0 hover:bg-gray-100"
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
