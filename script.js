// ── MUSIC TOGGLE ──
const musicBtn = document.getElementById('musicBtn');
const bgMusic  = document.getElementById('bgMusic');
let playing = false;

musicBtn.addEventListener('click', () => {
  if (playing) {
    bgMusic.pause();
    musicBtn.textContent = '🔇';
  } else {
    bgMusic.play().catch(() => {});
    musicBtn.textContent = '🔊';
  }
  playing = !playing;
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

// ── BUY BUTTON SHAKE ON CLICK ──
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.style.animation = 'none';
    void btn.offsetHeight;
    btn.style.animation = 'btn-shake 0.4s ease';
    setTimeout(() => btn.style.animation = '', 500);
  });
});

// ── RANDOM TILT FOR RARITY CARDS ──
document.querySelectorAll('.rarity-card').forEach(card => {
  const tilt = (Math.random() * 6 - 3).toFixed(1);
  card.style.setProperty('--rot', tilt + 'deg');
  card.style.transform = `rotate(${tilt}deg)`;
});
