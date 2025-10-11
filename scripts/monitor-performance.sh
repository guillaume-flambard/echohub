#!/bin/bash

# EchoHub Performance Monitoring Script
# Usage: ./scripts/monitor-performance.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     EchoHub Performance Monitoring Dashboard          ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if database exists
if [ ! -f "database/database.sqlite" ]; then
    echo -e "${RED}✗ Database not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}📊 DATABASE PERFORMANCE${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check indexes on contacts table
CONTACTS_INDEXES=$(sqlite3 database/database.sqlite "PRAGMA index_list('contacts');" | wc -l)
echo -e "Contacts Table Indexes: ${GREEN}$CONTACTS_INDEXES${NC}"

sqlite3 database/database.sqlite "PRAGMA index_list('contacts');" | while read line; do
    INDEX_NAME=$(echo "$line" | cut -d'|' -f2)
    echo "  └─ $INDEX_NAME"
done

echo ""

# Check indexes on minerva_contexts table
MINERVA_INDEXES=$(sqlite3 database/database.sqlite "PRAGMA index_list('minerva_contexts');" | wc -l)
echo -e "Minerva Contexts Table Indexes: ${GREEN}$MINERVA_INDEXES${NC}"

sqlite3 database/database.sqlite "PRAGMA index_list('minerva_contexts');" | while read line; do
    INDEX_NAME=$(echo "$line" | cut -d'|' -f2)
    echo "  └─ $INDEX_NAME"
done

echo ""

# Check indexes on apps table
APPS_INDEXES=$(sqlite3 database/database.sqlite "PRAGMA index_list('apps');" | wc -l)
echo -e "Apps Table Indexes: ${GREEN}$APPS_INDEXES${NC}"

sqlite3 database/database.sqlite "PRAGMA index_list('apps');" | while read line; do
    INDEX_NAME=$(echo "$line" | cut -d'|' -f2)
    echo "  └─ $INDEX_NAME"
done

echo ""
echo -e "${YELLOW}📈 DATABASE STATISTICS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Count records
CONTACTS_COUNT=$(sqlite3 database/database.sqlite "SELECT COUNT(*) FROM contacts;")
CONTEXTS_COUNT=$(sqlite3 database/database.sqlite "SELECT COUNT(*) FROM minerva_contexts;")
APPS_COUNT=$(sqlite3 database/database.sqlite "SELECT COUNT(*) FROM apps;")
USERS_COUNT=$(sqlite3 database/database.sqlite "SELECT COUNT(*) FROM users;")

echo -e "Total Users:            ${GREEN}$USERS_COUNT${NC}"
echo -e "Total Contacts:         ${GREEN}$CONTACTS_COUNT${NC}"
echo -e "Total Apps:             ${GREEN}$APPS_COUNT${NC}"
echo -e "Total Minerva Contexts: ${GREEN}$CONTEXTS_COUNT${NC}"

echo ""
echo -e "${YELLOW}💾 CACHE CONFIGURATION${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check cache configuration
CACHE_DRIVER=$(grep "CACHE_STORE=" .env 2>/dev/null | cut -d'=' -f2)
if [ -z "$CACHE_DRIVER" ]; then
    CACHE_DRIVER="file (default)"
fi

echo -e "Cache Driver: ${BLUE}$CACHE_DRIVER${NC}"

# If Redis, check connection
if [[ "$CACHE_DRIVER" == "redis" ]]; then
    if command -v redis-cli &> /dev/null; then
        if redis-cli ping &> /dev/null; then
            echo -e "Redis Status: ${GREEN}✓ Connected${NC}"
            REDIS_KEYS=$(redis-cli DBSIZE | cut -d':' -f2)
            echo -e "Redis Keys: ${GREEN}$REDIS_KEYS${NC}"

            # Count Minerva context cache keys
            MINERVA_CACHE_KEYS=$(redis-cli KEYS "minerva_context*" | wc -l)
            echo -e "Minerva Cache Keys: ${GREEN}$MINERVA_CACHE_KEYS${NC}"
        else
            echo -e "Redis Status: ${RED}✗ Not Connected${NC}"
        fi
    else
        echo -e "Redis CLI: ${YELLOW}⚠ Not Installed${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}🧪 TEST STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Run tests and capture output
TEST_OUTPUT=$(php artisan test --compact 2>&1)
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -eq 0 ]; then
    # Extract test count
    TEST_COUNT=$(echo "$TEST_OUTPUT" | grep -oE "[0-9]+ passed" | grep -oE "[0-9]+")
    echo -e "Tests: ${GREEN}✓ $TEST_COUNT passed${NC}"
else
    echo -e "Tests: ${RED}✗ Some tests failing${NC}"
    echo -e "${YELLOW}Run 'php artisan test' for details${NC}"
fi

echo ""
echo -e "${YELLOW}📦 BUILD STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if build artifacts exist
if [ -f "public/build/manifest.json" ]; then
    MANIFEST_HASH=$(md5 -q public/build/manifest.json 2>/dev/null || md5sum public/build/manifest.json | cut -d' ' -f1)
    echo -e "Frontend Build: ${GREEN}✓ Built${NC}"
    echo -e "Manifest Hash: ${BLUE}${MANIFEST_HASH:0:8}${NC}"

    # Count built assets
    ASSET_COUNT=$(ls -1 public/build/assets/*.js public/build/assets/*.css 2>/dev/null | wc -l)
    echo -e "Total Assets: ${GREEN}$ASSET_COUNT files${NC}"
else
    echo -e "Frontend Build: ${RED}✗ Not Built${NC}"
    echo -e "${YELLOW}Run 'npm run build' to build assets${NC}"
fi

echo ""
echo -e "${YELLOW}🔒 SECURITY STATUS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check rate limiting configuration
if grep -q "throttle:" routes/api.php; then
    echo -e "Rate Limiting: ${GREEN}✓ Configured${NC}"
    echo "  └─ Messages: 20/minute"
    echo "  └─ AI Settings: 10/minute"
    echo "  └─ External API: 60/minute"
else
    echo -e "Rate Limiting: ${YELLOW}⚠ Not Configured${NC}"
fi

echo ""
echo -e "${YELLOW}📁 FILE CHANGES${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Show recent changes
UNCOMMITTED=$(git status --short 2>/dev/null | wc -l)
if [ $UNCOMMITTED -gt 0 ]; then
    echo -e "Uncommitted Changes: ${YELLOW}$UNCOMMITTED files${NC}"
    echo -e "${BLUE}Run 'git status' for details${NC}"
else
    echo -e "Git Status: ${GREEN}✓ Clean${NC}"
fi

echo ""
echo -e "${YELLOW}🚀 DEPLOYMENT READINESS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate readiness score
SCORE=0
MAX_SCORE=8

[ $CONTACTS_INDEXES -ge 2 ] && SCORE=$((SCORE + 1))
[ $MINERVA_INDEXES -ge 2 ] && SCORE=$((SCORE + 1))
[ $APPS_INDEXES -ge 2 ] && SCORE=$((SCORE + 1))
[ $TEST_EXIT_CODE -eq 0 ] && SCORE=$((SCORE + 1))
[ -f "public/build/manifest.json" ] && SCORE=$((SCORE + 1))
grep -q "throttle:" routes/api.php && SCORE=$((SCORE + 1))
[ $UNCOMMITTED -eq 0 ] && SCORE=$((SCORE + 1))
[ -f "app/Http/Requests/SendMessageRequest.php" ] && SCORE=$((SCORE + 1))

PERCENTAGE=$((SCORE * 100 / MAX_SCORE))

if [ $PERCENTAGE -ge 90 ]; then
    COLOR=$GREEN
    STATUS="EXCELLENT ✓"
elif [ $PERCENTAGE -ge 70 ]; then
    COLOR=$YELLOW
    STATUS="GOOD ⚠"
else
    COLOR=$RED
    STATUS="NEEDS WORK ✗"
fi

echo -e "Readiness Score: ${COLOR}$SCORE/$MAX_SCORE ($PERCENTAGE%) - $STATUS${NC}"

echo ""
echo -e "${BLUE}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Next Steps:                                           ║${NC}"
echo -e "${BLUE}║  1. Visit /telescope to monitor queries                ║${NC}"
echo -e "${BLUE}║  2. Check cache hit rates after 100 requests           ║${NC}"
echo -e "${BLUE}║  3. Monitor response times in Telescope/Requests       ║${NC}"
echo -e "${BLUE}║  4. Review DEPLOYMENT_GUIDE.md for details             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════╝${NC}"
echo ""
