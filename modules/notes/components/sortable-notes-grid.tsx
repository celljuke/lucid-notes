"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { DraggableNoteCard } from "./draggable-note-card";
import { Note } from "../types";

interface SortableNotesGridProps {
  notes: Note[];
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onReorder: (noteOrders: { id: string; order: number }[]) => void;
}

export function SortableNotesGrid({
  notes,
  onEdit,
  onDelete,
  onReorder,
}: SortableNotesGridProps) {
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [localNotes, setLocalNotes] = useState(notes);
  const [isDragging, setIsDragging] = useState(false);

  // Update local notes when props change (but not during dragging)
  if (notes !== localNotes && !isDragging) {
    setLocalNotes(notes);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeNoteItem = localNotes.find((note) => note.id === active.id);
    setActiveNote(activeNoteItem || null);
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      setLocalNotes((notes) => {
        const activeIndex = notes.findIndex((note) => note.id === active.id);
        const overIndex = notes.findIndex((note) => note.id === over.id);

        return arrayMove(notes, activeIndex, overIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    setIsDragging(false);
    setActiveNote(null);

    if (!over) return;

    // Create order mapping from current local notes state
    const noteOrders = localNotes.map((note, index) => ({
      id: note.id,
      order: index,
    }));

    // Call the reorder function to persist the changes
    onReorder(noteOrders);
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveNote(null);
    // Reset local notes to original state
    setLocalNotes(notes);
  };

  return (
    <DndContext
      sensors={sensors}
      modifiers={[restrictToWindowEdges]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={localNotes.map((note) => note.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {localNotes.map((note, index) => (
            <DraggableNoteCard
              key={note.id}
              note={note}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeNote && (
          <div className="h-72 opacity-90 rotate-2 transform scale-105 animate-pulse">
            <div
              className="rounded-2xl p-5 h-full flex flex-col shadow-2xl border-2 border-blue-300 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-sm"
              style={{ backgroundColor: activeNote.color }}
            >
              <div className="flex-1 flex flex-col pt-2">
                <div className="flex flex-wrap gap-2 mb-3">
                  {activeNote.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white/30 text-xs rounded-full border border-white/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex-1 flex flex-col">
                  {activeNote.title && (
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                      {activeNote.title}
                    </h3>
                  )}
                  {activeNote.content && (
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">
                      {activeNote.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
