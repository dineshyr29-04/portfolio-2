import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- LENIS SMOOTH SCROLL (Premium Settings) ---
const lenis = new Lenis({
  duration: 1.5, // Slower, more premium feel
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1.1,
  lerp: 0.05,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// --- DUAL CURSOR SYSTEM ---
const cursor = document.querySelector('.custom-cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
  // Main cursor (tight)
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.1,
  });

  // Follower (lagged/smooth)
  gsap.to(follower, {
    x: e.clientX - 14,
    y: e.clientY - 14,
    duration: 0.8, // Large lag for premium feel
    ease: 'power2.out'
  });

  // Background Glow Parallax
  gsap.to('.glow-1', {
    x: (e.clientX - window.innerWidth / 2) * 0.05,
    y: (e.clientY - window.innerHeight / 2) * 0.05,
    duration: 2,
    ease: 'power1.out'
  });
  gsap.to('.glow-2', {
    x: (e.clientX - window.innerWidth / 2) * -0.05,
    y: (e.clientY - window.innerHeight / 2) * -0.05,
    duration: 2,
    ease: 'power1.out'
  });
});

document.querySelectorAll('button, a, .skill-tag, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => follower.classList.add('hover'));
  el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
});

// --- PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;

function initCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
}

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 2.5 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.4 + 0.1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(127, 90, 240, ${this.opacity})`;
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', initCanvas);
initCanvas();
createParticles();
animateParticles();

// --- GSAP ANIMATIONS (Professional & Slower) ---

// Hero Entrance
const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 2.5 } }); // Long duration

heroTl.from('.hero-name', { y: 150, opacity: 0, delay: 0.8, rotate: 2 })
  .from('.hero-role', { opacity: 0, y: 50 }, '-=2')
  .from('.hero-tagline', { opacity: 0, y: 50 }, '-=1.8')
  .from('.hero-stat', { opacity: 0, x: 100, stagger: 0.3 }, '-=2');

// Scroll Animations for Glass Cards
gsap.utils.toArray('.glass-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: 'top 90%',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 1.8, // Slow entrance
    ease: 'power3.out'
  });
});

// Horizontal Scroll Projects (Desktop)
if (window.innerWidth > 1024) {
  const projectSlides = gsap.utils.toArray('.project-slide');

  const horizontalTween = gsap.to(projectSlides, {
    xPercent: -100 * (projectSlides.length - 1),
    ease: 'none',
    scrollTrigger: {
      trigger: '.projects-wrapper',
      pin: true,
      scrub: 2, // Slower, more fluid scrub
      snap: {
        snapTo: 1 / (projectSlides.length - 1),
        duration: { min: 0.5, max: 1.5 },
        delay: 0.2,
        ease: 'power2.inOut'
      },
      end: () => "+=" + (projectSlides.length * window.innerWidth)
    }
  });

  // Project Number Animation inside horizontal scroll
  projectSlides.forEach((slide, i) => {
    const num = slide.querySelector('.project-num');
    gsap.from(num, {
      scrollTrigger: {
        trigger: slide,
        containerAnimation: horizontalTween,
        start: 'left center',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1
    });
  });
}

// Cleanup and recalculate on resize
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
