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
    document.querySelectorAll('[data-theme-icon]').forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
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

    // Dropdown toggles on mobile
    document.querySelectorAll('.mobile-nav-link[data-has-sub]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const subId = link.getAttribute('data-has-sub');
        const sub = document.getElementById(subId);
        if (sub) {
          sub.classList.toggle('open');
          const arrow = link.querySelector('.arrow');
          if (arrow) arrow.textContent = sub.classList.contains('open') ? '▲' : '▼';
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
              btn.textContent = btn.getAttribute('data-original-text') || 'Submit';
              btn.disabled = false;
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

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
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
