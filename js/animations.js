// Initialize GSAP
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

gsap.registerPlugin(ScrollTrigger);

// Handle all GSAP animations and scroll triggers
export function initAnimations() {
    console.log('Initializing animations...'); // Debug log
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.style.display = 'none';
                startContentAnimations();
            }
        });
    } else {
        console.warn('Loading screen element not found');
        startContentAnimations();
    }
}

function startContentAnimations() {
    // Initial mountain animation
    const mountain = document.getElementById('mountain-img');
    if (mountain) {
        gsap.fromTo(mountain, 
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
            }
        );
    }

    // Fade in text container
    gsap.fromTo('.text-container',
        { opacity: 0, y: 20 },
        { 
            opacity: 1, 
            y: 0,
            duration: 1.5,
            delay: 0.5,
            ease: "power2.out"
        }
    );

    // Fade in audio controls
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

    // Footer fade in is handled by CSS animation

    // Controls fade in sequence
    gsap.to('.spin-controls', {
        opacity: 1,
        duration: 0.5,
        delay: 2
    });

    gsap.to('.mountain-controls', {
        opacity: 1,
        duration: 0.5,
        delay: 2.5
    });

    // Parallax effects
    gsap.to('.mountain-layer', {
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1
        },
        y: (i, target) => -target.offsetHeight * 0.1
    });

    // Gradient shift on scroll
    ScrollTrigger.create({
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
            const progress = self.progress;
            document.querySelector('.gradient-layer').style.background = 
                `linear-gradient(${180 + progress * 30}deg, 
                var(--space-blue-1), var(--space-blue-2))`;
        }
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