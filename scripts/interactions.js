/* ============================================================
   FAR FUTURE SOCIETY — INTERACTIONS
   Lightweight scroll, reveal, and nav behaviour
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     NAV: Scroll-state class + hamburger toggle
  ---------------------------------------------------------- */
  const nav = document.getElementById('site-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks = document.getElementById('nav-links');

  function updateNav() {
    if (window.scrollY > 48) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
  ---------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ----------------------------------------------------------
     PILLAR CARDS — Subtle parallax tilt on hover (desktop)
  ---------------------------------------------------------- */
  if (window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) {
    document.querySelectorAll('.pillar-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'translateY(-3px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ----------------------------------------------------------
     TECHNARCH CARDS — Entrance stagger
  ---------------------------------------------------------- */
  const techCards = document.querySelectorAll('.technarch-card');
  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.index || 0) * 70;
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, delay);
            cardObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    techCards.forEach(function (card, i) {
      card.classList.add('reveal');
      card.dataset.index = i;
      cardObserver.observe(card);
    });
  }

  /* ----------------------------------------------------------
     SMOOTH ANCHOR SCROLL (accounting for fixed nav height)
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ----------------------------------------------------------
     DISCIPLINE TAGS — Active highlight on click
  ---------------------------------------------------------- */
  document.querySelectorAll('.discipline-tag').forEach(function (tag) {
    tag.addEventListener('click', function () {
      tag.style.borderColor = 'rgba(212,175,55,0.60)';
      tag.style.color = 'var(--gold-light)';
      setTimeout(function () {
        tag.style.borderColor = '';
        tag.style.color = '';
      }, 1200);
    });
  });

})();
