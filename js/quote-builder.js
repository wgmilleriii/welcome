import { QuoteStorage } from './quote-storage.js';

export class QuoteBuilder {
    constructor(configManager) {
        this.spinners = document.querySelectorAll('.text-spinner');
        this.mountainScene = document.querySelector('.mountain-scene');
        this.quoteSpace = null;
        this.currentSpinnerText = {
            start: '',
            middle: '',
            end: ''
        };
        this.storage = new QuoteStorage();
        this.init();
    }

    init() {
        this.createQuoteSpace();
        this.setupTriggers();
    }

    createQuoteSpace() {
        this.quoteSpace = document.createElement('div');
        this.quoteSpace.className = 'quote-space';
        document.body.appendChild(this.quoteSpace);
    }

    setupTriggers() {
        const likeButton = document.querySelector('#like-score-btn');
        const dislikeButton = document.querySelector('#dislike-score-btn');

        likeButton.addEventListener('click', () => this.captureAndBuild());
        dislikeButton.addEventListener('click', () => this.triggerNewSpin());
    }

    async captureAndBuild() {
        // Capture current spinner states
        this.spinners.forEach(spinner => {
            const position = spinner.dataset.position;
            this.currentSpinnerText[position] = spinner.textContent.trim();
        });

        // Initiate the transition sequence
        await this.transitionToQuote();
    }

    async transitionToQuote() {
        // 1. Initiate mountain scene transition
        this.mountainScene.classList.add('scene-shift');
        
        // 2. Expand quote space
        this.quoteSpace.classList.add('expand');
        
        // 3. Float spinners to their new positions
        await this.floatSpinnersToQuote();
        
        // 4. Build the final quote
        this.constructQuote();
    }

    async floatSpinnersToQuote() {
        const floatingElements = Array.from(this.spinners).map(spinner => {
            const clone = spinner.cloneNode(true);
            clone.classList.add('floating');
            this.quoteSpace.appendChild(clone);
            
            // Calculate final position
            const finalPos = this.calculateFinalPosition(spinner.dataset.position);
            
            return new Promise(resolve => {
                gsap.to(clone, {
                    x: finalPos.x,
                    y: finalPos.y,
                    duration: 1.5,
                    ease: "power2.inOut",
                    onComplete: resolve
                });
            });
        });

        return Promise.all(floatingElements);
    }

    constructQuote() {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'generated-quote';
        
        quoteElement.innerHTML = `
            <blockquote>
                <p class="quote-text">
                    <span class="quote-start">${this.currentSpinnerText.start}</span>
                    <span class="quote-middle">${this.currentSpinnerText.middle}</span>
                    <span class="quote-end">${this.currentSpinnerText.end}</span>
                </p>
            </blockquote>
            <div class="quote-actions">
                <input type="text" class="name-input" placeholder="Enter your name">
                <div class="action-buttons">
                    <button class="make-famous-btn">Make Me Famous</button>
                    <button class="already-famous-btn">For I Am Already Famous</button>
                </div>
            </div>
        `;

        this.quoteSpace.appendChild(quoteElement);
        this.setupQuoteInteractions(quoteElement);
    }

    setupQuoteInteractions(quoteElement) {
        const nameInput = quoteElement.querySelector('.name-input');
        const makeFamousBtn = quoteElement.querySelector('.make-famous-btn');
        const alreadyFamousBtn = quoteElement.querySelector('.already-famous-btn');

        makeFamousBtn.addEventListener('click', () => this.saveQuote(nameInput.value));
        alreadyFamousBtn.addEventListener('click', () => this.saveQuote('Anonymous Dreamer'));
    }

    async saveQuote(attribution) {
        if (!attribution.trim()) {
            this.showError('Please enter a name for attribution');
            return;
        }

        const quoteData = {
            start: this.currentSpinnerText.start,
            middle: this.currentSpinnerText.middle,
            end: this.currentSpinnerText.end,
            attribution: attribution,
            mountainId: this.mountainScene.dataset.currentMountain
        };

        try {
            const result = await this.storage.saveQuote(quoteData);
            if (result.success) {
                this.showShareOptions(result.shareUrl);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            this.showError('Failed to save quote. Please try again.');
            console.error('Save error:', error);
        }
    }

    showShareOptions(shareUrl) {
        const shareDialog = document.createElement('div');
        shareDialog.className = 'share-dialog';
        
        shareDialog.innerHTML = `
            <div class="share-content">
                <h3>Your quote has been saved!</h3>
                <p>Share your mountain inspiration:</p>
                <div class="share-buttons">
                    <button class="share-btn twitter">
                        <svg><!-- Twitter icon --></svg>
                        Twitter
                    </button>
                    <button class="share-btn facebook">
                        <svg><!-- Facebook icon --></svg>
                        Facebook
                    </button>
                    <button class="share-btn copy">
                        <svg><!-- Copy icon --></svg>
                        Copy Link
                    </button>
                </div>
                <input type="text" readonly value="${window.location.origin}${shareUrl}" class="share-url">
            </div>
        `;

        this.quoteSpace.appendChild(shareDialog);
        this.setupShareButtons(shareDialog, shareUrl);
    }

    setupShareButtons(dialog, shareUrl) {
        const fullUrl = `${window.location.origin}${shareUrl}`;
        const text = 'Check out my mountain inspiration!';

        dialog.querySelector('.twitter').addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(text)}`);
        });

        dialog.querySelector('.facebook').addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`);
        });

        dialog.querySelector('.copy').addEventListener('click', () => {
            navigator.clipboard.writeText(fullUrl).then(() => {
                this.showToast('Link copied to clipboard!');
            });
        });
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast error';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    triggerNewSpin() {
        // Trigger new spin animation
        this.spinners.forEach(spinner => {
            spinner.classList.add('respin');
            setTimeout(() => spinner.classList.remove('respin'), 1000);
        });
    }
} 