<?php
require_once('includes/header.php');
?>

<div class="container">
    <!-- Audio Controls -->
    <div id="audio-controls" class="controls audio-controls">
        <button id="mute-btn" class="control-btn" aria-label="Mute">
            <svg><!-- Add mute icon SVG --></svg>
        </button>
        <button id="play-btn" class="control-btn" aria-label="Play">
            <svg><!-- Add play icon SVG --></svg>
        </button>
    </div>

    <!-- Spin Controls -->
    <div id="spin-controls" class="controls spin-controls">
        <button id="spin-toggle" class="control-btn" aria-label="Toggle Spin">
            <svg><!-- Add spin icon SVG --></svg>
        </button>
    </div>

    <!-- Mountain Layer -->
    <div id="mountain-layer" class="layer mountain-layer">
        <img id="mountain-img" src="assets/mountains/mountain1.png" alt="Mountain Scene">
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
        <button class="mountain-btn" data-mountain="mountain1">1</button>
        <button class="mountain-btn" data-mountain="mountain2">2</button>
    </div>
</div>

<?php
require_once('includes/footer.php');
?> 