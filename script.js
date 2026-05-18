// ── MUSIC TOGGLE ──
const musicBtn = document.getElementById('musicBtn');
const bgMusic  = document.getElementById('bgMusic');
let playing = false;

function startMusic() {
  bgMusic.play().then(() => {
    playing = true;
    musicBtn.textContent = '🔊';
  }).catch(() => {});
}

// Try autoplay immediately
startMusic();

// If browser blocked it, start on first interaction anywhere
function onFirstInteraction() {
  if (!playing) startMusic();
  document.removeEventListener('click', onFirstInteraction);
  document.removeEventListener('keydown', onFirstInteraction);
}
document.addEventListener('click', onFirstInteraction);
document.addEventListener('keydown', onFirstInteraction);

// Manual toggle
musicBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (playing) {
    bgMusic.pause();
    musicBtn.textContent = '🔇';
    playing = false;
  } else {
    startMusic();
  }
});

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

// ── BUY BUTTON: SHAKE + RANDOM OPEN (REDDIT / PNG) ──
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
        './sommarland.png'
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
