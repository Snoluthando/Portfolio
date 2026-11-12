(() => {
  const d = document;
  d.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.getElementById('year').textContent = new Date().getFullYear();

  // Nav: mobile toggle
  const nav = d.getElementById('nav'), toggle = d.getElementById('navToggle');
  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? 'Close' : 'Menu';
    d.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  d.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });

  // Active section detection
  const links = [...nav.querySelectorAll('.nav__list a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(es => es.forEach(e => {
    const link = map.get(e.target.id);
    if (e.isIntersecting && link) { links.forEach(l => l.classList.remove('is-active')); link.classList.add('is-active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const el = d.getElementById(id); if (el) spy.observe(el); });

  // Reveal on scroll
  const rev = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); rev.unobserve(e.target); }
  }), { threshold: .12 });
  d.querySelectorAll('.reveal').forEach(el => rev.observe(el));

  // Scroll loop: nav background + hero parallax
  const img = d.querySelector('[data-parallax]'), speed = img ? +img.dataset.parallax : 0;
  let ticking = false;
  const update = () => {
    nav.classList.toggle('is-solid', scrollY > 40);
    if (img && !reduce && scrollY < innerHeight * 1.2) img.style.transform = `translate3d(0,${-scrollY * speed}px,0)`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();

  // Cursor: fine pointers only
  const cur = d.getElementById('cursor');
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    let x = 0, y = 0, raf = 0;
    addEventListener('pointermove', e => {
      x = e.clientX; y = e.clientY; cur.classList.add('is-on');
      raf = raf || requestAnimationFrame(() => { cur.style.transform = `translate(${x}px,${y}px)`; raf = 0; });
    });
    d.addEventListener('pointerover', e => cur.classList.toggle('is-big', !!e.target.closest('a,button')));
    d.documentElement.addEventListener('pointerleave', () => cur.classList.remove('is-on'));
  }
})();