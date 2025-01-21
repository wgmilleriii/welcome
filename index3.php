<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three Layer Parallax</title>
    
    <!-- GSAP for parallax -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.4/ScrollTrigger.min.js"></script>
</head>
<body>
    <!-- Header Layer -->
    <div class="layer header-layer">
        <div class="mountain-background"></div>
        <h1>Mountain Experience.</h1>
    </div>

    <!-- Content Layer -->
    <div class="layer content-layer">
        <div class="panel left-panel">
            <div class="panel-content">
                <h2>L'Histoire du Soldat</h2>
                <p class="panel-text">A rare historical recording of Igor Stravinsky himself conducting his masterpiece L'Histoire du Soldat (The Soldier's Tale).</p>
                <p class="panel-text">This neoclassical theatrical work tells the parable of a soldier who trades his fiddle to the devil for a book that predicts the future economy.</p>
                <div class="experience-details">
                    <ul class="fact-list">
                        <li>Duration: 8.0 seconds</li>
                        <li>Volume: 0.75</li>
                        <li>Fade-in: 1.0s</li>
                        <li>Theme: Dark, intense</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="panel right-panel">
            <div class="panel-content">
                <h2>Mountain Facts</h2>
                <ul class="fact-list">
                    <li>Peak elevation: 14,000 ft</li>
                    <li>Formation: Tectonic uplift</li>
                    <li>Age: 70 million years</li>
                    <li>Climate: Alpine tundra</li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer-layer">
        <div class="footer-wrapper">
            <div class="cta-buttons">
                <button class="cta-btn primary">Start Experience</button>
                <button class="cta-btn secondary">View Gallery</button>
                <button class="cta-btn secondary">About Project</button>
            </div>
            <div class="footer-content">
                <p>© 2024 Mountain Experience</p>
                <nav>
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                </nav>
            </div>
        </div>
    </div>

    <!-- Debug Layer -->
    <div id="debug-console" class="debug-layer">
        <div class="debug-header">
            <span>Debug Console</span>
            <button class="debug-clear">Clear</button>
        </div>
        <div class="debug-content"></div>
    </div>

    <script>
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Mountain background parallax (slowest)
        gsap.to(".mountain-background", {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 0.3
            }
        });

        // Header text parallax (subtle)
        gsap.to(".header-layer h1", {
            yPercent: -30,
            opacity: 0.3,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "30% top",
                scrub: 0.8
            }
        });

        // Left panel moves slower
        gsap.to(".left-panel", {
            yPercent: -40,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 0.7
            }
        });

        // Content layer moves up to top
        gsap.to(".content-layer", {
            yPercent: -100,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "center top",
                scrub: 1
            }
        });

        // Right panel moves faster
        gsap.to(".right-panel", {
            yPercent: -80,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 1.3
            }
        });

        // Adjust footer animation with clearer start/end positions
        gsap.fromTo(".footer-layer", 
            { 
                yPercent: 100,  // Start fully hidden
                immediateRender: true  // Force initial position
            }, 
            {
                yPercent: 0,    // Move to natural position
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "80% bottom",  // Start when 80% through page
                    end: "bottom bottom",
                    scrub: true,
                    onUpdate: (self) => {
                        debug.log(`Footer progress: ${self.progress.toFixed(3)}, yPercent: ${gsap.getProperty(".footer-layer", "y")}`);
                    }
                }
            }
        );

        // Debug logging functionality
        class DebugConsole {
            constructor() {
                this.console = document.querySelector('.debug-content');
                this.setupDraggable();
                this.loadPosition();
                this.setupClear();
            }

            log(message, type = 'info') {
                const time = new Date().toLocaleTimeString();
                const logEntry = document.createElement('div');
                logEntry.className = `debug-entry ${type}`;
                logEntry.innerHTML = `[${time}] ${message}`;
                this.console.appendChild(logEntry);
                this.console.scrollTop = this.console.scrollHeight;
                console.log(`[DEBUG] ${message}`);
            }

            setupDraggable() {
                const debugConsole = document.getElementById('debug-console');
                const header = debugConsole.querySelector('.debug-header');
                let isDragging = false;
                let currentX;
                let currentY;
                let initialX;
                let initialY;
                let xOffset = 0;
                let yOffset = 0;

                header.addEventListener('mousedown', (e) => {
                    isDragging = true;
                    initialX = e.clientX - xOffset;
                    initialY = e.clientY - yOffset;
                });

                document.addEventListener('mousemove', (e) => {
                    if (isDragging) {
                        e.preventDefault();
                        currentX = e.clientX - initialX;
                        currentY = e.clientY - initialY;
                        xOffset = currentX;
                        yOffset = currentY;
                        debugConsole.style.transform = `translate(${currentX}px, ${currentY}px)`;
                    }
                });

                document.addEventListener('mouseup', () => {
                    if (isDragging) {
                        isDragging = false;
                        this.savePosition(xOffset, yOffset);
                    }
                });
            }

            savePosition(x, y) {
                document.cookie = `debug_position=${x},${y};path=/;max-age=31536000`;
            }

            loadPosition() {
                const match = document.cookie.match(/debug_position=([^;]+)/);
                if (match) {
                    const [x, y] = match[1].split(',').map(Number);
                    const debugConsole = document.getElementById('debug-console');
                    debugConsole.style.transform = `translate(${x}px, ${y}px)`;
                }
            }

            setupClear() {
                const clearBtn = document.querySelector('.debug-clear');
                clearBtn.addEventListener('click', () => {
                    this.console.innerHTML = '';
                });
            }
        }

        // Initialize debug console
        const debug = new DebugConsole();

        // Add debug styles
        const debugStyles = `
            .debug-layer {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                height: 300px;
                background: rgba(0, 0, 0, 0.9);
                border: 1px solid #444;
                border-radius: 8px;
                font-family: monospace;
                color: #00ff00;
                z-index: 9999;
                overflow: hidden;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            }

            .debug-header {
                padding: 8px;
                background: #222;
                border-bottom: 1px solid #444;
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .debug-clear {
                background: #333;
                border: 1px solid #555;
                color: #fff;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
            }

            .debug-content {
                height: calc(100% - 37px);
                overflow-y: auto;
                padding: 8px;
                font-size: 12px;
                line-height: 1.4;
            }

            .debug-entry {
                margin-bottom: 4px;
                white-space: pre-wrap;
            }

            .debug-entry.error { color: #ff4444; }
            .debug-entry.warn { color: #ffaa00; }
            .debug-entry.info { color: #00ff00; }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.textContent = debugStyles;
        document.head.appendChild(styleSheet);

        // Log initial footer position with more details
        const footerLayer = document.querySelector('.footer-layer');
        const footerRect = footerLayer.getBoundingClientRect();
        const computedStyle = getComputedStyle(footerLayer);
        debug.log(`Initial footer state:
            Position: { top: ${footerRect.top}, bottom: ${footerRect.bottom} }
            Height: ${footerRect.height}
            Transform: ${computedStyle.transform}
            Z-index: ${computedStyle.zIndex}
        `);

        // Log footer position on scroll
        window.addEventListener('scroll', () => {
            const rect = footerLayer.getBoundingClientRect();
            const scrollY = window.scrollY;
            debug.log(`Scroll position: ${scrollY}, Footer top: ${rect.top}, transform: ${getComputedStyle(footerLayer).transform}`);
        });
    </script>

    <style>
        body {
            margin: 0;
            background: #000;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
            min-height: 200vh;
        }

        .mountain-background {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: url('includes/i/Sandia_Mountains_optimized.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 0.8;
            z-index: -1;
        }

        .header-layer {
            z-index: 1;
            background: none;
        }

        .header-layer::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, rgba(26, 26, 26, 0.7), rgba(42, 42, 42, 0.7));
            z-index: -1;
        }

        .header-layer h1 {
            position: relative;
            z-index: 2;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
        }

        .layer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .content-layer {
            z-index: 2;
            pointer-events: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
            width: 100%;
        }

        .panel {
            width: 20%;
            height: 80vh;
            border-radius: 20px;
            pointer-events: none;
            padding: 2rem;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
        }

        .panel-content {
            color: rgba(255, 255, 255, 0.9);
            pointer-events: auto;
            max-width: 100%;
        }

        .left-panel {
            transform-origin: left center;
            text-align: right;
            margin-right: auto;
        }

        .right-panel {
            transform-origin: right center;
            text-align: left;
            margin-left: auto;
        }

        .panel h2 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
        }

        .panel-text {
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            opacity: 0.9;
        }

        .fact-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .fact-list li {
            font-size: 0.9rem;
            line-height: 1.8;
            opacity: 0.9;
            padding-left: 1.2rem;
            position: relative;
        }

        .fact-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: rgba(255, 255, 255, 0.6);
        }

        .footer-layer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            pointer-events: none;
            z-index: 3;
            transform: translateY(100%);
        }

        .footer-wrapper {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 16px 16px 0 0;
            backdrop-filter: blur(12px);
            pointer-events: auto;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.3);
        }

        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }

        .cta-btn {
            padding: 0.8rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, background-color 0.2s;
        }

        .cta-btn:hover {
            transform: translateY(-2px);
        }

        .cta-btn.primary {
            background: linear-gradient(135deg, #4a90e2, #357abd);
            color: white;
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
        }

        .cta-btn.primary:hover {
            background: linear-gradient(135deg, #357abd, #2868a9);
        }

        .cta-btn.secondary {
            background: rgba(255, 255, 255, 0.1);
            color: white;
            backdrop-filter: blur(4px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .cta-btn.secondary:hover {
            background: rgba(255, 255, 255, 0.15);
        }

        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding-top: 1rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        h1 {
            font-size: 3rem;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
        }

        p {
            font-size: 1.5rem;
            margin: 0;
        }

        nav {
            display: flex;
            gap: 1rem;
        }

        a {
            color: white;
            text-decoration: none;
            opacity: 0.8;
            transition: opacity 0.2s;
        }

        a:hover {
            opacity: 1;
        }
    </style>
</body>
</html> 