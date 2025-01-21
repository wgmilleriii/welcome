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
        <h1>Mountain Experience</h1>
    </div>

    <!-- Content Layer -->
    <div class="layer content-layer">
        <div class="panel left-panel">
            <div class="panel-content">
                <h2>Mountain History</h2>
                <p class="panel-text">The ancient peaks have stood sentinel for millions of years, witnessing the passage of time. Each crag and crevice tells a story of geological wonder.</p>
                <p class="panel-text">Through wind and weather, these mountains have shaped the landscape and influenced countless civilizations.</p>
            </div>
        </div>
        <div class="content-wrapper">
            <p>Scroll to explore</p>
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

    <!-- Footer Layer -->
    <div class="layer footer-layer">
        <div class="footer-wrapper">
            <p>© 2024 Mountain Experience</p>
            <nav>
                <a href="#">About</a>
                <a href="#">Contact</a>
            </nav>
        </div>
    </div>

    <script>
        // Initialize GSAP
        gsap.registerPlugin(ScrollTrigger);

        // Initialize parallax
        gsap.to(".header-layer", {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 0.5
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

        // Content moves up to top
        gsap.to(".content-wrapper", {
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

        // Footer parallax
        gsap.fromTo(".footer-layer", 
            { yPercent: 100 }, // Start position
            {
                yPercent: -20, // End position
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "20% top",
                    end: "bottom top",
                    scrub: true,
                    markers: true // For debugging, remove in production
                }
            }
        );
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

        .header-layer {
            z-index: 1;
            background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
        }

        .content-layer {
            z-index: 2;
            pointer-events: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 2rem;
        }

        .footer-layer {
            z-index: 3;
            pointer-events: none;
            position: fixed;
            bottom: 0;
            height: auto;
            align-items: flex-end;
            padding-bottom: 2rem;
        }

        .panel {
            width: 25%;
            height: 80vh;
            border-radius: 20px;
            pointer-events: none;
            padding: 2rem;
            overflow: hidden;
        }

        .panel-content {
            color: rgba(255, 255, 255, 0.9);
            pointer-events: auto;
            max-width: 300px;
        }

        .left-panel {
            background: linear-gradient(135deg, #2a1f3a, #1a1f2a);
            transform-origin: left center;
            text-align: right;
        }

        .right-panel {
            background: linear-gradient(225deg, #3a1f2a, #2a1f1a);
            transform-origin: right center;
            text-align: left;
        }

        .content-wrapper {
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(4px);
            pointer-events: auto;
            flex: 0 1 auto;
        }

        .footer-wrapper {
            display: flex;
            gap: 2rem;
            align-items: center;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(4px);
            pointer-events: auto;
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

        .panel h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
        }

        .panel-text {
            font-size: 1rem;
            line-height: 1.6;
            margin-bottom: 1rem;
            opacity: 0.8;
        }

        .fact-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .fact-list li {
            font-size: 1rem;
            line-height: 1.8;
            opacity: 0.8;
            padding-left: 1.5rem;
            position: relative;
        }

        .fact-list li:before {
            content: "•";
            position: absolute;
            left: 0;
            color: rgba(255, 255, 255, 0.6);
        }
    </style>
</body>
</html> 