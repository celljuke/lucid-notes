"use client";

import { Star, Folder, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Note } from "../types";

interface DraggableNoteCardProps {
  note: Note;
  index: number;
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
}

export function DraggableNoteCard({
  note,
  index,
  onEdit,
  onDelete,
}: DraggableNoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: note.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || (isDragging ? "none" : "transform 200ms ease"),
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div className="relative h-72">
      {/* Drop indicator */}
      {isOver && (
        <motion.div
          className="absolute inset-0 border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-2xl z-10 pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{
            opacity: 1,
            scale: 1,
            borderColor: ["#60a5fa", "#3b82f6", "#60a5fa"],
          }}
          transition={{
            duration: 0.2,
            borderColor: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-blue-600 font-medium text-sm bg-white/80 px-3 py-1 rounded-full shadow-sm"
              initial={{ y: 5 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Drop here
            </motion.div>
          </div>
        </motion.div>
      )}

      <motion.div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        initial={{ opacity: 0, y: 20 }}
        animate={{
          opacity: 1,
          y: 0,
          scale: isDragging ? 1.02 : 1,
        }}
        transition={{
          delay: index * 0.1,
          duration: 0.2,
        }}
        className={`h-72 touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      >
        <motion.div
          className={`rounded-2xl p-5 cursor-pointer hover:shadow-xl transition-all duration-200 relative group h-full flex flex-col ${
            isDragging ? "shadow-2xl" : ""
          }`}
          style={{ backgroundColor: note.color }}
          onClick={() => onEdit(note.id)}
          whileTap={{ scale: 0.98 }}
          animate={{
            boxShadow: isDragging
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
              : "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Action buttons */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex space-x-2">
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="w-6 h-6 cursor-pointer flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Pin indicator */}
          {note.isPinned && (
            <motion.div
              className="absolute bottom-4 right-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              <div className="w-7 h-7 bg-amber-100/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm border border-amber-200/50">
                <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
              </div>
            </motion.div>
          )}

          {/* Note content */}
          <div className="flex-1 flex flex-col pt-2">
            {/* Top tags and folder */}
            <div className="flex flex-wrap gap-2 mb-3">
              {/* Folder tag */}
              {note.folder && (
                <Badge
                  variant="secondary"
                  className="text-xs font-medium border-0 shadow-sm"
                  style={{
                    color: note.folder.color,
                  }}
                >
                  <Folder className="w-3 h-3 mr-1" />
                  {note.folder.name}
                </Badge>
              )}

              {/* Tags */}
              {note.tags.slice(0, 3).map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs font-normal bg-white/60 text-gray-500 border-gray-300/60"
                >
                  +{note.tags.length - 3}
                </Badge>
              )}
            </div>

            {/* Title and content */}
            <div className="flex-1 flex flex-col">
              {note.title && (
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-base">
                  {note.title}
                </h3>
              )}
              {note.content && (
                <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 flex-1">
                  {note.content}
                </p>
              )}
            </div>

            {/* Date at bottom */}
            {note.createdAt && (
              <div className="mt-auto pt-3 text-xs text-gray-500 font-medium">
                {new Date(note.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
