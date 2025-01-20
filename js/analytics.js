// Analytics Module
class Analytics {
    constructor() {
        this.startTime = Date.now();
        this.lastInteraction = this.startTime;
        this.interactions = 0;
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Log initial pageview
        this.logPageview();
        
        // Setup exit tracking
        this.setupExitTracking();
    }

    setupEventListeners() {
        // Track all clicks
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                class: e.target.className,
                id: e.target.id
            });
        });

        // Track experience switches
        document.querySelectorAll('.experience-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackInteraction('experience_switch', {
                    from: window.currentExperience,
                    to: btn.dataset.experience
                });
            });
        });

        // Track audio controls
        document.querySelectorAll('#audio-controls button').forEach(btn => {
            btn.addEventListener('click', () => {
                this.trackInteraction('audio_control', {
                    action: btn.getAttribute('aria-label').toLowerCase()
                });
            });
        });

        // Track scroll depth
        let maxScroll = 0;
        document.addEventListener('scroll', this.throttle(() => {
            const scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
            if (scrollDepth > maxScroll) {
                maxScroll = scrollDepth;
                this.trackInteraction('scroll_depth', { depth: maxScroll });
            }
        }, 1000));
    }

    setupExitTracking() {
        window.addEventListener('beforeunload', () => {
            this.logExit();
        });

        // Track visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logExit(true);
            }
        });
    }

    async logPageview() {
        try {
            await this.sendLog('pageview');
        } catch (error) {
            console.error('Failed to log pageview:', error);
        }
    }

    async trackInteraction(action, details = {}) {
        this.interactions++;
        this.lastInteraction = Date.now();
        
        try {
            await this.sendLog('interaction', {
                action,
                details,
                timeOnPage: Date.now() - this.startTime,
                interactionCount: this.interactions
            });
        } catch (error) {
            console.error('Failed to log interaction:', error);
        }
    }

    async logExit(isVisibilityChange = false) {
        const data = {
            timeOnPage: Date.now() - this.startTime,
            lastInteraction: Date.now() - this.lastInteraction,
            totalInteractions: this.interactions,
            type: isVisibilityChange ? 'visibility_change' : 'page_exit'
        };

        try {
            await this.sendLog('interaction', {
                action: 'exit',
                details: data
            });

            // Store exit data in localStorage for return visit analysis
            localStorage.setItem('last_visit', JSON.stringify({
                timestamp: Date.now(),
                data
            }));
        } catch (error) {
            console.error('Failed to log exit:', error);
        }
    }

    async sendLog(type, data = {}) {
        try {
            const response = await fetch('/api/log.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type,
                    ...data
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            // Log to console but don't throw to prevent disrupting user experience
            console.error('Analytics error:', error);
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize analytics
export const analytics = new Analytics(); 