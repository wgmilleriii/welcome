#!/bin/bash

# Deployment script for the Parallax Mountain Experience

# Check if environment argument is provided
if [ -z "$1" ]; then
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/${TIMESTAMP}"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup current logs
echo "Backing up logs..."
tar -czf "${BACKUP_DIR}/logs_backup.tar.gz" logs/

# Backup user preferences
echo "Backing up user preferences..."
if [ -f "data/preferences.json" ]; then
    cp data/preferences.json "${BACKUP_DIR}/preferences_backup.json"
fi

# Run security checks
echo "Running security checks..."
php scripts/check_permissions.php
php scripts/security_scan.php

# Clear cache
echo "Clearing cache..."
php scripts/clear_cache.php

# Deploy based on environment
case $ENVIRONMENT in
    staging)
        echo "Deploying to staging..."
        rsync -avz --exclude 'logs/*' --exclude '.git' . user@staging-server:/var/www/staging/
        ssh user@staging-server 'cd /var/www/staging && composer install && npm install'
        ;;
    production)
        echo "Deploying to production..."
        rsync -avz --exclude 'logs/*' --exclude '.git' . user@production-server:/var/www/production/
        ssh user@production-server 'cd /var/www/production && composer install && npm install'
        ;;
    *)
        echo "Invalid environment. Use 'staging' or 'production'"
        exit 1
        ;;
esac

# Generate waveforms
echo "Generating waveforms..."
python utils/generate_waveform.py "mp3/Stravinsky Conducts Suite From L' Histoire Du Soldat [ ezmp3.cc ].mp3" "includes/i/waveforms/stravinsky.png"
python utils/generate_waveform.py "mp3/haydn-creation.mp3" "includes/i/waveforms/haydn.png"
python utils/generate_waveform.py "mp3/lute-singing.mp3" "includes/i/waveforms/singing.png"

# Set proper permissions
echo "Setting permissions..."
chmod 755 logs
chmod 644 logs/.htaccess
chmod 644 logs/*.log

# Clear PHP opcache
echo "Clearing PHP opcache..."
curl -X GET http://localhost/clear-opcache.php

echo "Deployment complete!"
echo "Backup stored in: ${BACKUP_DIR}" 