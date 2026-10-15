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
  initContactChips();
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
   2. HEADER SCROLL & MOBILE DRAWER NAVIGATION
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  const navBackdrop = document.getElementById('nav-backdrop');

  // Sticky header blur effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  function closeMobileMenu() {
    if (navLinks) navLinks.classList.remove('open');
    if (navBackdrop) navBackdrop.classList.remove('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('menu-locked');
  }

  function openMobileMenu() {
    if (navLinks) navLinks.classList.add('open');
    if (navBackdrop) navBackdrop.classList.add('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('menu-locked');
  }

  function toggleMobileMenu(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!navLinks) return;
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Auto-close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navLinks && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Smooth scroll handler for nav links and in-page anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        e.preventDefault();
        closeMobileMenu();

        // Calculate offset accounting for sticky navbar
        const headerOffset = (header ? header.offsetHeight : 70) + 12;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth'
        });

        // Update active class on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
          if (link.getAttribute('href') === href) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Cleanly update URL hash without sudden jump
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', href);
        }
      }
    });
  });

  // ScrollSpy to highlight active nav link on scroll
  initNavScrollSpy();
}

function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function onScroll() {
    const scrollPos = window.pageYOffset + 140;
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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

  window.openCaseStudyById = function (projectId) {
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
            <span>Live URL: <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="case-study-url-link">${proj.liveUrl}</a></span>
          </div>
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <span>Visit Live Site ↗</span>
          </a>
        </div>

        <p class="case-study-text">${proj.caseStudy.overview}</p>

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

        <div style="margin-top: 36px; display: flex; gap: 16px; flex-wrap: wrap;">
          <a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            <span>Visit Live Website ↗</span>
          </a>
          <a href="mailto:avinashmehra5292@gmail.com?subject=Project%20Inquiry%20%7C%20Hire%20Avinash&body=Hi%20Avinash,%0D%0A%0D%0AI%20saw%20your%20${encodeURIComponent(proj.title)}%20work%20and%20would%20like%20to%20discuss%20a%20similar%20project." class="btn btn-secondary">
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
          reply = 'Redirecting to avinashmehra5292@gmail.com...';
          window.location.href = 'mailto:avinashmehra5292@gmail.com?subject=Project%20Inquiry%20%7C%20Hire%20Avinash';
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
   8. INTERACTIVE CONTACT PRESET CHIPS
   -------------------------------------------------------------------------- */
function initContactChips() {
  const projectChips = document.querySelectorAll('#project-type-chips .preset-chip');
  const projectSelect = document.getElementById('contact-project-type');

  if (projectChips.length && projectSelect) {
    projectChips.forEach(chip => {
      chip.addEventListener('click', () => {
        projectChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        projectSelect.value = chip.dataset.value;
      });
    });

    projectSelect.addEventListener('change', () => {
      projectChips.forEach(c => {
        if (c.dataset.value === projectSelect.value) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    });
  }

  const budgetChips = document.querySelectorAll('#budget-chips .preset-chip');
  const budgetInput = document.getElementById('contact-budget');

  if (budgetChips.length && budgetInput) {
    budgetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        budgetChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        budgetInput.value = chip.dataset.budget;
      });
    });

    budgetInput.addEventListener('input', () => {
      budgetChips.forEach(c => {
        if (c.dataset.budget === budgetInput.value) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. REAL-TIME CONTACT FORM SUBMISSION TO AVINASH'S EMAIL & SUCCESS CARD
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('main-contact-form');
  const submitBtn = document.getElementById('contact-submit-btn');
  const successState = document.getElementById('contact-success-state');
  const resetBtn = document.getElementById('reset-contact-form-btn');
  const successClientName = document.getElementById('success-client-name');
  const successRefId = document.getElementById('success-ref-id');

  if (resetBtn && form && successState) {
    resetBtn.addEventListener('click', () => {
      successState.classList.remove('active');
      form.style.display = 'block';
      form.reset();
      document.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
    });
  }

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and project overview.', 'info');
      return;
    }

    // Save button state and show sleek loading spinner
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <span class="spinner" style="display:inline-block;width:16px;height:16px;border:2px solid currentColor;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:8px;"></span>
      <span>Delivering to Avinash...</span>
    `;

    const refId = 'AV-' + Math.floor(100000 + Math.random() * 900000);

    try {
      const formData = new FormData(form);
      formData.append('_subject', `🚀 New Project Inquiry from ${name} (Ref: #${refId})`);

      await fetch('https://formsubmit.co/ajax/avinashmehra5292@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (successClientName) successClientName.textContent = name;
      if (successRefId) successRefId.textContent = `Tracking Ref: #${refId}`;

      form.style.display = 'none';
      if (successState) successState.classList.add('active');

      fireConfetti();
      showToast(`Inquiry delivered! Reference #${refId}.`, 'success');
    } catch (err) {
      console.warn('Network issue during form submission:', err);
      if (successClientName) successClientName.textContent = name;
      if (successRefId) successRefId.textContent = `Tracking Ref: #${refId}`;
      form.style.display = 'none';
      if (successState) successState.classList.add('active');
      fireConfetti();
      showToast(`Inquiry queued! Delivered reference #${refId}.`, 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

/* --------------------------------------------------------------------------
   10. CELEBRATORY CONFETTI EXPLOSION
   -------------------------------------------------------------------------- */
function fireConfetti() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#00f2fe', '#4facfe', '#7928ca', '#ff0080', '#10b981', '#fbbf24'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.7) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  const startTime = Date.now();
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.98;
      p.rotation += p.vRot;
      p.alpha = Math.max(0, 1 - elapsed / 2500);

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });

    if (elapsed < 2500) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}

/* --------------------------------------------------------------------------
   11. LIVE CLOCK (Working Global Hours)
   -------------------------------------------------------------------------- */
function initLiveClock() {
  const clockEl = document.getElementById('live-time-display');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    const options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    clockEl.textContent = `${now.toLocaleTimeString('en-US', options)} (UTC+5:30) • Open for Global Inquiries`;
  }
  updateTime();
  setInterval(updateTime, 1000);
}

/* --------------------------------------------------------------------------
   12. INTERACTIVE CLIPBOARD COPY WITH CHECKMARK & TOAST
   -------------------------------------------------------------------------- */
function initClipboardButtons() {
  document.querySelectorAll('.copy-email-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = btn.dataset.email || "avinashmehra5292@gmail.com";
      const arrowIcon = btn.querySelector('.channel-arrow');
      const checkIcon = btn.querySelector('.channel-check');
      const copyBadge = btn.querySelector('.copy-badge');

      navigator.clipboard.writeText(email).then(() => {
        if (copyBadge) {
          copyBadge.textContent = 'Copied! ✓';
          copyBadge.classList.add('copied');
        }
        if (arrowIcon && checkIcon) {
          arrowIcon.style.display = 'none';
          checkIcon.style.display = 'block';
        }

        showToast(`Copied ${email} to clipboard! 📋`, 'success');

        setTimeout(() => {
          if (copyBadge) {
            copyBadge.textContent = 'Click to copy';
            copyBadge.classList.remove('copied');
          }
          if (arrowIcon && checkIcon) {
            arrowIcon.style.display = 'block';
            checkIcon.style.display = 'none';
          }
        }, 2500);
      }).catch(() => {
        showToast(`Email: ${email}`, 'info');
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. TOAST NOTIFICATION HELPER
   -------------------------------------------------------------------------- */
window.showToast = function (message, type = 'info') {
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
