(() => {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector("#site-nav");
  const form = document.querySelector("#enquiry-form");
  const result = document.querySelector("#enquiry-result");
  const summary = document.querySelector("#enquiry-summary");
  const formStatus = document.querySelector("#form-status");
  const copyButton = document.querySelector("#copy-summary");
  const editButton = document.querySelector("#edit-enquiry");

  document.querySelector("#year").textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  window.addEventListener("scroll", () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

  const value = (data, key) => {
    const raw = data.get(key);
    return typeof raw === "string" && raw.trim() ? raw.trim() : "Not provided";
  };

  const buildSummary = (data) => {
    const generated = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(new Date());

    return [
      "SINOME INDUSTRIAL LIMITED — INDUSTRIAL TALLOW PROCUREMENT INQUIRY",
      "Preview-generated brief (not yet sent)",
      "",
      `Generated: ${generated}`,
      "",
      "BUYER",
      `Company: ${value(data, "company")}`,
      `Website: ${value(data, "website")}`,
      `Contact: ${value(data, "contact")}`,
      `Business email: ${value(data, "email")}`,
      `Country / market: ${value(data, "country")}`,
      "",
      "COMMERCIAL REQUIREMENT",
      `Intended use: ${value(data, "use")}`,
      `Trial / monthly quantity: ${value(data, "quantity")}`,
      `Destination port: ${value(data, "port")}`,
      `Preferred Incoterm: ${value(data, "incoterm")}`,
      `Target delivery window: ${value(data, "window")}`,
      "",
      "TECHNICAL ACCEPTANCE",
      value(data, "specification"),
      "",
      "DOCUMENT / EXTERNAL SCHEME REQUIREMENTS",
      value(data, "documents"),
      "",
      "ADDITIONAL NOTES",
      value(data, "notes"),
      "",
      "NOTICE",
      "This brief is an enquiry only. It is not a purchase order, offer, confirmation of availability, specification, certification or shipping commitment."
    ].join("\n");
  };

  const copyText = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    summary.focus();
    summary.select();
    return document.execCommand("copy");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const text = buildSummary(new FormData(form));
    summary.value = text;
    result.hidden = false;
    formStatus.textContent = "Inquiry summary created locally. No data has been sent.";

    let copied = false;
    try {
      copied = await copyText(text);
    } catch (_) {
      copied = false;
    }

    copyButton.textContent = copied ? "Copied to clipboard" : "Copy summary";
    result.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  copyButton.addEventListener("click", async () => {
    try {
      const copied = await copyText(summary.value);
      copyButton.textContent = copied ? "Copied to clipboard" : "Select and copy manually";
    } catch (_) {
      copyButton.textContent = "Select and copy manually";
      summary.focus();
      summary.select();
    }
  });

  editButton.addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    form.querySelector("input, select, textarea").focus();
  });
})();
