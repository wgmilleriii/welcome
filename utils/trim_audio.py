#!/usr/bin/env python3
import os
import subprocess
import json
from pathlib import Path

def load_audio_config():
    """Load audio configuration to get start positions."""
    try:
        with open('config/audio.json', 'r') as f:
            config = json.load(f)
            return config
    except Exception as e:
        print(f"Error loading audio config: {e}")
        return None

def trim_audio(input_file, output_file, start_time, duration, fade_in=0, fade_out=0):
    """Trim audio file to specified duration starting from start_time."""
    try:
        fade_filter = 'volume=1.0'
        if fade_in > 0 or fade_out > 0:
            fade_filter = 'afade=t=in:st=0:d=' + str(fade_in) if fade_in > 0 else 'volume=1.0'
            if fade_out > 0:
                fade_start = duration - fade_out
                fade_filter += ',afade=t=out:st=' + str(fade_start) + ':d=' + str(fade_out)
            
        cmd = [
            'ffmpeg',
            '-y',  # Overwrite output file if exists
            '-i', input_file,  # Input file
            '-ss', str(start_time),  # Start time
            '-t', str(duration),  # Duration
            '-af', fade_filter,  # Add fade effects
            '-acodec', 'libmp3lame',  # Use MP3 codec
            '-q:a', '2',  # High quality (0-9, lower is better)
            output_file
        ]
        
        print(f"Trimming {input_file} -> {output_file}")
        print(f"Duration: {duration}s, Start: {start_time}s")
        if fade_in > 0:
            print(f"Fade in: {fade_in}s")
        if fade_out > 0:
            print(f"Fade out: {fade_out}s starting at {fade_start}s")
        print(f"Command: {' '.join(cmd)}")
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ Successfully trimmed: {output_file}")
            return True
        else:
            print(f"✗ Error trimming {input_file}:")
            print(result.stderr)
            return False
            
    except Exception as e:
        print(f"✗ Exception while trimming {input_file}: {str(e)}")
        return False

def main():
    print("Audio Trimming Utility")
    print("=====================")
    
    # Load audio configuration
    config = load_audio_config()
    if not config:
        print("Failed to load audio configuration")
        return
    
    # Get default duration
    default_duration = config.get('defaults', {}).get('duration', 30)
    
    # Create output directory if it doesn't exist
    audio_dir = Path('audio')
    audio_dir.mkdir(exist_ok=True)
    
    # Create backup directory
    backup_dir = Path('audio/originals')
    backup_dir.mkdir(exist_ok=True)
    
    # Process each experience
    for exp_name, settings in config['experiences'].items():
        input_file = f"audio/{exp_name}.mp3"
        if not os.path.exists(input_file):
            print(f"✗ Source file not found: {input_file}")
            continue
            
        # Backup original file
        backup_file = f"audio/originals/{exp_name}_original.mp3"
        if not os.path.exists(backup_file):
            print(f"Backing up original: {backup_file}")
            os.rename(input_file, backup_file)
        
        # Get settings for this experience
        duration = settings.get('duration', default_duration)
        start_time = settings.get('startPosition', 0)
        fade_in = settings.get('fadeIn', 0)
        fade_out = settings.get('fadeOut', 0)
        
        # Trim audio
        success = trim_audio(
            backup_file,
            input_file,
            start_time,
            duration,
            fade_in,
            fade_out
        )
        
        if success:
            print(f"Processed {exp_name}: {start_time}s -> {start_time + duration}s")
        else:
            print(f"Failed to process {exp_name}")

if __name__ == '__main__':
    main() 