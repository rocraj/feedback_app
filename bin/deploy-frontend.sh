#!/bin/bash

# ----------------------------
# bin/deploy-frontend.sh
# Build and deploy frontend to Firebase Hosting
# ----------------------------

# Exit on error
set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Navigate to frontend folder
cd "$(dirname "$0")/../frontend"

echo -e "${BLUE}Starting frontend deployment process...${NC}"

# Check if .env file exists with correct configuration
if [ ! -f ".env" ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  echo "Create a .env file with VITE_API_BASE_URL set to the backend URL."
  exit 1
fi

# Check if API URL is configured correctly
grep -q "VITE_API_BASE_URL=" .env || {
  echo -e "${RED}Error: VITE_API_BASE_URL not found in .env file!${NC}"
  echo "Please configure VITE_API_BASE_URL in the .env file."
  exit 1
}

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
  echo -e "${YELLOW}Firebase CLI not found. Installing globally...${NC}"
  npm install -g firebase-tools
fi

echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo -e "${BLUE}Building frontend application...${NC}"
npm run build

echo -e "${BLUE}Deploying to Firebase Hosting...${NC}"
# Check if user is logged in to Firebase
firebase projects:list &> /dev/null || {
  echo -e "${YELLOW}Not logged in to Firebase. Logging in...${NC}"
  firebase login
}

# Deploy to Firebase
firebase deploy --only hosting

echo -e "${GREEN}Deployment completed!${NC}"
echo -e "Frontend URL: ${BLUE}https://feedback-mini.web.app${NC}"
echo -e "Make sure your backend CORS settings include this URL."

# Reminder for testing
echo -e "${YELLOW}Don't forget to test the following:${NC}"
echo "1. Form submission"
echo "2. Magic link functionality"
echo "3. Admin access to feedback data"
echo "4. Pagination and sorting"