<?php
require_once 'includes/session-handler.php';
require_once 'includes/logger.php';

// Initialize logging system
Logger::init();

// Initialize session and get user experience
$sessionData = UXSessionHandler::initSession($_GET['ux'] ?? null);
$currentExperience = UXSessionHandler::getPreferredExperience();

// Version control and cache busting
define('JS_VERSION', '1.2.0');
$cacheBuster = '?v=' . JS_VERSION . '&r=' . uniqid();

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
    <link rel="preload" href="css/styles.css<?php echo $cacheBuster; ?>" as="style">
    <link rel="preload" href="audio/<?php echo $currentExperience; ?>.mp3" as="audio">
    
    <!-- Preconnect to CDNs -->
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://unpkg.com">
    
    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css<?php echo $cacheBuster; ?>">
    <link rel="stylesheet" href="css/animations.css<?php echo $cacheBuster; ?>">
    <link rel="stylesheet" href="css/controls.css<?php echo $cacheBuster; ?>">
    
    <!-- Pass session data and version to JavaScript -->
    <script>
        window.sessionData = <?php echo json_encode($sessionData); ?>;
        window.currentExperience = <?php echo json_encode($currentExperience); ?>;
        window.JS_VERSION = <?php echo json_encode(JS_VERSION); ?>;
        window.BUILD_TIME = <?php echo json_encode(time()); ?>;
    </script>
    
    <!-- Load third-party libraries with version-based cache busting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
    <script src="https://unpkg.com/wavesurfer.js@7/dist/wavesurfer.min.js"></script>
    
    <!-- Load application scripts with enhanced cache busting -->
    <script type="module" src="js/analytics.js<?php echo $cacheBuster; ?>"></script>
    <script type="module" src="js/ux-detector.js<?php echo $cacheBuster; ?>"></script>
    <script type="module" src="js/animations.js<?php echo $cacheBuster; ?>"></script>
    <script type="module" src="js/controls.js<?php echo $cacheBuster; ?>"></script>
    <script type="module" src="js/spinners.js<?php echo $cacheBuster; ?>"></script>
    <script type="module" src="js/main.js<?php echo $cacheBuster; ?>"></script>
</head>
<body>
    <!-- Header with waveform -->
    <header class="site-header">
        <div class="waveform-container">
            <div id="waveform"></div>
        </div>
    </header>

    <!-- Three distinct layers -->
    <div class="layer mountain-layer">
        <img id="mountain-img" src="includes/i/Sandia_Mountains_optimized.jpg" alt="Mountain landscape">
    </div>

    <div class="layer sentence-layer">
        <div class="current-sentence-container">
            <p class="current-sentence"></p>
        </div>
    </div>

    <div class="layer spinner-layer">
        <div class="sentence-wrapper">
            <div class="spinner" id="start-spinner"></div>
            <div class="middle-text">in the</div>
            <div class="spinner" id="end-spinner"></div>
        </div>
    </div>

    <!-- Controls at bottom -->
    <div class="controls-container">
        <div class="experience-selector">
            <button class="experience-btn" data-experience="stravinsky">Stravinsky</button>
            <button class="experience-btn" data-experience="haydn">Haydn</button>
            <button class="experience-btn" data-experience="singing">Singing</button>
        </div>
    </div>

    <!-- Footer -->
    <footer class="site-footer">
        <button id="record-goal" class="record-button">Record my Goal</button>
        <button id="generate-goal" class="generate-button">Make a New Goal</button>
    </footer>
</body>
</html> 