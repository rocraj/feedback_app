#!/bin/bash

# ----------------------------
# bin/start-all.sh
# Start the entire application stack (database, backend, and frontend)
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

echo -e "${BLUE}Starting Feedback Application Stack...${NC}"

# Function to display deployment info
show_deployment_info() {
  echo -e "\n${YELLOW}=== DEPLOYMENT INFORMATION ===${NC}"
  echo -e "${GREEN}The application is also available online:${NC}"
  echo -e "Frontend URL: ${BLUE}https://feedback-mini.web.app${NC}"
  echo -e "Backend URL: ${BLUE}https://feedback-backend-app.uc.r.appspot.com${NC}"
  echo -e "API docs: ${BLUE}https://feedback-backend-app.uc.r.appspot.com/docs${NC}"
}

# Function to check if a command was successful
check_status() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ $1 started successfully${NC}"
  else
    echo -e "${RED}❌ Failed to start $1${NC}"
    exit 1
  fi
}

# 1. Start PostgreSQL Database
echo -e "\n${YELLOW}Step 1/3: Starting PostgreSQL Database${NC}"
if [ -f "./bin/start-db.sh" ]; then
  ./bin/start-db.sh
  check_status "Database"
else
  echo -e "${RED}Error: start-db.sh script not found${NC}"
  exit 1
fi

# Wait for database to be fully available
echo -e "${BLUE}Waiting for database to be ready...${NC}"
sleep 5

# 2. Start FastAPI Backend
echo -e "\n${YELLOW}Step 2/3: Starting FastAPI Backend${NC}"
if [ -f "./bin/start-backend.sh" ]; then
  ./bin/start-backend.sh &
  BACKEND_PID=$!
  check_status "Backend"
  echo -e "${BLUE}Backend API running at: http://localhost:8000${NC}"
  echo -e "${BLUE}API documentation: http://localhost:8000/docs${NC}"
else
  echo -e "${RED}Error: start-backend.sh script not found${NC}"
  exit 1
fi

# Wait for backend to be fully available
echo -e "${BLUE}Waiting for backend to be ready...${NC}"
sleep 5

# 3. Start Frontend
echo -e "\n${YELLOW}Step 3/3: Starting Frontend${NC}"
if [ -f "./bin/start-frontend.sh" ]; then
  ./bin/start-frontend.sh &
  FRONTEND_PID=$!
  check_status "Frontend"
  echo -e "${BLUE}Frontend running at: http://localhost:5173${NC}"
else
  echo -e "${RED}Error: start-frontend.sh script not found${NC}"
  exit 1
fi

# Display deployment info
show_deployment_info

# Setup trap to kill background processes on script exit
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT

echo -e "\n${GREEN}All services are running!${NC}"
echo -e "Press ${YELLOW}Ctrl+C${NC} to stop all services."

# Keep the script running to keep the background processes alive
wait
