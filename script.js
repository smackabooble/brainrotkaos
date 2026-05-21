// ── MUSIC PLAYER ──
const bgMusic     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const songBtns    = document.querySelectorAll('.song-btn');
let playing = false;

function setActiveSong(btn) {
  songBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const wasPlaying = playing;
  const currentTime = bgMusic.currentTime;
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

// Start on first interaction if no song selected yet
function onFirstInteraction() {
  if (!playing && !bgMusic.src) {
    setActiveSong(songBtns[0]);
    bgMusic.play().then(() => { playing = true; updateToggle(); }).catch(() => {});
  }
  document.removeEventListener('keydown', onFirstInteraction);
}
document.addEventListener('keydown', onFirstInteraction);

// ── SCROLL FADE-IN ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.card, .special-card, .content-item, .rarity-card, .why-item'
).forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// inject fade-in styles
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

// ── BUY BUTTON: SHAKE + RANDOM OPEN (REDDIT / 2 PNGs) ──
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();

    // restart shake animation
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

// ── RANDOM TILT FOR RARITY CARDS ──
document.querySelectorAll('.rarity-card').forEach(card => {
  const tilt = (Math.random() * 6 - 3).toFixed(1);
  card.style.setProperty('--rot', tilt + 'deg');
  card.style.transform = `rotate(${tilt}deg)`;
});
