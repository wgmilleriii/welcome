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

// Initialize sentence options
const sentenceOptions = {
    start: [
        "I will climb",
        "Let's explore",
        "Time to conquer",
        "We shall reach",
        "Today I'll summit"
    ],
    middle: "the mountain",
    end: [
        "with determination",
        "under starlight",
        "before sunrise",
        "like never before",
        "with fresh energy"
    ]
};

// Populate spinners with options
function populateSpinners() {
    console.log('Populating spinners with options...');
    
    const startSpinner = document.querySelector('.start-spinner');
    const endSpinner = document.querySelector('.end-spinner');
    const middleText = document.querySelector('.middle-text');
    
    if (startSpinner && endSpinner && middleText) {
        // Clear existing content
        startSpinner.innerHTML = '';
        endSpinner.innerHTML = '';
        
        // Add start options
        sentenceOptions.start.forEach(text => {
            const div = document.createElement('div');
            div.textContent = text;
            startSpinner.appendChild(div);
        });
        
        // Set middle text
        middleText.textContent = sentenceOptions.middle;
        
        // Add end options
        sentenceOptions.end.forEach(text => {
            const div = document.createElement('div');
            div.textContent = text;
            endSpinner.appendChild(div);
        });
        
        console.log('Spinners populated successfully');
    } else {
        console.warn('Could not find all required elements for populating spinners');
    }
}

// Generate a random sentence from spinner options
function generateRandomSentence() {
    const startSpinner = document.querySelector('.start-spinner');
    const endSpinner = document.querySelector('.end-spinner');
    const middleText = document.querySelector('.middle-text');
    
    if (!startSpinner || !endSpinner || !middleText) {
        console.warn('Missing required elements for sentence generation');
        return null;
    }
    
    const startOptions = Array.from(startSpinner.children);
    const endOptions = Array.from(endSpinner.children);
    
    const randomStart = startOptions[Math.floor(Math.random() * startOptions.length)].textContent.trim();
    const randomEnd = endOptions[Math.floor(Math.random() * endOptions.length)].textContent.trim();
    const middle = middleText.textContent.trim();
    
    return `${randomStart} ${middle} ${randomEnd}`;
}

// Update the displayed sentence
function updateDisplayedSentence() {
    const sentence = generateRandomSentence();
    const display = document.querySelector('.current-sentence');
    
    if (display && sentence) {
        display.textContent = sentence;
        console.log('New sentence generated:', sentence);
    }
}

// Log sentence options
function logSentenceOptions() {
    const startSpinner = document.querySelector('.start-spinner');
    const endSpinner = document.querySelector('.end-spinner');
    
    if (startSpinner) {
        const startOptions = Array.from(startSpinner.children).map(child => child.textContent.trim());
        console.log('Start Sentence Options:', {
            count: startOptions.length,
            options: startOptions
        });
    } else {
        console.warn('Start spinner not found');
    }
    
    if (endSpinner) {
        const endOptions = Array.from(endSpinner.children).map(child => child.textContent.trim());
        console.log('End Sentence Options:', {
            count: endOptions.length,
            options: endOptions
        });
    } else {
        console.warn('End spinner not found');
    }
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

    // Ensure WaveSurfer is loaded
    if (typeof WaveSurfer === 'undefined') {
        console.error('WaveSurfer failed to load');
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

// Initialize parallax effects
function initParallax() {
    // Mountain layer - slowest
    gsap.to(".mountain-layer", {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            scrub: 0.5
        }
    });

    // Sentence layer - medium speed
    gsap.to(".sentence-layer", {
        yPercent: -40,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            scrub: 0.8
        }
    });

    // Spinner layer - fastest
    gsap.to(".spinner-layer", {
        yPercent: -60,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
}

// Initialize animations
async function initAnimations() {
    console.log('Starting animation initialization...');
    
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize parallax effects
    initParallax();
    
    // Load audio configuration
    let audioConfig = null;
    try {
        const response = await fetch('config/audio.json');
        audioConfig = await response.json();
    } catch (error) {
        console.error('Error loading audio config:', error);
    }
    
    // Initialize WaveSurfer with config
    await initWaveSurfer(audioConfig);
    
    console.log('Animation initialization complete');
}

function showContent() {
    console.log('Showing content immediately...');
    
    // Remove loading screen if it exists
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        console.log('Loading screen removed');
    }
    
    // Show mountain and gradient immediately
    const mountainLayer = document.querySelector('.mountain-layer');
    const mountain = document.getElementById('mountain-img');
    const gradientLayer = document.querySelector('.gradient-layer');
    const textContainer = document.querySelector('.text-container');
    
    console.log('Element states:', {
        mountainLayer: mountainLayer ? 'found' : 'missing',
        mountain: mountain ? 'found' : 'missing',
        gradientLayer: gradientLayer ? 'found' : 'missing',
        textContainer: textContainer ? 'found' : 'missing'
    });
    
    if (mountain && mountainLayer && gradientLayer) {
        mountainLayer.style.opacity = '1';
        gradientLayer.style.opacity = '1';
        console.log('Mountain and gradient layers visible');
    }
    
    // Ensure text container is immediately visible
    if (textContainer) {
        textContainer.style.opacity = '1';
        textContainer.style.visibility = 'visible';
        textContainer.style.transform = 'translate(-50%, -50%)';
        
        // Populate spinners first
        populateSpinners();
        
        // Log all sentence options
        logSentenceOptions();
        
        // Generate initial sentence
        updateDisplayedSentence();
        
        // Set up button click handler
        const generateButton = document.getElementById('generate-goal');
        if (generateButton) {
            generateButton.addEventListener('click', () => {
                console.log('Generate button clicked');
                updateDisplayedSentence();
            });
        }
    }
    
    // Show header content immediately
    const header = document.querySelector('.site-header');
    if (header) {
        header.style.opacity = '1';
        console.log('Header visible');
    }
}

// Show goal recording section
function showGoalSection() {
    const goalSection = document.getElementById('goal-section');
    const currentSentence = document.querySelector('.current-sentence').textContent;
    const goalText = document.querySelector('.goal-text');
    
    if (goalSection && goalText) {
        goalSection.classList.remove('hidden');
        goalText.textContent = currentSentence;
        
        // Scroll to goal section
        goalSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize immediately when possible
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, initializing...');
    
    // Initialize animations which includes audio setup
    await initAnimations();
    
    // Set up record button handler
    const recordButton = document.getElementById('record-goal');
    if (recordButton) {
        recordButton.addEventListener('click', () => {
            console.log('Record button clicked');
            showGoalSection();
        });
    }
    
    // Set up save and share handlers
    const saveButton = document.getElementById('save-goal');
    const shareButton = document.getElementById('share-goal');
    
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            console.log('Save button clicked');
            // TODO: Implement save functionality
            alert('Goal saved!');
        });
    }
    
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            console.log('Share button clicked');
            const goalText = document.querySelector('.goal-text').textContent;
            
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Mountain Goal',
                        text: goalText,
                        url: window.location.href
                    });
                    console.log('Goal shared successfully');
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            } else {
                // Fallback for browsers that don't support sharing
                alert('Share feature not supported by your browser');
            }
        });
    }
    
    console.log('Initialization complete');
});

// Export functions
export { initAnimations, initWaveSurfer }; 