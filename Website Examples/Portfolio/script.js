const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
const transitionLayer = document.getElementById("pageTransition");
const reveals = document.querySelectorAll(".reveal");
const skillItems = document.querySelectorAll(".skill-item");
const typingBio = document.getElementById("typingBio");
const testimonialTrack = document.getElementById("testimonialTrack");
const testimonialDots = document.getElementById("testimonialDots");
const testimonialCarousel = document.getElementById("testimonialCarousel");
const cursorGlow = document.getElementById("cursorGlow");
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const particleCanvas = document.getElementById("particleCanvas");
const ctx = particleCanvas.getContext("2d");
const hueSlider = document.getElementById("hueSlider");
const hueValue = document.getElementById("hueValue");

const testimonials = [
  { q: "Utkarsh brings football discipline and gamer focus to every challenge.", a: "- Teammate, Arena Squad" },
  { q: "Creative brain, sharp strategy, and match-winning consistency.", a: "- Friend, Weekend Kickoff Crew" },
  { q: "Turns impossible ideas into playable reality. Also naps like a champion.", a: "- Guild Member" }
];

const bioText = "I am Utkarsh Seth, a passionate gamer and creative individual who thrives on challenge. I bring football mindset, strategy, persistence, and style to everything I build. I play hard, create harder, and yes... I am also a professional sleeper.";

let quoteIndex = 0;
let typingIndex = 0;
let particles = [];
let testimonialTimer = null;
const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;

function setHue(hue) {
  const safeHue = Math.max(0, Math.min(360, Number(hue)));
  document.documentElement.style.setProperty("--hue", safeHue);
  hueSlider.value = safeHue;
  hueValue.textContent = `${safeHue}°`;
  localStorage.setItem("portfolio-hue", String(safeHue));
}

function setTheme(theme) {
  if (theme === "light") body.classList.add("light");
  else body.classList.remove("light");
  localStorage.setItem("portfolio-theme", theme);
}

function loadTheme() {
  const saved = localStorage.getItem("portfolio-theme");
  setTheme(saved === "light" ? "light" : "dark");
}

function loadHue() {
  const savedHue = localStorage.getItem("portfolio-hue");
  setHue(savedHue === null ? 210 : savedHue);
}

themeToggle.addEventListener("click", () => {
  transitionLayer.classList.add("active");
  const next = body.classList.contains("light") ? "dark" : "light";
  setTimeout(() => setTheme(next), 210);
  setTimeout(() => transitionLayer.classList.remove("active"), 720);
});

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.id === "skills") {
          skillItems.forEach((item) => item.classList.add("visible"));
        }
      }
    });
  }, { threshold: 0.18 });
  reveals.forEach((section) => observer.observe(section));
}

function animateTyping() {
  if (typingIndex < bioText.length) {
    typingBio.textContent += bioText.charAt(typingIndex);
    typingIndex += 1;
    setTimeout(animateTyping, 21);
  }
}

function renderTestimonials() {
  testimonialTrack.innerHTML = testimonials
    .map((item) => `
      <article class="testimonial-card testimonial-slide">
        <blockquote>${item.q}</blockquote>
        <p class="author">${item.a}</p>
      </article>
    `)
    .join("");

  testimonialDots.innerHTML = testimonials
    .map((_, index) => `<button class="testimonial-dot ${index === 0 ? "active" : ""}" data-index="${index}" aria-label="Go to testimonial ${index + 1}"></button>`)
    .join("");
}

function updateTestimonialPosition(index) {
  quoteIndex = index;
  testimonialTrack.style.transform = `translateX(-${quoteIndex * 100}%)`;
  testimonialDots.querySelectorAll(".testimonial-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === quoteIndex);
  });
}

function nextTestimonial() {
  const next = (quoteIndex + 1) % testimonials.length;
  updateTestimonialPosition(next);
}

function startTestimonialAutoplay() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(nextTestimonial, 3400);
}

function initTestimonialCarousel() {
  renderTestimonials();
  updateTestimonialPosition(0);
  startTestimonialAutoplay();

  testimonialDots.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.classList.contains("testimonial-dot")) return;
    const index = Number(target.dataset.index);
    updateTestimonialPosition(index);
    startTestimonialAutoplay();
  });

  if (!isTouchDevice) {
    testimonialCarousel.addEventListener("mouseenter", () => {
      clearInterval(testimonialTimer);
    });
    testimonialCarousel.addEventListener("mouseleave", startTestimonialAutoplay);
  }
}

hueSlider.addEventListener("input", (event) => {
  setHue(event.target.value);
});

if (!isTouchDevice) {
  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rx = ((y / rect.height) - 0.5) * -8;
      const ry = ((x / rect.width) - 0.5) * 12;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

if (!isTouchDevice) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

window.addEventListener("scroll", () => {
  if (isTouchDevice) return;
  const y = window.scrollY;
  const hero = document.querySelector(".hero-content");
  if (hero) hero.style.transform = `translateY(${y * 0.09}px)`;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Transmission sent. I will respawn in your inbox soon.";
  form.reset();
});

function resizeCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

function seedParticles() {
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 0.5
  }));
}

function drawParticles() {
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  const hue = Number(getComputedStyle(document.documentElement).getPropertyValue("--hue").trim()) || 210;
  const sat = body.classList.contains("light") ? 78 : 90;
  const light = body.classList.contains("light") ? 50 : 62;
  const accentColor = `hsl(${hue} ${sat}% ${light}% / 0.45)`;

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > particleCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > particleCanvas.height) p.vy *= -1;

    ctx.beginPath();
    ctx.fillStyle = accentColor;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawParticles);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

loadTheme();
loadHue();
initReveal();
initTestimonialCarousel();
animateTyping();
resizeCanvas();
seedParticles();
drawParticles();
