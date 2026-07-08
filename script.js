// Como Roofing UK Ltd — shared behaviour (single-page site)
document.addEventListener('DOMContentLoaded', () => {

  /* Sticky header state */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-main');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  }

  /* Scroll-spy nav highlight */
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-main a[href^="#"]:not(.nav-cta)')];
  if (sections.length) {
    const updateActive = () => {
      const y = window.scrollY + (header ? header.offsetHeight : 80) + 60;
      let activeId = sections[0].id;
      sections.forEach(s => { if (s.offsetTop <= y) activeId = s.id; });
      navLinks.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + activeId));
    };
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 70 + 'ms';
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* FAQ accordion */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('is-open', !isOpen);
      q.setAttribute('aria-expanded', String(!isOpen));
      a.style.maxHeight = !isOpen ? a.scrollHeight + 'px' : null;
    });
  });

  /* Gallery filter */
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item=>{
        item.classList.toggle('is-hidden', f!=='all' && item.dataset.cat!==f);
      });
    });
  });

  /* Quote form — client-side validation, front-end only (no backend wired up) */
  const form = document.querySelector('#quote-form');
  if (form) {
    const rules = {
      name: { required: true, label: 'your name' },
      phone: { required: true, label: 'a phone number',
        test: v => /^[0-9+()\s-]{7,20}$/.test(v.trim()), msg: 'Enter a valid phone number' },
      email: { required: true, label: 'your email address',
        test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter a valid email address' },
      postcode: { required: true, label: 'your postcode',
        test: v => /^[A-Z]{1,2}[0-9][A-Z0-9]?\s*[0-9][A-Z]{2}$/i.test(v.trim()), msg: 'Enter a valid UK postcode, e.g. EC1A 1AA' },
      service: { required: true, label: 'the service you need' },
      urgency: { required: true, label: 'how urgent it is' },
    };

    const fieldWrap = (input) => input.closest('.field');
    const errorEl = (input) => document.getElementById('err-' + input.id);

    const setError = (input, msg) => {
      const wrap = fieldWrap(input);
      wrap.classList.add('has-error');
      wrap.classList.remove('is-valid');
      errorEl(input).textContent = msg;
    };
    const setValid = (input) => {
      const wrap = fieldWrap(input);
      wrap.classList.remove('has-error');
      wrap.classList.add('is-valid');
      errorEl(input).textContent = '';
    };

    const validateField = (input) => {
      const rule = rules[input.id];
      if (!rule) return true;
      const val = input.value || '';
      if (rule.required && !val.trim()) {
        setError(input, `Please enter ${rule.label}.`);
        return false;
      }
      if (rule.test && !rule.test(val)) {
        setError(input, rule.msg);
        return false;
      }
      setValid(input);
      return true;
    };

    Object.keys(rules).forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => { if (fieldWrap(input).classList.contains('has-error')) validateField(input); });
      input.addEventListener('change', () => { if (fieldWrap(input).classList.contains('has-error')) validateField(input); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = form.querySelector('.form-status');
      let firstInvalid = null;
      let allValid = true;
      Object.keys(rules).forEach(id => {
        const input = document.getElementById(id);
        if (!input) return;
        const ok = validateField(input);
        if (!ok) { allValid = false; if (!firstInvalid) firstInvalid = input; }
      });

      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields above and try again.';
        status.classList.remove('is-success');
        status.classList.add('is-error');
        firstInvalid.focus();
        return;
      }

      status.classList.remove('is-error');
      status.textContent = 'Thanks — your enquiry has been noted. (Demo form: connect to your booking system or email service to go live.)';
      status.classList.add('is-success');
      form.reset();
      form.querySelectorAll('.field').forEach(w => w.classList.remove('is-valid','has-error'));
      form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    });
  }

  /* Footer year */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ===================================================================
     INTERACTIVITY LAYER
     =================================================================== */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll progress bar */
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop || document.body.scrollTop);
      const height = h.scrollHeight - h.clientHeight;
      progressBar.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive:true });
    updateProgress();
  }

  /* Custom cursor / magnetic buttons / photo tilt removed — kept the interface
     calm and predictable rather than layering on cursor-replacement effects. */

  /* Hero staggered reveal + parallax */
  const hero = document.querySelector('#home');
  if (hero) {
    requestAnimationFrame(() => requestAnimationFrame(() => hero.classList.add('hero-in')));
    const heroImg = hero.querySelector('.hero-img');
    if (heroImg && !reduceMotion) {
      const onHeroScroll = () => {
        const r = hero.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        heroImg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
      };
      window.addEventListener('scroll', onHeroScroll, { passive:true });
      onHeroScroll();
    }
  }

  /* Animated counters */
  const counters = document.querySelectorAll('.count');
  if (counters.length) {
    const animateCount = (el) => {
      const target = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const duration = 1400;
      const start = performance.now();
      const startVal = 0;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = startVal + (target - startVal) * eased;
        el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString('en-GB');
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-GB');
      };
      if (reduceMotion) { el.textContent = decimals ? target.toFixed(decimals) : target.toLocaleString('en-GB'); }
      else requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { animateCount(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold:0.6 });
      counters.forEach(el => cio.observe(el));
    } else counters.forEach(animateCount);
  }

  /* Gallery lightbox */
  const galleryItems = [...document.querySelectorAll('.gallery-item')];
  const lightbox = document.getElementById('lightbox');
  if (galleryItems.length && lightbox) {
    const lbImg = document.getElementById('lightbox-img');
    const lbCap = document.getElementById('lightbox-cap');
    let current = 0;
    const dataFor = (item) => ({
      src: item.querySelector('img').src,
      alt: item.querySelector('img').alt,
      title: item.querySelector('.photo-card-label b')?.textContent || '',
      loc: item.querySelector('.photo-card-label span')?.textContent || ''
    });
    const show = (i) => {
      current = (i + galleryItems.length) % galleryItems.length;
      const visible = galleryItems.filter(it => !it.classList.contains('is-hidden'));
      const target = visible.includes(galleryItems[current]) ? galleryItems[current] : visible[0];
      const d = dataFor(target);
      lbImg.src = d.src; lbImg.alt = d.alt;
      lbCap.textContent = d.title ? `${d.title} — ${d.loc}` : '';
    };
    const open = (i) => { show(i); lightbox.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const close = () => { lightbox.classList.remove('is-open'); document.body.style.overflow = ''; };
    galleryItems.forEach((item, i) => item.addEventListener('click', () => open(i)));
    document.getElementById('lightbox-close').addEventListener('click', close);
    document.getElementById('lightbox-prev').addEventListener('click', () => show(current - 1));
    document.getElementById('lightbox-next').addEventListener('click', () => show(current + 1));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
    window.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  /* Testimonial carousel — drag to scroll + nav buttons */
  const track = document.getElementById('reviews-track');
  if (track) {
    let isDown = false, startX = 0, startScroll = 0;
    track.addEventListener('pointerdown', (e) => {
      isDown = true; track.classList.add('is-dragging');
      startX = e.clientX; startScroll = track.scrollLeft;
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!isDown) return;
      track.scrollLeft = startScroll - (e.clientX - startX);
    });
    const endDrag = () => { isDown = false; track.classList.remove('is-dragging'); };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointerleave', endDrag);
    const cardWidth = () => track.querySelector('.lap-card')?.getBoundingClientRect().width + 24 || 300;
    document.getElementById('reviews-prev')?.addEventListener('click', () => track.scrollBy({ left:-cardWidth(), behavior:'smooth' }));
    document.getElementById('reviews-next')?.addEventListener('click', () => track.scrollBy({ left:cardWidth(), behavior:'smooth' }));
  }
});
