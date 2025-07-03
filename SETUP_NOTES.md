# Notes Feature Setup

This document explains how to set up and run the notes feature.

## Database Setup

The notes feature requires database schema changes. Run the following commands to update your database:

```bash
# Generate the Prisma client with the new schema
npm run db:generate

# Push the schema changes to your database
npm run db:push
```

## Features Implemented

### Core Features

- ✅ **Create, edit, and delete notes** - Full CRUD operations for notes
- ✅ **Create and delete folders** - Organize notes with folders (optional)
- ✅ **Tags are required** - Every note must have at least one tag
- ✅ **Search and filter** - Search by text content and filter by tags/folders

### UI Components

- ✅ **Modern Grid View** - Beautiful card-based layout with colors
- ✅ **List View** - Detailed list layout option
- ✅ **Sidebar Navigation** - "Docket" style sidebar with folders and color palette
- ✅ **Note Editor Modal** - Full-featured note creation/editing
- ✅ **Folder Manager** - Create and manage folders with colors

### Technical Features

- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Works on all screen sizes
- ✅ **Real-time Updates** - Updates reflect immediately
- ✅ **Color Coding** - Notes and folders support custom colors
- ✅ **Pin Notes** - Important notes can be pinned to the top
- ✅ **Date Formatting** - Shows relative dates (e.g., "2 hours ago")

## Database Schema

The following tables are used:

### Notes Table

- `id` - Unique identifier
- `title` - Note title (required)
- `content` - Note content (rich text)
- `tags` - Array of tags (required, minimum 1)
- `color` - Note background color
- `isPinned` - Whether note is pinned
- `folderId` - Optional folder assignment
- `userId` - Owner of the note
- `createdAt` / `updatedAt` - Timestamps

### Folders Table

- `id` - Unique identifier
- `name` - Folder name
- `color` - Folder color
- `userId` - Owner of the folder
- `createdAt` / `updatedAt` - Timestamps

## API Endpoints

### Notes

- `GET /api/notes` - List notes with optional search/filter
- `POST /api/notes` - Create new note
- `GET /api/notes/[id]` - Get specific note
- `PUT /api/notes/[id]` - Update note
- `DELETE /api/notes/[id]` - Delete note

### Folders

- `GET /api/folders` - List folders
- `POST /api/folders` - Create folder
- `PUT /api/folders/[id]` - Update folder
- `DELETE /api/folders/[id]` - Delete folder

### Tags

- `GET /api/tags` - Get all unique tags for user

## How to Use

1. **Access Notes**: Visit `/notes` or click "New Note" from the dashboard
2. **Create Note**: Click "New Note" button, fill in title, content, and tags
3. **Edit Note**: Click on any note card to edit it
4. **Delete Note**: Hover over a note and click the trash icon
5. **Create Folder**: Use the "+" button next to "Folders" in the sidebar
6. **Filter by Folder**: Click any folder in the sidebar
7. **Search**: Use the search bar to find notes by title, content, or tags
8. **Pin Notes**: Edit a note and check the "Pin this note" option

## Design Features

The interface follows a modern "Docket" style similar to popular note-taking apps:

- **Sidebar**: Clean navigation with "Docket" branding and color legend
- **Grid Layout**: Pinterest-style card layout with hover effects
- **Color System**: 8 predefined colors for notes and folders
- **Typography**: Clean, readable fonts with proper hierarchy
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Adapts to mobile, tablet, and desktop screens

## Next Steps

After setup, you can:

1. Customize the color palette in the components
2. Add rich text editing capabilities
3. Implement note sharing features
4. Add export functionality
5. Integrate with AI for note enhancement

The foundation is complete and ready for further customization!
