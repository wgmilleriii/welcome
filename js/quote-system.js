export class QuoteSystem {
    constructor(state) {
        this.state = state;
        this.quotes = [];
        this.currentQuote = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        // Create and append sentiment controls
        const sentimentControls = document.createElement('div');
        sentimentControls.className = 'sentiment-controls';
        sentimentControls.innerHTML = `
            <button class="sentiment-btn like" aria-label="I like this">
                <svg><!-- Add like icon SVG --></svg>
            </button>
            <button class="sentiment-btn dislike" aria-label="I don't like this">
                <svg><!-- Add dislike icon SVG --></svg>
            </button>
        `;
        document.body.appendChild(sentimentControls);

        // Create and append quote panel
        const quotePanel = document.createElement('div');
        quotePanel.className = 'quote-panel';
        quotePanel.innerHTML = `
            <div class="quote-content">
                <blockquote>
                    "<span class="quote-text"></span>"
                </blockquote>
                <div class="attribution">
                    — <input type="text" placeholder="me" class="name-input">
                    <span class="date">2025</span>
                </div>
            </div>
            <div class="quote-actions">
                <button class="quote-btn make-famous-btn">Make Me Famous</button>
                <button class="quote-btn already-famous-btn">For I Am Already Famous</button>
            </div>
        `;
        document.body.appendChild(quotePanel);

        // Create quote collection container
        const quoteCollection = document.createElement('div');
        quoteCollection.className = 'quote-collection';
        document.body.appendChild(quoteCollection);

        // Store references
        this.elements = {
            panel: quotePanel,
            text: quotePanel.querySelector('.quote-text'),
            nameInput: quotePanel.querySelector('.name-input'),
            collection: quoteCollection,
            likeBtn: sentimentControls.querySelector('.like'),
            dislikeBtn: sentimentControls.querySelector('.dislike'),
            makeFamousBtn: quotePanel.querySelector('.make-famous-btn'),
            alreadyFamousBtn: quotePanel.querySelector('.already-famous-btn')
        };
    }

    setupEventListeners() {
        this.elements.likeBtn.addEventListener('click', () => this.handleLike());
        this.elements.dislikeBtn.addEventListener('click', () => this.handleDislike());
        this.elements.makeFamousBtn.addEventListener('click', () => this.makeQuoteFamous());
        this.elements.alreadyFamousBtn.addEventListener('click', () => this.makeQuoteFamous(true));
    }

    handleLike() {
        const sentence = this.captureCurrentSentence();
        this.currentQuote = sentence;
        this.showQuotePanel(sentence);
    }

    handleDislike() {
        // Trigger new spin animation
        document.dispatchEvent(new CustomEvent('forceSpin'));
    }

    captureCurrentSentence() {
        const startSpinner = document.getElementById('start-spinner');
        const middleText = document.getElementById('middle-text');
        const endSpinner = document.getElementById('end-spinner');

        return {
            start: startSpinner.textContent,
            middle: middleText.textContent,
            end: endSpinner.textContent
        };
    }

    showQuotePanel(sentence) {
        this.elements.text.textContent = 
            `${sentence.start} ${sentence.middle} ${sentence.end}`;
        this.elements.panel.classList.add('active');
    }

    makeQuoteFamous(alreadyFamous = false) {
        const name = alreadyFamous ? 'Anonymous Sage' : this.elements.nameInput.value || 'me';
        const quote = {
            text: this.currentQuote,
            author: name,
            date: '2025',
            timestamp: Date.now()
        };

        this.quotes.push(quote);
        this.addQuoteToCollection(quote);
        this.hideQuotePanel();
    }

    addQuoteToCollection(quote) {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'saved-quote';
        quoteElement.innerHTML = `
            <blockquote>
                "${quote.text.start} ${quote.text.middle} ${quote.text.end}"
            </blockquote>
            <div class="attribution">
                — ${quote.author}, ${quote.date}
            </div>
        `;

        this.elements.collection.appendChild(quoteElement);
        
        // Trigger scroll to new quote
        setTimeout(() => {
            quoteElement.scrollIntoView({ behavior: 'smooth' });
            quoteElement.classList.add('visible');
        }, 100);
    }

    hideQuotePanel() {
        this.elements.panel.classList.remove('active');
        this.elements.nameInput.value = '';
    }
} 