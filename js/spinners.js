// Log initialization
console.log(`Spinners Module v${window.JS_VERSION || '1.1'} initializing...`);

// Handle text spinning animations
export function initSpinners(state) {
    const startSpinner = document.getElementById('start-spinner');
    const middleText = document.getElementById('middle-text');
    const endSpinner = document.getElementById('end-spinner');

    // Load text content
    fetch('src/data/text-content.json')
        .then(response => response.json())
        .then(data => {
            const { sentences } = data;
            let currentIndex = 0;

            // Set initial text
            updateSpinnerText(startSpinner, sentences[0].start.options[0]);
            updateSpinnerText(middleText, sentences[0].middle.text);
            updateSpinnerText(endSpinner, sentences[0].end.options[0]);

            // Add hover effects
            startSpinner.addEventListener('mouseenter', () => {
                if (!state.isSpinning) return;
                spinText(startSpinner, sentences[currentIndex].start.options, 2);
            });

            endSpinner.addEventListener('mouseenter', () => {
                if (!state.isSpinning) return;
                spinText(endSpinner, sentences[currentIndex].end.options, -2);
            });

            // Gentle automatic spinning
            let autoSpinInterval = setInterval(() => {
                if (!state.isSpinning) return;
                spinText(startSpinner, sentences[currentIndex].start.options, 1);
                setTimeout(() => {
                    spinText(endSpinner, sentences[currentIndex].end.options, -1);
                }, 500);
            }, 5000);

            // Handle scroll-based spinning
            let lastScrollY = window.scrollY;
            let scrollVelocity = 0;
            let scrollTimeout;

            window.addEventListener('scroll', () => {
                if (!state.isSpinning) return;

                // Clear auto-spin interval during scroll
                clearInterval(autoSpinInterval);

                const currentScrollY = window.scrollY;
                scrollVelocity = Math.abs(currentScrollY - lastScrollY);
                
                if (scrollVelocity > 0) {
                    const speed = Math.min(scrollVelocity / 50, 10);
                    spinText(startSpinner, sentences[currentIndex].start.options, speed);
                    spinText(endSpinner, sentences[currentIndex].end.options, -speed);
                }

                lastScrollY = currentScrollY;

                // Restart auto-spin after scroll stops
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    autoSpinInterval = setInterval(() => {
                        if (!state.isSpinning) return;
                        spinText(startSpinner, sentences[currentIndex].start.options, 1);
                        setTimeout(() => {
                            spinText(endSpinner, sentences[currentIndex].end.options, -1);
                        }, 500);
                    }, 5000);
                }, 1000);
            });
        });
}

function updateSpinnerText(element, text) {
    element.textContent = text;
}

function spinText(element, options, speed) {
    const currentIndex = options.indexOf(element.textContent);
    const nextIndex = (currentIndex + Math.sign(speed) + options.length) % options.length;
    
    gsap.to(element, {
        rotationX: `+=${speed * 360}`,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
            element.textContent = options[nextIndex];
        }
    });
} 