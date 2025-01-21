#!/usr/bin/env python3
import os
import json
from pathlib import Path
from pydub import AudioSegment
import sys
import re

def load_config():
    """Load the audio configuration file."""
    try:
        with open('config/audio.json', 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading config: {e}")
        return None

def save_config(config):
    """Save the updated configuration file."""
    try:
        with open('config/audio.json', 'w') as f:
            json.dump(config, f, indent=4)
        print("✓ Configuration file updated successfully")
    except Exception as e:
        print(f"✗ Error saving config: {e}")

def get_audio_length(file_path):
    """Get the length of an MP3 file in seconds."""
    try:
        audio = AudioSegment.from_mp3(file_path)
        return len(audio) / 1000.0  # Convert milliseconds to seconds
    except Exception as e:
        print(f"✗ Error reading audio file {file_path}: {e}")
        return None

def validate_youtube_url(url):
    """Validate YouTube URL format."""
    youtube_pattern = r'^https?://(?:www\.)?youtube\.com/watch\?v=[\w-]+$'
    return bool(re.match(youtube_pattern, url))

def validate_assets():
    """Validate all required assets exist and update configuration."""
    config = load_config()
    if not config:
        print("✗ Could not load configuration file")
        return False

    all_valid = True
    experiences = config.get('experiences', {})

    # Create directories if they don't exist
    Path('audio').mkdir(exist_ok=True)
    Path('includes/i/waveforms').mkdir(parents=True, exist_ok=True)

    for exp_name, exp_data in experiences.items():
        print(f"\nValidating experience: {exp_name}")
        
        # Check MP3 file
        mp3_path = f"audio/{exp_name}.mp3"
        if not os.path.exists(mp3_path):
            print(f"✗ Missing MP3 file: {mp3_path}")
            all_valid = False
            continue

        # Check waveform image
        waveform_path = f"includes/i/waveforms/{exp_name}.png"
        if not os.path.exists(waveform_path):
            print(f"✗ Missing waveform image: {waveform_path}")
            all_valid = False
        else:
            print(f"✓ Found waveform image: {waveform_path}")

        # Validate audio length
        audio_length = get_audio_length(mp3_path)
        if audio_length is None:
            all_valid = False
            continue

        expected_duration = exp_data.get('duration', 8)  # Default to 8 seconds
        print(f"Audio length: {audio_length:.2f}s (Expected: {expected_duration}s)")

        # Update configuration with actual length
        if 'duration' not in exp_data or abs(exp_data['duration'] - audio_length) > 0.1:
            exp_data['duration'] = round(audio_length, 2)
            print(f"✓ Updated duration in configuration: {audio_length:.2f}s")

        # Validate start position
        if exp_data.get('startPosition', 0) >= audio_length:
            print(f"✗ Start position {exp_data.get('startPosition')}s exceeds audio length {audio_length:.2f}s")
            all_valid = False
        else:
            print(f"✓ Start position valid: {exp_data.get('startPosition', 0)}s")

        # Validate YouTube information
        youtube_info = exp_data.get('youtube', {})
        if not youtube_info:
            print("✗ Missing YouTube information")
            all_valid = False
        else:
            # Check URL
            youtube_url = youtube_info.get('url')
            if not youtube_url:
                print("✗ Missing YouTube URL")
                all_valid = False
            elif not validate_youtube_url(youtube_url):
                print(f"✗ Invalid YouTube URL format: {youtube_url}")
                all_valid = False
            else:
                print(f"✓ Valid YouTube URL: {youtube_url}")

            # Check title and description
            if not youtube_info.get('title'):
                print("✗ Missing YouTube title")
                all_valid = False
            if not youtube_info.get('description'):
                print("✗ Missing YouTube description")
                all_valid = False
            if len(youtube_info.get('description', '')) < 50:
                print("! YouTube description might be too short (< 50 chars)")

    if all_valid:
        # Save updated configuration
        save_config(config)
        print("\n✓ All assets validated successfully!")
    else:
        print("\n✗ Some assets are missing or invalid")

    return all_valid

if __name__ == '__main__':
    print("Starting asset validation...")
    success = validate_assets()
    sys.exit(0 if success else 1) 