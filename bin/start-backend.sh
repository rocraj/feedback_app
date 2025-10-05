#!/bin/bash

# ----------------------------
# bin/start-backend.sh
# Start FastAPI backend
# ----------------------------

# Exit on error
set -e

# Navigate to backend folder
cd "$(dirname "$0")/../backend"

# Activate virtual environment
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate
else
    echo "Virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
fi

# Run Uvicorn with auto-reload
echo "Starting FastAPI backend..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
