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
if not exist "%ROOT%frontend\node_modules" call :install_frontend

call :start_backend
call :start_frontend

echo.
echo 🌐 Access: 🖥️  http://localhost:%FRONTEND_PORT%   ^|   🧭 API: %API_URL%
echo 📦 Using: %PM%  ^|  🧰 NODE_ENV=development
echo 🟢 Both services are launching. Logs follow below. Press Ctrl+C to stop.
echo.

:loop
timeout /t 3600 >nul
goto loop

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

:start_backend
set "BACK_CMD=cd /d \"%ROOT%backend\" && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% &&"
echo 🧪 backend cmd: %BACK_CMD% %PM% run dev
if "%PM%"=="npm" (
  start "backend" /b cmd /c "%BACK_CMD% npm run dev"
) else (
  if "%PM%"=="yarn" (
    start "backend" /b cmd /c "%BACK_CMD% yarn dev"
  ) else (
    start "backend" /b cmd /c "%BACK_CMD% pnpm dev"
  )
)
echo ✅ Backend starting on http://localhost:%BACKEND_PORT%  💡 try %API_URL%/health
exit /b

:start_frontend
set "FRONT_CMD=cd /d \"%ROOT%frontend\" && set NODE_ENV=development && set VITE_API_URL=%API_URL% &&"
echo 🧪 frontend cmd: %FRONT_CMD% %PM% run dev
if "%PM%"=="npm" (
  start "frontend" /b cmd /c "%FRONT_CMD% npm run dev -- --port %FRONTEND_PORT%"
) else (
  if "%PM%"=="yarn" (
    start "frontend" /b cmd /c "%FRONT_CMD% yarn dev --port %FRONTEND_PORT%"
  ) else (
    start "frontend" /b cmd /c "%FRONT_CMD% pnpm dev --port %FRONTEND_PORT%"
  )
)
echo ✅ Frontend starting on http://localhost:%FRONTEND_PORT%  ✨ open http://localhost:%FRONTEND_PORT%
exit /b


