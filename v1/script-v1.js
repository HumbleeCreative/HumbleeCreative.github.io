// script.js
document.addEventListener("DOMContentLoaded", () => {
  // * --- Theme Toggle (Dark Mode) ---
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  const savedTheme = localStorage.getItem("portfolio-theme") || "dark";

  body.classList.toggle("dark-mode", savedTheme === "dark");

  themeToggle.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");

    // Quick "pulse" animation on click
    themeToggle.style.transform = "scale(0.9)";
    setTimeout(() => (themeToggle.style.transform = ""), 150);
  });

  // * --- Mobile Menu ---
  const menuToggle = document.getElementById("menu-toggle");
  const menuClose = document.getElementById("menu-close");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

  const openMenu = () => {
    mobileMenu.classList.add("active"); // This triggers the CSS transitions
    document.body.style.overflow = "hidden";
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

  // Close menu if clicking outside the links (on the backdrop)
  mobileMenu?.addEventListener("click", (e) => {
    if (e.target === mobileMenu) closeMenu();
  });

  // * --- Reveal on scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target); // Stop watching once it has appeared
        }
      });
    },
    { threshold: 0.1 }
  );

  document
    .querySelectorAll(".project-card, .stat-card, .skill-item, .contact-card")
    .forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });

  // * --- Contact form user feedback ---
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault(); // prevents page refreshing

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "TRANSMITTING...";

      // Simulates a delay
      setTimeout(() => {
        btn.textContent = "CONNECTION ESTABLISHED ✓";
        btn.style.background = "#22c55e";
        form.reset();

        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.style.background = "";
        }, 2500);
      }, 1500);
    });
  }
});

// * --- Easter egg for anyone looking at the source code and console ---
console.log(
  "%cSystem Status: Lee Curtis is available to hire! 🚀",
  "color: #ec4899; font-size: 18px; font-weight: bold;"
);
console.log(
  "%cIf you'd like to get in touch and discuss any options, shoot me a message on LinkedIn!",
  "color: #8b5cf6; font-size: 14px; font-weight: bold;"
);
