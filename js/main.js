// Initialize modules and handle core setup
import { initAnimations } from './animations.js';
import { initControls } from './controls.js';
import { initSpinners } from './spinners.js';
import { ConfigManager } from './config-manager.js';
import { experienceManager } from './experience-manager.js';

// Global state
const state = {
    isSpinning: true,
    isMuted: false,
    isPlaying: false,
    currentMountain: 'mountain1',
    scrollSpeed: 0,
    lastScrollPos: 0
};

async function init() {
    try {
        console.log('Starting initialization...'); // Debug log
        
        // Initialize configuration
        const configManager = new ConfigManager();
        await configManager.init();

        // Initialize experience manager
        await experienceManager.init();
        
        // Register GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);
        
        console.log('Initializing core modules...'); // Debug log
        
        // Initialize all modules
        initAnimations();
        initControls(state, experienceManager);
        initSpinners(state);
        
        // Remove loading screen
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = 0;
            setTimeout(() => loadingScreen.remove(), 500);
        }
        
        console.log('Initialization complete!'); // Debug log
    } catch (error) {
        console.error('Initialization error:', error);
    }
}

// Wait for all required scripts to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');

    // Initialize animations
    import('./animations.js')
        .then(module => {
            console.log('Animations module loaded');
            module.initAnimations();
        })
        .catch(err => console.error('Error loading animations:', err));

    // Initialize UX detector
    import('./ux-detector.js')
        .then(module => {
            console.log('UX detector module loaded');
        })
        .catch(err => console.error('Error loading UX detector:', err));

    // Initialize controls
    import('./controls.js')
        .then(module => {
            console.log('Controls module loaded');
        })
        .catch(err => console.error('Error loading controls:', err));

    // Initialize spinners
    import('./spinners.js')
        .then(module => {
            console.log('Spinners module loaded');
        })
        .catch(err => console.error('Error loading spinners:', err));

    // Initialize analytics
    import('./analytics.js')
        .then(module => {
            console.log('Analytics module loaded');
        })
        .catch(err => console.error('Error loading analytics:', err));
});

// Log initialization
console.log(`Main Module v${window.JS_VERSION || '1.1'} initializing...`);

export { state }; 