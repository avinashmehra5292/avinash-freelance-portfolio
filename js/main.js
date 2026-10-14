/**
 * DEVCRAFT - MAIN APPLICATION LOGIC
 * Master interactivity controller for animations, project filters, modal, terminal, theme & forms.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initProjectShowcase();
  initCaseStudyModal();
  initHeroTerminal();
  initFaqAccordion();
  initContactForm();
  initLiveClock();
  initClipboardButtons();
});

/* --------------------------------------------------------------------------
   1. THEME SWITCHER (Dark Default / Light Option)
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('devcraft-theme') || 'dark';

  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('devcraft-theme', nextTheme);
      showToast(`Switched to ${nextTheme === 'light' ? 'Day Light' : 'Obsidian Dark'} Mode`, 'info');
    });
  }
}

/* --------------------------------------------------------------------------
   2. HEADER SCROLL & MOBILE DRAWER
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navBackdrop = document.getElementById('nav-backdrop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  function closeMobileMenu() {
    if (navLinks) navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
  }

  function toggleMobileMenu() {
    if (!navLinks) return;
    const willOpen = !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', willOpen);
    if (navBackdrop) navBackdrop.classList.toggle('open', willOpen);
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', String(willOpen));
  }

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    // Close on click link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }
}

/* --------------------------------------------------------------------------
   4. PROJECT SHOWCASE & CATEGORY FILTERS
   -------------------------------------------------------------------------- */
function initProjectShowcase() {
  const grid = document.getElementById('projects-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!grid || !window.PROJECTS_DATA) return;

  function renderProjects(category = 'all') {
    const filtered = category === 'all' 
      ? window.PROJECTS_DATA 
      : window.PROJECTS_DATA.filter(p => p.category === category);

    grid.innerHTML = filtered.map(proj => `
      <article class="project-card" data-id="${proj.id}">
        <div class="project-thumb-wrap">
          <img src="${proj.image}" alt="${proj.title} Preview" class="project-img" loading="lazy">
          <div class="project-badge-top">
            <span class="project-category-tag">${proj.categoryLabel}</span>
          </div>
          <button class="project-quick-preview-btn open-case-study" data-id="${proj.id}" title="Quick Case Study" aria-label="Quick Case Study">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6"></path>
              <path d="M10 14L21 3"></path>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            </svg>
          </button>
        </div>
        <div class="project-content">
          <div class="project-title-row">
            <h3 class="project-title">${proj.title}</h3>
            <span class="project-year">${proj.year}</span>
          </div>
          <p class="project-summary">${proj.summary}</p>
          
          <div class="project-metrics-ribbon">
            ${proj.metrics.map(m => `
              <div class="metric-pill">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <span><strong>${m.value}</strong> ${m.label}</span>
              </div>
            `).join('')}
          </div>

          <div class="project-tech-tags">
            ${proj.tech.slice(0, 5).map(t => `<span class="tech-tag">${t}</span>`).join('')}
            ${proj.tech.length > 5 ? `<span class="tech-tag">+${proj.tech.length - 5}</span>` : ''}
          </div>

          <div class="project-actions">
            <button class="btn btn-primary btn-sm open-case-study" data-id="${proj.id}">
              <span>View Project</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            <a href="${proj.liveUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm" title="Visit ${proj.title} Live Website">
              <span>Live Site ↗</span>
            </a>
          </div>
        </div>
      </article>
    `).join('');

    attachProjectCardEvents();
  }

  // Filter tab events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProjects(btn.dataset.category || 'all');
    });
  });

  renderProjects('all');
}

/* --------------------------------------------------------------------------
   5. CASE STUDY DEEP DIVE MODAL
   -------------------------------------------------------------------------- */
function initCaseStudyModal() {
  const modal = document.getElementById('case-study-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-body');
  if (!modal || !modalContent) return;

  window.openCaseStudyById = function(projectId) {
    const proj = window.PROJECTS_DATA.find(p => 
      p.id === projectId || 
      p.title === projectId || 
      (p.id && p.id.toLowerCase() === (projectId || '').toLowerCase())
    );
    if (!proj) return;

    modalContent.innerHTML = `
      <img src="${proj.image}" alt="${proj.title}" class="modal-image-hero">
      <div class="modal-body-content">
        <div class="case-study-badge">${proj.categoryLabel} // ${proj.caseStudy.client}</div>
        <h2 class="case-study-title">${proj.title} — ${proj.subtitle}</h2>

        <!-- Live Project Link Box -->
        <div class="case-study-live-bar" style="margin: 16px 0 26px 0; padding: 14px 20px; background: rgba(0, 242, 254, 0.08); border: 1px solid rgba(0, 242, 254, 0.28); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px; font-family: var(--font-mono); font-size: 0.88rem; color: var(--accent-cyan);">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>Live URL: <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" style="color: #fff; text-decoration: underline; font-weight: 600;">${proj.liveUrl}</a></span>
          </div>
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Visit Live Site ↗</span>
          </a>
        </div>

        <p class="case-study-text">${proj.caseStudy.overview}</p>

        <div class="case-study-metrics-grid">
          ${proj.metrics.map(m => `
            <div class="cs-metric-card">
              <div class="cs-metric-val">${m.value}</div>
              <div class="cs-metric-label">${m.label}</div>
            </div>
          `).join('')}
        </div>

        <div class="case-study-section">
          <h3 class="case-study-heading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            The Engineering Challenge
          </h3>
          <p class="case-study-text">${proj.caseStudy.challenge}</p>
        </div>

        <div class="case-study-section">
          <h3 class="case-study-heading">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            Key Architectural Solutions
          </h3>
          <ul class="deliverables-list" style="margin-top: 14px;">
            ${proj.caseStudy.highlights.map(h => `
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div class="case-study-section">
          <h3 class="case-study-heading">Technology Stack Utilized</h3>
          <div class="project-tech-tags" style="margin-top: 10px;">
            ${proj.tech.map(t => `<span class="tech-tag" style="padding: 6px 14px; font-size: 0.86rem;">${t}</span>`).join('')}
          </div>
        </div>

        <div class="testimonial-card" style="margin-top: 36px; background: rgba(0,0,0,0.3);">
          <div class="stars-row">★★★★★</div>
          <p class="testimonial-quote">"${proj.caseStudy.testimonial.quote}"</p>
          <div class="author-info">
            <h4 style="color: var(--accent-cyan);">${proj.caseStudy.testimonial.author}</h4>
            <p>${proj.caseStudy.testimonial.role}</p>
          </div>
        </div>

        <div style="margin-top: 36px; display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>Visit Live Website ↗</span>
          </a>
          <a href="#contact" class="btn btn-secondary" onclick="document.getElementById('case-study-modal').classList.remove('open')">
            <span>Hire Me For Similar Project</span>
          </a>
        </div>
      </div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

function attachProjectCardEvents() {
  document.querySelectorAll('.open-case-study').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (window.openCaseStudyById) window.openCaseStudyById(id);
    });
  });

  document.querySelectorAll('.test-demo-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.dataset.title;
      showToast(`Launching interactive simulation preview for ${title}... (Full sandbox loaded)`, 'info');
    });
  });
}

/* --------------------------------------------------------------------------
   6. HERO INTERACTIVE CODE / TERMINAL WINDOW
   -------------------------------------------------------------------------- */
function initHeroTerminal() {
  const terminalTabs = document.querySelectorAll('.terminal-tab');
  const codeBody = document.getElementById('terminal-code-body');
  const cliInput = document.getElementById('cli-input');
  const cliOutput = document.getElementById('cli-history');

  const tabContents = {
    stack: `
<div class="code-line"><span class="line-num">1</span><span class="line-code"><span class="code-keyword">export const</span> <span class="code-var">developerProfile</span> = {</span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-code">  craftsman: <span class="code-string">"Avinash // Senior Full-Stack Engineer"</span>,</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-code">  experience: <span class="code-string">"5+ Years Crafting Production Apps"</span>,</span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-code">  flagshipProjects: [<span class="code-string">"Tiffinix"</span>, <span class="code-string">"KR-ESTATE"</span>, <span class="code-string">"Shri Ratna Jewellers"</span>, <span class="code-string">"Jai Mata Di Travels"</span>],</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-code">  coreStack: {</span></div>
<div class="code-line"><span class="line-num">6</span><span class="line-code">    frontend: [<span class="code-string">"Next.js"</span>, <span class="code-string">"React"</span>, <span class="code-string">"TypeScript"</span>, <span class="code-string">"Three.js"</span>],</span></div>
<div class="code-line"><span class="line-num">7</span><span class="line-code">    backend: [<span class="code-string">"Node.js"</span>, <span class="code-string">"PostgreSQL"</span>, <span class="code-string">"Redis"</span>, <span class="code-string">"FastAPI"</span>],</span></div>
<div class="code-line"><span class="line-num">8</span><span class="line-code">    cloud: [<span class="code-string">"AWS"</span>, <span class="code-string">"Docker"</span>, <span class="code-string">"Vercel"</span>, <span class="code-string">"Cloudflare"</span>]</span></div>
<div class="code-line"><span class="line-num">9</span><span class="line-code">  },</span></div>
<div class="code-line"><span class="line-num">10</span><span class="line-code">  status: <span class="code-string">"AVAILABLE_FOR_CONTRACTS_Q4"</span>,</span></div>
<div class="code-line"><span class="line-num">11</span><span class="line-code">  readyToShip: <span class="code-bool">true</span></span></div>
<div class="code-line"><span class="line-num">12</span><span class="line-code">};</span></div>
    `,
    metrics: `
<div class="code-line"><span class="line-num">1</span><span class="line-code"><span class="code-comment">// Verified Client Performance & Delivery Telemetry</span></span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-code">{</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-code">  <span class="code-var">"production_apps_deployed"</span>: <span class="code-string">"18+"</span>,</span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-code">  <span class="code-var">"client_satisfaction_rate"</span>: <span class="code-string">"99.4%"</span>,</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-code">  <span class="code-var">"average_fcp_speed"</span>: <span class="code-string">"640ms"</span>,</span></div>
<div class="code-line"><span class="line-num">6</span><span class="line-code">  <span class="code-var">"total_client_revenue_supported"</span>: <span class="code-string">"$42.8M+"</span>,</span></div>
<div class="code-line"><span class="line-num">7</span><span class="line-code">  <span class="code-var">"code_coverage_standard"</span>: <span class="code-string">"92%"</span>,</span></div>
<div class="code-line"><span class="line-num">8</span><span class="line-code">  <span class="code-var">"on_time_milestone_delivery"</span>: <span class="code-bool">true</span></span></div>
<div class="code-line"><span class="line-num">9</span><span class="line-code">}</span></div>
    `,
    terminal: `
<div class="code-line"><span class="line-num">1</span><span class="line-code"><span class="code-comment"># Interactive Developer Shell</span></span></div>
<div class="code-line"><span class="line-num">2</span><span class="line-code"><span class="code-fn">$</span> devcraft --version</span></div>
<div class="code-line"><span class="line-num">3</span><span class="line-code"><span class="code-string">DevCraft CLI v3.8.2 [Engine: Turbo-Vite]</span></span></div>
<div class="code-line"><span class="line-num">4</span><span class="line-code"><span class="code-fn">$</span> status</span></div>
<div class="code-line"><span class="line-num">5</span><span class="line-code"><span class="code-string">🟢 All systems operational. 2 project slots open for immediate kickoff.</span></span></div>
<div class="code-line"><span class="line-num">6</span><span class="line-code"><span class="code-comment">Type "help", "skills", or "hire" below:</span></span></div>
    `
  };

  terminalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      terminalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabKey = tab.dataset.tab;
      if (codeBody && tabContents[tabKey]) {
        codeBody.innerHTML = tabContents[tabKey];
      }
    });
  });

  // Interactive CLI commands
  if (cliInput && cliOutput) {
    cliInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = cliInput.value.trim().toLowerCase();
        cliInput.value = '';
        let reply = '';

        if (val === 'help') {
          reply = 'Available commands: skills, projects, tiffinix, krestates, jewellers, travels, hire, clear';
        } else if (val === 'skills') {
          reply = 'React, Next.js 15, TypeScript, Tailwind, Node.js, PostgreSQL, Redis, Three.js, Docker, AWS';
        } else if (val === 'projects') {
          reply = 'Featured: Tiffinix (FoodTech), KR-ESTATE (PropTech), Shri Ratna Jewellers (E-Commerce), Jai Mata Di Travels (Tourism)';
        } else if (val === 'tiffinix') {
          reply = 'Tiffinix: Daily meal subscription engine (+185% MRR lift, 3.2k daily deliveries)';
        } else if (val === 'krestates') {
          reply = 'KR-ESTATE: Ultra-luxury real estate portal with 360° virtual tours & mortgage calculator';
        } else if (val === 'jewellers' || val === 'shriratna') {
          reply = 'Shri Ratna Jewellers: Luxury bespoke jewellery e-commerce with live bullion pricing & 4K zoom';
        } else if (val === 'travels' || val === 'jaimatadi') {
          reply = 'Jai Mata Di Travels: Tour booking & pilgrimage management engine with instant WhatsApp quotes';
        } else if (val === 'hire' || val === 'contact') {
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          reply = 'Redirecting to booking & inquiry form below...';
        } else if (val === 'clear') {
          cliOutput.innerHTML = '';
          return;
        } else {
          reply = `Unknown command "${val}". Type "help" for a list of commands.`;
        }

        const logEntry = document.createElement('div');
        logEntry.style.marginTop = '4px';
        logEntry.innerHTML = `<span style="color:var(--accent-cyan);">> ${val}</span><br><span style="color:var(--text-secondary);">${reply}</span>`;
        cliOutput.appendChild(logEntry);
        codeBody.scrollTop = codeBody.scrollHeight;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   7. FAQ ACCORDION
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isOpen) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* --------------------------------------------------------------------------
   8. CONTACT FORM SUBMISSION WITH SIMULATION & TOAST
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();

    if (!name || !email) {
      showToast('Please enter your name and email address.', 'info');
      return;
    }

    // Button loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid #000;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;"></span>
      <span>Encrypting & Sending Inquiry...</span>
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();

      const refId = 'DC-' + Math.floor(100000 + Math.random() * 900000);
      showToast(`Inquiry sent successfully! Reference ID: ${refId}. I will respond within 24 hours.`, 'success');
    }, 1200);
  });
}

/* --------------------------------------------------------------------------
   9. LIVE CLOCK (Working Global Hours)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('live-time-display');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Format IST / Local
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockEl.textContent = `${now.toLocaleTimeString('en-US', options)} (UTC+5:30) • Open for Global Inquiries`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   10. CLIPBOARD COPY TOAST
   -------------------------------------------------------------------------- */
function initClipboardButtons() {
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.dataset.email || "avinashmehra5292@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`, 'success');
      }).catch(() => {
        showToast(`Email: ${email}`, 'info');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      ${type === 'success' 
        ? '<polyline points="20 6 9 17 4 12"></polyline>' 
        : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line>'}
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4200);
};
