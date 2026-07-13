@echo off
chcp 65001 >nul
setlocal EnableExtensions
set "ROOT=%~dp0"
cd /d "%ROOT%"

if "%BACKEND_PORT%"=="" set BACKEND_PORT=5000
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3000
set "API_URL=http://localhost:%BACKEND_PORT%/api"
set "NODE_ENV=development"
set "PORT=%BACKEND_PORT%"
set "FRONTEND_URL=http://localhost:%FRONTEND_PORT%"

where npm >nul 2>nul || (
  echo ❌ npm is required. Install Node.js 24 and npm 10 or newer.
  exit /b 1
)

echo.
echo 🎯  cartterr portfolio
echo 🌈✨ Booting full stack dev services
echo 🚀 Backend: http://localhost:%BACKEND_PORT%  ^|  🔗 API: %API_URL%
echo 🖥️  Frontend: http://localhost:%FRONTEND_PORT%
echo 🧰 npm workspaces  ^|  📂 ROOT=%ROOT%
echo.

if not exist "%ROOT%node_modules\.bin\concurrently.cmd" (
  echo 📦 Installing the authoritative npm workspace lockfile
  npm install || exit /b 1
)

call :free_port %BACKEND_PORT%
call :free_port %FRONTEND_PORT%

echo 🧪 Running both services through the root npm workspace
npm run dev
exit /b %ERRORLEVEL%

:free_port
set PORT_TO_FREE=%1
echo 🔎 Checking port %PORT_TO_FREE%
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -State Listen -LocalPort %PORT_TO_FREE% -ErrorAction SilentlyContinue | Select-Object -Expand OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } catch {} }" >nul 2>&1
echo 🧹 Freed port %PORT_TO_FREE% if in use
exit /b


