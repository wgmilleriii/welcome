export class FooterMenu {
    constructor(configManager) {
        this.config = configManager.getConfig('content').footer;
        this.menu = document.getElementById('footer-menu');
        this.hasShown = false;
        this.init();
    }

    init() {
        this.setupScrollTrigger();
        this.setupButtons();
    }

    setupScrollTrigger() {
        // Show footer menu after scrolling 20% of the page
        const showThreshold = window.innerHeight * 0.2;
        
        let lastScrollPosition = 0;
        let scrollTimeout;

        window.addEventListener('scroll', () => {
            if (!this.hasShown && window.scrollY > showThreshold) {
                this.showMenu();
            }

            // Handle scroll direction for potential hiding/showing
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const currentScroll = window.scrollY;
                if (currentScroll > lastScrollPosition) {
                    // Scrolling down - could hide menu
                    this.menu.style.transform = 'translateY(100%)';
                } else {
                    // Scrolling up - show menu if already triggered
                    if (this.hasShown) {
                        this.menu.style.transform = this.getTargetTransform();
                    }
                }
                lastScrollPosition = currentScroll;
            }, 100);
        });
    }

    getTargetTransform() {
        // Different stop points for mobile and desktop
        const isMobile = window.innerWidth < 768;
        return `translateY(${isMobile ? '70%' : '75%'})`;
    }

    showMenu() {
        this.hasShown = true;
        this.menu.classList.add('active');
        
        // Add haptic feedback for mobile
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }

    setupButtons() {
        const shareBtn = document.getElementById('share-btn');
        const downloadBtn = document.getElementById('download-btn');
        const favoriteBtn = document.getElementById('favorite-btn');

        shareBtn.addEventListener('click', () => this.handleShare());
        downloadBtn.addEventListener('click', () => this.handleDownload());
        favoriteBtn.addEventListener('click', () => this.handleFavorite());
    }

    handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Mountain Experience',
                text: 'Check out this amazing mountain experience!',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback sharing method
            this.copyToClipboard(window.location.href);
        }
    }

    handleDownload() {
        // Implement download functionality
        console.log('Download functionality to be implemented');
    }

    handleFavorite() {
        const btn = document.getElementById('favorite-btn');
        btn.classList.toggle('active');
        
        // Add haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(25);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success message
            this.showToast('Link copied to clipboard!');
        }).catch(console.error);
    }

    showToast(message) {
        // Implementation of toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
} 