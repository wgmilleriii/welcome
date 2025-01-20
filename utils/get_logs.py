#!/usr/bin/env python3
import os
import shutil
import glob
import time
from datetime import datetime

def setup_log_dir():
    """Create logs directory if it doesn't exist."""
    log_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'logs')
    debug_dir = os.path.join(log_dir, 'debug')
    os.makedirs(debug_dir, exist_ok=True)
    return debug_dir

def get_downloads_dir():
    """Get the user's Downloads directory."""
    return os.path.expanduser('~/Downloads')

def move_log_files():
    """Move localhost log files from Downloads to logs/debug directory."""
    downloads_dir = get_downloads_dir()
    debug_dir = setup_log_dir()
    
    # Find all localhost log files in Downloads
    pattern = os.path.join(downloads_dir, 'localhost-*.log')
    log_files = glob.glob(pattern)
    
    if not log_files:
        print("No localhost log files found in Downloads")
        return
    
    for log_file in log_files:
        # Get timestamp from filename
        try:
            timestamp = int(log_file.split('-')[1].split('.')[0])
            date_str = datetime.fromtimestamp(timestamp/1000).strftime('%Y%m%d_%H%M%S')
        except:
            date_str = time.strftime('%Y%m%d_%H%M%S')
        
        # Create new filename
        new_name = f'console_{date_str}.log'
        dest_path = os.path.join(debug_dir, new_name)
        
        # Move file
        shutil.move(log_file, dest_path)
        print(f"Moved {os.path.basename(log_file)} to {dest_path}")
        
        # Display contents
        print("\nLog contents:")
        print("-" * 80)
        with open(dest_path, 'r') as f:
            print(f.read())
        print("-" * 80)

if __name__ == '__main__':
    move_log_files() 