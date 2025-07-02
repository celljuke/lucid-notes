#!/bin/bash

echo "🚀 Setting up Lucid Notes database..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if container is running and healthy
for i in {1..12}; do
    if docker-compose exec -T postgres psql -U lucid_user -d lucid_notes -c '\q' >/dev/null 2>&1; then
        echo "✅ Database is ready!"
        break
    fi
    if [ $i -eq 12 ]; then
        echo "❌ Database failed to start within 60 seconds"
        echo "🔍 Check Docker logs: docker-compose logs postgres"
        exit 1
    fi
    echo "   Still waiting... (${i}/12)"
    sleep 5
done

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "📊 Pushing database schema..."
npm run db:push

echo "🎉 Database setup complete!"
echo ""
echo "📋 Database connection details:"
echo "   Host: localhost"
echo "   Port: 5433"
echo "   Database: lucid_notes"
echo "   Username: lucid_user"
echo "   Password: lucid_password"
echo ""
echo "🔗 Connection URL: postgresql://lucid_user:lucid_password@localhost:5433/lucid_notes"
echo ""
echo "▶️  You can now run: npm run dev" 