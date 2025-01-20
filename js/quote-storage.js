export class QuoteStorage {
    constructor() {
        // Base URL for the application
        this.baseUrl = '/cmiller/public_html/git/welcome';
        this.storagePath = `${this.baseUrl}/data/quotes/`;
    }

    async saveQuote(quoteData) {
        const timestamp = new Date().toISOString();
        const shareToken = this.generateShareToken();
        
        const quoteEntry = {
            id: shareToken,
            timestamp,
            quote: {
                start: quoteData.start,
                middle: quoteData.middle,
                end: quoteData.end
            },
            attribution: quoteData.attribution,
            mountainId: quoteData.mountainId,
            views: 0,
            likes: 0
        };

        try {
            // Update API endpoint path to match localhost environment
            const response = await fetch(`${this.baseUrl}/api/save-quote.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quoteEntry)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Quote saved:', result); // Debug logging
            return result;
        } catch (error) {
            console.error('Failed to save quote:', error);
            throw error;
        }
    }

    generateShareToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(16)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
} 