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

    // Trigger a small resize event for Canvas to update colors if needed
    window.dispatchEvent(new Event("resize"));

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
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  //* Any element that has the reveal class
  document.querySelectorAll(".reveal").forEach((el) => {
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
          btn.style.background = ""; // Reverts to CSS class gradient
        }, 2500);
      }, 1500);
    });
  }

  // =========================================
  // * --- 2D Animation Showcase (Canvas) ---
  // * Interactive Particle Network
  // * Performance optimized for mobile Safari
  // =========================================
  const canvas = document.getElementById("hero-canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  let particles = [];

  // Configuration
  const particleCount = window.innerWidth < 768 ? 30 : 60; // Reduce count on mobile
  const connectionDistance = 150;
  const mouseDistance = 200;

  // Mouse tracking
  const mouse = { x: null, y: null };

  window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  // Reset mouse when leaving window
  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Resize handler
  function resize() {
    width = canvas.width = document.getElementById("home").offsetWidth;
    height = canvas.height = document.getElementById("home").offsetHeight;
  }

  window.addEventListener("resize", resize);
  resize();

  // Particle Class
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 1; // Velocity X
      this.vy = (Math.random() - 0.5) * 1; // Velocity Y
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseDistance - distance) / mouseDistance;
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    draw() {
      // Color based on theme
      const isDark = document.body.classList.contains("dark-mode");
      ctx.fillStyle = isDark
        ? "rgba(139, 92, 246, 0.5)"
        : "rgba(21, 128, 61, 0.5)";

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Initialize particles
  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.body.classList.contains("dark-mode");

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      // Draw connections
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          ctx.beginPath();
          // Opacity based on distance
          let opacity = 1 - distance / connectionDistance;
          ctx.strokeStyle = isDark
            ? `rgba(139, 92, 246, ${opacity * 0.2})`
            : `rgba(0, 0, 0, ${opacity * 0.1})`;

          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  initParticles();
  animate();

  // Re-init particles on substantial resize to prevent density issues
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(initParticles, 100);
  });
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
