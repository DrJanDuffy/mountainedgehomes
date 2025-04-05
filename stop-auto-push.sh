
#!/bin/bash

# Colorful output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${YELLOW}     STOPPING AUTO-PUSH SERVICE...      ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Check if the PID file exists
if [ -f "auto-push.pid" ]; then
    PID=$(cat auto-push.pid)
    
    # Check if the process is still running
    if ps -p $PID > /dev/null; then
        echo -e "${BLUE}Stopping auto-push process with PID: ${PID}${NC}"
        kill $PID
        
        # Verify the process was killed
        sleep 2
        if ps -p $PID > /dev/null; then
            echo -e "${RED}Failed to stop process gracefully. Forcing termination...${NC}"
            kill -9 $PID
        fi
        
        # Remove the lock file if it exists
        if [ -f "auto-push.js.lock" ]; then
            rm auto-push.js.lock
            echo -e "${BLUE}Removed lock file.${NC}"
        fi
        
        echo -e "${GREEN}Auto-push service stopped successfully!${NC}"
    else
        echo -e "${YELLOW}Process with PID ${PID} is not running.${NC}"
    fi
    
    # Remove the PID file
    rm auto-push.pid
else
    echo -e "${YELLOW}No auto-push service appears to be running.${NC}"
    
    # Try to kill any process regardless
    pkill -f "node auto-push.js" || true
    
    # Remove the lock file if it exists
    if [ -f "auto-push.js.lock" ]; then
        rm auto-push.js.lock
        echo -e "${BLUE}Removed lock file.${NC}"
    fi
fi

echo -e "${BLUE}=================================================${NC}"
echo -e "${GREEN}Auto-push service has been stopped.${NC}"
echo -e "${BLUE}=================================================${NC}"
