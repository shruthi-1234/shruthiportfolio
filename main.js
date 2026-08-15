/**
 * SHRUTHI SUNDAR — CINEMATIC EDITORIAL PORTFOLIO ENGINE
 * 
 * HERO INTERACTION ENGINE:
 * - Two 1:1 Aligned Layers: shruthi-human.png (Base) ↔ shruthi-robot.png (Top Reveal)
 * - Monumental typography positioned behind the dominant portrait
 * - Dynamic mouse parallax on the background name layer
 * - Soft organic feathered reveal mask (No rings, no circles, no outlines)
 * - Press & Hold progressive expansion to full robot reveal
 * - Mobile touch drag support
 * - Zero image translations, 100% static aligned assets
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. HERO REVEAL & PARALLAX CONFIGURATION
  // =========================================================================
  const NORMAL_REVEAL_RADIUS = 165;      // Normal hover reveal radius (px) -> ~330px diameter
  const HOLD_REVEAL_RADIUS = 980;        // Full expansion radius on press & hold (px)
  const LERP_POS = 0.14;                 // Smooth pointer follow inertia
  const LERP_RAD_ENTER = 0.12;           // Smooth radius expansion factor
  const LERP_RAD_HOLD = 0.055;           // Smooth progressive hold factor
  const LERP_RAD_LEAVE = 0.08;          // Smooth relaxation factor when leaving
  const PARALLAX_MAX_OFFSET = 16;        // Max parallax offset for background text (px)

  const portraitContainer = document.getElementById('heroPortraitContainer');
  const bgTextLayer = document.getElementById('heroBgTextLayer');

  // Tracking State
  let isHovering = false;
  let isHolding = false;
  
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
    }
  }

  // --- Main Animation Loop (60fps GPU Updates) ---
  function heroAnimationLoop() {
    // 1. Target Radius based on interaction state
    if (isHolding) {
      targetRadius = HOLD_REVEAL_RADIUS;
    } else if (isHovering) {
      targetRadius = NORMAL_REVEAL_RADIUS;
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
    } else if (isHovering) {
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

  // --- Pointer & Mouse Event Handlers ---
  function onPointerMove(e) {
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

    const margin = 50;
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
    if (isHovering) {
      isHolding = true;
    }
  }

  function onMouseUp() {
    isHolding = false;
  }

  // --- Touch Support (Mobile) ---
  let touchHoldTimer = null;

  function onTouchStart(e) {
    isHovering = true;
    handleTouch(e);

    touchHoldTimer = setTimeout(() => {
      isHolding = true;
    }, 280);
  }

  function onTouchMove(e) {
    handleTouch(e);
  }

  function onTouchEnd() {
    if (touchHoldTimer) clearTimeout(touchHoldTimer);
    isHolding = false;
    setTimeout(() => {
      isHovering = false;
    }, 350);
  }

  function handleTouch(e) {
    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch || !portraitContainer) return;
    stageRect = portraitContainer.getBoundingClientRect();
    targetX = Math.max(0, Math.min(stageRect.width, touch.clientX - stageRect.left));
    targetY = Math.max(0, Math.min(stageRect.height, touch.clientY - stageRect.top));
  }

  // =========================================================================
  // 2. SCROLL REVEALS & EDITORIAL STORYTELLING ENGINE
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
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
  // 3. INITIALIZATION
  // =========================================================================
  function init() {
    updateStageRect();

    window.addEventListener('resize', updateStageRect);
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support
    if (portraitContainer) {
      portraitContainer.addEventListener('touchstart', onTouchStart, { passive: true });
      portraitContainer.addEventListener('touchmove', onTouchMove, { passive: true });
      portraitContainer.addEventListener('touchend', onTouchEnd);
      portraitContainer.addEventListener('touchcancel', onTouchEnd);
    }

    requestAnimationFrame(heroAnimationLoop);

    initScrollReveals();
    initSmoothAnchors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
