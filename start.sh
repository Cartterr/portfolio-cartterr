#!/usr/bin/env bash
set -euo pipefail

BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_URL="http://localhost:${BACKEND_PORT}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
API_URL="${API_URL:-${BACKEND_URL}/api}"

if command -v yarn >/dev/null 2>&1; then PM="yarn"; elif command -v pnpm >/dev/null 2>&1; then PM="pnpm"; else PM="npm"; fi

echo ""
echo "🎯  cartterr portfolio"
echo "🌈✨ Booting full stack dev services"
echo "🚀 Backend: ${BACKEND_URL}  |  🔗 API: ${API_URL}"
echo "🖥️  Frontend: ${FRONTEND_URL}"
echo ""

cleanup() {
  echo "🛑 Stopping services"
  set +e
  if [[ -n "${BACKEND_PID:-}" ]]; then kill "$BACKEND_PID" 2>/dev/null || true; fi
  if [[ -n "${FRONTEND_PID:-}" ]]; then kill "$FRONTEND_PID" 2>/dev/null || true; fi
  wait 2>/dev/null || true
  echo "👋 Bye"
}
trap cleanup EXIT INT TERM

(
  cd backend
  export NODE_ENV=development
  export PORT="${BACKEND_PORT}"
  export FRONTEND_URL="${FRONTEND_URL}"
  if [ "$PM" = "npm" ]; then npm run dev; else "$PM" dev; fi
) &
BACKEND_PID=$!
echo "✅ Backend starting on ${BACKEND_URL} (pid ${BACKEND_PID}) 💡 try ${API_URL}/health"

(
  cd frontend
  export NODE_ENV=development
  export VITE_API_URL="${API_URL}"
  if [ "$PM" = "npm" ]; then npm run dev; else "$PM" dev; fi
) &
FRONTEND_PID=$!
echo "✅ Frontend starting on ${FRONTEND_URL} (pid ${FRONTEND_PID}) ✨ open ${FRONTEND_URL}"

echo ""
echo "🌐 Access: 🖥️  ${FRONTEND_URL}   |   🧭 API: ${API_URL}"
echo "📦 Using: ${PM}  |  🧰 NODE_ENV=development"
echo "🟢 Both services are launching. Logs follow below. Press Ctrl+C to stop."
echo ""

wait


