<?php
// Version control and cache busting
define('JS_VERSION', '1.2.0');
$cacheBuster = '?v=' . JS_VERSION . '&r=' . uniqid();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stravinsky Player</title>
    
    <!-- Core libraries -->
    <script src="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js"></script>
    
    <style>
        body {
            margin: 0;
            padding: 20px;
            background: #000;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
        }

        .player-container {
            max-width: 800px;
            margin: 0 auto;
            background: #111;
            padding: 20px;
            border-radius: 8px;
        }

        #waveform {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            margin: 20px 0;
        }

        .controls {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin: 20px 0;
        }

        button {
            background: none;
            border: 1px solid #333;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            background: #333;
        }

        .time-display {
            text-align: center;
            font-family: monospace;
        }

        .static-waveform {
            margin-top: 40px;
        }

        .static-waveform img {
            width: 100%;
            height: 120px;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="player-container">
        <div id="waveform"></div>
        
        <div class="controls">
            <button id="playBtn">Play/Pause</button>
        </div>

        <div class="time-display">
            <span id="currentTime">0:00</span> / <span id="duration">0:00</span>
        </div>

        <div class="static-waveform">
            <img src="includes/i/waveforms/stravinsky.png<?= $cacheBuster ?>" alt="Static waveform">
        </div>
    </div>

    <script>
        const wavesurfer = WaveSurfer.create({
            container: '#waveform',
            height: 120,
            waveColor: '#4a9eff',
            progressColor: '#1e6bb8',
            cursorColor: '#fff',
            barWidth: 2,
            barGap: 1,
            responsive: true,
            normalize: true,
            backend: 'WebAudio'
        });

        wavesurfer.load('audio/stravinsky.mp3<?= $cacheBuster ?>');

        const playBtn = document.getElementById('playBtn');
        const currentTime = document.getElementById('currentTime');
        const duration = document.getElementById('duration');

        playBtn.addEventListener('click', () => wavesurfer.playPause());

        wavesurfer.on('audioprocess', () => {
            currentTime.textContent = formatTime(wavesurfer.getCurrentTime());
        });

        wavesurfer.on('ready', () => {
            duration.textContent = formatTime(wavesurfer.getDuration());
        });

        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    </script>
</body>
</html> 