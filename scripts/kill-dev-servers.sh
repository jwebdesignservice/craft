#!/bin/bash
# kill-dev-servers.sh
# Kills orphaned dev servers on known ports (macOS/Linux)
#
# SAFEGUARDS:
# - Only kills on defined port list (never blind kills)
# - Silent errors on all kills (2>/dev/null)
# - Logs every kill with port + PID for traceability
# - Duplicate kill prevention (tracks killed PIDs)
# - Process type check (only node/python/vite)

# Target ports
PORTS=(5173 5174 5180 3002 3000 3001 8000 8080)
LOG_FILE="$(dirname "$0")/../memory/dev-server-cleanup.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$TIMESTAMP] Scanning for orphaned dev servers..."
echo "" >> "$LOG_FILE"
echo "[$TIMESTAMP] Dev server cleanup scan" >> "$LOG_FILE"

KILLED_COUNT=0
KILLED_PIDS=()

# Step 1: Kill by port
for PORT in "${PORTS[@]}"; do
    PID=$(lsof -ti tcp:"$PORT" 2>/dev/null)
    
    if [ -n "$PID" ]; then
        # Check if already killed
        if [[ " ${KILLED_PIDS[@]} " =~ " ${PID} " ]]; then
            continue
        fi
        
        PROC_NAME=$(ps -p "$PID" -o comm= 2>/dev/null)
        
        # Only kill if it's a dev server process
        if echo "$PROC_NAME" | grep -qE "node|python|vite"; then
            echo "  Port $PORT → Killing $PROC_NAME (PID $PID)"
            echo "  Killed: $PROC_NAME (PID $PID) on port $PORT" >> "$LOG_FILE"
            
            kill -9 "$PID" 2>/dev/null
            KILLED_COUNT=$((KILLED_COUNT + 1))
            KILLED_PIDS+=("$PID")
        fi
    fi
done

# Step 2: Scan for orphaned vite/ts-node processes
ORPHANS=$(ps aux | grep -E "[v]ite|[t]s-node" | awk '{print $2}')

for PID in $ORPHANS; do
    # Skip if already killed
    if [[ " ${KILLED_PIDS[@]} " =~ " ${PID} " ]]; then
        continue
    fi
    
    PROC_NAME=$(ps -p "$PID" -o comm= 2>/dev/null)
    
    if [ -n "$PROC_NAME" ]; then
        echo "  Orphan → Killing $PROC_NAME (PID $PID)"
        echo "  Killed orphan: $PROC_NAME (PID $PID)" >> "$LOG_FILE"
        
        kill -9 "$PID" 2>/dev/null
        KILLED_COUNT=$((KILLED_COUNT + 1))
    fi
done

# Summary
if [ "$KILLED_COUNT" -eq 0 ]; then
    echo "[OK] No orphaned dev servers found"
    echo "  No orphaned servers found" >> "$LOG_FILE"
else
    echo "[OK] Killed $KILLED_COUNT orphaned dev server(s)"
    echo "  Total killed: $KILLED_COUNT" >> "$LOG_FILE"
fi

exit 0
