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

/* ── 2. Nav: Scroll Collapse to Top-Right 3-Line Menu & Animated Expand ── */
(function() {
    const nav = document.getElementById('nav');
    const floatingToggle = document.getElementById('nav-floating-toggle');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (!nav) return;
    const navInner = nav.querySelector('.nav-inner');

    let isExpanded = false;
    let isCollapsed = false;

    function setCollapsed(collapsed) {
        isCollapsed = collapsed;
        if (collapsed) {
            nav.classList.add('nav-collapsed');
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('nav-collapsed');
            nav.classList.remove('nav-expanded');
            nav.classList.remove('scrolled');
            if (floatingToggle) floatingToggle.setAttribute('aria-expanded', 'false');
            isExpanded = false;
        }
    }

    function toggleExpand() {
        if (!isCollapsed) return;
        isExpanded = !isExpanded;
        nav.classList.toggle('nav-expanded', isExpanded);
        if (floatingToggle) {
            floatingToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        }
    }

    function collapseMenu() {
        if (isExpanded) {
            isExpanded = false;
            nav.classList.remove('nav-expanded');
            if (floatingToggle) floatingToggle.setAttribute('aria-expanded', 'false');
        }
    }

    // Scroll listener with threshold
    let ticking = false;
    const handleScroll = () => {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            if (!isCollapsed) {
                setCollapsed(true);
            }
        } else {
            if (isCollapsed) {
                setCollapsed(false);
            }
        }
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
        }
    }, { passive: true });

    // Initialize on load
    handleScroll();

    // Floating 3-Line Button Click: expand / collapse in place
    if (floatingToggle) {
        floatingToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleExpand();
        });
    }

    // Mobile Menu Toggle Button (when inside expanded view or at top on small screens)
    if (mobileToggle && navInner) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navInner.classList.toggle('mobile-menu-active');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    // Link Clicks: smooth scroll, close expanded state & collapse to 3 lines
    const allNavLinks = nav.querySelectorAll('.nav-links a, .nav-logo');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            collapseMenu();
            if (navInner) navInner.classList.remove('mobile-menu-active');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
            setTimeout(() => {
                if (window.scrollY > 40) {
                    setCollapsed(true);
                }
            }, 120);
        });
    });

    // Close when clicking outside navbar while expanded
    document.addEventListener('click', (e) => {
        if (isExpanded && navInner && !navInner.contains(e.target) && floatingToggle && !floatingToggle.contains(e.target)) {
            collapseMenu();
        }
        if (navInner && !navInner.contains(e.target) && mobileToggle && !mobileToggle.contains(e.target)) {
            navInner.classList.remove('mobile-menu-active');
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            collapseMenu();
            if (navInner) navInner.classList.remove('mobile-menu-active');
        }
    });
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
        title: 'Targeted B2B Decision-Maker Prospect List [Sample Dataset]',
        category: 'B2B Lead Generation · Outbound Sales · Sample Dataset',
        objective: 'Build a targeted demonstration list of verified decision-makers (Founders, VP of Sales, Operations Directors) for a B2B SaaS outreach campaign.',
        source: 'LinkedIn Sales Navigator, Apollo, Crunchbase, Company Team pages.',
        fields: ['Full Name', 'Job Title', 'Work Email', 'Company Name', 'Website', 'Headcount', 'HQ Location', 'LinkedIn Profile URL', 'Verification Status'],
        process: [
            'Filter target companies by ICP (B2B SaaS, 15–200 employees, US/UK/Canada).',
            'Identify primary and secondary decision-makers per company.',
            'Extract direct work emails using syntax lookup & MX pattern matching.',
            'Perform domain MX validation and syntax verification to minimize bounce rates.',
            'Format and clean data into ready-to-import CSV/Excel (.xlsx).'
        ],
        tools: ['Python', 'Apollo', 'Email Syntax & MX Verifier', 'Excel (.xlsx) / CSV'],
        sampleRows: [
            { name: 'Alex Henderson', title: 'VP of Sales', company: 'NovaScale Media', email: 'alex@novascale.io', loc: 'Austin, TX', status: 'Deliverable (MX Valid)' },
            { name: 'Sarah Miller', title: 'Co-Founder & COO', company: 'Vanguard Logistics', email: 'sarah.m@vanguard.co', loc: 'Chicago, IL', status: 'Deliverable (MX Valid)' },
            { name: 'David Zhao', title: 'Head of Growth', company: 'CloudPulse Tech', email: 'dzhao@cloudpulse.net', loc: 'San Francisco, CA', status: 'Deliverable (MX Valid)' },
            { name: 'Elena Rostova', title: 'Director of RevOps', company: 'OmniFlow Solutions', email: 'elena@omniflow.com', loc: 'New York, NY', status: 'Deliverable (MX Valid)' }
        ]
    },
    'gmaps-leads': {
        title: 'Google Maps Commercial Business Directory [Sample Dataset]',
        category: 'Google Maps Lead Gen · Python & Playwright · Sample Dataset',
        objective: 'Extract comprehensive local business contact data across designated commercial regions for localized B2B service outreach.',
        source: 'Google Maps Places directory and public company websites.',
        fields: ['Business Name', 'Category / Niche', 'Direct Phone Number', 'Full Street Address', 'Rating', 'Total Reviews', 'Website URL', 'Contact Email'],
        process: [
            'Construct automated Playwright scraper targeting designated geo-coordinates.',
            'Extract place cards with infinite scrolling & dynamic DOM rendering.',
            'Crawl discovered company websites to locate contact emails and public touchpoints.',
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
        title: 'E-commerce Catalog & Multi-Variant Scraping [Sample Dataset]',
        category: 'Web Scraping · Selenium & Python · Sample Dataset',
        objective: 'Extract product SKUs across deep nested categories with pricing, inventory levels, and specifications for catalog benchmarking.',
        source: 'Public e-commerce retail catalogs with dynamic JavaScript rendering.',
        fields: ['SKU / Product ID', 'Product Title', 'Current Price', 'MSRP / Original Price', 'Category Hierarchy', 'Availability Status', 'Image URL'],
        process: [
            'Configure Selenium webdriver with stealth headers to bypass bot blocks.',
            'Traverse recursive category navigation and paginated infinite lists.',
            'Parse structured schema.org JSON-LD microdata for attribute fidelity.',
            'Clean currency formatting and separate brand vs. product descriptors.',
            'Deliver structured JSON and relational CSV / Excel tables.'
        ],
        tools: ['Python', 'Selenium', 'Regex', 'JSON / CSV / Excel'],
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
    const feedbackBox = document.getElementById('form-database-feedback');
    const submitBtn = document.getElementById('btn-submit-contact');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('form-name')?.value.trim();
        const email = document.getElementById('form-email')?.value.trim();
        const projectType = document.getElementById('form-type')?.value;
        const message = document.getElementById('form-message')?.value.trim();

        if (!name || !email || !message) {
            if (feedbackBox) {
                feedbackBox.style.display = 'block';
                feedbackBox.className = 'form-db-message-card';
                feedbackBox.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                feedbackBox.style.background = 'rgba(239, 68, 68, 0.08)';
                feedbackBox.innerHTML = `
                    <div class="db-msg-icon" style="background:rgba(239,68,68,0.15); border-color:rgba(239,68,68,0.3); color:#ef4444;">✕</div>
                    <div class="db-msg-body">
                        <h4 class="db-msg-title" style="color:#ef4444;">Please Complete All Required Fields</h4>
                        <p class="db-msg-desc">Make sure to provide your name, valid email, and project details.</p>
                    </div>
                `;
            }
            return;
        }

        // Loading State on Submit Button
        const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="spin" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite; display:inline-block; vertical-align:middle; margin-right:6px;">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
                </svg>
                Saving to Database...
            `;
        }

        const recordId = 'MSG-' + Math.floor(100000 + Math.random() * 900000);
        const inquiryData = {
            id: recordId,
            name,
            email,
            project_type: projectType,
            message,
            created_at: new Date().toISOString()
        };

        // 1. Persist locally to storage cache
        try {
            const rawStored = localStorage.getItem('ibrahim_inbox_messages');
            const list = rawStored ? JSON.parse(rawStored) : [];
            list.unshift(inquiryData);
            localStorage.setItem('ibrahim_inbox_messages', JSON.stringify(list));
        } catch (storageErr) {
            console.warn('Local storage cache error:', storageErr);
        }

        // 2. Persist directly into Supabase Cloud Database (messages table)
        if (typeof window !== 'undefined' && window.supabase) {
            try {
                const client = window.supabase.createClient(
                    'https://voixkvyylglpomahowrl.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaXhrdnl5bGdscG9tYWhvd3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzk0NTIsImV4cCI6MjEwNDk1NTQ1Mn0.bW7gGoAuye8GnBEQpbs088pEHVkSNqBH-XqFWUim7Xw'
                );
                const { data, error } = await client.from('messages').insert([{
                    name,
                    email,
                    project_type: projectType,
                    message,
                    created_at: new Date().toISOString()
                }]).select();

                if (error) {
                    console.warn('Supabase message insert notice:', error.message);
                } else {
                    if (Array.isArray(data) && data[0] && data[0].id) {
                        inquiryData.id = String(data[0].id);
                        // Update in local cache with DB id
                        try {
                            const rawStored = localStorage.getItem('ibrahim_inbox_messages');
                            if (rawStored) {
                                const list = JSON.parse(rawStored);
                                if (Array.isArray(list) && list.length > 0) {
                                    list[0].id = String(data[0].id);
                                    localStorage.setItem('ibrahim_inbox_messages', JSON.stringify(list));
                                }
                            }
                        } catch (e) {}
                    }
                    console.log('✓ Inquiry recorded directly in Supabase messages table (Ref:', inquiryData.id, ')');
                }
            } catch (e) {
                console.warn('Supabase client exception:', e);
            }
        }

        // Restore submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }

        // 3. Render Database Confirmation Card (No Gmail or mailto opened)
        if (feedbackBox) {
            feedbackBox.style.display = 'flex';
            feedbackBox.className = 'form-db-message-card';
            feedbackBox.style.borderColor = 'rgba(16, 185, 129, 0.4)';
            feedbackBox.style.background = 'rgba(16, 185, 129, 0.09)';
            feedbackBox.innerHTML = `
                <div class="db-msg-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                </div>
                <div class="db-msg-body">
                    <h4 class="db-msg-title">✓ Query Stored in Database</h4>
                    <p class="db-msg-desc">
                        Thank you, <strong>${escapeHtml(name)}</strong>! Your query for <strong>${escapeHtml(projectType)}</strong> has been recorded into our database. MD. Ibrahim has received your project specifications and will review them shortly.
                    </p>
                    <div class="db-msg-meta">
                        <span class="db-msg-badge">✓ Database Status: Stored &amp; Synced</span>
                        <span class="db-msg-id">Ref ID: #${recordId}</span>
                        <span class="db-msg-time" style="color:var(--ink-3); font-size:11.5px;">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            `;
            feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        document.getElementById('form-name').value = '';
        document.getElementById('form-email').value = '';
        document.getElementById('form-message').value = '';

        // Notify inbox component to refresh if initialized
        if (typeof window.refreshAdminInbox === 'function') {
            window.refreshAdminInbox();
        }
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
   8. Leads Sample Showcase & Admin Portal Manager (Direct Supabase Cloud Connected)
───────────────────────────────────── */
(function initLeadsSampleApp() {
    const STORAGE_AUTH_KEY = 'ibrahim_leads_admin_auth';

    // Supabase Cloud Database Project Configuration (Direct Frontend to Cloud)
    const SUPABASE_CONFIG = {
        projectId: 'voixkvyylglpomahowrl',
        url: 'https://voixkvyylglpomahowrl.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvaXhrdnl5bGdscG9tYWhvd3JsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzk0NTIsImV4cCI6MjEwNDk1NTQ1Mn0.bW7gGoAuye8GnBEQpbs088pEHVkSNqBH-XqFWUim7Xw'
    };

    let supabase = null;
    if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
        try {
            supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✓ Direct Supabase Client connected to Supabase Cloud Database:', SUPABASE_CONFIG.projectId);
        } catch (e) {
            console.error('Supabase JS Client initialization error:', e);
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
            tags: 'Validated Contacts · Targeted Personas · CRM Ready'
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
            tags: 'Deduplication · E.164 Formatting · Excel & CSV Formats'
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
        heroProof: 'Domain & MX verification · Deduplicated records · CRM-ready Excel & CSV',
        heroPhoto: '/assets/b2b_lead_gen_graphic.jpg',
        aboutBio: 'I help businesses collect targeted prospect data and build high-quality contact lists through systematic web research, custom web scraping, and structured data collection. I focus on delivering clean, organized, and practical datasets ready for cold email campaigns, outbound SDR workflows, and CRM imports without unverified contacts or bloated fluff.',
        aboutDegree: 'Diploma in Agriculture',
        aboutInst: 'Agriculture Training Institute, Gaibandha',
        aboutEduYears: '2019 – 2023',
        statYears: 'Custom ICP',
        statProjects: 'Clean & Deduped',
        statQuality: 'CRM-Ready',
        statClients: 'Python Powered',
        services: DEFAULT_SERVICES,
        pipeHeadline: 'Robust Pipelines Built for Scale',
        pipeCard1Sub: 'Custom scripts utilizing Playwright and Selenium to bypass bot detection, handle dynamic JavaScript hydration, and extract clean datasets at high speeds.',
        pipeCard2Sub: 'Strict deduplication by domain and company name, standardizing phone numbers to international E.164 formats, and validating email syntax against live mail exchange records.',
        pipeCard3Sub: 'Deep parsing of local business listings across specific regions, cities, and zip codes to discover direct phone numbers, business hours, and operational status.',
        quoteText: '"Clean, structured data is the foundation of effective outbound outreach. I focus on custom targeting, rigorous deduplication, and ready-to-use delivery so sales teams can focus on conversations."',
        quoteAuthor: 'MD. Ibrahim Shake Shuvo · B2B Lead Generation & Web Scraping Specialist',
        contactHeadline: "Let's Discuss Your Data Needs",
        contactSub: 'Tell me about your target audience, required data fields, or the website you need extracted. I typically reply within 12 hours.',
        contactEmail: 'ibrahimshakeshuvo100@gmail.com',
        contactWhatsapp: '+880 1744-868938',
        contactLinkedin: 'https://www.linkedin.com/in/ibrahimshakeshuvo',
        contactGithub: 'https://github.com/Ibrahim009-Devloper',
        contactFacebook: 'https://www.facebook.com/profile.php?id=61588549130311',
        contactLocation: 'Dhaka, Bangladesh',

        // Work Projects & Featured Images
        workP1Img: '/assets/b2b_lead_gen_graphic.jpg',
        workP1Title: 'Targeted B2B Decision-Maker Prospect List for Outbound Sales [Sample Dataset]',
        workP1Summary: 'Researched, verified, and structured high-intent decision-makers across B2B technology companies. Every email address undergoes syntax and MX validation to minimize campaign bounce risks.',
        workP2Img: '/assets/gmaps_scraping.jpg',
        workP2Title: 'Automated Google Maps Local Business Directory Extraction [Sample Dataset]',
        workP2Summary: 'Deployed headless browser automation using Playwright to extract localized company profiles, phone numbers, ratings, and websites across commercial metropolitan centers.',
        workP3Img: '/assets/b2b_dashboard.jpg',
        workP3Title: 'E-commerce Multi-Category Catalog & Pricing Extraction [Sample Dataset]',
        workP3Summary: 'Automated deep pagination across dynamic JavaScript pages to scrape thousands of product SKUs, regular and discounted pricing, availability flags, and category hierarchies.'
    };

    // Initial default high-quality lead samples with attached Google Sheet CSV datasets
    const DEFAULT_SAMPLES = [
        {
            id: 'lead-sample-1',
            title: 'Targeted B2B Decision Maker Prospect List [Sample Dataset]',
            photo: '/assets/b2b_lead_gen_graphic.jpg',
            type: 'B2B Lead Generation',
            location: 'United States & Canada (Global)',
            quality: 'Sample Dataset · Syntax & MX Validated',
            records: '5,000+ Sample Records',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Full Name, Job Title, Work Email, Direct Phone, Company, LinkedIn, Website, Revenue',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            fileName: 'B2B_Decision_Makers_5000_Sample.csv',
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
            title: 'Google Maps Local Business Directory Extraction [Sample Dataset]',
            photo: '/assets/gmaps_scraping.jpg',
            type: 'Google Maps Leads',
            location: 'New York, Texas & Florida, USA',
            quality: 'Sample Dataset · Public Directory Extraction',
            records: '12,400+ Sample Profiles',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Business Name, Category, Street Address, Rating, Reviews Count, Direct Phone, Website, Email',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            fileName: 'Google_Maps_US_Dental_Sample.csv',
            sampleRows: [
                { name: 'Empire State Orthodontics', title: 'Practice Owner / Head Dentist', company: 'Empire Ortho NY', email: 'contact@empireorthony.com', phone: '+1 (212) 555-0192', location: 'Manhattan, NY, USA' },
                { name: 'Lonestar Dental Group', title: 'Managing Director', company: 'Lonestar Dental Care', email: 'info@lonestardental.org', phone: '+1 (713) 555-0844', location: 'Houston, TX, USA' },
                { name: 'Biscayne Bay Family Practice', title: 'Clinical Director', company: 'Biscayne Dental Care', email: 'office@biscaynedental.com', phone: '+1 (305) 555-0711', location: 'Miami, FL, USA' },
                { name: 'Dallas Premier Smiles', title: 'Owner & Chief Surgeon', company: 'Dallas Premier Dental', email: 'appointments@dallaspremiersmiles.com', phone: '+1 (214) 555-0322', location: 'Dallas, TX, USA' }
            ]
        },
        {
            id: 'lead-sample-3',
            title: 'Tech Executives Decision Makers Dataset [Sample Dataset]',
            photo: '/assets/b2b_dashboard.jpg',
            type: 'LinkedIn Decision Makers',
            location: 'London & Manchester, United Kingdom',
            quality: 'Sample Dataset · C-Suite & VP Personas',
            records: '3,200+ Sample Profiles',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Executive Name, Headline, Work Email, Direct Mobile, Company Size, LinkedIn Profile',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            fileName: 'UK_Tech_Execs_Sample.csv',
            sampleRows: [
                { name: 'Oliver Wright', title: 'Chief Technology Officer', company: 'FinPulse Systems UK', email: 'o.wright@finpulse.co.uk', phone: '+44 20 7946 0912', location: 'London, UK' },
                { name: 'Emma Watson-Reid', title: 'VP of Product Engineering', company: 'CloudNexus AI', email: 'emma@cloudnexus.io', phone: '+44 161 496 0381', location: 'Manchester, UK' },
                { name: 'Alexander Sterling', title: 'Founder & Managing Director', company: 'Sterling Cybersec', email: 'a.sterling@sterlingsec.com', phone: '+44 20 7183 4492', location: 'London, UK' },
                { name: 'Sophie Harrison', title: 'Chief Revenue Officer', company: 'VentureScale SaaS', email: 'sophie.h@venturescale.io', phone: '+44 113 496 0884', location: 'Leeds, UK' }
            ]
        },
        {
            id: 'lead-sample-4',
            title: 'Shopify DTC E-Commerce Founders & Marketing Leads [Sample Dataset]',
            photo: '/assets/b2b_lead_gen_graphic.jpg',
            type: 'E-Commerce & DTC Brands',
            location: 'USA, Canada & Australia',
            quality: 'Sample Dataset · Brand Directory Research',
            records: '1,850+ Sample Records',
            format: 'Excel (.xlsx), CSV, Google Sheets',
            fields: 'Brand Name, Store URL, Business Email, Direct Phone, Location, Instagram, Meta Ads Status',
            sheetUrl: '/assets/leads_sample_dataset.csv',
            fileName: 'DTC_ECommerce_Founders_Sample.csv',
            sampleRows: [
                { name: "'47 Brand (Apparel)", title: 'Store Owner / Brand Team', company: '47brand.myshopify.com', email: 'templ@e-product.css', phone: '+1 (394) 225-3045', location: 'USA' },
                { name: '100% PURE (Beauty)', title: 'Founder & Operations Lead', company: '100percentpure.com', email: 'info@puritycosmetics.com', phone: '+1 (415) 814-9988', location: 'San Jose, CA, USA' },
                { name: '12th Tribe (Fashion)', title: 'Managing Director / E-Commerce', company: '12thtribe.com', email: 'orders@shopfifteentwenty.com', phone: '+1 (310) 730-6420', location: 'Los Angeles, CA, USA' },
                { name: '240 Tutoring (Education)', title: 'Executive Director', company: '240tutoring.com', email: 'help@240tutoring.com', phone: '+1 (888) 535-2142', location: 'Denton, TX, USA' },
                { name: '2XU High Performance', title: 'Commercial Operations Lead', company: '2xu.com', email: 'online@2xu.com', phone: '+1 (877) 700-1298', location: 'Carlsbad, CA, USA' }
            ]
        }
    ];

    // Ping Supabase Cloud Database to test real-time connectivity
    async function pingSupabaseDatabase() {
        const startTime = Date.now();
        const statusPill = document.getElementById('cms-db-status-pill');
        const statusText = document.getElementById('cms-db-status-text');
        const floatingText = document.getElementById('cms-floating-status-text');

        if (!supabase) {
            if (statusText) statusText.textContent = 'Supabase SDK Missing';
            return { ok: false };
        }

        try {
            const { error } = await supabase.from('site_content').select('id').limit(1);
            const latency = Date.now() - startTime;
            if (!error) {
                if (statusText) statusText.textContent = `Supabase Direct (${latency}ms)`;
                if (floatingText) floatingText.textContent = `Direct Supabase Live (${latency}ms) · voixkvyylglpomahowrl`;
                if (statusPill) statusPill.title = `Supabase Cloud Connected (${latency}ms) - Project: voixkvyylglpomahowrl`;
                return { ok: true, latency };
            } else {
                if (statusText) statusText.textContent = `Supabase: ${error.message}`;
                if (floatingText) floatingText.textContent = `Supabase Error: ${error.message}`;
                return { ok: false, error };
            }
        } catch (e) {
            if (statusText) statusText.textContent = 'Supabase Cloud (Offline)';
            return { ok: false, error: e };
        }
    }

    // Sync Leads Dataset from Supabase Cloud Database (leads table)
    async function syncFromSupabase() {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Supabase leads query error:', error);
                showNotificationToast(`Supabase Error: ${error.message}`);
                return;
            }

            if (Array.isArray(data)) {
                const validRows = data.filter(row => row.id !== 'site_config_v1');
                if (validRows.length > 0) {
                    inMemorySamples = validRows.map(row => ({
                        id: String(row.id || ('sample-' + Date.now())),
                        title: row.title || row.lead_title || 'Lead Sample',
                        photo: row.photo || row.image_url || '/assets/b2b_lead_gen_graphic.jpg',
                        location: row.location || 'Global / United States',
                        sheetUrl: row.sheet_url || row.sample_file || row.sheetUrl || '/assets/leads_sample_dataset.csv',
                        fileName: row.file_name || row.fileName || '',
                        type: row.type || 'B2B Lead Generation',
                        quality: row.quality || 'Sample Dataset · Syntax & MX Validated',
                        sampleRows: Array.isArray(row.sample_rows) ? row.sample_rows : []
                    }));
                } else {
                    inMemorySamples = [...DEFAULT_SAMPLES];
                }
                renderSamples();
                console.log('✓ Lead datasets directly loaded from Supabase (Total:', inMemorySamples.length, ')');
            }
        } catch (err) {
            console.error('Supabase leads sync exception:', err);
            showNotificationToast(`Sync Error: ${err.message}`);
        }
    }

    // Push Lead Sample directly to Supabase Cloud Database (leads table)
    async function pushSampleToSupabase(sample, isDelete = false) {
        if (!supabase) {
            showNotificationToast('Database Error: Supabase client not initialized');
            return { success: false, error: 'Supabase client not initialized' };
        }
        try {
            if (isDelete) {
                const { error } = await supabase
                    .from('leads')
                    .delete()
                    .eq('id', sample.id);

                if (error) {
                    console.error('Supabase lead delete error:', error);
                    return { success: false, error: error.message };
                }
                console.log(`✓ Lead sample ${sample.id} deleted directly from Supabase`);
                return { success: true };
            } else {
                const payload = {
                    id: String(sample.id),
                    title: sample.title,
                    location: sample.location || 'Global / United States',
                    photo: sample.photo || '/assets/b2b_lead_gen_graphic.jpg',
                    image_url: sample.photo || '/assets/b2b_lead_gen_graphic.jpg',
                    sheet_url: sample.sheetUrl || '/assets/leads_sample_dataset.csv',
                    file_name: sample.fileName || '',
                    type: sample.type || 'B2B Lead Generation',
                    quality: sample.quality || 'Sample Dataset · Syntax & MX Validated',
                    sample_rows: sample.sampleRows || []
                };

                const { data, error } = await supabase
                    .from('leads')
                    .upsert(payload, { onConflict: 'id' });

                if (error) {
                    console.error('Supabase lead upsert error:', error);
                    return { success: false, error: error.message };
                }
                console.log(`✓ Lead sample ${sample.id} upserted directly into Supabase`);
                return { success: true, data };
            }
        } catch (err) {
            console.error('Supabase lead save exception:', err);
            return { success: false, error: err.message };
        }
    }

    // Direct in-memory lead samples state (pure cloud source of truth)
    function getSamples() {
        if (inMemorySamples && Array.isArray(inMemorySamples) && inMemorySamples.length > 0) {
            return inMemorySamples;
        }
        inMemorySamples = [...DEFAULT_SAMPLES];
        return inMemorySamples;
    }

    function saveSamples(samples) {
        inMemorySamples = samples;
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
        inMemorySiteContent = { ...DEFAULT_SITE_CONTENT };
        return inMemorySiteContent;
    }

    function saveSiteContentLocal(content) {
        inMemorySiteContent = { ...DEFAULT_SITE_CONTENT, ...content };
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

        // Work Projects & Images (CMS Controlled)
        const p1Img = document.getElementById('work-project-1-img');
        if (p1Img && content.workP1Img) p1Img.src = content.workP1Img;
        const p1Title = document.getElementById('work-project-1-title');
        if (p1Title && content.workP1Title) p1Title.textContent = content.workP1Title;
        const p1Summary = document.getElementById('work-project-1-summary');
        if (p1Summary && content.workP1Summary) p1Summary.textContent = content.workP1Summary;

        const p2Img = document.getElementById('work-project-2-img');
        if (p2Img && content.workP2Img) p2Img.src = content.workP2Img;
        const p2Title = document.getElementById('work-project-2-title');
        if (p2Title && content.workP2Title) p2Title.textContent = content.workP2Title;
        const p2Summary = document.getElementById('work-project-2-summary');
        if (p2Summary && content.workP2Summary) p2Summary.textContent = content.workP2Summary;

        const p3Img = document.getElementById('work-project-3-img');
        if (p3Img && content.workP3Img) p3Img.src = content.workP3Img;
        const p3Title = document.getElementById('work-project-3-title');
        if (p3Title && content.workP3Title) p3Title.textContent = content.workP3Title;
        const p3Summary = document.getElementById('work-project-3-summary');
        if (p3Summary && content.workP3Summary) p3Summary.textContent = content.workP3Summary;

        // Render Services in main portfolio if custom
        if (Array.isArray(content.services) && content.services.length > 0) {
            renderServicesBoard(content.services);
        }

        // Technical SEO Sync: Connect meta tags and structured schema to Admin-managed data
        updateDynamicSeoMetadata(content);
    }

    // Technical SEO: Dynamically synchronize document title, meta tags, Open Graph, and JSON-LD schema with Admin-managed CMS data
    function updateDynamicSeoMetadata(content) {
        if (!content || typeof document === 'undefined') return;

        try {
            // 1. Title Tag
            const fullName = content.fullName || 'MD. Ibrahim Shake Shuvo';
            const role1 = content.badgeRole1 || 'B2B Lead Generation';
            const role2 = content.badgeRole2 || 'Web Scraping';
            const pageTitle = `${fullName} | ${role1} & ${role2} Specialist`;
            if (document.title !== pageTitle) {
                document.title = pageTitle;
            }

            // 2. Meta Tags (Description, Open Graph, Twitter)
            const metaDesc = content.heroLead 
                ? `${content.heroLead} High-accuracy prospect lists, business directories, and web data pipelines.` 
                : 'B2B Lead Generation and Web Scraping Specialist. High-accuracy prospect lists, business directories, Google Maps extraction, and automated data pipelines using Python and Playwright.';

            function setMetaTag(attributeName, attributeValue, contentValue) {
                if (!contentValue) return;
                let meta = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
                if (!meta) {
                    meta = document.createElement('meta');
                    meta.setAttribute(attributeName, attributeValue);
                    document.head.appendChild(meta);
                }
                meta.setAttribute('content', contentValue);
            }

            setMetaTag('name', 'description', metaDesc);
            setMetaTag('property', 'og:title', pageTitle);
            setMetaTag('property', 'og:description', metaDesc);
            setMetaTag('name', 'twitter:title', pageTitle);
            setMetaTag('name', 'twitter:description', metaDesc);

            // Canonical Link & Open Graph URL
            const canonicalHref = (window.location && window.location.origin) ? `${window.location.origin}/` : 'https://ibrahimshake.com/';
            let canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink) {
                canonicalLink.setAttribute('href', canonicalHref);
            }
            setMetaTag('property', 'og:url', canonicalHref);

            // Images
            if (content.heroPhoto) {
                const absolutePhoto = content.heroPhoto.startsWith('http') 
                    ? content.heroPhoto 
                    : ((window.location && window.location.origin) ? `${window.location.origin}${content.heroPhoto}` : `https://ibrahimshake.com${content.heroPhoto}`);
                setMetaTag('property', 'og:image', absolutePhoto);
                setMetaTag('name', 'twitter:image', absolutePhoto);
            }

            // 3. Schema.org JSON-LD Structured Data
            const jsonLdScript = document.getElementById('structured-data-jsonld');
            if (jsonLdScript) {
                const schemaText = jsonLdScript.textContent || '{}';
                const schemaData = JSON.parse(schemaText);
                if (schemaData && Array.isArray(schemaData['@graph'])) {
                    schemaData['@graph'].forEach(node => {
                        if (node['@type'] === 'Person') {
                            if (content.fullName) node.name = content.fullName;
                            node.jobTitle = `${role1} & ${role2} Specialist`;
                            if (content.contactEmail) node.email = `mailto:${content.contactEmail}`;
                            if (content.contactWhatsapp) node.telephone = content.contactWhatsapp;
                            if (content.contactLocation && node.address) {
                                node.address.addressLocality = content.contactLocation;
                            }
                            const socials = [content.contactLinkedin, content.contactGithub, content.contactFacebook].filter(Boolean);
                            if (socials.length > 0) node.sameAs = socials;
                            if (content.heroPhoto) {
                                node.image = content.heroPhoto.startsWith('http') 
                                    ? content.heroPhoto 
                                    : ((window.location && window.location.origin) ? `${window.location.origin}${content.heroPhoto}` : `https://ibrahimshake.com${content.heroPhoto}`);
                            }
                        } else if (node['@type'] === 'ProfessionalService') {
                            if (content.fullName) node.name = `${content.fullName} - Lead Generation & Web Scraping Services`;
                            if (content.contactEmail) node.email = content.contactEmail;
                            if (content.contactWhatsapp) node.telephone = content.contactWhatsapp;
                            if (content.contactLocation && node.address) {
                                node.address.addressLocality = content.contactLocation;
                            }
                            if (Array.isArray(content.services) && content.services.length > 0) {
                                node.hasOfferCatalog = {
                                    '@type': 'OfferCatalog',
                                    'name': 'B2B Lead Generation & Web Scraping Services',
                                    'itemListElement': content.services.map(s => ({
                                        '@type': 'Offer',
                                        'itemOffered': {
                                            '@type': 'Service',
                                            'name': s.title,
                                            'description': s.desc
                                        }
                                    }))
                                };
                            }
                        } else if (node['@type'] === 'WebSite') {
                            if (content.fullName) node.name = `${content.fullName} Portfolio`;
                        }
                    });
                    jsonLdScript.textContent = JSON.stringify(schemaData, null, 2);
                }
            }
        } catch (seoErr) {
            console.warn('SEO dynamic metadata synchronization note:', seoErr);
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

        // Tab: Work Projects & Images
        setVal('cms-input-work-p1-img', content.workP1Img || '');
        const prev1 = document.getElementById('cms-preview-work-p1-img');
        if (prev1 && content.workP1Img) prev1.src = content.workP1Img;
        setVal('cms-input-work-p1-title', content.workP1Title || '');
        setVal('cms-input-work-p1-summary', content.workP1Summary || '');

        setVal('cms-input-work-p2-img', content.workP2Img || '');
        const prev2 = document.getElementById('cms-preview-work-p2-img');
        if (prev2 && content.workP2Img) prev2.src = content.workP2Img;
        setVal('cms-input-work-p2-title', content.workP2Title || '');
        setVal('cms-input-work-p2-summary', content.workP2Summary || '');

        setVal('cms-input-work-p3-img', content.workP3Img || '');
        const prev3 = document.getElementById('cms-preview-work-p3-img');
        if (prev3 && content.workP3Img) prev3.src = content.workP3Img;
        setVal('cms-input-work-p3-title', content.workP3Title || '');
        setVal('cms-input-work-p3-summary', content.workP3Summary || '');
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
                    <input type="text" class="form-input cms-srv-tags" value="${escapeHtml(s.tags || '')}" placeholder="Validated Contacts · Targeted Personas · CRM Ready" />
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
            contactLocation: getVal('cms-input-contact-location') || DEFAULT_SITE_CONTENT.contactLocation,

            // Work Projects & Images
            workP1Img: getVal('cms-input-work-p1-img') || DEFAULT_SITE_CONTENT.workP1Img,
            workP1Title: getVal('cms-input-work-p1-title') || DEFAULT_SITE_CONTENT.workP1Title,
            workP1Summary: getVal('cms-input-work-p1-summary') || DEFAULT_SITE_CONTENT.workP1Summary,

            workP2Img: getVal('cms-input-work-p2-img') || DEFAULT_SITE_CONTENT.workP2Img,
            workP2Title: getVal('cms-input-work-p2-title') || DEFAULT_SITE_CONTENT.workP2Title,
            workP2Summary: getVal('cms-input-work-p2-summary') || DEFAULT_SITE_CONTENT.workP2Summary,

            workP3Img: getVal('cms-input-work-p3-img') || DEFAULT_SITE_CONTENT.workP3Img,
            workP3Title: getVal('cms-input-work-p3-title') || DEFAULT_SITE_CONTENT.workP3Title,
            workP3Summary: getVal('cms-input-work-p3-summary') || DEFAULT_SITE_CONTENT.workP3Summary
        };
    }

    // Sync Site Content from Supabase Cloud Database (site_content table)
    async function syncSiteContentFromSupabase() {
        if (!supabase) return;
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*')
                .eq('id', 'site_config_v1')
                .maybeSingle();

            if (error) {
                console.error('Supabase site_content query error:', error);
                showNotificationToast(`Supabase Error: ${error.message}`);
                return;
            }

            if (data) {
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
                    inMemorySiteContent = { ...DEFAULT_SITE_CONTENT, ...remoteConfig };
                    applySiteContentToDOM(inMemorySiteContent);
                    populateCmsForm(inMemorySiteContent);
                    console.log('✓ Site content directly synchronized from Supabase (site_content)');
                }
            }
        } catch (err) {
            console.error('Supabase site_content sync exception:', err);
            showNotificationToast(`Sync Error: ${err.message}`);
        }
    }

    // Push Site Content to Supabase Database (site_content table)
    async function pushSiteContentToSupabase(content) {
        if (!supabase) {
            showNotificationToast('Database Error: Supabase client not initialized');
            return { success: false, error: 'Supabase client not initialized' };
        }
        try {
            const payload = {
                id: 'site_config_v1',
                content: content,
                file_name: JSON.stringify(content),
                updated_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('site_content')
                .upsert(payload, { onConflict: 'id' });

            if (error) {
                console.error('Supabase site_content save error:', error);
                return { success: false, error: error.message };
            }

            inMemorySiteContent = { ...DEFAULT_SITE_CONTENT, ...content };
            console.log('✓ Site content saved directly to Supabase site_content table');
            return { success: true, data };
        } catch (err) {
            console.error('Supabase site_content save exception:', err);
            return { success: false, error: err.message };
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
            if (!isAdminLoggedIn()) {
                // Strict Security: Hide CMS view completely from unauthenticated visitors
                if (adminCmsView) {
                    adminCmsView.style.display = 'none';
                    adminCmsView.setAttribute('aria-hidden', 'true');
                }
                if (portfolioView) portfolioView.style.display = 'block';
                if (leadsSamplesView) {
                    leadsSamplesView.style.display = 'none';
                    leadsSamplesView.setAttribute('aria-hidden', 'true');
                }
                if (navLinkAdmin) navLinkAdmin.classList.remove('active');
                if (footerLinkAdmin) footerLinkAdmin.classList.remove('active');
                if (navLinkSamples) navLinkSamples.classList.remove('active');

                // Prompt user to enter admin password
                openModal('admin-login-modal');
                if (adminPasswordInput) {
                    setTimeout(() => adminPasswordInput.focus(), 80);
                }
                return;
            }

            // Authenticated: reveal Admin CMS View
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
            populateCmsForm(getSiteContent());
            if (typeof renderCmsInbox === 'function') {
                renderCmsInbox(true);
            }
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
            if (targetTab === 'cms-tab-inbox' && typeof renderCmsInbox === 'function') {
                renderCmsInbox(true);
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
        if (!isAdminLoggedIn()) {
            showNotificationToast('🔒 Access denied. Please sign in with admin password.');
            openModal('admin-login-modal');
            return;
        }

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
                <span>Saving to Supabase...</span>
            `;
        });

        // Save locally & update live DOM immediately
        saveSiteContentLocal(updated);
        applySiteContentToDOM(updated);

        // Persist directly to Supabase Cloud Database via server API
        const saveRes = await pushSiteContentToSupabase(updated);

        allSaveBtns.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = saveRes.success ? `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Saved to Supabase ✓</span>
            ` : `
                <span>Save Error ⚠️</span>
            `;
        });

        if (saveRes.success) {
            showNotificationToast('Website changes saved directly to Supabase (site_content) ✓');
        } else {
            showNotificationToast(`Database Error: ${saveRes.error}`);
        }

        setTimeout(() => {
            allSaveBtns.forEach(btn => {
                const orig = btn.getAttribute('data-orig-html');
                if (orig) btn.innerHTML = orig;
            });
        }, 3500);
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
                        <img class="lead-card-img" src="${escapeHtml(sample.photo || '/assets/b2b_lead_gen_graphic.jpg')}" alt="${escapeHtml(sample.title)} - Sample dataset preview" loading="lazy" decoding="async" onerror="this.src='/assets/b2b_lead_gen_graphic.jpg'" />
                        <div class="lead-card-overlay"></div>
                        <div class="lead-card-badges">
                            <span class="lead-type-badge">${escapeHtml(sample.type || 'B2B Leads')}</span>
                            <span class="lead-quality-pill">
                                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Sample Dataset</span>
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

                        <div class="lead-card-footer">
                            <button type="button" class="btn-lead-download" onclick="window.downloadLeadSheet('${escapeHtml(sample.id)}')" title="Download sample spreadsheet for ${escapeHtml(sample.title)}">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                <span>Download Sample (.csv / .xlsx)</span>
                            </button>

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

    // Dismiss Admin Login Modal safely
    function dismissAdminLoginModal() {
        closeModal('admin-login-modal');
        if (adminLoginError) adminLoginError.style.display = 'none';
        if (adminPasswordInput) adminPasswordInput.value = '';

        if (!isAdminLoggedIn()) {
            const hash = window.location.hash || '';
            const isAdminRoute = hash.startsWith('#admin') || hash === '#cms' || hash === '#admin-cms' || hash === '#leads-samples/admin' || hash === '#leads-samples-admin';
            if (isAdminRoute) {
                // Return to home view immediately so admin CMS is never exposed
                window.location.hash = '#hero';
            } else {
                handleRouting();
            }
        }
    }

    if (btnOpenAdminLogin) {
        btnOpenAdminLogin.addEventListener('click', () => {
            if (adminLoginError) adminLoginError.style.display = 'none';
            openModal('admin-login-modal');
            if (adminPasswordInput) {
                setTimeout(() => adminPasswordInput.focus(), 80);
            }
        });
    }

    if (btnCloseAdminLogin) btnCloseAdminLogin.addEventListener('click', dismissAdminLoginModal);
    if (btnCancelAdminLogin) btnCancelAdminLogin.addEventListener('click', dismissAdminLoginModal);

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

            if (password === 'ibrahim@07') {
                setAdminAuth(true);
                closeModal('admin-login-modal');
                if (adminLoginError) adminLoginError.style.display = 'none';
                if (adminPasswordInput) adminPasswordInput.value = '';
                showNotificationToast('Signed in successfully as Admin ✓');
                handleRouting();
            } else {
                if (adminLoginError) {
                    adminLoginError.textContent = 'Incorrect password. Please enter the correct admin password.';
                    adminLoginError.style.display = 'block';
                }
                if (adminPasswordInput) {
                    adminPasswordInput.focus();
                }
            }
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', () => {
            setAdminAuth(false);
            window.location.hash = '#hero';
            showNotificationToast('Signed out of Admin Mode.');
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
            if (!isAdminLoggedIn()) {
                showNotificationToast('🔒 Please sign in with admin password to add samples.');
                openModal('admin-login-modal');
                return;
            }

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

            if (!isAdminLoggedIn()) {
                showNotificationToast('🔒 Unauthorized: Admin password required.');
                closeModal('sample-editor-modal');
                openModal('admin-login-modal');
                return;
            }

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
                    quality: 'Sample Dataset · Syntax & MX Validated',
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

            // Push directly to Supabase Cloud Database (leads table)
            if (targetSample) {
                const pushRes = await pushSampleToSupabase(targetSample, false);
                if (pushRes && pushRes.success) {
                    showNotificationToast(id ? 'Lead sample updated in Supabase ✓' : '✓ Lead sample saved to Supabase (leads)!');
                } else {
                    showNotificationToast(`Supabase Error: ${pushRes?.error || 'Save failed'}`);
                }
            }
        });
    }

    // Global Action: Edit Lead Sample
    window.editLeadSample = function(id) {
        if (!isAdminLoggedIn()) {
            showNotificationToast('🔒 Please sign in with admin password to edit samples.');
            openModal('admin-login-modal');
            return;
        }

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
    window.deleteLeadSample = async function(id, buttonEl) {
        if (!isAdminLoggedIn()) {
            showNotificationToast('🔒 Please sign in with admin password to delete samples.');
            openModal('admin-login-modal');
            return;
        }

        const samples = getSamples();
        const sample = samples.find(s => s.id === id);
        if (!sample) return;

        if (buttonEl) {
            if (buttonEl.classList.contains('confirm-delete-active')) {
                // Second click! Execute deletion
                const delRes = await pushSampleToSupabase(sample, true);
                if (delRes && delRes.success) {
                    const updated = samples.filter(s => s.id !== id);
                    saveSamples(updated);
                    renderSamples();
                    showNotificationToast('Lead sample deleted from Supabase ✓');
                } else {
                    showNotificationToast(`Supabase Delete Error: ${delRes?.error || 'Failed to delete'}`);
                }
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
            const delRes = await pushSampleToSupabase(sample, true);
            if (delRes && delRes.success) {
                const updated = samples.filter(s => s.id !== id);
                saveSamples(updated);
                renderSamples();
                showNotificationToast('Lead sample deleted from Supabase ✓');
            } else {
                showNotificationToast(`Supabase Delete Error: ${delRes?.error || 'Failed to delete'}`);
            }
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
        if (qualEl) qualEl.textContent = `✓ ${sample.quality || 'Sample Quality'}`;
        if (countEl) countEl.textContent = `📊 ${sample.records || 'Sample Records'}`;
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

    // Backdrop click listeners: clicking outside any modal dialog closes it safely
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                if (backdrop.id === 'admin-login-modal') {
                    dismissAdminLoginModal();
                } else {
                    closeModal(backdrop.id);
                }
            }
        });
    });

    // Escape key listener to close modals
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModalEl = document.querySelector('.modal-backdrop.is-open');
            if (openModalEl) {
                if (openModalEl.id === 'admin-login-modal') {
                    dismissAdminLoginModal();
                } else {
                    closeModal(openModalEl.id);
                }
            }
        }
    });

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

    /* ─────────────────────────────────────
       9. WORK PROJECTS & IMAGES CMS HANDLERS
    ───────────────────────────────────── */
    function setupWorkProjectImageHandlers(num) {
        const inputEl = document.getElementById(`cms-input-work-p${num}-img`);
        const previewEl = document.getElementById(`cms-preview-work-p${num}-img`);
        const fileEl = document.getElementById(`cms-file-work-p${num}-img`);

        // Preset buttons
        document.querySelectorAll(`[data-cms-work-img${num}]`).forEach(btn => {
            btn.addEventListener('click', () => {
                const path = btn.getAttribute(`data-cms-work-img${num}`);
                if (inputEl && path) {
                    inputEl.value = path;
                    if (previewEl) previewEl.src = path;
                    showNotificationToast(`Project ${num} image preset selected.`);
                }
            });
        });

        // Manual text input typing
        if (inputEl) {
            inputEl.addEventListener('input', () => {
                const val = inputEl.value.trim();
                if (previewEl && val) {
                    previewEl.src = val;
                }
            });
        }

        // File upload with auto-compression
        if (fileEl) {
            fileEl.addEventListener('change', async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                showNotificationToast('Compressing and optimizing project photo...');
                try {
                    const compressedBase64 = await compressImageFile(file, 900, 0.85);
                    if (compressedBase64) {
                        if (inputEl) inputEl.value = compressedBase64;
                        if (previewEl) previewEl.src = compressedBase64;
                        showNotificationToast(`Project ${num} image uploaded & ready to save ✓`);
                    }
                } catch (err) {
                    console.error('Image compression error:', err);
                    showNotificationToast('Image processing error.');
                }
            });
        }
    }

    setupWorkProjectImageHandlers(1);
    setupWorkProjectImageHandlers(2);
    setupWorkProjectImageHandlers(3);

    /* ─────────────────────────────────────
       10. CLIENT INQUIRIES DATABASE INBOX
    ───────────────────────────────────── */
    let cachedInquiries = [];
    let isFetchingInquiries = false;

    function getSupabaseInboxClient() {
        if (supabase) return supabase;
        if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
            try {
                supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                return supabase;
            } catch (e) {
                console.error('Supabase inbox client initialization error:', e);
            }
        }
        return null;
    }

    async function loadInquiriesFromStorageAndDb(forceRefresh = false) {
        let combined = [];

        // 1. Read local storage cache first for instant UI response
        try {
            const rawStored = localStorage.getItem('ibrahim_inbox_messages');
            if (rawStored) {
                const parsed = JSON.parse(rawStored);
                if (Array.isArray(parsed)) combined = parsed;
            }
        } catch (e) {
            console.warn('Inquiries local load error:', e);
        }

        // 2. Fetch directly from Supabase Cloud 'messages' table
        const client = getSupabaseInboxClient();
        if (client) {
            try {
                const { data, error } = await client.from('messages').select('*');

                if (error) {
                    console.warn('Supabase messages query notice:', error.message || error);
                }

                if (!error && Array.isArray(data)) {
                    console.log(`✓ Fetched ${data.length} inquiries directly from Supabase messages table`);
                    data.forEach(remoteRow => {
                        const id = remoteRow.id ? String(remoteRow.id) : ('MSG-' + Math.floor(100000 + Math.random() * 900000));
                        const name = remoteRow.name || remoteRow.full_name || remoteRow.client_name || remoteRow.author || remoteRow.user_name || 'Client';
                        const email = remoteRow.email || remoteRow.client_email || remoteRow.mail || remoteRow.contact_email || '';
                        const projectType = remoteRow.project_type || remoteRow.projectType || remoteRow.type || remoteRow.subject || remoteRow.category || remoteRow.service || 'B2B Lead Generation';
                        const message = remoteRow.message || remoteRow.msg || remoteRow.content || remoteRow.body || remoteRow.description || remoteRow.text || '';
                        const createdAt = remoteRow.created_at || remoteRow.createdAt || remoteRow.timestamp || remoteRow.date || remoteRow.inserted_at || new Date().toISOString();

                        // Match existing records by ID or exact email + message
                        const existingIdx = combined.findIndex(localRow => 
                            (localRow.id && String(localRow.id) === String(id)) ||
                            (localRow.email === email && localRow.message === message)
                        );

                        if (existingIdx >= 0) {
                            // Upgrade with remote row ID & timestamp
                            combined[existingIdx] = {
                                id,
                                name,
                                email,
                                project_type: projectType,
                                message,
                                created_at: createdAt
                            };
                        } else {
                            combined.push({
                                id,
                                name,
                                email,
                                project_type: projectType,
                                message,
                                created_at: createdAt
                            });
                        }
                    });

                    // Save synchronized list back to local storage
                    try {
                        localStorage.setItem('ibrahim_inbox_messages', JSON.stringify(combined));
                    } catch (storeErr) {
                        console.warn('Storage sync error:', storeErr);
                    }
                }
            } catch (err) {
                console.warn('Supabase inquiries load notice:', err);
            }
        }

        // Sort latest first by date or numerical ID
        combined.sort((a, b) => {
            const timeA = new Date(a.created_at || 0).getTime();
            const timeB = new Date(b.created_at || 0).getTime();
            return timeB - timeA;
        });

        cachedInquiries = combined;
        return combined;
    }

    async function renderCmsInbox(forceRefresh = false) {
        const container = document.getElementById('cms-inbox-list-container');
        const countBadge = document.getElementById('cms-inbox-counter-badge');
        const totalCountEl = document.getElementById('cms-inbox-total-count');

        if (isFetchingInquiries) return;
        isFetchingInquiries = true;

        if (container && cachedInquiries.length === 0) {
            container.innerHTML = `
                <div style="padding:32px 16px; text-align:center; color:var(--ink-3);">
                    <svg class="spin-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;">
                        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="12"></circle>
                    </svg>
                    <p style="font-size:13px; font-weight:500;">Loading database inquiries from Supabase...</p>
                </div>
            `;
        }

        const inquiries = await loadInquiriesFromStorageAndDb(forceRefresh);
        isFetchingInquiries = false;

        const count = inquiries.length;
        if (totalCountEl) totalCountEl.textContent = String(count);
        if (countBadge) {
            countBadge.textContent = String(count);
            countBadge.style.display = count > 0 ? 'inline-flex' : 'none';
        }

        if (!container) return;

        if (count === 0) {
            container.innerHTML = `
                <div class="cms-inbox-empty">
                    <div class="cms-inbox-empty-icon">📬</div>
                    <p style="font-size:14px; font-weight:600; color:var(--ink); margin-bottom:4px;">No inquiries recorded yet</p>
                    <p style="font-size:12.5px; color:var(--ink-3);">When visitors submit project queries on the Contact Form, they will be logged into the database and shown here.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = inquiries.map((item, idx) => {
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent';
            const cleanEmail = escapeHtml(item.email || '');
            const cleanName = escapeHtml(item.name || 'Client');
            const cleanType = escapeHtml(item.project_type || 'General Lead Inquiry');
            const cleanMsg = escapeHtml(item.message || '');
            const refId = escapeHtml(String(item.id || ('MSG-' + idx)));

            return `
                <div class="cms-inbox-item" id="inbox-item-${refId}">
                    <div class="cms-inbox-item-header">
                        <div>
                            <span class="cms-inbox-item-sender">${cleanName}</span>
                            <span class="cms-inbox-item-email">&lt;${cleanEmail}&gt;</span>
                        </div>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="cms-inbox-tag">${cleanType}</span>
                            <span class="cms-inbox-time">${dateStr}</span>
                        </div>
                    </div>
                    <div class="cms-inbox-item-body">
                        ${cleanMsg}
                    </div>
                    <div class="cms-inbox-item-actions">
                        <span style="font-family:var(--font-mono); font-size:11px; color:var(--ink-3);">Ref: #${refId}</span>
                        <div style="display:flex; gap:8px;">
                            <a href="mailto:${cleanEmail}?subject=Re: ${encodeURIComponent(cleanType)} Inquiry&body=Hi ${encodeURIComponent(cleanName)},\n\nThank you for reaching out regarding your ${encodeURIComponent(cleanType)} data requirements.\n\n" class="btn-cms-secondary" style="padding:4px 10px; font-size:11.5px; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                                ✉ Reply via Email
                            </a>
                            <button type="button" class="btn-cms-secondary btn-delete-inbox-item" data-inbox-id="${refId}" style="padding:4px 8px; font-size:11.5px; color:#ef4444; border-color:rgba(239,68,68,0.25);">
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Wire delete buttons
        container.querySelectorAll('.btn-delete-inbox-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const idToDelete = btn.getAttribute('data-inbox-id');
                if (!idToDelete) return;

                if (confirm('Delete this inquiry from database records?')) {
                    const filtered = cachedInquiries.filter(i => String(i.id) !== String(idToDelete));
                    cachedInquiries = filtered;
                    localStorage.setItem('ibrahim_inbox_messages', JSON.stringify(filtered));

                    const client = getSupabaseInboxClient();
                    if (client) {
                        try {
                            await client.from('messages').delete().eq('id', idToDelete);
                        } catch (err) {
                            console.warn('Supabase message delete notice:', err);
                        }
                    }

                    showNotificationToast('Inquiry deleted from database.');
                    renderCmsInbox(true);
                }
            });
        });
    }

    // Refresh button in Inbox
    const btnRefreshInbox = document.getElementById('btn-refresh-inbox');
    if (btnRefreshInbox) {
        btnRefreshInbox.addEventListener('click', async () => {
            showNotificationToast('Fetching inquiries from Supabase database...');
            await renderCmsInbox(true);
            showNotificationToast(`Database synchronized: ${cachedInquiries.length} inquiries ✓`);
        });
    }

    // Export Excel (.xlsx) file handler
    async function exportInquiriesToXLSX() {
        const inquiries = cachedInquiries && cachedInquiries.length > 0
            ? cachedInquiries
            : await loadInquiriesFromStorageAndDb(true);

        if (!inquiries || inquiries.length === 0) {
            showNotificationToast('No inquiries in database to export.');
            return;
        }

        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `Client_Inquiries_Database_${dateStr}.xlsx`;

        // Format rows for Excel
        const header = ['Ref ID', 'Date & Time', 'Client Name', 'Client Email', 'Project / Service Type', 'Project Description / Requirements'];
        const dataRows = inquiries.map(item => [
            String(item.id || ''),
            item.created_at ? new Date(item.created_at).toLocaleString() : 'Recent',
            String(item.name || 'Client'),
            String(item.email || ''),
            String(item.project_type || 'General Lead Inquiry'),
            String(item.message || '')
        ]);

        const fullTable = [header, ...dataRows];

        // 1. Try SheetJS (xlsx.full.min.js) for true native binary .xlsx format
        if (typeof window !== 'undefined' && window.XLSX && typeof window.XLSX.utils !== 'undefined') {
            try {
                const wb = window.XLSX.utils.book_new();
                const ws = window.XLSX.utils.aoa_to_sheet(fullTable);

                // Auto-size column widths for Excel
                ws['!cols'] = [
                    { wch: 16 }, // Ref ID
                    { wch: 22 }, // Date & Time
                    { wch: 24 }, // Client Name
                    { wch: 30 }, // Client Email
                    { wch: 26 }, // Project / Service Type
                    { wch: 60 }  // Message Description
                ];

                window.XLSX.utils.book_append_sheet(wb, ws, 'Client Inquiries');
                window.XLSX.writeFile(wb, filename);
                showNotificationToast(`Exported ${inquiries.length} inquiries to Excel (.xlsx) ✓`);
                return;
            } catch (xlsxErr) {
                console.warn('SheetJS export notice, using XML Spreadsheet fallback:', xlsxErr);
            }
        }

        // 2. High-fidelity XML Spreadsheet fallback (native Microsoft Excel .xlsx compatible)
        try {
            let xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
                '<?mso-application progid="Excel.Sheet"?>\n' +
                '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n' +
                ' xmlns:o="urn:schemas-microsoft-com:office:office"\n' +
                ' xmlns:x="urn:schemas-microsoft-com:office:excel"\n' +
                ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"\n' +
                ' xmlns:html="http://www.w3.org/TR/REC-html40">\n' +
                ' <Styles>\n' +
                '  <Style ss:ID="HeaderStyle">\n' +
                '   <Font ss:Bold="1" ss:Color="#FFFFFF"/>\n' +
                '   <Interior ss:Color="#0f766e" ss:Pattern="Solid"/>\n' +
                '   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>\n' +
                '  </Style>\n' +
                '  <Style ss:ID="RowStyle">\n' +
                '   <Alignment ss:Vertical="Top" ss:WrapText="1"/>\n' +
                '  </Style>\n' +
                ' </Styles>\n' +
                ' <Worksheet ss:Name="Client Inquiries">\n' +
                '  <Table>\n' +
                '   <Column ss:Width="100"/>\n' +
                '   <Column ss:Width="140"/>\n' +
                '   <Column ss:Width="150"/>\n' +
                '   <Column ss:Width="200"/>\n' +
                '   <Column ss:Width="160"/>\n' +
                '   <Column ss:Width="350"/>\n';

            // Header row
            xml += '   <Row ss:Height="24">\n';
            header.forEach(h => {
                const safeH = String(h).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                xml += `    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">${safeH}</Data></Cell>\n`;
            });
            xml += '   </Row>\n';

            // Data rows
            dataRows.forEach(row => {
                xml += '   <Row ss:StyleID="RowStyle">\n';
                row.forEach(cell => {
                    const safeCell = String(cell || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    xml += `    <Cell><Data ss:Type="String">${safeCell}</Data></Cell>\n`;
                });
                xml += '   </Row>\n';
            });

            xml += '  </Table>\n </Worksheet>\n</Workbook>';

            const blob = new Blob([xml], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 250);
            showNotificationToast(`Exported ${inquiries.length} inquiries to Excel (.xlsx) ✓`);
        } catch (fallbackErr) {
            console.error('Export XLSX error:', fallbackErr);
            showNotificationToast('Export failed. Please try again.');
        }
    }

    // Export XLSX button click listener
    const btnExportInboxXlsx = document.getElementById('btn-export-inbox-csv');
    if (btnExportInboxXlsx) {
        btnExportInboxXlsx.addEventListener('click', (e) => {
            e.preventDefault();
            exportInquiriesToXLSX();
        });
    }

    // Setup Supabase Realtime subscription for instant inbox updates
    const rtClient = getSupabaseInboxClient();
    if (rtClient && typeof rtClient.channel === 'function') {
        try {
            rtClient.channel('realtime:messages')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
                    console.log('⚡ Supabase Realtime update for messages:', payload);
                    renderCmsInbox(true);
                    if (payload.eventType === 'INSERT') {
                        showNotificationToast('🔔 New client inquiry received in database!');
                    }
                })
                .subscribe();
        } catch (rtErr) {
            console.warn('Realtime subscription notice:', rtErr);
        }
    }

    // Expose for contact form
    window.refreshAdminInbox = () => renderCmsInbox(true);

    // Initialize UI, Database Sync, and Router
    updateAdminBarUI();
    applySiteContentToDOM();
    populateCmsForm();
    renderSamples();
    renderCmsInbox();
    pingSupabaseDatabase();
    syncFromSupabase();
    syncSiteContentFromSupabase();
    window.addEventListener('hashchange', handleRouting);
    handleRouting();
})();

/* ─────────────────────────────────────────────────────────────
   9. Gemini AI Assistant Chatbot Widget (Floating Right-Side Trigger)
   ───────────────────────────────────────────────────────────── */
(function initAiChatWidget() {
    const launcherBtn = document.getElementById('ai-chat-toggle-btn');
    const chatWindow = document.getElementById('ai-chat-window');
    const messagesContainer = document.getElementById('ai-chat-messages');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('ai-chat-send-btn');
    const closeBtn = document.getElementById('ai-chat-close-btn');
    const resetBtn = document.getElementById('ai-chat-reset-btn');
    const iconOpen = document.getElementById('ai-chat-icon-open');
    const iconClose = document.getElementById('ai-chat-icon-close');
    const suggestionsContainer = document.getElementById('ai-chat-suggestions');

    if (!launcherBtn || !chatWindow || !messagesContainer || !chatForm || !chatInput) {
        return;
    }

    let conversationHistory = [];
    let isChatOpen = false;
    let isWaitingForResponse = false;

    // Format Markdown / line breaks / phone links into clean HTML
    function formatMessageContent(rawText) {
        if (!rawText) return '';
        
        let text = rawText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Bold formatting
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Links [Label](URL)
        text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|tel:[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Split paragraphs or bullet points
        const lines = text.split('\n');
        let html = '';
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                continue;
            }

            if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${line.substring(2)}</li>`;
            } else {
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                html += `<p>${line}</p>`;
            }
        }
        if (inList) {
            html += '</ul>';
        }

        return html;
    }

    // Check if phone or contact handoff is present to render action buttons
    function createContactActionButtons(phone, email) {
        const cleanPhone = (phone || '+880 1744-868938').trim();
        const telDigits = cleanPhone.replace(/[^0-9+]/g, '');
        const waDigits = cleanPhone.replace(/[^0-9]/g, '');
        const cleanEmail = (email || 'ibrahimshakeshuvo100@gmail.com').trim();

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'ai-contact-actions';
        actionsDiv.innerHTML = `
            <a href="tel:${telDigits}" class="ai-contact-btn call-btn" title="Call directly">
                📞 Call Ibrahim (${cleanPhone})
            </a>
            <a href="https://wa.me/${waDigits}" target="_blank" rel="noopener noreferrer" class="ai-contact-btn whatsapp-btn" title="Chat on WhatsApp">
                💬 WhatsApp Message
            </a>
            <a href="mailto:${cleanEmail}?subject=B2B%20Lead%20Generation%20Inquiry" class="ai-contact-btn email-btn" title="Send Email">
                ✉️ Email Inquiry
            </a>
        `;
        return actionsDiv;
    }

    // Render Initial Welcome Message
    function renderWelcomeMessage() {
        messagesContainer.innerHTML = '';
        const welcomeRow = document.createElement('div');
        welcomeRow.className = 'ai-msg-row assistant';
        
        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        bubble.innerHTML = `
            <p>👋 Hello! I am <strong>MD. Ibrahim's official AI assistant</strong>.</p>
            <p>I can help answer your questions about Ibrahim's <strong>B2B Lead Generation</strong>, <strong>Python Web Scraping</strong>, <strong>Google Maps Extraction</strong>, and custom prospect list building.</p>
            <p style="font-size:12px; color:#94a3b8; margin-top:6px;">Whenever you're satisfied or ready to discuss your project, I can provide his direct phone number to call or message immediately.</p>
        `;
        welcomeRow.appendChild(bubble);
        messagesContainer.appendChild(welcomeRow);

        if (suggestionsContainer) {
            suggestionsContainer.style.display = 'flex';
        }
        conversationHistory = [];
    }

    // Toggle Chat Window
    function toggleChat(forceOpen) {
        isChatOpen = typeof forceOpen === 'boolean' ? forceOpen : !isChatOpen;

        if (isChatOpen) {
            chatWindow.style.display = 'flex';
            // Force reflow for animation
            chatWindow.offsetHeight;
            chatWindow.classList.add('ai-chat-open');
            chatWindow.setAttribute('aria-hidden', 'false');
            if (iconOpen) iconOpen.style.display = 'none';
            if (iconClose) iconClose.style.display = 'flex';
            setTimeout(() => chatInput.focus(), 150);

            // If empty, render welcome message
            if (messagesContainer.children.length === 0) {
                renderWelcomeMessage();
            }
        } else {
            chatWindow.classList.remove('ai-chat-open');
            chatWindow.setAttribute('aria-hidden', 'true');
            if (iconOpen) iconOpen.style.display = 'flex';
            if (iconClose) iconClose.style.display = 'none';
            setTimeout(() => {
                if (!isChatOpen) chatWindow.style.display = 'none';
            }, 250);
        }
    }

    // Append Message to UI
    function appendMessage(role, text, contactData) {
        const row = document.createElement('div');
        row.className = `ai-msg-row ${role === 'user' ? 'user' : 'assistant'}`;

        const bubble = document.createElement('div');
        bubble.className = 'ai-msg-bubble';
        bubble.innerHTML = formatMessageContent(text);

        // If assistant message includes phone or contact invitation, attach interactive call/WhatsApp buttons
        if (role === 'assistant') {
            const hasPhone = text.includes('+880') || text.toLowerCase().includes('phone') || text.toLowerCase().includes('whatsapp') || text.toLowerCase().includes('call directly');
            if (hasPhone || contactData?.phone) {
                const phoneVal = contactData?.phone || '+880 1744-868938';
                const emailVal = contactData?.email || 'ibrahimshakeshuvo100@gmail.com';
                bubble.appendChild(createContactActionButtons(phoneVal, emailVal));
            }
        }

        row.appendChild(bubble);
        messagesContainer.appendChild(row);
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }

    // Show / Hide Typing Indicator
    let typingIndicatorEl = null;
    function showTypingIndicator() {
        if (typingIndicatorEl) return;
        typingIndicatorEl = document.createElement('div');
        typingIndicatorEl.className = 'ai-msg-row assistant';
        typingIndicatorEl.innerHTML = `
            <div class="ai-typing-indicator">
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
                <span class="ai-typing-dot"></span>
            </div>
        `;
        messagesContainer.appendChild(typingIndicatorEl);
        messagesContainer.scrollTo({ top: messagesContainer.scrollHeight, behavior: 'smooth' });
    }

    function removeTypingIndicator() {
        if (typingIndicatorEl && typingIndicatorEl.parentNode) {
            typingIndicatorEl.parentNode.removeChild(typingIndicatorEl);
        }
        typingIndicatorEl = null;
    }

    // Send Message Handler
    async function handleSendMessage(promptText) {
        const message = (promptText || chatInput.value || '').trim();
        if (!message || isWaitingForResponse) return;

        chatInput.value = '';
        appendMessage('user', message);
        conversationHistory.push({ role: 'user', text: message });

        isWaitingForResponse = true;
        sendBtn.disabled = true;
        chatInput.disabled = true;
        showTypingIndicator();

        // Get latest contact info from DOM or default
        const phoneElem = document.getElementById('site-contact-whatsapp-val');
        const emailElem = document.getElementById('site-contact-email-val');
        const locElem = document.getElementById('site-badge-loc');

        const contactInfo = {
            phone: phoneElem?.textContent?.trim() || '+880 1744-868938',
            email: emailElem?.textContent?.trim() || 'ibrahimshakeshuvo100@gmail.com',
            location: locElem?.textContent?.trim() || 'Dhaka, Bangladesh',
        };

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message,
                    history: conversationHistory,
                    contactInfo,
                }),
            });

            const data = await res.json();
            removeTypingIndicator();

            if (data && data.success && data.reply) {
                appendMessage('assistant', data.reply, { phone: data.phone, email: data.email });
                conversationHistory.push({ role: 'model', text: data.reply });
            } else {
                appendMessage('assistant', `You can reach MD. Ibrahim directly to discuss your project requirements:\n\n📞 **Phone / WhatsApp**: **${contactInfo.phone}** (Call or WhatsApp message)\n✉️ **Email**: **${contactInfo.email}**`, contactInfo);
            }
        } catch (err) {
            console.error('Chat request error:', err);
            removeTypingIndicator();
            appendMessage('assistant', `You can reach MD. Ibrahim directly:\n\n📞 **Phone / WhatsApp**: **${contactInfo.phone}** (Call or WhatsApp message)\n✉️ **Email**: **${contactInfo.email}**`, contactInfo);
        } finally {
            isWaitingForResponse = false;
            sendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // Event Listeners
    launcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat();
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleChat(false);
    });

    resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renderWelcomeMessage();
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSendMessage();
    });

    // Suggestion chips click handler
    if (suggestionsContainer) {
        suggestionsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.ai-chat-chip');
            if (!chip) return;
            const prompt = chip.getAttribute('data-prompt');
            if (prompt) {
                handleSendMessage(prompt);
            }
        });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isChatOpen) {
            toggleChat(false);
        }
    });

    // Close when clicking outside if clicked elsewhere
    document.addEventListener('click', (e) => {
        if (isChatOpen && !chatWindow.contains(e.target) && !launcherBtn.contains(e.target)) {
            toggleChat(false);
        }
    });

    // Pre-render welcome message
    renderWelcomeMessage();
})();
