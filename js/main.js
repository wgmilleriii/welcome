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

// Initialize all modules in sequence
async function initializeModules() {
    try {
        console.log('Starting module initialization...');
        
        // Initialize configuration
        const configManager = new ConfigManager();
        await configManager.init();

        // Initialize experience manager
        await experienceManager.init();
        
        // Initialize animations (which includes WaveSurfer)
        await initAnimations();
        
        // Initialize remaining modules
        initControls(state, experienceManager);
        initSpinners(state);
        
        console.log('All modules initialized successfully');
    } catch (error) {
        console.error('Error during module initialization:', error);
    }
}

// Wait for DOM and required scripts
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing application...');
    
    // Wait for WaveSurfer script to load
    await new Promise((resolve) => {
        const checkWaveSurfer = () => {
            if (typeof WaveSurfer !== 'undefined') {
                console.log('WaveSurfer script loaded');
                resolve();
            } else {
                setTimeout(checkWaveSurfer, 100);
            }
        };
        checkWaveSurfer();
    });
    
    // Initialize all modules
    await initializeModules();
    
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.remove(), 500);
    }
});

// Log initialization
console.log(`Main Module v${window.JS_VERSION || '1.1'} initializing...`);

export { state }; 