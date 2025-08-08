@echo off
chcp 65001 >nul
setlocal enableextensions
set "ROOT=%~dp0"
cd /d "%ROOT%"

if "%BACKEND_PORT%"=="" set BACKEND_PORT=5000
if "%FRONTEND_PORT%"=="" set FRONTEND_PORT=3000
set API_URL=http://localhost:%BACKEND_PORT%/api

where yarn >nul 2>nul && set PM=yarn
if not defined PM (where pnpm >nul 2>nul && set PM=pnpm)
if not defined PM set PM=npm

echo.
echo 🎯  cartterr portfolio
echo 🌈✨ Booting full stack dev services
echo 🚀 Backend: http://localhost:%BACKEND_PORT%  ^|  🔗 API: %API_URL%
echo 🖥️  Frontend: http://localhost:%FRONTEND_PORT%
echo 🧰 PM=%PM%  ^|  📂 ROOT=%ROOT%  ^|  📍 CWD=%CD%
if not exist "%ROOT%backend" echo ❌ Missing directory: %ROOT%backend
if not exist "%ROOT%frontend" echo ❌ Missing directory: %ROOT%frontend
echo.

if not exist "%ROOT%backend\node_modules" call :install_backend
if not exist "%ROOT%backend\node_modules\.bin\tsx" call :install_backend
if not exist "%ROOT%backend\node_modules\nodemailer" call :install_backend
if not exist "%ROOT%frontend\node_modules" call :install_frontend
if not exist "%ROOT%frontend\node_modules\.bin\vite" call :install_frontend
if not exist "%ROOT%node_modules\.bin\concurrently.cmd" call :install_root

call :free_port %BACKEND_PORT%
call :free_port %FRONTEND_PORT%

set BACK_CMD=set NODE_ENV=development&& set PORT=%BACKEND_PORT%&& set FRONTEND_URL=http://localhost:%FRONTEND_PORT%&& yarn --cwd backend dev
set FRONT_CMD=set NODE_ENV=development&& set VITE_API_URL=%API_URL%&& yarn --cwd frontend dev --port %FRONTEND_PORT%
echo 🧪 running both services with concurrently
"%ROOT%node_modules\.bin\concurrently.cmd" -n frontend,backend -c magenta,blue "%FRONT_CMD%" "%BACK_CMD%"

echo.
echo 🌐 Access: 🖥️  http://localhost:%FRONTEND_PORT%   ^|   🧭 API: %API_URL%
echo 📦 Using: %PM%  ^|  🧰 NODE_ENV=development
echo.
goto :eof

:install_backend
echo 📦 Installing backend dependencies
pushd "%ROOT%backend" || (echo ❌ Cannot enter %ROOT%backend & exit /b 1)
if "%PM%"=="npm" (
  npm install
) else (
  if "%PM%"=="yarn" (
    yarn install
  ) else (
    pnpm install
  )
)
popd
exit /b

:free_port
set PORT_TO_FREE=%1
echo 🔎 Checking port %PORT_TO_FREE%
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -State Listen -LocalPort %PORT_TO_FREE% -ErrorAction SilentlyContinue | Select-Object -Expand OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue } catch {} }" >nul 2>&1
echo 🧹 Freed port %PORT_TO_FREE% if in use
exit /b

:install_frontend
echo 📦 Installing frontend dependencies
pushd "%ROOT%frontend" || (echo ❌ Cannot enter %ROOT%frontend & exit /b 1)
if "%PM%"=="npm" (
  npm install
) else (
  if "%PM%"=="yarn" (
    yarn install
  ) else (
    pnpm install
  )
)
popd
exit /b

:install_root
echo 📦 Installing root tooling
if "%PM%"=="npm" (
  npm install
) else (
  if "%PM%"=="yarn" (
    yarn install
  ) else (
    pnpm install
  )
)
exit /b

:: legacy start routines removed in favor of concurrently


