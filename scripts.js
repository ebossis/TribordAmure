// --- Carousel (fade-in + autoplay) ---
(function(){
  const root = document.getElementById('accueil');
  if (!root) return;
  const slides = Array.from(root.querySelectorAll('.slide'));
  const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));
  const nextBtn = document.querySelector('.carousel-next');
  const prevBtn = document.querySelector('.carousel-prev');
  if (slides.length <= 1) return;

  let current = 0;
  const appearDuration = 900;
  const holdTime = 2600;
  let timer = null, kick = null;

  // Init state
  slides.forEach((s,i)=>{
    s.classList.remove('appearing','visible');
    if (i === 0) s.classList.add('visible');
  });
  function setActiveDot(i){
    indicators.forEach((d,idx)=> d.classList.toggle('active', idx===i));
  }
  setActiveDot(0);

  function goTo(i){
    if (i === current || i < 0 || i >= slides.length) return;
    const prev = slides[current];
    const next = slides[i];
    next.classList.add('appearing'); // fade-in above

    setTimeout(()=>{
      next.classList.remove('appearing');
      next.classList.add('visible');

      prev.classList.remove('visible');
      // instant hide prev without leaving inline opacity stuck
      const oldTransition = prev.style.transition;
      prev.style.transition = 'none';
      prev.style.opacity = '0';
      void prev.offsetHeight;
      prev.style.transition = oldTransition || '';
      prev.style.opacity = '';

      current = i;
      setActiveDot(current);
    }, appearDuration);
  }

  function next(){ goTo((current + 1) % slides.length); }
  function prev(){ goTo((current - 1 + slides.length) % slides.length); }

  function start(){
    stop();
    kick = setTimeout(next, holdTime); // first change
    timer = setInterval(next, holdTime + appearDuration);
  }
  function stop(){
    if (timer) { clearInterval(timer); timer = null; }
    if (kick) { clearTimeout(kick); kick = null; }
  }

  // Controls
  nextBtn && nextBtn.addEventListener('click', ()=>{ next(); start(); });
  prevBtn && prevBtn.addEventListener('click', ()=>{ prev(); start(); });
  indicators.forEach((dot, idx)=> dot.addEventListener('click', ()=>{ goTo(idx); start(); }));

  // Autoplay
  start();
})();

// --- Navigation (smooth scroll + active link + header offset) ---
class Navigation {
  constructor(){
    this.header = document.querySelector('header');
    this.sections = document.querySelectorAll('section[id]');
    this.links = document.querySelectorAll('a[href^="#"]');
    this.init();
  }
  init(){
    this.applyScrollMargin();
    window.addEventListener('resize', ()=> this.applyScrollMargin());
    this.bind();
    this.observeActive();
  }
  applyScrollMargin(){
    const offset = this.header ? (this.header.offsetHeight || 0) : 0;
    this.sections.forEach(s => s.style.scrollMarginTop = (offset + 8) + 'px');
  }
  bind(){
    const duration = 1200;
    const easeInOutCubic = t => t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
    const topFor = el => el.getBoundingClientRect().top + window.scrollY - (this.header ? this.header.offsetHeight : 0) - 8;
    const animateTo = y => {
      const startY = window.scrollY || window.pageYOffset;
      const delta = y - startY;
      const start = performance.now();
      const step = now => {
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOutCubic(t);
        window.scrollTo(0, startY + delta * e);
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    this.links.forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href') || '';
        if (!href.startsWith('#')) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        animateTo(topFor(target));
      });
    });
  }
  observeActive(){
    const navLinks = document.querySelectorAll('.nav-link');
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if (entry.isIntersecting){
          const id = entry.target.id;
          navLinks.forEach(a => {
            if (a.getAttribute('href') === '#' + id) a.classList.add('active');
            else a.classList.remove('active');
          });
        }
      });
    }, { threshold: 0.6 });
    this.sections.forEach(sec=> io.observe(sec));
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  new Navigation();
});

// Keep the lightweight helper too (no harm if Navigation already did it)
(function(){
  const header = document.querySelector('header');
  const sections = document.querySelectorAll('section[id]');
  function applyOffset(){
    const offset = header ? (header.offsetHeight || 0) : 0;
    sections.forEach(s => { s.style.scrollMarginTop = (offset + 8) + 'px'; });
  }
  applyOffset();
  window.addEventListener('resize', applyOffset);
})();

// Single smooth scroller (guarded) in case someone adds plain anchor links elsewhere
(function(){
  if (window.__smoothNavBound) return; window.__smoothNavBound = true;
  const header=document.querySelector('header');
  const duration=1200;
  const ease=t=>t<0.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const topFor=el=>el.getBoundingClientRect().top+window.scrollY-(header?header.offsetHeight:0)-8;
  const animateTo=y=>{const s=window.scrollY,d=y-s,a=performance.now();const step=n=>{const t=Math.min(1,(n-a)/duration);window.scrollTo(0,s+d*ease(t));if(t<1)requestAnimationFrame(step)};requestAnimationFrame(step)};
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');if(!id||id==='#')return;const el=document.querySelector(id);if(!el)return;e.preventDefault();animateTo(topFor(el));}));
})();

// --- Mobile menu (hamburger) toggle ---
(function(){
  const btn = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  function toggle(){
    const willOpen = menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', String(willOpen));
    document.body.classList.toggle('overflow-hidden', willOpen);
  }
  btn.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', ()=>{
    if (!menu.classList.contains('hidden')) toggle();
  }));
})();