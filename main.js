/* ═══════════════════════════════════════════
   GROWLANE — main.js
   Loads config.json and builds the entire page
═══════════════════════════════════════════ */

async function loadConfig() {
  const res = await fetch('./config.json');
  return res.json();
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

function buildNav(cfg) {
  const nav = document.getElementById('navbar');
  const inner = el('div', 'container');
  const navInner = el('div', 'nav-inner');

  // Logo
  const logo = el('a', 'nav-logo', `<span class="nav-logo-dot"></span>${cfg.brand.name}`);
  logo.href = '#';

  // Links
  const links = el('nav', 'nav-links');
  cfg.nav.links.forEach(l => {
    const a = el('a', 'nav-link', l.label);
    a.href = l.href;
    links.appendChild(a);
  });

  // CTA
  const cta = el('a', 'btn btn--primary nav-cta', cfg.nav.cta.label);
  cta.href = cfg.nav.cta.href;

  // Hamburger
  const ham = el('div', 'nav-hamburger', '<span></span><span></span><span></span>');
  ham.setAttribute('aria-label', 'Menu');

  navInner.appendChild(logo);
  navInner.appendChild(links);
  navInner.appendChild(cta);
  navInner.appendChild(ham);
  inner.appendChild(navInner);
  nav.appendChild(inner);

  // Mobile menu
  const mobileMenu = document.getElementById('mobile-menu');
  cfg.nav.links.forEach(l => {
    const a = el('a', '', l.label); a.href = l.href;
    mobileMenu.appendChild(a);
  });
  const mCta = el('a', 'btn btn--primary', cfg.nav.cta.label);
  mCta.href = cfg.nav.cta.href;
  mobileMenu.appendChild(mCta);

  ham.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );

  // Scroll shadow
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  });
}

function buildHero(cfg) {
  const section = document.getElementById('hero');
  const h = cfg.hero;
  const f = cfg.featured;

  section.innerHTML = `
    <div class="container">
      <div class="hero-inner">
        <div class="hero-content fade-up">
          <span class="eyebrow">${h.eyebrow}</span>
          <h1 class="hero-headline">${h.headline.replace('thinks', '<em>thinks</em>')}</h1>
          <p class="hero-sub">${h.subtext}</p>
          <div class="hero-actions">
            <a href="${h.cta_primary.href}" class="btn btn--primary btn--lg">
              ${h.cta_primary.label} <span class="arrow">→</span>
            </a>
            <a href="${h.cta_secondary.href}" class="btn btn--outline btn--lg">
              ${h.cta_secondary.label}
            </a>
          </div>
        </div>
        <div class="hero-visual fade-up" style="transition-delay:.1s">
          <div class="hero-card">
            <div class="hero-card-tag">
              <span class="tag tag--green">${f.tag}</span>
            </div>
            <div class="hero-card-title">${f.title}</div>
            <div class="hero-card-desc">${f.description}</div>
            <a href="${f.href}" class="btn btn--green" target="_blank" rel="noopener">
              ${f.label} <span class="arrow">→</span>
            </a>
            <div class="hero-card-stat">
              <div class="hero-stat-item">
                <span class="hero-stat-val">7</span>
                <span class="hero-stat-label">Products</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-val">AI</span>
                <span class="hero-stat-label">First</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-val">IN</span>
                <span class="hero-stat-label">India-Built</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function buildProducts(cfg) {
  const section = document.getElementById('products');
  const statusClass = { green: 'tag--green', amber: 'tag--amber', gray: 'tag--gray' };

  const cards = cfg.products.map(p => `
    <div class="product-card">
      <div class="product-card-top">
        <span class="product-icon">${p.icon}</span>
        <span class="tag ${statusClass[p.statusColor] || 'tag--gray'}">${p.status}</span>
      </div>
      <div class="product-name">${p.name}</div>
      <div class="product-cat">${p.category}</div>
      <div class="product-desc">${p.description}</div>
      <div class="product-footer">
        ${p.href !== '#'
          ? `<a href="${p.href}" target="_blank" rel="noopener"
               class="product-link product-link--live">Visit ${p.name} →</a>`
          : `<span class="product-link">Learn more →</span>`
        }
      </div>
    </div>`).join('');

  section.innerHTML = `
    <div class="container">
      <div class="products-header fade-up">
        <span class="eyebrow">The Lab</span>
        <h2 class="section-headline">Everything we're building.</h2>
        <p class="section-sub">Seven products across AI, healthcare, developer tools, and agentic systems. All early stage. All intentional.</p>
      </div>
      <div class="products-grid fade-up" style="transition-delay:.1s">${cards}</div>
    </div>`;
}

function buildPillars(cfg) {
  const section = document.getElementById('whatwedo');
  const cards = cfg.pillars.map(p => `
    <div class="pillar-card fade-up">
      <div class="pillar-card-icon">${p.icon}</div>
      <div class="pillar-card-title">${p.title}</div>
      <div class="pillar-card-desc">${p.description}</div>
    </div>`).join('');

  section.innerHTML = `
    <div class="container">
      <div class="pillars-header">
        <div class="fade-up">
          <span class="eyebrow">What We Do</span>
          <h2 class="section-headline">Four focus areas.<br>One obsession.</h2>
        </div>
        <p class="section-sub fade-up" style="transition-delay:.08s">We build intelligent software across these domains — always with AI as the foundation, never as the afterthought.</p>
      </div>
      <div class="pillars-grid">${cards}</div>
    </div>`;
}

function buildAbout(cfg) {
  const section = document.getElementById('about');
  const a = cfg.about;

  const stats = a.stats.map(s => `
    <div class="about-stat">
      <div class="about-stat-val">${s.value}</div>
      <div class="about-stat-label">${s.label}</div>
    </div>`).join('');

  const paras = a.paragraphs.map(p => `<p>${p}</p>`).join('');

  section.innerHTML = `
    <div class="container">
      <div class="about-inner">
        <div class="fade-up">
          <span class="eyebrow">About Growlane</span>
          <h2 class="about-headline">${a.headline.replace('craft', '<em>craft</em>')}</h2>
          <div class="about-text">${paras}</div>
        </div>
        <div class="about-stats fade-up" style="transition-delay:.1s">${stats}</div>
      </div>
    </div>`;
}

function buildContact(cfg) {
  const section = document.getElementById('contact');
  const c = cfg.contact;

  section.innerHTML = `
    <div class="container">
      <div class="contact-inner">
        <span class="eyebrow fade-up">Get Involved</span>
        <h2 class="contact-headline fade-up">${c.headline}</h2>
        <p class="contact-sub fade-up">${c.subtext}</p>
        <div class="contact-form fade-up">
          <input class="contact-input" id="contact-email" type="email"
            placeholder="${c.placeholder}" autocomplete="off"/>
          <button class="btn btn--primary" id="contact-submit">${c.buttonLabel}</button>
        </div>
        <div class="contact-hint fade-up">${c.hint}</div>
        <div class="contact-confirm" id="contact-confirm">${c.confirmText}</div>
      </div>
    </div>`;

  document.getElementById('contact-submit').addEventListener('click', () => {
    const val = document.getElementById('contact-email').value.trim();
    if (!val || !val.includes('@')) return;
    document.querySelector('.contact-form').style.display = 'none';
    document.querySelector('.contact-hint').style.display = 'none';
    const confirm = document.getElementById('contact-confirm');
    confirm.style.display = 'block';
    // Reset after 5s
    setTimeout(() => {
      document.getElementById('contact-email').value = '';
      document.querySelector('.contact-form').style.display = 'flex';
      document.querySelector('.contact-hint').style.display = 'block';
      confirm.style.display = 'none';
    }, 5000);
  });

  document.getElementById('contact-email').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('contact-submit').click();
  });
}

function buildFooter(cfg) {
  const footer = document.getElementById('footer');
  const b = cfg.brand;
  const f = cfg.footer;

  const cols = f.columns.map(col => `
    <div>
      <div class="footer-col-heading">${col.heading}</div>
      <div class="footer-col-links">
        ${col.links.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
      </div>
    </div>`).join('');

  footer.innerHTML = `
    <div class="container">
      <div class="footer-top">
        <div>
          <div class="footer-brand-name">
            <span class="nav-logo-dot"></span>${b.name}
          </div>
          <div class="footer-brand-desc">${b.description}</div>
        </div>
        ${cols}
      </div>
      <div class="footer-bottom">
        <div class="footer-copy">© ${b.established} ${b.name}. Made in ${b.location}.</div>
        <div class="footer-socials">
          <a class="footer-social" href="${b.github}" target="_blank" rel="noopener">GitHub</a>
          <a class="footer-social" href="${b.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a class="footer-social" href="${b.twitter}" target="_blank" rel="noopener">Twitter</a>
          <a class="footer-social" href="mailto:${b.email}">${b.email}</a>
        </div>
      </div>
    </div>`;
}

function initScrollFadeIn() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

async function init() {
  try {
    const cfg = await loadConfig();
    buildNav(cfg);
    buildHero(cfg);
    buildProducts(cfg);
    buildPillars(cfg);
    buildAbout(cfg);
    buildContact(cfg);
    buildFooter(cfg);
    // Small delay so DOM is painted before observing
    setTimeout(initScrollFadeIn, 50);
  } catch (err) {
    console.error('Growlane: failed to load config', err);
  }
}

document.addEventListener('DOMContentLoaded', init);
