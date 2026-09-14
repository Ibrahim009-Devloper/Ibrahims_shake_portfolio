/* ─────────────────────────────────────
   main.js - MD. Ibrahim Shake Shuvo Portfolio
   B2B Lead Generation & Web Scraping Specialist
───────────────────────────────────── */

/* ── 1. Theme Switcher (Light default, Dark opt-in) ── */
(function() {
    const root = document.documentElement;
    const STORAGE_KEY = 'ibrahim-theme';
    const LABEL = {
        light: 'Switch to dark theme',
        dark: 'Switch to light theme',
    };

    const currentTheme = () =>
        root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

    const read = () => {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    };
    const write = (theme) => {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
    };

    let swapTimer = null;

    function applyTheme(theme, { animate = false } = {}) {
        if (theme === currentTheme()) return;

        if (animate) {
            root.classList.add('theme-swapping');
            clearTimeout(swapTimer);
            swapTimer = setTimeout(() => root.classList.remove('theme-swapping'), 340);
        }

        if (theme === 'dark') root.setAttribute('data-theme', 'dark');
        else root.removeAttribute('data-theme');

        syncControl();
    }

    function syncControl() {
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        const label = LABEL[currentTheme() === 'dark' ? 'dark' : 'light'];
        button.setAttribute('aria-label', label);
        button.setAttribute('title', label);
    }

    // Always open in dark theme
    applyTheme('dark');
    write('dark');

    function wire() {
        syncControl();
        const button = document.getElementById('theme-toggle');
        if (!button) return;
        button.addEventListener('click', () => {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            write(next);
            applyTheme(next, { animate: true });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wire, { once: true });
    } else {
        wire();
    }

    window.addEventListener('storage', (e) => {
        if (e.key !== STORAGE_KEY) return;
        if (e.newValue === 'dark' || e.newValue === 'light') {
            applyTheme(e.newValue, { animate: true });
        }
    });
})();

/* ── 2. Nav: Flat → Frosted Pill on Scroll ── */
(function() {
    const nav = document.getElementById('nav');
    if (!nav) return;
    let ticking = false;
    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);

    updateNav();
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                updateNav();
                ticking = false;
            });
        }
    }, { passive: true });
})();

/* ── 3. Scroll Reveal ── */
(function() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const siblings = [...(entry.target.parentElement?.children || [])].filter(c => c.classList.contains('reveal'));
            const idx = siblings.indexOf(entry.target);
            setTimeout(() => entry.target.classList.add('in'), Math.max(0, idx) * 80);
            revealObs.unobserve(entry.target);
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObs.observe(el));
})();

/* ── 4. Interactive Hero Picture Puzzle (Gemini Generated Photo) ── */
(function initPuzzle() {
    const wrap = document.getElementById('puzzle-wrap');
    const grid = document.getElementById('puzzle-grid');
    const hint = document.getElementById('puzzle-hint');
    const peekBtn = document.getElementById('puzzle-peek-btn');
    const shuffleBtn = document.getElementById('puzzle-shuffle');
    if (!wrap || !grid) return;

    const IMAGE = '/assets/hero_portrait.jpg?v=2';
    let cols = 2;
    let pieces = [];
    let solved = false;
    let lifted = null;

    const source = new Image();
    let imgW = 1000, imgH = 1000;

    function applyGeometry() {
        const box = wrap.getBoundingClientRect();
        if (!box.width || !imgW) return;
        const scale = Math.max(box.width / imgW, box.height / imgH);
        const bgW = imgW * scale;
        const bgH = imgH * scale;
        const x = (box.width - bgW) / 2;
        const y = (box.height - bgH) / 2;
        const cell = box.width / cols;

        wrap.style.setProperty('--pz-bg-size', `${bgW.toFixed(2)}px ${bgH.toFixed(2)}px`);
        wrap.style.setProperty('--pz-peek-pos', `${x.toFixed(2)}px ${y.toFixed(2)}px`);

        pieces.forEach(p => {
            const px = (p.source % cols) * cell;
            const py = Math.floor(p.source / cols) * cell;
            p.el.style.setProperty('--bx', `${(x - px).toFixed(2)}px`);
            p.el.style.setProperty('--by', `${(y - py).toFixed(2)}px`);
        });
    }

    function place(piece) {
        piece.el.style.setProperty('--col', piece.slot % cols);
        piece.el.style.setProperty('--row', Math.floor(piece.slot / cols));
    }

    function build() {
        solved = false;
        lifted = null;
        wrap.classList.remove('is-solved');
        if (hint) hint.classList.remove('hidden');
        setPeek(false);
        wrap.style.setProperty('--pz-cols', cols);

        const total = cols * cols;
        grid.textContent = '';
        pieces = [];

        for (let i = 0; i < total; i++) {
            const el = document.createElement('button');
            el.type = 'button';
            el.className = 'pz-piece';
            const piece = { el, source: i, slot: i };
            el._piece = piece;
            pieces.push(piece);
            grid.appendChild(el);
        }

        applyGeometry();
        scramble();
    }

    function scramble() {
        const total = pieces.length;
        const order = pieces.map(p => p.source);

        for (let attempt = 0; attempt < 24; attempt++) {
            for (let i = order.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [order[i], order[j]] = [order[j], order[i]];
            }
            const settled = order.filter((src, slot) => src === slot).length;
            if (settled === 0 || settled <= total / 3) break;
        }

        order.forEach((src, slot) => {
            pieces[src].slot = slot;
        });
        pieces.forEach(place);

        solved = false;
        wrap.classList.remove('is-solved');
        if (hint) hint.classList.remove('hidden');
    }

    function swap(a, b) {
        if (!a || !b || a === b) return;
        const slot = a.slot;
        a.slot = b.slot;
        b.slot = slot;
        place(a);
        place(b);
        if (hint) hint.classList.add('hidden');
        checkSolved();
    }

    function checkSolved() {
        if (solved || pieces.some(p => p.slot !== p.source)) return;
        solved = true;
        setPeek(false);
        pieces.forEach(p => {
            p.el.disabled = true;
        });
        wrap.classList.add('is-solved');
        if (hint) hint.classList.add('hidden');
    }

    /* Click-to-swap and Drag support */
    grid.addEventListener('click', e => {
        const el = e.target.closest('.pz-piece');
        if (!el || solved) return;
        const piece = el._piece;

        if (!lifted) {
            lifted = piece;
            piece.el.classList.add('is-lifted');
            return;
        }
        if (lifted === piece) {
            lifted.el.classList.remove('is-lifted');
            lifted = null;
            return;
        }
        lifted.el.classList.remove('is-lifted');
        swap(lifted, piece);
        lifted = null;
    });

    wrap.addEventListener('pointerenter', () => wrap.classList.add('is-hovering'));
    wrap.addEventListener('pointerleave', () => wrap.classList.remove('is-hovering'));

    function setPeek(on) {
        if (!peekBtn) return;
        peekBtn.setAttribute('aria-pressed', String(on));
        wrap.classList.toggle('is-peeking', on);
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            pieces.forEach(p => { p.el.disabled = false; });
            scramble();
        });
    }

    if (peekBtn) {
        peekBtn.addEventListener('click', () => {
            if (solved) return;
            setPeek(peekBtn.getAttribute('aria-pressed') !== 'true');
        });
    }

    source.onload = () => {
        if (source.naturalWidth) {
            imgW = source.naturalWidth;
            imgH = source.naturalHeight;
        }
        applyGeometry();
    };
    source.src = IMAGE;

    window.addEventListener('resize', applyGeometry, { passive: true });
    build();
})();

/* ── 5. Case Study Modal Data & Handlers ── */
const CASE_STUDIES = {
    'b2b-leads': {
        title: 'B2B Decision Maker Prospect List',
        category: 'B2B Lead Generation · Outbound Sales',
        objective: 'Build a targeted list of 500+ verified decision-makers (Founders, VP of Sales, Operations Directors) for a B2B SaaS outreach campaign.',
        source: 'LinkedIn Sales Navigator, Apollo, Crunchbase, Company About & Team pages.',
        fields: ['Full Name', 'Job Title', 'Work Email', 'Company Name', 'Website', 'Headcount', 'HQ Location', 'LinkedIn Profile URL', 'Verification Status'],
        process: [
            'Filter target companies by ICP (B2B SaaS, 15–200 employees, US/UK/Canada).',
            'Identify primary and secondary decision-makers per company.',
            'Extract direct work emails using syntax lookup & MX pattern matching.',
            'Run SMTP ping verification to guarantee 0% bounce rate.',
            'Format and clean data into ready-to-import CSV/Excel.'
        ],
        tools: ['Python', 'Apollo', 'NeverBounce', 'Excel / CSV'],
        sampleRows: [
            { name: 'Alex Henderson', title: 'VP of Sales', company: 'NovaScale Media', email: 'alex@novascale.io', loc: 'Austin, TX', status: 'Verified Deliverable' },
            { name: 'Sarah Miller', title: 'Co-Founder & COO', company: 'Vanguard Logistics', email: 'sarah.m@vanguard.co', loc: 'Chicago, IL', status: 'Verified Deliverable' },
            { name: 'David Zhao', title: 'Head of Growth', company: 'CloudPulse Tech', email: 'dzhao@cloudpulse.net', loc: 'San Francisco, CA', status: 'Verified Deliverable' },
            { name: 'Elena Rostova', title: 'Director of RevOps', company: 'OmniFlow Solutions', email: 'elena@omniflow.com', loc: 'New York, NY', status: 'Verified Deliverable' }
        ]
    },
    'gmaps-leads': {
        title: 'Google Maps Commercial Business Directory',
        category: 'Google Maps Lead Gen · Python & Playwright',
        objective: 'Extract comprehensive local business contact data across 10 major metropolitan counties for localized B2B service outreach.',
        source: 'Google Maps Places directory and individual company landing pages.',
        fields: ['Business Name', 'Category / Niche', 'Direct Phone Number', 'Full Street Address', 'Rating', 'Total Reviews', 'Website URL', 'Contact Email'],
        process: [
            'Construct automated Playwright scraper targeting designated geo-coordinates.',
            'Extract place cards with infinite scrolling & dynamic DOM rendering.',
            'Crawl discovered company websites to locate contact email and contact forms.',
            'Standardize phone numbers into clean international E.164 format.',
            'Deduplicate by place ID and domain.'
        ],
        tools: ['Python', 'Playwright', 'Beautiful Soup', 'Pandas'],
        sampleRows: [
            { name: 'Apex Commercial Dental', category: 'Healthcare / Dental', phone: '+1 (415) 555-0192', rating: '4.9 (128 reviews)', web: 'apexdfdental.com', email: 'contact@apexdfdental.com' },
            { name: 'Metro Bay Architects', category: 'Architecture & Design', phone: '+1 (415) 555-8321', rating: '4.8 (84 reviews)', web: 'metrobaydesign.com', email: 'info@metrobaydesign.com' },
            { name: 'Golden State HVAC Pros', category: 'HVAC Contractor', phone: '+1 (510) 555-4490', rating: '4.7 (210 reviews)', web: 'gshvacpros.com', email: 'service@gshvacpros.com' }
        ]
    },
    'ecommerce-scraping': {
        title: 'E-commerce Catalog & Multi-Variant Scraping',
        category: 'Web Scraping · Selenium & Python',
        objective: 'Extract over 10,000 product SKUs across deep nested categories with pricing, inventory levels, and specifications.',
        source: 'Target e-commerce retail portal with heavy dynamic JavaScript rendering.',
        fields: ['SKU / Product ID', 'Product Title', 'Current Price', 'MSRP / Original Price', 'Category Hierarchy', 'Availability Status', 'Image URL'],
        process: [
            'Configure Selenium webdriver with stealth headers to bypass bot blocks.',
            'Traverse recursive category navigation and paginated infinite lists.',
            'Parse structured schema.org JSON-LD microdata for 100% attribute fidelity.',
            'Clean currency formatting and separate brand vs. product descriptors.',
            'Deliver structured JSON and relational CSV tables.'
        ],
        tools: ['Python', 'Selenium', 'Regex', 'JSON / CSV'],
        sampleRows: [
            { sku: 'PROD-88219', title: 'Industrial Ergonomic Task Chair', price: '$289.00', msrp: '$349.00', cat: 'Office Furniture > Seating', status: 'In Stock' },
            { sku: 'PROD-88224', title: 'Dual-Motor Standing Desk 60"', price: '$499.00', msrp: '$599.00', cat: 'Office Furniture > Desks', status: 'In Stock' },
            { sku: 'PROD-88301', title: 'Acoustic Desk Privacy Panel', price: '$89.00', msrp: '$89.00', cat: 'Accessories > Acoustics', status: 'Low Stock' }
        ]
    }
};

(function initCaseStudyModal() {
    const backdrop = document.getElementById('case-study-modal');
    const dialog = document.getElementById('modal-dialog');
    const closeBtn = document.getElementById('modal-close-btn');
    if (!backdrop) return;

    function openModal(studyId) {
        const data = CASE_STUDIES[studyId];
        if (!data) return;

        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-category').textContent = data.category;
        document.getElementById('modal-objective').textContent = data.objective;
        document.getElementById('modal-source').textContent = data.source;

        // Render fields list
        const fieldsWrap = document.getElementById('modal-fields');
        fieldsWrap.innerHTML = data.fields.map(f => `<span class="project-metric" style="font-size:11px;">${f}</span>`).join('');

        // Render process steps
        const processWrap = document.getElementById('modal-process');
        processWrap.innerHTML = data.process.map((step, idx) => `
            <li style="margin-bottom:6px; color:var(--ink-2); line-height:1.5;">
                <strong style="color:var(--ink);">Step ${idx + 1}:</strong> ${step}
            </li>
        `).join('');

        // Render sample data table
        const tableWrap = document.getElementById('modal-table-container');
        if (data.sampleRows && data.sampleRows.length) {
            const keys = Object.keys(data.sampleRows[0]);
            let html = '<table class="modal-table"><thead><tr>';
            keys.forEach(k => {
                html += `<th>${k.charAt(0).toUpperCase() + k.slice(1)}</th>`;
            });
            html += '</tr></thead><tbody>';
            data.sampleRows.forEach(row => {
                html += '<tr>';
                keys.forEach(k => {
                    html += `<td>${row[k]}</td>`;
                });
                html += '</tr>';
            });
            html += '</tbody></table>';
            tableWrap.innerHTML = html;
        } else {
            tableWrap.innerHTML = '';
        }

        backdrop.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Attach to all project cards
    document.querySelectorAll('[data-case-study]').forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            const id = card.getAttribute('data-case-study');
            openModal(id);
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
    });
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
            closeModal();
        }
    });

    const requestSimilarBtn = document.getElementById('modal-request-similar');
    if (requestSimilarBtn) {
        requestSimilarBtn.addEventListener('click', () => {
            closeModal();
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
})();

/* ── 6. Contact Form Validation & Mailto Fallback ── */
(function() {
    const form = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value.trim();
        const email = document.getElementById('form-email')?.value.trim();
        const projectType = document.getElementById('form-type')?.value;
        const message = document.getElementById('form-message')?.value.trim();

        if (!name || !email || !message) {
            if (statusMsg) {
                statusMsg.textContent = 'Please complete all required fields.';
                statusMsg.style.color = '#ef4444';
            }
            return;
        }

        const subject = encodeURIComponent(`B2B Data Inquiry: ${projectType} from ${name}`);
        const body = encodeURIComponent(
            `Hi Ibrahim,\n\nMy name is ${name} (${email}).\n\nProject Type: ${projectType}\n\nProject Details:\n${message}\n\nBest regards,\n${name}`
        );

        if (statusMsg) {
            statusMsg.textContent = 'Opening your email client...';
            statusMsg.style.color = '#10b981';
        }

        window.location.href = `mailto:ibrahimshakeshuvo100@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            if (statusMsg) {
                statusMsg.textContent = 'Inquiry prepared! If your email client did not open automatically, email me at ibrahimshakeshuvo100@gmail.com';
            }
        }, 1200);
    });
})();

/* ── 7. Footer Weather & City Ticker (Dhaka, Bangladesh) ── */
(async function initCityTicker() {
    const el = document.getElementById('footer-weather');
    if (!el) return;

    try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,weather_code');
        const data = await res.json();
        const temp = Math.round(data.current?.temperature_2m ?? 28);

        function wmoIcon(code) {
            if (code === 0) return '☀️ Clear';
            if (code >= 1 && code <= 3) return '⛅ Partly cloudy';
            if (code >= 45 && code <= 48) return '🌫️ Fog';
            if (code >= 51 && code <= 67) return '🌧️ Rain';
            return '☁️ Clear';
        }
        const cond = wmoIcon(data.current?.weather_code ?? 0);

        el.innerHTML = `
            <span class="fw-dot live" aria-hidden="true"></span>
            <span class="fw-city">Dhaka, Bangladesh</span>
            <span style="color:var(--on-dark-faint)">·</span>
            <span>${cond} ${temp}°C</span>
            <span style="color:var(--on-dark-faint)">·</span>
            <span style="color:#10b981; font-weight:600;">Available for Projects</span>
        `;
    } catch (err) {
        el.innerHTML = `
            <span class="fw-dot live" aria-hidden="true"></span>
            <span class="fw-city">Dhaka, Bangladesh</span>
            <span style="color:var(--on-dark-faint)">·</span>
            <span style="color:#10b981; font-weight:600;">Available for Projects</span>
        `;
    }
})();

/* ─────────────────────────────────────
   8. Leads Sample Showcase & Admin Portal Manager
   Workflow: Title, Photo, Leads Type, Location, Lead Quality
───────────────────────────────────── */
(function initLeadsSampleApp() {
    const STORAGE_SAMPLES_KEY = 'ibrahim_leads_samples_v2';
    const STORAGE_AUTH_KEY = 'ibrahim_leads_admin_auth';

    // State
    let activeFilter = 'all';
    let searchQuery = '';

    // Initial default high-quality lead samples with attached Google Sheet CSV datasets
    const DEFAULT_SAMPLES = [
        {
            id: 'lead-sample-1',
            title: 'High-Quality B2B Decision Maker Prospect List',
            photo: '/assets/b2b_lead_gen_graphic.jpg',
            type: 'B2B Lead Generation',
            location: 'United States & Canada (Global)',
            quality: '100% Verified & Zero-Bounce (NeverBounce Tested)',
            records: '5,000+ Verified Contacts',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Full Name, Job Title, Work Email, Direct Phone, Company, LinkedIn, Website, Revenue',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            sampleRows: [
                { name: 'David Miller', title: 'VP of Commercial Sales', company: 'Apex Energy Systems', email: 'd.miller@apexenergy.com', phone: '+1 (512) 488-2910', location: 'Austin, TX, USA' },
                { name: 'Sarah Jenkins', title: 'Chief Executive Officer', company: 'Solstice Power Corp', email: 'sjenkins@solsticepower.io', phone: '+1 (415) 670-3841', location: 'San Francisco, CA, USA' },
                { name: 'Michael Thorne', title: 'Head of Operations & Procurement', company: 'Horizon Solar Tech', email: 'm.thorne@horizonsolar.net', phone: '+1 (786) 304-9923', location: 'Miami, FL, USA' },
                { name: 'Rachel Adams', title: 'Director of Business Development', company: 'Nova Clean Energy', email: 'radams@novaclean.org', phone: '+1 (303) 512-8819', location: 'Denver, CO, USA' },
                { name: 'James Patterson', title: 'Managing Partner', company: 'Patterson Infra Group', email: 'jpatterson@pattersoninfra.com', phone: '+1 (602) 419-7754', location: 'Phoenix, AZ, USA' }
            ]
        },
        {
            id: 'lead-sample-2',
            title: 'Google Maps Local Business Directory Extraction',
            photo: '/assets/gmaps_scraping.jpg',
            type: 'Google Maps Leads',
            location: 'New York, Texas & Florida, USA',
            quality: '99.8% Email Deliverability & Direct Dial Phone',
            records: '12,400+ Business Profiles',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Business Name, Category, Street Address, Rating, Reviews Count, Direct Phone, Website, Email',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            sampleRows: [
                { name: 'Empire State Orthodontics', title: 'Practice Owner / Head Dentist', company: 'Empire Ortho NY', email: 'contact@empireorthony.com', phone: '+1 (212) 555-0192', location: 'Manhattan, NY, USA' },
                { name: 'Lonestar Dental Group', title: 'Managing Director', company: 'Lonestar Dental Care', email: 'info@lonestardental.org', phone: '+1 (713) 555-0844', location: 'Houston, TX, USA' },
                { name: 'Biscayne Bay Family Practice', title: 'Clinical Director', company: 'Biscayne Dental Care', email: 'office@biscaynedental.com', phone: '+1 (305) 555-0711', location: 'Miami, FL, USA' },
                { name: 'Dallas Premier Smiles', title: 'Owner & Chief Surgeon', company: 'Dallas Premier Dental', email: 'appointments@dallaspremiersmiles.com', phone: '+1 (214) 555-0322', location: 'Dallas, TX, USA' }
            ]
        },
        {
            id: 'lead-sample-3',
            title: 'LinkedIn C-Suite & VP Tech Executives Dataset',
            photo: '/assets/b2b_dashboard.jpg',
            type: 'LinkedIn Decision Makers',
            location: 'London & Manchester, United Kingdom',
            quality: 'Tier-1 C-Suite Decision Makers Only (CEO, Founder, VP)',
            records: '3,200+ Verified Profiles',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Executive Name, Headline, Verified Work Email, Direct Mobile, Company Size, LinkedIn Profile',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            sampleRows: [
                { name: 'Oliver Wright', title: 'Chief Technology Officer', company: 'FinPulse Systems UK', email: 'o.wright@finpulse.co.uk', phone: '+44 20 7946 0912', location: 'London, UK' },
                { name: 'Emma Watson-Reid', title: 'VP of Product Engineering', company: 'CloudNexus AI', email: 'emma@cloudnexus.io', phone: '+44 161 496 0381', location: 'Manchester, UK' },
                { name: 'Alexander Sterling', title: 'Founder & Managing Director', company: 'Sterling Cybersec', email: 'a.sterling@sterlingsec.com', phone: '+44 20 7183 4492', location: 'London, UK' },
                { name: 'Sophie Harrison', title: 'Chief Revenue Officer', company: 'VentureScale SaaS', email: 'sophie.h@venturescale.io', phone: '+44 113 496 0884', location: 'Leeds, UK' }
            ]
        },
        {
            id: 'lead-sample-4',
            title: 'Shopify DTC E-Commerce Founders & Marketing Leads',
            photo: '/assets/b2b_lead_gen_graphic.jpg',
            type: 'E-Commerce & DTC Brands',
            location: 'USA, Canada & Australia',
            quality: '100% Active Physical Locations & Verified Phone',
            records: '1,850+ Verified Brand Owners',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Brand Name, Store URL, Business Email, Direct Phone, Location, Instagram, Meta Ads Status',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            sampleRows: [
                { name: "'47 Brand (Apparel)", title: 'Store Owner / Brand Team', company: '47brand.myshopify.com', email: 'templ@e-product.css', phone: '+1 (394) 225-3045', location: 'USA' },
                { name: '100% PURE (Beauty)', title: 'Founder & Operations Lead', company: '100percentpure.com', email: 'info@puritycosmetics.com', phone: '+1 (415) 814-9988', location: 'San Jose, CA, USA' },
                { name: '12th Tribe (Fashion)', title: 'Managing Director / E-Commerce', company: '12thtribe.com', email: 'orders@shopfifteentwenty.com', phone: '+1 (310) 730-6420', location: 'Los Angeles, CA, USA' },
                { name: '240 Tutoring (Education)', title: 'Executive Director', company: '240tutoring.com', email: 'help@240tutoring.com', phone: '+1 (888) 535-2142', location: 'Denton, TX, USA' },
                { name: '2XU High Performance', title: 'Commercial Operations Lead', company: '2xu.com', email: 'online@2xu.com', phone: '+1 (877) 700-1298', location: 'Carlsbad, CA, USA' }
            ]
        }
    ];

    // Read stored lead samples or initialize
    function getSamples() {
        try {
            const raw = localStorage.getItem(STORAGE_SAMPLES_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    return parsed.map(s => ({
                        ...s,
                        sheetUrl: s.sheetUrl || '/assets/leads_sample_dataset.csv'
                    }));
                }
            }
        } catch (e) {
            console.error('Failed to parse lead samples:', e);
        }
        saveSamples(DEFAULT_SAMPLES);
        return DEFAULT_SAMPLES;
    }

    function saveSamples(samples) {
        try {
            localStorage.setItem(STORAGE_SAMPLES_KEY, JSON.stringify(samples));
        } catch (e) {
            console.error('Failed to save lead samples:', e);
        }
    }

    // Auth State
    function isAdminLoggedIn() {
        return localStorage.getItem(STORAGE_AUTH_KEY) === 'true';
    }

    function setAdminAuth(isAuth) {
        if (isAuth) {
            localStorage.setItem(STORAGE_AUTH_KEY, 'true');
        } else {
            localStorage.removeItem(STORAGE_AUTH_KEY);
        }
        updateAdminBarUI();
        renderSamples();
    }

    function updateAdminBarUI() {
        const guestBar = document.getElementById('admin-guest-bar');
        const authBar = document.getElementById('admin-authenticated-bar');
        const activeHint = document.getElementById('leads-admin-banner-pill');
        const isAuth = isAdminLoggedIn();

        if (guestBar) guestBar.style.display = isAuth ? 'none' : 'block';
        if (authBar) authBar.style.display = isAuth ? 'flex' : 'none';
        if (activeHint) activeHint.style.display = isAuth ? 'inline-block' : 'none';
    }

    // Router: Switch between Main Portfolio and Leads Sample Page
    const portfolioView = document.getElementById('portfolio-main-view');
    const leadsSamplesView = document.getElementById('leads-samples-view');
    const navLinkSamples = document.getElementById('nav-link-leads-samples');

    function handleRouting() {
        const hash = window.location.hash || '';
        const isSamplesPage = hash.startsWith('#leads-samples');

        if (isSamplesPage) {
            if (portfolioView) portfolioView.style.display = 'none';
            if (leadsSamplesView) {
                leadsSamplesView.style.display = 'block';
                leadsSamplesView.setAttribute('aria-hidden', 'false');
            }
            if (navLinkSamples) navLinkSamples.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // If navigating directly to #leads-samples/admin, open admin login
            if (hash === '#leads-samples/admin' || hash === '#leads-samples-admin') {
                if (!isAdminLoggedIn()) {
                    openModal('admin-login-modal');
                }
            }
            renderSamples();
        } else {
            if (portfolioView) portfolioView.style.display = 'block';
            if (leadsSamplesView) {
                leadsSamplesView.style.display = 'none';
                leadsSamplesView.setAttribute('aria-hidden', 'true');
            }
            if (navLinkSamples) navLinkSamples.classList.remove('active');

            if (hash && hash !== '#') {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }

    // Wire Hero button to route to #leads-samples
    const heroBtnSamples = document.getElementById('hero-btn-leads-sample');
    if (heroBtnSamples) {
        heroBtnSamples.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#leads-samples';
        });
    }

    // Wire "Back to Portfolio" button
    const btnBack = document.getElementById('btn-back-portfolio');
    if (btnBack) {
        btnBack.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#hero';
        });
    }

    // Wire bottom CTA "Order Custom Lead List"
    const btnLeadsOrder = document.getElementById('btn-leads-order-custom');
    if (btnLeadsOrder) {
        btnLeadsOrder.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#contact';
        });
    }

    // Filter and Search controls
    const searchInput = document.getElementById('leads-search-input');
    const searchClearBtn = document.getElementById('leads-search-clear');
    const filterPillsContainer = document.getElementById('leads-filter-pills');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            if (searchClearBtn) {
                searchClearBtn.style.display = searchQuery ? 'block' : 'none';
            }
            renderSamples();
        });
    }

    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                searchClearBtn.style.display = 'none';
                searchInput.focus();
                renderSamples();
            }
        });
    }

    if (filterPillsContainer) {
        filterPillsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-pill');
            if (!btn) return;
            filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter') || 'all';
            renderSamples();
        });
    }

    // Render lead sample cards
    function renderSamples() {
        const grid = document.getElementById('leads-grid');
        const countText = document.getElementById('leads-count-text');
        if (!grid) return;

        const allSamples = getSamples();
        const filtered = allSamples.filter(sample => {
            // Category filter
            const matchesCategory = activeFilter === 'all' || sample.type === activeFilter;
            // Search query filter
            const matchesSearch = !searchQuery || (
                (sample.title || '').toLowerCase().includes(searchQuery) ||
                (sample.type || '').toLowerCase().includes(searchQuery) ||
                (sample.location || '').toLowerCase().includes(searchQuery) ||
                (sample.quality || '').toLowerCase().includes(searchQuery) ||
                (sample.fields || '').toLowerCase().includes(searchQuery)
            );
            return matchesCategory && matchesSearch;
        });

        if (countText) {
            countText.textContent = `Showing ${filtered.length} verified lead sample${filtered.length === 1 ? '' : 's'}${activeFilter !== 'all' ? ` in "${activeFilter}"` : ''}`;
        }

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding: 60px 20px; background:var(--surface); border:1px solid var(--border); border-radius:16px;">
                    <div style="font-size:36px; margin-bottom:12px;">🔍</div>
                    <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin-bottom:8px;">No lead samples found</h3>
                    <p style="font-size:14px; color:var(--ink-2); margin-bottom:20px;">Try adjusting your search terms or selecting a different industry category.</p>
                    <button type="button" class="btn-back-portfolio" id="btn-reset-filters">Reset All Filters</button>
                </div>
            `;
            const resetBtn = document.getElementById('btn-reset-filters');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    activeFilter = 'all';
                    searchQuery = '';
                    if (searchInput) searchInput.value = '';
                    if (searchClearBtn) searchClearBtn.style.display = 'none';
                    if (filterPillsContainer) {
                        filterPillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
                        filterPillsContainer.querySelector('.filter-pill[data-filter="all"]')?.classList.add('active');
                    }
                    renderSamples();
                });
            }
            return;
        }

        const isAdmin = isAdminLoggedIn();

        grid.innerHTML = filtered.map(sample => {
            const fieldsArr = (sample.fields || '')
                .split(',')
                .map(f => f.trim())
                .filter(Boolean)
                .slice(0, 4);

            return `
                <article class="lead-sample-card" data-id="${escapeHtml(sample.id)}">
                    <div class="lead-card-media" onclick="window.inspectSamplePreview('${escapeHtml(sample.id)}')">
                        <img class="lead-card-img" src="${escapeHtml(sample.photo || '/assets/b2b_lead_gen_graphic.jpg')}" alt="${escapeHtml(sample.title)}" loading="lazy" onerror="this.src='/assets/b2b_lead_gen_graphic.jpg'" />
                        <div class="lead-card-overlay"></div>
                        <div class="lead-card-badges">
                            <span class="lead-type-badge">${escapeHtml(sample.type || 'B2B Leads')}</span>
                            <span class="lead-quality-pill">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Verified</span>
                            </span>
                        </div>
                    </div>

                    <div class="lead-card-body">
                        <div class="lead-card-location-row">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>${escapeHtml(sample.location || 'Global')}</span>
                        </div>

                        <h3 class="lead-card-title">${escapeHtml(sample.title)}</h3>

                        <div class="lead-card-quality-box">
                            <span class="lead-card-quality-label">Lead Quality Guarantee</span>
                            <div class="lead-card-quality-val">
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span>${escapeHtml(sample.quality || '100% Zero-Bounce Verified')}</span>
                            </div>
                        </div>

                        ${fieldsArr.length > 0 ? `
                            <div class="lead-card-fields">
                                ${fieldsArr.map(f => `<span class="lead-card-field-tag">✓ ${escapeHtml(f)}</span>`).join('')}
                                ${sample.records ? `<span class="lead-card-field-tag" style="background:var(--accent-muted); color:var(--accent); font-weight:600;">${escapeHtml(sample.records)}</span>` : ''}
                            </div>
                        ` : ''}

                        <div class="lead-sheet-indicator">
                            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                            <span>Google Sheet (.csv) Ready</span>
                        </div>

                        <div class="lead-card-actions">
                            <button type="button" class="btn-card-download" onclick="window.downloadLeadSheet('${escapeHtml(sample.id)}')" title="Download Google Sheet spreadsheet for ${escapeHtml(sample.title)}">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Download</span>
                            </button>

                            <button type="button" class="btn-card-preview" onclick="window.inspectSamplePreview('${escapeHtml(sample.id)}')">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                                <span>Inspect</span>
                            </button>

                            ${isAdmin ? `
                                <button type="button" class="btn-card-edit" onclick="window.editLeadSample('${escapeHtml(sample.id)}')" title="Edit this lead sample">
                                    <span>Edit</span>
                                </button>
                                <button type="button" class="btn-card-delete" onclick="window.deleteLeadSample('${escapeHtml(sample.id)}')" title="Delete this lead sample" aria-label="Delete sample">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </article>
            `;
        }).join('');
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Modal Helpers
    function openModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.style.display = 'flex';
        // force reflow
        void modal.offsetWidth;
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(id) {
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.remove('is-open');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 220);
    }

    // Admin Auth Logic
    const btnOpenAdminLogin = document.getElementById('btn-open-admin-login');
    const btnCloseAdminLogin = document.getElementById('btn-close-admin-login');
    const btnCancelAdminLogin = document.getElementById('btn-cancel-admin-login');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminPasswordInput = document.getElementById('admin-password-input');
    const btnQuickFill = document.getElementById('btn-quick-fill-admin');
    const btnTogglePwd = document.getElementById('btn-toggle-password-visibility');
    const adminLoginError = document.getElementById('admin-login-error');
    const btnAdminLogout = document.getElementById('btn-admin-logout');

    if (btnOpenAdminLogin) {
        btnOpenAdminLogin.addEventListener('click', () => {
            if (adminLoginError) adminLoginError.style.display = 'none';
            openModal('admin-login-modal');
            if (adminPasswordInput) adminPasswordInput.focus();
        });
    }

    if (btnCloseAdminLogin) btnCloseAdminLogin.addEventListener('click', () => closeModal('admin-login-modal'));
    if (btnCancelAdminLogin) btnCancelAdminLogin.addEventListener('click', () => closeModal('admin-login-modal'));

    if (btnQuickFill && adminPasswordInput) {
        btnQuickFill.addEventListener('click', () => {
            adminPasswordInput.value = 'admin123';
            if (adminLoginError) adminLoginError.style.display = 'none';
        });
    }

    if (btnTogglePwd && adminPasswordInput) {
        btnTogglePwd.addEventListener('click', () => {
            const isText = adminPasswordInput.type === 'text';
            adminPasswordInput.type = isText ? 'password' : 'text';
        });
    }

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = (document.getElementById('admin-email-input')?.value || '').trim().toLowerCase();
            const password = (adminPasswordInput?.value || '').trim();

            if (password === 'admin123' || password === 'ibrahim2026' || password === 'admin') {
                setAdminAuth(true);
                closeModal('admin-login-modal');
                if (adminLoginError) adminLoginError.style.display = 'none';
                if (adminPasswordInput) adminPasswordInput.value = '';
            } else {
                if (adminLoginError) {
                    adminLoginError.textContent = 'Incorrect password. Click "Quick Fill (admin123)" to log in for demonstration.';
                    adminLoginError.style.display = 'block';
                }
            }
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            setAdminAuth(false);
        });
    }

    // Add / Edit Lead Sample Logic
    const btnOpenAddSample = document.getElementById('btn-open-add-sample');
    const btnCloseSampleEditor = document.getElementById('btn-close-sample-editor');
    const btnCancelSampleEditor = document.getElementById('btn-cancel-sample-editor');
    const sampleEditorForm = document.getElementById('sample-editor-form');
    const editorHeading = document.getElementById('sample-editor-heading');
    const editorEyebrow = document.getElementById('sample-editor-eyebrow');
    const editorSubmitBtn = document.getElementById('btn-save-sample');

    const editorId = document.getElementById('editor-sample-id');
    const editorTitle = document.getElementById('editor-sample-title');
    const editorType = document.getElementById('editor-sample-type');
    const editorLocation = document.getElementById('editor-sample-location');
    const editorQuality = document.getElementById('editor-sample-quality');
    const editorRecords = document.getElementById('editor-sample-records');
    const editorFormat = document.getElementById('editor-sample-format');
    const editorFields = document.getElementById('editor-sample-fields');
    const editorSheetUrl = document.getElementById('editor-sample-sheet-url');
    const editorPhotoUrl = document.getElementById('editor-photo-url');
    const editorPhotoPreview = document.getElementById('editor-photo-preview');
    const editorFileInput = document.getElementById('editor-file-input');
    const photoDropzone = document.getElementById('photo-dropzone');

    let currentSelectedPhoto = '/assets/b2b_lead_gen_graphic.jpg';

    // Photo Source Tabs
    const tabPresets = document.getElementById('tab-photo-presets');
    const tabUpload = document.getElementById('tab-photo-upload');
    const tabUrl = document.getElementById('tab-photo-url');
    const panelPresets = document.getElementById('panel-photo-presets');
    const panelUpload = document.getElementById('panel-photo-upload');
    const panelUrl = document.getElementById('panel-photo-url');

    function switchPhotoTab(activeTab, activePanel) {
        [tabPresets, tabUpload, tabUrl].forEach(t => t?.classList.remove('active'));
        [panelPresets, panelUpload, panelUrl].forEach(p => { if (p) p.style.display = 'none'; });
        activeTab?.classList.add('active');
        if (activePanel) activePanel.style.display = 'block';
    }

    if (tabPresets) tabPresets.addEventListener('click', () => switchPhotoTab(tabPresets, panelPresets));
    if (tabUpload) tabUpload.addEventListener('click', () => switchPhotoTab(tabUpload, panelUpload));
    if (tabUrl) tabUrl.addEventListener('click', () => switchPhotoTab(tabUrl, panelUrl));

    // Preset Clicks
    const presetButtons = document.querySelectorAll('.preset-choice-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const src = btn.getAttribute('data-src');
            if (src) {
                currentSelectedPhoto = src;
                if (editorPhotoPreview) editorPhotoPreview.src = src;
                if (editorPhotoUrl) editorPhotoUrl.value = src;
            }
        });
    });

    // File Upload Handler with base64 conversion
    function handlePhotoFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            currentSelectedPhoto = dataUrl;
            if (editorPhotoPreview) editorPhotoPreview.src = dataUrl;
            if (editorPhotoUrl) editorPhotoUrl.value = dataUrl;
            // update dropzone label
            const textEl = photoDropzone?.querySelector('.dropzone-text');
            if (textEl) textEl.textContent = `Selected: ${file.name}`;
        };
        reader.readAsDataURL(file);
    }

    if (editorFileInput) {
        editorFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handlePhotoFile(e.target.files[0]);
            }
        });
    }

    if (photoDropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            photoDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                photoDropzone.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            photoDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                photoDropzone.classList.remove('dragover');
            });
        });
        photoDropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
                handlePhotoFile(e.dataTransfer.files[0]);
            }
        });
    }

    if (editorPhotoUrl) {
        editorPhotoUrl.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            if (val) {
                currentSelectedPhoto = val;
                if (editorPhotoPreview) editorPhotoPreview.src = val;
            }
        });
    }

    // Open Add Lead Sample
    if (btnOpenAddSample) {
        btnOpenAddSample.addEventListener('click', () => {
            if (sampleEditorForm) sampleEditorForm.reset();
            if (editorId) editorId.value = '';
            if (editorHeading) editorHeading.textContent = 'Add New Lead Sample';
            if (editorEyebrow) editorEyebrow.textContent = 'ADMIN WORKFLOW';
            if (editorSubmitBtn) editorSubmitBtn.textContent = 'Publish Lead Sample';
            if (editorSheetUrl) editorSheetUrl.value = '';

            currentSelectedPhoto = '/assets/b2b_lead_gen_graphic.jpg';
            if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
            switchPhotoTab(tabPresets, panelPresets);

            openModal('sample-editor-modal');
            if (editorTitle) editorTitle.focus();
        });
    }

    if (btnCloseSampleEditor) btnCloseSampleEditor.addEventListener('click', () => closeModal('sample-editor-modal'));
    if (btnCancelSampleEditor) btnCancelSampleEditor.addEventListener('click', () => closeModal('sample-editor-modal'));

    // Save Lead Sample Form Submit
    if (sampleEditorForm) {
        sampleEditorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = editorId ? editorId.value.trim() : '';
            const title = (editorTitle?.value || '').trim();
            const type = (editorType?.value || 'B2B Lead Generation').trim();
            const location = (editorLocation?.value || '').trim();
            const quality = (editorQuality?.value || '').trim();
            const records = (editorRecords?.value || '1,000+ Verified Records').trim();
            const format = (editorFormat?.value || 'Excel (.xlsx), CSV, Google Sheets').trim();
            const fields = (editorFields?.value || 'Full Name, Job Title, Work Email, Direct Phone, Company, LinkedIn, Website').trim();
            const sheetUrl = (editorSheetUrl?.value || '').trim() || '/assets/leads_sample_dataset.csv';
            const photo = currentSelectedPhoto || '/assets/b2b_lead_gen_graphic.jpg';

            if (!title || !location) {
                alert('Please provide a title and location for the lead sample.');
                return;
            }

            const currentSamples = getSamples();

            if (id) {
                // Edit existing sample
                const idx = currentSamples.findIndex(s => s.id === id);
                if (idx !== -1) {
                    currentSamples[idx] = {
                        ...currentSamples[idx],
                        title,
                        type,
                        location,
                        quality,
                        records,
                        format,
                        fields,
                        sheetUrl,
                        photo
                    };
                }
            } else {
                // Create new sample
                const newSample = {
                    id: 'sample-' + Date.now(),
                    title,
                    type,
                    location,
                    quality,
                    records,
                    format,
                    fields,
                    sheetUrl,
                    photo,
                    sampleRows: [
                        { name: 'Michael Sterling', title: 'Managing Director / Partner', company: 'Apex Commercial Partners', email: 'm.sterling@apexpartners.com', phone: '+1 (512) 555-0182', location: location },
                        { name: 'Sarah Montgomery', title: 'VP of Business Development', company: 'Global Growth Ventures', email: 'smontgomery@globalventures.io', phone: '+1 (415) 555-0291', location: location },
                        { name: 'David Hensley', title: 'Chief Executive Officer', company: 'Pioneer Assets Group', email: 'dhensley@pioneerassets.com', phone: '+1 (212) 555-0377', location: location }
                    ]
                };
                currentSamples.unshift(newSample);
            }

            saveSamples(currentSamples);
            closeModal('sample-editor-modal');
            renderSamples();
        });
    }

    // Global Action: Edit Lead Sample
    window.editLeadSample = function(id) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        if (editorId) editorId.value = sample.id;
        if (editorTitle) editorTitle.value = sample.title || '';
        if (editorType) editorType.value = sample.type || 'B2B Lead Generation';
        if (editorLocation) editorLocation.value = sample.location || '';
        if (editorQuality) editorQuality.value = sample.quality || '';
        if (editorRecords) editorRecords.value = sample.records || '';
        if (editorFormat) editorFormat.value = sample.format || 'Excel (.xlsx), CSV, Google Sheets';
        if (editorFields) editorFields.value = sample.fields || '';
        if (editorSheetUrl) editorSheetUrl.value = sample.sheetUrl || '';

        currentSelectedPhoto = sample.photo || '/assets/b2b_lead_gen_graphic.jpg';
        if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
        if (editorPhotoUrl) editorPhotoUrl.value = currentSelectedPhoto;

        if (editorHeading) editorHeading.textContent = 'Edit Lead Sample';
        if (editorEyebrow) editorEyebrow.textContent = 'ADMIN EDIT MODE';
        if (editorSubmitBtn) editorSubmitBtn.textContent = 'Save Changes';

        switchPhotoTab(tabPresets, panelPresets);
        openModal('sample-editor-modal');
    };

    // Global Action: Delete Lead Sample
    window.deleteLeadSample = function(id) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        if (confirm(`Are you sure you want to delete the lead sample: "${sample.title}"?`)) {
            const updated = samples.filter(s => s.id !== id);
            saveSamples(updated);
            renderSamples();
        }
    };

    // Global Action: Inspect Sample Preview Modal
    let activePreviewSample = null;

    window.inspectSamplePreview = function(id) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        activePreviewSample = sample;

        const titleEl = document.getElementById('preview-modal-title');
        const typeEl = document.getElementById('preview-modal-type');
        const locEl = document.getElementById('preview-modal-location');
        const qualEl = document.getElementById('preview-modal-quality');
        const countEl = document.getElementById('preview-modal-count');
        const imgEl = document.getElementById('preview-modal-img');
        const tbody = document.getElementById('preview-table-tbody');

        if (titleEl) titleEl.textContent = sample.title;
        if (typeEl) typeEl.textContent = sample.type || 'B2B LEAD GENERATION';
        if (locEl) locEl.textContent = `📍 ${sample.location || 'Global'}`;
        if (qualEl) qualEl.textContent = `✓ ${sample.quality || '100% Zero-Bounce'}`;
        if (countEl) countEl.textContent = `📊 ${sample.records || 'Verified Dataset'}`;
        if (imgEl) imgEl.src = sample.photo || '/assets/b2b_lead_gen_graphic.jpg';

        const rows = sample.sampleRows || [
            { name: 'David Miller', title: 'VP Commercial Sales', company: 'Apex Energy Systems', email: 'd.miller@apexenergy.com', phone: '+1 (512) 488-2910', location: sample.location || 'USA' },
            { name: 'Sarah Jenkins', title: 'Chief Executive Officer', company: 'Solstice Power Corp', email: 'sjenkins@solsticepower.io', phone: '+1 (415) 670-3841', location: sample.location || 'USA' },
            { name: 'Michael Thorne', title: 'Head of Operations', company: 'Horizon Solar Tech', email: 'm.thorne@horizonsolar.net', phone: '+1 (786) 304-9923', location: sample.location || 'USA' },
            { name: 'Rachel Adams', title: 'Business Development', company: 'Nova Clean Energy', email: 'radams@novaclean.org', phone: '+1 (303) 512-8819', location: sample.location || 'USA' }
        ];

        if (tbody) {
            tbody.innerHTML = rows.map(r => `
                <tr>
                    <td><strong>${escapeHtml(r.name)}</strong></td>
                    <td>${escapeHtml(r.title)}</td>
                    <td>${escapeHtml(r.company)}</td>
                    <td style="color:var(--accent);">${escapeHtml(r.email)}</td>
                    <td>${escapeHtml(r.phone)}</td>
                    <td>${escapeHtml(r.location)}</td>
                    <td><span class="badge-verified-row">✓ Verified</span></td>
                </tr>
            `).join('');
        }

        openModal('dataset-preview-modal');
    };

    // Global Action: Download Lead Sample Google Sheet Dataset
    window.downloadLeadSheet = function(id, customBtnEl) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id) || samples[0];
        if (!sample) return;

        // Visual feedback on button
        let triggerBtn = customBtnEl;
        if (!triggerBtn) {
            const card = document.querySelector(`.lead-sample-card[data-id="${sample.id}"]`);
            if (card) {
                triggerBtn = card.querySelector('.btn-card-download');
            }
        }

        const originalHtml = triggerBtn ? triggerBtn.innerHTML : '';
        if (triggerBtn) {
            triggerBtn.disabled = true;
            triggerBtn.innerHTML = `
                <svg class="spin-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                </svg>
                <span>Downloading...</span>
            `;
        }

        let downloadUrl = sample.sheetUrl || '/assets/leads_sample_dataset.csv';

        // Format Google Sheets URL to export direct CSV if necessary
        if (downloadUrl.includes('docs.google.com/spreadsheets')) {
            if (downloadUrl.includes('/edit')) {
                downloadUrl = downloadUrl.replace(/\/edit.*$/, '/export?format=csv');
            } else if (!downloadUrl.includes('/export')) {
                downloadUrl = downloadUrl.replace(/\/+$/, '') + '/export?format=csv';
            }
        }

        const safeTitle = (sample.title || 'Verified_Prospect_Dataset')
            .replace(/[^a-zA-Z0-9_-]/g, '_')
            .replace(/_+/g, '_');
        const filename = `${safeTitle}_GoogleSheet_Sample.csv`;

        // Trigger browser file download
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            if (a.parentNode) {
                document.body.removeChild(a);
            }
        }, 120);

        setTimeout(() => {
            if (triggerBtn) {
                triggerBtn.disabled = false;
                triggerBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Downloaded ✓</span>
                `;
                setTimeout(() => {
                    if (triggerBtn) {
                        triggerBtn.innerHTML = originalHtml;
                    }
                }, 2500);
            }
        }, 600);
    };

    // Close preview modal buttons
    const btnCloseDatasetPreview = document.getElementById('btn-close-dataset-preview');
    const btnPreviewClose = document.getElementById('btn-preview-close');
    const btnPreviewRequest = document.getElementById('btn-preview-request-dataset');
    const btnPreviewDownloadSheet = document.getElementById('btn-preview-download-sheet');

    if (btnCloseDatasetPreview) btnCloseDatasetPreview.addEventListener('click', () => closeModal('dataset-preview-modal'));
    if (btnPreviewClose) btnPreviewClose.addEventListener('click', () => closeModal('dataset-preview-modal'));

    if (btnPreviewDownloadSheet) {
        btnPreviewDownloadSheet.addEventListener('click', () => {
            if (activePreviewSample) {
                window.downloadLeadSheet(activePreviewSample.id, btnPreviewDownloadSheet);
            } else {
                window.downloadLeadSheet('lead-sample-1', btnPreviewDownloadSheet);
            }
        });
    }

    if (btnPreviewRequest) {
        btnPreviewRequest.addEventListener('click', () => {
            closeModal('dataset-preview-modal');
            window.location.hash = '#contact';
            setTimeout(() => {
                const messageInput = document.getElementById('inquiry-message');
                if (messageInput && activePreviewSample) {
                    messageInput.value = `Hi Ibrahim, I am interested in ordering a targeted prospect dataset similar to your sample: "${activePreviewSample.title}" (${activePreviewSample.type}, Location: ${activePreviewSample.location}).`;
                    messageInput.focus();
                }
            }, 300);
        });
    }

    // Initialize UI and Router
    updateAdminBarUI();
    renderSamples();
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
})();
