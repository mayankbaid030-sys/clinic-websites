document.addEventListener('DOMContentLoaded', () => {

  /* ============ SPLASH ANIMATION ============ */
  const splash = document.getElementById('splash');
  const heroVideo = document.querySelector('.hero-video');
  const revealWords = document.querySelectorAll('.word-reveal');

  window.setTimeout(() => splash.classList.add('reveal'), 250);
  window.setTimeout(() => {
    splash.classList.add('done');
    heroVideo.classList.add('hero-image-animate');
    revealWords.forEach((w, i) => {
      setTimeout(() => w.classList.add('in'), i * 90);
    });
  }, 1450);

  /* ============ HEADER SCROLL STATE ============ */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    if (mainNav.classList.contains('open')) {
      mainNav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:100%;left:0;right:0;background:var(--cream);padding:24px 32px;gap:18px;box-shadow:0 10px 30px rgba(0,0,0,.08);';
      mainNav.querySelectorAll('a').forEach(a => a.style.color = 'var(--espresso)');
    } else {
      mainNav.removeAttribute('style');
    }
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    mainNav.removeAttribute('style');
  }));

  /* ============ SPOTLIGHT CANVAS EFFECT ============ */
  const canvas = document.getElementById('spotlightCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');
  let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let targetPointer = { ...pointer };

  function resizeCanvas() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    targetPointer.x = e.clientX - rect.left;
    targetPointer.y = e.clientY - rect.top;
  });

  function renderSpotlight() {
    pointer.x += (targetPointer.x - pointer.x) * 0.08;
    pointer.y += (targetPointer.y - pointer.y) * 0.08;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.max(canvas.width, canvas.height) * 0.35;
    const gradient = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, radius);
    gradient.addColorStop(0, 'rgba(212,175,55,0.35)');
    gradient.addColorStop(0.5, 'rgba(212,175,55,0.12)');
    gradient.addColorStop(1, 'rgba(212,175,55,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(renderSpotlight);
  }
  requestAnimationFrame(renderSpotlight);

  /* ============ SCROLL REVEAL (about/services/etc via IntersectionObserver) ============ */
  const revealTargets = document.querySelectorAll('.service-card, .grid-item, .testimonial-card, .about-media, .about-copy');
  revealTargets.forEach(el => el.setAttribute('data-animate', ''));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach(el => io.observe(el));

  /* ============ PORTFOLIO FILTER ============ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const gridItems = document.querySelectorAll('.grid-item');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      gridItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ============ REEL MODAL ============ */
  const reelModal = document.getElementById('reelModal');
  const reelVideo = document.getElementById('reelVideo');
  const openReelBtn = document.getElementById('openReel');
  const muteToggle = document.getElementById('muteToggle');

  function openModal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (modal === reelModal) reelVideo.pause();
  }

  openReelBtn.addEventListener('click', () => {
    openModal(reelModal);
    reelVideo.play().catch(() => {});
  });

  muteToggle.addEventListener('click', () => {
    reelVideo.muted = !reelVideo.muted;
    muteToggle.innerHTML = reelVideo.muted ? '&#128263;' : '&#128264;';
  });

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', (e) => {
      const modal = e.currentTarget.closest('.modal');
      closeModal(modal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal.open').forEach(closeModal);
    }
  });

  /* ============ BOOKING MODAL ============ */
  const bookingModal = document.getElementById('bookingModal');
  const openBookingBtns = [
    document.getElementById('openBooking'),
    document.getElementById('openBookingHero'),
    document.getElementById('openBookingCta')
  ];
  openBookingBtns.forEach(btn => btn && btn.addEventListener('click', () => openModal(bookingModal)));

  const bookingForm = document.getElementById('bookingForm');
  const steps = bookingForm.querySelectorAll('.step');
  const panes = bookingForm.querySelectorAll('.step-pane');
  let currentStep = 1;

  function goToStep(n) {
    panes.forEach(p => p.classList.toggle('active', p.dataset.pane === String(n)));
    steps.forEach(s => {
      const stepNum = Number(s.dataset.step);
      s.classList.toggle('active', stepNum <= n);
    });
    currentStep = n;
  }

  function validatePane(n) {
    const pane = bookingForm.querySelector(`.step-pane[data-pane="${n}"]`);
    const required = pane.querySelectorAll('[required]');
    for (const field of required) {
      if (field.type === 'radio') {
        const group = pane.querySelectorAll(`[name="${field.name}"]`);
        if (![...group].some(r => r.checked)) { alert('Please make a selection to continue.'); return false; }
      } else if (!field.value.trim()) {
        field.focus();
        alert('Please fill in all required fields.');
        return false;
      }
    }
    return true;
  }

  bookingForm.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!validatePane(currentStep)) return;
      if (currentStep === 3) buildSummary();
      goToStep(currentStep + 1);
    });
  });
  bookingForm.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => goToStep(currentStep - 1));
  });

  function buildSummary() {
    const data = new FormData(bookingForm);
    const summary = document.getElementById('bookingSummary');
    summary.innerHTML = `
      <div><strong>Event:</strong> ${data.get('eventType') || '—'}</div>
      <div><strong>Date:</strong> ${data.get('eventDate') || '—'}</div>
      <div><strong>Name:</strong> ${data.get('fullName') || '—'}</div>
      <div><strong>Phone:</strong> ${data.get('phone') || '—'}</div>
      <div><strong>Email:</strong> ${data.get('email') || '—'}</div>
      <div><strong>Notes:</strong> ${data.get('notes') || '—'}</div>
    `;
  }

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(bookingForm);
    document.getElementById('successPhone').textContent = data.get('phone') || '';
    panes.forEach(p => p.classList.remove('active'));
    bookingForm.querySelector('.step-pane[data-pane="success"]').classList.add('active');
    steps.forEach(s => s.classList.add('active'));
  });

  bookingModal.addEventListener('transitionend', (e) => {
    if (!bookingModal.classList.contains('open') && e.propertyName === 'opacity') {
      goToStep(1);
      bookingForm.reset();
    }
  });

  /* ============ YEAR ============ */
  document.getElementById('year').textContent = new Date().getFullYear();

});
