// Initialize modules and handle core setup
import { initAnimations } from './animations.js';
import { initControls } from './controls.js';
import { initSpinners } from './spinners.js';

// Global state
const state = {
    isSpinning: true,
    isMuted: false,
    isPlaying: false,
    currentMountain: 'mountain1',
    scrollSpeed: 0,
    lastScrollPos: 0
};

// Sound setup
const sound = new Howl({
    src: ['assets/audio/background.mp3'],
    loop: true,
    volume: 0.5,
    autoplay: false
});

// Initialize after content loads
document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize all modules
    initAnimations();
    initControls(state, sound);
    initSpinners(state);
    
    // Remove loading screen
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = 0;
    setTimeout(() => loadingScreen.remove(), 500);
});

export { state }; 