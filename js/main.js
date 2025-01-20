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

// Initialize after content loads
document.addEventListener('DOMContentLoaded', init);

export { state }; 