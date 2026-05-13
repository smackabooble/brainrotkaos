// Animate cards into view on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = entry.target.dataset.transform || 'translateY(0)';
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .special-card, .content-item, .board-tile').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease, box-shadow 0.15s, transform 0.15s';
  observer.observe(el);
});

// Slime drip random heights on load
document.querySelectorAll('.drip').forEach(drip => {
  const h = 50 + Math.random() * 100;
  drip.style.height = h + 'px';
});

// Buy button confetti-ish shake
document.querySelectorAll('.btn-main').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.style.animation = 'none';
    btn.offsetHeight;
    btn.style.animation = 'btn-shake 0.4s ease';
  });
});

const style = document.createElement('style');
style.textContent = `
  @keyframes btn-shake {
    0%,100% { transform: translate(0,0) rotate(0); }
    20%      { transform: translate(-4px,0) rotate(-2deg); }
    40%      { transform: translate(4px,0) rotate(2deg); }
    60%      { transform: translate(-3px,0) rotate(-1deg); }
    80%      { transform: translate(3px,0) rotate(1deg); }
  }
`;
document.head.appendChild(style);
