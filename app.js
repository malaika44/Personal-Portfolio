// Particle Background
class ParticleBackground {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 100;
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.createParticles();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(108, 99, 255, 0.5)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = {
            outer: document.querySelector('.cursor-outer'),
            inner: document.querySelector('.cursor-inner')
        };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.moveCursor(e));
        document.addEventListener('mousedown', () => this.cursorDown());
        document.addEventListener('mouseup', () => this.cursorUp());
    }

    moveCursor(e) {
        const { clientX: x, clientY: y } = e;
        this.cursor.outer.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
        this.cursor.inner.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
    }

    cursorDown() {
        this.cursor.outer.style.transform = 'scale(0.8) translate(-18px, -18px)';
    }

    cursorUp() {
        this.cursor.outer.style.transform = 'scale(1) translate(-15px, -15px)';
    }
}

// Counter animation
const animateCounter = (element, target, isDecimal = false) => {
    const duration = 2000;
    const frameDuration = 1000/60;
    const totalFrames = Math.round(duration/frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame/totalFrames;
        const currentValue = isDecimal ? (target * progress).toFixed(1) : Math.floor(target * progress);
        
        if (frame === totalFrames) {
            element.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(counter);
        } else {
            element.textContent = currentValue + (target === 100 ? '%' : '+');
        }
    }, frameDuration);
};


// Intersection Observer for counter animation
const observeCounters = () => {
    const counters = document.querySelectorAll('.highlight-number');
    const options = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                entry.target.classList.add('animate');
                const target = parseFloat(entry.target.getAttribute('data-value'));
                const isDecimal = target % 1 !== 0;
                animateCounter(entry.target, target, isDecimal);
            }
        });
    }, options);

    counters.forEach(counter => observer.observe(counter));
};



// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize counter animations
    observeCounters();

    const form = document.getElementById('contactForm');
    const messageInput = document.getElementById('message');
    const charCounter = document.querySelector('.char-counter');
    const popup = document.getElementById('popup');
    const emailInput = document.getElementById('email');
    const maxLength = 300;

    // Character counter
    messageInput.addEventListener('input', () => {
        const remaining = maxLength - messageInput.value.length;
        charCounter.textContent = remaining;
        charCounter.style.color = remaining < 50 ? '#ef4444' : 'inherit';
    });

    // Email validation
    emailInput.addEventListener('input', () => {
        const isValid = emailInput.checkValidity();
        emailInput.style.borderColor = emailInput.value && !isValid ? '#ef4444' : '#e2e8f0';
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show success popup
        popup.classList.add('show');
        
        // Clear form
        form.reset();
        charCounter.textContent = maxLength;
        
        // Auto-hide popup after 3 seconds
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    });

    // Close popup button
    document.querySelector('.close-btn').addEventListener('click', () => {
        popup.classList.remove('show');
    });
});

// Text Morph Animation
class TextMorph {
    constructor() {
        this.text = document.querySelector('.morph-text');
        this.phrases = ['I am Malaika', 'I am a Developer'];
        this.currentPhrase = 0;
        this.init();
    }

    init() {
        setInterval(() => this.morphText(), 3000);
    }

    async morphText() {
        const current = this.phrases[this.currentPhrase];
        const next = this.phrases[(this.currentPhrase + 1) % this.phrases.length];
        
        await this.fadeOut(current);
        this.text.textContent = next;
        await this.fadeIn();
        
        this.currentPhrase = (this.currentPhrase + 1) % this.phrases.length;
    }

    fadeOut(text) {
        return new Promise(resolve => {
            let opacity = 1;
            const fade = setInterval(() => {
                opacity -= 0.1;
                this.text.style.opacity = opacity;
                if (opacity <= 0) {
                    clearInterval(fade);
                    resolve();
                }
            }, 50);
        });
    }

    fadeIn() {
        return new Promise(resolve => {
            let opacity = 0;
            const fade = setInterval(() => {
                opacity += 0.1;
                this.text.style.opacity = opacity;
                if (opacity >= 1) {
                    clearInterval(fade);
                    resolve();
                }
            }, 50);
        });
    }
}

// Magnetic Buttons
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic-button');
        this.init();
    }

    init() {
        this.buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => this.magnetize(e, button));
            button.addEventListener('mouseleave', (e) => this.reset(e, button));
        });
    }

    magnetize(e, button) {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }

    reset(e, button) {
        button.style.transform = 'translate(0px, 0px)';
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains('skill-bar')) {
                            this.animateSkillBar(entry.target);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        document.querySelectorAll('.skill-bar').forEach(bar => {
            observer.observe(bar);
        });
    }

    animateSkillBar(bar) {
        const progressLine = bar.querySelector('.progress-line');
        const percent = progressLine.getAttribute('data-percent');
        progressLine.style.setProperty('--percent', `${percent}%`);
    }
}

// Theme Toggle
class MenuToggle {
    constructor() {
        this.hamburger = document.querySelector('.hamburger-menu');
        this.navLinks = document.querySelector('.nav-links');
        this.navLinksItems = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // Close menu when clicking on a nav link
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    }
}

class ThemeToggle {
    constructor() {
        this.toggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);

        this.toggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Project Filters
class ProjectFilters {
    constructor() {
        this.filters = document.querySelectorAll('.filter-btn');
        this.projects = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const category = filter.getAttribute('data-filter');
                
                this.filters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                this.filterProjects(category);
            });
        });
    }

    filterProjects(category) {
        this.projects.forEach(project => {
            const projectCategory = project.getAttribute('data-category');
            if (category === 'all' || category === projectCategory) {
                project.style.display = 'block';
            } else {
                project.style.display = 'none';
            }
        });
    }
}

// Matrix Easter Egg
class MatrixEasterEgg {
    constructor() {
        this.buffer = '';
        this.keyword = 'openai';
        this.init();
    }

    init() {
        document.addEventListener('keypress', (e) => {
            this.buffer += e.key.toLowerCase();
            if (this.buffer.length > this.keyword.length) {
                this.buffer = this.buffer.slice(1);
            }
            
            if (this.buffer === this.keyword) {
                this.triggerMatrixEffect();
                this.buffer = '';
            }
        });
    }

    triggerMatrixEffect() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9999;
            font-family: monospace;
            color: #0f0;
            overflow: hidden;
        `;

        document.body.appendChild(overlay);

        const columns = Math.floor(window.innerWidth / 20);
        const drops = new Array(columns).fill(0);

        const draw = () => {
            let output = '';
            drops.forEach((drop, i) => {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 20;
                const y = drop * 20;
                output += `<div style="position:absolute;left:${x}px;top:${y}px">${char}</div>`;
                drops[i] = drop >= 20 + Math.random() * 100 ? 0 : drop + 1;
            });
            overlay.innerHTML = output;
        };

        const animation = setInterval(draw, 50);

        setTimeout(() => {
            clearInterval(animation);
            overlay.remove();
        }, 5000);
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
    new CustomCursor();
    new TextMorph();
    new MagneticButtons();
    new ScrollAnimations();
    new MenuToggle();
    new ThemeToggle();
    new ProjectFilters();
    new MatrixEasterEgg();
});
