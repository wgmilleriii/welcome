#!/usr/bin/env python3
import os
from pathlib import Path
from pydub import AudioSegment

def apply_fades(input_file, output_file=None, fade_in_ms=0, fade_out_ms=0):
    """Apply fade in/out to an audio file using pydub."""
    print(f"Processing {input_file}")
    
    try:
        # Load the audio file
        audio = AudioSegment.from_mp3(input_file)
        
        # Apply fades if specified
        if fade_in_ms > 0:
            print(f"Applying {fade_in_ms}ms fade in")
            audio = audio.fade_in(fade_in_ms)
            
        if fade_out_ms > 0:
            print(f"Applying {fade_out_ms}ms fade out")
            audio = audio.fade_out(fade_out_ms)
        
        # Determine output file
        if output_file is None:
            base = os.path.splitext(input_file)[0]
            output_file = f"{base}_faded.mp3"
        
        # Export the processed audio
        audio.export(output_file, format="mp3", bitrate="192k")
        print(f"✓ Saved to: {output_file}")
        return True
        
    except Exception as e:
        print(f"✗ Error processing {input_file}: {str(e)}")
        return False

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='Apply fades to MP3 files')
    parser.add_argument('input_file', help='Input MP3 file')
    parser.add_argument('--output', '-o', help='Output file (default: input_faded.mp3)')
    parser.add_argument('--fade-in', type=int, default=0, help='Fade in duration in milliseconds')
    parser.add_argument('--fade-out', type=int, default=0, help='Fade out duration in milliseconds')
    
    args = parser.parse_args()
    
    apply_fades(
        args.input_file,
        args.output,
        args.fade_in,
        args.fade_out
    )

if __name__ == '__main__':
    main() 