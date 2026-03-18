#!/usr/bin/env bash
set -euo pipefail

cd /app

if [[ ! -f package.json ]]; then
  echo "package.json nao encontrado em /app"
  exec tail -f /dev/null
fi

if [[ ! -d node_modules ]] || [[ ! -x node_modules/.bin/prisma ]] || [[ ! -x node_modules/.bin/tsx ]]; then
  npm install
fi

npx prisma generate
npx prisma migrate deploy
npm run db:seed

exec "$@"
