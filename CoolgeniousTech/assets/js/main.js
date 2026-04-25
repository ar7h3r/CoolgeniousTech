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
  });
  el.addEventListener('mouseleave', () => {
    cur.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

// Nav scroll shrink
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 60);
});

// Canvas particle network
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * W; this.y = Math.random() * H;
    this.vx = (Math.random() - .5) * .4; this.vy = (Math.random() - .5) * .4;
    this.r = Math.random() * 1.5 + .5;
  }
  update() {
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

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: .15 });

document.querySelectorAll('.service-card,.feature-item,.about-num').forEach(el => observer.observe(el));

document.querySelectorAll('.service-card').forEach((c, i) => { c.style.transitionDelay = `${i * .07}s`; });
document.querySelectorAll('.feature-item').forEach((c, i) => { c.style.transitionDelay = `${i * .1}s`; });
document.querySelectorAll('.about-num').forEach((c, i) => { c.style.transitionDelay = `${i * .15}s`; });

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'var(--green)';
  btn.style.color = 'var(--bg)';
  setTimeout(() => {
    btn.textContent = 'Send Message →';
    btn.style.background = '';
    btn.style.color = '';
  }, 3000);
}
