@echo off
chcp 65001 >nul
setlocal enableextensions

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
echo.

if not exist "backend\node_modules" call :install_backend
if not exist "frontend\node_modules" call :install_frontend

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
pushd backend
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
pushd frontend
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
if "%PM%"=="npm" (
  start "backend" /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && npm run dev"
) else (
  if "%PM%"=="yarn" (
    start "backend" /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && yarn dev"
  ) else (
    start "backend" /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && pnpm dev"
  )
)
echo ✅ Backend starting on http://localhost:%BACKEND_PORT%  💡 try %API_URL%/health
exit /b

:start_frontend
if "%PM%"=="npm" (
  start "frontend" /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && npm run dev -- --port %FRONTEND_PORT%"
) else (
  if "%PM%"=="yarn" (
    start "frontend" /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && yarn dev --port %FRONTEND_PORT%"
  ) else (
    start "frontend" /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && pnpm dev --port %FRONTEND_PORT%"
  )
)
echo ✅ Frontend starting on http://localhost:%FRONTEND_PORT%  ✨ open http://localhost:%FRONTEND_PORT%
exit /b


