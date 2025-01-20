// Experience Manager Module
import { uxDetector } from './ux-detector.js';

class ExperienceManager {
    constructor() {
        this.currentExperience = null;
        this.experiences = null;
        this.sound = null;
    }

    async init() {
        try {
            // Load experiences data
            const response = await fetch('/src/data/experiences.json');
            this.experiences = await response.json();
            
            // Initialize with detected experience
            this.currentExperience = uxDetector.init();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial experience
            this.loadExperience(this.currentExperience);
            
            // Update UI to reflect current experience
            this.updateUIState();
        } catch (error) {
            console.error('Failed to initialize ExperienceManager:', error);
        }
    }

    setupEventListeners() {
        const buttons = document.querySelectorAll('.experience-btn');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const experience = button.dataset.experience;
                
                // If it's a direct switch button
                if (button.dataset.switchType === 'direct') {
                    this.switchExperience(experience);
                    uxDetector.setPreferredExperience(experience);
                    
                    // Update active state
                    buttons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                } else {
                    // Redirect to change experience
                    window.location.href = uxDetector.generateRedirectUrl(experience);
                }
            });
        });
    }

    updateUIState() {
        // Update active button
        const buttons = document.querySelectorAll('.experience-btn');
        buttons.forEach(button => {
            if (button.dataset.experience === this.currentExperience) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    async loadExperience(experienceId) {
        const experience = this.experiences.experiences.find(exp => exp.id === experienceId);
        if (!experience) return;

        // Update video link
        const videoLink = document.querySelector('.video-link');
        if (videoLink) {
            videoLink.href = experience.videoUrl;
        }

        // Update theme colors
        document.documentElement.style.setProperty('--primary-color', experience.theme.primaryColor);
        document.documentElement.style.setProperty('--accent-color', experience.theme.accentColor);

        // Load and play audio
        if (this.sound) {
            this.sound.unload();
        }
        
        this.sound = new Howl({
            src: [experience.audioFile],
            loop: true,
            volume: 0.5,
            autoplay: false
        });
    }

    switchExperience(experienceId) {
        // Fade out current experience
        gsap.to('.mountain-layer', {
            opacity: 0,
            duration: 1,
            onComplete: () => {
                // Load new experience
                this.loadExperience(experienceId);
                
                // Fade in new experience
                gsap.to('.mountain-layer', {
                    opacity: 1,
                    duration: 1
                });
            }
        });
    }

    playAudio() {
        if (this.sound) {
            this.sound.play();
        }
    }

    pauseAudio() {
        if (this.sound) {
            this.sound.pause();
        }
    }

    toggleMute() {
        if (this.sound) {
            this.sound.mute(!this.sound.mute());
        }
    }
}

export const experienceManager = new ExperienceManager(); 