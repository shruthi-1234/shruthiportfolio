/**
 * SHRUTHI SUNDAR — CINEMATIC EDITORIAL PORTFOLIO ENGINE
 * 
 * UNIVERSAL INTERACTION & CREATIVE ANIMATION ENGINE:
 * 1. HERO REVEAL: Two 1:1 Aligned Layers (Human ↔ Neck-down Robot Chassis)
 * 2. 3D PERSPECTIVE TILT & DYNAMIC SPOTLIGHT: Project Cards & Beyond Collage
 * 3. NUMBER ROLL-UP COUNTERS: Case Study & Impact Stats
 * 4. LIVE TELEMETRY STREAM SIMULATION: Real-Time Stream Equalizer
 * 5. DUAL DISCIPLINE SYNTHESIS BRIDGE: Interactive Skill Connection Pulse
 * 6. MAGNETIC CTA BUTTON: Cursor Proximity Magnetism
 * 7. MOBILE TOUCH ISOLATION & GYROSCOPE PARALLAX
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. HERO PARALLAX CONFIGURATION
  // =========================================================================
  const portraitContainer = document.getElementById('heroPortraitContainer');
  const bgTextLayer = document.getElementById('heroBgTextLayer');

  const PARALLAX_MAX_OFFSET = 12;

  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  // --- Main Hero Animation Loop (Smooth 60fps Ambient & Kinetic Parallax) ---
  function heroAnimationLoop() {
    currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;

    if (bgTextLayer) {
      bgTextLayer.style.setProperty('--bg-parallax-x', `${currentParallaxX.toFixed(2)}px`);
      bgTextLayer.style.setProperty('--bg-parallax-y', `${currentParallaxY.toFixed(2)}px`);
    }

    if (portraitContainer) {
      portraitContainer.style.transform = `translate3d(${(currentParallaxX * -0.4).toFixed(2)}px, ${(currentParallaxY * -0.4).toFixed(2)}px, 0)`;
    }

    requestAnimationFrame(heroAnimationLoop);
  }

  function onPointerMove(e) {
    if (e.pointerType === 'touch') return;

    const winCenterX = window.innerWidth / 2;
    const winCenterY = window.innerHeight / 2;
    const normX = (e.clientX - winCenterX) / winCenterX;
    const normY = (e.clientY - winCenterY) / winCenterY;

    targetParallaxX = -normX * PARALLAX_MAX_OFFSET;
    targetParallaxY = -normY * (PARALLAX_MAX_OFFSET * 0.7);
  }

  function onPointerLeave() {
    targetParallaxX = 0;
    targetParallaxY = 0;
  }

  // --- Mobile Gyroscope Parallax ---
  function onDeviceOrientation(e) {
    if (window.innerWidth > 768) return;
    if (e.gamma !== null && e.beta !== null) {
      const tiltX = Math.max(-25, Math.min(25, e.gamma));
      const tiltY = Math.max(-25, Math.min(25, e.beta - 45));
      targetParallaxX = (tiltX / 25) * -10;
      targetParallaxY = (tiltY / 25) * -6;
    }
  }

  // =========================================================================
  // 2. CREATIVE 3D PERSPECTIVE TILT & DYNAMIC SPOTLIGHT ON CARDS
  // =========================================================================
  function init3DCardTilts() {
    if (window.innerWidth <= 860) return; // Desktop only for optimal performance

    const tiltCards = document.querySelectorAll('.story-card, .decision-item, .pt-card, .ia-card, .mech-node, .t-step, .eco-node, .beyond-item, .impact-stat-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set spotlight CSS variables
        card.style.setProperty('--card-mouse-x', `${x}px`);
        card.style.setProperty('--card-mouse-y', `${y}px`);

        // Calculate 3D tilt angles
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // =========================================================================
  // 3. NUMBER ROLL-UP ANIMATIONS (CASE STUDY & IMPACT STATS)
  // =========================================================================
  function animateValue(obj, start, end, duration, suffix = '') {
    if (!obj || obj.dataset.animated) return;
    obj.dataset.animated = 'true';

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      obj.innerHTML = `${currentVal}<span class="stat-unit">${suffix}</span>`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = `${end}<span class="stat-unit">${suffix}</span>`;
      }
    };
    window.requestAnimationFrame(step);
  }

  function initCounterObservers() {
    const counterTarget = document.getElementById('counterTarget');
    const impactCards = document.querySelectorAll('.impact-stat-card');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animate Case Study Target Number
          if (entry.target === counterTarget) {
            animateValue(counterTarget, 40, 12, 1400, 'sec');
          }

          // Animate Impact Stat Cards
          if (entry.target.classList.contains('impact-stat-card')) {
            const numEl = entry.target.querySelector('.stat-number-giant');
            if (numEl) {
              const text = numEl.textContent.trim();
              if (text.includes('12')) animateValue(numEl, 0, 12, 1200, 'sec');
              else if (text.includes('100')) animateValue(numEl, 0, 100, 1600, 'GB+');
              else if (text.includes('3')) animateValue(numEl, 0, 3, 1000, '×');
            }
          }
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    if (counterTarget) counterObserver.observe(counterTarget);
    impactCards.forEach(card => counterObserver.observe(card));
  }

  // =========================================================================
  // 4. LIVE TELEMETRY EQUALIZER WAVE ANIMATION (PROJECT 02)
  // =========================================================================
  function initTelemetryLiveWave() {
    const telemetryBars = document.querySelectorAll('.telemetry-bar');
    if (!telemetryBars.length) return;

    setInterval(() => {
      telemetryBars.forEach(bar => {
        const randHeight = Math.floor(Math.random() * 65) + 35; // 35% to 100%
        bar.style.setProperty('--h', `${randHeight}%`);
      });
    }, 1800);
  }

  // =========================================================================
  // 5. DUAL DISCIPLINE SYNTHESIS BRIDGE PULSE (SECTION 05)
  // =========================================================================
  function initDualDisciplineBridge() {
    const bridgeHub = document.querySelector('.discipline-bridge-hub');
    const skillItems = document.querySelectorAll('.skill-item');

    if (!bridgeHub || !skillItems.length) return;

    skillItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        bridgeHub.classList.add('is-active');
      });
      item.addEventListener('mouseleave', () => {
        bridgeHub.classList.remove('is-active');
      });
    });
  }

  // =========================================================================
  // 6. MAGNETIC CTA BUTTON EFFECT (SECTION 10 & HERO)
  // =========================================================================
  function initMagneticButtons() {
    if (window.innerWidth <= 860) return;

    const magneticButtons = document.querySelectorAll('.cta-button-main');

    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
      });
    });
  }

  // =========================================================================
  // 7. MOBILE MENU & NAVIGATION CONTROLLER
  // =========================================================================
  function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openNav() {
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.add('is-open');
        document.body.classList.add('nav-locked');
      }
    }

    function closeNav() {
      if (mobileNavOverlay) {
        mobileNavOverlay.classList.remove('is-open');
        document.body.classList.remove('nav-locked');
      }
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openNav);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeNav);

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // =========================================================================
  // 8. SCROLL REVEALS & EDITORIAL STORYTELLING ENGINE
  // =========================================================================
  function initScrollReveals() {
    const revealItems = document.querySelectorAll('.reveal-item');
    if (!revealItems.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    revealItems.forEach(el => observer.observe(el));
  }

  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '#heroStage') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // =========================================================================
  // 9. INITIALIZATION
  // =========================================================================
  function init() {
    window.addEventListener('resize', () => {
      init3DCardTilts();
      initMagneticButtons();
    }, { passive: true });

    // Desktop Pointer Events for ambient kinetic parallax
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    // Optional Gyroscope Parallax on Mobile
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }

    // Initialize All Interactive Section Modules
    init3DCardTilts();
    initCounterObservers();
    initTelemetryLiveWave();
    initDualDisciplineBridge();
    initMagneticButtons();
    initMobileNav();
    initScrollReveals();
    initSmoothAnchors();

    requestAnimationFrame(heroAnimationLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
