/* ==========================================================================
   Divesh Dhiraj Jotwani - Portfolio Exhibition Engine
   High-Performance 3D Interaction, Dynamic Lighting, & Easter Eggs
   ========================================================================= */

// 1. PROJECT LINKS CONFIGURATION
const PORTFOLIO_CONFIG = {
    dukaanIQ: {
        demo: "https://diveshjotwani2-debug.github.io/Dukaan-IQ-final-/", 
        github: "https://github.com/diveshjotwani2-debug/Dukaan-IQ-final-" 
    },
    neev: {
        demo: "https://diveshjotwani2-debug.github.io/NEEV/", 
        github: "https://github.com/diveshjotwani2-debug/NEEV" 
    },
    growIQ: {
        demo: "https://diveshjotwani2-debug.github.io/GrowIQ-/" 
    }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // DOM Elements Cache
    const cursorEl = document.getElementById("custom-cursor");
    const cursorGlow = document.getElementById("custom-cursor-glow");
    const swordFillRect = document.getElementById("sword-fill-rect");
    const navDots = document.querySelectorAll(".nav-dot");
    const sections = document.querySelectorAll(".portfolio-section");
    const slashOverlay = document.getElementById("slash-overlay");
    const birdContainer = document.getElementById("easter-bird-container");
    const tags = document.querySelectorAll(".tag");

    // --------------------------------------------------------------------------
    // A. Link Synchronizer (Syncs config object to HTML elements)
    // --------------------------------------------------------------------------
    const syncLinks = () => {
        const dDemo = document.getElementById("link-dukaaniq-demo");
        const dGithub = document.getElementById("link-dukaaniq-github");
        if (dDemo) dDemo.href = PORTFOLIO_CONFIG.dukaanIQ.demo;
        if (dGithub) dGithub.href = PORTFOLIO_CONFIG.dukaanIQ.github;

        const nDemo = document.getElementById("link-neev-demo");
        const nGithub = document.getElementById("link-neev-github");
        if (nDemo) nDemo.href = PORTFOLIO_CONFIG.neev.demo;
        if (nGithub) nGithub.href = PORTFOLIO_CONFIG.neev.github;

        const gDemo = document.getElementById("link-growiq-demo");
        if (gDemo) gDemo.href = PORTFOLIO_CONFIG.growIQ.demo;
    };

    // --------------------------------------------------------------------------
    // B. Custom Cursor Physics & Hover States
    // --------------------------------------------------------------------------
    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    const ringEase = 0.12; // Smooth organic trailing outer ring LERP
    let cursorActive = false;

    const initCursor = () => {
        window.addEventListener("mousemove", (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!cursorActive) {
                cursorActive = true;
                // Snap coordinates initially to prevent fly-in from (0,0)
                dotX = ringX = mouseX;
                dotY = ringY = mouseY;
                document.body.classList.add("custom-cursor-active");
            }
        });

        window.addEventListener("mouseleave", () => {
            cursorActive = false;
            document.body.classList.remove("custom-cursor-active");
        });

        // Trigger cursor scaling on hover
        const hoverables = document.querySelectorAll("a, button, .nav-dot, .interactive-tilt-card");
        hoverables.forEach(el => {
            el.addEventListener("mouseenter", () => {
                if (cursorEl) cursorEl.classList.add("hovering");
                if (cursorGlow) cursorGlow.classList.add("hovering");
            });
            el.addEventListener("mouseleave", () => {
                if (cursorEl) cursorEl.classList.remove("hovering");
                if (cursorGlow) cursorGlow.classList.remove("hovering");
            });
        });
    };

    // --------------------------------------------------------------------------
    // D. Apple Vision Pro Refractive Lighting & 3D Card Tilt Engine
    // Calculates card-relative mouse offsets to tilt panels and shift reflections.
    // --------------------------------------------------------------------------
    const initTiltAndLighting = () => {
        const cards = document.querySelectorAll(".interactive-tilt-card");
        
        cards.forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const xVal = e.clientX - rect.left; // Mouse position inside card
                const yVal = e.clientY - rect.top;
                
                // Normalized coordinate offsets (-0.5 to 0.5)
                const xPct = (xVal / rect.width) - 0.5;
                const yPct = (yVal / rect.height) - 0.5;
                
                // Tilt math (subtle 3D rotations)
                const tiltX = -(yPct * 12).toFixed(2); // Tilt up/down
                const tiltY = (xPct * 12).toFixed(2);  // Tilt left/right
                
                // Update CSS relative position variables for glass spotlight gradient
                card.style.setProperty("--mouse-x", `${xVal}px`);
                card.style.setProperty("--mouse-y", `${yVal}px`);
                
                // Apply 3D matrix transform
                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            // Clear inline style on mouseleave to allow CSS breathing animations to resume seamlessly
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    };

    // --------------------------------------------------------------------------
    // E. Minimal Dot Navigation, Scroll Sync, & Parallax Engine
    // Fills the sword, highlights nav dots, and calculates section-relative parallax.
    // --------------------------------------------------------------------------
    const initScrollSyncAndParallax = () => {
        // Smooth scroll for nav dots
        navDots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute("href");
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: "smooth" });
                }
            });
        });

        // 3D Scroll Parallax: Calculate distance of each section from the viewport center
        const handleParallax = () => {
            const vh = window.innerHeight;
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const secCenter = rect.top + rect.height / 2;
                const vhCenter = vh / 2;
                // Distance from viewport center
                const dist = secCenter - vhCenter;
                
                // Set CSS custom property on the section
                sec.style.setProperty("--scroll-dist", dist.toFixed(1));
            });
        };

        window.addEventListener("scroll", handleParallax);
        handleParallax(); // Initial run

        // Sync active section to nav dots using Intersection Observer
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -40% 0px", // Trigger when section occupies core viewport
            threshold: 0.15
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute("id");
                    
                    // Highlight matching dot
                    navDots.forEach(dot => {
                        if (dot.getAttribute("href") === `#${id}`) {
                            dot.classList.add("active");
                        } else {
                            dot.classList.remove("active");
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => sectionObserver.observe(section));
    };

    // --------------------------------------------------------------------------
    // F. Magnetic Skill Pills Interaction (Mouse Push Physics)
    // Pushes skill tags away rubber-style when cursor gets close.
    // --------------------------------------------------------------------------
    const updateMagneticTags = () => {
        tags.forEach(tag => {
            const rect = tag.getBoundingClientRect();
            const tagX = rect.left + rect.width / 2;
            const tagY = rect.top + rect.height / 2;
            const distX = mouseX - tagX;
            const distY = mouseY - tagY;
            const distance = Math.hypot(distX, distY);
            
            const activeRadius = 90; // Proximity threshold in pixels
            
            if (distance < activeRadius) {
                const force = (activeRadius - distance) / activeRadius; // 0 to 1
                // Translate away from cursor (up to 12px)
                const pushX = -(distX / distance) * force * 12;
                const pushY = -(distY / distance) * force * 12;
                
                tag.style.transform = `translate3d(${pushX.toFixed(1)}px, ${pushY.toFixed(1)}px, 0) scale(1.05)`;
                tag.style.borderColor = "var(--color-brass)";
                tag.style.backgroundColor = "rgba(212, 175, 55, 0.08)";
            } else {
                // Clear inline style so CSS keyframe breathing takes over
                tag.style.transform = "";
                tag.style.borderColor = "";
                tag.style.backgroundColor = "";
            }
        });
    };

    // --------------------------------------------------------------------------
    // G. Dynamic Atmosphere: Rising Embers, Dust Motes & Copper Rings (Canvas)
    // Renders highly optimized multi-layer atmospheric elements.
    // --------------------------------------------------------------------------
    const initAtmosphereParticles = () => {
        const container = document.getElementById("particles-atmosphere");
        if (!container) return;

        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        const ctx = canvas.getContext("2d");

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const maxParticles = 40;

        class AtmosphereElement {
            constructor() {
                this.reset();
                this.y = Math.random() * height; // Distribute on startup
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 30;
                
                // 3 Classes: 0 = Amber Ember (60%), 1 = Dust Mote (25%), 2 = Faint Copper Outline Ring (15%)
                const rand = Math.random();
                this.type = rand < 0.6 ? 0 : (rand < 0.85 ? 1 : 2);
                
                if (this.type === 0) {
                    // Ember
                    this.size = Math.random() * 2.2 + 0.6;
                    this.speedY = Math.random() * 0.7 + 0.3;
                    this.speedX = Math.random() * 0.4 - 0.2;
                    this.alpha = Math.random() * 0.45 + 0.1;
                    this.fadeRate = Math.random() * 0.0015 + 0.0008;
                } else if (this.type === 1) {
                    // Dust Mote (drifts diagonally)
                    this.size = Math.random() * 1.2 + 0.4;
                    this.speedY = Math.random() * 0.3 + 0.1;
                    this.speedX = Math.random() * 0.3 + 0.1;
                    this.alpha = Math.random() * 0.25 + 0.05;
                    this.fadeRate = Math.random() * 0.001 + 0.0005;
                } else {
                    // Copper Outline Ring
                    this.size = Math.random() * 35 + 20;
                    this.speedY = Math.random() * 0.18 + 0.05;
                    this.speedX = Math.random() * 0.2 - 0.1;
                    this.alpha = Math.random() * 0.07 + 0.02;
                    this.fadeRate = Math.random() * 0.0008 + 0.0003;
                    this.rotation = Math.random() * Math.PI * 2;
                    this.rotSpeed = Math.random() * 0.004 - 0.002;
                }
            }

            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                this.alpha -= this.fadeRate;
                if (this.type === 2) {
                    this.rotation += this.rotSpeed;
                }

                // Reset if offscreen or faded
                if (this.y < -50 || this.x < -50 || this.x > width + 50 || this.alpha <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                
                if (this.type === 0) {
                    // Glowing Ember
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = "#FF8C00";
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#FF8C00";
                    ctx.fill();
                } else if (this.type === 1) {
                    // Delicate Dust Mote
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = "#ECECEC";
                    ctx.fill();
                } else {
                    // Rotational Copper Ring (Ancient Geometry outline)
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.beginPath();
                    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
                    ctx.strokeStyle = "#B87333";
                    ctx.lineWidth = 0.75;
                    ctx.stroke();
                    
                    // Internal crosshairs
                    ctx.beginPath();
                    ctx.moveTo(-this.size, 0);
                    ctx.lineTo(this.size, 0);
                    ctx.moveTo(0, -this.size);
                    ctx.lineTo(0, this.size);
                    ctx.strokeStyle = "rgba(184, 115, 51, 0.15)";
                    ctx.stroke();
                }
                
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new AtmosphereElement());
        }

        // Animation loop
        const animateParticles = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        };

        // Resize handler
        window.addEventListener("resize", () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        animateParticles();
    };

    // --------------------------------------------------------------------------
    // H. Premium Easter Eggs
    // --------------------------------------------------------------------------
    
    // 1. Click Sword Slash: Diagonal blade swipe flash on click
    const initSlashEasterEgg = () => {
        window.addEventListener("click", () => {
            if (!slashOverlay) return;
            
            slashOverlay.classList.remove("active");
            void slashOverlay.offsetWidth; // Force CSS reflow
            slashOverlay.classList.add("active");
            
            // Turn off after animation completes
            setTimeout(() => {
                slashOverlay.classList.remove("active");
            }, 450);
        });
    };

    // 2. Scroll to Bottom Glowing Bird: Phoenix flight across the waterfall mist
    const initBirdEasterEgg = () => {
        let birdTriggered = false;
        
        window.addEventListener("scroll", () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (scrollHeight > 0 && window.scrollY >= scrollHeight - 5) {
                if (!birdTriggered && birdContainer) {
                    birdTriggered = true;
                    birdContainer.classList.add("fly");
                    
                    // Reset after fly animation completes
                    setTimeout(() => {
                        birdContainer.classList.remove("fly");
                        birdTriggered = false; // Allow re-triggering next time they scroll down
                    }, 5200);
                }
            }
        });
    };

    // --------------------------------------------------------------------------
    // I. Core Frame Loop (60fps Rendering)
    // Coordinates cursor positioning, sword scroll, and magnetic tags physics.
    // --------------------------------------------------------------------------
    const frameLoop = () => {
        // 1. Sword Scroll progress fill calculator
        // Coordinates: Blade tip at y=15, blade hilt at y=155. Length = 140 units.
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight > 0 && swordFillRect) {
            const scrollPercent = window.scrollY / scrollHeight;
            const fillHeight = scrollPercent * 140;
            const fillY = 155 - fillHeight;
            
            swordFillRect.setAttribute("y", fillY);
            swordFillRect.setAttribute("height", fillHeight);
        }

        // 2. Position Cursor (zero-latency macOS pointer & smooth trailing ring)
        if (cursorActive && cursorEl && cursorGlow) {
            dotX = mouseX;
            dotY = mouseY;
            
            ringX += (mouseX - ringX) * ringEase;
            ringY += (mouseY - ringY) * ringEase;
            
            cursorEl.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
            cursorGlow.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
        }

        // 3. Update Magnetic Tag positions at 60fps
        updateMagneticTags();

        requestAnimationFrame(frameLoop);
    };

    // --------------------------------------------------------------------------
    // Initialization Sequence
    // --------------------------------------------------------------------------
    syncLinks();
    initCursor();
    initTiltAndLighting();
    initScrollSyncAndParallax();
    initAtmosphereParticles();
    initSlashEasterEgg();
    initBirdEasterEgg();
    
    // Launch Frame Loop
    requestAnimationFrame(frameLoop);
});
