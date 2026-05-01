/* ============================================================
   NexaVision – Digital Marketing Agency
   Main JavaScript – Animations, Interactions, 3D Effects
   ============================================================ */

'use strict';

/* ---- Wait for DOM ---- */
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 700);
    }, 900);
  });

  /* ============================================================
     AOS – Animate On Scroll
     ============================================================ */
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  const cursorDot    = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');

  let mouseX = 0, mouseY = 0;
  let circleX = 0, circleY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  function animateCursorCircle() {
    circleX += (mouseX - circleX) * 0.12;
    circleY += (mouseY - circleY) * 0.12;
    cursorCircle.style.left = circleX + 'px';
    cursorCircle.style.top  = circleY + 'px';
    requestAnimationFrame(animateCursorCircle);
  }
  animateCursorCircle();

  const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio-card, .filter-btn, .pricing-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorCircle.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorCircle.classList.remove('hover'));
  });

  /* ============================================================
     PARTICLE CANVAS
     ============================================================ */
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5
        ? `rgba(124,58,237,${this.alpha})`
        : `rgba(6,182,212,${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function initParticles(n = 80) {
    particles = [];
    for (let i = 0; i < n; i++) particles.push(new Particle());
  }
  initParticles();

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animFrame = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  /* ============================================================
     NAVBAR – Scroll & Active Link
     ============================================================ */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    /* Sticky style */
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    /* Active link highlight */
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    /* Back to top visibility */
    backToTop.classList.toggle('visible', window.scrollY > 600);
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger / Mobile menu */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinksEl.classList.toggle('active'); // 👈 FIX
  document.body.style.overflow = navLinksEl.classList.contains('active') ? 'hidden' : '';
});

navLinksEl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinksEl.classList.remove('active'); // 👈 FIX
    document.body.style.overflow = '';
  });
});
  /* ============================================================
     TYPEWRITER EFFECT
     ============================================================ */
  const typewriterEl = document.getElementById('typewriter');
  const words = [
    'Brand Online',
    'Digital Presence',
    'Social Media',
    'SEO Rankings',
    'E-commerce Sales',
    'Marketing ROI',
  ];
  let wordIndex  = 0;
  let charIndex  = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();

  /* ============================================================
     COUNTER ANIMATION
     ============================================================ */
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });

  /* ============================================================
     PORTFOLIO FILTER
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ============================================================
     SWIPER – TESTIMONIALS
     ============================================================ */
  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  });

  /* ============================================================
     3D TILT EFFECT ON SERVICE CARDS
     ============================================================ */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;

      card.style.transform = `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        scale(1.01)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });

  /* ============================================================
     CONTACT FORM – Submission
     ============================================================ */
  const contactForm  = document.getElementById('contactForm');
  const submitBtn    = document.getElementById('submitBtn');
  const formSuccess  = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btnText    = submitBtn.querySelector('.btn-text');
      const btnLoading = submitBtn.querySelector('.btn-loading');

      btnText.style.display    = 'none';
      btnLoading.style.display = 'flex';
      submitBtn.disabled = true;

      /* Simulate async submission */
      await new Promise(resolve => setTimeout(resolve, 1800));

      /* Save to table API */
      try {
        await fetch('tables/contact_leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:    contactForm.name.value,
            email:   contactForm.email.value,
            phone:   contactForm.phone.value,
            service: contactForm.service.value,
            budget:  contactForm.budget.value,
            message: contactForm.message.value,
          }),
        });
      } catch (_) { /* Non-blocking */ }

      btnText.style.display    = 'flex';
      btnLoading.style.display = 'none';
      submitBtn.disabled = false;
      contactForm.reset();
      formSuccess.style.display = 'block';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    });
  }

  /* ============================================================
     NEWSLETTER FORM
     ============================================================ */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn   = newsletterForm.querySelector('button');
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
      btn.style.background = '#34d399';
      input.value = '';
      setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        btn.style.background = '';
      }, 3000);
    });
  }

  /* ============================================================
     SMOOTH SCROLL (all anchor links)
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     FLOATING CARDS PARALLAX
     ============================================================ */
  const floatingCards = document.querySelectorAll('.floating-card');
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    floatingCards.forEach((card, i) => {
      const factor = (i + 1) * 0.5;
      card.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });

  /* ============================================================
     SECTION REVEAL PROGRESS (subtle glow on scroll)
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.result-card, .process-step').forEach(el => {
    revealObserver.observe(el);
  });

  /* ============================================================
     NAVBAR LOGO GLOW on hover
     ============================================================ */
  const logoIcon = document.querySelector('.logo-icon');
  if (logoIcon) {
    logoIcon.addEventListener('mouseenter', () => {
      logoIcon.style.animation = 'spin 1s linear';
    });
    logoIcon.addEventListener('animationend', () => {
      logoIcon.style.animation = '';
    });
  }

  /* ============================================================
     ADD KEYFRAME for portfolio filter animation
     ============================================================ */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  /* ============================================================
     PRICING CARD PARTICLE ON HOVER
     ============================================================ */
  document.querySelectorAll('.pricing-card.featured').forEach(card => {
    card.addEventListener('mouseenter', () => {
      for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('span');
        sparkle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${Math.random() > 0.5 ? '#a78bfa' : '#38bdf8'};
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          pointer-events: none;
          z-index: 10;
          animation: sparkleAnim 0.8s ease forwards;
        `;
        card.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
      }
    });
  });

  const sparkleStyle = document.createElement('style');
  sparkleStyle.textContent = `
    @keyframes sparkleAnim {
      0%   { transform: scale(0) translateY(0); opacity: 1; }
      100% { transform: scale(1) translateY(-40px); opacity: 0; }
    }
  `;
  document.head.appendChild(sparkleStyle);

  /* ============================================================
     MAGNETIC BUTTONS
     ============================================================ */
  document.querySelectorAll('.btn-hero-primary, .btn-cta-primary, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) translateY(-3px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ============================================================
     GLOWING BORDER ON ABOUT CARD (mouse tracking)
     ============================================================ */
  const aboutCard = document.querySelector('.about-img-card');
  if (aboutCard) {
    aboutCard.addEventListener('mousemove', (e) => {
      const rect = aboutCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      aboutCard.style.background = `
        radial-gradient(circle at ${x}% ${y}%,
          rgba(124,58,237,0.12),
          rgba(15,23,42,1) 60%)
      `;
    });
    aboutCard.addEventListener('mouseleave', () => {
      aboutCard.style.background = '';
    });
  }

  console.log('%c NexaVision Digital Agency ', 'background:#7c3aed;color:#fff;font-size:16px;padding:6px 14px;border-radius:6px;font-weight:bold;');
  console.log('%c Built with passion & code ✨', 'color:#a78bfa;font-size:13px;');
});

 // Counter Animation Script
  function startCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      let current = 0;
      const increment = target / 50;
      
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      updateCounter();
    });
  }

  // Intersection Observer to trigger counter when section comes into view
  const resultSection = document.querySelector('.results-premium');
  if (resultSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(resultSection);
  } else {
    // Fallback: start counters immediately if section exists
    startCounters();
  }
  
