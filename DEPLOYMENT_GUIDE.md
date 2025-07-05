# Vercel Deployment Guide with Neon Database

This guide will walk you through deploying your Lucid Notes application to Vercel with a Neon PostgreSQL database.

## 🚀 Prerequisites

1. **GitHub Account** - Your code should be pushed to a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Neon Account** - Sign up at [neon.tech](https://neon.tech)
4. **OpenAI Account** - For AI features at [platform.openai.com](https://platform.openai.com)

## 📋 Step-by-Step Deployment

### 1. Set Up Neon Database

1. **Create a Neon Project**

   - Go to [console.neon.tech](https://console.neon.tech)
   - Click "Create Project"
   - Choose a name (e.g., "lucid-notes-prod")
   - Select region closest to your users
   - Choose PostgreSQL version (latest recommended)

2. **Get Connection Strings**
   - In your Neon dashboard, go to "Connection Details"
   - Copy the **Connection String** (this will be your `DATABASE_URL`)
   - Copy the **Direct Connection String** (this will be your `DATABASE_URL_UNPOOLED`)
   - They should look like:
     ```
     postgresql://username:password@host.neon.tech/database?sslmode=require
     ```

### 2. Set Up Vercel Project

1. **Connect Repository**

   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select "Next.js" framework preset

2. **Configure Environment Variables**
   Before deploying, add these environment variables in Vercel:

   ```env
   # Database Configuration
   DATABASE_URL="postgresql://username:password@host.neon.tech/database?sslmode=require"
   DATABASE_URL_UNPOOLED="postgresql://username:password@host.neon.tech/database?sslmode=require"

   # Authentication
   NEXTAUTH_SECRET="your-generated-secret-key"
   NEXTAUTH_URL="https://your-app-name.vercel.app"

   # AI Features (Optional)
   OPENAI_API_KEY="your-openai-api-key"
   ```

3. **Generate NextAuth Secret**
   Run this command locally to generate a secure secret:
   ```bash
   openssl rand -base64 32
   ```

### 3. Environment Variables Setup

#### Required Variables:

- `DATABASE_URL` - Your Neon connection string
- `DATABASE_URL_UNPOOLED` - Your Neon direct connection string
- `NEXTAUTH_SECRET` - Generated secret key
- `NEXTAUTH_URL` - Your production URL

#### Optional Variables:

- `OPENAI_API_KEY` - For AI features (title generation, summarization, etc.)

### 4. Deploy to Vercel

1. **Initial Deployment**

   - Click "Deploy" in Vercel dashboard
   - Wait for build to complete
   - Note your deployment URL

2. **Update NEXTAUTH_URL**
   - Go to your Vercel project settings
   - Update `NEXTAUTH_URL` with your actual deployment URL
   - Redeploy if needed

### 5. Initialize Database

After successful deployment, initialize your database:

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Run database commands
vercel env pull .env.local
npm run db:generate
npm run db:push
npm run db:seed
```

#### Option B: Manual Database Setup

1. Run these commands locally with production environment variables:

   ```bash
   # Set environment variables
   export DATABASE_URL="your-neon-connection-string"
   export DATABASE_URL_UNPOOLED="your-neon-direct-connection-string"

   # Generate Prisma client
   npx prisma generate

   # Push schema to database
   npx prisma db push

   # Seed database with sample data
   npx prisma db seed
   ```

### 6. Test Your Deployment

1. **Access Your App**

   - Visit your Vercel deployment URL
   - Should see the sign-in page

2. **Test Authentication**

   - Try creating a new account at `/sign-up`
   - Sign in with demo accounts:
     - Email: `demo@example.com`
     - Password: `password123`

3. **Test Features**
   - Create/edit notes
   - Try AI features (if OpenAI key is configured)
   - Check analytics dashboard

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Errors

```
Error: P1001: Can't reach database server
```

**Solution:** Check your DATABASE_URL format and ensure Neon database is running.

#### NextAuth Configuration Issues

```
Error: [next-auth][error][JWT_SESSION_ERROR]
```

**Solution:** Ensure `NEXTAUTH_SECRET` is set and `NEXTAUTH_URL` matches your domain.

#### Build Errors

```
Error: Cannot find module '@prisma/client'
```

**Solution:** Ensure `npx prisma generate` runs during build. This should happen automatically.

#### Prisma Client Initialization Error

```
Error [PrismaClientInitializationError]: Prisma has detected that this project was built on Vercel, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered.
```

**Solution:** The `postinstall` script in package.json should fix this. If still having issues, try:

1. Clear Vercel build cache (in deployment settings)
2. Redeploy the project
3. Check that `prisma generate` runs in build logs

#### AI Features Not Working

```
Error: OpenAI API key not configured
```

**Solution:** Add `OPENAI_API_KEY` to your environment variables.

### Database Migration Issues

If you need to run migrations manually:

```bash
# Connect to your deployment
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Or reset and reseed (WARNING: This will delete all data)
npx prisma migrate reset --force
npx prisma db seed
```

## 📊 Post-Deployment Checklist

- [ ] Database connection working
- [ ] Authentication working (sign up/sign in)
- [ ] Notes creation/editing working
- [ ] AI features working (if enabled)
- [ ] Analytics dashboard loading
- [ ] All environment variables set correctly
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

## 🔒 Security Considerations

1. **Environment Variables**

   - Never commit `.env` files to version control
   - Use Vercel's environment variable manager
   - Regenerate secrets if compromised

2. **Database Security**

   - Neon provides built-in security features
   - Use connection pooling for better performance
   - Monitor database usage and access logs

3. **Authentication**
   - Use strong `NEXTAUTH_SECRET`
   - Consider adding additional OAuth providers
   - Implement rate limiting for production

## 📈 Performance Optimization

1. **Database**

   - Enable connection pooling in Neon
   - Use database indexes (already configured)
   - Monitor query performance

2. **Vercel**
   - Use Vercel Analytics
   - Configure caching headers
   - Optimize bundle size

## 🔄 Continuous Deployment

Your app is now set up for continuous deployment:

- Push to `main` branch → Automatically deploys to production
- Push to other branches → Creates preview deployments
- Pull requests → Generate preview links

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Support

If you encounter issues:

1. Check Vercel function logs
2. Review Neon database logs
3. Verify environment variables
4. Check GitHub Actions/workflows

Your Lucid Notes app should now be successfully deployed! 🎉
