export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  color: string;
  isPinned: boolean;
  order: number;
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
  order?: number;
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

// AI API Response Types
export interface AiSummaryResponse {
  summary: string;
}

export interface AiExpandResponse {
  expandedContent: string;
}

export interface AiTitleResponse {
  title: string;
}

// Constants - Pastel Colors
export const NOTE_COLOR_OPTIONS: ColorOption[] = [
  { name: "Yellow", value: "#FFF9C4" },
  { name: "Orange", value: "#FFE0B2" },
  { name: "Pink", value: "#F8BBD9" },
  { name: "Purple", value: "#E1BEE7" },
  { name: "Blue", value: "#BBDEFB" },
  { name: "Green", value: "#C8E6C9" },
  { name: "Teal", value: "#B2DFDB" },
  { name: "Gray", value: "#E0E0E0" },
];

export const FOLDER_COLOR_OPTIONS: ColorOption[] = [
  { name: "Blue", value: "#BBDEFB" },
  { name: "Green", value: "#C8E6C9" },
  { name: "Yellow", value: "#FFF9C4" },
  { name: "Red", value: "#FFCDD2" },
  { name: "Purple", value: "#E1BEE7" },
  { name: "Pink", value: "#F8BBD9" },
  { name: "Teal", value: "#B2DFDB" },
  { name: "Orange", value: "#FFE0B2" },
];

// Alias for NOTE_COLOR_OPTIONS for backward compatibility
export const COLORS = NOTE_COLOR_OPTIONS;
