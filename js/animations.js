// Initialize GSAP from CDN loaded version
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

// Log module initialization
console.log(`Animations Module v${window.JS_VERSION || '1.1'} initializing...`);

// Only register ScrollTrigger if it exists
if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    console.log('ScrollTrigger plugin registered');
}

let wavesurfer = null;

// Load audio configuration
async function loadAudioConfig() {
    try {
        const response = await fetch('config/audio.json');
        if (!response.ok) throw new Error('Failed to load audio config');
        return await response.json();
    } catch (error) {
        console.error('Error loading audio config:', error);
        return null;
    }
}

// Initialize WaveSurfer
async function initWaveSurfer(audioConfig) {
    console.log('Initializing WaveSurfer...');
    
    // Wait for WaveSurfer script to load
    if (typeof WaveSurfer === 'undefined') {
        console.log('Waiting for WaveSurfer script...');
        await new Promise(resolve => {
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
    }

    const currentExperience = window.currentExperience || 'stravinsky';
    const audioSettings = audioConfig?.experiences?.[currentExperience] || {
        startPosition: 0,
        volume: 0.75,
        fadeIn: 1.0
    };

    try {
        // Create WaveSurfer instance
        wavesurfer = WaveSurfer.create({
            container: '#waveform',
            waveColor: 'rgba(255, 200, 200, 0.3)',
            progressColor: 'rgba(255, 200, 200, 0.8)',
            cursorColor: 'rgba(255, 255, 255, 0.5)',
            barWidth: 2,
            barGap: 1,
            height: 60,
            barRadius: 2,
            normalize: true,
            backend: 'WebAudio',
            hideScrollbar: true,
            interact: true,
            responsive: true,
            dragToSeek: true,
            loop: true // Enable looping by default
        });

        console.log('WaveSurfer instance created successfully');

        // Load audio file
        const audioFile = `audio/${currentExperience}.mp3`;
        console.log(`Loading audio file: ${audioFile}`);
        wavesurfer.load(audioFile);

        // Handle waveform clicks for layered playback
        const waveformContainer = document.querySelector('#waveform');
        waveformContainer.addEventListener('click', (e) => {
            const rect = waveformContainer.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const percentage = relativeX / rect.width;
            const duration = wavesurfer.getDuration();
            const newTime = percentage * duration;
            
            console.log('Starting new layered playback at:', newTime);
            wavesurfer.play(newTime);
        });

        // Set up event listeners
        wavesurfer.on('ready', () => {
            console.log('WaveSurfer ready, initializing playback...');
            // Set initial volume and position
            wavesurfer.setVolume(audioSettings.volume);
            wavesurfer.seekTo(audioSettings.startPosition / wavesurfer.getDuration());
            
            // Start playback automatically
            wavesurfer.play();
        });

        return wavesurfer;
    } catch (error) {
        console.error('Error initializing WaveSurfer:', error);
        return null;
    }
}

// Handle all GSAP animations and scroll triggers
export async function initAnimations() {
    console.log('Starting animation initialization...');
    
    // Show content immediately
    showContent();
    
    // Load audio configuration and initialize WaveSurfer
    const audioConfig = await loadAudioConfig();
    if (audioConfig) {
        initWaveSurfer(audioConfig);
    } else {
        console.error('Failed to initialize audio due to missing configuration');
    }
    console.log('Animation initialization complete');
}

function showContent() {
    console.log('Showing content immediately...');
    
    // Remove loading screen if it exists
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Show mountain and gradient immediately
    const mountainLayer = document.querySelector('.mountain-layer');
    const mountain = document.getElementById('mountain-img');
    const gradientLayer = document.querySelector('.gradient-layer');
    const textContainer = document.querySelector('.text-container');
    
    if (mountain && mountainLayer && gradientLayer) {
        // Show mountain immediately
        mountainLayer.style.opacity = '1';
        gradientLayer.style.opacity = '1';
        console.log('Mountain and gradient layers visible');
    }
    
    // Show text container immediately
    if (textContainer) {
        textContainer.style.opacity = '1';
        textContainer.style.transform = 'translateY(0)';
        console.log('Text container visible');
    }
    
    // Show header content immediately
    const header = document.querySelector('.site-header');
    if (header) {
        header.style.opacity = '1';
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
    console.log('Waiting for DOMContentLoaded...');
} else {
    initAnimations();
} 