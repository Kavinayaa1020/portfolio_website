// ============================================
// Theme Management
// ============================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme or detect system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark');
    } else {
        html.setAttribute('data-theme', 'light');
    }
    
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const currentTheme = html.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
}

themeToggle.addEventListener('click', toggleTheme);
initTheme();

// ============================================
// Navigation
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');
const sections = document.querySelectorAll('.section, #hero');

// Smooth scroll to section
function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (target) {
        const navHeight = document.querySelector('.main-nav').offsetHeight;
        const targetPosition = target.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Handle navigation clicks
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        smoothScrollTo(targetId);
        
        // Close mobile menu if open
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
    });
});

// Mobile menu toggle
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Active section detection
function updateActiveSection() {
    const scrollPosition = window.scrollY + 150;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveSection);
updateActiveSection();

// ============================================
// Particle System
// ============================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 50;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2
    };
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle());
    }
}

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isDark = html.getAttribute('data-theme') === 'dark';
    const color = isDark ? 'rgba(0, 255, 255, 0.6)' : 'rgba(99, 102, 241, 0.4)';
    
    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = color.replace('0.6', particle.opacity.toString());
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
    });
    
    // Draw connections
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = color.replace('0.6', (0.3 * (1 - distance / 150)).toString());
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(drawParticles);
}

// Mouse interaction for particles
let mouseX = 0;
let mouseY = 0;

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    particles.forEach(particle => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
            const force = (100 - distance) / 100;
            particle.x -= dx * force * 0.01;
            particle.y -= dy * force * 0.01;
        }
    });
});

resizeCanvas();
initParticles();
drawParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// ============================================
// Bubble Animation
// ============================================
const bubbleContainer = document.getElementById('bubbleContainer');
const bubbleCount = 15;

function createBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    
    const size = Math.random() * 60 + 20; // 20-80px
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    
    const startX = Math.random() * 100;
    bubble.style.left = `${startX}%`;
    
    const duration = Math.random() * 10 + 15; // 15-25s
    bubble.style.animationDuration = `${duration}s`;
    
    const delay = Math.random() * 5;
    bubble.style.animationDelay = `${delay}s`;
    
    bubbleContainer.appendChild(bubble);
    
    // Remove bubble after animation
    setTimeout(() => {
        if (bubble.parentNode) {
            bubble.parentNode.removeChild(bubble);
        }
    }, (duration + delay) * 1000);
}

function initBubbles() {
    // Clear existing bubbles
    bubbleContainer.innerHTML = '';
    
    // Create initial bubbles
    for (let i = 0; i < bubbleCount; i++) {
        setTimeout(() => createBubble(), i * 500);
    }
    
    // Continuously create new bubbles
    setInterval(() => {
        if (bubbleContainer.children.length < bubbleCount) {
            createBubble();
        }
    }, 2000);
}

initBubbles();

// ============================================
// Scroll Animations
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ============================================
// Smooth Scroll for Hero Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.startsWith('#')) {
            e.preventDefault();
            smoothScrollTo(href);
        }
    });
});

// ============================================
// Close mobile menu on outside click
// ============================================
document.addEventListener('click', (e) => {
    if (navMenu && !navMenu.contains(e.target) && mobileMenuToggle && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// ============================================
// Performance Optimization
// ============================================
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveSection();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// Typing Animation
// ============================================
const typingText = document.getElementById('typingText');
const typingPhrases = [
    'Aspiring Software Engineer',
    'Tech Visionary',
    'ML Enthusiast'
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    if (!typingText) return;
    
    const currentPhrase = typingPhrases[currentPhraseIndex];
    
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        typingSpeed = 100;
    }
    
    if (!isDeleting && currentCharIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % typingPhrases.length;
        typingSpeed = 500; // Pause before next phrase
    }
    
    setTimeout(typeText, typingSpeed);
}

// Start typing animation after a delay
setTimeout(() => {
    if (typingText) typeText();
}, 1000);

// ============================================
// Scroll Track
// ============================================
const scrollTrack = document.getElementById('scrollTrack');
const scrollProgress = document.getElementById('scrollProgress');
const scrollDots = document.querySelectorAll('.scroll-dot');

function updateScrollTrack() {
    if (!scrollProgress) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    // Update progress bar
    scrollProgress.style.height = `${scrollPercentage}%`;
    
    // Update active dots
    const sections = document.querySelectorAll('section[id], #hero');
    const scrollPosition = scrollTop + windowHeight / 2;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            scrollDots.forEach(dot => {
                dot.classList.remove('active');
                if (dot.getAttribute('data-section') === sectionId) {
                    dot.classList.add('active');
                }
            });
        }
    });
}

// Click on dots to scroll to section
scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const sectionId = dot.getAttribute('data-section');
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = document.querySelector('.main-nav').offsetHeight;
            const targetPosition = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

window.addEventListener('scroll', updateScrollTrack);
updateScrollTrack();

// ============================================
// Swipe Effects
// ============================================
const swipeableCards = document.querySelectorAll('.project-card, .achievement-card, .cert-card');

swipeableCards.forEach(card => {
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    
    // Mouse events
    card.addEventListener('mousedown', (e) => {
        touchStartX = e.clientX;
        isSwiping = true;
    });
    
    card.addEventListener('mousemove', (e) => {
        if (isSwiping) {
            const diff = e.clientX - touchStartX;
            if (Math.abs(diff) > 10) {
                card.style.transform = `translateX(${diff * 0.1}px) rotateY(${diff * 0.05}deg)`;
            }
        }
    });
    
    card.addEventListener('mouseup', (e) => {
        if (isSwiping) {
            touchEndX = e.clientX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    card.classList.add('swipe-right');
                } else {
                    card.classList.add('swipe-left');
                }
                
                setTimeout(() => {
                    card.classList.remove('swipe-left', 'swipe-right');
                }, 500);
            }
            
            card.style.transform = '';
            isSwiping = false;
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (isSwiping) {
            card.style.transform = '';
            isSwiping = false;
        }
    });
    
    // Touch events
    card.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        isSwiping = true;
    });
    
    card.addEventListener('touchmove', (e) => {
        if (isSwiping) {
            const diff = e.touches[0].clientX - touchStartX;
            if (Math.abs(diff) > 10) {
                card.style.transform = `translateX(${diff * 0.1}px) rotateY(${diff * 0.05}deg)`;
            }
        }
    });
    
    card.addEventListener('touchend', (e) => {
        if (isSwiping) {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchEndX - touchStartX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    card.classList.add('swipe-right');
                } else {
                    card.classList.add('swipe-left');
                }
                
                setTimeout(() => {
                    card.classList.remove('swipe-left', 'swipe-right');
                }, 500);
            }
            
            card.style.transform = '';
            isSwiping = false;
        }
    });
});

// ============================================
// Microbe Cursor Effect
// ============================================
const cursorMicrobes = document.getElementById('cursorMicrobes');
let cursorMouseX = 0;
let cursorMouseY = 0;
let cursorX = 0;
let cursorY = 0;

function updateCursor(e) {
    cursorMouseX = e.clientX;
    cursorMouseY = e.clientY;
}

function animateCursor() {
    if (!cursorMicrobes) return;
    
    // Smooth cursor following
    const dx = cursorMouseX - cursorX;
    const dy = cursorMouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    cursorMicrobes.style.left = cursorX + 'px';
    cursorMicrobes.style.top = cursorY + 'px';
    
    // Create microbe particles
    if (Math.random() > 0.7) {
        createMicrobe(cursorX, cursorY, cursorMouseX, cursorMouseY);
    }
    
    requestAnimationFrame(animateCursor);
}

function createMicrobe(x, y, targetX, targetY) {
    if (!cursorMicrobes) return;
    
    const microbe = document.createElement('div');
    microbe.className = 'cursor-microbe';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 30 + 10;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    
    microbe.style.left = '0px';
    microbe.style.top = '0px';
    microbe.style.setProperty('--tx', tx + 'px');
    microbe.style.setProperty('--ty', ty + 'px');
    
    cursorMicrobes.appendChild(microbe);
    
    setTimeout(() => {
        if (microbe.parentNode) {
            microbe.parentNode.removeChild(microbe);
        }
    }, 2000);
}

// Track mouse movement
document.addEventListener('mousemove', updateCursor);
document.addEventListener('mouseenter', () => {
    if (cursorMicrobes) cursorMicrobes.style.opacity = '1';
});
document.addEventListener('mouseleave', () => {
    if (cursorMicrobes) cursorMicrobes.style.opacity = '0';
});

// Expand cursor on click
document.addEventListener('mousedown', () => {
    if (cursorMicrobes) {
        cursorMicrobes.style.width = '30px';
        cursorMicrobes.style.height = '30px';
        // Create burst of microbes
        for (let i = 0; i < 8; i++) {
            createMicrobe(cursorX, cursorY, cursorMouseX, cursorMouseY);
        }
    }
});

document.addEventListener('mouseup', () => {
    if (cursorMicrobes) {
        cursorMicrobes.style.width = '20px';
        cursorMicrobes.style.height = '20px';
    }
});

// Start cursor animation
animateCursor();

// ============================================
// Initialize on Load
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Set initial active section
    updateActiveSection();
    
    // Add loaded class for any additional animations
    document.body.classList.add('loaded');
    
    // Initialize cursor position
    cursorX = window.innerWidth / 2;
    cursorY = window.innerHeight / 2;
    cursorMouseX = cursorX;
    cursorMouseY = cursorY;
});
