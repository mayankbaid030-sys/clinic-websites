document.addEventListener('DOMContentLoaded', () => {

  /* ============ SPLASH ANIMATION ============ */
  const splash = document.getElementById('splash');

  window.setTimeout(() => splash.classList.add('reveal'), 250);
  window.setTimeout(() => {
    splash.classList.add('done');
  }, 1450);

  /* ============ HERO--15: MOBILE MENU ============ */
  const hero15MenuToggle = document.getElementById('hero15MenuToggle');
  const hero15MobileMenu = document.getElementById('hero15MobileMenu');
  if (hero15MenuToggle && hero15MobileMenu) {
    hero15MenuToggle.addEventListener('click', () => {
      hero15MobileMenu.classList.toggle('open');
    });
    hero15MobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      hero15MobileMenu.classList.remove('open');
    }));
  }

  /* ============ HERO--15: SEARCH & ITINERARY MODALS ============ */
  function openHero15Modal(modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeHero15Modal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  const hero15SearchModal = document.getElementById('hero15SearchModal');
  const hero15ItineraryModal = document.getElementById('hero15ItineraryModal');
  const hero15SearchBtn = document.getElementById('hero15SearchBtn');
  const hero15ExploreBtn = document.getElementById('hero15ExploreBtn');

  if (hero15SearchBtn && hero15SearchModal) {
    hero15SearchBtn.addEventListener('click', () => openHero15Modal(hero15SearchModal));
  }
  if (hero15ExploreBtn && hero15ItineraryModal) {
    hero15ExploreBtn.addEventListener('click', () => openHero15Modal(hero15ItineraryModal));
  }

  document.querySelectorAll('.hero15-modal [data-hero15-close]').forEach(el => {
    el.addEventListener('click', (e) => closeHero15Modal(e.currentTarget.closest('.hero15-modal')));
  });

  document.querySelectorAll('[data-hero15-destination]').forEach(tag => {
    tag.addEventListener('click', (e) => {
      const input = hero15SearchModal.querySelector('input[type="text"]');
      if (input) input.value = e.currentTarget.dataset.hero15Destination;
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.hero15-modal.open').forEach(closeHero15Modal);
    }
  });

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

  if (openReelBtn) {
    openReelBtn.addEventListener('click', () => {
      openModal(reelModal);
      reelVideo.play().catch(() => {});
    });
  }

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
