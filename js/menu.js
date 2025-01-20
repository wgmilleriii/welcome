export class Menu {
    constructor() {
        this.trigger = document.getElementById('menu-trigger');
        this.menu = document.getElementById('fullscreen-menu');
        this.firstTimeOverlay = document.getElementById('first-time-overlay');
        this.hasSeenOverlay = localStorage.getItem('hasSeenOverlay');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkFirstTime();
    }

    setupEventListeners() {
        // Menu trigger
        this.trigger.addEventListener('click', () => {
            this.toggleMenu();
            
            // Haptic feedback
            if (window.navigator.vibrate) {
                window.navigator.vibrate(25);
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.menu.contains(e.target) && 
                !this.trigger.contains(e.target) && 
                this.menu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Button actions
        document.getElementById('primary-action').addEventListener('click', () => {
            this.handlePrimaryAction();
        });

        document.getElementById('secondary-action-1').addEventListener('click', () => {
            this.handleSecondaryAction1();
        });

        document.getElementById('secondary-action-2').addEventListener('click', () => {
            this.handleSecondaryAction2();
        });

        // First-time overlay
        document.getElementById('start-experience').addEventListener('click', () => {
            this.closeFirstTimeOverlay();
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });
    }

    checkFirstTime() {
        if (!this.hasSeenOverlay) {
            this.showFirstTimeOverlay();
        }
    }

    showFirstTimeOverlay() {
        this.firstTimeOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeFirstTimeOverlay() {
        this.firstTimeOverlay.classList.remove('active');
        document.body.style.overflow = '';
        localStorage.setItem('hasSeenOverlay', 'true');
        
        // Haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate([25, 50, 25]);
        }
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.trigger.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.menu.classList.remove('active');
        this.trigger.classList.remove('active');
        document.body.style.overflow = '';
    }

    handlePrimaryAction() {
        // Implement primary action
        this.closeMenu();
        // Add your primary action logic here
    }

    handleSecondaryAction1() {
        // Implement secondary action 1
        this.closeMenu();
        // Add your secondary action 1 logic here
    }

    handleSecondaryAction2() {
        // Implement secondary action 2
        this.closeMenu();
        // Add your secondary action 2 logic here
    }
} 