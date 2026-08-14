/* ================================================================
   James Drew's 21st — site behaviour
   Edit the CONFIG block below to change the date, venue, or the
   email that RSVPs get sent to. Everything else just works.
   ================================================================ */

const CONFIG = {
  // ISO date with Manila offset (+08:00)
  eventDate: "2026-08-29T18:30:00+08:00",
  hostEmail: "REPLACE-WITH-HOST-EMAIL@example.com",
};

/* ---------------- Entourage data ---------------- */
const ENTOURAGE = {
  "list-bills": [
    "Michelle Caldeo", "Melanie Bobis", "Nardy Sorillo", "Fritzie Retugal",
    "Myca Relucio", "Ma. Angela Amarcio", "Lani Tejada", "Decerella Suagao",
    "Ermmie Tan", "Elsie Relucio", "Elaine Relucio", "Jennifer Llamera",
    "Joana Marie Tenorio", "Emma Tarinay", "Diana Tarinay", "Diane Tarinay",
    "Jasper Querimit", "Abigail Ibay", "Erlinda Querimit", "Josefina Relucio",
    "Abigail Relucio"
  ],
  "list-dance": [
    "Isabella Tan", "Rhy Anavrin Alba\u00f1o", "Josef Relucio", "Dywane Relucio",
    "Justine Tan", "Rj Lado", "Jj Vivero", "Jeremie Cuvinar",
    "Daine Relucio", "Robert Joseph Bonifacio", "Andrei Diamse", "Achilles Notarte",
    "Rafael Baello", "John Kevin Lavador", "Junrel Abong", "Wilkenson Go",
    "Jeff Tan", "Ernne Relucio", "Mico Brette Relucio", "Renato Relucio",
    "Erwin Relucio"
  ],
  "list-shots": [
    "Denise Relucio", "Lyca Orpiano", "Nicole Retugal", "Ella Mabasa", "Caryl Reyes",
    "Faye Santos", "Ayen Tutanes", "Riyanna Suagao", "Shannon Salonga", "Yesha Versoza",
    "Genna Rivera", "Janna Monta\u00f1a", "Sophia Perez", "Kelly Sadie", "Clarie Sonza",
    "Jencen Reyes", "Cindy Tarinay", "Danielle Ibay", "Sofie Lacanlale", "Nichole Navarro",
    "Rhenae Ann Alba\u00f1o"
  ]
};

function renderEntourage(){
  Object.entries(ENTOURAGE).forEach(([listId, names]) => {
    const ol = document.getElementById(listId);
    if (!ol) return;
    ol.innerHTML = names.map(name => {
      if (!name) return `<li class="is-blank">to be announced</li>`;
      return `<li>${name}</li>`;
    }).join("");
  });
}

/* ---------------- Countdown ---------------- */
function startCountdown(){
  const target = new Date(CONFIG.eventDate).getTime();
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    mins: document.getElementById("cd-mins"),
    secs: document.getElementById("cd-secs"),
  };
  if (!els.days) return;

  function tick(){
    const now = Date.now();
    let diff = target - now;
    if (diff <= 0){
      els.days.textContent = "00"; els.hours.textContent = "00";
      els.mins.textContent = "00"; els.secs.textContent = "00";
      const eyebrow = document.querySelector(".countdown-strip__eyebrow");
      if (eyebrow) eyebrow.textContent = "The secret is out — happy birthday, James!";
      clearInterval(timer);
      return;
    }
    const pad = n => String(n).padStart(2, "0");
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }
  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------------- Scroll reveal ---------------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  items.forEach(el => io.observe(el));
}

/* ---------------- Quick RSVP pill ---------------- */
function initQuickRsvp(){
  const pill = document.getElementById("quickRsvp");
  const hero = document.getElementById("hero");
  const rsvp = document.getElementById("rsvp");
  if (!pill || !hero || !rsvp) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target === hero){
        pill.classList.toggle("is-visible", !entry.isIntersecting);
      }
      if (entry.target === rsvp && entry.isIntersecting){
        pill.classList.remove("is-visible");
      }
    });
  }, { threshold: 0.1 });
  io.observe(hero);
  io.observe(rsvp);
}

/* ---------------- Background music ---------------- */
function initBackgroundMusic(){
  const music = document.getElementById("bgMusic");
  if (!music) return;

  music.volume = 0.25;
  const playMusic = () => music.play().catch(() => {});

  // Attempt playback immediately; browsers may block unmuted autoplay.
  playMusic();

  const startOnFirstInteraction = (event) => {
    playMusic();
    document.removeEventListener("pointerdown", startOnFirstInteraction, true);
    document.removeEventListener("keydown", startOnFirstInteraction, true);
  };
  document.addEventListener("pointerdown", startOnFirstInteraction, true);
  document.addEventListener("keydown", startOnFirstInteraction, true);
}

/* ---------------- RSVP form -> mailto ---------------- */
function initRsvpForm(){
  const form = document.getElementById("rsvpForm");
  const note = document.getElementById("rsvpNote");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const attending = data.get("attending");
    const guests = data.get("guests");
    const message = (data.get("message") || "").toString().trim();

    const subject = `RSVP: ${name} — ${attending}`;
    const bodyLines = [
      `Name: ${name}`,
      `Response: ${attending}`,
      `Guests: ${guests}`,
      message ? `Message: ${message}` : null,
    ].filter(Boolean);

    const mailto = `mailto:${CONFIG.hostEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;

    if (note){
      note.textContent = "Your email app should be opening now — just hit send there. See you soon!";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderEntourage();
  startCountdown();
  initReveal();
  initQuickRsvp();
  initBackgroundMusic();
  initRsvpForm();
});
