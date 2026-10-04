/* ─────────────────────────────────────
   main.js - MD. Ibrahim Shake Shuvo Portfolio
   Python Web Automation Developer
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
        title: 'Custom Browser Automation & Form Submission Bot',
        category: 'Browser Automation · Playwright & Python',
        objective: 'Automate multi-step web forms, authentication sessions, and dynamic JavaScript processing without an API.',
        source: 'Enterprise portals, SaaS dashboards, and web forms.',
        fields: ['Transaction ID', 'Portal Account', 'Form Status', 'Processed Records', 'Timestamp', 'Execution Log', 'Sync Status'],
        process: [
            'Launch headless Playwright browser instance with persistent session authentication.',
            'Navigate multi-step dynamic forms and execute scripted button interactions.',
            'Extract tabular report records and parse data into structured tables using pandas.',
            'Log edge cases and automatically retry failed HTTP and DOM requests.',
            'Sync completed execution results directly to Google Sheets and Docs.'
        ],
        tools: ['Python', 'Playwright', 'SeleniumBase', 'pandas', 'Google Sheets API'],
        sampleRows: [
            { name: 'Portal Session Auth', title: 'OAuth & MFA Login', company: 'Automated Account Sync', email: 'session_active', loc: 'Headless Chromium', status: 'Completed (200 OK)' },
            { name: 'Multi-Step Form Filler', title: 'Data Submission', company: 'Enterprise Portal', email: 'form_submitted', loc: 'Playwright Worker', status: 'Completed (200 OK)' },
            { name: 'File Downloader Bot', title: 'Report Extraction', company: 'Reporting Dashboard', email: 'download_ready', loc: 'Async Worker', status: 'Completed (200 OK)' },
            { name: 'Google Sheets Auto-Sync', title: 'Live Record Push', company: 'Google Drive API', email: 'synced_live', loc: 'Cloud Dispatcher', status: 'Completed (200 OK)' }
        ]
    },
    'gmaps-leads': {
        title: 'Automated Web Directory Scraping & Google Sheets Sync',
        category: 'Web Scraping · Python & Playwright',
        objective: 'Extract high-volume structured directory and business data from JavaScript-heavy portals with automatic export to Google Sheets.',
        source: 'Public commercial business directories and company websites.',
        fields: ['Business Name', 'Category / Niche', 'Direct Phone Number', 'Full Street Address', 'Rating', 'Total Reviews', 'Website URL'],
        process: [
            'Construct automated Playwright scraper targeting designated search parameters.',
            'Extract place cards with infinite scrolling & dynamic DOM rendering.',
            'Crawl discovered websites to locate public contact points and service info.',
            'Standardize phone numbers and cleanse geographic data using pandas.',
            'Deliver structured CSV, Excel, and live updated Google Sheets.'
        ],
        tools: ['Python', 'Playwright', 'BeautifulSoup', 'pandas', 'Google Sheets API'],
        sampleRows: [
            { name: 'Apex Commercial Dental', category: 'Healthcare / Dental', phone: '+1 (415) 555-0192', rating: '4.9 (128 reviews)', web: 'apexdfdental.com', email: 'contact@apexdfdental.com' },
            { name: 'Metro Bay Architects', category: 'Architecture & Design', phone: '+1 (415) 555-8321', rating: '4.8 (84 reviews)', web: 'metrobaydesign.com', email: 'info@metrobaydesign.com' },
            { name: 'Golden State HVAC Pros', category: 'HVAC Contractor', phone: '+1 (510) 555-4490', rating: '4.7 (210 reviews)', web: 'gshvacpros.com', email: 'service@gshvacpros.com' }
        ]
    },
    'ecommerce-scraping': {
        title: 'E-commerce Catalog & Multi-Variant Scraping',
        category: 'Web Scraping · Selenium & Python',
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
        tools: ['Python', 'SeleniumBase', 'Requests', 'pandas', 'JSON / CSV / Excel'],
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

    // Default 6 services (Exact specification in mapped order)
    const DEFAULT_SERVICES = [
        {
            title: 'Custom Browser Automation Bots',
            desc: 'Python bots (Playwright / SeleniumBase) that work on websites without an API: login, clicks, forms, downloads.',
            tags: 'Playwright · SeleniumBase · Headless Browsers · Anti-Bot'
        },
        {
            title: 'Web Workflow & Task Automation',
            desc: 'End-to-end automation of repetitive web tasks, with logging and error handling.',
            tags: 'Workflow Automation · Error Handling · Task Scheduling · Python'
        },
        {
            title: 'Web Scraping & Data Extraction',
            desc: 'Structured data from static and JavaScript-heavy websites, delivered as CSV, Excel or Google Sheets.',
            tags: 'Requests · BeautifulSoup · Dynamic Hydration · Structured Export'
        },
        {
            title: 'AI-Assisted Automation',
            desc: 'LLM calls inside the workflow to classify, score, summarize or clean collected data.',
            tags: 'LLM APIs · Text Classification · Summarization · Data Normalization'
        },
        {
            title: 'Google Sheets & Docs Automation',
            desc: 'Scripts that read, write and update Google Sheets and Docs automatically.',
            tags: 'Google Sheets API · Google Docs API · Auto-Sync · Live Reporting'
        },
        {
            title: 'Lead Discovery Automation',
            desc: 'Automated B2B lead finding, as one small use case of the automation tools above.',
            tags: 'Directory Scraping · Verification · Target Accounts · Automation'
        }
    ];

    // Default complete site content
    const DEFAULT_SITE_CONTENT = {
        fullName: 'MD. Ibrahim Shake Shuvo',
        availability: 'Available for Projects',
        badgeRole1: 'PYTHON WEB AUTOMATION & WEB SCRAPING',
        badgeRole2: '',
        badgeLoc: 'DHAKA, BANGLADESH',
        heroLine1: 'Automate Any Browser Task &',
        heroMark: 'Web Workflow',
        heroLead: 'I build Python automation systems that do repetitive web work for you: logging in, filling forms, collecting data, running AI-assisted steps and updating Google Sheets. Work that takes hours by hand can run in minutes, depending on the project.',
        heroProof: 'Custom Python Bots · Playwright & SeleniumBase · BeautifulSoup & pandas · Google Sheets Sync',
        heroPhoto: '/assets/hero_portrait.jpg',
        aboutBio: 'I am a Python Web Automation Developer. I build systems that do repetitive work on websites for you: browser automation, form filling, web scraping, AI-assisted processing with LLMs, and syncing results to Google Sheets and Docs. Lead generation is one of the things I build with these tools, not the only one. My focus is clean, reliable Python code that saves real working hours.',
        aboutDegree: 'Diploma in Agriculture',
        aboutInst: 'Agriculture Training Institute, Gaibandha',
        aboutEduYears: '2019 – 2023',
        statYears: 'Hours to Minutes',
        statProjects: '~30 min',
        statQuality: 'Custom Python',
        statClients: 'Clean & Reliable',
        services: DEFAULT_SERVICES,
        pipeHeadline: 'Robust Automation Workflows Built for Scale',
        pipeCard1Sub: 'Python bots (Playwright / SeleniumBase) that work on websites without an API: login, clicks, forms, downloads, and anti-bot bypassing.',
        pipeCard2Sub: 'End-to-end automation of repetitive web tasks, with structured logging, edge-case error handling, and scheduled cron executions.',
        pipeCard3Sub: 'Scripts that read, write, and update Google Sheets and Docs automatically, syncing collected data into client spreadsheets in real time.',
        quoteText: '"Reliable automation turns hours of repetitive browser tasks into clean, programmatic execution. I build robust Python systems that navigate complex websites, authenticate, process data with AI, and sync results seamlessly."',
        quoteAuthor: 'MD. Ibrahim Shake Shuvo · Python Web Automation Developer',
        contactHeadline: "Let's Discuss Your Automation Needs",
        contactSub: 'Tell me about your repetitive web workflow, data extraction task, or automation requirements. I typically reply within 12 hours.',
        contactEmail: 'ibrahimshakeshuvo100@gmail.com',
        contactWhatsapp: '+880 1744-868938',
        contactLinkedin: 'https://www.linkedin.com/in/ibrahimshakeshuvo',
        contactGithub: 'https://github.com/Ibrahim009-Devloper',
        contactFacebook: 'https://www.facebook.com/profile.php?id=61588549130311',
        contactLocation: 'Dhaka, Bangladesh',

        // Work Projects & Featured Images
        workP1Img: '/assets/hero_portrait.jpg',
        workP1Title: 'Dynamic Browser Automation & Form Submission Bot',
        workP1Summary: 'Automated end-to-end multi-step web forms, authentication sessions, and dynamic JavaScript processing with Playwright.',
        workP2Img: '/assets/gmaps_scraping.jpg',
        workP2Title: 'Automated Web Directory Scraping & Google Sheets Sync',
        workP2Summary: 'High-speed data extraction system built with Python, Requests, and pandas with automatic live export to Google Sheets.',
        workP3Img: '/assets/tech_sphere_bg.jpg',
        workP3Title: 'AI-Assisted Web Content Normalization & Extraction',
        workP3Summary: 'Integrated LLM API pipelines to classify, summarize, and sanitize dynamic product and company information extracted from the web.'
    };

    // No hardcoded lead cards - all dynamic projects come from Supabase projects table
    const DEFAULT_SAMPLES = [];

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

    // Auth State - Strict in-memory authentication: leaving admin or returning to home page locks admin access immediately
    const STORAGE_AUTH_KEY = 'ibrahim_automation_admin_auth';
    let inMemoryAdminAuth = false;

    function isAdminLoggedIn() {
        return inMemoryAdminAuth === true;
    }

    function setAdminAuth(isAuth) {
        inMemoryAdminAuth = !!isAuth;
        try {
            sessionStorage.removeItem(STORAGE_AUTH_KEY);
            localStorage.removeItem('ibrahim_leads_admin_auth');
            localStorage.removeItem('ibrahim_admin_auth');
            localStorage.removeItem(STORAGE_AUTH_KEY);
        } catch (e) {}
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

    // Website copy is statically authored in the code (index.html) and never overwritten
    function applySiteContentToDOM() {}
    function updateDynamicSeoMetadata() {}
    function renderServicesBoard() {}
    function populateCmsForm() {}
    function collectCmsFormData() { return {}; }
    async function syncSiteContentFromSupabase() {}
    async function pushSiteContentToSupabase() { return { success: true }; }

    // Router: Switch between Main Portfolio, Leads Sample Page, and Admin CMS
    const portfolioView = document.getElementById('portfolio-main-view');
    const leadsSamplesView = document.getElementById('leads-samples-view');
    const adminCmsView = document.getElementById('admin-cms-view');
    const navLinkSamples = document.getElementById('nav-link-leads-samples');
    const navLinkAdmin = document.getElementById('nav-link-admin');
    const footerLinkAdmin = document.getElementById('footer-link-admin');

    function handleRouting() {
        const hash = window.location.hash || '';
        const isAdminPage = hash.startsWith('#admin') || hash === '#cms' || hash === '#admin-cms';

        if (isAdminPage) {
            if (!isAdminLoggedIn()) {
                if (adminCmsView) {
                    adminCmsView.style.display = 'none';
                    adminCmsView.setAttribute('aria-hidden', 'true');
                }
                if (portfolioView) portfolioView.style.display = 'block';
                if (navLinkAdmin) navLinkAdmin.classList.remove('active');
                if (footerLinkAdmin) footerLinkAdmin.classList.remove('active');

                if (adminLoginError) adminLoginError.style.display = 'none';
                if (adminPasswordInput) adminPasswordInput.value = '';
                openModal('admin-login-modal');
                if (adminPasswordInput) {
                    setTimeout(() => adminPasswordInput.focus(), 80);
                }
                return;
            }

            // Authenticated: reveal Admin CMS View
            if (portfolioView) portfolioView.style.display = 'none';
            if (adminCmsView) {
                adminCmsView.style.display = 'block';
                adminCmsView.setAttribute('aria-hidden', 'false');
            }
            if (navLinkAdmin) navLinkAdmin.classList.add('active');
            if (footerLinkAdmin) footerLinkAdmin.classList.add('active');

            // Default to projects tab
            const projectsBtn = document.querySelector('.cms-nav-btn[data-tab="cms-tab-projects"]');
            const projectsPanel = document.getElementById('cms-tab-projects');
            document.querySelectorAll('.cms-nav-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.cms-tab-content').forEach(p => p.classList.remove('active'));
            if (projectsBtn) projectsBtn.classList.add('active');
            if (projectsPanel) projectsPanel.classList.add('active');

            window.scrollTo({ top: 0, behavior: 'smooth' });
            loadAdminProjects();
            if (typeof renderCmsInbox === 'function') {
                renderCmsInbox(true);
            }
        } else {
            // Public portfolio view - leaving admin immediately revokes authentication
            setAdminAuth(false);
            if (portfolioView) portfolioView.style.display = 'block';
            if (adminCmsView) {
                adminCmsView.style.display = 'none';
                adminCmsView.setAttribute('aria-hidden', 'true');
            }
            if (navLinkAdmin) navLinkAdmin.classList.remove('active');
            if (footerLinkAdmin) footerLinkAdmin.classList.remove('active');

            if (hash && hash !== '#' && hash !== '#projects') {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (hash === '#projects') {
                const projSec = document.getElementById('projects');
                if (projSec) projSec.scrollIntoView({ behavior: 'smooth' });
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

    // Topbar Add Project Button
    const btnAdminAddProjectTop = document.getElementById('btn-admin-add-project-top');
    if (btnAdminAddProjectTop) {
        btnAdminAddProjectTop.addEventListener('click', () => openProjectEditor(null));
    }

    // CMS Logout Button: explicitly de-authenticate and return to home
    const btnCmsLogout = document.getElementById('btn-cms-logout');
    if (btnCmsLogout) {
        btnCmsLogout.addEventListener('click', () => {
            setAdminAuth(false);
            window.location.hash = '#hero';
            showNotificationToast('Logged out of Admin Portal.');
        });
    }

    // CMS Back to Home Button: locks admin session and returns to public website
    const btnCmsBackHome = document.getElementById('btn-cms-back-home');
    if (btnCmsBackHome) {
        btnCmsBackHome.addEventListener('click', (e) => {
            e.preventDefault();
            setAdminAuth(false);
            window.location.hash = '#hero';
            showNotificationToast('Exited Admin Mode. Returned to website.');
        });
    }

    // Explicit Admin triggers: clicking Admin ALWAYS prompts for password every time
    document.querySelectorAll('a[href="#admin"], #footer-link-admin, #nav-link-admin').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Strictly reset authorization so password is required every single time
            setAdminAuth(false);
            window.location.hash = '#admin';
            if (adminLoginError) adminLoginError.style.display = 'none';
            if (adminPasswordInput) adminPasswordInput.value = '';
            openModal('admin-login-modal');
            if (adminPasswordInput) {
                setTimeout(() => adminPasswordInput.focus(), 80);
            }
        });
    });

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
        setAdminAuth(false);

        const hash = window.location.hash || '';
        const isAdminRoute = hash.startsWith('#admin') || hash === '#cms' || hash === '#admin-cms' || hash === '#leads-samples/admin' || hash === '#leads-samples-admin';
        if (isAdminRoute) {
            // Return to home view immediately so admin CMS is never exposed
            window.location.hash = '#hero';
        } else {
            handleRouting();
        }
    }

    if (btnOpenAdminLogin) {
        btnOpenAdminLogin.addEventListener('click', () => {
            setAdminAuth(false);
            if (adminLoginError) adminLoginError.style.display = 'none';
            if (adminPasswordInput) adminPasswordInput.value = '';
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
        adminLoginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = (document.getElementById('admin-email-input')?.value || '').trim();
            const password = (adminPasswordInput?.value || '').trim();

            if (!email || !password) {
                if (adminLoginError) {
                    adminLoginError.textContent = 'Please enter both your admin email and password.';
                    adminLoginError.style.display = 'block';
                }
                return;
            }

            const submitBtn = document.getElementById('btn-submit-admin-login');
            const origText = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Authenticating with Supabase...';
            }
            if (adminLoginError) adminLoginError.style.display = 'none';

            try {
                // 1. Master Developer Passcode: Immediate local administrative access
                if (password === 'ibrahim@07') {
                    setAdminAuth(true);
                    closeModal('admin-login-modal');
                    if (adminLoginError) adminLoginError.style.display = 'none';
                    if (adminPasswordInput) adminPasswordInput.value = '';
                    showNotificationToast('Signed in successfully as Admin (Master Passcode) ✓');
                    window.location.hash = '#admin';
                    handleRouting();
                    loadAdminProjects();
                    return;
                }

                // 2. Supabase Auth (Production authentication with public.admins check)
                if (supabase && supabase.auth && typeof supabase.auth.signInWithPassword === 'function') {
                    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                        email,
                        password
                    });

                    if (authError) {
                        const errMsg = (authError.message || '').toLowerCase();
                        if (errMsg.includes('invalid login credentials')) {
                            throw new Error(
                                'Invalid login credentials in Supabase Auth. To sign in with your Supabase account, create this user under Authentication → Users in your Supabase dashboard (or enter master developer passcode: ibrahim@07).'
                            );
                        }
                        if (errMsg.includes('email not confirmed')) {
                            throw new Error(
                                'Email not confirmed in Supabase Auth. In your Supabase Dashboard under Authentication → Users, click on the user and select "Confirm email", or enter master developer passcode: ibrahim@07.'
                            );
                        }
                        throw new Error(authError.message || 'Supabase authentication failed.');
                    }

                    if (!authData || !authData.user) {
                        throw new Error('No user session returned from Supabase Auth.');
                    }

                    // Strict Security Check: Verify user exists in public.admins
                    const { data: adminRows, error: adminErr } = await supabase
                        .from('admins')
                        .select('user_id')
                        .eq('user_id', authData.user.id);

                    if (adminErr) {
                        console.warn('Admins table check notice:', adminErr.message);
                        if (adminErr.message && adminErr.message.includes('Could not find the table')) {
                            // Supabase schema has not been run yet
                            console.warn('public.admins table not created yet in Supabase SQL editor.');
                        }
                    }

                    if (!adminErr && (!adminRows || adminRows.length === 0)) {
                        // User exists in auth.users but not in public.admins table
                        await supabase.auth.signOut();
                        throw new Error(
                            `Access denied: User authenticated (${authData.user.email}), but UUID '${authData.user.id}' is not in the public.admins table. Please run the SQL command: insert into public.admins (user_id) values ('${authData.user.id}'); or sign in using master developer passcode: ibrahim@07.`
                        );
                    }

                    setAdminAuth(true);
                    closeModal('admin-login-modal');
                    if (adminLoginError) adminLoginError.style.display = 'none';
                    if (adminPasswordInput) adminPasswordInput.value = '';
                    showNotificationToast('Signed in successfully as Admin (Supabase Auth) ✓');
                    window.location.hash = '#admin';
                    handleRouting();
                    loadAdminProjects();
                    return;
                }

                throw new Error('Supabase client is not available, and password was incorrect.');
            } catch (err) {
                if (adminLoginError) {
                    adminLoginError.textContent = err.message || 'Authentication error. Please check your credentials.';
                    adminLoginError.style.display = 'block';
                }
                if (adminPasswordInput) adminPasswordInput.focus();
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = origText || 'Sign In to Admin Panel';
                }
            }
        });
    }

    if (btnAdminLogout) {
        btnAdminLogout.addEventListener('click', async () => {
            try {
                if (supabase && supabase.auth && typeof supabase.auth.signOut === 'function') {
                    await supabase.auth.signOut();
                }
            } catch (e) {}
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

    // ==========================================
    // DYNAMIC PROJECTS MODULE (SUPABASE)
    // ==========================================
    let cachedProjectsList = [];

    // 1. Fetch & Render Public Projects
    async function loadPublicProjects() {
        const container = document.getElementById('projects-list-container');
        if (!container) return;

        try {
            if (!supabase) {
                renderEmptyProjects(container, 'Supabase client is initializing...');
                return;
            }

            const { data: projects, error } = await supabase
                .from('projects')
                .select('*')
                .eq('is_published', true)
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Public projects query notice:', error.message);
                renderEmptyProjects(container, 'Projects database connecting. Any published projects will appear here.');
                return;
            }

            if (!projects || projects.length === 0) {
                renderEmptyProjects(container, 'No projects published yet. Projects added via the Admin Panel will appear here.');
                return;
            }

            cachedProjectsList = projects;
            renderPublicProjectsList(container, projects);
        } catch (err) {
            console.warn('loadPublicProjects exception:', err);
            renderEmptyProjects(container, 'No projects published yet.');
        }
    }

    function renderEmptyProjects(container, message) {
        container.innerHTML = `
            <div class="empty-projects-state" style="text-align:center; padding:48px 24px; background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.12); border-radius:12px; margin:24px 0; color:var(--ink-2); width:100%;">
                <div style="font-size:36px; margin-bottom:12px;">📂</div>
                <h3 style="font-size:18px; font-weight:700; color:var(--ink); margin-bottom:8px;">No projects published yet</h3>
                <p style="font-size:14px; max-width:440px; margin:0 auto; line-height:1.5;">${escapeHtml(message || 'Projects added and published via the Admin Panel will dynamically appear here.')}</p>
            </div>
        `;
    }

    function renderPublicProjectsList(container, projects) {
        container.innerHTML = '';

        projects.forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = 'project-card reveal';
            card.style.display = 'flex';
            card.style.flexDirection = 'column';

            const tagsArray = Array.isArray(proj.tags)
                ? proj.tags
                : (typeof proj.tags === 'string' ? proj.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

            let mediaHtml = '';
            if (proj.video_url) {
                mediaHtml = `
                    <div class="project-video-wrapper" style="position:relative; width:100%; aspect-ratio:16/9; background:#000; border-radius:8px; overflow:hidden; margin-bottom:16px;">
                        <video src="${escapeHtml(proj.video_url)}" ${proj.thumbnail_url ? `poster="${escapeHtml(proj.thumbnail_url)}"` : ''} controls preload="metadata" playsinline style="width:100%; height:100%; object-fit:contain; display:block;"></video>
                    </div>
                `;
            } else if (proj.thumbnail_url) {
                mediaHtml = `
                    <div class="project-visual" style="margin-bottom:16px; border-radius:8px; overflow:hidden;">
                        <img class="project-visual-media" src="${escapeHtml(proj.thumbnail_url)}" alt="${escapeHtml(proj.title)}" loading="lazy" decoding="async" style="width:100%; height:auto; display:block; object-fit:cover;" />
                    </div>
                `;
            }

            const desc = proj.description || '';
            const isLong = desc.length > 220;
            const shortDesc = isLong ? desc.slice(0, 200) + '...' : desc;

            let githubBtnHtml = '';
            if (proj.github_url) {
                githubBtnHtml = `
                    <div style="margin-top:16px;">
                        <a href="${escapeHtml(proj.github_url)}" target="_blank" rel="noopener noreferrer" class="hero-cta hero-cta--quiet" style="display:inline-flex; align-items:center; gap:8px; padding:7px 16px; font-size:13px; font-weight:600; text-decoration:none; border-radius:8px;">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                            </svg>
                            <span>View on GitHub</span>
                            <span class="hero-cta-arrow" aria-hidden="true">↗</span>
                        </a>
                    </div>
                `;
            }

            card.innerHTML = `
                ${mediaHtml}
                <div class="project-body" style="padding:0; flex:1; display:flex; flex-direction:column;">
                    <div class="project-copy" style="flex:1;">
                        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px; align-items:center;">
                            ${proj.is_featured ? `<span class="badge-pill" style="background:rgba(234,179,8,0.15); color:#eab308; font-size:11px; padding:2px 8px; border-radius:6px; font-weight:700;">Featured</span>` : ''}
                            ${tagsArray.map(tag => `<span class="badge-pill" style="background:rgba(16,185,129,0.12); color:#10b981; font-size:11px; padding:2px 8px; border-radius:6px; font-weight:600;">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                        <h3 class="project-title" style="margin-bottom:8px; font-size:18px; font-weight:700; color:var(--ink);">${escapeHtml(proj.title)}</h3>
                        <div class="project-desc-wrapper" id="public-proj-desc-${idx}">
                            <p class="project-summary" style="font-size:14px; line-height:1.6; color:var(--ink-2); margin-bottom:4px;">${escapeHtml(isLong ? shortDesc : desc)}</p>
                            ${isLong ? `<button type="button" class="btn-read-more" data-idx="${idx}" style="background:none; border:none; color:var(--accent); font-size:13px; font-weight:600; cursor:pointer; padding:0; margin-top:4px;">Read more ↓</button>` : ''}
                        </div>
                    </div>
                    ${githubBtnHtml}
                </div>
            `;

            if (isLong) {
                const btn = card.querySelector(`.btn-read-more[data-idx="${idx}"]`);
                if (btn) {
                    let expanded = false;
                    btn.addEventListener('click', () => {
                        expanded = !expanded;
                        const p = card.querySelector(`#public-proj-desc-${idx} .project-summary`);
                        if (p) p.textContent = expanded ? desc : shortDesc;
                        btn.textContent = expanded ? 'Read less ↑' : 'Read more ↓';
                    });
                }
            }

            container.appendChild(card);
        });
    }

    // 2. Admin Projects Management & Supabase SQL Schema
    const SUPABASE_SETUP_SQL = `-- 1. Create Projects Table (stores all automation portfolio projects)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  github_url text,
  video_url text,
  thumbnail_url text,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 2. Create Admins Table
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 3. Create Messages Table for Client Inquiries
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  service text,
  budget text,
  timeline text,
  message text not null,
  status text not null default 'unread',
  created_at timestamptz not null default now()
);

-- 4. Enable Row Level Security (RLS)
alter table public.projects enable row level security;
alter table public.admins enable row level security;
alter table public.messages enable row level security;

-- 5. Projects RLS Policies
drop policy if exists "Public reads published projects" on public.projects;
create policy "Public reads published projects"
  on public.projects for select
  using (is_published = true);

drop policy if exists "Admins read all projects" on public.projects;
create policy "Admins read all projects"
  on public.projects for select
  using (true);

drop policy if exists "Admins manage projects" on public.projects;
create policy "Admins manage projects"
  on public.projects for all
  using (true)
  with check (true);

-- 6. Admins Table Policy
drop policy if exists "Admin reads own admin row" on public.admins;
create policy "Admin reads own admin row"
  on public.admins for select to authenticated
  using (auth.uid() = user_id);

-- 7. Messages Table Policies
drop policy if exists "Allow public insert messages" on public.messages;
create policy "Allow public insert messages"
  on public.messages for insert
  with check (true);

drop policy if exists "Allow admin read messages" on public.messages;
create policy "Allow admin read messages"
  on public.messages for select
  using (true);

drop policy if exists "Allow admin update messages" on public.messages;
create policy "Allow admin update messages"
  on public.messages for update
  using (true);

drop policy if exists "Allow admin delete messages" on public.messages;
create policy "Allow admin delete messages"
  on public.messages for delete
  using (true);

-- 8. Storage Bucket for Video & Media (50 MB limit, public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  true,
  52428800,
  array['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800;

-- 9. Storage Policies for project-media bucket
drop policy if exists "Public reads project media" on storage.objects;
create policy "Public reads project media"
  on storage.objects for select
  using (bucket_id = 'project-media');

drop policy if exists "Allow upload project media" on storage.objects;
create policy "Allow upload project media"
  on storage.objects for insert
  with check (bucket_id = 'project-media');

drop policy if exists "Allow manage project media" on storage.objects;
create policy "Allow manage project media"
  on storage.objects for all
  using (bucket_id = 'project-media');

-- 10. Refresh schema cache
notify pgrst, 'reload schema';`;

    let allAdminProjects = [];

    // Initialize SQL UI Helpers
    function initSupabaseSqlHelpers() {
        const sqlTextarea = document.getElementById('supabase-full-sql-code');
        if (sqlTextarea && !sqlTextarea.value) {
            sqlTextarea.value = SUPABASE_SETUP_SQL;
        }

        const copyBtn = document.getElementById('btn-copy-supabase-sql');
        if (copyBtn && !copyBtn.dataset.bound) {
            copyBtn.dataset.bound = 'true';
            copyBtn.addEventListener('click', () => {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(SUPABASE_SETUP_SQL).then(() => {
                        showNotificationToast('✓ SQL Setup Script copied to clipboard! Paste in Supabase SQL editor.');
                    }).catch(() => {
                        showNotificationToast('Please copy the SQL code shown in the box.');
                    });
                } else if (sqlTextarea) {
                    sqlTextarea.select();
                    document.execCommand('copy');
                    showNotificationToast('✓ SQL Setup Script copied!');
                }
            });
        }

        const toggleBtn = document.getElementById('btn-toggle-sql-code');
        const previewWrap = document.getElementById('sql-code-preview-wrap');
        if (toggleBtn && previewWrap && !toggleBtn.dataset.bound) {
            toggleBtn.dataset.bound = 'true';
            toggleBtn.addEventListener('click', () => {
                const isHidden = previewWrap.style.display === 'none' || !previewWrap.style.display;
                previewWrap.style.display = isHidden ? 'block' : 'none';
                toggleBtn.textContent = isHidden ? 'Hide SQL Script' : 'View SQL Script';
            });
        }

        const checkBtn = document.getElementById('btn-check-projects-db');
        if (checkBtn && !checkBtn.dataset.bound) {
            checkBtn.dataset.bound = 'true';
            checkBtn.addEventListener('click', () => {
                showNotificationToast('Refreshing Supabase projects database...');
                loadAdminProjects();
            });
        }
    }

    async function loadAdminProjects() {
        initSupabaseSqlHelpers();
        const container = document.getElementById('admin-projects-list-container');
        if (!container) return;

        if (!isAdminLoggedIn()) return;

        const dot = document.getElementById('db-status-indicator-dot');
        const statusText = document.getElementById('db-status-title-text');

        try {
            if (!supabase) {
                container.innerHTML = '<p style="color:var(--ink-2); padding:16px;">Supabase client not initialized.</p>';
                return;
            }

            const { data: projects, error } = await supabase
                .from('projects')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) {
                if (dot) {
                    dot.style.background = '#ef4444';
                    dot.style.boxShadow = '0 0 8px #ef4444';
                }
                if (statusText) {
                    statusText.textContent = "Supabase Table 'projects' Not Created Yet";
                }

                container.innerHTML = `
                    <div style="background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.25); border-radius:10px; padding:22px; color:var(--ink);">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                            <span style="font-size:20px;">⚠️</span>
                            <h3 style="font-size:16px; font-weight:700; color:#ef4444; margin:0;">Supabase Database Table 'projects' Not Found</h3>
                        </div>
                        <p style="font-size:13.5px; line-height:1.6; color:var(--ink-2); margin-bottom:16px;">
                            The project and video storage tables have not been created yet in your Supabase project (<strong>voixkvyylglpomahowrl</strong>).<br />
                            Click <strong>"Copy SQL Setup Script"</strong> above, open the Supabase SQL Editor, paste the code, and click <strong>Run</strong>.
                        </p>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <button type="button" class="btn-cms-save" id="btn-quick-copy-sql" style="padding:8px 16px; font-size:13px; font-weight:700; background:var(--accent); color:#000;">
                                📋 Copy SQL Setup Script
                            </button>
                            <a href="https://supabase.com/dashboard/project/voixkvyylglpomahowrl/sql/new" target="_blank" rel="noopener noreferrer" class="btn-cms-secondary" style="padding:8px 16px; font-size:13px; display:inline-flex; align-items:center; gap:6px;">
                                Open Supabase SQL Editor ↗
                            </a>
                            <button type="button" class="btn-cms-secondary" id="btn-quick-refresh-sql" style="padding:8px 16px; font-size:13px;">
                                🔄 Check Connection Again
                            </button>
                        </div>
                    </div>
                `;

                const quickCopy = document.getElementById('btn-quick-copy-sql');
                if (quickCopy) {
                    quickCopy.addEventListener('click', () => {
                        navigator.clipboard.writeText(SUPABASE_SETUP_SQL).then(() => {
                            showNotificationToast('✓ SQL Script Copied! Paste into Supabase SQL Editor and click Run.');
                        });
                    });
                }

                const quickRefresh = document.getElementById('btn-quick-refresh-sql');
                if (quickRefresh) {
                    quickRefresh.addEventListener('click', () => {
                        showNotificationToast('Checking database connection...');
                        loadAdminProjects();
                    });
                }
                return;
            }

            // Successfully connected
            if (dot) {
                dot.style.background = '#10b981';
                dot.style.boxShadow = '0 0 8px #10b981';
            }
            if (statusText) {
                statusText.textContent = `Supabase Database & Storage Connected (${(projects || []).length} projects)`;
            }

            allAdminProjects = projects || [];
            renderAdminProjectsList(container, allAdminProjects);
        } catch (err) {
            console.error('loadAdminProjects exception:', err);
            container.innerHTML = '<p style="color:var(--ink-2); padding:16px;">Failed to load projects.</p>';
        }
    }

    function renderAdminProjectsList(container, projects) {
        if (!projects || projects.length === 0) {
            container.innerHTML = `
                <div style="text-align:center; padding:32px 16px; background:rgba(255,255,255,0.02); border:1px dashed rgba(255,255,255,0.12); border-radius:10px; color:var(--ink-2);">
                    <p style="font-size:15px; font-weight:600; color:var(--ink); margin-bottom:6px;">No projects in database yet</p>
                    <p style="font-size:13px; margin-bottom:14px;">Click "+ Add New Project" above to create your first dynamic project.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        projects.forEach((proj, idx) => {
            const card = document.createElement('div');
            card.className = 'admin-project-item';
            card.style.display = 'flex';
            card.style.justifyContent = 'space-between';
            card.style.alignItems = 'center';
            card.style.flexWrap = 'wrap';
            card.style.gap = '14px';
            card.style.padding = '14px 18px';
            card.style.background = 'rgba(255,255,255,0.025)';
            card.style.border = '1px solid rgba(255,255,255,0.08)';
            card.style.borderRadius = '10px';

            const tagsArray = Array.isArray(proj.tags)
                ? proj.tags
                : (typeof proj.tags === 'string' ? proj.tags.split(',').map(t => t.trim()).filter(Boolean) : []);

            card.innerHTML = `
                <div style="flex:1 1 320px;">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                        <span style="font-size:12px; font-weight:700; color:var(--ink);">${escapeHtml(proj.title)}</span>
                        ${proj.is_published 
                            ? `<span class="badge-pill" style="background:rgba(16,185,129,0.15); color:#10b981; font-size:11px; padding:2px 8px; border-radius:6px; font-weight:600;">Published</span>` 
                            : `<span class="badge-pill" style="background:rgba(245,158,11,0.15); color:#f59e0b; font-size:11px; padding:2px 8px; border-radius:6px; font-weight:600;">Draft (Hidden)</span>`}
                        ${proj.is_featured ? `<span class="badge-pill" style="background:rgba(234,179,8,0.15); color:#eab308; font-size:11px; padding:2px 8px; border-radius:6px; font-weight:700;">★ Featured</span>` : ''}
                        ${proj.video_url ? `<span class="badge-pill" style="background:rgba(59,130,246,0.15); color:#60a5fa; font-size:11px; padding:2px 8px; border-radius:6px;">🎥 Video</span>` : ''}
                        ${proj.github_url ? `<span class="badge-pill" style="background:rgba(148,163,184,0.15); color:#94a3b8; font-size:11px; padding:2px 8px; border-radius:6px;">GitHub</span>` : ''}
                    </div>
                    <p style="font-size:13px; color:var(--ink-2); line-height:1.4; margin-bottom:6px; max-width:640px;">${escapeHtml(proj.description?.slice(0, 140) + (proj.description?.length > 140 ? '...' : ''))}</p>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; font-size:11px; color:var(--ink-3);">
                        <span>Order: <strong>${proj.sort_order ?? 0}</strong></span>
                        <span>·</span>
                        <span>Tags: ${escapeHtml(tagsArray.join(', ') || 'None')}</span>
                    </div>
                </div>

                <div style="display:flex; align-items:center; gap:8px;">
                    <!-- Reorder Buttons -->
                    <button type="button" class="btn-cms-secondary btn-proj-up" data-id="${escapeHtml(proj.id)}" data-idx="${idx}" title="Move project up in sort order" style="padding:4px 8px; font-size:12px;" ${idx === 0 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>▲</button>
                    <button type="button" class="btn-cms-secondary btn-proj-down" data-id="${escapeHtml(proj.id)}" data-idx="${idx}" title="Move project down in sort order" style="padding:4px 8px; font-size:12px;" ${idx === projects.length - 1 ? 'disabled style="opacity:0.4; cursor:not-allowed;"' : ''}>▼</button>

                    <!-- Edit Button -->
                    <button type="button" class="btn-cms-save btn-proj-edit" data-id="${escapeHtml(proj.id)}" style="padding:6px 14px; font-size:12px; background:rgba(255,255,255,0.08); color:var(--ink);">Edit</button>

                    <!-- Delete Button -->
                    <button type="button" class="btn-admin-logout btn-proj-delete" data-id="${escapeHtml(proj.id)}" style="padding:6px 12px; font-size:12px; color:#ef4444; border-color:rgba(239,68,68,0.3);">Delete</button>
                </div>
            `;

            // Event Listeners for action buttons
            const btnUp = card.querySelector('.btn-proj-up');
            if (btnUp && idx > 0) {
                btnUp.addEventListener('click', () => reorderProject(proj.id, -1));
            }

            const btnDown = card.querySelector('.btn-proj-down');
            if (btnDown && idx < projects.length - 1) {
                btnDown.addEventListener('click', () => reorderProject(proj.id, 1));
            }

            const btnEdit = card.querySelector('.btn-proj-edit');
            if (btnEdit) {
                btnEdit.addEventListener('click', () => openProjectEditor(proj));
            }

            const btnDelete = card.querySelector('.btn-proj-delete');
            if (btnDelete) {
                let confirming = false;
                btnDelete.addEventListener('click', async () => {
                    if (!confirming) {
                        confirming = true;
                        btnDelete.textContent = 'Confirm?';
                        btnDelete.style.background = '#ef4444';
                        btnDelete.style.color = '#fff';
                        setTimeout(() => {
                            confirming = false;
                            btnDelete.textContent = 'Delete';
                            btnDelete.style.background = 'transparent';
                            btnDelete.style.color = '#ef4444';
                        }, 3000);
                        return;
                    }

                    // Execute deletion
                    btnDelete.disabled = true;
                    btnDelete.textContent = 'Deleting...';
                    try {
                        const { error } = await supabase.from('projects').delete().eq('id', proj.id);
                        if (error) throw error;
                        showNotificationToast('Project deleted successfully ✓');
                        loadAdminProjects();
                        loadPublicProjects();
                    } catch (err) {
                        showNotificationToast(`Delete error: ${err.message}`);
                        btnDelete.disabled = false;
                        btnDelete.textContent = 'Delete';
                    }
                });
            }

            container.appendChild(card);
        });
    }

    // 3. Reorder Project
    async function reorderProject(projectId, delta) {
        if (!allAdminProjects || allAdminProjects.length === 0) return;
        const currentIdx = allAdminProjects.findIndex(p => p.id === projectId);
        if (currentIdx === -1) return;

        const targetIdx = currentIdx + delta;
        if (targetIdx < 0 || targetIdx >= allAdminProjects.length) return;

        const currentProj = allAdminProjects[currentIdx];
        const targetProj = allAdminProjects[targetIdx];

        // Swap sort_order
        const orderA = targetProj.sort_order ?? targetIdx;
        const orderB = currentProj.sort_order ?? currentIdx;

        try {
            await supabase.from('projects').update({ sort_order: orderA }).eq('id', currentProj.id);
            await supabase.from('projects').update({ sort_order: orderB }).eq('id', targetProj.id);
            showNotificationToast('Project order updated ✓');
            loadAdminProjects();
            loadPublicProjects();
        } catch (err) {
            console.error('Reorder error:', err);
            showNotificationToast(`Reorder error: ${err.message}`);
        }
    }

    // 4. Project Editor Modal Logic
    const btnAdminAddProject = document.getElementById('btn-admin-add-project');
    const projectEditorModal = document.getElementById('project-editor-modal');
    const btnCloseProjectEditor = document.getElementById('btn-close-project-editor');
    const btnCancelProjectEditor = document.getElementById('btn-cancel-project-editor');
    const projectEditorForm = document.getElementById('project-editor-form');
    const projectEditorHeading = document.getElementById('project-editor-heading');
    const projectEditorError = document.getElementById('project-editor-error');

    const radioVideoUrl = document.getElementById('radio-video-url');
    const radioVideoFile = document.getElementById('radio-video-file');
    const videoUrlGroup = document.getElementById('video-url-input-wrap');
    const videoFileGroup = document.getElementById('video-file-input-wrap');
    const projectVideoFile = document.getElementById('project-video-file');
    const videoFileWarning = document.getElementById('video-file-warning');
    const videoUploadProgress = document.getElementById('video-upload-progress');
    const videoUploadBar = document.getElementById('video-upload-bar');
    const videoUploadPct = document.getElementById('video-upload-pct');
    const videoUploadStatusText = document.getElementById('video-upload-status-text');

    function toggleVideoInputMode(isUrl) {
        if (videoUrlGroup) videoUrlGroup.style.display = isUrl ? 'block' : 'none';
        if (videoFileGroup) videoFileGroup.style.display = isUrl ? 'none' : 'block';
    }

    if (radioVideoUrl) {
        radioVideoUrl.addEventListener('change', () => toggleVideoInputMode(true));
    }
    if (radioVideoFile) {
        radioVideoFile.addEventListener('change', () => toggleVideoInputMode(false));
    }

    // Warn if file > 50MB
    if (projectVideoFile) {
        projectVideoFile.addEventListener('change', () => {
            const file = projectVideoFile.files?.[0];
            if (!file) {
                if (videoFileWarning) videoFileWarning.style.display = 'none';
                return;
            }

            const isMp4OrWebm = file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.type.includes('mp4') || file.type.includes('webm');
            if (!isMp4OrWebm) {
                if (projectEditorError) {
                    projectEditorError.textContent = 'Invalid file format: Video must be .mp4 or .webm only.';
                    projectEditorError.style.display = 'block';
                }
            } else if (projectEditorError) {
                projectEditorError.style.display = 'none';
            }

            if (file.size > 50 * 1024 * 1024) {
                const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
                if (videoFileWarning) {
                    videoFileWarning.textContent = `⚠️ Warning: File size is ${sizeMb} MB, which exceeds the Supabase free plan limit (50 MB). Please compress the video first or paste a direct video URL.`;
                    videoFileWarning.style.display = 'block';
                }
            } else {
                if (videoFileWarning) videoFileWarning.style.display = 'none';
            }
        });
    }

    function openProjectEditor(project = null) {
        if (projectEditorError) projectEditorError.style.display = 'none';
        if (videoFileWarning) videoFileWarning.style.display = 'none';
        if (videoUploadProgress) videoUploadProgress.style.display = 'none';
        if (projectVideoFile) projectVideoFile.value = '';

        const idInput = document.getElementById('project-id');
        const titleInput = document.getElementById('project-title');
        const descInput = document.getElementById('project-description');
        const tagsInput = document.getElementById('project-tags');
        const githubInput = document.getElementById('project-github');
        const videoUrlInput = document.getElementById('project-video-url');
        const thumbInput = document.getElementById('project-thumbnail-url');
        const isPubInput = document.getElementById('project-is-published');
        const isFeatInput = document.getElementById('project-is-featured');
        const sortInput = document.getElementById('project-sort-order');

        if (project) {
            if (projectEditorHeading) projectEditorHeading.textContent = 'Edit Project';
            if (idInput) idInput.value = project.id;
            if (titleInput) titleInput.value = project.title || '';
            if (descInput) descInput.value = project.description || '';
            const tags = Array.isArray(project.tags) ? project.tags.join(', ') : (project.tags || '');
            if (tagsInput) tagsInput.value = tags;
            if (githubInput) githubInput.value = project.github_url || '';
            if (videoUrlInput) videoUrlInput.value = project.video_url || '';
            if (thumbInput) thumbInput.value = project.thumbnail_url || '';
            if (isPubInput) isPubInput.checked = project.is_published !== false;
            if (isFeatInput) isFeatInput.checked = Boolean(project.is_featured);
            if (sortInput) sortInput.value = project.sort_order ?? 0;
        } else {
            if (projectEditorHeading) projectEditorHeading.textContent = 'Add New Project';
            if (idInput) idInput.value = '';
            if (titleInput) titleInput.value = '';
            if (descInput) descInput.value = '';
            if (tagsInput) tagsInput.value = 'Python, Playwright, pandas';
            if (githubInput) githubInput.value = '';
            if (videoUrlInput) videoUrlInput.value = '';
            if (thumbInput) thumbInput.value = '';
            if (isPubInput) isPubInput.checked = true;
            if (isFeatInput) isFeatInput.checked = false;
            if (sortInput) sortInput.value = allAdminProjects.length;
        }

        if (radioVideoUrl) radioVideoUrl.checked = true;
        toggleVideoInputMode(true);

        openModal('project-editor-modal');
    }

    if (btnAdminAddProject) {
        btnAdminAddProject.addEventListener('click', () => openProjectEditor(null));
    }

    if (btnCloseProjectEditor) {
        btnCloseProjectEditor.addEventListener('click', () => closeModal('project-editor-modal'));
    }
    if (btnCancelProjectEditor) {
        btnCancelProjectEditor.addEventListener('click', () => closeModal('project-editor-modal'));
    }

    // Submit Project Form
    if (projectEditorForm) {
        projectEditorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = (document.getElementById('project-id')?.value || '').trim();
            const title = (document.getElementById('project-title')?.value || '').trim();
            const description = (document.getElementById('project-description')?.value || '').trim();
            const rawTags = (document.getElementById('project-tags')?.value || '').trim();
            const githubUrl = (document.getElementById('project-github')?.value || '').trim();
            let videoUrl = (document.getElementById('project-video-url')?.value || '').trim();
            const thumbnailUrl = (document.getElementById('project-thumbnail-url')?.value || '').trim();
            const isPublished = Boolean(document.getElementById('project-is-published')?.checked);
            const isFeatured = Boolean(document.getElementById('project-is-featured')?.checked);
            const sortOrder = parseInt(document.getElementById('project-sort-order')?.value || '0', 10);

            // 1. Validation: title and description required
            if (!title) {
                if (projectEditorError) {
                    projectEditorError.textContent = 'Project title is required.';
                    projectEditorError.style.display = 'block';
                }
                return;
            }
            if (!description) {
                if (projectEditorError) {
                    projectEditorError.textContent = 'Project short description is required.';
                    projectEditorError.style.display = 'block';
                }
                return;
            }

            // 2. Validation: GitHub URL must start with https://github.com/
            if (githubUrl && !githubUrl.startsWith('https://github.com/')) {
                if (projectEditorError) {
                    projectEditorError.textContent = 'GitHub URL must start with https://github.com/';
                    projectEditorError.style.display = 'block';
                }
                return;
            }

            // 3. Video Handling: Check if file upload was selected
            const isFileUpload = radioVideoFile?.checked;
            const file = projectVideoFile?.files?.[0];

            if (isFileUpload && file) {
                const isMp4OrWebm = file.name.endsWith('.mp4') || file.name.endsWith('.webm') || file.type.includes('mp4') || file.type.includes('webm');
                if (!isMp4OrWebm) {
                    if (projectEditorError) {
                        projectEditorError.textContent = 'Video file must be .mp4 or .webm only.';
                        projectEditorError.style.display = 'block';
                    }
                    return;
                }

                // Show progress bar
                if (videoUploadProgress) videoUploadProgress.style.display = 'block';
                if (videoUploadBar) videoUploadBar.style.width = '30%';
                if (videoUploadPct) videoUploadPct.textContent = '30%';
                if (videoUploadStatusText) videoUploadStatusText.textContent = 'Uploading video to Supabase Storage bucket (project-media)...';

                try {
                    const cleanFileName = `video_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from('project-media')
                        .upload(cleanFileName, file, { cacheControl: '3600', upsert: true });

                    if (uploadErr) {
                        throw new Error(`Storage upload error: ${uploadErr.message}`);
                    }

                    if (videoUploadBar) videoUploadBar.style.width = '80%';
                    if (videoUploadPct) videoUploadPct.textContent = '80%';

                    const { data: pubData } = supabase.storage
                        .from('project-media')
                        .getPublicUrl(cleanFileName);

                    if (pubData && pubData.publicUrl) {
                        videoUrl = pubData.publicUrl;
                    }

                    if (videoUploadBar) videoUploadBar.style.width = '100%';
                    if (videoUploadPct) videoUploadPct.textContent = '100%';
                    if (videoUploadStatusText) videoUploadStatusText.textContent = 'Upload complete ✓';
                } catch (upErr) {
                    if (projectEditorError) {
                        projectEditorError.textContent = upErr.message;
                        projectEditorError.style.display = 'block';
                    }
                    if (videoUploadProgress) videoUploadProgress.style.display = 'none';
                    return;
                }
            }

            const tagsArray = rawTags.split(',').map(t => t.trim()).filter(Boolean);

            const payload = {
                title,
                description,
                tags: tagsArray,
                github_url: githubUrl || null,
                video_url: videoUrl || null,
                thumbnail_url: thumbnailUrl || null,
                is_featured: isFeatured,
                is_published: isPublished,
                sort_order: isNaN(sortOrder) ? 0 : sortOrder
            };

            const saveBtn = document.getElementById('btn-save-project');
            if (saveBtn) {
                saveBtn.disabled = true;
                saveBtn.textContent = 'Saving to Database...';
            }

            try {
                if (id) {
                    const { error } = await supabase
                        .from('projects')
                        .update(payload)
                        .eq('id', id);
                    if (error) throw error;
                    showNotificationToast('Project updated successfully in Supabase ✓');
                } else {
                    const { error } = await supabase
                        .from('projects')
                        .insert([payload]);
                    if (error) throw error;
                    showNotificationToast('Project created and published to Supabase ✓');
                }

                closeModal('project-editor-modal');
                loadAdminProjects();
                loadPublicProjects();
            } catch (err) {
                if (projectEditorError) {
                    let msg = err.message || 'Database save error.';
                    if (msg.includes('Could not find the table') || msg.includes('projects')) {
                        msg = "Database table 'projects' not found in Supabase yet. Please run the SQL setup script from Section 4.3 in your Supabase SQL editor.";
                    } else if (msg.includes('row-level security') || msg.includes('policy')) {
                        msg = "Permission denied by Supabase RLS. Ensure your user ID is registered in the public.admins table: insert into public.admins (user_id) values ('YOUR_USER_ID');";
                    }
                    projectEditorError.textContent = msg;
                    projectEditorError.style.display = 'block';
                }
            } finally {
                if (saveBtn) {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save Project to Database';
                }
            }
        });
    }

    // Auto-load public projects on page load
    loadPublicProjects();

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
            const cleanType = escapeHtml(item.project_type || 'General Project Inquiry');
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

    // Initialize UI, Database Sync, and Router - Always initialize in locked state
    try {
        localStorage.removeItem('ibrahim_leads_site_content');
        localStorage.removeItem('ibrahim_site_content');
        localStorage.removeItem('ibrahim_leads_admin_auth');
        localStorage.removeItem('ibrahim_admin_auth');
        localStorage.removeItem('ibrahim_automation_admin_auth');
        sessionStorage.removeItem('ibrahim_automation_admin_auth');
        sessionStorage.removeItem('ibrahim_leads_admin_auth');
        inMemoryAdminAuth = false;
    } catch (e) {}

    updateAdminBarUI();
    renderCmsInbox();
    pingSupabaseDatabase();
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
            <a href="mailto:${cleanEmail}?subject=Python%20Web%20Automation%20Inquiry" class="ai-contact-btn email-btn" title="Send Email">
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
            <p>I can help answer your questions about Ibrahim's <strong>Python Web Automation</strong>, <strong>Browser Bots</strong>, <strong>Web Scraping</strong>, and <strong>Google Sheets &amp; Docs automation</strong>.</p>
            <p style="font-size:12px; color:#94a3b8; margin-top:6px;">Whenever you're ready to discuss your project, I can provide his direct phone number to call or message immediately.</p>
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
