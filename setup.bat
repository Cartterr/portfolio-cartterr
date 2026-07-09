@echo off
echo 🚀 Setting up Cartterr Portfolio for Windows...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Create environment files
echo 📝 Creating environment files...

REM Backend .env
if not exist "backend\.env" (
    echo NODE_ENV=development> backend\.env
    echo PORT=5000>> backend\.env
    echo FRONTEND_URL=http://localhost:3000>> backend\.env
    echo ✅ Created backend\.env
)

REM Install frontend dependencies
echo 📱 Installing frontend dependencies...
cd frontend
call yarn install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

REM Install backend dependencies
echo 🔧 Installing backend dependencies...
cd backend
call yarn install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo   npm run dev           - Start development servers
echo   npm run build         - Build for production
echo   npm test              - Run production and application contracts
echo   npm run type-check    - Type-check both workspaces
echo.
echo 🌐 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo   API:      http://localhost:5000/api
echo.
pause
