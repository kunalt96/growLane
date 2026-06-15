/* ==========================================================================
   Growlane Agency – Config-Based Rendering + Interactive JS Features
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ------------------------------------------------------------------
       PHASE 1: Fetch database.json and render all sections
    ------------------------------------------------------------------ */
    fetch('database.json')
        .then(res => res.json())
        .then(data => {
            renderNav(data.header);
            renderHero(data.hero);
            renderServices(data.services);
            renderProcess(data.process);
            renderWork(data.work);
            renderAbout(data.about);
            renderTestimonials(data.testimonials);
            renderPricing(data.pricing);
            renderFAQ(data.faq);
            renderContact(data.contact);
            renderFooter(data.footer);

            // After DOM is populated, attach interactive behaviours
            initInteractions();
        })
        .catch(err => console.error('Failed to load database.json:', err));

    /* ------------------------------------------------------------------
       RENDERERS
    ------------------------------------------------------------------ */

    function renderNav(header) {
        const logoText = document.getElementById('logoText');
        const logoImg = document.getElementById('logoImg');
        if (logoText) logoText.textContent = header.logo.text;
        if (logoImg) { logoImg.src = header.logo.src; logoImg.alt = header.logo.alt; }

        const navMenu = document.getElementById('navMenu');
        if (!navMenu) return;
        navMenu.innerHTML = header.nav.map(item =>
            `<li><a href="${item.href}" class="${item.class}">${item.label}</a></li>`
        ).join('');
    }

    function renderHero(hero) {
        const badge = document.getElementById('heroBadgeText');
        if (badge) badge.textContent = hero.badge;

        const headline = document.getElementById('heroHeadline');
        if (headline) headline.innerHTML = hero.headline;

        const sub = document.getElementById('heroSubheadline');
        if (sub) sub.textContent = hero.subtitle;

        const btns = document.getElementById('heroButtons');
        if (btns) {
            btns.innerHTML = hero.buttons.map(b => {
                const iconHtml = b.icon
                    ? ` <span class="material-symbols-outlined text-[20px] transition-transform">${b.icon}</span>`
                    : '';
                return `<a href="${b.href}" class="${b.class}">${b.label}${iconHtml}</a>`;
            }).join('');
        }
    }

    function renderServices(services) {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;
        grid.innerHTML = services.map(s => {
            const variantStyle = s.variant
                ? ' style="grid-column: span 1; background-color: var(--color-surface-container-low); border: none;"'
                : '';
            const tags = s.tags.map(t => `<span class="tag">${t}</span>`).join('');
            return `
                <div class="service-card reveal"${variantStyle}>
                    <div class="service-icon">
                        <span class="material-symbols-outlined">${s.icon}</span>
                    </div>
                    <h3 class="text-headline-sm text-on-background">${s.title}</h3>
                    <p class="text-body-md">${s.description}</p>
                    <div class="work-tags">${tags}</div>
                </div>`;
        }).join('');
    }

    function renderProcess(process) {
        const grid = document.getElementById('processGrid');
        if (!grid) return;
        grid.innerHTML = process.map(p => `
            <div class="reveal" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px;">
                <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--color-bg-primary); display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 800; color: var(--color-primary-container); border: 2px solid var(--color-surface-dim);">${p.step}</div>
                <h3 class="text-headline-sm text-on-background">${p.title}</h3>
                <p class="text-body-md">${p.description}</p>
            </div>`).join('');
    }

    function renderWork(work) {
        const grid = document.getElementById('workGrid');
        if (!grid) return;
        grid.innerHTML = work.map(w => {
            const wideStyle = w.wide ? ' grid-column: span 2;' : '';
            const imgHeight = w.wide ? ' height: 380px;' : '';
            return `
                <div class="work-card reveal" style="background-color: #231a12; border-color: rgba(255,255,255,0.05);${wideStyle}">
                    <div class="work-image" style="${imgHeight}">
                        <img src="${w.image}" alt="${w.category}">
                    </div>
                    <div class="work-info">
                        <span class="text-label-caps text-primary-container">${w.category}</span>
                        <h3 class="text-headline-sm" style="color: #ffffff;">${w.title}</h3>
                        <p class="text-body-md" style="color: rgba(255,255,255,0.7);">${w.description}</p>
                        <a href="${w.link}" class="btn-tertiary" style="color: var(--color-primary-container);">Read Case Study <span class="material-symbols-outlined" style="vertical-align: middle; font-size: 16px;">arrow_forward</span></a>
                    </div>
                </div>`;
        }).join('');
    }

    function renderAbout(about) {
        const info = document.getElementById('aboutInfo');
        if (info) {
            info.innerHTML = `
                <span class="text-label-caps text-primary-container">${about.label}</span>
                <h2 class="text-headline-lg text-on-background">${about.heading}</h2>
                <p class="text-body-lg">${about.description}</p>`;
        }

        const values = document.getElementById('aboutValues');
        if (values) {
            values.innerHTML = `<div class="space-y-8">${about.values.map(v => `
                <div class="flex gap-4">
                    <div style="width: 56px; height: 56px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; box-shadow: var(--shadow-level-1); flex-shrink: 0;">
                        <span class="material-symbols-outlined text-primary-container">${v.icon}</span>
                    </div>
                    <div>
                        <h4 class="text-headline-sm" style="font-size: 1.25rem;">${v.title}</h4>
                        <p class="text-body-md">${v.description}</p>
                    </div>
                </div>`).join('')}</div>`;
        }
    }

    function renderTestimonials(testimonials) {
        const track = document.getElementById('testimonialTrack');
        if (!track) return;

        function cardHTML(t) {
            const stars = Array(t.rating).fill('<span class="material-symbols-outlined">star</span>').join('');
            return `
                <div class="marquee-card">
                    <div class="testimonial-rating">${stars}</div>
                    <p class="text-body-md">${t.text}</p>
                    <div class="testimonial-author">
                        <div class="author-avatar">${t.initials}</div>
                        <div>
                            <h4 class="text-button">${t.author}</h4>
                            <p class="text-body-md" style="font-size: 13px;">${t.company}</p>
                        </div>
                    </div>
                </div>`;
        }

        // Original + duplicate for infinite marquee
        const cards = testimonials.map(cardHTML).join('');
        track.innerHTML = cards + cards;
    }

    function renderPricing(pricing) {
        const grid = document.getElementById('pricingGrid');
        if (!grid) return;
        grid.innerHTML = pricing.map(p => {
            const isHL = p.highlight;
            const cardStyle = isHL
                ? ' style="background-color: #1a1714; color: #ffffff; border-color: var(--color-primary-container); transform: translateY(-10px); box-shadow: var(--shadow-level-3);"'
                : '';
            const titleStyle = isHL ? ' style="color: #ffffff;"' : '';
            const descStyle = isHL ? ' style="color: rgba(255,255,255,0.7);"' : '';
            const priceLabelStyle = isHL ? ' style="opacity: 0.7; color: rgba(255,255,255,0.7);"' : ' style="opacity: 0.7;"';
            const priceStyle = isHL ? ' style="color: #ffffff;"' : '';
            const periodStyle = isHL ? ' style="color: rgba(255,255,255,0.7);"' : '';
            const listStyle = isHL ? ' style="list-style: none; margin-bottom: 24px; flex-grow: 1; color: rgba(255,255,255,0.9);"' : ' style="list-style: none; margin-bottom: 24px; flex-grow: 1;"';
            const suffix = p.priceSuffix ? `<span style="font-size: 1.5rem; font-weight: 400; opacity: 0.6;">${p.priceSuffix}</span>` : '';
            const badge = p.badge
                ? `<div style="position: absolute; top: 12px; right: 20px; background-color: var(--color-primary-container); color: white; padding: 4px 12px; border-radius: var(--rounded-full); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">${p.badge}</div>`
                : '';
            const features = p.features.map(f =>
                `<li class="flex items-center gap-2"><span class="material-symbols-outlined text-primary-container" style="font-size: 18px;">check_circle</span> ${f}</li>`
            ).join('');

            return `
                <div class="service-card reveal"${cardStyle}>
                    ${badge}
                    <h3 class="text-headline-sm${isHL ? '' : ' text-on-background'}"${titleStyle}>${p.title}</h3>
                    <p class="text-body-md"${descStyle}>${p.description}</p>
                    <div style="margin: 20px 0;">
                        <span class="text-label-caps"${priceLabelStyle}>${p.priceLabel}</span>
                        <div class="text-headline-xl"${priceStyle}>${p.price}${suffix}</div>
                        <span class="text-body-md"${periodStyle}>${p.period}</span>
                    </div>
                    <ul class="space-y-4"${listStyle}>${features}</ul>
                    <a href="#contact" class="${p.buttonClass}">${p.buttonLabel}</a>
                </div>`;
        }).join('');
    }

    function renderFAQ(faq) {
        const list = document.getElementById('faqList');
        if (!list) return;
        list.innerHTML = faq.map(f => `
            <div class="faq-item reveal">
                <button class="faq-trigger">
                    <span>${f.question}</span>
                    <span class="material-symbols-outlined faq-icon">add</span>
                </button>
                <div class="faq-content">
                    <div class="faq-content-inner">
                        <p class="text-body-md">${f.answer}</p>
                    </div>
                </div>
            </div>`).join('');
    }

    function renderContact(contact) {
        const info = document.getElementById('contactInfo');
        if (!info) return;
        const features = contact.features.map(f =>
            `<div class="flex items-center gap-2 text-body-md" style="margin-bottom: 8px;">
                <span class="material-symbols-outlined text-success" style="font-size: 20px;">check_circle</span> ${f}
            </div>`
        ).join('');
        info.innerHTML = `
            <span class="text-label-caps text-primary-container">${contact.label}</span>
            <h2 class="text-headline-lg text-on-background">${contact.heading}</h2>
            <p class="text-body-lg">${contact.description}</p>
            <div style="margin-top: 16px;">${features}</div>`;
    }

    function renderFooter(footer) {
        const el = document.getElementById('footer');
        if (!el) return;
        const cols = footer.columns.map(col => {
            const links = col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('');
            return `
                <div class="footer-col">
                    <h4>${col.title}</h4>
                    <ul class="footer-links">${links}</ul>
                </div>`;
        }).join('');

        const policies = footer.policies.map(p =>
            `<a href="${p.href}" style="color: inherit; text-decoration: none; opacity: 0.6;">${p.label}</a>`
        ).join('');

        el.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <a href="#" class="logo footer-logo">
                            <img src="${footer.logo.src}" alt="${footer.logo.alt}">
                            <span>${footer.logo.text}</span>
                        </a>
                        <p style="font-size: 14px; opacity: 0.7;">${footer.description}</p>
                    </div>
                    ${cols}
                </div>
                <div class="footer-bottom">
                    <p>${footer.copyright}</p>
                    <div style="display: flex; gap: 24px;">${policies}</div>
                </div>
            </div>`;
    }

    /* ------------------------------------------------------------------
       PHASE 2: Interactive Behaviours (called after render)
    ------------------------------------------------------------------ */
    function initInteractions() {

        // 1. Mobile Menu Toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuBtn && navMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = isActive ? 'close' : 'menu';
            });

            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.querySelector('.material-symbols-outlined').textContent = 'menu';
                });
            });
        }

        // 2. Header Scroll Effect
        const header = document.querySelector('.header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 40) {
                    header.style.backgroundColor = 'rgba(255, 248, 245, 0.95)';
                    header.style.boxShadow = 'var(--shadow-nav)';
                    header.style.height = '70px';
                } else {
                    header.style.backgroundColor = 'rgba(255, 248, 245, 0.8)';
                    header.style.boxShadow = 'none';
                    header.style.height = '80px';
                }
            });
        }

        // 3. Scroll Reveal (Intersection Observer)
        const revealElements = document.querySelectorAll('.reveal');
        if ('IntersectionObserver' in window && revealElements.length > 0) {
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            });
            revealElements.forEach(el => revealObserver.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('active'));
        }

        // 4. FAQ Accordion Toggle (single-open behavior)
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const trigger = item.querySelector('.faq-trigger');
            const content = item.querySelector('.faq-content');
            if (trigger && content) {
                // Ensure content is collapsed initially
                content.style.maxHeight = '0px';
                trigger.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    // Collapse all items first
                    faqItems.forEach(other => {
                        other.classList.remove('active');
                        const otherContent = other.querySelector('.faq-content');
                        if (otherContent) otherContent.style.maxHeight = '0px';
                    });
                    // If it was not active, expand this one
                    if (!isActive) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });

        // 5. Contact Form Validation and Submission (Mock)
        const contactForm = document.getElementById('contactForm');
        const formAlert = document.getElementById('formAlert');

        if (contactForm && formAlert) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                const messageInput = document.getElementById('message');

                let isValid = true;
                let errorMessage = '';

                formAlert.className = 'form-alert';
                formAlert.style.display = 'none';

                if (!nameInput.value.trim()) {
                    isValid = false;
                    errorMessage = 'Please enter your name.';
                } else if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                } else if (!messageInput.value.trim()) {
                    isValid = false;
                    errorMessage = 'Please enter your message.';
                }

                if (!isValid) {
                    formAlert.textContent = errorMessage;
                    formAlert.classList.add('error');
                    formAlert.style.display = 'block';
                    return;
                }

                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                const formData = new FormData(contactForm);

                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Sending...';
                submitBtn.style.opacity = '0.7';

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        formAlert.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
                        formAlert.classList.add('success');
                        formAlert.style.display = 'block';
                        contactForm.reset();
                    } else {
                        formAlert.textContent = data.message || 'Error: Unable to send your message.';
                        formAlert.classList.add('error');
                        formAlert.style.display = 'block';
                    }
                } catch (error) {
                    formAlert.textContent = 'Something went wrong. Please try again.';
                    formAlert.classList.add('error');
                    formAlert.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.style.opacity = '1';
                }
            });
        }

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(String(email).toLowerCase());
        }
    }
});
