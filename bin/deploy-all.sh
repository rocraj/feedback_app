#!/bin/bash

# ----------------------------
# bin/deploy-all.sh
# Deploy both backend and frontend
# ----------------------------

# Exit on error
set -e

# Colors for terminal output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Navigate to the project root directory
cd "$(dirname "$0")/.."

echo -e "${BLUE}=== FEEDBACK APP FULL DEPLOYMENT ===${NC}"

# Function to check if a command was successful
check_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1 completed successfully${NC}"
  else
    echo -e "${RED}❌ $1 failed${NC}"
    exit 1
  fi
}

# 1. Deploy Backend to Google Cloud App Engine
echo -e "\n${YELLOW}Step 1/2: Deploying Backend to Google Cloud App Engine${NC}"
if [ -f "./bin/deploy-backend.sh" ]; then
  ./bin/deploy-backend.sh
  check_status "Backend deployment"
  echo -e "${BLUE}Backend deployed to: https://feedback-backend-app.uc.r.appspot.com${NC}"
else
  echo -e "${RED}Error: deploy-backend.sh script not found${NC}"
  exit 1
fi

# 2. Deploy Frontend to Firebase Hosting
echo -e "\n${YELLOW}Step 2/2: Deploying Frontend to Firebase Hosting${NC}"
if [ -f "./bin/deploy-frontend.sh" ]; then
  ./bin/deploy-frontend.sh
  check_status "Frontend deployment"
  echo -e "${BLUE}Frontend deployed to: https://feedback-mini.web.app${NC}"
else
  echo -e "${RED}Error: deploy-frontend.sh script not found${NC}"
  exit 1
fi

echo -e "\n${GREEN}=== DEPLOYMENT COMPLETED SUCCESSFULLY ===${NC}"
echo -e "Frontend: ${BLUE}https://feedback-mini.web.app${NC}"
echo -e "Backend: ${BLUE}https://feedback-backend-app.uc.r.appspot.com${NC}"
echo -e "API docs: ${BLUE}https://feedback-backend-app.uc.r.appspot.com/docs${NC}"
echo -e "\n${YELLOW}Don't forget to test the application to ensure everything is working properly!${NC}"