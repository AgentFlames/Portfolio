const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.getElementById("navLinks");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const timeSelect = document.getElementById("time");
const dateInput = document.getElementById("date");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("kingscut-theme", theme);
}

function initTheme() {
  const savedTheme = localStorage.getItem("kingscut-theme");
  applyTheme(savedTheme === "light" ? "light" : "dark");
}

function createTimeSlots() {
  const slots = [];
  for (let hour = 9; hour < 18; hour += 1) {
    ["00", "30"].forEach((mins) => {
      const suffix = hour >= 12 ? "pm" : "am";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      slots.push(`${displayHour}:${mins}${suffix}`);
    });
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choose one";
  timeSelect.appendChild(placeholder);

  slots.forEach((slot) => {
    const option = document.createElement("option");
    option.value = slot;
    option.textContent = slot;
    timeSelect.appendChild(option);
  });
}

function setMinDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

function setScrollAnimationObserver() {
  const animated = document.querySelectorAll(".section-animate");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  animated.forEach((el) => observer.observe(el));
}

function validateForm(formData) {
  const name = formData.get("name").toString().trim();
  const phone = formData.get("phone").toString().trim();
  const barber = formData.get("barber").toString().trim();
  const service = formData.get("service").toString().trim();
  const date = formData.get("date").toString().trim();
  const time = formData.get("time").toString().trim();

  if (!name || !phone || !barber || !service || !date || !time) {
    return "Please complete all booking fields.";
  }
  if (name.length < 2) {
    return "Please enter a valid name.";
  }
  if (!/^[+()0-9\s-]{7,}$/.test(phone)) {
    return "Please enter a valid phone number.";
  }
  return "";
}

initTheme();
createTimeSlots();
setMinDate();
setScrollAnimationObserver();

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

mobileMenuBtn.addEventListener("click", () => {
  const expanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
  mobileMenuBtn.setAttribute("aria-expanded", String(!expanded));
  const isOpen = navLinks.classList.toggle("open");
  document.body.style.overflow = isOpen ? "hidden" : "";
});

document.querySelectorAll(".nav-links a, .footer-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

document.addEventListener("click", (event) => {
  if (!navLinks.classList.contains("open")) return;
  const clickedInsideMenu = navLinks.contains(event.target);
  const clickedMenuButton = mobileMenuBtn.contains(event.target);
  if (!clickedInsideMenu && !clickedMenuButton) {
    navLinks.classList.remove("open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const validationError = validateForm(formData);

  if (validationError) {
    formMessage.textContent = validationError;
    return;
  }

  const name = formData.get("name").toString().trim();
  const barber = formData.get("barber").toString().trim();
  const service = formData.get("service").toString().trim();
  formMessage.textContent = `Booking confirmed for ${name} with ${barber} (${service}). We'll contact you shortly.`;
  bookingForm.reset();
});
