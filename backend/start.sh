#!/bin/sh
echo "Running migrations..."
npx drizzle-kit generate
npx drizzle-kit migrate
echo "Starting server..."
exec node -r ./paths.js dist/main.js