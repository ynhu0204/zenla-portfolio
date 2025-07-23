// Configuration Object
const CONFIG = {
    USER: {
        username: 'TIENDEV',
        currentTime: '2025-06-08 07:47:42'
    },
    PARTICLES: {
        count: 50,
        colors: ['#00ff88', '#00ffea', '#00f0ff'],
        minSize: 3,
        maxSize: 8,
        minSpeed: 1,
        maxSpeed: 3,
    },
    TYPING: {
        texts: [
            'Full Stack Developer',
            'UI/UX Designer',
            'Creative Coder',
            'Digital Artist',
            'Mỗi tội thiếu người yêu nữa'
        ],
        typeSpeed: 100,
        eraseSpeed: 50,
        delayBetweenTexts: 2000
    },
    SKILLS: {
        creativity: 95,
        development: 88,
        design: 92
    }
};

// Loading Screen Manager
class LoadingScreen {
    constructor() {
        this.loadingScreen = document.querySelector('.loading-screen');
        this.isLoading = true;
        this.init();
    }

    init() {
        // Hide loading screen after minimum duration
        setTimeout(() => this.hideLoading(), 5000);

        // Fallback if resources take too long
        setTimeout(() => {
            if (this.isLoading) this.hideLoading();
        }, 5000);
    }

    hideLoading() {
        if (!this.isLoading) return;
        this.isLoading = false;
        this.loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            document.body.style.overflow = 'visible';
            // Initialize other components after loading
            this.initializeComponents();
        }, 5000);
    }

    initializeComponents() {
        new ParticleSystem();
        new MouseTrail();
        new CustomCursor();
        new TypingEffect();
        new StatsAnimation();
        new ProjectCards();
        new FormAnimations();
    }
}

// Particle System
class ParticleSystem {
    constructor() {
        this.container = document.querySelector('.particle-container');
        this.particles = [];
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => {
            this.particles = [];
            this.createParticles();
        });
    }

    createParticles() {
        for (let i = 0; i < CONFIG.PARTICLES.count; i++) {
            const particle = {
                element: document.createElement('div'),
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * (CONFIG.PARTICLES.maxSize - CONFIG.PARTICLES.minSize) + CONFIG.PARTICLES.minSize,
                speedY: Math.random() * (CONFIG.PARTICLES.maxSpeed - CONFIG.PARTICLES.minSpeed) + CONFIG.PARTICLES.minSpeed,
                speedX: Math.random() * 1 - 0.5,
                rotation: Math.random() * 360,
                color: CONFIG.PARTICLES.colors[Math.floor(Math.random() * CONFIG.PARTICLES.colors.length)]
            };

            particle.element.className = 'particle';
            particle.element.style.width = `${particle.size}px`;
            particle.element.style.height = `${particle.size}px`;
            particle.element.style.background = particle.color;
            this.container.appendChild(particle.element);
            this.particles.push(particle);
        }
    }

    animate() {
        this.particles.forEach(particle => {
            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.rotation += 1;

            if (particle.y > window.innerHeight) {
                particle.y = -particle.size;
                particle.x = Math.random() * window.innerWidth;
            }

            particle.element.style.transform = 
                `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Mouse Trail Effect
class MouseTrail {
    constructor() {
        this.canvas = document.getElementById('mouseTrail');
        this.ctx = this.canvas.getContext('2d');
        this.points = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.resizeCanvas();
        this.addEventListeners();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => {
            this.mouse = {
                x: e.clientX,
                y: e.clientY
            };
            this.points.push({ ...this.mouse, age: 0 });
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            point.age++;

            if (point.age > 20) {
                this.points.splice(i, 1);
                i--;
                continue;
            }

            const opacity = 1 - point.age / 20;
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`;
            this.ctx.fill();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.cursorOuter = document.querySelector('.custom-cursor-outer');
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
            this.cursorOuter.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        });

        document.addEventListener('mousedown', () => {
            this.cursor.style.transform = 'scale(0.8)';
            this.cursorOuter.style.transform = 'scale(1.2)';
        });

        document.addEventListener('mouseup', () => {
            this.cursor.style.transform = 'scale(1)';
            this.cursorOuter.style.transform = 'scale(1)';
        });
    }
}

// Typing Effect
class TypingEffect {
    constructor() {
        this.textElement = document.querySelector('.typed-text');
        this.texts = CONFIG.TYPING.texts;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        const speed = this.isDeleting ? CONFIG.TYPING.eraseSpeed : CONFIG.TYPING.typeSpeed;

        if (this.isDeleting) {
            this.charIndex--;
        } else {
            this.charIndex++;
        }

        this.textElement.textContent = currentText.substring(0, this.charIndex);

        if (!this.isDeleting && this.charIndex === currentText.length) {
            setTimeout(() => {
                this.isDeleting = true;
                this.type();
            }, CONFIG.TYPING.delayBetweenTexts);
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), CONFIG.TYPING.typeSpeed);
        } else {
            setTimeout(() => this.type(), speed);
        }
    }
}

// Stats Animation
class StatsAnimation {
    constructor() {
        this.stats = document.querySelectorAll('.stat-number');
        this.circles = document.querySelectorAll('.progress-ring-circle');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateStats();
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.stats.forEach(stat => observer.observe(stat));
    }

    animateStats() {
        this.stats.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            let current = 0;
            const increment = target / 100;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.round(current);
                    this.circles[index].style.strokeDashoffset = 
                        339.292 * (1 - current / 100);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

// Project Cards
class ProjectCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = 
            `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 
            'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// Form Animations
class FormAnimations {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const button = this.form.querySelector('.submit-btn');
                button.classList.add('loading');
                
                setTimeout(() => {
                    button.classList.remove('loading');
                    button.classList.add('success');
                    setTimeout(() => {
                        button.classList.remove('success');
                        this.form.reset();
                    }, 2000);
                }, 2000);
            });
        }
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    new LoadingScreen();
});