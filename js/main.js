(function() {
  'use strict';

  // ========================================
  // Theme Toggle
  // ========================================
  
  const themeToggle = document.querySelector('.theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  function getTheme() {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return prefersDark.matches ? 'dark' : 'light';
  }
  
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0c0a09' : '#fafaf9');
    }
  }
  
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  prefersDark.addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ========================================
  // Mobile Navigation
  // ========================================
  
  const menuBtn = document.querySelector('.header__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');
  const menuIconOpen = document.querySelector('.header__menu-icon--open');
  const menuIconClose = document.querySelector('.header__menu-icon--close');
  
  function openMobileNav() {
    mobileNav.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    if (menuIconOpen) menuIconOpen.style.display = 'none';
    if (menuIconClose) menuIconClose.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }
  
  function closeMobileNav() {
    mobileNav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    if (menuIconOpen) menuIconOpen.style.display = 'block';
    if (menuIconClose) menuIconClose.style.display = 'none';
    document.body.style.overflow = '';
  }
  
  function toggleMobileNav() {
    const isOpen = mobileNav.classList.contains('is-open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }
  
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', toggleMobileNav);
    
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', closeMobileNav);
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMobileNav();
      }
    });
  }

  // ========================================
  // Scroll Animations (Intersection Observer)
  // ========================================
  
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if ('IntersectionObserver' in window && fadeElements.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    fadeElements.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }

  // ========================================
  // Smooth Scroll for anchor links (fallback)
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  var heroSection = document.querySelector('.hero');

  // ========================================
  // Hero Number Counter
  // ========================================

  function startHeroCounter(el) {
    if (!el) return;
    var target = parseInt(el.getAttribute('data-target'), 10);
    var duration = 1400;
    var startTime = null;

    function tick(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    el.textContent = '0';
    requestAnimationFrame(tick);
  }

  // ========================================
  // Hero Typewriter
  // ========================================

  var typewriterEl = document.querySelector('.hero__typewriter');
  var heroCursorEl = document.querySelector('.hero__cursor');
  var heroAccentEl = document.querySelector('.hero__title-accent--anim');
  var heroSubtitleEl = document.querySelector('.hero .hero__subtitle');
  var heroCtaEl = document.querySelector('.hero .hero__cta');

  function revealHeroContent() {
    if (heroAccentEl) {
      var counterEl = heroAccentEl.querySelector('.hero__count');
      if (counterEl) counterEl.textContent = '0';
      heroAccentEl.classList.add('is-visible');
      if (counterEl) startHeroCounter(counterEl);
    }
    setTimeout(function() {
      if (heroSubtitleEl) heroSubtitleEl.classList.add('is-visible');
    }, 350);
    setTimeout(function() {
      if (heroCtaEl) heroCtaEl.classList.add('is-visible');
    }, 550);
  }

  if (typewriterEl) {
    var textToType = typewriterEl.getAttribute('data-text') || '';
    var charIndex = 0;

    function typeNextChar() {
      if (charIndex < textToType.length) {
        typewriterEl.textContent += textToType[charIndex];
        charIndex++;
        setTimeout(typeNextChar, 42);
      } else {
        if (heroCursorEl) heroCursorEl.style.display = 'none';
        revealHeroContent();
      }
    }

    setTimeout(typeNextChar, 250);
  } else {
    revealHeroContent();
  }

  // ========================================
  // Logo Stardust Effect
  // Canvas + path sampling + particle loop: all devices.
  // Reveal burst fires on animationend for each path (mobile too).
  // Continuous mouse effect: desktop only.
  // ========================================

  var ptWmSvg   = document.querySelector('.hero__watermark svg');
  var ptWmPaths = ptWmSvg ? Array.from(ptWmSvg.querySelectorAll('.wm-path')) : [];

  if (heroSection && ptWmSvg && ptWmPaths.length) {

    // --- Canvas setup (all devices) ---
    var ptCanvas = document.createElement('canvas');
    ptCanvas.setAttribute('aria-hidden', 'true');
    ptCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
    heroSection.appendChild(ptCanvas);
    var ptCtx = ptCanvas.getContext('2d');

    function ptResize() {
      var dpr = window.devicePixelRatio || 1;
      var w   = heroSection.offsetWidth;
      var h   = heroSection.offsetHeight;
      ptCanvas.width        = w * dpr;
      ptCanvas.height       = h * dpr;
      ptCanvas.style.width  = w + 'px';
      ptCanvas.style.height = h + 'px';
      ptCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    ptResize();

    // --- Per-path data ---
    // ptRawPaths : SVG-space points computed ONCE (getPointAtLength is expensive)
    // ptPathData : screen-space samples, rebuilt cheaply on resize via ptApplyCTM()
    var ptRawPaths    = []; // [{totalLen, svgPts:[{x,y,lenAt,pathIdx}]}]
    var ptPathData    = []; // [{path, totalLen, samples:[{x,y,lenAt,pathIdx}]}]
    var ptSampled     = []; // flat screen-space array for O(n) nearest search
    var ptCTM         = null; // cached CTM — updated on resize, reused in find-nearest
    var ptResizeTimer = null;
    var ptSvgPt       = ptWmSvg.createSVGPoint(); // reusable SVG point

    // Called ONCE: does all getPointAtLength() work and caches SVG-space coords
    function ptPrecompute() {
      ptRawPaths = [];
      ptWmPaths.forEach(function(path, pathIdx) {
        var totalLen = path.getTotalLength();
        var count    = Math.max(80, Math.round(totalLen * 1.2));
        var svgPts   = [];
        for (var i = 0; i <= count; i++) {
          var lenAt = (i / count) * totalLen;
          var p     = path.getPointAtLength(lenAt);
          svgPts.push({ x: p.x, y: p.y, lenAt: lenAt, pathIdx: pathIdx });
        }
        ptRawPaths.push({ totalLen: totalLen, svgPts: svgPts });
      });
    }

    // Called on init + resize: applies CTM to cached SVG-space points (no DOM path calls).
    // Stores canvas-local (element-relative) coordinates so the effect is scroll-invariant.
    function ptApplyCTM() {
      ptCTM = ptWmSvg.getScreenCTM();
      if (!ptCTM) return;
      var heroRect = heroSection.getBoundingClientRect();
      ptPathData = [];
      ptSampled  = [];
      ptRawPaths.forEach(function(raw, pathIdx) {
        var samples = [];
        raw.svgPts.forEach(function(sp) {
          ptSvgPt.x = sp.x; ptSvgPt.y = sp.y;
          var sc    = ptSvgPt.matrixTransform(ptCTM);
          // Subtract hero's current viewport offset → canvas-local coords (scroll-invariant)
          var entry = { x: sc.x - heroRect.left, y: sc.y - heroRect.top, lenAt: sp.lenAt, pathIdx: pathIdx };
          samples.push(entry);
          ptSampled.push(entry);
        });
        ptPathData.push({ path: ptWmPaths[pathIdx], totalLen: raw.totalLen, samples: samples });
      });
    }

    ptPrecompute(); // expensive, one-time
    ptApplyCTM();   // fast, repeated on resize

    if (window.ResizeObserver) {
      new ResizeObserver(function() {
        ptResize();
        clearTimeout(ptResizeTimer);
        ptResizeTimer = setTimeout(ptApplyCTM, 150); // cheap: no getPointAtLength calls
      }).observe(heroSection);
    } else {
      window.addEventListener('resize', function() {
        ptResize();
        clearTimeout(ptResizeTimer);
        ptResizeTimer = setTimeout(ptApplyCTM, 150);
      });
    }

    // --- Particle pool (all devices) ---
    var ptParticles  = [];
    var PT_THRESHOLD = 300;
    var PT_MAX       = 200;

    function ptMakeParticle(ox, oy, speed, life) {
      var angle = Math.random() * 6.2832;
      return {
        x: ox, y: oy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: life, maxLife: life,
        size:  0.8 + Math.random() * 2.0,
        phase: Math.random() * 6.2832
      };
    }

    // Continuous spawn driven by mouse proximity (desktop)
    // Samples are already canvas-local, no rect subtraction needed.
    function ptSpawn(intensity, pd) {
      var count = Math.round(intensity * 2.5);
      if (count < 1 || ptParticles.length >= PT_MAX) return;
      var samps = pd.samples;
      for (var i = 0; i < count; i++) {
        if (ptParticles.length >= PT_MAX) break;
        var origin = samps[Math.floor(Math.random() * samps.length)];
        var ox     = origin.x + (Math.random() - 0.5) * 14;
        var oy     = origin.y + (Math.random() - 0.5) * 14;
        var speed  = (0.4 + Math.random() * 1.8) * (0.5 + intensity * 0.8);
        ptParticles.push(ptMakeParticle(ox, oy, speed, Math.round(35 + Math.random() * 45)));
      }
    }

    // Controls whether the initial page-load reveal fires stardust bursts
    var PT_BURST_ON_REVEAL = false;

    // One-shot burst for a single path (used by reveal and periodic loop)
    function ptRevealBurst(pathIdx) {
      var pd = ptPathData[pathIdx];
      if (!pd) return;
      var samps = pd.samples;
      var count = Math.min(Math.round(14 + pd.totalLen * 0.11), 26);
      for (var i = 0; i < count; i++) {
        if (ptParticles.length >= PT_MAX) break;
        var origin = samps[Math.floor(Math.random() * samps.length)];
        var ox     = origin.x + (Math.random() - 0.5) * 14;
        var oy     = origin.y + (Math.random() - 0.5) * 14;
        var speed  = 0.5 + Math.random() * 2.4;
        ptParticles.push(ptMakeParticle(ox, oy, speed, Math.round(120 + Math.random() * 80)));
      }
    }

    // Listen for each path's wmDraw animation starting (syncs with the trace reveal)
    if (PT_BURST_ON_REVEAL) {
      ptWmPaths.forEach(function(path, pathIdx) {
        path.addEventListener('animationstart', function(e) {
          if (e.animationName === 'wmDraw') ptRevealBurst(pathIdx);
        });
      });
    }


    // --- Mouse state (set by desktop block below, read by ptLoop) ---
    var ptMouseX      = -9999;
    var ptMouseY      = -9999;
    var ptNearest     = null;
    var ptNearestDist = Infinity;

    // --- Click-activated glow state ---
    // Activated on click, pulses slowly then fades out over ~3 s
    var ptGlow = null; // { pathIdx, energy, phase }

    // --- rAF render loop (all devices) ---
    function ptLoop() {
      ptCtx.clearRect(0, 0, ptCanvas.width, ptCanvas.height);

      // Click-activated path glow: pulses and fades until energy is exhausted
      if (ptGlow && ptGlow.energy > 0.01) {
        ptGlow.phase  += 0.04;                        // ~1.5 s per pulse cycle
        ptGlow.energy *= 0.988;                       // slow exponential fade (~3 s to near-zero)
        var pulse     = 0.55 + 0.45 * Math.abs(Math.sin(ptGlow.phase));
        var gIntensity = ptGlow.energy * pulse;
        var pd    = ptPathData[ptGlow.pathIdx];
        var samps = pd ? pd.samples : [];

        ptCtx.save();
        ptCtx.shadowColor = '#fcd34d';
        ptCtx.shadowBlur  = 4 + gIntensity * 18;
        ptCtx.strokeStyle = 'rgba(252,211,77,' + (gIntensity * 0.65).toFixed(3) + ')';
        ptCtx.lineWidth   = 0.5 + gIntensity * 1.5;
        ptCtx.lineCap     = 'round';
        ptCtx.lineJoin    = 'round';
        ptCtx.beginPath();
        for (var si = 0; si < samps.length; si++) {
          if (si === 0) ptCtx.moveTo(samps[si].x, samps[si].y);
          else          ptCtx.lineTo(samps[si].x, samps[si].y);
        }
        ptCtx.stroke();
        ptCtx.restore();
      }

      // Draw + update stardust particles (all devices)
      ptCtx.save();
      ptCtx.shadowColor = '#fde68a';
      ptCtx.shadowBlur  = 6;

      for (var i = ptParticles.length - 1; i >= 0; i--) {
        var p = ptParticles[i];
        p.vx *= 0.97; p.vy *= 0.97; p.vy += 0.025;
        p.x  += p.vx; p.y  += p.vy; p.life--;
        if (p.life <= 0) { ptParticles.splice(i, 1); continue; }

        var lifeFrac = p.life / p.maxLife;
        var twinkle  = 0.55 + 0.45 * Math.abs(Math.sin(p.life * 0.45 + p.phase));
        var alpha    = lifeFrac * twinkle;
        var r        = p.size * (0.4 + lifeFrac * 0.6);

        ptCtx.globalAlpha = alpha * 0.9;
        ptCtx.strokeStyle = '#fde68a';
        ptCtx.lineWidth   = Math.max(r * 0.5, 0.4);
        ptCtx.beginPath();
        ptCtx.moveTo(p.x - r, p.y); ptCtx.lineTo(p.x + r, p.y);
        ptCtx.moveTo(p.x, p.y - r); ptCtx.lineTo(p.x, p.y + r);
        ptCtx.stroke();

        ptCtx.globalAlpha = alpha;
        ptCtx.fillStyle   = '#ffffff';
        ptCtx.beginPath();
        ptCtx.arc(p.x, p.y, Math.max(r * 0.35, 0.3), 0, 6.2832);
        ptCtx.fill();
      }
      ptCtx.restore();
      requestAnimationFrame(ptLoop);
    }

    requestAnimationFrame(ptLoop);

    // --- Desktop-only: continuous mouse interaction ---
    var ptDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (ptDesktop) {

      // Nearest search runs entirely on pre-cached screen-space samples —
      // zero getPointAtLength() or getScreenCTM() calls per mousemove.
      function ptFindNearest() {
        var best = null, bestD2 = Infinity;
        for (var i = 0; i < ptSampled.length; i++) {
          var s  = ptSampled[i];
          var dx = s.x - ptMouseX, dy = s.y - ptMouseY;
          var d2 = dx * dx + dy * dy;
          if (d2 < bestD2) { bestD2 = d2; best = s; }
        }
        ptNearest     = best;
        ptNearestDist = best ? Math.sqrt(bestD2) : Infinity;
      }

      heroSection.addEventListener('mousemove', function(e) {
        var r = heroSection.getBoundingClientRect();
        ptMouseX = e.clientX - r.left;
        ptMouseY = e.clientY - r.top;
        ptFindNearest();
      });

      heroSection.addEventListener('mouseleave', function() {
        ptMouseX = -9999; ptMouseY = -9999;
        ptNearest = null; ptNearestDist = Infinity;
      });

      // Click near a path: fire stardust burst and start a pulsing glow that fades out.
      // Extra guard: bail out on touch/coarse-pointer devices (e.g. hybrid tablets).
      heroSection.addEventListener('click', function(e) {
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (ptNearest && ptNearestDist < PT_THRESHOLD) {
          var idx = ptNearest.pathIdx;
          ptRevealBurst(idx);
          ptGlow = { pathIdx: idx, energy: 1.0, phase: 0 };
        }
      });
    }
  }

})();
