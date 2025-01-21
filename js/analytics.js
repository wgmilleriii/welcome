// Analytics Module
class Analytics {
    constructor() {
        this.baseUrl = window.location.origin;
        this.apiEndpoint = `${this.baseUrl}/cmiller/public_html/git/welcome/api/log.php`;
        this.initialized = false;
        this.queue = [];
        this.init();
    }

    init() {
        try {
            // Set up page visibility change detection
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    this.logExit();
                }
            });

            // Set up before unload
            window.addEventListener('beforeunload', () => {
                this.logExit();
            });

            // Log initial pageview
            this.logPageview();

            this.initialized = true;
            // Process any queued events
            this.processQueue();
        } catch (error) {
            console.warn('Analytics initialization error:', error);
        }

        // Log initialization
        console.log(`Analytics Module v${window.JS_VERSION || '1.1'} initializing...`);
    }

    async processQueue() {
        while (this.queue.length > 0) {
            const event = this.queue.shift();
            try {
                await this.sendLog(event);
            } catch (error) {
                console.warn('Failed to process queued event:', error);
            }
        }
    }

    queueEvent(event) {
        this.queue.push(event);
        if (this.initialized) {
            this.processQueue();
        }
    }

    async logPageview() {
        try {
            const event = {
                type: 'pageview',
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString()
            };
            await this.sendLog(event);
        } catch (error) {
            console.warn('Failed to log pageview:', error);
            this.queueEvent(event);
        }
    }

    async logInteraction(action, details = {}) {
        try {
            const event = {
                type: 'interaction',
                action,
                details,
                timestamp: new Date().toISOString()
            };
            await this.sendLog(event);
        } catch (error) {
            console.warn('Failed to log interaction:', error);
            this.queueEvent(event);
        }
    }

    async logError(message, context = {}) {
        try {
            const event = {
                type: 'error',
                message,
                context,
                timestamp: new Date().toISOString()
            };
            await this.sendLog(event);
        } catch (error) {
            console.warn('Failed to log error:', error);
            this.queueEvent(event);
        }
    }

    async logExit() {
        try {
            const event = {
                type: 'exit',
                timestamp: new Date().toISOString(),
                details: {
                    timeOnPage: performance.now(),
                    scrollDepth: window.scrollY + window.innerHeight
                }
            };
            await this.sendLog(event);
        } catch (error) {
            console.warn('Failed to log exit:', error);
        }
    }

    async sendLog(data) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Analytics error:', error);
            throw error;
        }
    }
}

// Initialize analytics
const analytics = new Analytics();
export default analytics; 