/* ============================================================
   KRISHNA HAMBARDE – PORTFOLIO JAVASCRIPT
   Dark Blue Spaced – star particles, typing, scroll animations
   ============================================================ */

// ── Particle Canvas (Star Field) ─────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];
  const PARTICLE_COUNT = 90;
  const MAX_DIST = 130;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r = Math.random() * 1.8 + .6;
      this.alpha = Math.random() * .6 + .2;
      // randomize between blue-white and cyan star colors
      const rnd = Math.random();
      if (rnd < .4) this.color = `rgba(180,210,255,`; // blue-white star
      else if (rnd < .7) this.color = `rgba(59,130,246,`; // blue
      else this.color = `rgba(6,214,160,`; // cyan-green
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + `)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${.12 * (1 - dist / MAX_DIST)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

// ── Typing Effect ────────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typed-text');
  const phrases = [
    'Data Analyst 📊',
    'C++ Developer 💻',
    'Problem Solver 🧩',
    'Web Developer 🌐',
    'Tech Enthusiast 🚀'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 80);
    } else {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
})();

// ── Scroll Animations (Intersection Observer) ────────────────
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 100);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));
})();

// ── Skill Bars Fill on Scroll ────────────────────────────────
(function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-width');
        entry.target.style.width = w + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar-fill').forEach(el => observer.observe(el));
})();

// ── Counter Animation ────────────────────────────────────────
(function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-target');
        const duration = 1800;
        const start = performance.now();
        function step(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => observer.observe(el));
})();

// ── Navbar Scroll & Active Link ──────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('.section');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    links.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  });

  const toggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  links.forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
})();

// ── Profile Image Fallback ───────────────────────────────────
(function initProfileFallback() {
  const img = document.getElementById('profile-img');
  img.addEventListener('error', () => {
    const c = document.createElement('canvas');
    c.width = 280; c.height = 280;
    const x = c.getContext('2d');
    const grad = x.createLinearGradient(0,0,280,280);
    grad.addColorStop(0,'#3b82f6');
    grad.addColorStop(1,'#06d6a0');
    x.fillStyle = grad;
    x.beginPath(); x.arc(140,140,140,0,Math.PI*2); x.fill();
    x.fillStyle = '#fff';
    x.font = 'bold 100px "Space Grotesk", sans-serif';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText('KH', 140, 145);
    img.src = c.toDataURL();
  });
})();

// ── Smooth Tilt on Cards (subtle) ────────────────────────────
(function initCardTilt() {
  document.querySelectorAll('.project-card, .cert-card, .achievement-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      card.style.transform = `perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
