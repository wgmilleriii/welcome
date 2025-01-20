# Technical Setup and Maintenance

## Initial Setup

1. Create required directories:
```bash
mkdir -p logs mp3
chmod 755 logs
```

2. Set up log protection:
```bash
echo "Deny from all" > logs/.htaccess
```

3. Install Python dependencies for waveform generation:
```bash
pip install -r requirements.txt
```

## Audio Processing

1. Generate waveform for Stravinsky:
```bash
python utils/generate_waveform.py "mp3/Stravinsky Conducts Suite From L' Histoire Du Soldat [ ezmp3.cc ].mp3" "includes/i/waveforms/stravinsky.png"
```

2. Generate waveforms for other experiences (when added):
```bash
python utils/generate_waveform.py "mp3/haydn-creation.mp3" "includes/i/waveforms/haydn.png"
python utils/generate_waveform.py "mp3/lute-singing.mp3" "includes/i/waveforms/singing.png"
```

## Log Management

1. Rotate logs daily (add to crontab):
```bash
0 0 * * * mv logs/visits.log logs/visits.$(date +\%Y\%m\%d).log
0 0 * * * mv logs/interactions.log logs/interactions.$(date +\%Y\%m\%d).log
0 0 * * * mv logs/errors.log logs/errors.$(date +\%Y\%m\%d).log
```

2. Compress old logs (add to crontab):
```bash
0 1 * * * find logs/ -name "*.log.*" -mtime +7 -exec gzip {} \;
```

3. Clean up old logs (add to crontab):
```bash
0 2 * * * find logs/ -name "*.log.*.gz" -mtime +30 -exec rm {} \;
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
*/30 * * * * find /tmp -name "sess_*" -mtime +1 -exec rm {} \;
```

2. Reset all user preferences:
```bash
php scripts/reset_preferences.php
```

## Development Commands

1. Start local PHP server:
```bash
php -S localhost:8000
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

2. Clear cache:
```bash
php scripts/clear_cache.php
```

Note: Some of these scripts need to be created as they're referenced here for completeness. They can be implemented as needed based on specific requirements. 