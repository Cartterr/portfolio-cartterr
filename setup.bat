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

for /f "tokens=1 delims=." %%v in ('node -p "process.versions.node"') do set NODE_MAJOR=%%v
if not "%NODE_MAJOR%"=="24" (
    echo ❌ Node.js version 24 is required
    pause
    exit /b 1
)

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
