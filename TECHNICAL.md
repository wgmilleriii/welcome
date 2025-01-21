# Technical Setup and Maintenance

## MAMP Setup

1. Configure MAMP:
```bash
# Start MAMP and ensure Apache and MySQL are running
# Set Apache port to 8888
# Set MySQL port to 8889
```

2. Set up project in MAMP:
```bash
cd /Applications/MAMP/htdocs
mkdir -p cmiller/public_html/git
cd cmiller/public_html/git
git clone [repository-url] welcome
cd welcome
```

3. Verify access:
```bash
# Visit http://localhost:8888/cmiller/public_html/git/welcome/
# You should see the mountain experience page
```

## Initial Setup

1. Create required directories:
```bash
mkdir -p logs mp3 includes/i/waveforms
chmod 755 logs includes/i/waveforms
```

2. Set up log protection:
```bash
echo "Deny from all" > logs/.htaccess
echo "Deny from all" > includes/i/waveforms/.htaccess
```

3. Install Python dependencies for waveform generation:
```bash
pip install -r requirements.txt
```

## Audio Processing

1. Process all unprocessed MP3s:
```bash
python utils/generate_waveform.py
```

2. Force regeneration of all waveforms:
```bash
python utils/generate_waveform.py --force
```

3. Custom processing options:
```bash
python utils/generate_waveform.py --mp3-dir custom/mp3/path --waveform-dir custom/waveforms/path --width 2048 --height 600
```

The script will:
- Automatically detect MP3s in the mp3/ directory
- Generate waveforms for any MP3s that don't have corresponding PNGs
- Save waveforms to includes/i/waveforms/
- Skip already processed files (unless --force is used)

## Log Management

1. Rotate logs daily (add to crontab):
```bash
0 0 * * * mv /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/visits.log /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/visits.$(date +\%Y\%m\%d).log
0 0 * * * mv /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/interactions.log /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/interactions.$(date +\%Y\%m\%d).log
0 0 * * * mv /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/errors.log /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/errors.$(date +\%Y\%m\%d).log
```

2. Compress old logs (add to crontab):
```bash
0 1 * * * find /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/ -name "*.log.*" -mtime +7 -exec gzip {} \;
```

3. Clean up old logs (add to crontab):
```bash
0 2 * * * find /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/ -name "*.log.*.gz" -mtime +30 -exec rm {} \;
```

## Analytics Scripts

1. Generate daily analytics report:
```bash
php scripts/generate_report.php --period=day
```

2. View current visitor stats:
```bash
php scripts/visitor_stats.php
```

3. Experience popularity report:
```bash
php scripts/experience_stats.php
```

## Session Management

1. Clean up expired sessions (add to crontab):
```bash
*/30 * * * * find /Applications/MAMP/tmp/php -name "sess_*" -mtime +1 -exec rm {} \;
```

2. Reset all user preferences:
```bash
php scripts/reset_preferences.php
```

## Development Commands

1. Start MAMP:
```bash
open /Applications/MAMP/MAMP.app
```

2. Watch for JavaScript changes:
```bash
npm run watch
```

3. Run linting:
```bash
npm run lint
```

## Git Branches

- `main`: Production branch
- `better`: Development branch with latest features
- `staging`: Testing branch

## Branch Management

1. Create new feature branch:
```bash
git checkout -b feature/name-of-feature
```

2. Merge to better branch:
```bash
git checkout better
git merge feature/name-of-feature
```

## Deployment

1. Deploy to staging:
```bash
./deploy.sh staging
```

2. Deploy to production:
```bash
./deploy.sh production
```

## Monitoring

1. Check error logs:
```bash
tail -f logs/errors.log
```

2. Monitor user sessions:
```bash
php scripts/monitor_sessions.php
```

3. View real-time analytics:
```bash
php scripts/realtime_stats.php
```

## Backup

1. Backup all logs:
```bash
tar -czf logs_backup_$(date +\%Y\%m\%d).tar.gz logs/
```

2. Backup user preferences:
```bash
php scripts/backup_preferences.php
```

## Security

1. Check log permissions:
```bash
php scripts/check_permissions.php
```

2. Scan for suspicious activity:
```bash
php scripts/security_scan.php
```

## Performance

1. Generate performance report:
```bash
php scripts/performance_report.php
```

2. Clear MAMP cache:
```bash
rm -rf /Applications/MAMP/tmp/php/cache/*
php scripts/clear_cache.php
```

## Troubleshooting

1. Check MAMP logs:
```bash
tail -f /Applications/MAMP/logs/php_error.log
tail -f /Applications/MAMP/logs/apache_error.log
```

2. Reset MAMP:
```bash
killall httpd
killall mysqld
open /Applications/MAMP/MAMP.app
```

3. Clear all caches:
```bash
rm -rf /Applications/MAMP/tmp/php/*
rm -rf /Applications/MAMP/tmp/php/cache/*
php scripts/clear_cache.php
```

## Technical Documentation

### Utility Scripts

#### Audio Processing
- `utils/generate_waveform.py`: Generates waveform visualizations from MP3 files
  ```bash
  python utils/generate_waveform.py                    # Process new MP3s only
  python utils/generate_waveform.py --force            # Regenerate all waveforms
  python utils/generate_waveform.py --width 2048       # Custom width
  ```

- `utils/trim_audio.py`: Trims MP3 files to specified durations
  ```bash
  python utils/trim_audio.py                          # Trim to durations in config
  python utils/trim_audio.py --duration 8             # Override duration
  ```

- `utils/validate_assets.py`: Validates all audio assets and configuration
  ```bash
  python utils/validate_assets.py                     # Verify MP3s, waveforms, and config
  ```

#### Asset Management
Each audio experience is configured in `config/audio.json` with:
- MP3 file location and duration
- Start position and volume settings
- YouTube source URL and description
- Waveform visualization settings

#### Development Commands

1. Start MAMP server:
```bash
open /Applications/MAMP/MAMP.app
```

2. Generate waveforms for new audio:
```bash
python utils/generate_waveform.py
```

3. Validate all assets:
```bash
python utils/validate_assets.py
```

4. Clear caches:
```bash
rm -rf /Applications/MAMP/tmp/php/*
php scripts/clear_cache.php
```

#### Deployment

1. Backup audio files:
```bash
cp -r audio/ audio_backup/
```

2. Process new audio:
```bash
python utils/trim_audio.py        # Trim to configured lengths
python utils/generate_waveform.py # Generate waveform images
python utils/validate_assets.py   # Verify everything
```

3. Clear caches after deployment:
```bash
php scripts/clear_cache.php
```

### Configuration Files

#### Audio Configuration (`config/audio.json`)
Defines all audio experiences with:
- File paths and durations
- Playback settings
- Source information
- Visual settings

Example:
```json
{
    "experiences": {
        "stravinsky": {
            "file": "stravinsky.mp3",
            "duration": 8.0,
            "startPosition": 0,
            "volume": 0.75,
            "fadeIn": 1.0,
            "youtube": {
                "url": "https://youtube.com/watch?v=...",
                "title": "L'Histoire du Soldat - Stravinsky conducting",
                "description": "Historical recording of Stravinsky conducting..."
            }
        }
    }
}
```

#### Maintenance

##### Log Management
```bash
# Rotate logs daily
0 0 * * * mv /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/visits.log /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/visits.$(date +\%Y\%m\%d).log

# Compress old logs
0 1 * * * find /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/ -name "*.log.*" -mtime +7 -exec gzip {} \;

# Clean up old logs
0 2 * * * find /Applications/MAMP/htdocs/cmiller/public_html/git/welcome/logs/ -name "*.log.*.gz" -mtime +30 -exec rm {} \;
```

##### Session Cleanup
```bash
# Clean expired sessions every 30 minutes
*/30 * * * * find /Applications/MAMP/tmp/php -name "sess_*" -mtime +1 -exec rm {} \;
```

Note: Some of these scripts need to be created as they're referenced here for completeness. They can be implemented as needed based on specific requirements. 