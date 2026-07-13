#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_URL="http://localhost:${BACKEND_PORT}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
API_URL="${API_URL:-${BACKEND_URL}/api}"
export NODE_ENV=development
export PORT="$BACKEND_PORT"
export FRONTEND_PORT
export FRONTEND_URL

command -v npm >/dev/null 2>&1 || {
  echo "❌ npm is required. Install Node.js 24 and npm 10 or newer."
  exit 1
}

echo ""
echo "🎯  cartterr portfolio"
echo "🌈✨ Booting full stack dev services"
echo "🚀 Backend: ${BACKEND_URL}  |  🔗 API: ${API_URL}"
echo "🖥️  Frontend: ${FRONTEND_URL}"
echo "🧰 npm workspaces  |  📂 ROOT=${ROOT}"
echo ""

if [ ! -x "$ROOT/node_modules/.bin/concurrently" ]; then
  echo "📦 Installing the authoritative npm workspace lockfile"
  npm install
fi

echo "🧪 Running both services through the root npm workspace"
npm run dev


