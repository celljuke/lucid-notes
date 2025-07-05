# Authentication Setup Guide

This guide will help you set up the authentication system for Lucid Notes, including database configuration, environment variables, and deployment.

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/lucid_notes?schema=public"
   DATABASE_URL_UNPOOLED="postgresql://username:password@localhost:5432/lucid_notes?schema=public"

   # NextAuth.js
   NEXTAUTH_SECRET="your-super-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Set Up the Database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database (for development)
   npm run db:push

   # Or run migrations (for production)
   npm run db:migrate
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Setup

### Local Development with PostgreSQL

1. **Install PostgreSQL** (if not already installed)

   ```bash
   # macOS
   brew install postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql

   # Windows
   # Download from https://www.postgresql.org/download/
   ```

2. **Create Database**

   ```bash
   createdb lucid_notes
   ```

3. **Update Environment Variables**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lucid_notes?schema=public"
   DATABASE_URL_UNPOOLED="postgresql://username:password@localhost:5432/lucid_notes?schema=public"
   ```

### Production with Neon (Recommended)

1. **Create a Neon Account**

   - Go to [Neon](https://neon.tech)
   - Create a new account and project

2. **Get Connection String**

   - Copy the connection string from Neon dashboard
   - It looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`

3. **Update Environment Variables**
   ```env
   DATABASE_URL="your-neon-connection-string"
   DATABASE_URL_UNPOOLED="your-neon-connection-string"
   ```

## 🔑 NextAuth.js Configuration

### Generate Secret Key

```bash
# Generate a secure random string
openssl rand -base64 32
```

Add this to your `.env.local`:

```env
NEXTAUTH_SECRET="your-generated-secret-key"
```

### Production Environment Variables

For production deployment (Vercel), set these environment variables:

```env
DATABASE_URL="your-neon-connection-string"
DATABASE_URL_UNPOOLED="your-neon-connection-string"
NEXTAUTH_SECRET="your-generated-secret-key"
NEXTAUTH_URL="https://your-app-domain.vercel.app"
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**

   - Push your code to GitHub
   - Connect your repository to Vercel

2. **Set Environment Variables**
   In Vercel dashboard, add these environment variables:

   - `DATABASE_URL`
   - `DATABASE_URL_UNPOOLED`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`

3. **Deploy**
   - Vercel will automatically deploy your application
   - Database migrations will run automatically

### Manual Migration (if needed)

```bash
# Run this after deployment if migrations don't run automatically
npx prisma migrate deploy
```

## 🧪 Testing Authentication

1. **Sign Up Flow**

   - Visit `/sign-up`
   - Create a new account
   - Should automatically sign in and redirect to dashboard

2. **Sign In Flow**

   - Visit `/sign-in`
   - Sign in with existing credentials
   - Should redirect to dashboard

3. **Protected Routes**

   - Try accessing `/dashboard` without authentication
   - Should redirect to `/sign-in`

4. **Sign Out**
   - Click "Sign out" button in dashboard
   - Should clear session and redirect to sign-in

## 📁 Project Structure

```
lucid-notes/
├── app/
│   ├── (auth)/              # Auth routes (sign-in, sign-up)
│   ├── (protected)/         # Protected routes (dashboard)
│   ├── api/auth/           # Auth API routes
│   └── layout.tsx          # Root layout with SessionProvider
├── modules/auth/           # Auth module
│   ├── components/         # Auth components
│   ├── hooks/             # Auth hooks
│   ├── schema.ts          # Validation schemas
│   └── types.ts           # TypeScript types
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── auth-actions.ts    # Server actions
├── auth.ts                # NextAuth.js configuration
├── middleware.ts          # Route protection
└── prisma/
    └── schema.prisma      # Database schema
```

## 🔧 Troubleshooting

### Database Connection Issues

1. **Check connection string format**

   ```env
   # Correct format
   postgresql://username:password@host:port/database?schema=public
   ```

2. **Verify database exists**
   ```bash
   # Test connection
   psql "your-connection-string"
   ```

### Authentication Issues

1. **Clear browser data**

   - Clear cookies and localStorage
   - Try in incognito/private mode

2. **Check environment variables**

   ```bash
   # In development
   echo $NEXTAUTH_SECRET
   echo $DATABASE_URL
   ```

3. **Verify Prisma client**
   ```bash
   # Regenerate client
   npm run db:generate
   ```

### Development vs Production

- **Development**: Uses JWT strategy with credentials provider
- **Production**: Same setup, but with proper HTTPS and domain configuration
- **Database**: Local PostgreSQL for dev, Neon for production

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs
- ✅ Secure session management with NextAuth.js
- ✅ Form validation with Zod
- ✅ CSRF protection
- ✅ Route protection with middleware
- ✅ Type-safe database operations with Prisma

## 📚 Next Steps

After authentication is working:

1. **Set up note management features**
2. **Implement AI integration**
3. **Add analytics dashboard**
4. **Configure performance monitoring**
5. **Set up error tracking**

For questions or issues, check the project documentation or create an issue in the repository.
