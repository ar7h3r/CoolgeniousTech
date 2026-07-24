// Custom cursor
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * .12; ry += (my - ry) * .12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a,button,[class*="btn"]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(2)';
    ring.style.transform = 'translate(-50%,-50%) scale(1.6)';
    ring.style.borderColor = 'var(--cyan)';
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.borderColor = '';
  });
});

// Nav scroll + scroll-to-top visibility
const nav = document.getElementById('nav');
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 60);
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 400);
});

// Scroll to top
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Hamburger / mobile menu
const ham = document.getElementById('hamburger');
const mob = document.getElementById('mobile-menu');
const overlay = document.getElementById('mobile-overlay');
const closeBtn = document.getElementById('mobile-close');

function openMenu() {
  ham.classList.add('open');
  mob.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  ham.classList.remove('open');
  mob.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (ham) ham.addEventListener('click', openMenu);
if (closeBtn) closeBtn.addEventListener('click', closeMenu);
if (overlay) overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));

// Canvas particle network with mouse repulsion
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];
let mouseX = -1000, mouseY = -1000;

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4;
    this.r = Math.random() * 1.5 + .5;
  }
  update() {
    const dx = this.x - mouseX, dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100 && dist > 0) {
      const force = (100 - dist) / 100;
      this.vx += (dx / dist) * force * .5;
      this.vy += (dy / dist) * force * .5;
    }
    this.vx *= .98; this.vy *= .98;
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,200,255,.5)'; ctx.fill();
  }
}

for (let i = 0; i < 90; i++) particles.push(new Particle());

function drawNetwork() {
  ctx.clearRect(0, 0, W, H);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(); particles[i].draw();
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,200,255,${(1 - dist / 130) * .2})`;
        ctx.lineWidth = .6; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawNetwork);
}
drawNetwork();

// Hero visual mouse parallax
const heroVisual = document.getElementById('hero-visual');
if (heroVisual) {
  document.addEventListener('mousemove', e => {
    const dx = (e.clientX / innerWidth - .5) * 22;
    const dy = (e.clientY / innerHeight - .5) * 14;
    heroVisual.style.transform = `translateY(-50%) translate(${dx}px, ${dy}px)`;
  });
}

// Hero line reveal (staggered)
document.querySelectorAll('.hero-line').forEach((line, i) => {
  setTimeout(() => line.classList.add('revealed'), 300 + i * 160);
});

// Service card mouse glow
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

// Stat counter animation
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  if (el._counted) return;
  el._counted = true;
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isFloat = !Number.isInteger(target);
  const duration = 1800;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const val = target * easeOutCubic(t);
    el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = (isFloat ? target.toFixed(1) : target) + suffix;
  }
  requestAnimationFrame(step);
}

// Terminal typewriter
let terminalBuilt = false;
function buildTerminal() {
  if (terminalBuilt) return;
  terminalBuilt = true;
  const block = document.querySelector('.terminal-block');
  if (!block) return;
  block.innerHTML = '';
  const lines = [
    { type: 'cmd',  text: 'cyberto --status' },
    { type: 'ok',   text: '✓ All systems operational' },
    { type: 'cmd',  text: 'cyberto --threats today' },
    { type: 'info', text: '→ 1,247 threats neutralized (24h)' },
    { type: 'cmd',  text: 'cyberto --integrity check' },
    { type: 'ok',   text: '✓ Zero breaches detected' },
    { type: 'cursor', text: '' },
  ];
  const colors = { ok: 'var(--green)', info: 'var(--cyan)' };
  lines.forEach((l, i) => {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = 'terminal-line';
      if (l.type === 'cursor') {
        span.innerHTML = '<span class="prompt">$ </span><span class="blink">_</span>';
      } else if (l.type === 'cmd') {
        span.innerHTML = `<span class="prompt">$ </span>${l.text}`;
      } else {
        span.style.color = colors[l.type] || '';
        span.textContent = l.text;
      }
      block.appendChild(span);
    }, i * 380);
  });
}

// Intersection Observer
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('visible');
    if (el.dataset.target !== undefined) animateCounter(el);
    if (el.classList.contains('stats-panel')) {
      buildTerminal();
      el.querySelectorAll('[data-target]').forEach(animateCounter);
    }
    observer.unobserve(el);
  });
}, { threshold: .15 });

document.querySelectorAll('.service-card,.feature-item,.about-num').forEach(el => observer.observe(el));
document.querySelectorAll('.stats-panel').forEach(el => observer.observe(el));

document.querySelectorAll('.service-card').forEach((c, i) => { c.style.transitionDelay = `${i * .07}s`; });
document.querySelectorAll('.feature-item').forEach((c, i) => { c.style.transitionDelay = `${i * .1}s`; });
document.querySelectorAll('.about-num').forEach((c, i) => { c.style.transitionDelay = `${i * .15}s`; });

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'var(--green)';
  btn.style.color = 'var(--bg)';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3000);
}
