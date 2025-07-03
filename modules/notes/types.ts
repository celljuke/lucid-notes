export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  folderId?: string;
  createdAt?: string;
  updatedAt?: string;
  folder?: Folder | null;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: Note[];
  _count?: {
    notes: number;
  };
}

export interface ColorOption {
  name: string;
  value: string;
}

// Form Data Types
export interface CreateNoteData {
  title: string;
  content: string;
  tags: string[];
  folderId?: string;
  color: string;
  isPinned: boolean;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  tags?: string[];
  folderId?: string;
  color?: string;
  isPinned?: boolean;
}

export interface CreateFolderData {
  name: string;
  color: string;
}

export interface UpdateFolderData {
  name?: string;
  color?: string;
}

// Component Props Types
export interface NoteEditorProps {
  noteId: string | null;
  folders: Folder[];
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateNoteData) => Promise<void>;
}

export interface FolderManagerProps {
  folders: Folder[];
  open: boolean;
  onClose: () => void;
}

export interface NotesGridProps {
  notes: Note[];
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onTagClick?: (tag: string) => void;
}

export interface NotesListProps {
  notes: Note[];
  onEdit: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onTagClick?: (tag: string) => void;
}

export interface NoteSidebarProps {
  folders: Folder[];
  selectedTags: string[];
  selectedFolderId: string | null;
  onTagSelect?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  onTagClick?: (tag: string) => void;
  onFolderSelect: (folderId: string | null) => void;
  onOpenFolderManager?: () => void;
  onCreateFolder?: () => void;
  isLoading?: boolean;
}

// Search and Filter Types
export interface NotesSearchParams {
  search?: string;
  tags?: string[];
  folderId?: string;
}

export interface NotesState {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
}

export interface FoldersState {
  folders: Folder[];
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface NotesApiResponse {
  notes: Note[];
  total: number;
}

export interface FoldersApiResponse {
  folders: Folder[];
  total: number;
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// Constants
export const NOTE_COLOR_OPTIONS: ColorOption[] = [
  { name: "Yellow", value: "#FFE066" },
  { name: "Orange", value: "#FF8A65" },
  { name: "Pink", value: "#F06292" },
  { name: "Purple", value: "#BA68C8" },
  { name: "Blue", value: "#4FC3F7" },
  { name: "Green", value: "#66BB6A" },
  { name: "Teal", value: "#26A69A" },
  { name: "Gray", value: "#90A4AE" },
];

export const FOLDER_COLOR_OPTIONS: ColorOption[] = [
  { name: "Blue", value: "#4F46E5" },
  { name: "Green", value: "#10B981" },
  { name: "Yellow", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Pink", value: "#EC4899" },
  { name: "Teal", value: "#14B8A6" },
  { name: "Orange", value: "#F97316" },
];

// Alias for NOTE_COLOR_OPTIONS for backward compatibility
export const COLORS = NOTE_COLOR_OPTIONS;
