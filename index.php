<?php
require_once 'includes/session-handler.php';
require_once 'includes/logger.php';

// Initialize logging system
Logger::init();

// Initialize session and get user experience
$sessionData = UXSessionHandler::initSession($_GET['ux'] ?? null);
$currentExperience = UXSessionHandler::getPreferredExperience();

// Version control and cache busting
define('JS_VERSION', '1.1');
$cacheBuster = '?v=' . JS_VERSION . '&r=' . rand();

// Log the visit
Logger::logVisit($sessionData);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Parallax Mountain Experience</title>
    
    <!-- Preload critical resources -->
    <link rel="preload" href="includes/i/Sandia_Mountains_optimized.jpg" as="image">
    <link rel="preload" href="css/styles.css<?php echo '?v=' . JS_VERSION; ?>" as="style">
    <link rel="preload" href="audio/<?php echo $currentExperience; ?>.mp3" as="audio">
    
    <!-- Preconnect to CDNs -->
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://unpkg.com">
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css<?php echo '?v=' . JS_VERSION; ?>">
    <link rel="stylesheet" href="css/animations.css<?php echo '?v=' . JS_VERSION; ?>">
    <link rel="stylesheet" href="css/controls.css<?php echo '?v=' . JS_VERSION; ?>">
    
    <!-- Pass session data and version to JavaScript -->
    <script>
        window.sessionData = <?php echo json_encode($sessionData); ?>;
        window.currentExperience = <?php echo json_encode($currentExperience); ?>;
        window.JS_VERSION = <?php echo json_encode(JS_VERSION); ?>;
    </script>
    
    <!-- Load third-party libraries with version-based cache busting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js"></script>
    
    <!-- Load application scripts with version-based cache busting -->
    <script type="module" src="js/analytics.js?v=<?php echo JS_VERSION; ?>"></script>
    <script type="module" src="js/ux-detector.js?v=<?php echo JS_VERSION; ?>"></script>
    <script type="module" src="js/animations.js?v=<?php echo JS_VERSION; ?>"></script>
    <script type="module" src="js/controls.js?v=<?php echo JS_VERSION; ?>"></script>
    <script type="module" src="js/spinners.js?v=<?php echo JS_VERSION; ?>"></script>
    <script type="module" src="js/main.js?v=<?php echo JS_VERSION; ?>"></script>
</head>
<body>
    <!-- Header with waveform -->
    <header class="site-header">
        <div class="waveform-container">
            <div id="waveform"></div>
        </div>
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