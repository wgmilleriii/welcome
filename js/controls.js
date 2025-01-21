// Handle all user interface controls
export function initControls(state, sound) {
    const muteBtn = document.getElementById('mute-btn');
    const playBtn = document.getElementById('play-btn');
    const spinToggle = document.getElementById('spin-toggle');
    const mountainBtns = document.querySelectorAll('.mountain-btn');

    // Audio controls
    muteBtn.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        sound.mute(state.isMuted);
        muteBtn.classList.toggle('active', state.isMuted);
    });

    playBtn.addEventListener('click', () => {
        state.isPlaying = !state.isPlaying;
        if (state.isPlaying) {
            sound.play();
        } else {
            sound.pause();
        }
        playBtn.classList.toggle('active', state.isPlaying);
    });

    // Spin controls
    spinToggle.addEventListener('click', () => {
        state.isSpinning = !state.isSpinning;
        spinToggle.classList.toggle('active', state.isSpinning);
    });

    // Mountain controls
    mountainBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mountain = btn.dataset.mountain;
            if (mountain === state.currentMountain) return;
            
            const img = document.getElementById('mountain-img');
            gsap.to(img, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    img.src = `assets/mountains/${mountain}.png`;
                    gsap.to(img, {
                        opacity: 1,
                        duration: 0.5
                    });
                }
            });
            
            state.currentMountain = mountain;
        });
    });

    // Initialize video preview
    const videoPreview = new VideoPreview();

    // Update controls for better mobile experience
    const playBtnMobile = document.getElementById('play-btn');
    const muteBtnMobile = document.getElementById('mute-btn');

    // Add haptic feedback for controls
    [playBtnMobile, muteBtnMobile].forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.navigator.vibrate) {
                window.navigator.vibrate(25);
            }
        });
    });

    // Initialize scrubber
    const scrubber = new Scrubber(sound, state);

    // Log initialization
    console.log(`Controls Module v${window.JS_VERSION || '1.1'} initializing...`);
}

class VideoPreview {
    constructor() {
        this.previewEl = document.getElementById('video-preview');
        this.thumbnailEl = document.getElementById('video-thumbnail');
        this.linkEl = document.getElementById('video-link');
        this.infoBtn = document.getElementById('video-info-btn');
        this.isVisible = false;
        
        this.videoData = {
            thumbnail: 'assets/video-thumbnail.jpg',
            title: 'Full Experience Video',
            url: '#' // Replace with actual video URL
        };

        this.init();
    }

    init() {
        // Toggle preview on info button click
        this.infoBtn.addEventListener('click', () => this.togglePreview());

        // Close preview when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.previewEl.contains(e.target) && 
                !this.infoBtn.contains(e.target) && 
                this.isVisible) {
                this.hidePreview();
            }
        });

        // Handle touch events for mobile
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let touchStartY = 0;
        
        this.previewEl.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        this.previewEl.addEventListener('touchmove', (e) => {
            const deltaY = e.touches[0].clientY - touchStartY;
            if (deltaY > 50) { // Swipe down threshold
                this.hidePreview();
            }
        }, { passive: true });
    }

    togglePreview() {
        if (this.isVisible) {
            this.hidePreview();
        } else {
            this.showPreview();
        }
    }

    showPreview() {
        this.previewEl.classList.add('active');
        this.infoBtn.classList.add('active');
        this.isVisible = true;

        // Add haptic feedback if available
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }

    hidePreview() {
        this.previewEl.classList.remove('active');
        this.infoBtn.classList.remove('active');
        this.isVisible = false;
    }

    updateVideoData(data) {
        this.videoData = { ...this.videoData, ...data };
        this.thumbnailEl.src = this.videoData.thumbnail;
        this.linkEl.href = this.videoData.url;
    }
}

class Scrubber {
    constructor(sound, state) {
        this.sound = sound;
        this.state = state;
        this.container = document.getElementById('scrubber-container');
        this.progress = document.getElementById('scrubber-progress');
        this.handle = document.getElementById('scrubber-handle');
        this.timeDisplay = document.getElementById('scrubber-time');
        this.isDragging = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startProgressUpdate();
    }

    setupEventListeners() {
        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.startDragging(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDragging());
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.startDragging(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.stopDragging());
        
        // Click to seek
        this.container.addEventListener('click', (e) => this.seek(e));
        
        // Show time on hover
        this.container.addEventListener('mousemove', (e) => this.updateTimeDisplay(e));
    }

    startProgressUpdate() {
        requestAnimationFrame(() => this.updateProgress());
    }

    updateProgress() {
        if (!this.isDragging && this.sound.playing()) {
            const progress = this.sound.seek() / this.sound.duration();
            this.setProgress(progress);
        }
        requestAnimationFrame(() => this.updateProgress());
    }

    setProgress(progress) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        this.progress.style.transform = `scaleX(${clampedProgress})`;
        this.handle.style.left = `${clampedProgress * 100}%`;
    }

    startDragging(e) {
        e.preventDefault();
        this.isDragging = true;
        this.container.classList.add('dragging');
        
        // Add haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(25);
        }
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const rect = this.container.getBoundingClientRect();
        const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        
        this.setProgress(progress);
        this.updateTimeDisplay(e);
    }

    stopDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.container.classList.remove('dragging');
        
        const progress = parseFloat(this.handle.style.left) / 100;
        const seekTime = progress * this.sound.duration();
        this.sound.seek(seekTime);
        
        // Add haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(25);
        }
    }

    seek(e) {
        const rect = this.container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        const seekTime = progress * this.sound.duration();
        
        this.sound.seek(seekTime);
        this.setProgress(progress);
        
        // Add haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(25);
        }
    }

    updateTimeDisplay(e) {
        const rect = this.container.getBoundingClientRect();
        const x = (e.type.includes('touch') ? e.touches[0].clientX : e.clientX) - rect.left;
        const progress = Math.max(0, Math.min(1, x / rect.width));
        const time = progress * this.sound.duration();
        
        this.timeDisplay.textContent = this.formatTime(time);
        this.timeDisplay.style.left = `${progress * 100}%`;
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
} 