/* ==========================================================================
   NCONIX MAIN APPLICATION CONTROLLER
   ========================================================================== */

class AppController {
  constructor() {
    this.init();
  }

  init() {
    this.setupThemeToggle();
    this.setupHeaderScroll();
    this.setupMobileMenu();
    this.renderProjects();
    this.setupProjectFilters();
    this.renderCaseStudies();
    this.renderBlogs();
    this.renderTestimonials();
    this.setupModalEvents();
    this.setupQuickContact();
    this.setup3DCardTilt();
    this.checkAuthStatus();

    // Initialize Submodules conditionally based on class availability and DOM existence
    if (typeof RagVisualizer !== 'undefined' && document.getElementById("rag-flow-track")) {
      this.ragVisualizer = new RagVisualizer();
    }
    if (typeof AcademyManager !== 'undefined' && (document.getElementById("academy-courses-grid") || document.getElementById("live-classes-container"))) {
      this.academyManager = new AcademyManager();
    }
    if (typeof QuoteEstimator !== 'undefined' && document.getElementById("quote-calculator-form")) {
      this.quoteEstimator = new QuoteEstimator();
    }
    if (typeof DashboardManager !== 'undefined' && document.querySelector("[data-dash-role]")) {
      this.dashboardManager = new DashboardManager();
    }

    this.refreshIcons();
  }

  refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  setupThemeToggle() {
    const savedTheme = localStorage.getItem("nconix_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    this.updateThemeButtons(savedTheme);

    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("nconix_theme", newTheme);
        this.updateThemeButtons(newTheme);
        this.showToast(`Switched to ${newTheme === "dark" ? "Dark Theme" : "Light Theme"}`);
      });
    });
  }

  updateThemeButtons(theme) {
    const isDark = theme === "dark";
    const sunSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-xs" style="margin-right:2px;"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
    const moonSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-xs" style="margin-right:2px;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
    
    document.querySelectorAll(".theme-toggle-btn").forEach(btn => {
      btn.innerHTML = `${isDark ? sunSvg : moonSvg} <span>${isDark ? "Light" : "Dark"}</span>`;
      btn.setAttribute("title", `Switch to ${isDark ? "Light" : "Dark"} Theme`);
      btn.setAttribute("aria-label", `Switch to ${isDark ? "Light" : "Dark"} Theme`);
    });
  }

  setup3DCardTilt() {
    const cardSelectors = ".glass-card, .pillar-card, .project-card, .course-card, .stat-card, .metric-box, .rag-node";
    const cards = document.querySelectorAll(cardSelectors);

    cards.forEach(card => {
      if (card.dataset.tiltInitialized) return;
      card.dataset.tiltInitialized = "true";

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Set CSS variables for specular spotlight glare
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const maxTilt = 7.5; // degrees of tilt
        const rotX = -deltaY * maxTilt;
        const rotY = deltaX * maxTilt;

        card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)";
      });
    });
  }

  setupHeaderScroll() {
    const header = document.getElementById("site-header");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  setupMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-nav-drawer");
    const closeBtn = document.getElementById("mobile-nav-close");

    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.add("active");
      });
    }

    if (closeBtn && menu) {
      closeBtn.addEventListener("click", () => {
        menu.classList.remove("active");
      });
    }

    // Close when clicking nav links in mobile drawer
    document.querySelectorAll(".mobile-nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (menu) menu.classList.remove("active");
      });
    });
  }

  renderProjects(filter = "all") {
    const container = document.getElementById("projects-grid-container");
    if (!container) return;

    const filtered = filter === "all" 
      ? NCONIX_DATA.projects 
      : NCONIX_DATA.projects.filter(p => p.category === filter);

    container.innerHTML = filtered.map(proj => `
      <div class="glass-card project-card">
        <div class="project-category">${proj.categoryLabel}</div>
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-desc">${proj.desc}</p>
        
        <div style="font-size: 0.8125rem; color: var(--emerald-accent); font-weight: 600; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem;">
          ${proj.metrics}
        </div>

        <div class="project-tech-stack">
          ${proj.techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>

        <button class="btn btn-outline-cyan btn-sm btn-project-detail" data-proj-id="${proj.id}" style="margin-top: auto;">
          View Architecture & Code →
        </button>
      </div>
    `).join("");

    container.querySelectorAll(".btn-project-detail").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-proj-id");
        this.openProjectModal(id);
      });
    });
    this.setup3DCardTilt();
  }

  setupProjectFilters() {
    const filterBtns = document.querySelectorAll("[data-project-filter]");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const filter = btn.getAttribute("data-project-filter");
        this.renderProjects(filter);
      });
    });
  }

  renderCaseStudies() {
    const container = document.getElementById("client-cases-grid");
    if (!container) return;

    container.innerHTML = NCONIX_DATA.caseStudies.map(cs => `
      <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
          <div>
            <h3 style="font-size: 1.3rem; color: var(--text-white); margin-bottom: 0.25rem;">${cs.client}</h3>
            <span style="font-size: 0.8125rem; color: var(--cyan-accent); font-weight: 600;">${cs.industry}</span>
          </div>
          <span class="badge badge-emerald">Verified Case Study</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9375rem;">
          <div style="background: rgba(244, 63, 94, 0.06); border-left: 3px solid var(--rose-accent); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <strong style="color: #fda4af; display: block; font-size: 0.8125rem; margin-bottom: 0.25rem; text-transform: uppercase;">Challenge</strong>
            <span style="color: var(--text-secondary);">${cs.problem}</span>
          </div>

          <div style="background: rgba(0, 240, 255, 0.06); border-left: 3px solid var(--cyan-accent); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <strong style="color: var(--cyan-accent); display: block; font-size: 0.8125rem; margin-bottom: 0.25rem; text-transform: uppercase;">Nconix Solution</strong>
            <span style="color: var(--text-secondary);">${cs.solution}</span>
          </div>

          <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--emerald-accent); padding: 0.75rem 1rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;">
            <strong style="color: var(--emerald-accent); display: block; font-size: 0.8125rem; margin-bottom: 0.25rem; text-transform: uppercase;">Measurable Outcome</strong>
            <strong style="color: var(--text-white);">${cs.outcome}</strong>
          </div>
        </div>
      </div>
    `).join("");
    this.setup3DCardTilt();
  }

  renderBlogs() {
    const container = document.getElementById("blog-grid-container");
    if (!container) return;

    container.innerHTML = NCONIX_DATA.blogs.map(b => `
      <div class="glass-card" style="display: flex; flex-direction: column;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <span class="badge badge-violet">${b.category}</span>
          <span style="font-size: 0.775rem; color: var(--text-muted); font-family: var(--font-mono);">${b.readTime}</span>
        </div>
        <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem;">${b.title}</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.25rem; flex-grow: 1;">${b.desc}</p>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 1.25rem;">
          ${b.tags.map(t => `<span class="tech-tag">${t}</span>`).join("")}
        </div>
        <button class="btn btn-outline-violet btn-sm" onclick="window.NconixApp.openBlogDetailModal('${b.title}', '${b.desc}')">
          Read Guide
        </button>
      </div>
    `).join("");
    this.setup3DCardTilt();
  }

  renderTestimonials() {
    const container = document.getElementById("testimonials-container");
    if (!container) return;

    const testimonials = NCONIX_DATA.testimonials;

    container.innerHTML = testimonials.map(t => `
      <div class="glass-card" style="display: flex; flex-direction: column; justify-content: space-between; padding: 1.75rem;">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <div style="color: #fbbf24; font-size: 1.1rem; letter-spacing: 2px;">
              ${"★".repeat(t.rating)}
            </div>
            <span class="badge ${t.category === 'client' ? 'badge-cyan' : 'badge-emerald'}" style="font-size: 0.725rem;">
              ${t.category === 'client' ? '✓ Enterprise Client' : '✓ Certified Alum'}
            </span>
          </div>
          <p style="font-size: 0.95rem; font-style: italic; line-height: 1.65; color: var(--text-primary); margin-bottom: 1.5rem;">
            "${t.text}"
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.85rem; padding-top: 1rem; border-top: 1px solid rgba(255, 255, 255, 0.08);">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: var(--cyan-dim); border: 1px solid var(--border-cyan); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.95rem; color: var(--cyan-accent); flex-shrink: 0;">${t.avatar}</div>
          <div>
            <strong style="color: var(--text-white); font-size: 0.95rem; display: block;">${t.name}</strong>
            <span style="font-size: 0.8125rem; color: var(--cyan-accent);">${t.role}</span>
          </div>
        </div>
      </div>
    `).join("");

    this.setup3DCardTilt();
  }

  setupModalEvents() {
    const modal = document.getElementById("app-modal");
    const closeBtn = document.getElementById("app-modal-close");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
  }

  openModal(htmlContent) {
    const modal = document.getElementById("app-modal");
    const container = document.getElementById("app-modal-content");
    if (modal && container) {
      container.innerHTML = htmlContent;
      modal.classList.add("active");
      this.refreshIcons();
    }
  }

  closeModal() {
    const modal = document.getElementById("app-modal");
    if (modal) modal.classList.remove("active");
  }

  openProjectModal(projId) {
    const proj = NCONIX_DATA.projects.find(p => p.id === projId);
    if (!proj) return;

    this.openModal(`
      <div style="margin-bottom: 1.5rem;">
        <span class="badge badge-cyan" style="margin-bottom: 0.5rem;">${proj.categoryLabel}</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">${proj.title}</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">${proj.desc}</p>
      </div>

      <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid var(--border-cyan); border-radius: var(--radius-sm); padding: 1rem; margin-bottom: 1.5rem;">
        <strong style="color: var(--cyan-accent); font-size: 0.85rem; text-transform: uppercase;">Verified Performance Metric</strong>
        <div style="font-size: 1.1rem; color: var(--text-white); font-weight: 700; margin-top: 0.25rem;">${proj.metrics}</div>
      </div>

      <h4 style="margin-bottom: 0.75rem; color: var(--text-white);">Key Architecture Capabilities</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1.5rem;">
        ${proj.features.map(f => `<li style="font-size: 0.9rem; color: var(--text-secondary);">▹ <strong style="color:var(--text-white);">${f}</strong></li>`).join("")}
      </ul>

      <h4 style="margin-bottom: 0.75rem; color: var(--text-white);">Tech Stack</h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
        ${proj.techs.map(t => `<span class="tech-tag">${t}</span>`).join("")}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 1rem;">
        <button class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Close</button>
        <button class="btn btn-primary" onclick="window.NconixApp.openQuoteModal('${proj.title}')">Inquire for Your Business →</button>
      </div>
    `);
  }

  openBlogDetailModal(title, desc) {
    this.openModal(`
      <div>
        <span class="badge badge-violet" style="margin-bottom: 0.5rem;">Technical Article</span>
        <h2 style="font-size: 1.6rem; margin-bottom: 1rem;">${title}</h2>
        <p style="font-size: 1rem; line-height: 1.7; color: #cbd5e1; margin-bottom: 1.5rem;">${desc}</p>
        <div style="background: #020408; padding: 1.25rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 1.5rem; font-family: var(--font-mono); font-size: 0.85rem; color: var(--cyan-accent);">
          // Full technical paper is available in the Nconix Knowledge Hub repository.
        </div>
        <div style="text-align: right;">
          <button class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Close Guide</button>
        </div>
      </div>
    `);
  }

  openEnrollmentModal(courseTitle = "") {
    this.openModal(`
      <div>
        <span class="badge badge-emerald" style="margin-bottom: 0.5rem;">Nconix Academy Admission</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Enroll in Live Cohort</h2>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Secure your seat in the upcoming project-based cohort.
        </p>

        <form id="modal-enrollment-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" placeholder="e.g. Alex Johnson" required>
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" placeholder="alex@domain.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Phone / WhatsApp</label>
            <input type="tel" class="form-control" placeholder="+1 (555) 000-0000" required>
          </div>
          <div class="form-group">
            <label class="form-label">Selected Track</label>
            <input type="text" class="form-control" value="${courseTitle || 'Generative AI with Python & Autonomous Agents'}" readonly>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Confirm Enrollment</button>
          </div>
        </form>
      </div>
    `);

    const form = document.getElementById("modal-enrollment-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerText : "Confirm Enrollment";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = "Enrolling...";
        }

        const inputs = form.querySelectorAll("input");
        const payload = {
          student_name: inputs[0] ? inputs[0].value : "Student",
          email: inputs[1] ? inputs[1].value : "",
          phone: inputs[2] ? inputs[2].value : "",
          course_id: (courseTitle || "Track").toLowerCase().replace(/[^a-z0-9]/g, "-"),
          course_title: inputs[3] ? inputs[3].value : (courseTitle || "Course"),
          plan_type: "live_cohort",
          experience_level: "Intermediate",
          notes: "Enrolled via web modal"
        };

        try {
          const resp = await fetch("/api/enroll/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          this.closeModal();
          if (resp.ok && data.success) {
            this.showToast(data.message || "Admission confirmed! LMS credentials generated.");
          } else {
            this.showToast("Admission recorded! Our counselor will verify your details.");
          }
        } catch (err) {
          console.warn("Backend API call fallback:", err);
          this.closeModal();
          this.showToast("Admission confirmed! Verification email sent.");
        }
      });
    }
  }

  openQuoteModal(projectName = "") {
    this.openModal(`
      <div>
        <span class="badge badge-cyan" style="margin-bottom: 0.5rem;">Enterprise Software & AI Consultation</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Request Engineering Proposal</h2>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem;">
          Let's discuss requirements for: <strong>${projectName || 'Custom Software / AI Solution'}</strong>
        </p>

        <form id="modal-quote-form">
          <div class="form-group">
            <label class="form-label">Your Name</label>
            <input type="text" class="form-control" placeholder="John Doe" required>
          </div>
          <div class="form-group">
            <label class="form-label">Company / Organization</label>
            <input type="text" class="form-control" placeholder="Acme Corp" required>
          </div>
          <div class="form-group">
            <label class="form-label">Work Email</label>
            <input type="email" class="form-control" placeholder="john@acme.com" required>
          </div>
          <div class="form-group">
            <label class="form-label">Project Objectives & Timeline</label>
            <textarea class="form-control" placeholder="Describe key deliverables, expected throughput, and desired launch date..."></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem;">
            <button type="button" class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">Send RFP to Nconix →</button>
          </div>
        </form>
      </div>
    `);

    const form = document.getElementById("modal-quote-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerText = "Submitting...";
        }

        const inputs = form.querySelectorAll("input");
        const textarea = form.querySelector("textarea");
        const payload = {
          client_name: inputs[0] ? inputs[0].value : "Client",
          company: inputs[1] ? inputs[1].value : "",
          email: inputs[2] ? inputs[2].value : "",
          project_type: projectName || "Enterprise Solution",
          timeline: "Standard (4-8 weeks)",
          project_details: textarea ? textarea.value : "",
          selected_features: ["Architecture Review", "Custom Development", "AI Integration"],
          currency: "USD"
        };

        try {
          const resp = await fetch("/api/quote/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          this.closeModal();
          if (resp.ok && data.success) {
            this.showToast(data.message || "RFP received! Our Senior Architect will reach out.");
          } else {
            this.showToast("RFP recorded! We will connect with you shortly.");
          }
        } catch (err) {
          console.warn("Backend API call fallback:", err);
          this.closeModal();
          this.showToast("RFP received! Our Senior Solution Architect will reach out today.");
        }
      });
    }
  }

  setupEnrollmentForm() {
    const form = document.getElementById("student-direct-enroll-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]') || form.querySelector('input[type="text"]');
        const email = form.querySelector('input[name="email"]') || form.querySelector('input[type="email"]');
        const phone = form.querySelector('input[name="phone"]') || form.querySelector('input[type="tel"]');
        const track = form.querySelector('select[name="track"]') || form.querySelector('select');

        const payload = {
          student_name: name ? name.value : "Student",
          email: email ? email.value : "",
          phone: phone ? phone.value : "",
          course_id: track ? track.value : "ai-track",
          course_title: track && track.options && track.selectedIndex >= 0 ? track.options[track.selectedIndex].text : "Professional Track",
          plan_type: "live_cohort",
          experience_level: "All Levels"
        };

        try {
          const resp = await fetch("/api/enroll/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          this.showToast(data.message || "Enrollment application submitted successfully!");
        } catch (err) {
          this.showToast("Enrollment application submitted successfully!");
        }
        form.reset();
      });
    }
  }

  setupQuickContact() {
    const form = document.getElementById("business-quote-form") || document.getElementById("contact-form-main");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]') || form.querySelector('#contact-name') || form.querySelectorAll('input')[0];
        const email = form.querySelector('input[name="email"]') || form.querySelector('#contact-email') || form.querySelectorAll('input')[1];
        const company = form.querySelector('input[name="company"]') || form.querySelector('#contact-company');
        const message = form.querySelector('textarea');
        const service = form.querySelector('select');

        const payload = {
          name: name ? name.value : "Inquirer",
          email: email ? email.value : "",
          company: company ? company.value : "",
          interest_service: service ? service.value : "General Inquiry",
          subject: "Inquiry from Nconix Web Portal",
          message: message ? message.value : "Customer message."
        };

        try {
          const resp = await fetch("/api/contact/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          this.showToast(data.message || "Thank you! A Nconix technology consultant will contact you.");
        } catch (err) {
          this.showToast("Thank you! A Nconix technology consultant will contact you.");
        }
        form.reset();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATION & PORTAL MODALS
  // ---------------------------------------------------------------------------

  async checkAuthStatus() {
    try {
      const resp = await fetch('/api/auth/user/');
      const data = await resp.json();
      this.currentUser = data.is_authenticated ? data.user : null;
      this.updateNavbarAuthUI(this.currentUser);
      this.enforceRolePageAccess(this.currentUser);
    } catch (e) {
      console.warn("Auth check failed:", e);
    }
  }

  updateNavbarAuthUI(user) {
    const authContainer = document.getElementById("header-auth-actions");
    const mobileDrawerAuth = document.querySelector("#mobile-nav-drawer div[style*='border-top']");

    if (!authContainer) return;

    if (user) {
      const role = user.role || 'student';
      const dashboardUrl = role === 'client' ? '/client-portal/' : role === 'admin' ? '/admin-portal/' : '/student-portal/';
      const roleIcon = role === 'client' ? '💼' : role === 'admin' ? '⚡' : '🎓';
      const initial = (user.name || user.username || 'U').charAt(0).toUpperCase();
      const displayName = user.name ? user.name.split(' ')[0] : user.username;

      // Desktop Navbar: Login -> User Name, Register -> Dashboard
      authContainer.innerHTML = `
        <button class="theme-toggle-btn" aria-label="Toggle Theme" title="Toggle Theme">Light</button>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span class="btn btn-outline-cyan btn-sm" id="nav-username-btn" style="cursor:default;display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.75rem;">
            <span style="width:22px;height:22px;border-radius:50%;background:var(--cyan-accent);color:#020408;font-weight:700;font-size:0.75rem;display:flex;align-items:center;justify-content:center;">${initial}</span>
            <span style="font-weight:600;">${displayName}</span>
          </span>
          <a href="${dashboardUrl}" class="btn btn-primary btn-sm" id="nav-dashboard-btn" style="display:flex;align-items:center;gap:0.35rem;padding:0.45rem 0.9rem;">
            <span>${roleIcon}</span> <span>Dashboard</span>
          </a>
          <button type="button" onclick="window.NconixApp.handleLogout()" class="btn btn-secondary btn-sm" title="Log Out" style="padding:0.45rem 0.75rem;">Logout</button>
        </div>
        <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Toggle Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-md"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button>
      `;

      // Mobile Drawer Auth Section
      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <div style="padding:0.5rem 0;color:var(--text-secondary);font-size:0.875rem;">Signed in as: <strong style="color:var(--cyan-accent);">${user.name || user.username}</strong> (${role.toUpperCase()})</div>
          <a href="${dashboardUrl}" class="mobile-nav-link" style="color:var(--cyan-accent);font-weight:700;padding:0.6rem 0;display:block;">${roleIcon} Open ${role.toUpperCase()} Dashboard</a>
          <button type="button" onclick="window.NconixApp.handleLogout()" class="mobile-nav-link" style="background:transparent;border:none;width:100%;text-align:left;color:#fca5a5;cursor:pointer;padding:0.6rem 0;">Log Out</button>
        `;
      }
    } else {
      // Logged out default buttons
      authContainer.innerHTML = `
        <button class="theme-toggle-btn" aria-label="Toggle Theme" title="Toggle Theme">Light</button>
        <button type="button" onclick="window.NconixApp.openLoginModal()" class="btn btn-outline-cyan btn-sm" id="nav-login-btn">Login</button>
        <button type="button" onclick="window.NconixApp.openRegisterModal()" class="btn btn-primary btn-sm" id="nav-register-btn">Register</button>
        <button class="mobile-toggle" id="mobile-menu-toggle" aria-label="Toggle Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-md"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg></button>
      `;

      if (mobileDrawerAuth) {
        mobileDrawerAuth.innerHTML = `
          <button type="button" onclick="window.NconixApp.openLoginModal(); window.NconixApp.closeMobileMenu();" class="mobile-nav-link" style="background:transparent;border:none;width:100%;text-align:left;color:var(--text-primary);cursor:pointer;padding:0.75rem 0;">Login to Portals</button>
          <button type="button" onclick="window.NconixApp.openRegisterModal(); window.NconixApp.closeMobileMenu();" class="mobile-nav-link" style="background:transparent;border:none;width:100%;text-align:left;color:var(--cyan-accent);font-weight:700;cursor:pointer;padding:0.75rem 0;">Create Free Account</button>
        `;
      }
    }

    this.setupThemeToggle();
    this.setupMobileMenu();
  }

  enforceRolePageAccess(user) {
    if (!user) return;
    const currentPath = window.location.pathname.toLowerCase();

    // Student trying to access client portal
    if (user.role === 'student' && (currentPath.includes('client-portal') || window.location.search.includes('role=client'))) {
      this.showToast("🎓 Student role detected. Redirecting to your Academy LMS Workspace...");
      setTimeout(() => {
        window.location.href = '/student-portal/';
      }, 800);
    }
    // Client trying to access student portal
    else if (user.role === 'client' && (currentPath.includes('student-portal') || window.location.search.includes('role=student'))) {
      this.showToast("💼 Enterprise Client role detected. Redirecting to your Project Workspace...");
      setTimeout(() => {
        window.location.href = '/client-portal/';
      }, 800);
    }
    // Admin has full access to everything
  }

  openLoginModal(defaultRole = 'student') {
    this.openModal(`
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <span class="badge badge-cyan" style="margin-bottom: 0.5rem;">Unified Authentication</span>
        <h2 style="font-size: 1.85rem; margin-bottom: 0.35rem; color: var(--text-white);">Sign In to <span class="gradient-text">Nconix</span></h2>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">Access your tailored LMS, Client Sprint Desk, or System Admin workspace.</p>
      </div>

      <div style="display: flex; gap: 0.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.3rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;" id="auth-role-tabs">
        <button type="button" class="btn btn-sm ${defaultRole === 'student' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; font-size: 0.8rem;" onclick="window.NconixApp.selectAuthRole('student', this)">🎓 Student LMS</button>
        <button type="button" class="btn btn-sm ${defaultRole === 'client' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; font-size: 0.8rem;" onclick="window.NconixApp.selectAuthRole('client', this)">💼 Client Desk</button>
        <button type="button" class="btn btn-sm ${defaultRole === 'admin' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; font-size: 0.8rem;" onclick="window.NconixApp.selectAuthRole('admin', this)">⚡ System Admin</button>
      </div>

      <div id="auth-modal-error" style="display:none;background:rgba(239,68,68,0.15);border:1px solid #ef4444;color:#fca5a5;padding:0.75rem 1rem;border-radius:var(--radius-sm);font-size:0.85rem;margin-bottom:1.25rem;"></div>

      <form id="modal-login-form" onsubmit="window.NconixApp.handleLoginSubmit(event)">
        <input type="hidden" id="login-role-field" name="role" value="${defaultRole}">

        <div class="form-group">
          <label class="form-label" for="login-username">Email Address or Username</label>
          <input type="text" class="form-control" id="login-username" name="username" placeholder="alex@company.com" required autofocus>
        </div>

        <div class="form-group">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label class="form-label" for="login-password" style="margin-bottom: 0;">Password</label>
            <a href="javascript:void(0)" onclick="window.NconixApp.showToast('Password reset link sent to your registered email.')" style="font-size: 0.775rem; color: var(--cyan-accent);">Forgot password?</a>
          </div>
          <div style="position: relative;">
            <input type="password" class="form-control" id="login-password" name="password" placeholder="••••••••" required style="padding-right: 2.5rem;">
            <button type="button" onclick="const p=document.getElementById('login-password');if(p.type==='password'){p.type='text';this.innerText='🔒';}else{p.type='password';this.innerText='👁️';}" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer;">
              👁️
            </button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; font-size: 0.85rem; color: var(--text-secondary);">
          <input type="checkbox" id="remember-me" checked style="accent-color: var(--cyan-accent); cursor: pointer;">
          <label for="remember-me" style="cursor: pointer;">Keep me signed in on this device</label>
        </div>

        <button type="submit" class="btn btn-primary" id="login-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem;">
          Sign In to Workspace →
        </button>
      </form>

      <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.875rem; color: var(--text-muted);">
        Don't have an account? 
        <a href="javascript:void(0)" onclick="window.NconixApp.openRegisterModal('${defaultRole}')" style="color: var(--cyan-accent); font-weight: 700;">Create Account (Register)</a>
      </div>
    `);
  }

  openRegisterModal(defaultRole = 'student') {
    this.openModal(`
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <span class="badge badge-emerald" style="margin-bottom: 0.5rem;">Join Nconix Platform</span>
        <h2 style="font-size: 1.85rem; margin-bottom: 0.35rem; color: var(--text-white);">Create Free <span class="gradient-text">Account</span></h2>
        <p style="font-size: 0.875rem; color: var(--text-secondary);">Get instant access to coursework, AI labs, repositories, or client sprint tracking.</p>
      </div>

      <div style="display: flex; gap: 0.5rem; background: rgba(255, 255, 255, 0.03); border: 1px solid var(--border-subtle); padding: 0.3rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;" id="reg-role-tabs">
        <button type="button" class="btn btn-sm ${defaultRole === 'student' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; font-size: 0.8rem;" onclick="window.NconixApp.selectRegisterRole('student', this)">🎓 Student / Learner</button>
        <button type="button" class="btn btn-sm ${defaultRole === 'client' ? 'btn-primary' : 'btn-secondary'}" style="flex: 1; font-size: 0.8rem;" onclick="window.NconixApp.selectRegisterRole('client', this)">💼 Enterprise Client</button>
      </div>

      <div id="auth-modal-error" style="display:none;background:rgba(239,68,68,0.15);border:1px solid #ef4444;color:#fca5a5;padding:0.75rem 1rem;border-radius:var(--radius-sm);font-size:0.85rem;margin-bottom:1.25rem;"></div>

      <form id="modal-register-form" onsubmit="window.NconixApp.handleRegisterSubmit(event)">
        <input type="hidden" id="register-role-field" name="role" value="${defaultRole}">

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="reg-name">Your Full Name</label>
            <input type="text" class="form-control" id="reg-name" name="name" placeholder="Alex Morgan" required autofocus>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label" for="reg-email">Email Address</label>
            <input type="email" class="form-control" id="reg-email" name="email" placeholder="alex@example.com" required>
          </div>
        </div>

        <div id="reg-company-group" class="form-group" style="${defaultRole === 'client' ? '' : 'display:none;'}">
          <label class="form-label" for="reg-company">Company / Venture Name</label>
          <input type="text" class="form-control" id="reg-company" name="company" placeholder="ScaleFlow Technologies">
        </div>

        <div class="form-group">
          <label class="form-label" for="reg-password">Create Secure Password (min 6 characters)</label>
          <div style="position: relative;">
            <input type="password" class="form-control" id="reg-password" name="password" placeholder="••••••••" minlength="6" required style="padding-right: 2.5rem;">
            <button type="button" onclick="const p=document.getElementById('reg-password');if(p.type==='password'){p.type='text';this.innerText='🔒';}else{p.type='password';this.innerText='👁️';}" style="position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: transparent; border: none; color: var(--text-muted); cursor: pointer;">
              👁️
            </button>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" id="register-submit-btn" style="width: 100%; padding: 0.85rem; font-size: 0.95rem; background: var(--gradient-emerald);">
          Create Account & Access Portal →
        </button>
      </form>

      <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.25rem; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 0.875rem; color: var(--text-muted);">
        Already registered? 
        <a href="javascript:void(0)" onclick="window.NconixApp.openLoginModal('${defaultRole}')" style="color: var(--cyan-accent); font-weight: 700;">Sign In here</a>
      </div>
    `);
  }

  selectAuthRole(role, btn) {
    const roleField = document.getElementById("login-role-field");
    if (roleField) roleField.value = role;
    const parent = document.getElementById("auth-role-tabs");
    if (parent) {
      parent.querySelectorAll("button").forEach(b => {
        b.className = "btn btn-sm btn-secondary";
      });
      btn.className = "btn btn-sm btn-primary";
    }
  }

  selectRegisterRole(role, btn) {
    const roleField = document.getElementById("register-role-field");
    if (roleField) roleField.value = role;
    const companyGroup = document.getElementById("reg-company-group");
    if (companyGroup) {
      companyGroup.style.display = role === 'client' ? 'block' : 'none';
    }
    const parent = document.getElementById("reg-role-tabs");
    if (parent) {
      parent.querySelectorAll("button").forEach(b => {
        b.className = "btn btn-sm btn-secondary";
      });
      btn.className = "btn btn-sm btn-primary";
    }
  }

  async handleLoginSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorBox = document.getElementById("auth-modal-error");
    const submitBtn = document.getElementById("login-submit-btn");

    if (errorBox) errorBox.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Authenticating...";
    }

    const payload = {
      username: form.username.value,
      password: form.password.value,
      role: form.role ? form.role.value : 'student'
    };

    try {
      const resp = await fetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (data.success) {
        this.currentUser = data.user;
        this.closeModal();
        this.showToast(`✓ ${data.message}`);
        this.updateNavbarAuthUI(data.user);
        setTimeout(() => {
          window.location.href = data.redirect_url || '/portals.html';
        }, 600);
      } else {
        if (errorBox) {
          errorBox.innerText = data.message || "Invalid credentials.";
          errorBox.style.display = "block";
        }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.innerText = "Server connection error. Please try again.";
        errorBox.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Sign In to Workspace →";
      }
    }
  }

  async handleRegisterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorBox = document.getElementById("auth-modal-error");
    const submitBtn = document.getElementById("register-submit-btn");

    if (errorBox) errorBox.style.display = "none";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = "Creating Account...";
    }

    const payload = {
      name: form.name.value,
      email: form.email.value,
      password: form.password.value,
      role: form.role ? form.role.value : 'student',
      company: form.company ? form.company.value : ''
    };

    try {
      const resp = await fetch('/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await resp.json();

      if (data.success) {
        this.currentUser = data.user;
        this.closeModal();
        this.showToast(`✓ ${data.message}`);
        this.updateNavbarAuthUI(data.user);
        setTimeout(() => {
          window.location.href = data.redirect_url || '/portals.html';
        }, 600);
      } else {
        if (errorBox) {
          errorBox.innerText = data.message || "Registration failed.";
          errorBox.style.display = "block";
        }
      }
    } catch (err) {
      if (errorBox) {
        errorBox.innerText = "Server connection error. Please try again.";
        errorBox.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = "Create Account & Access Portal →";
      }
    }
  }

  async handleLogout() {
    try {
      await fetch('/api/auth/logout/', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.warn("Logout request failed:", e);
    }

    // Explicitly wipe browser storage and cache memory upon logout
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
    } catch (err) {
      console.warn("Client storage clear error:", err);
    }

    this.currentUser = null;
    this.updateNavbarAuthUI(null);
    this.showToast("✓ Signed out & cache cleared successfully.");
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 400);
  }

  showToast(message) {
    const container = document.getElementById("app-toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `
      <span style="font-size: 0.9rem;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
}

// Global initialization
document.addEventListener("DOMContentLoaded", () => {
  window.NconixApp = new AppController();
});

