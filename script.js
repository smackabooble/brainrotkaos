// ═══════════════════════════════════════════════
// 1. MUSIC PLAYER
// ═══════════════════════════════════════════════
const bgMusic     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const songBtns    = document.querySelectorAll('.song-btn');
let playing = false;

function setActiveSong(btn) {
  songBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const wasPlaying = playing;
  bgMusic.src = btn.dataset.src;
  if (wasPlaying) {
    bgMusic.play().catch(() => {});
  }
}

function updateToggle() {
  musicToggle.textContent = playing ? '⏸ PAUSE' : '▶ PLAY';
}

songBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setActiveSong(btn);
    if (!playing) {
      bgMusic.play().then(() => { playing = true; updateToggle(); }).catch(() => {});
    }
  });
});

musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (playing) {
    bgMusic.pause();
    playing = false;
  } else {
    if (!bgMusic.src) {
      setActiveSong(songBtns[0]);
    }
    bgMusic.play().then(() => { playing = true; }).catch(() => {});
  }
  updateToggle();
});

function onFirstInteraction() {
  if (!playing && !bgMusic.src) {
    setActiveSong(songBtns[0]);
    bgMusic.play().then(() => { playing = true; updateToggle(); }).catch(() => {});
  }
  document.removeEventListener('keydown', onFirstInteraction);
}
document.addEventListener('keydown', onFirstInteraction);


// ═══════════════════════════════════════════════
// 2. CANVAS PARTICLES
// ═══════════════════════════════════════════════
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');

  const COLORS = [
    'rgba(0,255,136,',
    'rgba(0,212,255,',
    'rgba(255,225,53,',
    'rgba(255,0,153,',
    'rgba(155,0,255,',
    'rgba(255,109,0,'
  ];

  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * 0.4,
      vy:      (Math.random() - 0.5) * 0.4 - 0.1,
      r:       1 + Math.random() * 2,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: 0.1 + Math.random() * 0.6,
      dOpacity: (Math.random() > 0.5 ? 1 : -1) * 0.003,
    };
  }

  function initParticles() {
    particles = Array.from({ length: 60 }, randomParticle);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.opacity += p.dOpacity;

      if (p.opacity <= 0.05 || p.opacity >= 0.7) p.dOpacity *= -1;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      grad.addColorStop(0, p.color + p.opacity + ')');
      grad.addColorStop(1, p.color + '0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.min(p.opacity * 1.5, 1) + ')';
      ctx.fill();
    }

    requestAnimationFrame(tick);
  }

  resize();
  initParticles();
  tick();
  window.addEventListener('resize', () => { resize(); });
})();


// ═══════════════════════════════════════════════
// 3. CUSTOM CURSOR
// ═══════════════════════════════════════════════
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafRunning = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
    if (!rafRunning) {
      rafRunning = true;
      requestAnimationFrame(animateRing);
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    if (Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5) {
      requestAnimationFrame(animateRing);
    } else {
      rafRunning = false;
    }
  }

  // cursor-hover class
  const hoverTargets = 'button, a, .card, .rarity-card, .special-card, .why-item, .content-item, .brainrot-char, .song-btn';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();


// ═══════════════════════════════════════════════
// 4. SCROLL PROGRESS BAR
// ═══════════════════════════════════════════════
(function initScrollBar() {
  const bar = document.getElementById('scroll-bar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY || document.documentElement.scrollTop;
    const docHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();


// ═══════════════════════════════════════════════
// 5. SCROLL ANIMATIONS (IntersectionObserver)
// ═══════════════════════════════════════════════
(function initScrollAnimations() {
  const animEls = document.querySelectorAll('[data-anim]');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el    = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => {
          el.classList.add('animated');
        }, delay);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  animEls.forEach(el => obs.observe(el));
})();


// ═══════════════════════════════════════════════
// 6. 3D CARD TILT
// ═══════════════════════════════════════════════
(function initCardTilt() {
  function applyTilt(el, e, maxRot) {
    const rect   = el.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * maxRot;
    const rotY   =  dx * maxRot;

    el.style.transform    = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    el.style.transition   = 'transform 0.08s ease';

    // Move card-glow
    const glow = el.querySelector('.card-glow');
    if (glow) {
      glow.style.transform = `translate(${dx * 20}px, ${dy * 20}px)`;
    }

    // Move rarity-shine
    const shine = el.querySelector('.rarity-shine');
    if (shine) {
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      shine.style.left = (pct - 30) + '%';
    }
  }

  function resetTilt(el) {
    el.style.transform  = '';
    el.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    const glow = el.querySelector('.card-glow');
    if (glow) glow.style.transform = '';
  }

  document.querySelectorAll('.card').forEach(el => {
    el.addEventListener('mousemove', (e) => applyTilt(el, e, 12));
    el.addEventListener('mouseleave', () => resetTilt(el));
  });
  document.querySelectorAll('.special-card').forEach(el => {
    el.addEventListener('mousemove', (e) => applyTilt(el, e, 10));
    el.addEventListener('mouseleave', () => resetTilt(el));
  });
  document.querySelectorAll('.rarity-card').forEach(el => {
    el.addEventListener('mousemove', (e) => applyTilt(el, e, 8));
    el.addEventListener('mouseleave', () => resetTilt(el));
  });
})();


// ═══════════════════════════════════════════════
// 7. PARALLAX HERO
// ═══════════════════════════════════════════════
(function initParallax() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    heroContent.style.transform = `translateY(${y * 0.3}px)`;
  }, { passive: true });
})();


// ═══════════════════════════════════════════════
// 8. MAGNETIC BUTTONS
// ═══════════════════════════════════════════════
(function initMagneticBtns() {
  document.querySelectorAll('.btn-main').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2) * 8;
      const dy   = (e.clientY - cy) / (rect.height / 2) * 8;
      btn.style.transform  = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.4s ease';
    });
  });
})();


// ═══════════════════════════════════════════════
// 9. CURSOR SPARKS
// ═══════════════════════════════════════════════
const sparkEmojis = ['💥','⚡','🔥','💫','✨','🌀','💀','🧠','⭐','🎯'];
document.addEventListener('mousemove', (e) => {
  if (Math.random() > 0.3) return;
  const spark = document.createElement('span');
  spark.className = 'cursor-spark';
  spark.textContent = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];
  spark.style.left = e.clientX + 'px';
  spark.style.top  = e.clientY + 'px';
  spark.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
  spark.style.setProperty('--dy', (Math.random() * -60 - 10) + 'px');
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 700);
});


// ═══════════════════════════════════════════════
// 10. RANDOM BURST POPS
// ═══════════════════════════════════════════════
const burstWords  = ['POW!', 'BOOM!', 'KAPOW!', 'BAM!', 'ZAP!', 'WOW!', 'KAOS!', 'BRAINROT!', 'SIGMA!', 'COOKED!'];
const burstColors = ['#ffe135','#ff0099','#00d4ff','#ff6d00','#7fff00','#ff1744','#9b00ff','#00ff88'];
function spawnBurst() {
  const burst = document.createElement('div');
  burst.className = 'burst-pop';
  burst.textContent = burstWords[Math.floor(Math.random() * burstWords.length)];
  burst.style.left  = (10 + Math.random() * 75) + 'vw';
  burst.style.top   = (10 + Math.random() * 75) + 'vh';
  burst.style.color = burstColors[Math.floor(Math.random() * burstColors.length)];
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 900);
}
setInterval(spawnBurst, 2500);


// ═══════════════════════════════════════════════
// 11. RARITY CARD SHINE SWEEP
// ═══════════════════════════════════════════════
document.querySelectorAll('.rarity-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.classList.remove('shine-active');
    void card.offsetWidth;
    card.classList.add('shine-active');
  });
  card.addEventListener('mouseleave', () => {
    setTimeout(() => card.classList.remove('shine-active'), 600);
  });
});


// ═══════════════════════════════════════════════
// 12. INJECTED CSS (fade-in legacy + btn-shake)
// ═══════════════════════════════════════════════
const injectedStyle = document.createElement('style');
injectedStyle.textContent = `
  .fade-in {
    opacity: 0;
    transform: translateY(40px) rotate(var(--rot, 0deg));
    transition: opacity 0.45s ease, transform 0.45s ease;
  }
  .fade-in.visible {
    opacity: 1;
    transform: translateY(0) rotate(var(--rot, 0deg));
  }
  @keyframes btn-shake {
    0%,100% { transform: translate(0,0); }
    20%      { transform: translate(-5px,0); }
    40%      { transform: translate(5px,0); }
    60%      { transform: translate(-3px,0); }
    80%      { transform: translate(3px,0); }
  }
`;
document.head.appendChild(injectedStyle);


// ═══════════════════════════════════════════════
// 13. BUY BUTTON CLICK
// ═══════════════════════════════════════════════
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    btn.style.animation = 'none';
    void btn.offsetHeight;
    btn.style.animation = 'btn-shake 0.4s ease';

    setTimeout(() => {
      const options = [
        'https://www.reddit.com/r/unket/comments/zqghsh/kek/',
        './sommarland.png',
        './pappa.png'
      ];
      const pick = options[Math.floor(Math.random() * options.length)];
      window.open(pick, '_blank');
      btn.style.animation = '';
    }, 400);
  });
});


// ═══════════════════════════════════════════════
// 14. RARITY CARD RANDOM TILT
// ═══════════════════════════════════════════════
document.querySelectorAll('.rarity-card').forEach(card => {
  const tilt = (Math.random() * 6 - 3).toFixed(1);
  card.style.setProperty('--rot', tilt + 'deg');
});


// ═══════════════════════════════════════════════
// 15. FLOATER CLICK BOOST
// ═══════════════════════════════════════════════
(function initFloaterBoost() {
  const floaters = document.querySelector('.floaters');
  if (!floaters) return;
  document.addEventListener('click', () => {
    floaters.classList.add('boosted');
    setTimeout(() => floaters.classList.remove('boosted'), 1000);
  });
})();
