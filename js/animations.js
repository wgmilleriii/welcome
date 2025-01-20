// Handle all GSAP animations and scroll triggers
export function initAnimations() {
    console.log('Initializing animations...'); // Debug log
    
    // Mountain fade in
    gsap.to('.mountain-layer', {
        opacity: 1,
        duration: 2,
        delay: 0.5,
        ease: 'power2.inOut'
    });

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

// Auto-initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing animations...'); // Debug log
    initAnimations();
}); 