const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("gden-theme");

if (savedTheme === "light") {
  body.classList.add("light-mode");
}

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  localStorage.setItem("gden-theme", body.classList.contains("light-mode") ? "light" : "dark");
});

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
mobileMenuBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("open");
  document.body.style.overflow = isOpen ? "hidden" : "";
});
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  });
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target === mobileMenu) {
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
  }
});

const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);
reveals.forEach((item) => observer.observe(item));

const navLinks = document.querySelectorAll(".nav-link");
const sectionIds = ["services", "pricing", "team", "booking", "contact"];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active", href === `#${entry.target.id}`);
      });
    });
  },
  { threshold: 0.45 }
);
sectionIds.forEach((id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

const filterRow = document.getElementById("filterRow");
const tiles = [...document.querySelectorAll(".tile")];
filterRow.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-filter]");
  if (!btn) return;
  const filter = btn.dataset.filter;
  document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  tiles.forEach((tile) => {
    const show = filter === "all" || tile.classList.contains(filter);
    tile.classList.toggle("hide", !show);
  });
});

const testimonialTrack = document.getElementById("testimonialTrack");
if (testimonialTrack) {
  const cards = [...testimonialTrack.children];
  cards.forEach((card) => testimonialTrack.appendChild(card.cloneNode(true)));
}

const bookingForm = document.getElementById("bookingForm");
const steps = [...document.querySelectorAll(".step")];
const formSteps = [...document.querySelectorAll(".form-step")];
const nextStepButton = document.getElementById("nextStep");
const selectedBarber = document.getElementById("selectedBarber");
const serviceSelect = document.getElementById("serviceSelect");
const dateInput = document.getElementById("date");
const selectedTime = document.getElementById("selectedTime");
const nameInput = document.getElementById("name");
const phoneInput = document.getElementById("phone");
const confirmation = document.getElementById("confirmation");

const setStep = (stepNumber) => {
  formSteps.forEach((step) => step.classList.toggle("active", step.dataset.step === String(stepNumber)));
  steps.forEach((step, idx) => step.classList.toggle("active", idx + 1 <= stepNumber));
};

const barberButtons = [...document.querySelectorAll("#barberPicker button")];
barberButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    barberButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    selectedBarber.value = btn.dataset.value;
  });
});

const timeButtons = [...document.querySelectorAll("#timeGrid button")];
timeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    timeButtons.forEach((item) => item.classList.remove("active"));
    btn.classList.add("active");
    selectedTime.value = btn.dataset.time;
  });
});

nextStepButton.addEventListener("click", () => {
  if (!selectedBarber.value || !serviceSelect.value) {
    alert("Please select both barber and service to continue.");
    return;
  }
  setStep(2);
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedBarber.value || !serviceSelect.value || !dateInput.value || !selectedTime.value || !nameInput.value.trim() || !phoneInput.value.trim()) {
    alert("Please complete all booking fields.");
    return;
  }
  confirmation.innerHTML = `<div class="confirm-card">
    <h3>Booking Confirmed</h3>
    <p><strong>${nameInput.value}</strong>, your appointment is reserved with <strong>${selectedBarber.value}</strong> for <strong>${serviceSelect.value}</strong>.</p>
    <p>${dateInput.value} at ${selectedTime.value}</p>
    <p><em>We'll be ready for you, gentleman.</em></p>
  </div>`;
  bookingForm.reset();
  selectedBarber.value = "";
  selectedTime.value = "";
  barberButtons.forEach((item) => item.classList.remove("active"));
  timeButtons.forEach((item) => item.classList.remove("active"));
  setStep(1);
});
