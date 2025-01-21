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
function initWaveSurfer(audioConfig) {
    console.log('Initializing WaveSurfer...');
    
    // Check if WaveSurfer is loaded
    if (typeof WaveSurfer === 'undefined') {
        console.error('WaveSurfer is not loaded. Make sure to include the WaveSurfer script.');
        return null;
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
            waveColor: 'rgba(255, 255, 255, 0.3)',
            progressColor: 'rgba(255, 255, 255, 0.8)',
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
            dragToSeek: true, // Enable drag-to-seek functionality
            plugins: [
                // Add envelope plugin for fade effects
                WaveSurfer.envelope.create({
                    fadeInStart: 0,
                    fadeInEnd: 0.8,
                    fadeInCurve: 'linear',
                    fadeOutStart: -0.8, // Start fade out 0.8 seconds before end
                    fadeOutEnd: 0,
                    fadeOutCurve: 'linear'
                })
            ]
        });

        console.log('WaveSurfer instance created successfully');

        // Load audio file
        const audioFile = `audio/${currentExperience}.mp3`;
        console.log(`Loading audio file: ${audioFile}`);
        wavesurfer.load(audioFile);

        // Set up time update handler for marker movement
        const seekMarker = document.createElement('div');
        seekMarker.id = 'seek-marker';
        document.querySelector('#waveform').appendChild(seekMarker);

        wavesurfer.on('audioprocess', () => {
            const currentTime = wavesurfer.getCurrentTime();
            const duration = wavesurfer.getDuration();
            const progress = (currentTime / duration) * 100;
            seekMarker.style.left = `${progress}%`;
            seekMarker.style.opacity = '1';
        });

        // Hide marker when playback ends
        wavesurfer.on('finish', () => {
            seekMarker.style.opacity = '0';
        });

        // Set up event listeners
        wavesurfer.on('ready', () => {
            console.log('WaveSurfer ready, initializing playback...');
            // Set initial volume and position
            wavesurfer.setVolume(audioSettings.volume); // Set to target volume immediately since we have envelope
            wavesurfer.seekTo(audioSettings.startPosition / wavesurfer.getDuration());
            
            // Start playback
            wavesurfer.play();
        });

        // Set up play button
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.onclick = () => {
                wavesurfer.playPause();
                const isPlaying = wavesurfer.isPlaying();
                console.log(`Playback state changed: ${isPlaying ? 'playing' : 'paused'}`);
                playBtn.innerHTML = isPlaying ? 
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>' :
                    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
                
                // Show/hide marker based on playback state
                seekMarker.style.opacity = isPlaying ? '1' : '0';
            };
        }

        // Set up mute button
        const muteBtn = document.getElementById('mute-btn');
        if (muteBtn) {
            muteBtn.onclick = () => {
                const isMuted = wavesurfer.getVolume() === 0;
                if (isMuted) {
                    // Fade in when unmuting
                    gsap.to({volume: 0}, {
                        volume: audioSettings.volume,
                        duration: 1.0,
                        ease: "power2.inOut",
                        onUpdate: function() {
                            wavesurfer.setVolume(this.targets()[0].volume);
                        }
                    });
                } else {
                    // Fade out when muting
                    gsap.to({volume: wavesurfer.getVolume()}, {
                        volume: 0,
                        duration: 1.0,
                        ease: "power2.inOut",
                        onUpdate: function() {
                            wavesurfer.setVolume(this.targets()[0].volume);
                        }
                    });
                }
                console.log(`Audio ${isMuted ? 'unmuted' : 'muted'}`);
                muteBtn.setAttribute('aria-label', isMuted ? 'Mute' : 'Unmute');
                muteBtn.classList.toggle('muted', !isMuted);
            };
        }

        // Enable seeking by clicking on waveform
        wavesurfer.on('interaction', (newTime) => {
            console.log('Waveform interaction - seeking to:', newTime);
            seekMarker.style.opacity = wavesurfer.isPlaying() ? '1' : '0';
        });

        // Add click handler for waveform container
        const waveformContainer = document.querySelector('#waveform');
        waveformContainer.addEventListener('click', (e) => {
            const rect = waveformContainer.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            const percentage = relativeX / rect.width;
            const duration = wavesurfer.getDuration();
            const newTime = percentage * duration;
            
            console.log('Waveform clicked - seeking to:', newTime);
            wavesurfer.seekTo(percentage);
            
            if (!wavesurfer.isPlaying()) {
                wavesurfer.play();
                playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
            }
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
    
    if (mountain && mountainLayer && gradientLayer) {
        // Show mountain immediately
        mountainLayer.style.opacity = '1';
        gradientLayer.style.opacity = '1';
        console.log('Mountain and gradient layers visible');
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