#!/usr/bin/env zsh
# scripts/start-app.sh
# Launch script for Electron-Grok (development mode)
# Usage:
#   ./scripts/start-app.sh            # normal run (starts renderer and electron)
#   ./scripts/start-app.sh --check    # dry run (prints steps only)
#   ./scripts/start-app.sh --prod     # run the packaged app in ./dist if present

set -euo pipefail
REPO_ROOT=$(cd "$(dirname "$0")/.." && pwd)
RENDERER_DIR="$REPO_ROOT/src/renderer"
PY_DIR="$REPO_ROOT/python"
VENV_DIR="$REPO_ROOT/.venv"
RENDERER_LOG="/tmp/electron-grok-renderer.log"
RENDERER_PID_FILE="/tmp/electron-grok-renderer.pid"
CHECK_MODE=false
PROD_MODE=false

for arg in "$@"; do
  case "$arg" in
    --check) CHECK_MODE=true ;;
    --prod) PROD_MODE=true ;;
    -h|--help)
      echo "Usage: $0 [--check] [--prod]"
      exit 0
      ;;
    *) ;;
  esac
done

echo "[start-app] repo root: $REPO_ROOT"

if $CHECK_MODE; then
  echo "[start-app] Running in --check (dry-run) mode. No processes will be started."
fi

# Helper: load .env if present (simple KEY=VALUE lines)
load_env() {
  local envfile="$REPO_ROOT/.env"
  if [[ -f "$envfile" ]]; then
    echo "[start-app] Loading .env"
    while IFS= read -r line; do
      [[ "$line" =~ ^#.*$ ]] && continue
      [[ -z "$line" ]] && continue
      if [[ "$line" =~ ^([^=]+)=(.*)$ ]]; then
        key=${match[1]}
        val=${match[2]}
        export "$key=$val"
      fi
    done < "$envfile"
  fi
}

load_env

# Quick requirements check
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[start-app] ERROR: required command '$1' not found in PATH." >&2
    if $CHECK_MODE; then
      echo "[start-app] (check mode) would recommend installing $1";
    else
      exit 1
    fi
  fi
}

require_cmd node
require_cmd npm
require_cmd python3

# Optionally run packaged app
if $PROD_MODE; then
  echo "[start-app] PROD mode: running packaged app if available in ./dist"
  if $CHECK_MODE; then
    echo "[start-app] (check) would look for artifacts in $REPO_ROOT/dist"
    exit 0
  fi
  # Find a .app in dist
  APP_PATH=$(find "$REPO_ROOT/dist" -maxdepth 2 -name "*.app" -print -quit || true)
  if [[ -n "$APP_PATH" ]]; then
    echo "[start-app] Opening app: $APP_PATH"
    open "$APP_PATH"
    exit 0
  else
    echo "[start-app] No .app found in dist; try building first (npm run build)" >&2
    exit 1
  fi
fi

# Create venv and install python deps if needed
if [[ ! -d "$VENV_DIR" ]]; then
  echo "[start-app] Creating Python venv at $VENV_DIR"
  if $CHECK_MODE; then
    echo "[start-app] (check) python3 -m venv $VENV_DIR";
  else
    python3 -m venv "$VENV_DIR"
  fi
fi

if $CHECK_MODE; then
  echo "[start-app] (check) would activate venv and run pip install -r python/requirements.txt"
else
  # shellcheck disable=SC1090
  source "$VENV_DIR/bin/activate"
  if [[ -f "$PY_DIR/requirements.txt" ]]; then
    echo "[start-app] Installing Python requirements..."
    pip install --upgrade pip >/dev/null
    pip install -r "$PY_DIR/requirements.txt"
  fi
fi

# Install node deps at root and renderer if missing
if [[ ! -d "$REPO_ROOT/node_modules" ]]; then
  echo "[start-app] Installing root npm dependencies (npm install)"
  if $CHECK_MODE; then
    echo "[start-app] (check) npm install in $REPO_ROOT";
  else
    (cd "$REPO_ROOT" && npm install)
  fi
fi

if [[ ! -d "$RENDERER_DIR/node_modules" ]]; then
  echo "[start-app] Installing renderer npm dependencies (npm install)"
  if $CHECK_MODE; then
    echo "[start-app] (check) npm install in $RENDERER_DIR";
  else
    (cd "$RENDERER_DIR" && npm install)
  fi
fi

# Ensure @tailwindcss/postcss is installed (common issue)
if $CHECK_MODE; then
  echo "[start-app] (check) Would ensure @tailwindcss/postcss is installed in renderer devDependencies"
else
  if ! grep -q "@tailwindcss/postcss" "$RENDERER_DIR/package.json" 2>/dev/null; then
    echo "[start-app] adding @tailwindcss/postcss to renderer devDependencies"
    (cd "$RENDERER_DIR" && npm install -D @tailwindcss/postcss)
  fi
fi

# Renderer start
start_renderer() {
  echo "[start-app] Starting renderer dev server (Vite)"
  if $CHECK_MODE; then
    echo "[start-app] (check) cd $RENDERER_DIR && npm run dev"
    return 0
  fi

  # Kill any existing renderer started by this script
  if [[ -f "$RENDERER_PID_FILE" ]]; then
    oldpid=$(cat "$RENDERER_PID_FILE")
    if ps -p "$oldpid" >/dev/null 2>&1; then
      echo "[start-app] Killing old renderer pid $oldpid"
      kill "$oldpid" || true
    fi
    rm -f "$RENDERER_PID_FILE"
  fi

  (cd "$RENDERER_DIR" && npm run dev > "$RENDERER_LOG" 2>&1 &)
  echo $! > "$RENDERER_PID_FILE"
  echo "[start-app] Renderer started (pid=$(cat $RENDERER_PID_FILE)), logs: $RENDERER_LOG"

  # Wait for port 5173 to be available
  echo "[start-app] Waiting for renderer to respond at http://localhost:5173 ..."
  for i in {1..60}; do
    if curl -sSf --max-time 1 http://localhost:5173/ >/dev/null 2>&1; then
      echo "[start-app] Renderer is up"
      return 0
    fi
    sleep 1
  done
  echo "[start-app] ERROR: renderer did not respond within 60s. Tail of log:"
  tail -n 200 "$RENDERER_LOG" || true
  return 1
}

# Start renderer (unless already up)
if curl -sSf --max-time 1 http://localhost:5173/ >/dev/null 2>&1; then
  echo "[start-app] Renderer already responding at http://localhost:5173"
else
  start_renderer
fi

# Trap to clean up background renderer when this script exits
cleanup() {
  if [[ -f "$RENDERER_PID_FILE" ]]; then
    pid=$(cat "$RENDERER_PID_FILE")
    echo "[start-app] Stopping renderer (pid=$pid)"
    kill "$pid" || true
    rm -f "$RENDERER_PID_FILE"
  fi
}
trap cleanup EXIT

# Ensure XAI_API_KEY is set
if [[ -z "${XAI_API_KEY:-}" ]]; then
  echo "[start-app] WARNING: XAI_API_KEY is not set. The app will error if required."
  echo "[start-app] Set it now (export XAI_API_KEY=...) or put it in .env and rerun."
  if $CHECK_MODE; then
    echo "[start-app] (check) would prompt or exit"
  fi
fi

# Launch electron in foreground to show logs
echo "[start-app] Launching Electron..."
if $CHECK_MODE; then
  echo "[start-app] (check) cd $REPO_ROOT && npm run start"
  exit 0
else
  (cd "$REPO_ROOT" && npm run start)
fi

# script will continue until electron exits, then cleanup trap fires


