/* ==========================================================================
   NCONIX INTERACTIVE RAG VISUALIZER MODULE
   ========================================================================== */

class RagVisualizer {
  constructor() {
    this.steps = NCONIX_DATA.ragSteps;
    this.currentStepIndex = 0;
    this.trackContainer = document.getElementById("rag-flow-track");
    this.inspectorContainer = document.getElementById("rag-inspector-panel");
    this.init();
  }


  getStepSvg(name) {
    const svgs = {
      "file-text": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>',
      "scissors": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" x2="8.12" y1="4" y2="15.88"/><line x1="14.47" x2="20" y1="14.48" y2="20"/><line x1="8.12" x2="12" y1="8.12" y2="12"/></svg>',
      "binary": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/></svg>',
      "database": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
      "search": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/></svg>',
      "brain": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04Z"/></svg>',
      "sparkles": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-sm"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>'
    };
    return svgs[name] || '';
  }

  init() {
    if (!this.trackContainer || !this.inspectorContainer) return;
    this.renderTrack();
    this.renderInspector(this.steps[0]);
  }

  renderTrack() {
    this.trackContainer.innerHTML = this.steps.map((step, idx) => `
      <div class="rag-node ${idx === 0 ? 'active' : ''}" data-step-id="${step.id}" data-index="${idx}">
        <div class="rag-node-step">STAGE ${step.step}</div>
        <div class="rag-node-icon">${this.getStepSvg(step.icon)}</div>
        <div class="rag-node-title">${step.title}</div>
      </div>
    `).join("");

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    this.trackContainer.querySelectorAll(".rag-node").forEach(node => {
      node.addEventListener("click", (e) => {
        const target = e.currentTarget;
        const index = parseInt(target.getAttribute("data-index"), 10);
        this.selectStep(index);
      });
    });
  }

  selectStep(index) {
    this.currentStepIndex = index;
    const step = this.steps[index];
    
    // Update active node styling
    this.trackContainer.querySelectorAll(".rag-node").forEach((node, idx) => {
      if (idx === index) {
        node.classList.add("active");
      } else {
        node.classList.remove("active");
      }
    });

    this.renderInspector(step);
  }

  renderInspector(step) {
    const formattedCode = this.escapeHtml(step.code);
    
    this.inspectorContainer.innerHTML = `
      <div class="inspector-info">
        <h3>${step.heading}</h3>
        <p class="inspector-desc">${step.desc}</p>
        <ul class="inspector-bullets">
          ${step.bullets.map(b => `<li class="inspector-bullet-item">${b}</li>`).join("")}
        </ul>
        <div style="display: flex; gap: 0.75rem; align-items: center; margin-top: 1.5rem;">
          <button class="btn btn-outline-cyan btn-sm" id="btn-prev-rag-step" ${this.currentStepIndex === 0 ? 'disabled style="opacity:0.4; pointer-events:none"' : ''}>
            ← Previous Stage
          </button>
          <button class="btn btn-primary btn-sm" id="btn-next-rag-step" ${this.currentStepIndex === this.steps.length - 1 ? 'disabled style="opacity:0.4; pointer-events:none"' : ''}>
            Next Stage →
          </button>
        </div>
      </div>
      <div class="inspector-code-block">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 0.5rem;">
          <span style="font-size: 0.75rem; color: var(--cyan-accent); font-weight: 700; text-transform: uppercase;">Engine Implementation</span>
          <span style="font-size: 0.7rem; color: var(--text-muted);">Python 3.11 • LangChain</span>
        </div>
        <pre><code>${formattedCode}</code></pre>
      </div>
    `;

    // Attach step navigation buttons
    const prevBtn = document.getElementById("btn-prev-rag-step");
    const nextBtn = document.getElementById("btn-next-rag-step");

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (this.currentStepIndex > 0) this.selectStep(this.currentStepIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (this.currentStepIndex < this.steps.length - 1) this.selectStep(this.currentStepIndex + 1);
      });
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
