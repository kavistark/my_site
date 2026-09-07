/* ==========================================================================
   NCONIX ACADEMY & LIVE CLASSES MODULE
   ========================================================================== */

class AcademyManager {
  constructor() {
    this.courses = NCONIX_DATA.courses;
    this.liveClasses = NCONIX_DATA.liveClasses;
    this.activeFilter = "all";
    this.courseGrid = document.getElementById("academy-courses-grid");
    this.liveClassContainer = document.getElementById("live-classes-container");
    this.init();
  }

  init() {
    this.renderCourses();
    this.renderLiveClasses();
    this.setupFilterTabs();
  }

  setupFilterTabs() {
    const filterBtns = document.querySelectorAll("[data-course-filter]");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.activeFilter = btn.getAttribute("data-course-filter");
        this.renderCourses();
      });
    });
  }

  renderCourses() {
    if (!this.courseGrid) return;
    
    const filtered = this.activeFilter === "all" 
      ? this.courses 
      : this.courses.filter(c => c.track === this.activeFilter);

    this.courseGrid.innerHTML = filtered.map(course => `
      <div class="glass-card" style="display: flex; flex-direction: column; height: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <span class="badge badge-cyan">${course.trackLabel}</span>
          <span style="font-size: 0.775rem; color: var(--amber-accent); font-weight: 700;">${course.badge}</span>
        </div>
        <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem;">${course.title}</h3>
        <p style="font-size: 0.9rem; margin-bottom: 1.25rem; flex-grow: 1;">${course.description}</p>
        
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.75rem 1rem; margin-bottom: 1.25rem; font-size: 0.8125rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
            <span style="color: var(--text-muted);">Duration:</span>
            <strong style="color: var(--text-white);">${course.duration}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Level:</span>
            <strong style="color: var(--cyan-accent);">${course.level}</strong>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <button class="btn btn-outline-cyan btn-sm btn-view-syllabus" data-course-id="${course.id}">
            View Syllabus
          </button>
          <button class="btn btn-primary btn-sm btn-enroll-course" data-course-id="${course.id}" data-course-title="${course.title}">
            Enroll Now
          </button>
        </div>
      </div>
    `).join("");

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    // Attach click events
    this.courseGrid.querySelectorAll(".btn-view-syllabus").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.getAttribute("data-course-id");
        this.openSyllabusModal(id);
      });
    });

    this.courseGrid.querySelectorAll(".btn-enroll-course").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const title = e.currentTarget.getAttribute("data-course-title");
        this.openEnrollmentModal(title);
      });
    });

    if (window.NconixApp && window.NconixApp.setup3DCardTilt) {
      window.NconixApp.setup3DCardTilt();
    }
  }

  renderLiveClasses() {
    if (!this.liveClassContainer) return;

    this.liveClassContainer.innerHTML = `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--border-glass); color: var(--text-muted); font-size: 0.8125rem; text-transform: uppercase;">
              <th style="padding: 1rem 1.25rem;">Live Session</th>
              <th style="padding: 1rem 1.25rem;">Instructor</th>
              <th style="padding: 1rem 1.25rem;">Schedule</th>
              <th style="padding: 1rem 1.25rem;">Duration</th>
              <th style="padding: 1rem 1.25rem;">Status</th>
              <th style="padding: 1rem 1.25rem; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${this.liveClasses.map(cls => `
              <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.2s;" onmouseover="this.style.background='rgba(0,240,255,0.03)'" onmouseout="this.style.background='transparent'">
                <td style="padding: 1.25rem;">
                  <strong style="color: var(--text-white); font-size: 0.95rem; display: block;">${cls.course}</strong>
                  <span style="font-size: 0.775rem; color: var(--cyan-accent); font-family: var(--font-mono);">${cls.roomLink}</span>
                </td>
                <td style="padding: 1.25rem; font-size: 0.875rem; color: var(--text-secondary);">${cls.instructor}</td>
                <td style="padding: 1.25rem;">
                  <span style="display: block; font-size: 0.875rem; color: var(--text-white);">${cls.date}</span>
                  <span style="font-size: 0.75rem; color: var(--emerald-accent);">Starts in ~${cls.countdownHours} hrs</span>
                </td>
                <td style="padding: 1.25rem; font-size: 0.875rem; color: var(--text-secondary);">${cls.duration}</td>
                <td style="padding: 1.25rem;">
                  <span class="badge badge-emerald" style="font-size: 0.7rem;">${cls.seatsLeft} Seats Left</span>
                </td>
                <td style="padding: 1.25rem; text-align: right;">
                  <button class="btn btn-outline-cyan btn-sm btn-join-live-class" data-course="${cls.course}" data-room="${cls.roomLink}">
                    Join Class
                  </button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }

    this.liveClassContainer.querySelectorAll(".btn-join-live-class").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const course = e.currentTarget.getAttribute("data-course");
        const room = e.currentTarget.getAttribute("data-room");
        this.openLiveRoomModal(course, room);
      });
    });
  }

  openSyllabusModal(courseId) {
    const course = this.courses.find(c => c.id === courseId);
    if (!course) return;

    const modal = document.getElementById("app-modal");
    const modalContent = document.getElementById("app-modal-content");
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <span class="badge badge-cyan" style="margin-bottom: 0.5rem;">${course.trackLabel}</span>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">${course.title}</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary);">${course.description}</p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.75rem; background: rgba(0,0,0,0.3); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle);">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Duration</span>
          <strong style="color: var(--text-white); font-size: 0.9rem;">${course.duration}</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Format</span>
          <strong style="color: var(--text-white); font-size: 0.9rem;">${course.mode}</strong>
        </div>
        <div>
          <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">Level</span>
          <strong style="color: var(--cyan-accent); font-size: 0.9rem;">${course.level}</strong>
        </div>
      </div>

      <h4 style="margin-bottom: 1rem; color: var(--text-white); display: flex; align-items: center; gap: 0.5rem;">
        Comprehensive Curriculum Modules
      </h4>
      <div style="display: flex; flex-direction: column; gap: 0.6rem; max-height: 280px; overflow-y: auto; padding-right: 0.5rem; margin-bottom: 1.75rem;">
        ${course.modules.map(mod => `
          <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-size: 0.875rem; color: var(--text-primary);">
            ${mod}
          </div>
        `).join("")}
      </div>

      <h4 style="margin-bottom: 0.75rem; color: var(--text-white);">Real-World Capstone Projects</h4>
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 2rem;">
        ${course.projects.map(p => `<span class="tech-tag">${p}</span>`).join("")}
      </div>

      <div style="display: flex; gap: 1rem; justify-content: flex-end;">
        <button class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Close</button>
        <button class="btn btn-primary" onclick="window.NconixApp.openEnrollmentModal('${course.title}')">Enroll in Cohort</button>
      </div>
    `;

    modal.classList.add("active");
  }

  openEnrollmentModal(courseTitle) {
    window.NconixApp.openEnrollmentModal(courseTitle);
  }

  openLiveRoomModal(course, room) {
    const modal = document.getElementById("app-modal");
    const modalContent = document.getElementById("app-modal-content");
    if (!modal || !modalContent) return;

    modalContent.innerHTML = `
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 1.6rem; margin-bottom: 0.5rem;">Join Live Academy Session</h2>
        <p style="font-size: 0.95rem; color: var(--text-secondary); max-width: 480px; margin: 0 auto;">
          You are connecting to: <strong>${course}</strong>
        </p>
      </div>

      <div style="background: rgba(0, 240, 255, 0.05); border: 1px solid var(--border-cyan); border-radius: var(--radius-md); padding: 1.5rem; margin-bottom: 2rem; text-align: center;">
        <div style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 0.35rem; text-transform: uppercase;">Stream Room Link</div>
        <div style="font-family: var(--font-mono); color: var(--cyan-accent); font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem;">${room}</div>
        <div style="display: flex; justify-content: center; gap: 0.75rem;">
          <span class="badge badge-emerald">Live Server Connected</span>
          <span class="badge badge-violet">Audio & Video Ready</span>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center;">
        <button class="btn btn-secondary" onclick="window.NconixApp.closeModal()">Back to Schedule</button>
        <button class="btn btn-primary" onclick="window.NconixApp.showToast('Launching live stream simulator...'); window.NconixApp.closeModal();">
          Enter Classroom Now →
        </button>
      </div>
    `;

    modal.classList.add("active");
  }
}
