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

    const tiltCards = document.querySelectorAll('.editorial-project-block, .story-card, .decision-item, .pt-card, .ia-card, .mech-node, .t-step, .eco-node, .beyond-item, .impact-stat-card');

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
  // 5. INTERACTIVE SKILLS & CAPABILITIES MATRIX (SECTION 06)
  // =========================================================================
  const CAPABILITIES_DATA = {
    strategy: {
      title: 'Product Strategy in Action',
      desc: 'Formulated 0-to-1 direct-to-consumer and product strategy for <strong>The Mango Factory</strong> (scaling to ₹1 Cr+ revenue) and structured low-friction personal products.',
      projects: [
        { title: 'The Mango Factory ↗', url: 'mango-factory.html' },
        { title: 'Office Tracker ↗', url: 'office-tracker.html' },
        { title: 'Job Tracker ↗', url: 'job-tracker.html' }
      ],
      highlightCats: ['strategy']
    },
    discovery: {
      title: 'Product Discovery in Action',
      desc: 'Identified unmet user problems: spontaneous walk-in dining availability (<strong>Dine-In Now</strong>), attendance discrepancy (<strong>Office Tracker</strong>), and AI fit confidence in e-commerce.',
      projects: [
        { title: 'Dine-In Now ↗', url: 'dine-in-now.html' },
        { title: 'Office Tracker ↗', url: 'office-tracker.html' },
        { title: 'AI Virtual Try-On ↗', url: 'ai-virtual-tryon.html' }
      ],
      highlightCats: ['discovery']
    },
    research: {
      title: 'User Research & Segmentation in Action',
      desc: 'Segmented customer cohorts for <strong>Mango Factory</strong> (authenticity seekers vs health-conscious parents vs corporate gifters) and conducted user journey mapping for job applicants.',
      projects: [
        { title: 'The Mango Factory ↗', url: 'mango-factory.html' },
        { title: 'Job Tracker ↗', url: 'job-tracker.html' },
        { title: 'Ownly ↗', url: 'ownly.html' }
      ],
      highlightCats: ['research']
    },
    roadmapping: {
      title: 'Roadmapping & Prioritization in Action',
      desc: 'Structured MVP stage funnels, defined milestone releases for 0-to-1 products, and balanced technical debt vs customer velocity across cross-functional teams.',
      projects: [
        { title: 'Office Tracker ↗', url: 'office-tracker.html' },
        { title: 'Job Tracker ↗', url: 'job-tracker.html' },
        { title: 'Morgan Stanley RLT ↗', url: '#experience' }
      ],
      highlightCats: ['roadmapping']
    },
    gtm: {
      title: 'GTM & Launch in Action',
      desc: 'Drove seasonal D2C customer acquisition, unboxing retention loops, and live PWA deployment on production web infrastructure.',
      projects: [
        { title: 'The Mango Factory (Instagram) ↗', url: 'https://www.instagram.com/themangofactory.in' },
        { title: 'Office Tracker Live PWA ↗', url: 'https://myofficetracker.netlify.app' }
      ],
      highlightCats: ['gtm']
    },
    agile: {
      title: 'Agile & Cross-Functional Leadership in Action',
      desc: 'Led sprint rituals, technical estimation, backlog grooming, and rapid feedback cycles bridging enterprise engineering teams, designers, and business stakeholders.',
      projects: [
        { title: 'Morgan Stanley Experience ↗', url: '#experience' },
        { title: 'The Mango Factory Ops ↗', url: 'mango-factory.html' }
      ],
      highlightCats: ['agile']
    },
    data: {
      title: 'Data-Driven Decisions in Action',
      desc: 'Automated high-scale enterprise liquidity pipelines at <strong>Morgan Stanley</strong> (100 GB+ daily streaming scale), reducing reporting latency from 40 min to 12 sec with zero margin for error.',
      projects: [
        { title: 'Morgan Stanley Architecture ↗', url: '#experience' },
        { title: 'The Mango Factory Unit Economics ↗', url: 'mango-factory.html' }
      ],
      highlightCats: ['data']
    },
    abtesting: {
      title: 'A/B Testing & Experimentation in Action',
      desc: 'Formulated hypothesis-driven experiment loops for packaging transit durability, customer conversion funnels, and fit confidence UX indicators in AI retail.',
      projects: [
        { title: 'AI Virtual Try-On ↗', url: 'ai-virtual-tryon.html' },
        { title: 'The Mango Factory ↗', url: 'mango-factory.html' }
      ],
      highlightCats: ['discovery', 'research']
    }
  };

  function initInteractiveSkillsMatrix() {
    const cards = document.querySelectorAll('.capability-card');
    const evidenceDrawer = document.getElementById('capabilityEvidence');
    const evidenceTitle = document.getElementById('evidenceTitle');
    const evidenceDesc = document.getElementById('evidenceDesc');
    const evidenceProjects = document.getElementById('evidenceProjects');
    const competencyPills = document.querySelectorAll('.competency-pill');

    if (!cards.length || !evidenceDrawer) return;

    function selectCapability(capKey) {
      const data = CAPABILITIES_DATA[capKey];
      if (!data) return;

      // Update active card state
      cards.forEach(card => {
        const isActive = card.getAttribute('data-capability') === capKey;
        card.classList.toggle('is-active', isActive);
      });

      // Update evidence drawer content
      if (evidenceTitle) evidenceTitle.textContent = data.title;
      if (evidenceDesc) evidenceDesc.innerHTML = data.desc;
      if (evidenceProjects) {
        evidenceProjects.innerHTML = data.projects.map(p => 
          `<a href="${p.url}" ${p.url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} class="evidence-pill">${p.title}</a>`
        ).join('');
      }

      // Highlight related competency pills
      competencyPills.forEach(pill => {
        const pillCat = pill.getAttribute('data-pill-cat');
        const shouldHighlight = data.highlightCats.includes(pillCat) || (capKey === 'data' && pillCat === 'data') || (capKey === 'agile' && pillCat === 'agile');
        pill.classList.toggle('is-highlighted', shouldHighlight);
      });
    }

    cards.forEach(card => {
      const capKey = card.getAttribute('data-capability');
      card.addEventListener('click', () => selectCapability(capKey));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectCapability(capKey);
        }
      });
    });

    // Initial highlight for strategy
    selectCapability('strategy');
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
  // 8. UNIQUE ANIMATION 1: LIQUID NEON SCROLL PROGRESS
  // =========================================================================
  function initScrollProgress() {
    let container = document.querySelector('.scroll-progress-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'scroll-progress-container';
      container.innerHTML = '<div class="scroll-progress-bar"></div>';
      document.body.prepend(container);
    }

    const bar = container.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const pct = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      bar.style.width = `${pct}%`;
    }, { passive: true });
  }

  // =========================================================================
  // 9. UNIQUE ANIMATION 2: AMBIENT PARTICLE CONSTELLATION CANVAS
  // =========================================================================
  function initAmbientConstellation() {
    let canvas = document.getElementById('ambientConstellationCanvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'ambientConstellationCanvas';
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const PARTICLE_COUNT = window.innerWidth <= 768 ? 22 : 45;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.4 + 0.15
      });
    }

    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(216, 184, 156, ${p.alpha})`;
        ctx.fill();

        // Connect nearby nodes
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(216, 184, 156, ${(1 - dist / 110) * 0.12})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(renderParticles);
    }

    requestAnimationFrame(renderParticles);
  }

  // =========================================================================
  // 10. UNIQUE ANIMATION 3: FLUID MAGNETIC CURSOR AURA (DESKTOP)
  // =========================================================================
  function initFluidCursorAura() {
    if (window.innerWidth <= 860) return;

    let aura = document.querySelector('.fluid-cursor-aura');
    if (!aura) {
      aura = document.createElement('div');
      aura.className = 'fluid-cursor-aura';
      document.body.prepend(aura);
    }

    let mouseX = -1000;
    let mouseY = -1000;
    let auraX = -1000;
    let auraY = -1000;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function renderAura() {
      auraX += (mouseX - auraX) * 0.12;
      auraY += (mouseY - auraY) * 0.12;

      aura.style.transform = `translate3d(${auraX}px, ${auraY}px, 0)`;
      requestAnimationFrame(renderAura);
    }

    requestAnimationFrame(renderAura);

    // Dynamic color morphing based on hovered card type
    document.querySelectorAll('.editorial-project-block').forEach(card => {
      card.addEventListener('mouseenter', () => {
        if (card.classList.contains('flagship-project')) {
          aura.style.background = 'radial-gradient(circle, rgba(232, 122, 36, 0.12) 0%, rgba(216, 184, 156, 0.03) 50%, transparent 70%)';
        } else if (card.classList.contains('fintech-project')) {
          aura.style.background = 'radial-gradient(circle, rgba(59, 177, 123, 0.14) 0%, rgba(59, 177, 123, 0.03) 50%, transparent 70%)';
        } else if (card.classList.contains('streaming-project')) {
          aura.style.background = 'radial-gradient(circle, rgba(232, 122, 36, 0.14) 0%, rgba(232, 122, 36, 0.03) 50%, transparent 70%)';
        } else if (card.classList.contains('analytics-project')) {
          aura.style.background = 'radial-gradient(circle, rgba(182, 58, 69, 0.14) 0%, rgba(182, 58, 69, 0.03) 50%, transparent 70%)';
        }
      });

      card.addEventListener('mouseleave', () => {
        aura.style.background = 'radial-gradient(circle, rgba(216, 184, 156, 0.07) 0%, rgba(216, 184, 156, 0.015) 50%, transparent 70%)';
      });
    });
  }

  // =========================================================================
  // 11. UNIQUE ANIMATION 4: CIPHER MATRIX TEXT DECODER
  // =========================================================================
  function initCipherDecoder() {
    const cipherTargets = document.querySelectorAll(
      '.mono-tag, .case-meta-tag, .pt-tag, .schema-code, .project-index, .fms-tag, .story-step-label, .decision-num'
    );
    if (!cipherTargets.length) return;

    const chars = '01#$*+/_<>~[]{}=%!';

    function decodeText(element) {
      if (element.dataset.decoded) return;
      element.dataset.decoded = 'true';

      const originalText = element.textContent.trim();
      let iteration = 0;
      element.classList.add('cipher-scramble', 'is-decoding');

      const interval = setInterval(() => {
        element.textContent = originalText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (letter === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iteration >= originalText.length) {
          clearInterval(interval);
          element.textContent = originalText;
          setTimeout(() => {
            element.classList.remove('is-decoding');
          }, 300);
        }

        iteration += 1 / 2;
      }, 30);
    }

    const cipherObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          decodeText(entry.target);
          cipherObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    cipherTargets.forEach(el => cipherObserver.observe(el));
  }

  // =========================================================================
  // 12. UNIQUE ANIMATION 5: CARD GLINT FLARE & TELEMETRY OSCILLOSCOPES
  // =========================================================================
  function initCardGlintsAndOscilloscopes() {
    // Inject dynamic glass glint flares into cards
    const cardsToGlint = document.querySelectorAll('.editorial-project-block, .pt-card, .next-case-card');
    cardsToGlint.forEach(card => {
      if (!card.querySelector('.card-glint-flare')) {
        const glint = document.createElement('div');
        glint.className = 'card-glint-flare';
        card.appendChild(glint);
      }
    });

    // Inject live telemetry oscilloscopes into status headers
    const statusTags = document.querySelectorAll('.schema-status, .status-indicator.live');
    statusTags.forEach(tag => {
      if (!tag.querySelector('.telemetry-oscilloscope')) {
        const osci = document.createElement('span');
        osci.className = 'telemetry-oscilloscope';
        osci.innerHTML = `
          <span class="oscilloscope-bar"></span>
          <span class="oscilloscope-bar"></span>
          <span class="oscilloscope-bar"></span>
          <span class="oscilloscope-bar"></span>
          <span class="oscilloscope-bar"></span>
        `;
        tag.appendChild(osci);
      }
    });
  }

  // =========================================================================
  // 13. MOBILE INTERACTION & CREATIVE SCROLL ANIMATION ENGINE
  // =========================================================================

  // --- Mobile Scroll-Linked Center Focus ---
  function initMobileScrollFocus() {
    if (window.innerWidth > 860) return;

    const focusCards = document.querySelectorAll(
      '.editorial-project-block, .story-card, .decision-item, .pt-card, .mechanism-showcase-box, .impact-stat-card, .timeline-entry, .next-case-card'
    );
    if (!focusCards.length) return;

    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('mobile-focused');
        } else {
          entry.target.classList.remove('mobile-focused');
        }
      });
    }, {
      root: null,
      threshold: 0.35,
      rootMargin: '-10% 0px -20% 0px'
    });

    focusCards.forEach(card => focusObserver.observe(card));
  }

  // --- Mobile Touch Reactive Spotlight & Micro-Bounces ---
  function initMobileTouchPhysics() {
    const interactiveTouchCards = document.querySelectorAll(
      '.editorial-project-block, .story-card, .decision-item, .pt-card, .mech-node, .impact-stat-card, .beyond-item, .next-case-card'
    );

    interactiveTouchCards.forEach(card => {
      card.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        card.style.setProperty('--card-touch-x', `${x}px`);
        card.style.setProperty('--card-touch-y', `${y}px`);
        card.classList.add('is-touch-active');
      }, { passive: true });

      card.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;

        card.style.setProperty('--card-touch-x', `${x}px`);
        card.style.setProperty('--card-touch-y', `${y}px`);
      }, { passive: true });

      card.addEventListener('touchend', () => {
        card.classList.remove('is-touch-active');
      }, { passive: true });

      card.addEventListener('touchcancel', () => {
        card.classList.remove('is-touch-active');
      }, { passive: true });
    });
  }

  // --- Mobile Sequential Mechanism Flow Pulse ---
  function initMobileMechanismWave() {
    const mechanismBoxes = document.querySelectorAll('.mechanism-showcase-box');
    if (!mechanismBoxes.length) return;

    const mechObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const nodes = entry.target.querySelectorAll('.mech-node');
          const arrows = entry.target.querySelectorAll('.mech-arrow');

          nodes.forEach((node, i) => {
            setTimeout(() => {
              node.classList.add('node-illuminated');
            }, i * 180);
          });

          arrows.forEach((arr, i) => {
            setTimeout(() => {
              arr.classList.add('arrow-streaming');
            }, i * 180 + 90);
          });

          mechObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    mechanismBoxes.forEach(box => mechObserver.observe(box));
  }

  // =========================================================================
  // 14. SCROLL REVEALS & EDITORIAL STORYTELLING ENGINE
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
  // 15. INITIALIZATION
  // =========================================================================
  function init() {
    window.addEventListener('resize', () => {
      init3DCardTilts();
      initMagneticButtons();
      initMobileScrollFocus();
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
    initInteractiveSkillsMatrix();
    initMagneticButtons();
    initMobileNav();
    initScrollReveals();
    initSmoothAnchors();

    // Unique Signature Animations
    initScrollProgress();
    initAmbientConstellation();
    initFluidCursorAura();
    initCipherDecoder();
    initCardGlintsAndOscilloscopes();

    // Mobile Creative Animation Systems
    initMobileScrollFocus();
    initMobileTouchPhysics();
    initMobileMechanismWave();

    requestAnimationFrame(heroAnimationLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();


