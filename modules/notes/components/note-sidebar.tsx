"use client";

import { Folder, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NoteSidebarProps, NOTE_COLOR_OPTIONS } from "@/modules/notes/types";

export function NoteSidebar({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  isLoading,
}: NoteSidebarProps) {
  const colorOptions = NOTE_COLOR_OPTIONS;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {/* All Notes */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => onFolderSelect(null)}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
              selectedFolderId === null
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "hover:bg-gray-50 text-gray-700"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Folder className="h-4 w-4 text-gray-600" />
              </div>
              <span className="font-medium">All Notes</span>
            </div>
          </button>
        </div>

        {/* Folders Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Folders
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateFolder}
              className="h-6 w-6 p-0 hover:bg-gray-100"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="space-y-1">
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading folders...</div>
            ) : folders.length === 0 ? (
              <div className="text-sm text-gray-500">No folders yet</div>
            ) : (
              folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => onFolderSelect(folder.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                    selectedFolderId === folder.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <span className="text-sm font-medium truncate">
                      {folder.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {folder._count?.notes || 0}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Color Legend */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Colors
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map((option) => (
              <div
                key={option.value}
                className="w-6 h-6 rounded-full border border-gray-200 cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: option.value }}
                title={option.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
