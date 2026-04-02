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
  // Eye of the Fox Effect
  // All initialisation is deferred until the user first clicks the eye
  // path (wm-path--8). Nothing runs at page load.
  // ========================================

  var ptWmSvg   = document.querySelector('.hero__watermark svg');
  var ptWmPaths = ptWmSvg ? Array.from(ptWmSvg.querySelectorAll('.wm-path')) : [];

  if (heroSection && ptWmSvg && ptWmPaths.length) {

    // --- State (all null/empty until ptLazyInit fires) ---
    var ptCanvas      = null;
    var ptCtx         = null;
    var ptInitialized = false;
    var ptRafActive   = false;
    var ptRawPaths    = [];
    var ptPathData    = [];
    var ptAllSamples  = []; // flat canvas-local array of ALL path points — burst origin pool
    var ptLogoBBox    = { cx: 0, cy: 0, halfDiag: 100 }; // computed after CTM, used to size rings
    var ptLogW        = 0;  // logical canvas width (CSS px) — cached for rAF loop, no DOM reads
    var ptLogH        = 0;  // logical canvas height (CSS px) — cached for rAF loop, no DOM reads
    var ptResizeTimer = null;
    var ptParticles   = [];
    // Reusable SVG point — createSVGPoint is cheap and needed for hit-testing too
    var ptSvgPt       = ptWmSvg.createSVGPoint();

    var PT_EYE_IDX       = 5;   // wm-path--6 (0-based) — the almond-shaped eye
    var PT_EYE_THRESHOLD = 28;  // px, screen space
    var PT_MAX           = 100; // hard cap; oldest particles are culled first when exceeded

    // --- Canvas resize ---
    function ptResize() {
      var dpr = window.devicePixelRatio || 1;
      var w   = heroSection.offsetWidth;
      var h   = heroSection.offsetHeight;
      ptCanvas.width        = w * dpr;
      ptCanvas.height       = h * dpr;
      ptCanvas.style.width  = w + 'px';
      ptCanvas.style.height = h + 'px';
      ptCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Cache logical size — the rAF loop reads these instead of touching the DOM
      ptLogW = w;
      ptLogH = h;
    }

    // --- Precompute SVG-space samples (expensive, runs once) ---
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

    // --- Apply CTM: maps cached SVG-space points → canvas-local coords (cheap) ---
    // Also rebuilds ptAllSamples (burst origin pool) and ptLogoBBox in one pass.
    function ptApplyCTM() {
      var ctm = ptWmSvg.getScreenCTM();
      if (!ctm) return;
      var heroRect = heroSection.getBoundingClientRect();
      ptPathData   = [];
      ptAllSamples = [];
      var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      ptRawPaths.forEach(function(raw, pathIdx) {
        var samples = [];
        raw.svgPts.forEach(function(sp) {
          ptSvgPt.x = sp.x; ptSvgPt.y = sp.y;
          var sc = ptSvgPt.matrixTransform(ctm);
          var x  = sc.x - heroRect.left;
          var y  = sc.y - heroRect.top;
          var entry = { x: x, y: y, lenAt: sp.lenAt, pathIdx: pathIdx };
          samples.push(entry);
          ptAllSamples.push(entry);
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        });
        ptPathData.push({ path: ptWmPaths[pathIdx], totalLen: raw.totalLen, samples: samples });
      });
      // Logo bounding box — used to scale rings to cover the whole logo
      var bw = maxX - minX, bh = maxY - minY;
      ptLogoBBox = {
        cx: (minX + maxX) / 2,
        cy: (minY + maxY) / 2,
        halfDiag: Math.sqrt(bw * bw + bh * bh) / 2
      };
    }

    // --- Lazy init: canvas + full precompute, wired once on first eye click ---
    function ptLazyInit() {
      if (ptInitialized) return;
      ptInitialized = true;

      ptCanvas = document.createElement('canvas');
      ptCanvas.setAttribute('aria-hidden', 'true');
      ptCanvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;';
      heroSection.appendChild(ptCanvas);
      ptCtx = ptCanvas.getContext('2d');
      ptResize();

      ptPrecompute();
      ptApplyCTM();

      if (window.ResizeObserver) {
        new ResizeObserver(function() {
          ptResize();
          clearTimeout(ptResizeTimer);
          ptResizeTimer = setTimeout(ptApplyCTM, 150);
        }).observe(heroSection);
      } else {
        window.addEventListener('resize', function() {
          ptResize();
          clearTimeout(ptResizeTimer);
          ptResizeTimer = setTimeout(ptApplyCTM, 150);
        });
      }
    }

    // --- Eye hit test ---
    // Before init: 24 on-demand getPointAtLength samples on the eye path only.
    // After init:  uses pre-cached canvas-local coords (zero DOM calls).
    function ptHitTestEye(clientX, clientY) {
      var eyePath = ptWmPaths[PT_EYE_IDX];
      if (!eyePath) return false;
      var t2 = PT_EYE_THRESHOLD * PT_EYE_THRESHOLD;

      if (ptInitialized && ptPathData[PT_EYE_IDX]) {
        var heroRect = heroSection.getBoundingClientRect();
        var cx = clientX - heroRect.left;
        var cy = clientY - heroRect.top;
        var samps = ptPathData[PT_EYE_IDX].samples;
        for (var i = 0; i < samps.length; i++) {
          var dx = samps[i].x - cx, dy = samps[i].y - cy;
          if (dx * dx + dy * dy < t2) return true;
        }
        return false;
      }

      // Pre-init path: on-demand sample (24 pts) — only runs on click, not on load
      var ctm = ptWmSvg.getScreenCTM();
      if (!ctm) return false;
      var totalLen = eyePath.getTotalLength();
      for (var i = 0; i <= 24; i++) {
        var p = eyePath.getPointAtLength((i / 24) * totalLen);
        ptSvgPt.x = p.x; ptSvgPt.y = p.y;
        var sc = ptSvgPt.matrixTransform(ctm);
        var dx = sc.x - clientX, dy = sc.y - clientY;
        if (dx * dx + dy * dy < t2) return true;
      }
      return false;
    }

    // --- Eye centroid in canvas-local coords ---
    function ptEyeCenter() {
      var samps = ptPathData[PT_EYE_IDX] ? ptPathData[PT_EYE_IDX].samples : [];
      if (!samps.length) return { x: 0, y: 0 };
      var sx = 0, sy = 0;
      for (var i = 0; i < samps.length; i++) { sx += samps[i].x; sy += samps[i].y; }
      return { x: sx / samps.length, y: sy / samps.length };
    }

    // --- rAF render loop: self-stops when the particle pool is empty ---
    // Zero DOM reads inside: all values are pre-cached (ptLogW/H, p.hsl, p.rgbaFn).
    function ptLoop() {
      ptCtx.clearRect(0, 0, ptLogW, ptLogH);
      var alive = false;

      // Pass 1: expanding rings
      for (var i = ptParticles.length - 1; i >= 0; i--) {
        var p = ptParticles[i];
        if (p.type !== 'r') continue;
        p.r += p.dr;
        p.life--;
        if (p.life <= 0 || p.r >= p.maxR) { ptParticles.splice(i, 1); continue; }
        alive = true;
        var lf    = p.life / p.maxLife;
        var alpha = lf * (1 - p.r / p.maxR) * 0.85;
        ptCtx.save();
        ptCtx.globalAlpha = alpha;
        ptCtx.shadowColor = p.shadowColor;
        ptCtx.shadowBlur  = 20 * lf;
        ptCtx.strokeStyle = p.strokeColor;
        ptCtx.lineWidth   = 1.5 + lf * 2.5;
        ptCtx.beginPath();
        ptCtx.arc(p.cx, p.cy, p.r, 0, 6.2832);
        ptCtx.stroke();
        ptCtx.restore();
      }

      // Pass 2: shooting comets with colored trails
      for (var i = ptParticles.length - 1; i >= 0; i--) {
        var p = ptParticles[i];
        if (p.type !== 'c') continue;
        p.px = p.x; p.py = p.y;
        p.vx *= 0.91; p.vy *= 0.91; p.vy += 0.12;
        p.x  += p.vx; p.y  += p.vy; p.life--;
        if (p.life <= 0) { ptParticles.splice(i, 1); continue; }
        alive = true;
        var lf    = p.life / p.maxLife;
        var alpha = Math.pow(lf, 0.6);
        ptCtx.save();
        ptCtx.globalAlpha = alpha;
        ptCtx.shadowColor = p.hsl; // pre-computed string, no allocation per frame
        ptCtx.shadowBlur  = 12 + p.size * 3;
        ptCtx.strokeStyle = p.hsl;
        ptCtx.lineWidth   = p.size * 0.9 * lf;
        ptCtx.lineCap     = 'round';
        ptCtx.beginPath();
        ptCtx.moveTo(p.px, p.py);
        ptCtx.lineTo(p.x,  p.y);
        ptCtx.stroke();
        ptCtx.globalAlpha = alpha * 0.95;
        ptCtx.fillStyle   = '#ffffff';
        ptCtx.shadowBlur  = 8;
        ptCtx.beginPath();
        ptCtx.arc(p.x, p.y, Math.max(p.size * 0.55 * lf, 0.5), 0, 6.2832);
        ptCtx.fill();
        ptCtx.restore();
      }

      // Pass 3: gold-amber twinkling sparks
      ptCtx.save();
      for (var i = ptParticles.length - 1; i >= 0; i--) {
        var p = ptParticles[i];
        if (p.type !== 's') continue;
        p.vx *= 0.94; p.vy *= 0.94; p.vy += 0.06;
        p.x  += p.vx; p.y  += p.vy; p.life--;
        if (p.life <= 0) { ptParticles.splice(i, 1); continue; }
        alive = true;
        var lf      = p.life / p.maxLife;
        var twinkle = 0.55 + 0.45 * Math.abs(Math.sin(p.life * 0.45 + p.phase));
        var alpha   = lf * twinkle;
        var r       = p.size * (0.4 + lf * 0.6);
        ptCtx.shadowColor = p.hsl; // pre-computed string, no allocation per frame
        ptCtx.shadowBlur  = 8;
        ptCtx.globalAlpha = alpha * 0.9;
        ptCtx.strokeStyle = p.hsl;
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

      if (alive) {
        requestAnimationFrame(ptLoop);
      } else {
        ptRafActive = false;
      }
    }

    function ptEnsureRaf() {
      if (!ptRafActive) {
        ptRafActive = true;
        requestAnimationFrame(ptLoop);
      }
    }

    // --- Oldest-first particle culling to enforce PT_MAX ---
    function ptCullToMax(adding) {
      var excess = ptParticles.length + adding - PT_MAX;
      if (excess > 0) ptParticles.splice(0, excess);
    }

    // --- Eye of the Fox burst ---
    // Rings centre on the eye; comets and sparks originate from the full logo outline.
    function ptEyeBurst(cx, cy) {
      var NEW_COUNT = 3 + 10 + 50;
      ptCullToMax(NEW_COUNT);

      // 3 expanding golden rings scaled to the full logo bounding box
      var halfDiag = ptLogoBBox.halfDiag || 100;
      for (var ri = 0; ri < 3; ri++) {
        ptParticles.push({
          type: 'r',
          cx: cx, cy: cy,
          r: 5, dr: 8 + ri * 4,
          maxR: halfDiag * (0.85 + ri * 0.35),
          life: 20 + ri * 5, maxLife: 20 + ri * 5,
          // Pre-computed color strings — no string allocation inside the loop
          shadowColor: 'rgba(255,210,80,1)',
          strokeColor: 'rgba(255,220,100,1)'
        });
      }

      // 10 spectrum comets — spawn from random logo path points, shoot outward from eye
      var totalSamples = ptAllSamples.length || 1;
      for (var ci = 0; ci < 10; ci++) {
        var origin = ptAllSamples[Math.floor(Math.random() * totalSamples)];
        var ox = origin.x + (Math.random() - 0.5) * 14;
        var oy = origin.y + (Math.random() - 0.5) * 14;
        var dx = ox - cx, dy = oy - cy;
        var dist  = Math.sqrt(dx * dx + dy * dy) || 1;
        var speed = 14 + Math.random() * 10;
        var hue   = (ci * 36) % 360;
        ptParticles.push({
          type: 'c',
          x: ox, y: oy, px: ox, py: oy,
          vx: (dx / dist) * speed * (0.7 + Math.random() * 0.6),
          vy: (dy / dist) * speed * (0.7 + Math.random() * 0.6),
          hue: hue,
          hsl: 'hsl(' + hue + ',100%,70%)', // pre-computed — read directly in ptLoop
          life: 18 + Math.round(Math.random() * 12),
          maxLife: 30,
          size: 2.5 + Math.random() * 2
        });
      }

      // 50 gold-amber sparks — spawn from random logo path points, drift outward
      for (var si = 0; si < 50; si++) {
        var origin = ptAllSamples[Math.floor(Math.random() * totalSamples)];
        var ox = origin.x + (Math.random() - 0.5) * 10;
        var oy = origin.y + (Math.random() - 0.5) * 10;
        var dx = ox - cx, dy = oy - cy;
        var dist  = Math.sqrt(dx * dx + dy * dy) || 1;
        var speed = 3 + Math.random() * 7;
        var hue   = 30 + Math.random() * 30;
        ptParticles.push({
          type: 's',
          x: ox, y: oy,
          vx: (dx / dist) * speed * (0.5 + Math.random() * 0.5),
          vy: (dy / dist) * speed * (0.5 + Math.random() * 0.5) - 1,
          life: 35 + Math.round(Math.random() * 20),
          maxLife: 55,
          size: 0.9 + Math.random() * 2.2,
          phase: Math.random() * 6.2832,
          hue: hue,
          hsl: 'hsl(' + hue + ',100%,75%)' // pre-computed — read directly in ptLoop
        });
      }

      ptEnsureRaf();
    }

    // --- Single click handler: eye-only, lazy-init on first hit ---
    heroSection.addEventListener('click', function(e) {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      if (!ptHitTestEye(e.clientX, e.clientY)) return;
      ptLazyInit();
      var center = ptEyeCenter();
      ptEyeBurst(center.x, center.y);
    });
  }

})();
