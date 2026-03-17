#!/bin/bash
# memory-monitor.sh
# Monitors free RAM and alerts when it drops below threshold (macOS)

THRESHOLD=500  # MB
COOLDOWN=1800  # 30 minutes in seconds
SHIELD_DIR="$HOME/.openclaw/workspace/shield-actions"
LOG_FILE="$(dirname "$0")/../memory/memory-monitor.log"

# Ensure shield-actions directory exists
mkdir -p "$SHIELD_DIR"

# Get free RAM (Pages free + Pages inactive) × 4096 / 1048576
FREE_MB=$(vm_stat | awk '/Pages free/{f=$3+0}/Pages inactive/{i=$3+0}END{printf "%.0f", (f+i)*4096/1048576}')

# Get memory pressure %
PRESSURE_PCT=$(memory_pressure | grep -oE '[0-9]+%' | tail -1 | tr -d '%')

# Get timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Always log current stats
echo "$TIMESTAMP | Free: ${FREE_MB}MB | Pressure: ${PRESSURE_PCT}%" | tee -a "$LOG_FILE"

# Check if we should alert
if [ "$FREE_MB" -lt "$THRESHOLD" ]; then
    # Check cooldown - find most recent alert file
    LAST_ALERT=$(ls -t "$SHIELD_DIR"/*-memory-alert.json 2>/dev/null | head -1)
    
    SHOULD_ALERT=true
    if [ -n "$LAST_ALERT" ]; then
        LAST_ALERT_TIME=$(stat -f %m "$LAST_ALERT" 2>/dev/null)
        NOW=$(date +%s)
        TIME_SINCE=$((NOW - LAST_ALERT_TIME))
        
        if [ "$TIME_SINCE" -lt "$COOLDOWN" ]; then
            SHOULD_ALERT=false
            MINUTES_AGO=$((TIME_SINCE / 60))
            echo "[COOLDOWN] Last alert was ${MINUTES_AGO} min ago (cooldown: 30 min)"
        fi
    fi
    
    if [ "$SHOULD_ALERT" = true ]; then
        echo "⚠️ LOW MEMORY ALERT: Only ${FREE_MB}MB free (threshold: ${THRESHOLD}MB)"
        
        # Write Shield dashboard alert file
        ALERT_TIMESTAMP=$(date '+%Y%m%d-%H%M%S')
        ALERT_FILE="$SHIELD_DIR/$ALERT_TIMESTAMP-memory-alert.json"
        
        cat > "$ALERT_FILE" <<EOF
{
  "type": "memory_alert",
  "timestamp": "$(date -u '+%Y-%m-%dT%H:%M:%S')",
  "free_mb": $FREE_MB,
  "pressure_pct": $PRESSURE_PCT,
  "message": "Low memory: Only ${FREE_MB}MB free (threshold: ${THRESHOLD}MB)"
}
EOF
        
        echo "⚠️ ALERT: Low memory condition detected - Shield alert written" >> "$LOG_FILE"
        
        # Show top memory consumers
        echo "Top 5 memory consumers:"
        ps aux | sort -rn -k 4 | head -5 | awk '{printf "  %s (%.1f%% RAM)\n", $11, $4}'
    fi
else
    echo "[OK] Memory OK: ${FREE_MB}MB free"
fi

exit 0
