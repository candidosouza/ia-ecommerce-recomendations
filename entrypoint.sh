#!/usr/bin/env bash
set -euo pipefail

cd /app

if [[ ! -f package.json ]]; then
  echo "package.json nao encontrado em /app"
  exec tail -f /dev/null
fi

if [[ ! -d node_modules || ! -x node_modules/.bin/vite ]]; then
  if [[ -f package-lock.json ]]; then
    npm ci
  else
    npm install
  fi
fi

exec "$@"
