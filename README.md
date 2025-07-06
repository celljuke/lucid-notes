# Lucid Notes

A modern, AI-powered note-taking application built with Next.js, TypeScript, and PostgreSQL. Create, organize, and enhance your notes with intelligent features.

![Lucid Notes Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=Lucid+Notes)

## 🚀 Features

### Core Functionality

- **📝 Rich Note Editor** - Create and edit notes with Markdown support
- **📁 Folder Organization** - Organize notes into customizable folders
- **🏷️ Smart Tagging** - Tag-based categorization and filtering
- **🎨 Color Coding** - 8 beautiful color options for notes and folders
- **📌 Pin Important Notes** - Keep important notes at the top
- **🔍 Advanced Search** - Search by title, content, tags, and folders
- **📱 Mobile-First Design** - Responsive design for all devices

### AI-Powered Features

- **🤖 Auto Title Generation** - Generate descriptive titles from content
- **✨ Text Expansion** - Convert shorthand notes to full content
- **📊 Smart Summarization** - Summarize long notes into key points
- **🔗 Related Notes** - Discover connections between your notes

### User Experience

- **🌙 Dark/Light Theme** - Toggle between themes
- **⚡ Real-time Updates** - Instant synchronization across devices
- **🎯 Drag & Drop** - Reorder notes with drag and drop
- **📈 Analytics Dashboard** - Track your note-taking habits
- **🔐 Secure Authentication** - User accounts with session management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **State Management**: Zustand
- **API**: tRPC for type-safe APIs
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI GPT-4o-mini
- **Animations**: Framer Motion
- **Testing**: Jest & Playwright
- **Containerization**: Docker

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **pnpm** (recommended)
- **PostgreSQL** (v13 or higher) OR **Docker** (for containerized setup)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/lucid-notes.git
cd lucid-notes
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DATABASE_URL="postgresql://lucid_user:lucid_password@localhost:5433/lucid_notes?schema=public"
DATABASE_URL_UNPOOLED="postgresql://lucid_user:lucid_password@localhost:5433/lucid_notes?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (optional - for AI features)
OPENAI_API_KEY="your-openai-api-key-here"
```

### 4. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
npm run db:setup

# This will:
# 1. Start PostgreSQL in Docker
# 2. Generate Prisma client
# 3. Push schema to database
# 4. Seed with sample data (optional)
```

#### Option B: Local PostgreSQL

```bash
# Create database
createdb lucid_notes

# Generate Prisma client
npm run db:generate

# Push schema
npm run db:push

# Seed database (optional)
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
lucid-notes/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── lib/                   # Utility libraries
│   ├── auth-actions.ts   # Authentication helpers
│   ├── prisma.ts         # Database client
│   └── trpc/             # tRPC configuration
├── modules/               # Feature modules
│   ├── analytics/        # Analytics dashboard
│   ├── auth/             # Authentication logic
│   ├── folders/          # Folder management
│   ├── notes/            # Note management
│   └── tags/             # Tag system
├── prisma/               # Database schema & migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Sample data
├── server/               # Backend API
│   ├── api/              # tRPC routers
│   └── services/         # Business logic
└── tests/                # Test files
    └── e2e/              # End-to-end tests
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema to database
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:reset        # Reset database
npm run db:setup        # Complete database setup

# Testing
npm run test            # Run unit tests (Jest)
npm run test:e2e        # Run end-to-end tests (Playwright)

# Database Management
npm run db:start        # Start PostgreSQL container
npm run db:stop         # Stop PostgreSQL container
npm run db:restart      # Restart PostgreSQL container
npm run db:logs         # View database logs
npm run db:studio       # Open Prisma Studio
```

### Advanced Database Operations

```bash
# Reset database (⚠️ This will delete all data)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### End-to-End Tests

```bash
npm run test:e2e
```

### Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Start/stop database container
npm run db:start
npm run db:stop
npm run db:restart

# View database logs
npm run db:logs
```

## 🌐 API Documentation

### tRPC Routes

#### Notes API

- `note.getAll` - Get all notes for user
- `note.getById` - Get note by ID
- `note.create` - Create new note
- `note.update` - Update existing note
- `note.delete` - Delete note
- `note.reorder` - Reorder notes

#### Folders API

- `folder.getAll` - Get all folders for user
- `folder.create` - Create new folder
- `folder.update` - Update folder
- `folder.delete` - Delete folder

#### AI API

- `ai.generateTitle` - Generate title from content
- `ai.expandText` - Expand shorthand text
- `ai.summarize` - Summarize long content

## 🚀 Deployment

### Vercel (Recommended)

1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import your repository
4. Configure environment variables
5. Deploy!

### Docker

```bash
# Build container
docker build -t lucid-notes .

# Run container
docker run -p 3000:3000 lucid-notes
```

### Environment Variables for Production

```env
# Database (use a production database)
DATABASE_URL="your-production-database-url"

# NextAuth.js
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for your changes
5. Run tests: `npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PR
- Update documentation as needed

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🐛 Issues & Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-username/lucid-notes/issues) page
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) for the amazing framework
- [Vercel](https://vercel.com) for hosting and deployment
- [Prisma](https://prisma.io) for the excellent ORM
- [OpenAI](https://openai.com) for AI capabilities
- [Shadcn/ui](https://ui.shadcn.com) for beautiful components

---

<div align="center">
  <p>Built with ❤️ by the Lucid Notes team</p>
  <p>
    <a href="https://github.com/your-username/lucid-notes/stargazers">⭐ Star this repo</a> |
    <a href="https://github.com/your-username/lucid-notes/issues">🐛 Report Bug</a> |
    <a href="https://github.com/your-username/lucid-notes/issues">💡 Request Feature</a>
  </p>
</div>
