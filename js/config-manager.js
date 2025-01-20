export class ConfigManager {
    constructor() {
        this.configs = {
            appearance: null,
            content: null,
            audio: null,
            interactions: null
        };
    }

    async init() {
        try {
            await this.loadAllConfigs();
            this.applyConfigs();
        } catch (error) {
            console.error('Error loading configurations:', error);
        }
    }

    async loadAllConfigs() {
        const configFiles = ['appearance', 'content', 'audio', 'interactions'];
        
        await Promise.all(configFiles.map(async (configName) => {
            const response = await fetch(`src/config/${configName}.json`);
            this.configs[configName] = await response.json();
        }));
    }

    applyConfigs() {
        this.applyTheme();
        this.applyContent();
        this.setupAudio();
        this.setupInteractions();
    }

    applyTheme() {
        const { colors } = this.configs.appearance.theme;
        const root = document.documentElement;
        
        // Apply CSS variables
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });
    }

    applyContent() {
        const { buttons } = this.configs.content.menu;
        
        // Apply button text and hrefs
        Object.entries(buttons).forEach(([key, data]) => {
            const button = document.getElementById(`${key}-action`);
            if (button) {
                button.textContent = data.text;
                if (data.href) {
                    button.setAttribute('data-href', data.href);
                }
                button.className = `menu-btn ${data.class}`;
            }
        });

        // Apply overlay content
        const { firstTimeOverlay } = this.configs.content;
        const overlay = document.getElementById('first-time-overlay');
        if (overlay) {
            overlay.querySelector('h2').textContent = firstTimeOverlay.title;
            overlay.querySelector('p').textContent = firstTimeOverlay.description;
            overlay.querySelector('button').textContent = firstTimeOverlay.buttonText;
        }
    }

    setupAudio() {
        const { tracks, settings } = this.configs.audio;
        // Initialize audio with configured settings
        return { tracks, settings };
    }

    setupInteractions() {
        const { scroll, parallax, animations } = this.configs.interactions;
        // Apply interaction settings
        return { scroll, parallax, animations };
    }

    getConfig(section, key = null) {
        if (key) {
            return this.configs[section]?.[key];
        }
        return this.configs[section];
    }

    updateConfig(section, key, value) {
        if (this.configs[section]) {
            this.configs[section][key] = value;
            this.applyConfigs();
            // Could add persistence here if needed
        }
    }
} 