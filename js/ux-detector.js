// UX Detector Module
class UXDetector {
    constructor() {
        this.COOKIE_NAME = 'preferred_experience';
        this.COOKIE_DURATION = 30; // days
    }

    init() {
        // Check URL parameter first
        const urlParams = new URLSearchParams(window.location.search);
        const uxParam = urlParams.get('ux');
        
        if (uxParam) {
            this.setPreferredExperience(uxParam);
            // Clean URL without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
            return uxParam;
        }

        // Then check cookie
        const cookieUX = this.getCookie(this.COOKIE_NAME);
        if (cookieUX) {
            return cookieUX;
        }

        // Default to stravinsky if no preference found
        return 'stravinsky';
    }

    setPreferredExperience(experience) {
        // Set cookie
        const date = new Date();
        date.setTime(date.getTime() + (this.COOKIE_DURATION * 24 * 60 * 60 * 1000));
        document.cookie = `${this.COOKIE_NAME}=${experience};expires=${date.toUTCString()};path=/`;
    }

    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
        return null;
    }

    generateRedirectUrl(experience) {
        const currentUrl = window.location.href.split('?')[0];
        return `${currentUrl}?ux=${experience}`;
    }
}

export const uxDetector = new UXDetector(); 