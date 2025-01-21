<?php
// Version control and cache busting
define('JS_VERSION', '1.0.0');
$cacheBuster = '?v=' . JS_VERSION;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mountain Experience</title>
    
    <!-- Core styles -->
    <link rel="stylesheet" href="css/styles.css<?php echo $cacheBuster; ?>">
    
    <!-- Core libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js"></script>
</head>
<body>
    <!-- Audio player -->
    <header class="site-header">
        <div id="waveform"></div>
    </header>

    <!-- Core layers -->
    <div class="layer mountain-layer">
        <img id="mountain-img" src="includes/i/Sandia_Mountains_optimized.jpg" alt="Mountain">
    </div>

    <div class="layer sentence-layer">
        <div class="current-sentence"></div>
    </div>

    <div class="layer spinner-layer">
        <div class="sentence-wrapper">
            <div class="spinner" id="start-spinner"></div>
            <div class="middle-text">in the</div>
            <div class="spinner" id="end-spinner"></div>
        </div>
    </div>

    <!-- Core script -->
    <script type="module">
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Initialize parallax
        function initParallax() {
            gsap.to(".mountain-layer", {
                yPercent: -20,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.5
                }
            });

            gsap.to(".sentence-layer", {
                yPercent: -40,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: 0.8
                }
            });

            gsap.to(".spinner-layer", {
                yPercent: -60,
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom top",
                    scrub: 1
                }
            });
        }

        // Initialize WaveSurfer
        const wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'rgba(255, 200, 200, 0.3)',
            progressColor: 'rgba(255, 200, 200, 0.8)',
            height: 60,
            barWidth: 2,
            barGap: 1,
            responsive: true
        });

        // Load audio
        wavesurfer.load('audio/stravinsky.mp3');
        wavesurfer.on('ready', () => wavesurfer.play());

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            initParallax();
        });
    </script>

    <style>
        /* Core styles */
        body {
            margin: 0;
            background: #000;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
        }

        .layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .mountain-layer { z-index: 1; }
        .sentence-layer { z-index: 2; }
        .spinner-layer { z-index: 3; }

        #mountain-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .site-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            padding: 1rem;
            background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
        }

        #waveform {
            max-width: 800px;
            margin: 0 auto;
        }

        .sentence-wrapper {
            display: flex;
            gap: 1.5rem;
            padding: 1rem;
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            backdrop-filter: blur(4px);
        }

        .current-sentence {
            font-size: 1.75rem;
            padding: 1rem;
            background: rgba(0,0,0,0.2);
            border-radius: 12px;
            backdrop-filter: blur(4px);
        }

        .spinner {
            padding: 0.5rem;
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
        }
    </style>
</body>
</html> 