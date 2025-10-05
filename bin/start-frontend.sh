#!/bin/bash

# bin/start-frontend.sh
# This script starts the React + Vite frontend

# Exit immediately if a command exits with a non-zero status
set -e

# Navigate to the frontend directory (adjust if needed)
FRONTEND_DIR="$(dirname "$0")/../frontend"
cd "$FRONTEND_DIR"

# Check if node_modules exists, install dependencies if not
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start Vite frontend
echo "Starting React + Vite frontend..."
npm run dev
