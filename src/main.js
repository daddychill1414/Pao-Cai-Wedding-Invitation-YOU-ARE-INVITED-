/* ═══════════════════════════════════════════════════════════
   PAO & CAI — WEDDING INVITATION
   Main Application Logic
   ═══════════════════════════════════════════════════════════ */

import './style.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ─── STATE ─── */
const state = {
  currentScreen: 'envelope',
  lightboxOpen: false,
  lightboxIndex: 0,
  galleryImages: [],
  mobileNavOpen: false,
};

/* ─── DOM READY ─── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initEnvelopeFlow();
  initNavigation();
  initGallery();
  initLightbox();
  initScrollReveal();
  initHeroParallax();
  checkReturnVisitor();
});

/* ═══════════════════════════════════════════════════════════
   FLOATING PARTICLES
   ═══════════════════════════════════════════════════════════ */
function initParticles() {
  const container = document.getElementById('particles-container');
  if (!container) return;

  const particleCount = window.innerWidth < 768 ? 12 : 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 15;
    const hue = 30 + Math.random() * 20; // warm earth tones

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: hsla(${hue}, 30%, 65%, 0.4);
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(particle);
  }
}

/* ═══════════════════════════════════════════════════════════
   ENVELOPE / INVITATION FLOW
   ═══════════════════════════════════════════════════════════ */
function initEnvelopeFlow() {
  const openBtn = document.getElementById('open-envelope-btn');
  const acceptBtn = document.getElementById('accept-btn');
  const declineBtn = document.getElementById('decline-btn');
  const exploreBtn = document.getElementById('explore-btn');
  const exploreAnywayBtn = document.getElementById('explore-anyway-btn');

  if (openBtn) {
    openBtn.addEventListener('click', openEnvelope);
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => handleRSVP('accept'));
  }

  if (declineBtn) {
    declineBtn.addEventListener('click', () => handleRSVP('decline'));
  }

  if (exploreBtn) {
    exploreBtn.addEventListener('click', transitionToWebsite);
  }

  if (exploreAnywayBtn) {
    exploreAnywayBtn.addEventListener('click', transitionToWebsite);
  }

  // Add body class for no-scroll during invitation
  document.body.classList.add('no-scroll');
}

function openEnvelope() {
  const envelope = document.querySelector('.envelope');
  const envelopeScreen = document.getElementById('envelope-screen');
  const rsvpScreen = document.getElementById('rsvp-screen');

  if (!envelopeScreen || !rsvpScreen) return;

  if (envelope) {
    envelope.classList.add('opened');
  }

  // Smooth transition to RSVP screen
  switchScreen(envelopeScreen, rsvpScreen);
  state.currentScreen = 'rsvp';
}

function handleRSVP(choice) {
  const rsvpScreen = document.getElementById('rsvp-screen');

  if (choice === 'accept') {
    const acceptanceScreen = document.getElementById('acceptance-screen');
    if (rsvpScreen && acceptanceScreen) {
      switchScreen(rsvpScreen, acceptanceScreen);
      state.currentScreen = 'acceptance';

      // Trigger check animation
      setTimeout(() => {
        acceptanceScreen.classList.add('acceptance-screen-active');
      }, 300);

      // Animate elements
      const elements = acceptanceScreen.querySelectorAll('.acceptance-icon, .acceptance-overline, .acceptance-title, .acceptance-divider, .acceptance-couple, .acceptance-date, .acceptance-venue, .btn-invitation');
      elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.3 + i * 0.12,
          ease: 'power3.out',
        });
      });
    }
  } else {
    const declineScreen = document.getElementById('decline-screen');
    if (rsvpScreen && declineScreen) {
      switchScreen(rsvpScreen, declineScreen);
      state.currentScreen = 'decline';

      const elements = declineScreen.querySelectorAll('.decline-ornament, .decline-title, .decline-text, .decline-couple, .btn-invitation');
      elements.forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2 + i * 0.12,
          ease: 'power3.out',
        });
      });
    }
  }
}

function switchScreen(fromScreen, toScreen) {
  fromScreen.classList.remove('active');
  setTimeout(() => {
    toScreen.classList.add('active');
  }, 400);
}

function transitionToWebsite() {
  const invExperience = document.getElementById('invitation-experience');
  const weddingWebsite = document.getElementById('wedding-website');

  if (!invExperience || !weddingWebsite) return;

  // Store that user has seen invitation
  try {
    localStorage.setItem('pao-cai-visited', 'true');
  } catch (e) {
    // localStorage not available
  }

  // Fade out invitation
  gsap.to(invExperience, {
    opacity: 0,
    duration: 0.8,
    ease: 'power2.inOut',
    onComplete: () => {
      invExperience.classList.remove('active');
      invExperience.style.display = 'none';
      weddingWebsite.classList.add('active');
      document.body.classList.remove('no-scroll');

      // Animate website entrance
      animateWebsiteEntrance();

      // Refresh ScrollTrigger
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    },
  });
}

function animateWebsiteEntrance() {
  const nav = document.getElementById('main-nav');
  const heroContent = document.querySelector('.hero-content');

  if (nav) {
    gsap.from(nav, {
      y: -60,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });
  }

  if (heroContent) {
    const children = heroContent.querySelectorAll('.reveal-up');
    children.forEach((child, i) => {
      gsap.fromTo(child,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5 + i * 0.15,
          ease: 'power3.out',
        }
      );
    });
  }

  // Animate scroll indicator
  const scrollIndicator = document.querySelector('.hero-scroll-indicator');
  if (scrollIndicator) {
    gsap.fromTo(scrollIndicator,
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 1.8, ease: 'power2.out' }
    );
  }
}

/* ─── Return Visitor Shortcut ─── */
function checkReturnVisitor() {
  try {
    const visited = localStorage.getItem('pao-cai-visited');
    if (visited === 'true') {
      // Skip to website but keep invitation as an option
      // We still show the invitation by default for the experience
      // but add a "skip" capability
      addSkipButton();
    }
  } catch (e) {
    // localStorage not available
  }
}

function addSkipButton() {
  const envelopeScreen = document.getElementById('envelope-screen');
  if (!envelopeScreen) return;

  const skipBtn = document.createElement('button');
  skipBtn.className = 'btn-skip';
  skipBtn.innerHTML = 'Skip to Wedding Details →';
  skipBtn.style.cssText = `
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    font-family: var(--font-body);
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--color-text-light);
    background: rgba(240, 234, 224, 0.8);
    backdrop-filter: blur(10px);
    padding: 0.6rem 1.2rem;
    border-radius: 9999px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    z-index: 50;
    transition: all 0.3s ease;
    opacity: 0;
    animation: fadeIn 1s ease 1.5s forwards;
  `;

  skipBtn.addEventListener('mouseenter', () => {
    skipBtn.style.color = 'var(--color-espresso)';
    skipBtn.style.borderColor = 'var(--color-champagne)';
  });

  skipBtn.addEventListener('mouseleave', () => {
    skipBtn.style.color = 'var(--color-text-light)';
    skipBtn.style.borderColor = 'var(--color-border)';
  });

  skipBtn.addEventListener('click', () => {
    skipBtn.remove();
    transitionToWebsite();
  });

  document.body.appendChild(skipBtn);
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  // Scroll-based nav styling
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Mobile nav toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      state.mobileNavOpen = !state.mobileNavOpen;
      toggle.classList.toggle('active', state.mobileNavOpen);
      mobileNav.classList.toggle('active', state.mobileNavOpen);
      document.body.classList.toggle('no-scroll', state.mobileNavOpen);
    });

    // Close mobile nav on link click
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        state.mobileNavOpen = false;
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          const offset = nav ? nav.offsetHeight : 0;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   GALLERY
   ═══════════════════════════════════════════════════════════ */
function initGallery() {
  const filters = document.querySelectorAll('.gallery-filter');
  const items = document.querySelectorAll('.gallery-item');

  // Collect gallery images for lightbox
  items.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      state.galleryImages.push({
        src: img.src,
        alt: img.alt,
        category: item.dataset.category,
      });
    }
  });

  // Filter functionality
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      // Update active filter
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');

      // Filter items
      items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.classList.remove('hidden');
          gsap.fromTo(item,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Click to open lightbox
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(parseInt(item.dataset.index, 10));
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   LIGHTBOX
   ═══════════════════════════════════════════════════════════ */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = lightbox?.querySelector('.lightbox-close');
  const prevBtn = lightbox?.querySelector('.lightbox-prev');
  const nextBtn = lightbox?.querySelector('.lightbox-next');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));

  // Close on background click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!state.lightboxOpen) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // Touch swipe for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightbox) {
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        navigateLightbox(diff > 0 ? 1 : -1);
      }
    }, { passive: true });
  }
}

function openLightbox(index) {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox || state.galleryImages.length === 0) return;

  state.lightboxOpen = true;
  state.lightboxIndex = index;
  updateLightboxImage();

  lightbox.classList.add('active');
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  state.lightboxOpen = false;
  lightbox.classList.remove('active');
  document.body.classList.remove('no-scroll');
}

function navigateLightbox(direction) {
  const total = state.galleryImages.length;
  state.lightboxIndex = (state.lightboxIndex + direction + total) % total;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightbox-img');
  const current = document.getElementById('lightbox-current');
  const total = document.getElementById('lightbox-total');

  if (!img) return;

  const imageData = state.galleryImages[state.lightboxIndex];
  if (imageData) {
    // Fade transition
    gsap.to(img, {
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        img.src = imageData.src;
        img.alt = imageData.alt;
        gsap.to(img, { opacity: 1, duration: 0.3 });
      },
    });
  }

  if (current) current.textContent = state.lightboxIndex + 1;
  if (total) total.textContent = state.galleryImages.length;
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL ANIMATIONS
   ═══════════════════════════════════════════════════════════ */
function initScrollReveal() {
  // Use Intersection Observer for scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Observe elements in the wedding website (not the invitation experience)
  const weddingWebsite = document.getElementById('wedding-website');
  if (weddingWebsite) {
    const revealElements = weddingWebsite.querySelectorAll('.reveal-up');
    revealElements.forEach(el => observer.observe(el));
  }

  // GSAP ScrollTrigger for more complex animations
  initGSAPScrollAnimations();
}

function initGSAPScrollAnimations() {
  // Timeline items stagger
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(item,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'power3.out',
          }
        );
      },
      once: true,
    });
  });

  // Gallery items stagger
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 90%',
      onEnter: () => {
        gsap.fromTo(item,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            delay: (index % 3) * 0.1,
            ease: 'power3.out',
          }
        );
      },
      once: true,
    });
  });

  // Parallax on hero decorative elements
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  // Section headers parallax
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.fromTo(header,
      { y: 0 },
      {
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: header,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1,
        },
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   UTILITIES
   ═══════════════════════════════════════════════════════════ */

// Debounce
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Handle resize for ScrollTrigger refresh
window.addEventListener('resize', debounce(() => {
  ScrollTrigger.refresh();
}, 250));

/* ═══════════════════════════════════════════════════════════
   HERO PARALLAX INTERACTION
   ═══════════════════════════════════════════════════════════ */
function initHeroParallax() {
  const landingScreen = document.getElementById('envelope-screen');
  const landingImg = document.querySelector('.landing-bg-image');
  const heroSection = document.getElementById('hero');
  const heroImg = document.querySelector('.hero-bg-image');

  // Mouse parallax for landing screen
  if (landingScreen && landingImg) {
    landingScreen.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xOffset = ((clientX / innerWidth) - 0.5) * 30;
      const yOffset = ((clientY / innerHeight) - 0.5) * 30;

      gsap.to(landingImg, {
        x: xOffset,
        y: yOffset,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    landingScreen.addEventListener('mouseleave', () => {
      gsap.to(landingImg, { x: 0, y: 0, duration: 2, ease: 'power2.out' });
    });
  }

  // Mouse parallax for main hero
  if (heroSection && heroImg) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const xOffset = ((clientX / innerWidth) - 0.5) * 25;
      const yOffset = ((clientY / innerHeight) - 0.5) * 25;

      gsap.to(heroImg, {
        x: xOffset,
        y: yOffset,
        duration: 1.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroImg, { x: 0, y: 0, duration: 2, ease: 'power2.out' });
    });
  }
}
