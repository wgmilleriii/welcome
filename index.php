<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parallax Mountain Experience</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/controls.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
</head>
<body>
    <div id="loading-screen" class="loading-screen">
        <div class="loader"></div>
    </div> 

    <div class="container">
        <!-- Audio Controls -->
        <div id="audio-controls" class="controls audio-controls">
            <button id="mute-btn" class="control-btn" aria-label="Mute">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>
            </button>
            <button id="play-btn" class="control-btn" aria-label="Play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
            </button>
        </div>

        <!-- Spin Controls -->
        <div id="spin-controls" class="controls spin-controls">
            <button id="spin-toggle" class="control-btn" aria-label="Toggle Spin">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 12c0-2.8 1.2-5.2 3-7M22 12c0 2.8-1.2 5.2-3 7"></path>
                </svg>
            </button>
        </div>

        <!-- Mountain Layer -->
        <div id="mountain-layer" class="layer mountain-layer">
            <img id="mountain-img" src="includes/i/Sandia_Mountains_optimized.jpg" alt="Mountain Scene">
        </div>

        <!-- Gradient Layer -->
        <div id="gradient-layer" class="layer gradient-layer"></div>

        <!-- Text Container -->
        <div id="text-container" class="layer text-container">
            <div class="sentence-wrapper">
                <div id="start-spinner" class="spinner start-spinner"></div>
                <div id="middle-text" class="middle-text"></div>
                <div id="end-spinner" class="spinner end-spinner"></div>
            </div>
        </div>

        <!-- Mountain Controls -->
        <div id="mountain-controls" class="controls mountain-controls">
            <button class="mountain-btn" data-mountain="mountain1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 20H3L12 4z"></path>
                </svg>
            </button>
            <button class="mountain-btn" data-mountain="mountain2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 20L7 4l-4 16h15z"></path>
                    <path d="M21 20L15 8l-3 6 2 6h7z"></path>
                </svg>
            </button>
        </div>
    </div>

    <script src="js/main.js" type="module"></script>
    <script src="js/animations.js" type="module"></script>
    <script src="js/controls.js" type="module"></script>
    <script src="js/spinners.js" type="module"></script>
</body>
</html> 