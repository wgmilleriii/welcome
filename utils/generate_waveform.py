#!/usr/bin/env python3
import sys
import os
import numpy as np
from PIL import Image, ImageDraw
from pydub import AudioSegment
import argparse
from pathlib import Path

def generate_waveform(input_file, output_file, width=1024, height=400):
    """Generate a waveform image from an audio file."""
    print(f"Processing {input_file} -> {output_file}")
    
    try:
        # Load audio file and convert to mono
        audio = AudioSegment.from_mp3(input_file)
        audio = audio.set_channels(1)
        
        # Get raw audio data
        samples = np.array(audio.get_array_of_samples())
        
        # Create blocks of samples for visualization
        block_size = max(1, len(samples) // width)
        blocks = [samples[i:i + block_size] for i in range(0, len(samples), block_size)][:width]
        
        # Calculate peak amplitudes for each block
        peaks = [np.abs(block).max() if len(block) > 0 else 0 for block in blocks]
        max_peak = max(peaks)
        if max_peak == 0:
            peaks = np.zeros(len(peaks))
        else:
            peaks = np.array(peaks) / max_peak  # Normalize
        
        # Create image
        image = Image.new('RGB', (width, height), (0, 0, 0))
        draw = ImageDraw.Draw(image)
        
        # Draw waveform
        center_y = height // 2
        bar_width = 2
        gap = 1
        total_width = bar_width + gap
        
        for i, peak in enumerate(peaks):
            x = i * total_width
            amplitude = int(peak * (height // 2 - 20))  # Leave some padding
            
            # Draw vertical bar
            draw.rectangle(
                [x, center_y - amplitude, x + bar_width, center_y + amplitude],
                fill=(255, 255, 255)
            )
        
        # Save both PNG and JPG
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        
        # Save PNG with transparency
        png_image = image.copy()
        png_image.putalpha(255)  # Full opacity
        png_output = output_file
        png_image.save(png_output, 'PNG')
        print(f"✓ Generated PNG waveform: {png_output}")
        
        # Save JPG
        jpg_output = output_file.replace('.png', '.jpg')
        image.save(jpg_output, 'JPEG', quality=95)
        print(f"✓ Generated JPG waveform: {jpg_output}")
        
        return True
    except Exception as e:
        print(f"✗ Error processing {input_file}: {str(e)}")
        return False

def get_unprocessed_files(mp3_dir, waveform_dir):
    """Find MP3 files that don't have corresponding waveform images."""
    mp3_files = set(Path(mp3_dir).glob('**/*.mp3'))
    waveform_files = set(Path(waveform_dir).glob('**/*.png'))
    
    # Convert waveform files to expected mp3 names for comparison
    waveform_bases = {f.stem for f in waveform_files}
    
    unprocessed = []
    for mp3_file in mp3_files:
        if mp3_file.stem not in waveform_bases:
            unprocessed.append(mp3_file)
    
    return unprocessed

def main():
    parser = argparse.ArgumentParser(description='Generate waveform images from MP3 files')
    parser.add_argument('--mp3-dir', default='audio', help='Directory containing MP3 files')
    parser.add_argument('--waveform-dir', default='includes/i/waveforms', help='Directory for waveform images')
    parser.add_argument('--width', type=int, default=1024, help='Width of output image (default: 1024)')
    parser.add_argument('--height', type=int, default=400, help='Height of output image (default: 400)')
    parser.add_argument('--force', action='store_true', help='Force regeneration of all waveforms')
    
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    os.makedirs(args.waveform_dir, exist_ok=True)
    
    if args.force:
        # Process all MP3 files
        mp3_files = list(Path(args.mp3_dir).glob('**/*.mp3'))
    else:
        # Find unprocessed files
        mp3_files = get_unprocessed_files(args.mp3_dir, args.waveform_dir)
    
    if not mp3_files:
        print("No new MP3 files to process.")
        return
    
    print(f"Found {len(mp3_files)} MP3 file(s) to process...")
    
    success_count = 0
    for mp3_file in mp3_files:
        output_file = Path(args.waveform_dir) / f"{mp3_file.stem}.png"
        if generate_waveform(str(mp3_file), str(output_file), args.width, args.height):
            success_count += 1
    
    print(f"\nProcessing complete!")
    print(f"Successfully processed: {success_count}/{len(mp3_files)} files")

if __name__ == '__main__':
    main() 