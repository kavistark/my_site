/* ==========================================================================
   NCONIX INTERACTIVE PROJECT QUOTE & ESTIMATOR
   ========================================================================== */

class QuoteEstimator {
  constructor() {
    this.serviceType = "genai";
    this.projectScope = "mvp";
    this.timelineSpeed = "standard";
    this.hasCustomModel = true;
    this.hasCloudDevops = true;
    this.init();
  }

  init() {
    this.bindEvents();
    this.recalculate();
  }

  bindEvents() {
    const serviceSelect = document.getElementById("quote-service-select");
    const scopeSelect = document.getElementById("quote-scope-select");
    const timelineRadios = document.querySelectorAll("input[name='quote-timeline']");
    const customModelCheck = document.getElementById("quote-custom-model");
    const cloudDevopsCheck = document.getElementById("quote-cloud-devops");
    const quoteForm = document.getElementById("quote-calculator-form");

    if (serviceSelect) {
      serviceSelect.addEventListener("change", (e) => {
        this.serviceType = e.target.value;
        this.recalculate();
      });
    }

    if (scopeSelect) {
      scopeSelect.addEventListener("change", (e) => {
        this.projectScope = e.target.value;
        this.recalculate();
      });
    }

    timelineRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        if (e.target.checked) {
          this.timelineSpeed = e.target.value;
          this.recalculate();
        }
      });
    });

    if (customModelCheck) {
      customModelCheck.addEventListener("change", (e) => {
        this.hasCustomModel = e.target.checked;
        this.recalculate();
      });
    }

    if (cloudDevopsCheck) {
      cloudDevopsCheck.addEventListener("change", (e) => {
        this.hasCloudDevops = e.target.checked;
        this.recalculate();
      });
    }

    if (quoteForm) {
      quoteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const emailInput = quoteForm.querySelector('input[type="email"]');
        const priceDisplay = document.getElementById("quote-price-display");
        const timelineDisplay = document.getElementById("quote-timeline-display");

        const payload = {
          client_name: emailInput ? emailInput.value.split('@')[0] : "Client",
          email: emailInput ? emailInput.value : "lead@nconix.com",
          company: "Direct Quote Calculator",
          project_type: this.serviceType.toUpperCase() + " (" + this.projectScope + ")",
          timeline: timelineDisplay ? timelineDisplay.innerText : "4-6 weeks",
          selected_features: [
            `Service: ${this.serviceType}`,
            `Scope: ${this.projectScope}`,
            `Custom AI: ${this.hasCustomModel}`,
            `DevOps: ${this.hasCloudDevops}`
          ],
          currency: "USD",
          project_details: `Calculated Estimate: ${priceDisplay ? priceDisplay.innerText : '$3,000+'}`
        };

        try {
          const resp = await fetch("/api/quote/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          window.NconixApp.showToast(data.message || "Quote proposal sent! Our engineering lead will contact you within 2 hours.");
        } catch (err) {
          window.NconixApp.showToast("Quote proposal sent! Our engineering lead will contact you within 2 hours.");
        }

        quoteForm.reset();
        this.recalculate();
      });
    }
  }

  recalculate() {
    let basePrice = 2500;
    let baseWeeks = 4;

    // Service pricing
    switch (this.serviceType) {
      case "software":
        basePrice = 3000;
        baseWeeks = 4;
        break;
      case "genai":
        basePrice = 4500;
        baseWeeks = 5;
        break;
      case "cv":
        basePrice = 5000;
        baseWeeks = 6;
        break;
      case "automation":
        basePrice = 2200;
        baseWeeks = 3;
        break;
      case "training":
        basePrice = 1800;
        baseWeeks = 3;
        break;
    }

    // Scope multiplier
    switch (this.projectScope) {
      case "prototype":
        basePrice *= 0.6;
        baseWeeks *= 0.6;
        break;
      case "mvp":
        basePrice *= 1.0;
        baseWeeks *= 1.0;
        break;
      case "enterprise":
        basePrice *= 2.2;
        baseWeeks *= 1.8;
        break;
    }

    // Timeline modifier
    if (this.timelineSpeed === "urgent") {
      basePrice *= 1.3;
      baseWeeks *= 0.65;
    }

    // Addons
    if (this.hasCustomModel) basePrice += 1200;
    if (this.hasCloudDevops) basePrice += 800;

    const roundedPrice = Math.round(basePrice / 100) * 100;
    const roundedWeeks = Math.max(2, Math.round(baseWeeks));

    const priceDisplay = document.getElementById("quote-estimated-price");
    const timelineDisplay = document.getElementById("quote-estimated-weeks");

    if (priceDisplay) priceDisplay.innerText = `$${roundedPrice.toLocaleString()}`;
    if (timelineDisplay) timelineDisplay.innerText = `${roundedWeeks} Weeks`;
  }
}
