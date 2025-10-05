#!/bin/bash

# Backup SQLite database
# Usage: ./backup-database.sh [production|staging|development]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENV=${1:-production}

if [[ ! "$ENV" =~ ^(production|staging|development)$ ]]; then
    echo "Usage: ./backup-database.sh [production|staging|development]"
    exit 1
fi

echo -e "${GREEN}💾 Backing up $ENV database${NC}"
echo ""

# Paths
DB_PATH="/var/www/echohub/$ENV/database"
BACKUP_DIR="/var/backups/echohub"
TIMESTAMP=$(date +%Y-%m-%d-%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/${ENV}-${TIMESTAMP}.sqlite"

# Create backup directory if it doesn't exist
sudo mkdir -p "$BACKUP_DIR"

# Find all SQLite database files
echo -e "${YELLOW}Finding database files...${NC}"
FOUND_DBS=$(find "$DB_PATH" -name "*.sqlite" -type f 2>/dev/null || true)

if [ -z "$FOUND_DBS" ]; then
    echo -e "${YELLOW}⚠️  No SQLite database files found in $DB_PATH${NC}"
    exit 1
fi

# Backup each database file
echo "$FOUND_DBS" | while read -r db_file; do
    if [ -f "$db_file" ]; then
        db_name=$(basename "$db_file")
        backup_name="$BACKUP_DIR/${ENV}-${db_name%.sqlite}-${TIMESTAMP}.sqlite"

        echo -e "${YELLOW}Backing up: $db_name${NC}"
        sudo cp "$db_file" "$backup_name"
        sudo chmod 644 "$backup_name"

        # Get file size
        SIZE=$(du -h "$backup_name" | cut -f1)

        echo -e "${GREEN}✓ Backed up to: $backup_name ($SIZE)${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ Backup complete!${NC}"
echo ""
echo -e "${YELLOW}Backup location:${NC} $BACKUP_DIR"
echo ""
echo -e "${YELLOW}To restore a backup:${NC}"
echo "  sudo cp $BACKUP_DIR/${ENV}-TIMESTAMP.sqlite $DB_PATH/database.sqlite"
echo "  sudo chown www-data:www-data $DB_PATH/database.sqlite"
echo "  sudo chmod 664 $DB_PATH/database.sqlite"
echo ""
echo -e "${YELLOW}List all backups:${NC}"
echo "  ls -lh $BACKUP_DIR"
