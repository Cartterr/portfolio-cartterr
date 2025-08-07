#!/bin/bash

echo "🚀 Setting up Cartterr Portfolio..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install root dependencies"
    exit 1
fi

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
if [ ! -f "backend/.env" ]; then
    cat > backend/.env << EOF
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
EOF
    echo "✅ Created backend/.env"
fi

# Frontend .env
if [ ! -f "frontend/.env" ]; then
    cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_CONTACT_FORM=true
EOF
    echo "✅ Created frontend/.env"
fi

# Install frontend dependencies
echo "📱 Installing frontend dependencies..."
cd frontend
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
yarn install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "  npm run dev           - Start development servers"
echo "  npm run build         - Build for production"
echo "  npm run docker:dev    - Run with Docker (development)"
echo "  npm run docker:prod   - Run with Docker (production)"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo "  API:      http://localhost:5000/api"
echo ""
