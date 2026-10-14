/**
 * DEVCRAFT - INTERACTIVE SCOPE & COST ESTIMATOR
 * Empowers potential clients to estimate budget, turnaround, and tech stack in real time.
 */

document.addEventListener('DOMContentLoaded', () => {
  const estimatorForm = document.getElementById('project-estimator');
  if (!estimatorForm) return;

  const baseConfigs = {
    landing: {
      title: "High-Converting Landing Page",
      basePrice: 1200,
      baseWeeks: 1.5,
      stack: "HTML5/CSS3, TypeScript or Next.js, Framer Motion, SEO Meta",
      features: ["Custom Responsive Design", "Lead Capture Form", "Speed & SEO Setup"]
    },
    webapp: {
      title: "Full-Stack Custom Web App",
      basePrice: 3200,
      baseWeeks: 4,
      stack: "Next.js 15 / React, Node.js, PostgreSQL / Prisma, Tailwind",
      features: ["Custom Component Architecture", "REST / GraphQL API", "Database Modeling"]
    },
    ecommerce: {
      title: "E-Commerce / FoodTech Platform",
      basePrice: 3800,
      baseWeeks: 5,
      stack: "Next.js, Node.js, Stripe Subscriptions, Redis, PostgreSQL",
      features: ["Product / Menu Catalog", "Cart & Real-Time Checkout", "Order Management"]
    },
    saas: {
      title: "SaaS MVP / Analytics Dashboard",
      basePrice: 4800,
      baseWeeks: 6,
      stack: "React / Next.js, Golang / Node, Timescale / Postgres, Docker",
      features: ["Multi-tenant Architecture", "Interactive Charts & Telemetry", "Role-Based Access"]
    }
  };

  const featureAddons = {
    ui_motion: { price: 650, weeks: 0.5, label: "Bespoke UI/UX & Micro-interactions" },
    auth_roles: { price: 500, weeks: 0.5, label: "User Authentication & RBAC Roles" },
    payments: { price: 800, weeks: 1.0, label: "Stripe Checkout & Recurring Billing" },
    cms_admin: { price: 950, weeks: 1.0, label: "Admin Back-Office & CMS Control" },
    ai_api: { price: 900, weeks: 0.8, label: "AI Integration & Third-Party APIs" },
    seo_speed: { price: 450, weeks: 0.4, label: "Core Web Vitals 95+ & Semantic SEO" }
  };

  const speedMultipliers = {
    standard: { priceMult: 1.0, timeMult: 1.0, label: "Standard Pace" },
    accelerated: { priceMult: 1.25, timeMult: 0.7, label: "Accelerated Sprint" },
    express: { priceMult: 1.5, timeMult: 0.5, label: "Dedicated Rush Delivery" }
  };

  let currentType = 'webapp';
  let currentSpeed = 'standard';
  let selectedFeatures = new Set(['ui_motion', 'auth_roles', 'seo_speed']);

  // Elements
  const typePills = document.querySelectorAll('.scope-pill');
  const speedPills = document.querySelectorAll('.speed-pill');
  const featureCheckboxes = document.querySelectorAll('.feature-check-input');
  const priceDisplay = document.getElementById('calc-price-display');
  const timelineDisplay = document.getElementById('calc-timeline-display');
  const stackDisplay = document.getElementById('calc-stack-display');
  const deliverablesList = document.getElementById('calc-deliverables-list');
  const lockScopeBtn = document.getElementById('lock-scope-btn');

  // Handle Type Pill Selection
  typePills.forEach(pill => {
    pill.addEventListener('click', () => {
      typePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      currentType = pill.dataset.type || 'webapp';
      recalculateEstimate();
    });
  });

  // Handle Speed Pill Selection
  speedPills.forEach(pill => {
    pill.addEventListener('click', () => {
      speedPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      currentSpeed = pill.dataset.speed || 'standard';
      recalculateEstimate();
    });
  });

  // Handle Feature Checkbox Change
  featureCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      const feat = e.target.value;
      if (e.target.checked) {
        selectedFeatures.add(feat);
      } else {
        selectedFeatures.delete(feat);
      }
      recalculateEstimate();
    });
  });

  function recalculateEstimate() {
    const base = baseConfigs[currentType] || baseConfigs.webapp;
    const speed = speedMultipliers[currentSpeed] || speedMultipliers.standard;

    let subtotal = base.basePrice;
    let weeksTotal = base.baseWeeks;
    const activeDeliverables = [...base.features];

    selectedFeatures.forEach(featKey => {
      if (featureAddons[featKey]) {
        subtotal += featureAddons[featKey].price;
        weeksTotal += featureAddons[featKey].weeks;
        activeDeliverables.push(featureAddons[featKey].label);
      }
    });

    const finalPriceMin = Math.round((subtotal * speed.priceMult) / 50) * 50;
    const finalPriceMax = Math.round((finalPriceMin * 1.2) / 50) * 50;
    const finalWeeks = Math.max(1, Math.round(weeksTotal * speed.timeMult * 10) / 10);

    // Update UI Displays
    if (priceDisplay) {
      priceDisplay.textContent = `$${finalPriceMin.toLocaleString()} - $${finalPriceMax.toLocaleString()}`;
    }

    if (timelineDisplay) {
      const weeksInt = Math.ceil(finalWeeks);
      timelineDisplay.textContent = weeksInt <= 1 ? "1 - 2 Weeks" : `${weeksInt - 1} - ${weeksInt + 1} Weeks`;
    }

    if (stackDisplay) {
      stackDisplay.textContent = base.stack;
    }

    if (deliverablesList) {
      deliverablesList.innerHTML = activeDeliverables.map(item => `
        <li>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${item}</span>
        </li>
      `).join('');
    }

    return {
      typeTitle: base.title,
      priceRange: `$${finalPriceMin.toLocaleString()} - $${finalPriceMax.toLocaleString()}`,
      timeline: timelineDisplay ? timelineDisplay.textContent : '3-4 Weeks',
      deliverables: activeDeliverables
    };
  }

  // Hook "Lock In Scope" to smooth scroll to contact form and pre-fill details
  if (lockScopeBtn) {
    lockScopeBtn.addEventListener('click', () => {
      const estimate = recalculateEstimate();
      const contactSection = document.getElementById('contact');
      const projectTypeSelect = document.getElementById('contact-project-type');
      const budgetSelect = document.getElementById('contact-budget');
      const messageTextarea = document.getElementById('contact-message');

      if (projectTypeSelect) {
        // match type
        if (currentType === 'landing') projectTypeSelect.value = 'Landing Page';
        else if (currentType === 'webapp') projectTypeSelect.value = 'Full-Stack Web App';
        else if (currentType === 'ecommerce') projectTypeSelect.value = 'E-Commerce / FoodTech';
        else if (currentType === 'saas') projectTypeSelect.value = 'SaaS / MVP Development';
      }

      if (budgetSelect) {
        // pick closest budget tier
        budgetSelect.value = estimate.priceRange;
      }

      if (messageTextarea) {
        const scopeSummary = `Hi! I configured my project scope using your online estimator:\n- Project Type: ${estimate.typeTitle}\n- Estimated Budget: ${estimate.priceRange}\n- Target Timeline: ${estimate.timeline}\n- Key Deliverables Included:\n  ${estimate.deliverables.slice(0, 4).map(d => `• ${d}`).join('\n  ')}\n\nI'd like to discuss bringing this to life with you!`;
        messageTextarea.value = scopeSummary;
      }

      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (typeof window.showToast === 'function') {
        window.showToast('Project scope locked & loaded into contact form! Fill in your email to proceed.', 'success');
      }
    });
  }

  // Initial calculation
  recalculateEstimate();
});
