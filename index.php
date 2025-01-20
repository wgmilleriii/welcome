<?php
require_once 'includes/session-handler.php';
require_once 'includes/logger.php';

// Initialize logging system
Logger::init();

// Initialize session and get user experience
$sessionData = SessionHandler::initSession($_GET['ux'] ?? null);
$currentExperience = SessionHandler::getPreferredExperience();

// Log the visit
Logger::logVisit($sessionData);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parallax Mountain Experience</title>
    <link rel="stylesheet" href="css/styles.css">
    <link rel="stylesheet" href="css/animations.css">
    <link rel="stylesheet" href="css/controls.css">
    <!-- Pass session data to JavaScript -->
    <script>
        window.sessionData = <?php echo json_encode($sessionData); ?>;
        window.currentExperience = <?php echo json_encode($currentExperience); ?>;
    </script>
    <!-- Load GSAP and plugins first -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
    <!-- Load our modules after -->
    <script src="js/analytics.js" type="module"></script>
    <script src="js/ux-detector.js" type="module"></script>
    <script src="js/animations.js" type="module"></script>
    <script src="js/controls.js" type="module"></script>
    <script src="js/spinners.js" type="module"></script>
    <script src="js/main.js" type="module"></script>
</head>
<body>
    <!-- Header with video link -->
    <header class="site-header">
        <a href="https://youtu.be/Wcyk7TK3DNY?si=9iKDKuf_GQhyoUof&t=433" target="_blank" rel="noopener noreferrer" class="video-link">
            Watch the Video
        </a>
    </header>

    <div id="loading-screen" class="loading-screen">
        <div class="loader"></div>
    </div> 

    <div class="container">
        <!-- Experience Selector -->
        <div class="experience-selector">
            <button class="experience-btn" data-experience="stravinsky" data-switch-type="direct" data-tagline="Experience the master himself conducting his revolutionary work">
                Stravinsky
            </button>
            <button class="experience-btn" data-experience="haydn" data-switch-type="redirect" data-tagline="Journey through the divine masterpiece of creation">
                Haydn
            </button>
            <button class="experience-btn" data-experience="singing" data-switch-type="redirect" data-tagline="Discover the intimate beauty of voice and lute">
                Singing
            </button>
        </div>

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
</body>
</html> 