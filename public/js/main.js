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

/* ── 2. Nav: Flat → Frosted Pill on Scroll & Mobile Menu Toggle ── */
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

    // Mobile Menu 3-Dot Toggle
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const navInner = nav.querySelector('.nav-inner');
    if (toggleBtn && navInner) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navInner.classList.toggle('mobile-menu-active');
            toggleBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navInner.contains(e.target)) {
                navInner.classList.remove('mobile-menu-active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close on link clicks
        const navLinks = navInner.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navInner.classList.remove('mobile-menu-active');
                toggleBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
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

/* ── 4. Hero Profile Portrait Photo & Image Updates ── */
(function initHeroPhoto() {
    const wrap = document.getElementById('puzzle-wrap');
    const heroImg = document.getElementById('site-hero-portrait-img');
    const IMAGE = '/assets/hero_portrait.jpg?v=2';

    window.updatePuzzleHeroImage = function(newUrl) {
        if (!newUrl) return;
        if (heroImg) {
            heroImg.src = newUrl;
        }
        if (wrap) {
            wrap.style.setProperty('--pz-bg-img', `url("${newUrl}")`);
        }
    };
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

    form.addEventListener('submit', async (e) => {
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

        if (statusMsg) {
            statusMsg.textContent = 'Recording inquiry & connecting...';
            statusMsg.style.color = '#38bdf8';
        }

        // Send to backend API (recorded into Supabase database via backend)
        try {
            fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, project_type: projectType, message })
            }).catch(() => {});
        } catch (e) {}

        const subject = encodeURIComponent(`B2B Data Inquiry: ${projectType} from ${name}`);
        const body = encodeURIComponent(
            `Hi Ibrahim,\n\nMy name is ${name} (${email}).\n\nProject Type: ${projectType}\n\nProject Details:\n${message}\n\nBest regards,\n${name}`
        );

        if (statusMsg) {
            statusMsg.textContent = 'Inquiry recorded! Opening your email client...';
            statusMsg.style.color = '#10b981';
        }

        window.location.href = `mailto:ibrahimshakeshuvo100@gmail.com?subject=${subject}&body=${body}`;

        setTimeout(() => {
            if (statusMsg) {
                statusMsg.textContent = '✓ Inquiry submitted! I will review your requirements and respond within 2-4 hours.';
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
   8. Leads Sample Showcase & Admin Portal Manager (Supabase Connected)
───────────────────────────────────── */
(function initLeadsSampleApp() {
    const STORAGE_SAMPLES_KEY = 'ibrahim_leads_samples_v3';
    const STORAGE_AUTH_KEY = 'ibrahim_leads_admin_auth';
    const STORAGE_SITE_CONTENT_KEY = 'ibrahim_site_config_v2';

    // Supabase Cloud Database Project Configuration (Permanently Connected)
    const SUPABASE_CONFIG = {
        projectId: 'voixkvyylglpomahowrl',
        url: 'https://voixkvyylglpomahowrl.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaXhrdnl5bGdscG9tYWhvd3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzk0NTIsImV4cCI6MjEwNDk1NTQ1Mn0.bW7gGoAuye8GnBEQpbs088pEHVkSNqBH-XqFWUim7Xw'
    };

    let supabaseClient = null;
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✓ Supabase Client initialized successfully for project:', SUPABASE_CONFIG.projectId);
        } catch (e) {
            console.warn('Supabase JS Client notice:', e);
        }
    }

    // State
    let activeFilter = 'all';
    let searchQuery = '';
    let inMemorySamples = null;
    let inMemorySiteContent = null;

    // Default 6 services
    const DEFAULT_SERVICES = [
        {
            title: 'B2B Lead Generation',
            desc: 'Identifying ideal prospect accounts and high-intent decision-makers matched to your ICP criteria.',
            tags: 'Verified Emails · Targeted Personas · Zero Bounces'
        },
        {
            title: 'Business & Prospect List Building',
            desc: 'Structured, organized contact lists tailored for cold email campaigns, outbound SDRs, and CRM imports.',
            tags: 'Custom Fields · Verified Contacts · CRM-Ready'
        },
        {
            title: 'Web Research',
            desc: 'In-depth manual and automated web research to collect accurate company data, competitor pricing, and market intelligence.',
            tags: 'Market Research · Competitor Pricing · Directory Mining'
        },
        {
            title: 'Google Maps Lead Generation',
            desc: 'Automated extraction of local service businesses, clinics, retail stores, and commercial venues across target areas.',
            tags: 'Local SEO · Phone Numbers · Ratings & Reviews'
        },
        {
            title: 'Web Scraping & Data Extraction',
            desc: 'Extracting data from directories, marketplaces, and websites using Python, Playwright, and Selenium.',
            tags: 'Python · Playwright · Selenium · Structured Output'
        },
        {
            title: 'Data Cleaning & Organization',
            desc: 'Deduplication, formatting, phone number normalization, and verification into clean, readable Excel / CSV files.',
            tags: 'Deduplication · E.164 Formatting · Excel / CSV'
        }
    ];

    // Default complete site content
    const DEFAULT_SITE_CONTENT = {
        fullName: 'MD. Ibrahim Shake Shuvo',
        availability: 'Available for Projects',
        badgeRole1: 'B2B Lead Generation',
        badgeRole2: 'Web Scraping',
        badgeLoc: 'Dhaka, Bangladesh',
        heroLine1: 'Turning raw web data',
        heroMark: 'qualified leads',
        heroLead: 'Specialist in building targeted prospect lists, scraping local business directories, and delivering clean, ready-to-use B2B datasets powered by Python, Playwright, and Selenium.',
        heroProof: 'Zero-bounce deliverability · Deduplicated records · Custom business fields',
        heroPhoto: '/assets/b2b_lead_gen_graphic.jpg',
        aboutBio: 'I help businesses collect targeted business and prospect data through web research, scraping, and structured data collection. I focus on delivering clean, organized, and practical datasets that can support sales and marketing research without bloated fluff or unverified contacts.',
        aboutDegree: 'Diploma in Agriculture',
        aboutInst: 'Agriculture Training Institute, Gaibandha',
        aboutEduYears: '2019 – 2023',
        statYears: '5+',
        statProjects: '350+',
        statQuality: '100%',
        statClients: '120+',
        services: DEFAULT_SERVICES,
        pipeHeadline: 'Robust Pipelines Built for Scale',
        pipeCard1Sub: 'Custom scripts utilizing Playwright and Selenium to bypass bot detection, handle dynamic JavaScript hydration, and extract clean datasets at high speeds.',
        pipeCard2Sub: 'Strict deduplication by domain and company name, standardizing phone numbers to international E.164 formats, and validating email syntax against live mail exchange records.',
        pipeCard3Sub: 'Deep parsing of local business listings across specific regions, cities, and zip codes to discover direct phone numbers, business hours, and operational status.',
        quoteText: '"Clean, verified data is the foundation of high-converting outbound sales. We eliminate bounce rates and bad contacts before they reach your CRM."',
        quoteAuthor: 'MD. Ibrahim Shake Shuvo · Lead Generation & Scraping Specialist',
        contactHeadline: "Let's Discuss Your Data Needs",
        contactSub: 'Tell me about your target audience, required data fields, or the website you need extracted. I typically reply within 12 hours.',
        contactEmail: 'ibrahimshakeshuvo100@gmail.com',
        contactWhatsapp: '+880 1744-868938',
        contactLinkedin: 'https://www.linkedin.com/in/ibrahimshakeshuvo',
        contactGithub: 'https://github.com/Ibrahim009-Devloper',
        contactFacebook: 'https://www.facebook.com/profile.php?id=61588549130311',
        contactLocation: 'Dhaka, Bangladesh'
    };

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
            fileName: 'B2B_Decision_Makers_5000_Verified.csv',
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
            fileName: 'Google_Maps_US_Dental_Practices.csv',
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
            fileName: 'UK_Tech_Execs_Decision_Makers.csv',
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
            fileName: 'DTC_ECommerce_Founders_Dataset.csv',
            sampleRows: [
                { name: "'47 Brand (Apparel)", title: 'Store Owner / Brand Team', company: '47brand.myshopify.com', email: 'templ@e-product.css', phone: '+1 (394) 225-3045', location: 'USA' },
                { name: '100% PURE (Beauty)', title: 'Founder & Operations Lead', company: '100percentpure.com', email: 'info@puritycosmetics.com', phone: '+1 (415) 814-9988', location: 'San Jose, CA, USA' },
                { name: '12th Tribe (Fashion)', title: 'Managing Director / E-Commerce', company: '12thtribe.com', email: 'orders@shopfifteentwenty.com', phone: '+1 (310) 730-6420', location: 'Los Angeles, CA, USA' },
                { name: '240 Tutoring (Education)', title: 'Executive Director', company: '240tutoring.com', email: 'help@240tutoring.com', phone: '+1 (888) 535-2142', location: 'Denton, TX, USA' },
                { name: '2XU High Performance', title: 'Commercial Operations Lead', company: '2xu.com', email: 'online@2xu.com', phone: '+1 (877) 700-1298', location: 'Carlsbad, CA, USA' }
            ]
        }
    ];

    // Helper: Direct Supabase REST Request
    async function supabaseRest(endpoint, options = {}) {
        const url = `${SUPABASE_CONFIG.url}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': SUPABASE_CONFIG.anonKey,
            'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };
        try {
            const res = await fetch(url, { ...options, headers });
            if (!res.ok) {
                const text = await res.text();
                console.warn(`Supabase REST response (${res.status}) [${endpoint}]:`, text);
                return null;
            }
            const contentType = res.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
                return await res.json();
            }
            return true;
        } catch (err) {
            console.warn('Supabase fetch error:', err);
            return null;
        }
    }

    // Ping Supabase Cloud Database to test real-time connectivity
    async function pingSupabaseDatabase() {
        const startTime = Date.now();
        const statusPill = document.getElementById('cms-db-status-pill');
        const statusText = document.getElementById('cms-db-status-text');
        const floatingText = document.getElementById('cms-floating-status-text');

        try {
            // First check backend admin health endpoint (which tests Supabase connection using Secret Key)
            const backendRes = await fetch('/api/admin/health');
            if (backendRes.ok) {
                const data = await backendRes.json();
                const latency = data.supabase?.latencyMs || (Date.now() - startTime);
                if (statusText) statusText.textContent = `Supabase Backend Live (${latency}ms)`;
                if (floatingText) floatingText.textContent = `Backend Secret Connected (${latency}ms) · voixkvyylglpomahowrl`;
                if (statusPill) statusPill.title = `Supabase Backend Connected (${latency}ms) - Project: voixkvyylglpomahowrl (Role: Secret Key)`;
                return { ok: true, latency };
            }

            // Client direct anon key fallback
            const res = await fetch(`${SUPABASE_CONFIG.url}/rest/v1/`, {
                headers: {
                    'apikey': SUPABASE_CONFIG.anonKey,
                    'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
                }
            });
            const latency = Date.now() - startTime;
            if (statusText) statusText.textContent = `Supabase DB Live (${latency}ms)`;
            if (floatingText) floatingText.textContent = `Supabase Connected (${latency}ms) · voixkvyylglpomahowrl`;
            if (statusPill) statusPill.title = `Supabase Connected (${latency}ms) - Project: voixkvyylglpomahowrl`;
            return { ok: true, latency };
        } catch (e) {
            if (statusText) statusText.textContent = 'Supabase Cloud (Offline/Cache)';
            return { ok: false, error: e };
        }
    }

    // Sync from Supabase Cloud Database on Load
    async function syncFromSupabase() {
        try {
            let data = null;
            let backendSucceeded = false;

            // 1. Try Backend API (Secret Key)
            try {
                const res = await fetch('/api/admin/leads');
                if (res.ok) {
                    const json = await res.json();
                    backendSucceeded = true;
                    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                        data = json.data;
                    }
                }
            } catch (e) {}

            // 2. Try Client Supabase SDK (Anon Key) only if backend failed
            if (!backendSucceeded && !data && supabaseClient) {
                try {
                    const { data: sdkData, error } = await supabaseClient.from('leads').select('*').order('created_at', { ascending: false });
                    if (!error && Array.isArray(sdkData) && sdkData.length > 0) {
                        data = sdkData;
                    }
                } catch (e) {}
            }

            if (data && Array.isArray(data) && data.length > 0) {
                // Filter out non-lead sample rows (such as config row)
                const validRows = data.filter(row => row.id !== 'site_config_v1');
                if (validRows.length > 0) {
                    const remoteSamples = validRows.map(row => ({
                        id: String(row.id || ('sample-' + Date.now())),
                        title: row.title || row.lead_title || 'Lead Sample',
                        photo: row.photo || row.image_url || '/assets/b2b_lead_gen_graphic.jpg',
                        location: row.location || 'Global / United States',
                        sheetUrl: row.sheet_url || row.sample_file || row.sheetUrl || '/assets/leads_sample_dataset.csv',
                        fileName: row.file_name || row.fileName || '',
                        type: row.type || 'B2B Lead Generation',
                        quality: row.quality || '100% Zero-Bounce Verified',
                        sampleRows: row.sample_rows || []
                    }));

                    const local = getSamples();
                    const merged = [...remoteSamples];

                    local.forEach(l => {
                        if (!merged.some(m => m.id === l.id || m.title.trim().toLowerCase() === l.title.trim().toLowerCase())) {
                            merged.push(l);
                        }
                    });

                    inMemorySamples = merged;
                    saveSamplesToLocalStorage(merged);
                    renderSamples();
                    console.log('✓ Synced lead samples with Database (Total:', merged.length, ')');
                }
            }
        } catch (err) {
            console.warn('Sync notice:', err);
        }
    }

    // Push Lead Sample to Supabase Cloud Database via Backend Secret Key
    async function pushSampleToSupabase(sample, isDelete = false) {
        try {
            if (isDelete) {
                // 1. Delete via Backend Secret Key API
                try {
                    await fetch(`/api/admin/leads/${encodeURIComponent(sample.id)}`, {
                        method: 'DELETE'
                    });
                } catch (e) {}

                // 2. Direct client fallback
                if (supabaseClient) {
                    try { await supabaseClient.from('leads').delete().eq('id', sample.id); } catch (e) {}
                    try { await supabaseClient.from('lead_samples').delete().eq('id', sample.id); } catch (e) {}
                }
                await supabaseRest(`leads?id=eq.${encodeURIComponent(sample.id)}`, { method: 'DELETE' });
                await supabaseRest(`lead_samples?id=eq.${encodeURIComponent(sample.id)}`, { method: 'DELETE' });
            } else {
                const payload = {
                    id: sample.id,
                    title: sample.title,
                    location: sample.location,
                    photo: sample.photo,
                    sheet_url: sample.sheetUrl,
                    file_name: sample.fileName || '',
                    type: sample.type || 'B2B Lead Generation',
                    quality: sample.quality || '100% Zero-Bounce Verified',
                    sample_rows: sample.sampleRows || []
                };

                // 1. Push via Backend Secret Key API (guaranteed bypass of RLS / permissions)
                let backendOk = false;
                try {
                    const res = await fetch('/api/admin/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (res.ok) backendOk = true;
                } catch (e) {}

                // 2. Direct client fallback
                if (!backendOk) {
                    if (supabaseClient) {
                        try { await supabaseClient.from('lead_samples').upsert([payload]); } catch (e) {}
                        try { await supabaseClient.from('leads').upsert([payload]); } catch (e) {}
                    }

                    const res = await supabaseRest('leads', {
                        method: 'POST',
                        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
                        body: JSON.stringify(payload)
                    });

                    if (!res) {
                        await supabaseRest('lead_samples', {
                            method: 'POST',
                            headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
                            body: JSON.stringify(payload)
                        });
                    }
                }
            }
        } catch (err) {
            console.warn('Supabase background push note:', err);
        }
    }

    // Read stored lead samples or initialize
    function getSamples() {
        if (inMemorySamples && Array.isArray(inMemorySamples) && inMemorySamples.length > 0) {
            return inMemorySamples;
        }

        try {
            const raw = localStorage.getItem(STORAGE_SAMPLES_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    inMemorySamples = parsed.map(s => ({
                        ...s,
                        sheetUrl: s.sheetUrl || '/assets/leads_sample_dataset.csv'
                    }));
                    return inMemorySamples;
                }
            }
        } catch (e) {
            console.error('Failed to parse local lead samples:', e);
        }

        inMemorySamples = [...DEFAULT_SAMPLES];
        saveSamplesToLocalStorage(inMemorySamples);
        return inMemorySamples;
    }

    function saveSamplesToLocalStorage(samples) {
        try {
            localStorage.setItem(STORAGE_SAMPLES_KEY, JSON.stringify(samples));
        } catch (e) {
            console.warn('Local storage quota notice (handled gracefully):', e);
        }
    }

    function saveSamples(samples) {
        inMemorySamples = samples;
        saveSamplesToLocalStorage(samples);
    }

    // Instant Toast Notification
    function showNotificationToast(msg) {
        const existing = document.querySelector('.leads-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'leads-toast';
        toast.innerHTML = `
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${escapeHtml(msg)}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3500);
    }

    // Helper: Compress Image File using Canvas (prevents quota issues & ensures fast DB writes)
    function compressImageFile(file, maxWidth = 800, quality = 0.82) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => resolve(e.target.result);
                img.src = e.target.result;
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        });
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

    /* ─────────────────────────────────────
       SITE CONTENT ENGINE (SUPABASE DATABASE PERSISTENCE)
    ───────────────────────────────────── */
    function getSiteContent() {
        if (inMemorySiteContent) return inMemorySiteContent;
        try {
            const raw = localStorage.getItem(STORAGE_SITE_CONTENT_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    inMemorySiteContent = { ...DEFAULT_SITE_CONTENT, ...parsed };
                    return inMemorySiteContent;
                }
            }
        } catch (e) {
            console.warn('Could not read local site content:', e);
        }
        inMemorySiteContent = { ...DEFAULT_SITE_CONTENT };
        return inMemorySiteContent;
    }

    function saveSiteContentLocal(content) {
        inMemorySiteContent = { ...DEFAULT_SITE_CONTENT, ...content };
        try {
            localStorage.setItem(STORAGE_SITE_CONTENT_KEY, JSON.stringify(inMemorySiteContent));
        } catch (e) {
            console.warn('Storage quota warning:', e);
        }
    }

    // Apply Site Content to the DOM
    function applySiteContentToDOM(content) {
        if (!content) content = getSiteContent();

        // Navigation
        const navName = document.getElementById('site-nav-name');
        if (navName && content.fullName) navName.textContent = content.fullName;

        // Hero Section
        const heroLine1 = document.getElementById('site-hero-line1');
        if (heroLine1 && content.heroLine1) heroLine1.textContent = content.heroLine1;

        const heroMark = document.getElementById('site-hero-mark');
        if (heroMark && content.heroMark) heroMark.textContent = content.heroMark;

        const heroLead = document.getElementById('site-hero-lead');
        if (heroLead && content.heroLead) heroLead.textContent = content.heroLead;

        const heroProof = document.getElementById('site-hero-proof');
        if (heroProof && content.heroProof) heroProof.textContent = content.heroProof;

        const badgeRole1 = document.getElementById('site-badge-role1');
        if (badgeRole1 && content.badgeRole1) badgeRole1.textContent = content.badgeRole1;

        const badgeRole2 = document.getElementById('site-badge-role2');
        if (badgeRole2 && content.badgeRole2) badgeRole2.textContent = content.badgeRole2;

        const badgeLoc = document.getElementById('site-badge-loc');
        if (badgeLoc && content.badgeLoc) badgeLoc.textContent = content.badgeLoc;

        if (content.heroPhoto && typeof window.updatePuzzleHeroImage === 'function') {
            window.updatePuzzleHeroImage(content.heroPhoto);
        }

        // About Section
        const aboutBio = document.getElementById('site-about-bio');
        if (aboutBio && content.aboutBio) aboutBio.textContent = content.aboutBio;

        const aboutDegree = document.getElementById('site-about-degree');
        if (aboutDegree && content.aboutDegree) aboutDegree.textContent = content.aboutDegree;

        const aboutInst = document.getElementById('site-about-inst');
        if (aboutInst && content.aboutInst) aboutInst.textContent = content.aboutInst;

        const aboutYear = document.getElementById('site-about-year');
        if (aboutYear && content.aboutEduYears) aboutYear.textContent = content.aboutEduYears;

        // Stats
        const statYears = document.getElementById('site-stat-years');
        if (statYears && content.statYears) statYears.textContent = content.statYears;

        const statProjects = document.getElementById('site-stat-projects');
        if (statProjects && content.statProjects) statProjects.textContent = content.statProjects;

        const statQuality = document.getElementById('site-stat-quality');
        if (statQuality && content.statQuality) statQuality.textContent = content.statQuality;

        const statClients = document.getElementById('site-stat-clients');
        if (statClients && content.statClients) statClients.textContent = content.statClients;

        // Pipeline Section
        const pipeHeadline = document.getElementById('site-pipe-headline');
        if (pipeHeadline && content.pipeHeadline) pipeHeadline.textContent = content.pipeHeadline;

        const pipeCard1 = document.getElementById('site-pipe-card1-sub');
        if (pipeCard1 && content.pipeCard1Sub) pipeCard1.textContent = content.pipeCard1Sub;

        const pipeCard2 = document.getElementById('site-pipe-card2-sub');
        if (pipeCard2 && content.pipeCard2Sub) pipeCard2.textContent = content.pipeCard2Sub;

        const pipeCard3 = document.getElementById('site-pipe-card3-sub');
        if (pipeCard3 && content.pipeCard3Sub) pipeCard3.textContent = content.pipeCard3Sub;

        // Quote
        const quoteText = document.getElementById('site-quote-text');
        if (quoteText && content.quoteText) quoteText.textContent = content.quoteText;

        const quoteAuthor = document.getElementById('site-quote-author');
        if (quoteAuthor && content.quoteAuthor) quoteAuthor.textContent = content.quoteAuthor;

        // Contact Section
        const contactHeadline = document.getElementById('site-contact-headline');
        if (contactHeadline && content.contactHeadline) contactHeadline.textContent = content.contactHeadline;

        const contactSub = document.getElementById('site-contact-sub');
        if (contactSub && content.contactSub) contactSub.textContent = content.contactSub;

        const contactEmail = document.getElementById('site-contact-email-val');
        const contactEmailCard = document.getElementById('contact-email-card');
        if (content.contactEmail) {
            if (contactEmail) contactEmail.textContent = content.contactEmail;
            if (contactEmailCard) contactEmailCard.href = `mailto:${content.contactEmail}`;
        }

        const contactWhatsapp = document.getElementById('site-contact-whatsapp-val');
        const contactWhatsappCard = document.getElementById('contact-whatsapp-card');
        if (content.contactWhatsapp) {
            if (contactWhatsapp) contactWhatsapp.textContent = content.contactWhatsapp;
            const cleanPhone = content.contactWhatsapp.replace(/[^0-9]/g, '');
            if (contactWhatsappCard) contactWhatsappCard.href = `https://wa.me/${cleanPhone}`;
        }

        const contactLinkedin = document.getElementById('site-contact-linkedin-val');
        const contactLinkedinCard = document.getElementById('contact-linkedin-card');
        if (content.contactLinkedin) {
            if (contactLinkedin) contactLinkedin.textContent = content.contactLinkedin.replace('https://www.', '').replace('https://', '');
            if (contactLinkedinCard) contactLinkedinCard.href = content.contactLinkedin;
        }

        const contactGithub = document.getElementById('site-contact-github-val');
        const contactGithubCard = document.getElementById('contact-github-card');
        if (content.contactGithub) {
            if (contactGithub) contactGithub.textContent = content.contactGithub.replace('https://www.', '').replace('https://', '');
            if (contactGithubCard) contactGithubCard.href = content.contactGithub;
        }

        const contactFacebook = document.getElementById('site-contact-facebook-val');
        const contactFacebookCard = document.getElementById('contact-facebook-card');
        if (content.contactFacebook) {
            if (contactFacebook) contactFacebook.textContent = content.contactFacebook.replace('https://www.', '').replace('https://', '');
            if (contactFacebookCard) contactFacebookCard.href = content.contactFacebook;
        }

        const contactLocation = document.getElementById('site-contact-location-val');
        if (contactLocation && content.contactLocation) contactLocation.textContent = content.contactLocation;

        // Footer
        const footerName = document.getElementById('site-footer-name');
        if (footerName && content.fullName) footerName.textContent = content.fullName;

        const footerCity = document.getElementById('site-footer-city');
        if (footerCity && content.contactLocation) footerCity.textContent = content.contactLocation;

        const footerEmail = document.getElementById('site-footer-email-link');
        if (footerEmail && content.contactEmail) {
            footerEmail.textContent = content.contactEmail;
            footerEmail.href = `mailto:${content.contactEmail}`;
        }

        const footerLinkedin = document.getElementById('site-footer-linkedin-link');
        if (footerLinkedin && content.contactLinkedin) {
            footerLinkedin.href = content.contactLinkedin;
        }

        // Render Services in main portfolio if custom
        if (Array.isArray(content.services) && content.services.length > 0) {
            renderServicesBoard(content.services);
        }
    }

    // Render Services board on the main site
    function renderServicesBoard(services) {
        const board = document.getElementById('site-services-board');
        if (!board) return;

        const serviceList = (Array.isArray(services) && services.length > 0) ? services : DEFAULT_SERVICES;

        board.innerHTML = serviceList.map((s, idx) => `
            <div class="pw-pin" id="service-card-${idx + 1}">
                <h3 class="pw-pin-title" id="site-service-${idx + 1}-title">${escapeHtml(s.title || '')}</h3>
                <p class="pw-pin-desc" id="site-service-${idx + 1}-desc">${escapeHtml(s.desc || '')}</p>
                <p class="pw-pin-tags" id="site-service-${idx + 1}-tags">${escapeHtml(s.tags || '')}</p>
            </div>
        `).join('');
    }

    // Populate CMS Form with current site content
    function populateCmsForm(content) {
        if (!content) content = getSiteContent();

        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el && val !== undefined) el.value = val;
        };

        // Tab 1: Profile & Identity
        setVal('cms-input-fullname', content.fullName || '');
        setVal('cms-input-availability', content.availability || '');
        setVal('cms-input-role1', content.badgeRole1 || '');
        setVal('cms-input-role2', content.badgeRole2 || '');
        setVal('cms-input-location', content.badgeLoc || '');

        // Tab 2: Hero Section
        setVal('cms-input-hero-line1', content.heroLine1 || '');
        setVal('cms-input-hero-mark', content.heroMark || '');
        setVal('cms-input-hero-lead', content.heroLead || '');
        setVal('cms-input-hero-proof', content.heroProof || '');
        setVal('cms-input-hero-photo', content.heroPhoto || '');

        // Tab 3: About & Stats
        setVal('cms-input-about-bio', content.aboutBio || '');
        setVal('cms-input-about-degree', content.aboutDegree || '');
        setVal('cms-input-about-inst', content.aboutInst || '');
        setVal('cms-input-about-years', content.aboutEduYears || '');
        setVal('cms-input-stat-years', content.statYears || '');
        setVal('cms-input-stat-projects', content.statProjects || '');
        setVal('cms-input-stat-quality', content.statQuality || '');
        setVal('cms-input-stat-clients', content.statClients || '');

        // Tab 4: Services
        renderCmsServicesEditor(content.services || DEFAULT_SERVICES);

        // Tab 5: Pipelines & Quotes
        setVal('cms-input-pipe-headline', content.pipeHeadline || '');
        setVal('cms-input-pipe-card1', content.pipeCard1Sub || '');
        setVal('cms-input-pipe-card2', content.pipeCard2Sub || '');
        setVal('cms-input-pipe-card3', content.pipeCard3Sub || '');
        setVal('cms-input-quote-text', content.quoteText || '');
        setVal('cms-input-quote-author', content.quoteAuthor || '');

        // Tab 6: Contact & Social
        setVal('cms-input-contact-headline', content.contactHeadline || '');
        setVal('cms-input-contact-sub', content.contactSub || '');
        setVal('cms-input-contact-email', content.contactEmail || '');
        setVal('cms-input-contact-whatsapp', content.contactWhatsapp || '');
        setVal('cms-input-contact-linkedin', content.contactLinkedin || '');
        setVal('cms-input-contact-github', content.contactGithub || '');
        setVal('cms-input-contact-facebook', content.contactFacebook || '');
        setVal('cms-input-contact-location', content.contactLocation || '');
    }

    // Render Editable Services Cards inside CMS
    let currentCmsServices = [];

    function renderCmsServicesEditor(services) {
        currentCmsServices = Array.isArray(services) ? [...services] : [...DEFAULT_SERVICES];
        const container = document.getElementById('cms-services-container');
        if (!container) return;

        container.innerHTML = currentCmsServices.map((s, idx) => `
            <div class="cms-service-edit-card" data-service-idx="${idx}">
                <div class="cms-service-edit-head">
                    <span class="badge-service-num">Service #${idx + 1}</span>
                    <button type="button" class="btn-remove-service" data-remove-idx="${idx}" title="Remove Service" style="background:rgba(239,68,68,0.12); color:#f87171; border:1px solid rgba(239,68,68,0.25); border-radius:6px; padding:3px 8px; font-size:11px; cursor:pointer;">
                        ✕ Remove
                    </button>
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label class="form-label" style="font-size:11px;">Service Title</label>
                    <input type="text" class="form-input cms-srv-title" value="${escapeHtml(s.title || '')}" placeholder="e.g. B2B Lead Generation" />
                </div>
                <div class="form-group" style="margin-bottom:8px;">
                    <label class="form-label" style="font-size:11px;">Description</label>
                    <textarea class="form-input cms-srv-desc" rows="2" placeholder="Describe the service outcome...">${escapeHtml(s.desc || '')}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label" style="font-size:11px;">Feature Tags (separated by ·)</label>
                    <input type="text" class="form-input cms-srv-tags" value="${escapeHtml(s.tags || '')}" placeholder="Verified Emails · Targeted Personas · Zero Bounces" />
                </div>
            </div>
        `).join('');

        // Attach remove event handlers
        container.querySelectorAll('.btn-remove-service').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const removeIdx = parseInt(btn.getAttribute('data-remove-idx'), 10);
                if (!isNaN(removeIdx)) {
                    // Update from current input state before removing
                    const updated = [];
                    container.querySelectorAll('.cms-service-edit-card').forEach((card, i) => {
                        if (i !== removeIdx) {
                            updated.push({
                                title: card.querySelector('.cms-srv-title')?.value || '',
                                desc: card.querySelector('.cms-srv-desc')?.value || '',
                                tags: card.querySelector('.cms-srv-tags')?.value || ''
                            });
                        }
                    });
                    renderCmsServicesEditor(updated);
                    showNotificationToast('Service card removed.');
                }
            });
        });
    }

    // Add New Service button in CMS
    const btnCmsAddService = document.getElementById('btn-cms-add-service');
    if (btnCmsAddService) {
        btnCmsAddService.addEventListener('click', (e) => {
            e.preventDefault();
            const container = document.getElementById('cms-services-container');
            const updated = [];
            if (container) {
                container.querySelectorAll('.cms-service-edit-card').forEach(card => {
                    updated.push({
                        title: card.querySelector('.cms-srv-title')?.value || '',
                        desc: card.querySelector('.cms-srv-desc')?.value || '',
                        tags: card.querySelector('.cms-srv-tags')?.value || ''
                    });
                });
            }
            updated.push({
                title: 'New Specialized Service',
                desc: 'High precision data intelligence, custom automation scripts, and targeted prospect delivery.',
                tags: 'Custom Solution · Verified Quality · High Accuracy'
            });
            renderCmsServicesEditor(updated);
            showNotificationToast('New service card added.');
        });
    }

    // Collect Current Values from CMS Form
    function collectCmsFormData() {
        const getVal = (id) => (document.getElementById(id)?.value || '').trim();

        // Collect services
        const serviceCards = document.querySelectorAll('.cms-service-edit-card');
        const services = [];
        serviceCards.forEach(card => {
            const title = (card.querySelector('.cms-srv-title')?.value || '').trim();
            const desc = (card.querySelector('.cms-srv-desc')?.value || '').trim();
            const tags = (card.querySelector('.cms-srv-tags')?.value || '').trim();
            if (title || desc) {
                services.push({ title, desc, tags });
            }
        });

        return {
            fullName: getVal('cms-input-fullname') || DEFAULT_SITE_CONTENT.fullName,
            availability: getVal('cms-input-availability') || DEFAULT_SITE_CONTENT.availability,
            badgeRole1: getVal('cms-input-role1') || DEFAULT_SITE_CONTENT.badgeRole1,
            badgeRole2: getVal('cms-input-role2') || DEFAULT_SITE_CONTENT.badgeRole2,
            badgeLoc: getVal('cms-input-location') || DEFAULT_SITE_CONTENT.badgeLoc,

            heroLine1: getVal('cms-input-hero-line1') || DEFAULT_SITE_CONTENT.heroLine1,
            heroMark: getVal('cms-input-hero-mark') || DEFAULT_SITE_CONTENT.heroMark,
            heroLead: getVal('cms-input-hero-lead') || DEFAULT_SITE_CONTENT.heroLead,
            heroProof: getVal('cms-input-hero-proof') || DEFAULT_SITE_CONTENT.heroProof,
            heroPhoto: getVal('cms-input-hero-photo') || DEFAULT_SITE_CONTENT.heroPhoto,

            aboutBio: getVal('cms-input-about-bio') || DEFAULT_SITE_CONTENT.aboutBio,
            aboutDegree: getVal('cms-input-about-degree') || DEFAULT_SITE_CONTENT.aboutDegree,
            aboutInst: getVal('cms-input-about-inst') || DEFAULT_SITE_CONTENT.aboutInst,
            aboutEduYears: getVal('cms-input-about-years') || DEFAULT_SITE_CONTENT.aboutEduYears,
            statYears: getVal('cms-input-stat-years') || DEFAULT_SITE_CONTENT.statYears,
            statProjects: getVal('cms-input-stat-projects') || DEFAULT_SITE_CONTENT.statProjects,
            statQuality: getVal('cms-input-stat-quality') || DEFAULT_SITE_CONTENT.statQuality,
            statClients: getVal('cms-input-stat-clients') || DEFAULT_SITE_CONTENT.statClients,

            services: services.length > 0 ? services : DEFAULT_SERVICES,

            pipeHeadline: getVal('cms-input-pipe-headline') || DEFAULT_SITE_CONTENT.pipeHeadline,
            pipeCard1Sub: getVal('cms-input-pipe-card1') || DEFAULT_SITE_CONTENT.pipeCard1Sub,
            pipeCard2Sub: getVal('cms-input-pipe-card2') || DEFAULT_SITE_CONTENT.pipeCard2Sub,
            pipeCard3Sub: getVal('cms-input-pipe-card3') || DEFAULT_SITE_CONTENT.pipeCard3Sub,
            quoteText: getVal('cms-input-quote-text') || DEFAULT_SITE_CONTENT.quoteText,
            quoteAuthor: getVal('cms-input-quote-author') || DEFAULT_SITE_CONTENT.quoteAuthor,

            contactHeadline: getVal('cms-input-contact-headline') || DEFAULT_SITE_CONTENT.contactHeadline,
            contactSub: getVal('cms-input-contact-sub') || DEFAULT_SITE_CONTENT.contactSub,
            contactEmail: getVal('cms-input-contact-email') || DEFAULT_SITE_CONTENT.contactEmail,
            contactWhatsapp: getVal('cms-input-contact-whatsapp') || DEFAULT_SITE_CONTENT.contactWhatsapp,
            contactLinkedin: getVal('cms-input-contact-linkedin') || DEFAULT_SITE_CONTENT.contactLinkedin,
            contactGithub: getVal('cms-input-contact-github') || DEFAULT_SITE_CONTENT.contactGithub,
            contactFacebook: getVal('cms-input-contact-facebook') || DEFAULT_SITE_CONTENT.contactFacebook,
            contactLocation: getVal('cms-input-contact-location') || DEFAULT_SITE_CONTENT.contactLocation
        };
    }

    // Sync Site Content from Supabase Cloud Database on Startup
    async function syncSiteContentFromSupabase() {
        try {
            let row = null;
            let backendSucceeded = false;

            // 1. Try Backend API (Secret Key)
            try {
                const res = await fetch('/api/admin/content');
                if (res.ok) {
                    const json = await res.json();
                    backendSucceeded = true;
                    if (json.success && json.data) {
                        row = [json.data];
                    }
                }
            } catch (e) {}

            // 2. Try Supabase Client SDK if initialized (Anon Key) only if backend failed
            if (!backendSucceeded && !row && supabaseClient) {
                try {
                    const { data: sdkData, error } = await supabaseClient.from('site_content').select('*').eq('id', 'site_config_v1');
                    if (!error && Array.isArray(sdkData) && sdkData.length > 0) {
                        row = sdkData;
                    }
                } catch (e) {}
            }

            if (row && Array.isArray(row) && row.length > 0) {
                const data = row[0];
                let remoteConfig = null;

                if (data.content && typeof data.content === 'object') {
                    remoteConfig = data.content;
                } else if (data.file_name) {
                    try {
                        remoteConfig = JSON.parse(data.file_name);
                    } catch (e) {}
                }
                if (!remoteConfig && Array.isArray(data.sample_rows) && data.sample_rows[0]) {
                    remoteConfig = data.sample_rows[0];
                }

                if (remoteConfig && typeof remoteConfig === 'object') {
                    const merged = { ...DEFAULT_SITE_CONTENT, ...remoteConfig };
                    saveSiteContentLocal(merged);
                    applySiteContentToDOM(merged);
                    populateCmsForm(merged);
                    console.log('✓ Site content permanently synced from Database');
                }
            }
        } catch (err) {
            console.warn('Site content sync notice:', err);
        }
    }

    // Push Site Content to Supabase Database via Backend Secret Key
    async function pushSiteContentToSupabase(content) {
        try {
            // 1. Send to Backend API (uses server-side Supabase Secret Key for 100% reliable upsert)
            let backendSaved = false;
            try {
                const res = await fetch('/api/admin/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content })
                });
                if (res.ok) {
                    backendSaved = true;
                }
            } catch (e) {}

            const payload = {
                id: 'site_config_v1',
                title: 'SITE_CONTENT_CONFIG',
                location: content.badgeLoc || 'Dhaka, Bangladesh',
                photo: content.heroPhoto || '/assets/b2b_lead_gen_graphic.jpg',
                type: 'SITE_CONFIG',
                quality: '100% Zero-Bounce Verified',
                sheet_url: '/assets/leads_sample_dataset.csv',
                file_name: JSON.stringify(content),
                sample_rows: [content]
            };

            // 2. Direct client fallback if backend unreachable
            if (!backendSaved) {
                if (supabaseClient) {
                    try {
                        await supabaseClient.from('site_content').upsert([{
                            id: 'site_config_v1',
                            content: content,
                            file_name: JSON.stringify(content),
                            updated_at: new Date().toISOString()
                        }]);
                    } catch (e) {}
                    try {
                        await supabaseClient.from('leads').upsert([payload]);
                    } catch (e) {}
                }

                let res = await supabaseRest('site_content', {
                    method: 'POST',
                    headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
                    body: JSON.stringify({
                        id: 'site_config_v1',
                        content: content,
                        file_name: JSON.stringify(content),
                        updated_at: new Date().toISOString()
                    })
                });

                if (!res) {
                    await supabaseRest('leads', {
                        method: 'POST',
                        headers: { 'Prefer': 'resolution=merge-duplicates,return=representation' },
                        body: JSON.stringify(payload)
                    });
                }
            }
        } catch (err) {
            console.warn('Supabase site content push notice:', err);
        }
    }

    // Router: Switch between Main Portfolio, Leads Sample Page, and Admin CMS
    const portfolioView = document.getElementById('portfolio-main-view');
    const leadsSamplesView = document.getElementById('leads-samples-view');
    const adminCmsView = document.getElementById('admin-cms-view');
    const navLinkSamples = document.getElementById('nav-link-leads-samples');
    const navLinkAdmin = document.getElementById('nav-link-admin');
    const footerLinkAdmin = document.getElementById('footer-link-admin');

    function handleRouting() {
        const hash = window.location.hash || '';
        const isSamplesPage = hash.startsWith('#leads-samples');
        const isAdminPage = hash.startsWith('#admin') || hash === '#cms' || hash === '#admin-cms';

        if (isAdminPage) {
            if (portfolioView) portfolioView.style.display = 'none';
            if (leadsSamplesView) {
                leadsSamplesView.style.display = 'none';
                leadsSamplesView.setAttribute('aria-hidden', 'true');
            }
            if (adminCmsView) {
                adminCmsView.style.display = 'block';
                adminCmsView.setAttribute('aria-hidden', 'false');
            }
            if (navLinkAdmin) navLinkAdmin.classList.add('active');
            if (footerLinkAdmin) footerLinkAdmin.classList.add('active');
            if (navLinkSamples) navLinkSamples.classList.remove('active');

            // Ensure an active CMS tab panel is visible
            const activePanel = document.querySelector('.cms-tab-content.active');
            if (!activePanel) {
                const firstPanel = document.getElementById('cms-tab-profile');
                if (firstPanel) firstPanel.classList.add('active');
                const firstBtn = document.querySelector('.cms-nav-btn[data-tab="cms-tab-profile"]');
                if (firstBtn) firstBtn.classList.add('active');
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (!isAdminLoggedIn()) {
                openModal('admin-login-modal');
            }
            populateCmsForm(getSiteContent());
        } else if (isSamplesPage) {
            if (portfolioView) portfolioView.style.display = 'none';
            if (adminCmsView) {
                adminCmsView.style.display = 'none';
                adminCmsView.setAttribute('aria-hidden', 'true');
            }
            if (leadsSamplesView) {
                leadsSamplesView.style.display = 'block';
                leadsSamplesView.setAttribute('aria-hidden', 'false');
            }
            if (navLinkSamples) navLinkSamples.classList.add('active');
            if (navLinkAdmin) navLinkAdmin.classList.remove('active');
            if (footerLinkAdmin) footerLinkAdmin.classList.remove('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

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
            if (adminCmsView) {
                adminCmsView.style.display = 'none';
                adminCmsView.setAttribute('aria-hidden', 'true');
            }
            if (navLinkSamples) navLinkSamples.classList.remove('active');
            if (navLinkAdmin) navLinkAdmin.classList.remove('active');
            if (footerLinkAdmin) footerLinkAdmin.classList.remove('active');

            if (hash && hash !== '#') {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    }

    // CMS Tab Switching Logic
    const cmsNavBtns = document.querySelectorAll('.cms-nav-btn[data-tab]');
    const cmsTabPanels = document.querySelectorAll('.cms-tab-content');

    cmsNavBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = btn.getAttribute('data-tab');
            cmsNavBtns.forEach(b => b.classList.remove('active'));
            cmsTabPanels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Preset Hero Images Buttons in CMS
    document.querySelectorAll('[data-cms-hero-img]').forEach(btn => {
        btn.addEventListener('click', () => {
            const imgPath = btn.getAttribute('data-cms-hero-img');
            const heroInput = document.getElementById('cms-input-hero-photo');
            if (heroInput && imgPath) {
                heroInput.value = imgPath;
                if (typeof window.updatePuzzleHeroImage === 'function') {
                    window.updatePuzzleHeroImage(imgPath);
                }
                showNotificationToast('Hero image selected.');
            }
        });
    });

    // Save All CMS Changes Handler (Works from topbar, panel footers, and floating bar)
    async function executeCmsSave() {
        const updated = collectCmsFormData();
        const allSaveBtns = document.querySelectorAll('.btn-cms-save, .btn-cms-save-trigger');

        allSaveBtns.forEach(btn => {
            btn.disabled = true;
            btn.setAttribute('data-orig-html', btn.innerHTML);
            btn.innerHTML = `
                <svg class="spin-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                </svg>
                <span>Saving to Database...</span>
            `;
        });

        // Save locally & update live DOM immediately
        saveSiteContentLocal(updated);
        applySiteContentToDOM(updated);

        // Persist to Supabase Cloud Database
        await pushSiteContentToSupabase(updated);

        setTimeout(() => {
            allSaveBtns.forEach(btn => {
                btn.disabled = false;
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span>Saved & Synced ✓</span>
                `;
            });
            showNotificationToast('Website changes saved to database successfully!');

            setTimeout(() => {
                allSaveBtns.forEach(btn => {
                    const orig = btn.getAttribute('data-orig-html');
                    if (orig) btn.innerHTML = orig;
                });
            }, 3000);
        }, 500);
    }

    // Attach click listeners to all CMS save buttons
    document.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('#btn-cms-save-all, #btn-cms-floating-save, .btn-cms-save-trigger');
        if (saveBtn) {
            e.preventDefault();
            executeCmsSave();
            return;
        }

        const resetBtn = e.target.closest('#btn-cms-reset-defaults, #btn-cms-floating-reset, .btn-cms-reset-trigger');
        if (resetBtn) {
            e.preventDefault();
            if (confirm('Are you sure you want to reset the website content back to standard default values?')) {
                saveSiteContentLocal(DEFAULT_SITE_CONTENT);
                applySiteContentToDOM(DEFAULT_SITE_CONTENT);
                populateCmsForm(DEFAULT_SITE_CONTENT);
                pushSiteContentToSupabase(DEFAULT_SITE_CONTENT);
                showNotificationToast('Default portfolio content restored and synced.');
            }
        }
    });

    // Keyboard Shortcut: Ctrl + S / Cmd + S to save CMS changes
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
            const hash = window.location.hash || '';
            const isAdminPage = hash.startsWith('#admin') || hash === '#cms' || hash === '#admin-cms';
            if (isAdminPage) {
                e.preventDefault();
                executeCmsSave();
            }
        }
    });

    // CMS Logout Button
    const btnCmsLogout = document.getElementById('btn-cms-logout');
    if (btnCmsLogout) {
        btnCmsLogout.addEventListener('click', () => {
            setAdminAuth(false);
            window.location.hash = '#hero';
            showNotificationToast('Logged out of Admin Portal.');
        });
    }

    // CMS Back to Home Button
    const btnCmsBackHome = document.getElementById('btn-cms-back-home');
    if (btnCmsBackHome) {
        btnCmsBackHome.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = '#hero';
        });
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
            const rawFields = sample.fields || 'Business Name, Contact Name, Direct Email, Phone, LinkedIn, Website, Location, Industry, Revenue';
            const fieldList = rawFields.split(',').map(f => f.trim()).filter(Boolean).slice(0, 5);

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
                            <span>${escapeHtml(sample.location || 'Global Markets')}</span>
                        </div>

                        <h3 class="lead-card-title">${escapeHtml(sample.title)}</h3>

                        <div class="lead-card-quality-box">
                            <span class="lead-card-quality-label">Deliverability Guarantee</span>
                            <span class="lead-card-quality-val">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <span>${escapeHtml(sample.quality || '100% Zero-Bounce Verified')}</span>
                            </span>
                        </div>

                        <div class="lead-card-fields">
                            ${fieldList.map(f => `<span class="lead-card-field-tag">${escapeHtml(f)}</span>`).join('')}
                        </div>

                        <div class="lead-card-footer">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <button type="button" class="btn-lead-download" onclick="window.downloadLeadSheet('${escapeHtml(sample.id)}')" title="Download spreadsheet for ${escapeHtml(sample.title)}">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    <span>Download</span>
                                </button>

                                <button type="button" class="btn-lead-preview" onclick="window.inspectSamplePreview('${escapeHtml(sample.id)}')">
                                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    <span>Preview</span>
                                </button>
                            </div>

                            ${isAdmin ? `
                                <div class="lead-card-admin-actions">
                                    <button type="button" class="btn-card-edit" onclick="window.editLeadSample('${escapeHtml(sample.id)}')" title="Edit this lead sample">
                                        <span>✏️ Edit</span>
                                    </button>
                                    <button type="button" class="btn-card-delete" onclick="window.deleteLeadSample('${escapeHtml(sample.id)}', this)" title="Delete this lead sample" aria-label="Delete sample">
                                        <span>🗑️</span>
                                    </button>
                                </div>
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
                handleRouting();
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
    const editorLocation = document.getElementById('editor-sample-location');
    const editorSheetUrl = document.getElementById('editor-sample-sheet-url');
    const editorPhotoUrl = document.getElementById('editor-photo-url');
    const editorPhotoPreview = document.getElementById('editor-photo-preview');
    const editorFileInput = document.getElementById('editor-file-input');
    const photoDropzone = document.getElementById('photo-dropzone');

    // Sample File Source elements
    const tabFileLink = document.getElementById('tab-file-link');
    const tabFileUpload = document.getElementById('tab-file-upload');
    const panelFileLink = document.getElementById('panel-file-link');
    const panelFileUpload = document.getElementById('panel-file-upload');
    const editorDatasetFileInput = document.getElementById('editor-dataset-file-input');
    const datasetFileDropzone = document.getElementById('dataset-file-dropzone');
    const datasetFileNameLabel = document.getElementById('dataset-file-name-label');

    let currentSelectedPhoto = '/assets/b2b_lead_gen_graphic.jpg';
    let currentSelectedFile = null; // { dataUrl: string, name: string }

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

    // Sample File Source Tabs
    function switchFileTab(activeTab, activePanel) {
        [tabFileLink, tabFileUpload].forEach(t => t?.classList.remove('active'));
        [panelFileLink, panelFileUpload].forEach(p => { if (p) p.style.display = 'none'; });
        activeTab?.classList.add('active');
        if (activePanel) activePanel.style.display = 'block';
    }

    if (tabFileLink) tabFileLink.addEventListener('click', () => switchFileTab(tabFileLink, panelFileLink));
    if (tabFileUpload) tabFileUpload.addEventListener('click', () => switchFileTab(tabFileUpload, panelFileUpload));

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

    // Photo Upload Handler with automatic compression
    async function handlePhotoFile(file) {
        if (!file || !file.type.startsWith('image/')) return;
        const textEl = photoDropzone?.querySelector('.dropzone-text');
        if (textEl) textEl.textContent = `Optimizing photo: ${file.name}...`;

        try {
            const compressedDataUrl = await compressImageFile(file, 800, 0.85);
            currentSelectedPhoto = compressedDataUrl || '/assets/b2b_lead_gen_graphic.jpg';
            if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
            if (editorPhotoUrl) editorPhotoUrl.value = currentSelectedPhoto;
            if (textEl) textEl.textContent = `✓ Selected: ${file.name}`;
        } catch (err) {
            console.warn('Compression notice:', err);
            const reader = new FileReader();
            reader.onload = (e) => {
                currentSelectedPhoto = e.target.result;
                if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
                if (editorPhotoUrl) editorPhotoUrl.value = currentSelectedPhoto;
                if (textEl) textEl.textContent = `✓ Selected: ${file.name}`;
            };
            reader.readAsDataURL(file);
        }
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

    // Dataset File Upload Handler (.csv, .xlsx, .xls)
    function handleDatasetFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            currentSelectedFile = {
                dataUrl: e.target.result,
                name: file.name
            };
            if (datasetFileNameLabel) {
                datasetFileNameLabel.textContent = `✓ Attached File: ${file.name}`;
            }
        };
        reader.readAsDataURL(file);
    }

    if (editorDatasetFileInput) {
        editorDatasetFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleDatasetFile(e.target.files[0]);
            }
        });
    }

    if (datasetFileDropzone) {
        ['dragenter', 'dragover'].forEach(eventName => {
            datasetFileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                datasetFileDropzone.classList.add('dragover');
            });
        });
        ['dragleave', 'drop'].forEach(eventName => {
            datasetFileDropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                datasetFileDropzone.classList.remove('dragover');
            });
        });
        datasetFileDropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer?.files && e.dataTransfer.files[0]) {
                handleDatasetFile(e.dataTransfer.files[0]);
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
            if (editorSubmitBtn) editorSubmitBtn.textContent = 'Publish to Client Page';
            if (editorSheetUrl) editorSheetUrl.value = '';
            if (datasetFileNameLabel) datasetFileNameLabel.textContent = 'Click to upload CSV or Excel spreadsheet';
            currentSelectedFile = null;

            currentSelectedPhoto = '/assets/b2b_lead_gen_graphic.jpg';
            if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
            switchPhotoTab(tabPresets, panelPresets);
            switchFileTab(tabFileLink, panelFileLink);

            openModal('sample-editor-modal');
            if (editorTitle) editorTitle.focus();
        });
    }

    if (btnCloseSampleEditor) btnCloseSampleEditor.addEventListener('click', () => closeModal('sample-editor-modal'));
    if (btnCancelSampleEditor) btnCancelSampleEditor.addEventListener('click', () => closeModal('sample-editor-modal'));

    // Save Lead Sample Form Submit (Saves Locally and to Supabase Cloud Database)
    if (sampleEditorForm) {
        sampleEditorForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = editorId ? editorId.value.trim() : '';
            const title = (editorTitle?.value || '').trim();
            const location = (editorLocation?.value || 'Global / United States').trim();
            const photo = currentSelectedPhoto || '/assets/b2b_lead_gen_graphic.jpg';

            let sheetUrl = '/assets/leads_sample_dataset.csv';
            let fileName = '';

            if (currentSelectedFile && currentSelectedFile.dataUrl) {
                sheetUrl = currentSelectedFile.dataUrl;
                fileName = currentSelectedFile.name;
            } else if (editorSheetUrl && editorSheetUrl.value.trim()) {
                sheetUrl = editorSheetUrl.value.trim();
                fileName = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Spreadsheet.csv`;
            }

            if (!title) {
                if (editorTitle) editorTitle.focus();
                return;
            }

            const currentSamples = [...getSamples()];
            let targetSample = null;

            if (id) {
                // Edit existing sample
                const idx = currentSamples.findIndex(s => s.id === id);
                if (idx !== -1) {
                    currentSamples[idx] = {
                        ...currentSamples[idx],
                        title,
                        location: location || 'Global / United States',
                        sheetUrl,
                        fileName: fileName || currentSamples[idx].fileName,
                        photo
                    };
                    targetSample = currentSamples[idx];
                }
            } else {
                // Create new sample & publish immediately to client page
                targetSample = {
                    id: 'sample-' + Date.now(),
                    title,
                    type: 'B2B Lead Generation',
                    location: location || 'Global / United States',
                    quality: '100% Zero-Bounce Verified',
                    sheetUrl,
                    fileName: fileName || `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_dataset.csv`,
                    photo,
                    sampleRows: [
                        { name: 'Michael Sterling', title: 'Managing Director / Partner', company: 'Apex Commercial Partners', email: 'm.sterling@apexpartners.com', phone: '+1 (512) 555-0182', location: location },
                        { name: 'Sarah Montgomery', title: 'VP of Business Development', company: 'Global Growth Ventures', email: 'smontgomery@globalventures.io', phone: '+1 (415) 555-0291', location: location },
                        { name: 'David Hensley', title: 'Chief Executive Officer', company: 'Pioneer Assets Group', email: 'dhensley@pioneerassets.com', phone: '+1 (212) 555-0377', location: location }
                    ]
                };
                currentSamples.unshift(targetSample);
            }

            saveSamples(currentSamples);
            closeModal('sample-editor-modal');
            renderSamples();

            // Push to Supabase Cloud Database asynchronously
            if (targetSample) {
                pushSampleToSupabase(targetSample, false);
            }

            showNotificationToast(id ? 'Lead sample updated & synced!' : '✓ Lead sample published to client page & database!');
        });
    }

    // Global Action: Edit Lead Sample
    window.editLeadSample = function(id) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        if (editorId) editorId.value = sample.id;
        if (editorTitle) editorTitle.value = sample.title || '';
        if (editorLocation) editorLocation.value = sample.location || 'Global / United States';
        if (editorSheetUrl) editorSheetUrl.value = (sample.sheetUrl && !sample.sheetUrl.startsWith('data:')) ? sample.sheetUrl : '';

        currentSelectedPhoto = sample.photo || '/assets/b2b_lead_gen_graphic.jpg';
        if (editorPhotoPreview) editorPhotoPreview.src = currentSelectedPhoto;
        if (editorPhotoUrl) editorPhotoUrl.value = currentSelectedPhoto;

        if (editorHeading) editorHeading.textContent = 'Edit Lead Sample';
        if (editorEyebrow) editorEyebrow.textContent = 'ADMIN EDIT MODE';
        if (editorSubmitBtn) editorSubmitBtn.textContent = 'Save Changes';

        switchPhotoTab(tabPresets, panelPresets);
        switchFileTab(tabFileLink, panelFileLink);
        openModal('sample-editor-modal');
    };

    // Global Action: Delete Lead Sample
    window.deleteLeadSample = function(id, buttonEl) {
        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        if (buttonEl) {
            if (buttonEl.classList.contains('confirm-delete-active')) {
                // Second click! Execute deletion
                const updated = samples.filter(s => s.id !== id);
                saveSamples(updated);
                renderSamples();
                pushSampleToSupabase(sample, true);
                showNotificationToast('Lead sample removed.');
            } else {
                // First click! Mark it as confirming
                buttonEl.classList.add('confirm-delete-active');
                buttonEl.innerHTML = `
                    <span style="font-size:11px; font-weight:700; color:#ef4444;">Confirm?</span>
                `;
                buttonEl.title = "Click again to confirm deletion";
                
                // Automatically reset after 4.5 seconds
                setTimeout(() => {
                    if (buttonEl && buttonEl.classList.contains('confirm-delete-active')) {
                        buttonEl.classList.remove('confirm-delete-active');
                        buttonEl.title = "Delete this lead sample";
                        buttonEl.innerHTML = `
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        `;
                    }
                }, 4500);
            }
        } else {
            // Fallback
            const updated = samples.filter(s => s.id !== id);
            saveSamples(updated);
            renderSamples();
            pushSampleToSupabase(sample, true);
            showNotificationToast('Lead sample removed.');
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
        let filename = sample.fileName || `${safeTitle}_Lead_Dataset.csv`;
        if (!filename.includes('.')) {
            filename += '.csv';
        }

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
        }, 150);

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

    // Attach Database Status Pill click for manual connection testing
    const statusPill = document.getElementById('cms-db-status-pill');
    if (statusPill) {
        statusPill.style.cursor = 'pointer';
        statusPill.addEventListener('click', async () => {
            showNotificationToast('Testing Supabase Cloud Database connection...');
            const res = await pingSupabaseDatabase();
            if (res.ok) {
                showNotificationToast(`🟢 Supabase Connected! Latency: ${res.latency}ms (voixkvyylglpomahowrl)`);
            } else {
                showNotificationToast('⚠️ Supabase sync notice: Operating with local persistence cache.');
            }
        });
    }

    // Initialize UI, Database Sync, and Router
    updateAdminBarUI();
    applySiteContentToDOM();
    populateCmsForm();
    renderSamples();
    pingSupabaseDatabase();
    syncFromSupabase();
    syncSiteContentFromSupabase();
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
})();
