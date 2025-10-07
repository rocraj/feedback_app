#!/bin/bash

# ----------------------------
# bin/deploy-backend.sh
# Deploy FastAPI backend to Google Cloud App Engine
# ----------------------------

# Exit on error
set -e

# Navigate to backend folder
cd "$(dirname "$0")/../backend"

echo "Deploying backend to Google Cloud App Engine..."

# Deploy with app.yaml configuration
gcloud app deploy app.yaml --quiet

echo "Deployment completed!"
echo "Backend URL: https://feedback-backend-app.uc.r.appspot.com"
echo "API docs URL: https://feedback-backend-app.uc.r.appspot.com/docs"

# Check the logs for any errors
echo "Checking deployment logs..."
gcloud app logs read --limit=20 --level=error

echo "Deployment process completed. Check the logs above for any errors."