// Initialize GSAP from CDN loaded version
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

// Only register ScrollTrigger if it exists
if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

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

// Handle all GSAP animations and scroll triggers
export async function initAnimations() {
    // Check if GSAP is loaded
    if (!gsap) {
        console.error('GSAP not loaded');
        return;
    }

    console.log('Initializing animations...'); // Debug log
    
    // Load audio configuration
    const audioConfig = await loadAudioConfig();
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                startContentAnimations(audioConfig);
            }
        });
    } else {
        console.warn('Loading screen element not found');
        startContentAnimations(audioConfig);
    }
}

function updateWaveformProgress(audio) {
    const progress = document.getElementById('waveform-progress');
    if (progress) {
        const seek = audio.seek() || 0;
        const duration = audio.duration() || 1;
        const percentage = (seek / duration) * 100;
        progress.style.width = `${percentage}%`;
        
        if (audio.playing()) {
            requestAnimationFrame(() => updateWaveformProgress(audio));
        }
    }
}

function startContentAnimations(audioConfig) {
    // Initial mountain fade in from black
    const mountainLayer = document.querySelector('.mountain-layer');
    const mountain = document.getElementById('mountain-img');
    const gradientLayer = document.querySelector('.gradient-layer');
    
    if (mountain && mountainLayer && gradientLayer) {
        // Set initial states
        gsap.set(mountainLayer, { opacity: 0 });
        gsap.set(gradientLayer, { opacity: 0 });
        
        // Create timeline for coordinated animation
        const tl = gsap.timeline();
        
        // Fade in mountain
        tl.to(mountainLayer, {
            opacity: 1,
            duration: 2,
            ease: "power2.inOut"
        })
        // Fade in gradient/shading
        .to(gradientLayer, {
            opacity: 1,
            duration: 1.5,
            ease: "power2.inOut"
        }, "-=1") // Start 1 second before mountain fade completes
        // Mountain slight movement
        .fromTo(mountain, 
            { y: 0 },
            { 
                y: 100,
                duration: 2,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    // Settle back to center
                    gsap.to(mountain, {
                        y: 0,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            },
            "-=0.5" // Start slightly before gradient completes
        );
    }

    // Set up waveform visualization
    const waveformBg = document.getElementById('waveform-bg');
    const waveformProgress = document.getElementById('waveform-progress');
    const currentExperience = window.currentExperience || 'stravinsky';
    
    if (waveformBg && waveformProgress) {
        const waveformPath = `includes/i/waveforms/${currentExperience}.png`;
        waveformBg.style.backgroundImage = `url(${waveformPath})`;
        waveformProgress.style.backgroundImage = `url(${waveformPath})`;
    }

    // Get audio settings from config
    const audioSettings = audioConfig?.experiences?.[currentExperience] || {
        startPosition: 0,
        volume: 0.7,
        fadeIn: 2.0
    };

    // Initialize audio in muted state
    const audio = new Howl({
        src: [`audio/${currentExperience}.mp3`],
        autoplay: true,
        loop: true,
        volume: 0,
        onload: () => {
            // Start from configured position
            audio.seek(audioSettings.startPosition);
            
            // Start waveform progress animation
            updateWaveformProgress(audio);
            
            // Fade in audio controls once audio is loaded
            gsap.fromTo('.audio-controls',
                { opacity: 0, y: -20 },
                { 
                    opacity: 1, 
                    y: 0,
                    duration: 1,
                    delay: 1,
                    ease: "power2.out"
                }
            );
        },
        onplay: () => {
            updateWaveformProgress(audio);
        },
        onseek: () => {
            updateWaveformProgress(audio);
        }
    });

    // Store audio instance and settings for later use
    window.audioInstance = audio;
    window.audioSettings = audioSettings;

    // Fade in text container
    gsap.fromTo('.text-container',
        { opacity: 0, y: 20 },
        { 
            opacity: 1, 
            y: 0,
            duration: 1.5,
            delay: 2.5, // Start after mountain animation
            ease: "power2.out"
        }
    );

    // Controls fade in sequence
    gsap.to('.spin-controls', {
        opacity: 1,
        duration: 0.5,
        delay: 3
    });

    gsap.to('.mountain-controls', {
        opacity: 1,
        duration: 0.5,
        delay: 3.5
    });
}

// Function to handle experience transitions
export function transitionExperience(newExperience) {
    // Fade out current content
    gsap.to(['.text-container', '.audio-controls'], {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            // Update content based on experience
            updateExperienceContent(newExperience);
            
            // Fade in new content
            gsap.to(['.text-container', '.audio-controls'], {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out"
            });
        }
    });
}

function updateExperienceContent(experience) {
    // Update content based on experience type
    // This will be implemented based on specific requirements for each experience
    console.log(`Updating content for ${experience} experience`);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
} else {
    initAnimations();
} 