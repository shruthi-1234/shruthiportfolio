/**
 * SHRUTHI SUNDAR — CINEMATIC EDITORIAL PORTFOLIO ENGINE
 * 
 * UNIVERSAL INTERACTION ENGINE (DESKTOP & MOBILE COMPATIBLE):
 * - Two 1:1 Aligned Layers: shruthi-human.png (Base) ↔ shruthi-robot.png (Top Reveal)
 * - Monumental typography positioned behind the dominant portrait
 * - Dynamic mouse & device orientation parallax on the background name layer
 * - Soft organic feathered reveal mask (No rings, no circles, no outlines)
 * - Multi-touch drag tracking with touch-action isolation (iOS Safari & Android Chrome compatible)
 * - Press & Hold progressive expansion to full robot reveal
 * - Zero image translations, 100% static aligned assets
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. HERO REVEAL & PARALLAX CONFIGURATION
  // =========================================================================
  const portraitContainer = document.getElementById('heroPortraitContainer');
  const bgTextLayer = document.getElementById('heroBgTextLayer');

  // Dynamic Radii based on Screen Size
  function getRevealRadii() {
    const isMobile = window.innerWidth <= 768;
    return {
      normal: isMobile ? 115 : 165,  // ~230px on mobile, ~330px on desktop
      hold: isMobile ? 620 : 980      // Full canvas expansion
    };
  }

  const LERP_POS = 0.16;                 // Smooth pointer follow inertia
  const LERP_RAD_ENTER = 0.14;           // Smooth radius expansion factor
  const LERP_RAD_HOLD = 0.055;           // Smooth progressive hold factor
  const LERP_RAD_LEAVE = 0.09;          // Smooth relaxation factor when leaving
  const PARALLAX_MAX_OFFSET = 16;        // Max parallax offset for background text (px)

  // Tracking State
  let isHovering = false;
  let isHolding = false;
  let isTouchActive = false;
  
  let stageRect = { left: 0, top: 0, width: 600, height: 334 };
  let targetX = 300;
  let targetY = 167;
  let currentX = 300;
  let currentY = 167;

  let targetRadius = 0;
  let currentRadius = 0;

  // Background Text Parallax State
  let targetParallaxX = 0;
  let targetParallaxY = 0;
  let currentParallaxX = 0;
  let currentParallaxY = 0;

  function updateStageRect() {
    if (portraitContainer) {
      stageRect = portraitContainer.getBoundingClientRect();
      if (!isHovering && !isTouchActive) {
        targetX = stageRect.width / 2;
        targetY = stageRect.height / 2;
        currentX = targetX;
        currentY = targetY;
      }
    }
  }

  // --- Main Animation Loop (60fps GPU Updates) ---
  function heroAnimationLoop() {
    const radii = getRevealRadii();

    // 1. Target Radius based on interaction state
    if (isHolding) {
      targetRadius = radii.hold;
    } else if (isHovering || isTouchActive) {
      targetRadius = radii.normal;
    } else {
      targetRadius = 0;
    }

    // 2. Smooth Coordinates with Inertia
    currentX += (targetX - currentX) * LERP_POS;
    currentY += (targetY - currentY) * LERP_POS;

    // 3. Smooth Radius Dynamics
    let radFactor = LERP_RAD_LEAVE;
    if (isHolding) {
      radFactor = LERP_RAD_HOLD;
    } else if (isHovering || isTouchActive) {
      radFactor = LERP_RAD_ENTER;
    }
    currentRadius += (targetRadius - currentRadius) * radFactor;

    // 4. Smooth Parallax on Background Name
    currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
    currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;

    // 5. Apply Mask Custom Properties to Container
    if (portraitContainer) {
      portraitContainer.style.setProperty('--cursor-x', `${currentX.toFixed(1)}px`);
      portraitContainer.style.setProperty('--cursor-y', `${currentY.toFixed(1)}px`);
      portraitContainer.style.setProperty('--reveal-radius', `${currentRadius.toFixed(1)}px`);
    }

    // 6. Apply Parallax Custom Properties to Background Text Layer
    if (bgTextLayer) {
      bgTextLayer.style.setProperty('--bg-parallax-x', `${currentParallaxX.toFixed(1)}px`);
      bgTextLayer.style.setProperty('--bg-parallax-y', `${currentParallaxY.toFixed(1)}px`);
    }

    requestAnimationFrame(heroAnimationLoop);
  }

  // --- Mouse Pointer Event Handlers (Desktop) ---
  function onPointerMove(e) {
    if (e.pointerType === 'touch') return; // Handled by dedicated touch handlers

    // Parallax calculation relative to window center
    const winCenterX = window.innerWidth / 2;
    const winCenterY = window.innerHeight / 2;
    const normX = (e.clientX - winCenterX) / winCenterX;
    const normY = (e.clientY - winCenterY) / winCenterY;

    targetParallaxX = -normX * PARALLAX_MAX_OFFSET;
    targetParallaxY = -normY * (PARALLAX_MAX_OFFSET * 0.7);

    // Portrait mask calculation
    if (!portraitContainer) return;
    stageRect = portraitContainer.getBoundingClientRect();

    const relX = e.clientX - stageRect.left;
    const relY = e.clientY - stageRect.top;

    const margin = 40;
    const isInside = relX >= -margin && relX <= stageRect.width + margin && relY >= -margin && relY <= stageRect.height + margin;
    isHovering = isInside;

    if (isInside) {
      targetX = Math.max(0, Math.min(stageRect.width, relX));
      targetY = Math.max(0, Math.min(stageRect.height, relY));
    }
  }

  function onPointerLeave() {
    isHovering = false;
    isHolding = false;
    targetParallaxX = 0;
    targetParallaxY = 0;
  }

  function onMouseDown(e) {
    if (isHovering && e.button === 0) {
      isHolding = true;
    }
  }

  function onMouseUp() {
    isHolding = false;
  }

  // --- Dedicated Mobile Touch & Gesture Handlers ---
  let touchHoldTimer = null;

  function updateTouchCoords(touch) {
    if (!portraitContainer || !touch) return;
    stageRect = portraitContainer.getBoundingClientRect();
    const relX = touch.clientX - stageRect.left;
    const relY = touch.clientY - stageRect.top;
    targetX = Math.max(0, Math.min(stageRect.width, relX));
    targetY = Math.max(0, Math.min(stageRect.height, relY));
  }

  function onTouchStart(e) {
    if (!e.touches || !e.touches.length) return;
    isTouchActive = true;
    isHovering = true;
    updateTouchCoords(e.touches[0]);

    // Start long-press detection for full robot expansion
    if (touchHoldTimer) clearTimeout(touchHoldTimer);
    touchHoldTimer = setTimeout(() => {
      if (isTouchActive) {
        isHolding = true;
      }
    }, 240);
  }

  function onTouchMove(e) {
    if (!isTouchActive || !e.touches || !e.touches.length) return;
    // Prevent default scroll ONLY when actively dragging across the portrait
    if (e.cancelable) {
      e.preventDefault();
    }
    updateTouchCoords(e.touches[0]);
  }

  function onTouchEnd() {
    if (touchHoldTimer) clearTimeout(touchHoldTimer);
    isHolding = false;
    isTouchActive = false;
    // Smoothly decay hover state on touch release
    setTimeout(() => {
      if (!isTouchActive) {
        isHovering = false;
      }
    }, 380);
  }

  function onTouchCancel() {
    if (touchHoldTimer) clearTimeout(touchHoldTimer);
    isHolding = false;
    isTouchActive = false;
    isHovering = false;
  }

  // --- Device Orientation Parallax (Mobile Gyroscope) ---
  function onDeviceOrientation(e) {
    if (window.innerWidth > 768) return; // Only on mobile
    if (e.gamma !== null && e.beta !== null) {
      // Clamp tilt angles
      const tiltX = Math.max(-25, Math.min(25, e.gamma)); // Left/Right tilt (-90 to 90)
      const tiltY = Math.max(-25, Math.min(25, e.beta - 45)); // Forward/Back tilt relative to 45deg viewing
      targetParallaxX = (tiltX / 25) * -12;
      targetParallaxY = (tiltY / 25) * -8;
    }
  }

  // =========================================================================
  // 2. MOBILE MENU & NAVIGATION CONTROLLER
  // =========================================================================
  function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileNavOverlay) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileNavOverlay.classList.toggle('is-open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenuBtn.classList.toggle('is-active', isOpen);
        document.body.classList.toggle('nav-locked', isOpen);
      });

      mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileNavOverlay.classList.remove('is-open');
          mobileMenuBtn.classList.remove('is-active');
          mobileMenuBtn.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-locked');
        });
      });
    }
  }

  // =========================================================================
  // 3. SCROLL REVEALS & EDITORIAL STORYTELLING ENGINE
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
  // 4. INITIALIZATION
  // =========================================================================
  function init() {
    updateStageRect();

    window.addEventListener('resize', updateStageRect, { passive: true });
    window.addEventListener('orientationchange', () => {
      setTimeout(updateStageRect, 150);
    });

    // Desktop Pointer Events
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Mobile Dedicated Touch Events (Non-passive touchmove for gesture control)
    if (portraitContainer) {
      portraitContainer.addEventListener('touchstart', onTouchStart, { passive: true });
      portraitContainer.addEventListener('touchmove', onTouchMove, { passive: false });
      portraitContainer.addEventListener('touchend', onTouchEnd, { passive: true });
      portraitContainer.addEventListener('touchcancel', onTouchCancel, { passive: true });
    }

    // Optional Device Gyroscope Parallax
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    }

    requestAnimationFrame(heroAnimationLoop);

    initMobileNav();
    initScrollReveals();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
