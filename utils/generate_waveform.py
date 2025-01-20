#!/usr/bin/env python3
import sys
import numpy as np
from PIL import Image, ImageDraw
from pydub import AudioSegment
import argparse

def generate_waveform(input_file, output_file, width=1024, height=400):
    """Generate a waveform image from an audio file."""
    # Load audio file and convert to mono
    audio = AudioSegment.from_mp3(input_file)
    audio = audio.set_channels(1)  # Convert to mono
    
    # Get raw audio data as numpy array
    samples = np.array(audio.get_array_of_samples())
    
    # Create chunks for the waveform
    chunk_size = len(samples) // width
    chunks = [samples[i:i + chunk_size] for i in range(0, len(samples), chunk_size)][:width]
    
    # Calculate peak values for each chunk
    peaks = [abs(chunk).max() if len(chunk) > 0 else 0 for chunk in chunks]
    
    # Normalize peaks
    if max(peaks) > 0:
        peaks = [p / max(peaks) for p in peaks]
    
    # Create image
    image = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(image)
    
    # Calculate center line
    center_line = height // 2
    
    # Draw waveform
    for x, peak in enumerate(peaks):
        peak_height = int(peak * (height // 2))
        draw.line([(x, center_line - peak_height), (x, center_line + peak_height)], fill='black', width=1)
    
    # Save image
    image.save(output_file, 'PNG')
    print(f"Waveform generated: {output_file}")

def main():
    parser = argparse.ArgumentParser(description='Generate waveform image from MP3 file')
    parser.add_argument('input_file', help='Input MP3 file')
    parser.add_argument('output_file', help='Output PNG file')
    parser.add_argument('--width', type=int, default=1024, help='Width of output image (default: 1024)')
    parser.add_argument('--height', type=int, default=400, help='Height of output image (default: 400)')
    
    args = parser.parse_args()
    
    try:
        generate_waveform(args.input_file, args.output_file, args.width, args.height)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main() 