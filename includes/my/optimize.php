<?php
class ExperienceOptimizer {
    private $baseDir;
    private $options = [];
    
    public function __construct() {
        $this->baseDir = dirname(dirname(__DIR__)); // Gets us to the root directory
        $this->initializeOptions();
    }

    private function initializeOptions() {
        $this->options = [
            'mountain' => [
                'fade_duration' => 8000,
                'initial_opacity' => 0,
                'final_opacity' => 1,
                'parallax_depth' => 0.5
            ],
            'text' => [
                'spin_on_scroll' => true,
                'spin_speed' => 1,
                'shadow_colors' => [
                    'primary' => 'rgba(0, 168, 255, 0.4)',
                    'secondary' => 'rgba(255, 255, 255, 0.2)'
                ],
                'animation_timing' => [
                    'start_delay' => 500,
                    'interval' => 2000,
                    'duration' => 1500
                ]
            ],
            'audio' => [
                'autoplay' => false,
                'initial_volume' => 0.5,
                'fade_duration' => 2000
            ],
            'controls' => [
                'position' => 'top-left',
                'fade_in_delay' => 1000,
                'spacing' => '1rem'
            ],
            'quote' => [
                'transition_duration' => 8000,
                'mobile_height' => '30vh',
                'desktop_height' => '25vh',
                'background_opacity' => 0.98
            ]
        ];
    }

    public function getExperienceConfig() {
        return [
            'version' => '1.0',
            'timestamp' => time(),
            'options' => $this->options,
            'performance' => $this->getPerformanceSettings(),
            'compatibility' => $this->checkCompatibility()
        ];
    }

    private function getPerformanceSettings() {
        return [
            'preload_assets' => true,
            'lazy_load_threshold' => '200px',
            'animation_frame_limit' => 60,
            'debounce_scroll' => 16, // ~60fps
            'use_hardware_acceleration' => true
        ];
    }

    private function checkCompatibility() {
        return [
            'min_browser_versions' => [
                'chrome' => 80,
                'firefox' => 75,
                'safari' => 13,
                'edge' => 80
            ],
            'required_features' => [
                'css_variables',
                'intersection_observer',
                'web_animations',
                'audio_api'
            ],
            'mobile_breakpoint' => '768px'
        ];
    }

    public function generateOptimizedAssets() {
        $this->optimizeMountainLayers();
        $this->optimizeAudioFiles();
        $this->prepareTextAnimations();
        return true;
    }

    private function optimizeMountainLayers() {
        // Implementation for mountain layer optimization
        $layers = ['background', 'midground', 'foreground'];
        foreach ($layers as $layer) {
            // Process each layer
            $this->processLayer($layer);
        }
    }

    private function processLayer($layer) {
        $sourceFile = "{$this->baseDir}/assets/mountains/{$layer}.png";
        if (file_exists($sourceFile)) {
            // Add layer-specific processing logic here
            return true;
        }
        return false;
    }

    private function optimizeAudioFiles() {
        $audioDir = "{$this->baseDir}/assets/audio";
        if (is_dir($audioDir)) {
            // Add audio optimization logic here
            return true;
        }
        return false;
    }

    private function prepareTextAnimations() {
        // Prepare text animation sequences
        return [
            'sequences' => [
                'intro' => $this->getIntroSequence(),
                'main' => $this->getMainSequence(),
                'outro' => $this->getOutroSequence()
            ]
        ];
    }

    private function getIntroSequence() {
        return [
            'duration' => 2000,
            'easing' => 'cubic-bezier(0.4, 0, 0.2, 1)',
            'opacity' => [0, 1],
            'transform' => ['translateY(20px)', 'translateY(0)']
        ];
    }

    private function getMainSequence() {
        return [
            'duration' => 1500,
            'easing' => 'cubic-bezier(0.4, 0, 0.2, 1)',
            'opacity' => 1,
            'transform' => 'translateY(0)'
        ];
    }

    private function getOutroSequence() {
        return [
            'duration' => 1000,
            'easing' => 'cubic-bezier(0.4, 0, 0.2, 1)',
            'opacity' => [1, 0],
            'transform' => ['translateY(0)', 'translateY(-20px)']
        ];
    }
}

// Usage example
$optimizer = new ExperienceOptimizer();
$config = $optimizer->getExperienceConfig();

// Save configuration
$configJson = json_encode($config, JSON_PRETTY_PRINT);
file_put_contents(dirname(dirname(__DIR__)) . '/config/experience.json', $configJson);

// Generate optimized assets
$optimizer->generateOptimizedAssets();
?> 