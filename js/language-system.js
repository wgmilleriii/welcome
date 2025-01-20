export class LanguageSystem {
    constructor(quoteSystem) {
        this.quoteSystem = quoteSystem;
        this.currentLanguage = 'en';
        this.languages = null;
        this.init();
    }

    async init() {
        await this.loadLanguages();
        this.setupLanguageSelector();
        this.updateTexts();
    }

    async loadLanguages() {
        const response = await fetch('src/data/languages.json');
        const data = await response.json();
        this.languages = data.languages;
        this.svgIcons = data.svgIcons;
        
        // Update SVGs in the DOM
        this.updateSVGIcons();
    }

    updateSVGIcons() {
        // Update language icon
        document.querySelector('.language-btn svg').outerHTML = this.svgIcons.language;
        
        // Update sentiment buttons
        document.querySelector('.sentiment-btn.like svg').outerHTML = this.svgIcons.like;
        document.querySelector('.sentiment-btn.dislike svg').outerHTML = this.svgIcons.dislike;
    }

    setupLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        
        // Create main button
        const mainBtn = document.createElement('button');
        mainBtn.className = 'language-btn';
        mainBtn.innerHTML = `
            ${this.svgIcons.language}
            <span class="language-icon">${this.getCurrentLanguage().icon}</span>
            <span>${this.getCurrentLanguage().name}</span>
        `;
        
        // Create language menu
        const menu = document.createElement('div');
        menu.className = 'language-menu';
        
        // Add language options
        this.languages.forEach(lang => {
            const option = document.createElement('button');
            option.className = `language-btn ${lang.code === this.currentLanguage ? 'active' : ''}`;
            option.innerHTML = `
                <span class="language-icon">${lang.icon}</span>
                <span>${lang.name}</span>
            `;
            option.addEventListener('click', () => this.changeLanguage(lang.code));
            menu.appendChild(option);
        });
        
        // Toggle menu
        mainBtn.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
        
        selector.appendChild(mainBtn);
        selector.appendChild(menu);
        document.body.appendChild(selector);
    }

    getCurrentLanguage() {
        return this.languages.find(lang => lang.code === this.currentLanguage);
    }

    changeLanguage(code) {
        this.currentLanguage = code;
        this.updateTexts();
        
        // Update selector button
        const mainBtn = document.querySelector('.language-selector .language-btn');
        mainBtn.innerHTML = `
            ${this.svgIcons.language}
            <span class="language-icon">${this.getCurrentLanguage().icon}</span>
            <span>${this.getCurrentLanguage().name}</span>
        `;
        
        // Update active state in menu
        document.querySelectorAll('.language-menu .language-btn').forEach(btn => {
            btn.classList.toggle('active', btn.querySelector('span:last-child').textContent === this.getCurrentLanguage().name);
        });
        
        // Close menu
        document.querySelector('.language-menu').classList.remove('active');
        
        // Update quote panel if open
        if (this.quoteSystem.currentQuote) {
            this.quoteSystem.showQuotePanel(this.quoteSystem.currentQuote);
        }
    }

    updateTexts() {
        const lang = this.getCurrentLanguage();
        const sentences = lang.sentences[0]; // Using first sentence set for now
        
        // Update spinners with new language options
        this.quoteSystem.updateSpinnerOptions(sentences);
    }

    getRandomText(type) {
        const lang = this.getCurrentLanguage();
        const sentences = lang.sentences[0];
        const options = sentences[type];
        return options[Math.floor(Math.random() * options.length)];
    }
} 