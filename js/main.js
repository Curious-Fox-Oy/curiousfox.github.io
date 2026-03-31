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

})();
