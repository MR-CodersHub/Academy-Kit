/* ============================================================
   ACADEMYKIT — MAIN JAVASCRIPT
   Version 1.0 | Vanilla ES6+
============================================================ */

'use strict';

// ── THEME MANAGER ──
const ThemeManager = (() => {
  const STORAGE_KEY = 'ak_theme';
  const DEFAULT = 'dark';

  function get() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT;
  }

  function set(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    const ICON_SUN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const ICON_MOON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.innerHTML = theme === 'dark' ? ICON_SUN : ICON_MOON;
    });
  }

  function toggle() {
    set(get() === 'dark' ? 'light' : 'dark');
  }

  function init() {
    set(get());
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, get, set, toggle };
})();

// ── RTL MANAGER ──
const RTLManager = (() => {
  const STORAGE_KEY = 'ak_dir';

  function get() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function set(dir) {
    localStorage.setItem(STORAGE_KEY, dir);
    document.documentElement.setAttribute('dir', dir);
    document.querySelectorAll('[data-dir-icon]').forEach(el => {
      el.textContent = dir === 'ltr' ? 'RTL' : 'LTR';
    });
  }

  function toggle() {
    set(get() === 'ltr' ? 'rtl' : 'ltr');
  }

  function init() {
    set(get());
    document.querySelectorAll('[data-rtl-toggle]').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, get, set };
})();

// ── NAVBAR ──
const Navbar = (() => {
  let navbar, toggle, mobileMenu;

  function init() {
    navbar = document.querySelector('.navbar');
    toggle = document.querySelector('.nav-toggle');
    mobileMenu = document.querySelector('.mobile-menu');

    if (!navbar) return;

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle) {
      toggle.addEventListener('click', toggleMenu);
    }

    // Desktop dropdowns: tap/click + keyboard accessible (fixes touch)
    const dropdownItems = document.querySelectorAll('.nav-item:has(.dropdown)');
    dropdownItems.forEach(item => {
      const link = item.querySelector(':scope > .nav-link');
      const menu = item.querySelector(':scope > .dropdown');
      if (!link || !menu) return;
      link.setAttribute('aria-haspopup', 'true');
      if (!link.hasAttribute('aria-expanded')) link.setAttribute('aria-expanded', 'false');

      const closeOthers = () => {
        document.querySelectorAll('.nav-item.open').forEach(o => {
          if (o !== item) {
            o.classList.remove('open');
            o.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false');
          }
        });
      };

      // First tap opens, second tap navigates
      link.addEventListener('click', (e) => {
        if (!item.classList.contains('open')) {
          e.preventDefault();
          closeOthers();
          item.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
        }
        // else: allow default navigation on second tap
      });

      // Keyboard: Enter/Space/ArrowDown opens, Escape closes
      link.addEventListener('keydown', (e) => {
        if ((e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') && !item.classList.contains('open')) {
          e.preventDefault();
          closeOthers();
          item.classList.add('open');
          link.setAttribute('aria-expanded', 'true');
          menu.querySelector('.dropdown-link')?.focus();
        } else if (e.key === 'Escape') {
          item.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });

      menu.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          item.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
          link.focus();
        }
      });

      // Close when focus leaves the whole nav-item
      item.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) {
          item.classList.remove('open');
          link.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Close dropdowns on outside tap / Escape
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-item:has(.dropdown)')) {
        document.querySelectorAll('.nav-item.open').forEach(o => {
          o.classList.remove('open');
          o.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false');
        });
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.nav-item.open').forEach(o => {
          o.classList.remove('open');
          o.querySelector(':scope > .nav-link')?.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Dropdown toggles on mobile
    document.querySelectorAll('.mobile-nav-link[data-has-sub]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const subId = link.getAttribute('data-has-sub');
        const sub = document.getElementById(subId);
        if (sub) {
          sub.classList.toggle('open');
          link.classList.toggle('open', sub.classList.contains('open'));
        }
      });
    });

    // Active nav link
    setActiveLink();

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (mobileMenu && mobileMenu.classList.contains('open') &&
          !mobileMenu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  function onScroll() {
    if (!navbar) return;
    const scrolled = window.scrollY > 50;
    navbar.classList.toggle('scrolled', scrolled);
  }

  function toggleMenu() {
    const isOpen = mobileMenu && mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  function openMenu() {
    mobileMenu && mobileMenu.classList.add('open');
    toggle && toggle.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    mobileMenu && mobileMenu.classList.remove('open');
    toggle && toggle.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  function setActiveLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href]').forEach(link => {
      const href = link.getAttribute('href').split('/').pop();
      link.classList.toggle('active', href === current);
    });
  }

  return { init };
})();

// ── HERO SLIDER ──
const HeroSlider = (() => {
  let slides, dots, current = 0, timer, autoplayDelay = 5500;

  function init() {
    slides = document.querySelectorAll('.hero-slide');
    dots = document.querySelectorAll('.hero-dot');

    if (!slides.length) return;

    document.querySelectorAll('.hero-arrow-prev').forEach(btn => {
      btn.addEventListener('click', () => go(current - 1));
    });
    document.querySelectorAll('.hero-arrow-next').forEach(btn => {
      btn.addEventListener('click', () => go(current + 1));
    });
    dots.forEach((dot, i) => dot.addEventListener('click', () => go(i)));

    startAutoplay();

    // Pause on hover
    const slider = document.querySelector('.hero-slider');
    if (slider) {
      slider.addEventListener('mouseenter', stopAutoplay);
      slider.addEventListener('mouseleave', startAutoplay);
    }

    // Touch support
    let touchStart = 0;
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('touchstart', e => { touchStart = e.touches[0].clientX; }, { passive: true });
      hero.addEventListener('touchend', e => {
        const diff = touchStart - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) go(diff > 0 ? current + 1 : current - 1);
      }, { passive: true });
    }
  }

  function go(index) {
    if (!slides.length) return;
    slides[current].classList.remove('active');
    dots[current] && dots[current].classList.remove('active');
    current = ((index % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');
  }

  function startAutoplay() {
    stopAutoplay();
    timer = setInterval(() => go(current + 1), autoplayDelay);
  }

  function stopAutoplay() {
    clearInterval(timer);
  }

  return { init };
})();

// ── SCROLL REVEAL ──
const ScrollReveal = (() => {
  let observer;

  function init() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ── FAQ ACCORDION ──
const FAQ = (() => {
  function init() {
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        // Close all
        document.querySelectorAll('.faq-item.open').forEach(open => {
          open.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  return { init };
})();

// ── SPORT CATEGORY FILTER ──
const SportFilter = (() => {
  function init() {
    document.querySelectorAll('[data-filter-group]').forEach(group => {
      const id = group.getAttribute('data-filter-group');
      const btns = document.querySelectorAll(`[data-filter][data-filter-target="${id}"]`);
      const items = document.querySelectorAll(`[data-filter-item][data-filter-group="${id}"]`);

      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          btns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const filter = btn.getAttribute('data-filter');
          items.forEach(item => {
            const cats = item.getAttribute('data-category') || '';
            const show = filter === '*' || cats.includes(filter);
            item.style.display = show ? '' : 'none';
            if (show) {
              item.style.animation = 'fadeInUp 0.4s ease';
            }
          });
        });
      });
    });

    // Live category counts (e.g. blog sidebar badges reflect actual cards)
    document.querySelectorAll('[data-cat-count]').forEach(badge => {
      const cat = badge.getAttribute('data-cat-count');
      const n = document.querySelectorAll(`[data-filter-item][data-category="${cat}"]`).length;
      if (n > 0) badge.textContent = n;
    });
  }

  return { init };
})();

// ── COUNTER ANIMATION ──
const CounterAnimation = (() => {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || el.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
    }, 16);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ── PROGRESS BARS ──
const ProgressBars = (() => {
  function init() {
    const bars = document.querySelectorAll('.progress-bar-fill[data-progress]');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.width = el.getAttribute('data-progress') + '%';
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => observer.observe(bar));
  }

  return { init };
})();

// ── PRODUCT IMAGE ZOOM ──
const ProductZoom = (() => {
  function initZoom(wrapper) {
    const img = wrapper.querySelector('img');
    const lens = wrapper.querySelector('.zoom-lens');
    const result = wrapper.querySelector('.zoom-result');

    if (!img || !lens || !result) return;

    const cx = result.offsetWidth / lens.offsetWidth;
    const cy = result.offsetHeight / lens.offsetHeight;

    result.style.backgroundImage = `url(${img.src})`;
    result.style.backgroundSize = `${img.offsetWidth * cx}px ${img.offsetHeight * cy}px`;

    wrapper.addEventListener('mousemove', (e) => {
      const pos = getCursorPos(e);
      let x = pos.x - lens.offsetWidth / 2;
      let y = pos.y - lens.offsetHeight / 2;

      x = Math.max(0, Math.min(x, img.offsetWidth - lens.offsetWidth));
      y = Math.max(0, Math.min(y, img.offsetHeight - lens.offsetHeight));

      lens.style.left = x + 'px';
      lens.style.top = y + 'px';
      result.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    });

    function getCursorPos(e) {
      const rect = img.getBoundingClientRect();
      return {
        x: e.pageX - rect.left - window.pageXOffset,
        y: e.pageY - rect.top - window.pageYOffset
      };
    }
  }

  function init() {
    document.querySelectorAll('.zoom-wrapper').forEach(initZoom);
  }

  return { init };
})();

// ── SIZE GUIDE INTERACTIVE ──
const SizeGuide = (() => {
  function init() {
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('out-of-stock')) return;
        const group = btn.closest('.size-buttons');
        group && group.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    document.querySelectorAll('.color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const group = swatch.closest('.color-swatches');
        group && group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
        swatch.classList.add('selected');
      });
    });
  }

  return { init };
})();

// ── FORM VALIDATION ──
const FormValidator = (() => {
  const validators = {
    required: (val) => val.trim() !== '',
    email: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    phone: (val) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(val),
    minLength: (val, len) => val.length >= parseInt(len),
  };

  function validateField(input) {
    const rules = input.getAttribute('data-validate') || '';
    const ruleList = rules.split('|').filter(Boolean);
    let valid = true;
    let message = '';

    for (const rule of ruleList) {
      const [name, param] = rule.split(':');
      if (validators[name] && !validators[name](input.value, param)) {
        valid = false;
        message = input.getAttribute(`data-msg-${name}`) || getDefaultMsg(name, param);
        break;
      }
    }

    input.classList.toggle('error', !valid);
    const errEl = input.parentElement.querySelector('.form-error-msg');
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = valid ? 'none' : 'block';
    }

    return valid;
  }

  function getDefaultMsg(rule, param) {
    const msgs = {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      phone: 'Please enter a valid phone number.',
      minLength: `Minimum ${param} characters required.`,
    };
    return msgs[rule] || 'Invalid value.';
  }

  function init() {
    document.querySelectorAll('form[data-validate-form]').forEach(form => {
      const inputs = form.querySelectorAll('[data-validate]');

      inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) validateField(input);
        });
      });

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let allValid = true;

        inputs.forEach(input => {
          if (!validateField(input)) allValid = false;
        });

        if (allValid) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            if (!btn.hasAttribute('data-original-html')) btn.setAttribute('data-original-html', btn.innerHTML);
            btn.textContent = 'Sending...';
            btn.disabled = true;
          }

          setTimeout(() => {
            Toast.show({
              type: 'success',
              title: 'Success!',
              message: form.getAttribute('data-success-msg') || 'Your message has been sent successfully.'
            });
            form.reset();
            if (btn) {
              btn.innerHTML = btn.getAttribute('data-original-html') || btn.getAttribute('data-original-text') || 'Submit';
              btn.disabled = false;
            }
            // Redirect after success (e.g. login/signup -> home page)
            const redirect = form.getAttribute('data-redirect');
            if (redirect) {
              setTimeout(() => { window.location.href = redirect; }, 1400);
            }
          }, 1800);
        }
      });
    });
  }

  return { init };
})();

// ── TOAST NOTIFICATIONS ──
const Toast = (() => {
  let container;

  function getContainer() {
    if (!container) {
      container = document.querySelector('.toast-container');
      if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
    }
    return container;
  }

  const SVG_OPEN = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const icons = {
    success: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5.5"/></svg>',
    error: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>',
    info: SVG_OPEN + '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 7.5h.01"/></svg>',
    warning: SVG_OPEN + '<path d="M12 3 2 20h20z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/></svg>'
  };

  function show({ type = 'info', title, message, duration = 4000 }) {
    const cont = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <p class="toast-title">${title}</p>
        <p class="toast-msg">${message}</p>
      </div>
    `;
    cont.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  }

  return { show };
})();

// ── BACK TO TOP ──
const BackToTop = (() => {
  function init() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  return { init };
})();

// ── LIGHTBOX ──
const Lightbox = (() => {
  let lightbox;

  function init() {
    lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.getAttribute('data-lightbox') || trigger.querySelector('img')?.src;
        if (src) open(src);
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  function open(src) {
    const img = lightbox.querySelector('img');
    if (img) img.src = src;
    lightbox.classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }

  return { init };
})();

// ── COUNTDOWN TIMER ──
const Countdown = (() => {
  function init() {
    const el = document.querySelector('[data-countdown]');
    if (!el) return;

    const targetStr = el.getAttribute('data-countdown');
    const target = new Date(targetStr).getTime();

    function update() {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        el.innerHTML = '<p>The wait is over!</p>';
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = n => String(n).padStart(2, '0');

      const units = el.querySelectorAll('.countdown-value');
      if (units.length >= 4) {
        units[0].textContent = pad(days);
        units[1].textContent = pad(hours);
        units[2].textContent = pad(mins);
        units[3].textContent = pad(secs);
      }
    }

    update();
    setInterval(update, 1000);
  }

  return { init };
})();

// ── AUTH TABS ──
const AuthTabs = (() => {
  function init() {
    document.querySelectorAll('.auth-tab[data-auth-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-auth-tab');
        const container = tab.closest('.auth-form-card');

        container.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        container.querySelectorAll('.auth-panel[data-panel]').forEach(panel => {
          panel.style.display = panel.getAttribute('data-panel') === target ? 'block' : 'none';
        });
      });
    });
  }

  return { init };
})();

// ── SERVICE TABS ──
const ServiceTabs = (() => {
  function init() {
    document.querySelectorAll('.service-tab[data-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        const container = tab.closest('.service-tabs-wrapper') || document;

        container.querySelectorAll('.service-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        container.querySelectorAll('.tab-content[data-tab-content]').forEach(panel => {
          panel.classList.toggle('active', panel.getAttribute('data-tab-content') === target);
        });
      });
    });
  }

  return { init };
})();

// ── SPORT TABS ──
const SportTabs = (() => {
  function init() {
    document.querySelectorAll('.sport-tab-btn[data-sport-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-sport-tab');
        const nav = btn.closest('.sport-tab-nav');
        const wrapper = nav?.closest('[data-sport-tabs-wrapper]');

        nav?.querySelectorAll('.sport-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        wrapper?.querySelectorAll('[data-sport-panel]').forEach(panel => {
          panel.classList.toggle('active', panel.getAttribute('data-sport-panel') === target);
        });
      });
    });
  }

  return { init };
})();

// ── QUOTE FORM STEPS ──
const QuoteForm = (() => {
  let currentStep = 1;
  const totalSteps = 3;

  function init() {
    const form = document.querySelector('[data-quote-form]');
    if (!form) return;

    updateUI();

    form.querySelectorAll('[data-step-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
          currentStep++;
          updateUI();
        }
      });
    });

    form.querySelectorAll('[data-step-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          updateUI();
        }
      });
    });

    // Final submit: toast + reset all fields + back to step 1
    form.querySelectorAll('[data-quote-submit]').forEach(btn => {
      btn.addEventListener('click', () => {
        Toast.show({ type: 'success', title: 'Quote Submitted!', message: 'We will send your detailed quote within 2 hours.' });
        form.querySelectorAll('input, select, textarea').forEach(field => {
          if (field.type === 'checkbox' || field.type === 'radio') field.checked = false;
          else field.value = '';
        });
        currentStep = 1;
        updateUI();
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    function updateUI() {
      form.querySelectorAll('[data-step]').forEach(step => {
        const num = parseInt(step.getAttribute('data-step'));
        step.style.display = num === currentStep ? 'block' : 'none';
      });

      form.querySelectorAll('.quote-step').forEach((step, i) => {
        const num = i + 1;
        step.classList.toggle('active', num === currentStep);
        step.classList.toggle('done', num < currentStep);
      });
    }
  }

  return { init };
})();

// ── COOKIE BANNER ──
const CookieBanner = (() => {
  const STORAGE_KEY = 'ak_cookies';

  function init() {
    if (localStorage.getItem(STORAGE_KEY)) return;

    const banner = document.querySelector('.cookie-banner');
    if (!banner) return;

    setTimeout(() => banner.classList.add('show'), 1500);

    banner.querySelector('[data-cookie-accept]')?.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, '1');
      banner.classList.remove('show');
    });

    banner.querySelector('[data-cookie-decline]')?.addEventListener('click', () => {
      banner.classList.remove('show');
    });
  }

  return { init };
})();

// ── PRODUCT QUANTITY ──
const QuantitySelector = (() => {
  function init() {
    document.querySelectorAll('.quantity-selector').forEach(selector => {
      const input = selector.querySelector('.qty-input');
      const dec = selector.querySelector('.qty-dec');
      const inc = selector.querySelector('.qty-inc');

      if (!input) return;

      dec?.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        if (val > 1) input.value = val - 1;
      });

      inc?.addEventListener('click', () => {
        const val = parseInt(input.value) || 1;
        input.value = val + 1;
      });
    });
  }

  return { init };
})();

// ── PRODUCT CARD ACTIONS (wishlist + compare) ──
const ProductActions = (() => {
  const WKEY = 'ak_wishlist';
  const CKEY = 'ak_compare';
  const MAX_COMPARE = 3;

  function get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; }
    catch (e) { return []; }
  }
  function set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  function titleOf(card) {
    return (card && card.querySelector('.product-card-title') || {}).textContent?.trim() || 'This kit';
  }

  function dataOf(card) {
    const q = (s) => card && card.querySelector(s);
    const title = titleOf(card);
    const img = q('.product-card-image img');
    const ratingBox = q('.product-rating');
    let rating = 0;
    if (ratingBox) {
      const stars = ratingBox.querySelectorAll('svg');
      stars.forEach(s => {
        const fill = (s.getAttribute('fill') || '').toLowerCase();
        if (fill === 'currentcolor' || fill === 'currentColor') rating++;
      });
      if (!rating) rating = stars.length; // fallback
    }
    return {
      title,
      img: (img && (img.currentSrc || img.src)) || '',
      alt: (img && img.alt) || title,
      sport: (q('.product-sport-tag') || {}).textContent?.trim().replace(/\s+/g, ' ') || '-',
      desc: (q('.product-card-desc') || {}).textContent?.trim() || 'No description available.',
      price: (q('.product-price') || {}).textContent?.trim() || '-',
      oldPrice: (q('.product-price-old') || {}).textContent?.trim() || '',
      rating
    };
  }

  // Normalize: old installs stored plain title strings
  function getCompare() {
    const raw = get(CKEY);
    return raw.map(item => {
      if (typeof item === 'string') return { title: item, img: '', alt: item, sport: '-', desc: 'Added from an earlier visit — reopen its card to load full details.', price: '-', oldPrice: '', rating: 0 };
      return Object.assign({ img: '', alt: item.title, sport: '-', desc: '-', price: '-', oldPrice: '', rating: 0 }, item);
    });
  }
  function setCompare(list) { set(CKEY, list); }
  function hasTitle(list, title) { return list.some(i => i.title === title); }

  function paint(btn, on) {
    btn.classList.toggle('is-active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('title', on ? 'Remove from compare' : 'Add to compare');
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildTray() {
    if (document.getElementById('compareTray')) return;
    const tray = document.createElement('div');
    tray.id = 'compareTray';
    tray.className = 'compare-tray';
    tray.setAttribute('role', 'complementary');
    tray.setAttribute('aria-label', 'Compare list');
    tray.innerHTML =
      '<div class="compare-tray-inner">' +
        '<div class="compare-tray-head">' +
          '<span class="compare-tray-title">Compare <span class="compare-tray-count" data-compare-count>(0/3)</span></span>' +
          '<button class="compare-tray-clear" data-compare-clear type="button">Clear all</button>' +
        '</div>' +
        '<div class="compare-tray-chips" data-compare-chips></div>' +
        '<div class="compare-tray-actions">' +
          '<p class="compare-tray-hint">Tap <b>+</b> on a kit to add · tap <b>&times;</b> to remove</p>' +
          '<button class="compare-tray-view" data-compare-open type="button">Compare Now</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(tray);

    tray.addEventListener('click', (e) => {
      const rm = e.target.closest('[data-compare-remove]');
      if (rm) {
        removeTitle(rm.getAttribute('data-compare-remove'));
        return;
      }
      if (e.target.closest('[data-compare-clear]')) {
        clearAll();
        return;
      }
      if (e.target.closest('[data-compare-open]')) {
        openCompare();
      }
    });
  }

  function renderTray() {
    const tray = document.getElementById('compareTray');
    if (!tray) return;
    const list = getCompare();
    tray.classList.toggle('visible', list.length > 0);
    const count = tray.querySelector('[data-compare-count]');
    if (count) count.textContent = '(' + list.length + '/' + MAX_COMPARE + ')';
    const chips = tray.querySelector('[data-compare-chips]');
    if (chips) {
      chips.innerHTML = list.map((item) =>
        '<span class="compare-chip">' +
          '<span class="compare-chip-name">' + esc(item.title) + '</span>' +
          '<button class="compare-chip-remove" type="button" data-compare-remove="' + esc(item.title) + '" aria-label="Remove ' + esc(item.title) + ' from compare">&times;</button>' +
        '</span>'
      ).join('');
    }
    const viewBtn = tray.querySelector('[data-compare-open]');
    if (viewBtn) {
      viewBtn.style.display = list.length >= 2 ? '' : 'none';
      viewBtn.textContent = 'Compare Now (' + list.length + ')';
    }
    const hint = tray.querySelector('.compare-tray-hint');
    if (hint) hint.style.display = list.length >= 2 ? 'none' : '';
  }

  function flashTray() {
    const tray = document.getElementById('compareTray');
    if (!tray) return;
    tray.classList.remove('shake');
    void tray.offsetWidth;
    tray.classList.add('shake');
    setTimeout(() => tray.classList.remove('shake'), 500);
  }

  function syncCardButtons() {
    const list = getCompare();
    document.querySelectorAll('.product-card').forEach(card => {
      const btns = card.querySelectorAll('.product-actions-overlay .product-action-btn');
      if (btns.length < 3) return;
      paint(btns[2], hasTitle(list, titleOf(card)));
    });
  }

  function removeTitle(title) {
    const list = getCompare();
    if (!hasTitle(list, title)) return;
    setCompare(list.filter(t => t.title !== title));
    syncCardButtons();
    renderTray();
    if (document.getElementById('compareModal')?.classList.contains('open')) renderModal();
    Toast.show({ type: 'info', title: 'Compare', message: title + ' removed from compare.' });
  }

  function clearAll() {
    setCompare([]);
    syncCardButtons();
    renderTray();
    closeCompare();
    Toast.show({ type: 'info', title: 'Compare cleared', message: 'All kits removed from compare.' });
  }

  function stars(r) {
    r = Math.max(0, Math.min(5, parseInt(r) || 0));
    let out = '';
    for (let i = 1; i <= 5; i++) out += i <= r ? '★' : '☆';
    return out;
  }

  function buildModal() {
    if (document.getElementById('compareModal')) return;
    const ov = document.createElement('div');
    ov.id = 'compareModal';
    ov.className = 'compare-modal';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.setAttribute('aria-label', 'Kit comparison');
    ov.innerHTML =
      '<div class="compare-modal-backdrop" data-compare-close></div>' +
      '<div class="compare-modal-box">' +
        '<div class="compare-modal-head">' +
          '<h3 class="compare-modal-title">Kit Comparison</h3>' +
          '<button class="compare-modal-close" type="button" data-compare-close aria-label="Close comparison">&times;</button>' +
        '</div>' +
        '<div class="compare-modal-scroll" data-compare-body></div>' +
        '<div class="compare-modal-foot">' +
          '<button class="btn btn-sm btn-outline" type="button" data-compare-close>Continue browsing</button>' +
          '<button class="btn btn-sm btn-primary" type="button" data-compare-clear2>Clear all</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', (e) => {
      if (e.target.closest('[data-compare-close]')) { closeCompare(); return; }
      if (e.target.closest('[data-compare-clear2]')) { clearAll(); return; }
      const rm = e.target.closest('[data-compare-remove]');
      if (rm) removeTitle(rm.getAttribute('data-compare-remove'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCompare();
    });
  }

  function renderModal() {
    const body = document.querySelector('[data-compare-body]');
    if (!body) return;
    const list = getCompare();
    if (!list.length) { closeCompare(); return; }
    const cols = list.map(item =>
      '<td>' +
        (item.img ? '<img class="compare-modal-img" src="' + esc(item.img) + '" alt="' + esc(item.alt || item.title) + '" loading="lazy"/>' : '<div class="compare-modal-noimg">No image</div>') +
        '<div class="compare-modal-name">' + esc(item.title) + '</div>' +
        '<button class="compare-modal-rm" type="button" data-compare-remove="' + esc(item.title) + '">Remove</button>' +
      '</td>'
    ).join('');
    body.innerHTML =
      '<table class="compare-modal-table">' +
        '<tr><th>Kit</th>' + cols + '</tr>' +
        '<tr><th>Sport</th>' + list.map(i => '<td>' + esc(i.sport) + '</td>').join('') + '</tr>' +
        '<tr><th>Price</th>' + list.map(i => '<td><span class="compare-modal-price">' + esc(i.price) + '</span>' + (i.oldPrice ? ' <span class="compare-modal-old">' + esc(i.oldPrice) + '</span>' : '') + '</td>').join('') + '</tr>' +
        '<tr><th>Rating</th>' + list.map(i => '<td><span class="compare-modal-stars">' + stars(i.rating) + '</span> <span class="compare-modal-rate-num">' + (i.rating ? i.rating + '/5' : '-') + '</span></td>').join('') + '</tr>' +
        '<tr><th>Details</th>' + list.map(i => '<td class="compare-modal-desc">' + esc(i.desc) + '</td>').join('') + '</tr>' +
      '</table>';
  }

  function openCompare() {
    buildModal();
    const list = getCompare();
    if (list.length < 2) {
      flashTray();
      Toast.show({ type: 'info', title: 'Compare', message: 'Select at least 2 kits to compare. Tap + on another kit.' });
      return;
    }
    renderModal();
    document.getElementById('compareModal').classList.add('open');
    document.body.classList.add('no-scroll');
  }

  function closeCompare() {
    document.getElementById('compareModal')?.classList.remove('open');
    if (!document.querySelector('.lightbox.open')) document.body.classList.remove('no-scroll');
  }

  function init() {
    buildTray();
    buildModal();
    renderTray();
    // Wishlist = 2nd button, Compare = 3rd button in each card overlay
    document.querySelectorAll('.product-card').forEach(card => {
      const btns = card.querySelectorAll('.product-actions-overlay .product-action-btn');
      if (btns.length < 3) return;
      const title = titleOf(card);
      const wishBtn = btns[1];
      const cmpBtn = btns[2];

      if (get(WKEY).includes(title)) paint(wishBtn, true);
      if (hasTitle(getCompare(), title)) paint(cmpBtn, true);
      cmpBtn.setAttribute('title', hasTitle(getCompare(), title) ? 'Remove from compare' : 'Add to compare');

      wishBtn.addEventListener('click', () => {
        let list = get(WKEY);
        if (list.includes(title)) {
          set(WKEY, list.filter(t => t !== title));
          paint(wishBtn, false);
          Toast.show({ type: 'info', title: 'Wishlist', message: title + ' removed from your wishlist.' });
        } else {
          list.push(title);
          set(WKEY, list);
          paint(wishBtn, true);
          Toast.show({ type: 'success', title: 'Wishlisted!', message: title + ' saved to your wishlist.' });
        }
      });

      cmpBtn.addEventListener('click', () => {
        let list = getCompare();
        if (hasTitle(list, title)) {
          setCompare(list.filter(t => t.title !== title));
          paint(cmpBtn, false);
          renderTray();
          if (document.getElementById('compareModal')?.classList.contains('open')) renderModal();
          Toast.show({ type: 'info', title: 'Compare', message: title + ' removed from compare.' });
        } else {
          if (list.length >= MAX_COMPARE) {
            renderTray();
            flashTray();
            Toast.show({ type: 'warning', title: 'Compare Full (' + list.length + '/' + MAX_COMPARE + ')', message: 'Tap \u00D7 on the compare bar below to remove one: ' + list.map(i => i.title).join(', ') + '.' });
            return;
          }
          list.push(dataOf(card));
          setCompare(list);
          paint(cmpBtn, true);
          renderTray();
          Toast.show({ type: 'success', title: 'Added to Compare (' + list.length + '/' + MAX_COMPARE + ')', message: list.map(i => i.title).join(' vs ') + '.' });
        }
      });
    });

    // Keep tray in sync if localStorage changes in another tab
    window.addEventListener('storage', (e) => {
      if (e.key === CKEY) { syncCardButtons(); renderTray(); if (document.getElementById('compareModal')?.classList.contains('open')) renderModal(); }
    });
  }

  return { init, removeTitle, clearAll, openCompare };
})();

// ── SMOOTH SCROLL ──
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h')) || 80;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ── PARALLAX ──
function initParallax() {
  const els = document.querySelectorAll('[data-parallax]');
  if (!els.length) return;

  function update() {
    els.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.3;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ── IMAGE GALLERY TABS ──
function initGalleryTabs() {
  document.querySelectorAll('[data-gallery-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-gallery-tab');
      const wrapper = btn.closest('[data-gallery-wrapper]');

      wrapper?.querySelectorAll('[data-gallery-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      wrapper?.querySelectorAll('[data-gallery-panel]').forEach(panel => {
        panel.style.display = panel.getAttribute('data-gallery-panel') === target ? '' : 'none';
      });
    });
  });
}

// ── PAGE LOADER ──
function initPageLoader() {
  window.addEventListener('load', () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.transition = 'opacity 0.5s ease';
      setTimeout(() => loader.remove(), 500);
    }
  });
}

// ── CUSTOM BRANDING PREVIEW ──
function initBrandingPreview() {
  const nameInput = document.querySelector('#branding-name');
  const preview = document.querySelector('.branding-preview-text');

  if (nameInput && preview) {
    nameInput.addEventListener('input', () => {
      preview.textContent = nameInput.value || 'YOUR TEAM NAME';
    });
  }

  const colorInputs = document.querySelectorAll('[data-branding-color]');
  colorInputs.forEach(input => {
    input.addEventListener('change', () => {
      const target = input.getAttribute('data-branding-color');
      const previewEl = document.querySelector(`.branding-preview [data-color-target="${target}"]`);
      if (previewEl) previewEl.style.background = input.value;
    });
  });

  // Primary color swatches update the live preview (any .branding-preview on page)
  document.querySelectorAll('.branding-preview').forEach(previewBox => {
    const scope = previewBox.closest('section') || document;
    const primaryTarget = previewBox.querySelector('[data-color-target="primary"]') || previewBox;
    scope.querySelectorAll('.color-swatches .color-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const color = swatch.style.background || getComputedStyle(swatch).backgroundColor;
        if (color) primaryTarget.style.background = color;
      });
    });
  });
}

// ── MAIN INIT ──
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  HeroSlider.init();
  ScrollReveal.init();
  FAQ.init();
  SportFilter.init();
  CounterAnimation.init();
  ProgressBars.init();
  ProductZoom.init();
  SizeGuide.init();
  FormValidator.init();
  BackToTop.init();
  Lightbox.init();
  ProductActions.init();
  Countdown.init();
  AuthTabs.init();
  ServiceTabs.init();
  SportTabs.init();
  QuoteForm.init();
  CookieBanner.init();
  QuantitySelector.init();
  initSmoothScroll();
  initParallax();
  initGalleryTabs();
  initPageLoader();
  initBrandingPreview();
});
