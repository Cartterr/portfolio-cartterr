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

if not exist "backend\node_modules" (
  echo 📦 Installing backend dependencies
  if "%PM%"=="npm" (
    pushd backend && npm install && popd
  ) else (
    if "%PM%"=="yarn" (
      pushd backend && yarn install && popd
    ) else (
      pushd backend && pnpm install && popd
    )
  )
)

if not exist "frontend\node_modules" (
  echo 📦 Installing frontend dependencies
  if "%PM%"=="npm" (
    pushd frontend && npm install && popd
  ) else (
    if "%PM%"=="yarn" (
      pushd frontend && yarn install && popd
    ) else (
      pushd frontend && pnpm install && popd
    )
  )
)

if "%PM%"=="npm" (
  start /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && npm run dev"
) else (
  if "%PM%"=="yarn" (
    start /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && yarn dev"
  ) else (
    start /b cmd /c "cd /d backend && set NODE_ENV=development && set PORT=%BACKEND_PORT% && set FRONTEND_URL=http://localhost:%FRONTEND_PORT% && pnpm dev"
  )
)
echo ✅ Backend starting on http://localhost:%BACKEND_PORT%  💡 try %API_URL%/health

if "%PM%"=="npm" (
  start /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && npm run dev -- --port %FRONTEND_PORT%"
) else (
  if "%PM%"=="yarn" (
    start /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && yarn dev --port %FRONTEND_PORT%"
  ) else (
    start /b cmd /c "cd /d frontend && set NODE_ENV=development && set VITE_API_URL=%API_URL% && pnpm dev --port %FRONTEND_PORT%"
  )
)
echo ✅ Frontend starting on http://localhost:%FRONTEND_PORT%  ✨ open http://localhost:%FRONTEND_PORT%

echo.
echo 🌐 Access: 🖥️  http://localhost:%FRONTEND_PORT%   ^|   🧭 API: %API_URL%
echo 📦 Using: %PM%  ^|  🧰 NODE_ENV=development
echo 🟢 Both services are launching. Logs follow below. Press Ctrl+C to stop.
echo.

:loop
timeout /t 3600 >nul
goto loop


