(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // Footer year
  $('#year').textContent = new Date().getFullYear();

  // Mobile menu
  const toggle = $('.menu-toggle');
  const nav = $('#nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', open);
    nav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('.nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });

  // Active nav link on scroll
  const links = $$('.nav a');
  const targets = links.map(a => $(a.getAttribute('href')));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach(t => t && spy.observe(t));

  // Works: per-item preview colour + cursor-following preview
  $$('.work a').forEach(a => {
    const prev = $('.work-preview', a);
    prev.style.setProperty('--h', a.dataset.hue);
    a.addEventListener('mousemove', e => {
      const r = a.getBoundingClientRect();
      prev.style.right = 'auto';
      prev.style.left = Math.min(e.clientX - r.left + 20, r.width - 240) + 'px';
    });
    a.addEventListener('click', e => e.preventDefault());
  });

  // FAQ: one open at a time
  const items = $$('.faq details');
  items.forEach(d => d.addEventListener('toggle', () => {
    if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
  }));

  // Contact form (front-end validation only — connect to a backend to send)
  const form = $('.contact-form');
  const status = $('.form-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('input[required], textarea[required]', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    status.textContent = ok ? 'Thanks! Your message is ready to send — hook this form up to a backend or a service like Formspree.' : 'Please fill in all fields with valid details.';
    if (ok) form.reset();
  });
})();
