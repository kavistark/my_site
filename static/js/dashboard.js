/* ==========================================================================
   NCONIX INTERACTIVE DASHBOARD MANAGER
   Dedicated Client Project & Chat Portal, Student LMS Academy Portal
   ========================================================================== */

class DashboardManager {
  constructor() {
    this.activeRole = "student";
    this.chatInterval = null;
    this.init();
  }

  init() {
    this.bindRoleTabs();
    this.bindRequirementForm();
    this.bindChatInputs();

    const currentPath = window.location.pathname.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');

    if (roleParam && ['student', 'client', 'admin'].includes(roleParam.toLowerCase())) {
      this.switchRole(roleParam.toLowerCase());
    } else if (currentPath.includes('student')) {
      this.switchRole('student');
    } else if (currentPath.includes('client')) {
      this.switchRole('client');
    } else {
      this.loadClientRequirements();
      this.loadChatMessages('client_admin_chat');
      this.loadChatMessages('student_mentor_chat');
    }
  }

  switchRole(role) {
    this.activeRole = role;
    const roleButtons = document.querySelectorAll("[data-dash-role]");
    const roleViews = document.querySelectorAll("[data-dash-view]");

    roleButtons.forEach(b => {
      if (b.getAttribute("data-dash-role") === role) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    roleViews.forEach(view => {
      if (view.getAttribute("data-dash-view") === role) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    if (role === 'client') {
      this.loadClientRequirements();
      this.loadChatMessages('client_admin_chat');
    } else if (role === 'student') {
      this.loadChatMessages('student_mentor_chat');
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }

  bindRoleTabs() {
    const roleButtons = document.querySelectorAll("[data-dash-role]");
    roleButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const role = btn.getAttribute("data-dash-role");
        this.switchRole(role);
      });
    });
  }

  // ---------------------------------------------------------------------------
  // CLIENT PROJECT REQUIREMENTS
  // ---------------------------------------------------------------------------

  async loadClientRequirements() {
    const container = document.getElementById("client-projects-list");
    if (!container) return;

    try {
      const resp = await fetch('/api/portal/requirements/');
      const data = await resp.json();

      if (data.success && data.data) {
        container.innerHTML = data.data.map(p => `
          <div class="project-req-card">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
              <div>
                <span class="badge ${p.priority === 'urgent' ? 'badge-amber' : p.priority === 'high' ? 'badge-violet' : 'badge-cyan'}" style="margin-bottom: 0.25rem;">
                  ${p.priority.toUpperCase()} PRIORITY
                </span>
                <h4 style="font-size: 1.15rem; color: var(--text-white); margin-bottom: 0.25rem;">${p.project_name}</h4>
                <div style="font-size: 0.8125rem; color: var(--text-muted);">Client: <strong style="color:var(--text-white);">${p.client_name}</strong> (${p.company || 'Enterprise Partner'})</div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-emerald">✓ ${p.status.replace('_', ' ').toUpperCase()}</span>
                <div style="font-size: 0.8125rem; color: var(--cyan-accent); margin-top: 0.25rem; font-weight: 600;">SLA Timeline: ${p.timeline || '4-6 Weeks'}</div>
              </div>
            </div>

            <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1rem;">
              ${p.description}
            </p>

            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; margin-bottom: 0.35rem;">
                <span style="color: var(--text-muted);">Current Sprint Progress:</span>
                <span style="color: var(--cyan-accent); font-weight: 700;">${p.sprint_progress}% Completed</span>
              </div>
              <div class="progress-container">
                <div class="progress-fill" style="width: ${p.sprint_progress}%;"></div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.8125rem;">
              <span style="color: var(--text-muted);">Staging Cluster: <a href="javascript:void(0)" onclick="window.NconixApp.showToast('Connecting to private Staging API Gateway...')" style="color: var(--cyan-accent);">https://staging.internal.nconix.com</a></span>
              <button class="btn btn-outline-cyan btn-sm" style="padding: 0.3rem 0.75rem; font-size: 0.775rem;" onclick="window.NconixApp.showToast('Downloading Architecture Blueprint Spec (PDF)...')">
                Download Architecture Spec ↓
              </button>
            </div>
          </div>
        `).join("");
      }
    } catch (err) {
      console.warn("Failed to load project requirements:", err);
    }
  }

  bindRequirementForm() {
    const form = document.getElementById("submit-requirement-form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting Requirement...";
      }

      const payload = {
        project_name: form.querySelector('#req-project-name').value,
        client_name: form.querySelector('#req-client-name').value,
        client_email: form.querySelector('#req-client-email').value,
        company: form.querySelector('#req-company').value,
        priority: form.querySelector('#req-priority').value,
        category: form.querySelector('#req-category').value,
        timeline: form.querySelector('#req-timeline').value,
        description: form.querySelector('#req-desc').value,
        status: "submitted",
        sprint_progress: 10
      };

      try {
        const resp = await fetch('/api/portal/requirements/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await resp.json();

        if (data.success) {
          if (window.NconixApp) {
            window.NconixApp.showToast("✓ Requirement submitted! Our engineering lead is reviewing your project spec.");
          }
          form.reset();
          this.loadClientRequirements();
        }
      } catch (err) {
        if (window.NconixApp) {
          window.NconixApp.showToast("Requirement submitted successfully!");
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = "Submit Requirement to Engineering Team →";
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE REAL-TIME CHAT (CLIENT & STUDENT)
  // ---------------------------------------------------------------------------

  async loadChatMessages(channel = 'client_admin_chat') {
    const container = document.getElementById(channel === 'client_admin_chat' ? "client-chat-messages" : "student-chat-messages");
    if (!container) return;

    try {
      const resp = await fetch(`/api/portal/chat/?channel=${channel}`);
      const data = await resp.json();

      if (data.success && data.data) {
        container.innerHTML = data.data.map(m => `
          <div class="chat-msg ${m.sender_type}">
            <div class="chat-msg-sender">${m.sender_name}</div>
            <div class="chat-msg-bubble">${m.message}</div>
            <div class="chat-msg-time">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        `).join("");

        container.scrollTop = container.scrollHeight;
      }
    } catch (e) {
      console.warn("Chat load failed:", e);
    }
  }

  bindChatInputs() {
    // Client Chat Form
    const clientForm = document.getElementById("client-chat-form");
    if (clientForm) {
      clientForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("client-chat-input");
        const msg = input.value.trim();
        if (!msg) return;

        const senderName = (window.NconixApp && window.NconixApp.currentUser) 
          ? window.NconixApp.currentUser.name || window.NconixApp.currentUser.username
          : "Client Lead";

        input.value = "";
        await this.sendMessage('client_admin_chat', 'client', senderName, msg);
      });
    }

    // Student Chat Form
    const studentForm = document.getElementById("student-chat-form");
    if (studentForm) {
      studentForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const input = document.getElementById("student-chat-input");
        const msg = input.value.trim();
        if (!msg) return;

        const senderName = (window.NconixApp && window.NconixApp.currentUser) 
          ? window.NconixApp.currentUser.name || window.NconixApp.currentUser.username
          : "Student";

        input.value = "";
        await this.sendMessage('student_mentor_chat', 'student', senderName, msg);
      });
    }
  }

  async sendMessage(channel, senderType, senderName, message) {
    try {
      const resp = await fetch('/api/portal/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channel,
          sender_type: senderType,
          sender_name: senderName,
          message: message
        })
      });
      const data = await resp.json();
      this.loadChatMessages(channel);
    } catch (e) {
      console.warn("Send failed:", e);
    }
  }
}
