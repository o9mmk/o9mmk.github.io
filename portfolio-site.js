const toggle = document.querySelector('.glass-toggle');
const transparencyPreference = matchMedia('(prefers-reduced-transparency:reduce)');
let explicitGlass = null;
try { explicitGlass = sessionStorage.getItem('portfolio-glass'); }
catch (error) { console.warn('Glass preference cannot be restored; using system preference.', error); }
const applyGlass = () => {
  const enabled = explicitGlass === null ? !transparencyPreference.matches : explicitGlass === 'on';
  document.documentElement.dataset.glass = enabled ? 'on' : 'off';
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.querySelector('span').textContent = enabled ? 'ON' : 'OFF';
};
if (toggle) {
  toggle.hidden = false;
  applyGlass();
  transparencyPreference.addEventListener('change', applyGlass);
  toggle.addEventListener('click', () => {
    explicitGlass = toggle.getAttribute('aria-pressed') === 'true' ? 'off' : 'on';
    applyGlass();
    try { sessionStorage.setItem('portfolio-glass', explicitGlass); }
    catch (error) { console.warn('Glass preference is active for this page only.', error); }
  });
}
const links = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const header = document.querySelector('.site-header');
const darkScene = document.querySelector('.experience > a');
if (header && darkScene) {
  let framePending = false;
  const updateSurface = () => {
    const headerBox = header.getBoundingClientRect();
    const sceneBox = darkScene.getBoundingClientRect();
    const middle = headerBox.top + headerBox.height / 2;
    header.classList.toggle('over-dark', middle >= sceneBox.top && middle <= sceneBox.bottom);
    framePending = false;
  };
  const scheduleSurface = () => {
    if (!framePending) { framePending = true; requestAnimationFrame(updateSurface); }
  };
  addEventListener('scroll', scheduleSurface, {passive:true});
  addEventListener('resize', scheduleSurface, {passive:true});
  addEventListener('pageshow', scheduleSurface);
  addEventListener('load', scheduleSurface);
  updateSurface();
}
const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of links) {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, {rootMargin:'-15% 0px -60% 0px', threshold:0});
  sections.forEach(section => observer.observe(section));
  const hero = document.querySelector('.studio-hero');
  if (hero) new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) links.forEach(link => link.removeAttribute('aria-current'));
  }, {threshold:.4}).observe(hero);
}
