const canvas = document.querySelector(".starfield");
const context = canvas.getContext("2d");
const scene = document.querySelector(".scene");
const button = document.querySelector(".unlock-button");
const particleOrigin = document.querySelector(".particle-origin");
const timelinePage = document.querySelector("#timeline-page");
const timelineNext = document.querySelector(".timeline-next");
const memoryCard = document.querySelector(".memory-card");
const wishPage = document.querySelector("#wish-page");
const wishOptions = [...document.querySelectorAll(".wish-option")];
const wishReveal = document.querySelector(".wish-reveal");
const wishMessage = document.querySelector(".wish-reveal__message");
const wishNext = document.querySelector(".wish-next");
const constellationPage = document.querySelector("#constellation-page");
const traitOrbs = [...document.querySelectorAll(".trait-orb")];
const traitProgress = document.querySelector(".trait-progress__count");
const traitMaster = document.querySelector(".trait-master");
const traitDialog = document.querySelector(".trait-dialog");
const traitDialogTitle = document.querySelector(".trait-dialog__title");
const traitDialogMessage = document.querySelector(".trait-dialog__message");
const traitDialogIcon = document.querySelector(".trait-dialog__icon");
const constellationNext = document.querySelector(".constellation-next");
const traitDialogCloseButtons = [...document.querySelectorAll(".trait-dialog__close, .trait-dialog__done, .trait-dialog__backdrop")];
const cakePage = document.querySelector("#cake-page");
const cakeFireworksCanvas = document.querySelector(".cake-fireworks");
const cakeFireworksContext = cakeFireworksCanvas.getContext("2d");
const cakeFlames = document.querySelector(".cake-flames");
const cakeBlowButton = document.querySelector(".cake-blow");
const cakeMicButton = document.querySelector(".cake-mic");
const cakeMicLabel = document.querySelector(".cake-mic__label");
const cakeMicStatus = document.querySelector(".cake-mic-status");
const birthdayCard = document.querySelector(".birthday-card");
const cakeNext = document.querySelector(".cake-next");
const envelopePage = document.querySelector("#envelope-page");
const envelopeDisplay = document.querySelector(".envelope-display");
const envelopeWrap = document.querySelector(".envelope-wrap");
const envelopeSeal = document.querySelector(".envelope-seal");
const letterReveal = document.querySelector(".letter-reveal");
const letterScroll = document.querySelector(".letter-paper__scroll");
const letterReadHint = document.querySelector(".letter-read-hint");
const envelopeNext = document.querySelector(".envelope-next");
const envelopeParticleLayer = document.querySelector(".envelope-particle-layer");
const collectorPage = document.querySelector("#collector-page");
const collectorCanvas = document.querySelector(".collector-canvas");
const collectorContext = collectorCanvas.getContext("2d");
const collectorArena = document.querySelector("#game-arena");
const collectorProgressCount = document.querySelector(".collector-progress__count span");
const collectorProgressBar = document.querySelector(".collector-progress__track span");
const collectorGreeting = document.querySelector(".collector-greeting");
const collectorGreetingMessage = document.querySelector(".collector-greeting__message");
const collectorGreetingContinue = document.querySelector(".collector-greeting__continue");
const collectorGrand = document.querySelector(".collector-grand");
const collectorFooter = document.querySelector(".collector-footer");
const collectorNext = document.querySelector(".collector-next");
const finalePage = document.querySelector("#finale-page");
const finaleCanvas = document.querySelector(".finale-canvas");
const finaleContext = finaleCanvas.getContext("2d");
const finaleNext = document.querySelector(".finale-next");
const apologyPage = document.querySelector("#apology-page");
const apologyReplay = document.querySelector(".apology-replay");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let stars = [];
let animationFrame = 0;
let unlocked = false;
let selectedWish = null;
let activeTraitOrb = null;
let burstGeneration = 0;
const discoveredTraits = new Set();
let cakeCeremonyComplete = false;
let fireworksFrame = 0;
let fireworksParticles = [];
let audioStream = null;
let micContext = null;
let micFrame = 0;
let envelopeOpened = false;
let letterUnfolded = false;
let letterRead = false;
let sealPointerStart = null;
let collectorFrame = 0;
let collectorLastFrame = 0;
let collectorWidth = 0;
let collectorHeight = 0;
let collectorElapsed = 0;
let collectorAudio = null;
let collectorComplete = false;
let collectorSpawnTimer = 0;
const collectedBlessings = new Set();
let collectorDust = [];
let collectorConfetti = [];
let finaleFrame = 0;
let finaleLastFrame = 0;
let finaleWidth = 0;
let finaleHeight = 0;
let finaleElapsed = 0;
let finaleParticles = [];
let finaleNextBurst = 0;

const birthdayBlessings = [
  "✨ Wishing you endless joy, laughter, and light!",
  "👑 May every dream you hold come true this year!",
  "💖 Sending you endless love, peace, and good health!",
  "🥂 To another year of incredible achievements & happiness!",
  "🌟 May your journey ahead be blessed with pure magic!",
];

const wishes = {
  joy: {
    title: "A little more joy",
    message: "May the little things make you smile, and may the big things take your breath away.",
  },
  adventure: {
    title: "A world of adventure",
    message: "May every new path bring a story worth telling and a reason to believe in what’s possible.",
  },
  love: {
    title: "All the love you deserve",
    message: "May you always feel how deeply you’re loved—not just today, but in all the days to come.",
  },
};

const traits = {
  heart: {
    title: "Your Pure Heart",
    icon: "♡",
    color: "#edb2b3",
    message: "The way you care—quietly, completely, and without keeping score—makes people feel safe just being themselves.",
  },
  laugh: {
    title: "Your Healing Laugh",
    icon: "☼",
    color: "#c9a8ed",
    message: "You have this way of turning an ordinary moment into the one everyone remembers. Your laughter makes the whole room feel lighter.",
  },
  calm: {
    title: "Your Unmatched Calm",
    icon: "✧",
    color: "#f0ce9c",
    message: "When the world gets loud, your steady warmth reminds the people around you that everything can be okay.",
  },
  presence: {
    title: "Your Magic Presence",
    icon: "✦",
    color: "#9ce6eb",
    message: "You don't have to try to make a moment special. Somehow, it just becomes one when you're there.",
  },
};

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * ratio);
  canvas.height = Math.round(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.min(100, Math.max(38, Math.floor((window.innerWidth * window.innerHeight) / 12500)));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: Math.random() * 1.1 + 0.25,
    alpha: Math.random() * 0.48 + 0.12,
    drift: Math.random() * 0.16 + 0.035,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawStars(time = 0) {
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (const star of stars) {
    const shimmer = 0.76 + Math.sin(time * 0.00055 + star.phase) * 0.24;
    context.beginPath();
    context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(255, 226, 218, ${star.alpha * shimmer})`;
    context.fill();
    if (!reducedMotion.matches) {
      star.y -= star.drift;
      if (star.y < -2) {
        star.y = window.innerHeight + 2;
        star.x = Math.random() * window.innerWidth;
      }
    }
  }
  if (!reducedMotion.matches) animationFrame = requestAnimationFrame(drawStars);
}

function makeBurst(x, y, { hearts = false, golden = false } = {}) {
  const generation = ++burstGeneration;
  particleOrigin.replaceChildren();
  particleOrigin.style.left = `${x}px`;
  particleOrigin.style.top = `${y}px`;

  const colors = golden
    ? ["#fff0c2", "#f4d18e", "#e8b46f", "#fff9e8", "#eac0a1"]
    : hearts
    ? ["#ffe5bf", "#f7c6c8", "#e7a7b5", "#f5d9a8"]
    : ["#ffe5bf", "#f7c6c8", "#e7a7b5", "#f5d9a8", "#fff5e9"];
  const count = golden ? (window.innerWidth < 500 ? 72 : 100) : hearts ? 38 : window.innerWidth < 500 ? 44 : 66;

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.26;
    const distance = 38 + Math.random() * 116;
    const particle = document.createElement("span");
    const isHeart = hearts && i % 3 === 0;
    const isConfetti = golden && i % 4 === 0;
    particle.className = isHeart ? "spark-particle spark-particle--heart" : "spark-particle";
    if (isHeart) particle.textContent = "♡";
    if (isConfetti) {
      particle.classList.add("spark-particle--confetti");
      particle.style.setProperty("--rotation", `${Math.random() * 540 - 270}deg`);
    }
    particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--size", `${2 + Math.random() * 3.5}px`);
    particle.style.setProperty("--duration", `${hearts ? 650 : golden ? 900 + Math.random() * 850 : 600 + Math.random() * 600}ms`);
    particle.style.setProperty("--particle-color", colors[Math.floor(Math.random() * colors.length)]);
    particleOrigin.append(particle);
  }

  window.setTimeout(() => {
    if (generation === burstGeneration) particleOrigin.replaceChildren();
  }, golden ? 2100 : 1400);
}

function playUnlockChime() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const now = audioContext.currentTime;
  const notes = [
    { frequency: 659.25, start: 0, duration: 0.34 },
    { frequency: 987.77, start: 0.11, duration: 0.48 },
    { frequency: 1318.51, start: 0.22, duration: 0.68 },
  ];

  for (const note of notes) {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    volume.gain.setValueAtTime(0.0001, now + note.start);
    volume.gain.exponentialRampToValueAtTime(0.055, now + note.start + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.02);
  }

  window.setTimeout(() => audioContext.close(), 1400);
}

function unlock(event) {
  if (unlocked) return;
  unlocked = true;
  button.disabled = true;

  const bounds = button.getBoundingClientRect();
  const ripple = button.querySelector(".button__ripple");
  const rippleBounds = button.getBoundingClientRect();
  const clientX = event.clientX || bounds.left + bounds.width / 2;
  const clientY = event.clientY || bounds.top + bounds.height / 2;
  ripple.style.left = `${clientX - rippleBounds.left}px`;
  ripple.style.top = `${clientY - rippleBounds.top}px`;
  ripple.classList.add("is-active");

  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  playUnlockChime();
  scene.classList.add("is-unlocking");

  window.setTimeout(() => {
    const transition = new CustomEvent("birthday:page-change", {
      bubbles: true,
      detail: { from: 1, to: 2 },
    });
    window.dispatchEvent(transition);

    if (typeof window.onBirthdayUnlock === "function") {
      window.onBirthdayUnlock({ from: 1, to: 2 });
    }
  }, 650);
}

function countUpStats() {
  const counters = timelinePage.querySelectorAll("[data-count]");
  const duration = reducedMotion.matches ? 0 : 1900;

  counters.forEach((counter) => {
    const target = Number(counter.dataset.count);
    const suffix = counter.dataset.suffix || "";
    const card = counter.closest(".stat-card");
    const start = performance.now();

    function update(now) {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 4;
      counter.textContent = `${Math.round(target * eased).toLocaleString()}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        card.classList.add("is-counted");
      }
    }

    requestAnimationFrame(update);
  });
}

function showTimeline() {
  window.setTimeout(() => {
    scene.classList.add("page-hidden");
    timelinePage.hidden = false;
    timelinePage.inert = false;
    requestAnimationFrame(() => timelinePage.classList.add("is-entering"));
    document.title = "A Timeline of Happiness";
    countUpStats();
  }, 420);
}

function flipMemoryCard() {
  const flipped = memoryCard.classList.toggle("is-flipped");
  memoryCard.setAttribute("aria-pressed", String(flipped));
  memoryCard.setAttribute("aria-label", flipped ? "Hide the birthday message" : "Reveal why today is special");
  memoryCard.querySelector(".memory-card__front").setAttribute("aria-hidden", String(flipped));
  memoryCard.querySelector(".memory-card__back").setAttribute("aria-hidden", String(!flipped));
  const bounds = memoryCard.getBoundingClientRect();
  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, { hearts: true });
}

function enterMemoryLane(event) {
  if (event) {
    const bounds = timelineNext.getBoundingClientRect();
    makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  }
  timelineNext.disabled = true;
  timelinePage.classList.add("is-leaving");
  window.setTimeout(() => {
    const transition = new CustomEvent("birthday:page-change", {
      bubbles: true,
      detail: { from: 2, to: 3 },
    });
    window.dispatchEvent(transition);

    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange({ from: 2, to: 3 });
    }
  }, 600);
}

function showWishes() {
  window.setTimeout(() => {
    timelinePage.hidden = true;
    timelinePage.inert = true;
    wishPage.hidden = false;
    wishPage.inert = false;
    requestAnimationFrame(() => wishPage.classList.add("is-entering"));
    document.title = "A Birthday Wish for You";
  }, 400);
}

function selectWish(event) {
  const option = event.currentTarget;
  selectedWish = option.dataset.wish;
  const wish = wishes[selectedWish];

  wishOptions.forEach((item) => {
    const selected = item === option;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  wishMessage.textContent = wish.message;
  wishReveal.hidden = false;
  wishReveal.classList.remove("is-revealed");
  requestAnimationFrame(() => wishReveal.classList.add("is-revealed"));
  wishNext.disabled = false;

  const bounds = option.getBoundingClientRect();
  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, { hearts: true });
}

function continueFromWishes() {
  if (!selectedWish) return;

  const bounds = wishNext.getBoundingClientRect();
  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
  wishNext.disabled = true;
  wishPage.classList.add("is-leaving");

  window.setTimeout(() => {
    const detail = { from: 3, to: 4, wish: selectedWish, wishTitle: wishes[selectedWish].title };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));

    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, 600);
}

function showConstellation() {
  window.setTimeout(() => {
    wishPage.hidden = true;
    wishPage.inert = true;
    constellationPage.hidden = false;
    constellationPage.inert = false;
    requestAnimationFrame(() => constellationPage.classList.add("is-entering"));
    document.title = "The Constellation of You";
  }, 400);
}

function playTraitChime() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const now = audioContext.currentTime;
  const notes = [
    { frequency: 880, start: 0, duration: 0.42 },
    { frequency: 1318.51, start: 0.09, duration: 0.58 },
  ];

  for (const note of notes) {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    volume.gain.setValueAtTime(0.0001, now + note.start);
    volume.gain.exponentialRampToValueAtTime(0.025, now + note.start + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.02);
  }

  window.setTimeout(() => audioContext.close(), 1200);
}

function openTrait(event) {
  const orb = event.currentTarget;
  const trait = traits[orb.dataset.trait];
  if (!trait) return;

  activeTraitOrb = orb;
  const isNewDiscovery = !discoveredTraits.has(orb.dataset.trait);
  if (isNewDiscovery) {
    discoveredTraits.add(orb.dataset.trait);
    orb.classList.add("is-discovered");
    orb.setAttribute("aria-pressed", "true");
    orb.querySelector(".trait-orb__status").textContent = "DISCOVERED";
    traitProgress.textContent = String(discoveredTraits.size);
  }

  traitDialogTitle.textContent = trait.title;
  traitDialogMessage.textContent = trait.message;
  traitDialogIcon.textContent = trait.icon;
  traitDialog.style.setProperty("--trait-color", trait.color);
  traitDialog.hidden = false;
  document.body.classList.add("has-trait-dialog");
  requestAnimationFrame(() => traitDialog.classList.add("is-open"));

  const bounds = orb.getBoundingClientRect();
  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, { hearts: true });
  playTraitChime();

  if (isNewDiscovery && discoveredTraits.size === traitOrbs.length) {
    traitMaster.hidden = false;
    constellationNext.disabled = false;
    requestAnimationFrame(() => traitMaster.classList.add("is-unlocked"));
    const core = document.querySelector(".constellation-core");
    const coreBounds = core.getBoundingClientRect();
    makeBurst(coreBounds.left + coreBounds.width / 2, coreBounds.top + coreBounds.height / 2, { golden: true });
    core.classList.add("is-complete");
  }

  window.setTimeout(() => traitDialog.querySelector(".trait-dialog__close").focus(), 80);
}

function closeTrait() {
  if (traitDialog.hidden) return;
  traitDialog.classList.remove("is-open");
  document.body.classList.remove("has-trait-dialog");
  window.setTimeout(() => {
    traitDialog.hidden = true;
    if (activeTraitOrb) activeTraitOrb.focus();
  }, reducedMotion.matches ? 0 : 360);
}

function continueFromConstellation() {
  if (discoveredTraits.size !== traitOrbs.length) return;

  closeTrait();
  const bounds = constellationNext.getBoundingClientRect();
  makeBurst(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, { golden: true });
  constellationNext.disabled = true;
  constellationPage.classList.add("is-leaving");

  window.setTimeout(() => {
    const detail = { from: 4, to: 5 };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));

    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, 600);
}

function resizeCakeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  cakeFireworksCanvas.width = Math.round(window.innerWidth * ratio);
  cakeFireworksCanvas.height = Math.round(window.innerHeight * ratio);
  cakeFireworksContext.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function emitFireworkBurst(x, y, { count = 70, speed = 4.5, gravity = 0.045 } = {}) {
  const colors = ["#ffe7ad", "#f8c978", "#f5e2ff", "#f4aab7", "#aee8ec", "#fff8e8"];
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.18;
    const velocity = speed * (0.35 + Math.random() * 0.8);
    fireworksParticles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      gravity,
      size: 1.1 + Math.random() * 2.7,
      alpha: 0.8 + Math.random() * 0.2,
      decay: 0.006 + Math.random() * 0.013,
      color: colors[Math.floor(Math.random() * colors.length)],
      confetti: Math.random() > 0.76,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.17,
    });
  }
}

function animateCakeFireworks(time) {
  if (!cakeFireworksActive || cakePage.hidden || document.hidden) {
    fireworksFrame = 0;
    return;
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  cakeFireworksContext.clearRect(0, 0, width, height);
  const frameScale = lastCakeFrame ? Math.min((time - lastCakeFrame) / 16.667, 2) : 1;
  lastCakeFrame = time;

  fireworksParticles = fireworksParticles.filter((particle) => particle.alpha > 0.025);
  for (const particle of fireworksParticles) {
    particle.x += particle.vx * frameScale;
    particle.y += particle.vy * frameScale;
    particle.vy += particle.gravity * frameScale;
    particle.vx *= Math.pow(0.993, frameScale);
    particle.alpha -= particle.decay * frameScale;
    particle.rotation += particle.rotationSpeed * frameScale;
    cakeFireworksContext.globalAlpha = Math.max(0, particle.alpha);
    cakeFireworksContext.fillStyle = particle.color;
    if (particle.confetti) {
      cakeFireworksContext.save();
      cakeFireworksContext.translate(particle.x, particle.y);
      cakeFireworksContext.rotate(particle.rotation);
      cakeFireworksContext.fillRect(-particle.size / 2, -particle.size * 1.4, particle.size, particle.size * 2.8);
      cakeFireworksContext.restore();
    } else {
      cakeFireworksContext.beginPath();
      cakeFireworksContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      cakeFireworksContext.fill();
    }
  }
  cakeFireworksContext.globalAlpha = 1;

  if (time < fireworksUntil) {
    if (fireworksMode === "shower" && time - lastFireworkEmission > (reducedMotion.matches ? 120 : 65)) {
      lastFireworkEmission = time;
      const count = reducedMotion.matches ? 2 : 4;
      for (let i = 0; i < count; i += 1) {
        if (fireworksParticles.length >= maxCakeParticles) break;
        fireworksParticles.push({
          x: Math.random() * width,
          y: -8 - Math.random() * 70,
          vx: (Math.random() - 0.5) * 0.7,
          vy: 1.3 + Math.random() * 2.1,
          gravity: 0.012,
          size: 0.8 + Math.random() * 2,
          alpha: 0.75 + Math.random() * 0.25,
          decay: 0.009 + Math.random() * 0.008,
          color: ["#ffe7ad", "#f8c978", "#f5e2ff", "#fff8e8"][Math.floor(Math.random() * 4)],
          confetti: Math.random() > 0.85,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
        });
      }
    }
    fireworksFrame = requestAnimationFrame(animateCakeFireworks);
  } else if (!fireworksTailStarted) {
    fireworksTailStarted = true;
    fireworksMode = "burst";
    fireworksUntil = time + (reducedMotion.matches ? 300 : 850);
    fireworksFrame = requestAnimationFrame(animateCakeFireworks);
  } else if (time < fireworksUntil) {
    fireworksFrame = requestAnimationFrame(animateCakeFireworks);
  } else {
    cakeFireworksContext.clearRect(0, 0, width, height);
    fireworksMode = "";
    cakeFireworksActive = false;
    fireworksFrame = 0;
  }
}

let fireworksMode = "";
let fireworksUntil = 0;
let lastFireworkEmission = 0;
let fireworksTailStarted = false;
let lastCakeFrame = 0;
let cakeFireworksActive = false;
const maxCakeParticles = 240;

function launchEntranceSparkleShower() {
  resizeCakeCanvas();
  cancelAnimationFrame(fireworksFrame);
  fireworksParticles = [];
  fireworksMode = "shower";
  cakeFireworksActive = true;
  lastCakeFrame = 0;
  fireworksTailStarted = false;
  fireworksUntil = performance.now() + (reducedMotion.matches ? 300 : 1400);
  lastFireworkEmission = 0;
  fireworksFrame = requestAnimationFrame(animateCakeFireworks);
}

function launchCelebrationFireworks() {
  resizeCakeCanvas();
  fireworksParticles = [];
  fireworksMode = "burst";
  cakeFireworksActive = true;
  lastCakeFrame = 0;
  fireworksTailStarted = false;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const count = reducedMotion.matches ? 22 : 44;
  emitFireworkBurst(width * 0.23, height * 0.36, { count, speed: 5.2 });
  emitFireworkBurst(width * 0.76, height * 0.29, { count, speed: 5.7 });
  emitFireworkBurst(width * 0.5, height * 0.49, { count: reducedMotion.matches ? 14 : 30, speed: 4.2 });
  fireworksUntil = performance.now() + (reducedMotion.matches ? 500 : 1100);
  cancelAnimationFrame(fireworksFrame);
  fireworksFrame = requestAnimationFrame(animateCakeFireworks);
}

function stopCakeFireworks() {
  cakeFireworksActive = false;
  fireworksMode = "";
  fireworksParticles = [];
  lastCakeFrame = 0;
  if (fireworksFrame) cancelAnimationFrame(fireworksFrame);
  fireworksFrame = 0;
  cakeFireworksContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

function playBirthdayJingle() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const now = audioContext.currentTime;
  const melody = [
    { frequency: 523.25, start: 0, duration: 0.23 },
    { frequency: 523.25, start: 0.25, duration: 0.2 },
    { frequency: 587.33, start: 0.52, duration: 0.38 },
    { frequency: 523.25, start: 0.96, duration: 0.38 },
    { frequency: 698.46, start: 1.4, duration: 0.38 },
    { frequency: 659.25, start: 1.84, duration: 0.68 },
  ];

  for (const note of melody) {
    const oscillator = audioContext.createOscillator();
    const volume = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = note.frequency;
    volume.gain.setValueAtTime(0.0001, now + note.start);
    volume.gain.exponentialRampToValueAtTime(0.045, now + note.start + 0.025);
    volume.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.duration);
    oscillator.connect(volume);
    volume.connect(audioContext.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + 0.02);
  }

  window.setTimeout(() => audioContext.close(), 3000);
}

function stopMicrophone() {
  if (micFrame) cancelAnimationFrame(micFrame);
  micFrame = 0;
  if (audioStream) {
    audioStream.getTracks().forEach((track) => track.stop());
    audioStream = null;
  }
  if (micContext && micContext.state !== "closed") {
    micContext.close();
    micContext = null;
  }
}

function completeCakeCeremony() {
  if (cakeCeremonyComplete) return;
  cakeCeremonyComplete = true;
  stopMicrophone();
  cakePage.classList.add("is-blown");
  document.querySelector(".cake-controls").classList.add("is-complete");
  cakeBlowButton.disabled = true;
  cakeMicButton.disabled = true;
  cakeMicStatus.textContent = "Wish made. Let the celebration begin!";
  window.setTimeout(() => {
    cakeBlowButton.hidden = true;
    cakeMicButton.hidden = true;
  }, reducedMotion.matches ? 0 : 300);
  launchCelebrationFireworks();
  playBirthdayJingle();

  window.setTimeout(() => {
    birthdayCard.hidden = false;
    requestAnimationFrame(() => birthdayCard.classList.add("is-revealed"));
    cakeNext.disabled = false;
    birthdayCard.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "nearest" });
  }, reducedMotion.matches ? 0 : 380);
}

async function enableMicrophone() {
  if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext) {
    cakeMicStatus.textContent = "Microphone access needs HTTPS or localhost. You can still tap the candle button.";
    return;
  }

  cakeMicButton.disabled = true;
  cakeMicStatus.textContent = "Waiting for microphone permission…";
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true },
      video: false,
    });
    if (cakeCeremonyComplete) {
      stopMicrophone();
      return;
    }
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) {
      stopMicrophone();
      cakeMicButton.disabled = false;
      cakeMicStatus.textContent = "Microphone detection isn't supported here. Use the candle button instead.";
      return;
    }

    micContext = new AudioContextConstructor();
    const source = micContext.createMediaStreamSource(audioStream);
    const analyser = micContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let loudFrames = 0;
    cakeMicButton.classList.add("is-listening");
    cakeMicLabel.textContent = "Listening for a birthday blow…";
    cakeMicStatus.textContent = "Microphone on. Give the candles a gentle blow when you're ready.";

    const listen = () => {
      if (cakeCeremonyComplete || !audioStream) return;
      analyser.getByteTimeDomainData(samples);
      let energy = 0;
      for (const sample of samples) {
        const centered = (sample - 128) / 128;
        energy += centered * centered;
      }
      const volume = Math.sqrt(energy / samples.length);
      loudFrames = volume > 0.055 ? loudFrames + 1 : Math.max(0, loudFrames - 1);
      if (loudFrames >= 4) {
        cakeMicStatus.textContent = "That did it!";
        completeCakeCeremony();
        return;
      }
      micFrame = requestAnimationFrame(listen);
    };
    micFrame = requestAnimationFrame(listen);
  } catch (error) {
    stopMicrophone();
    if (cakeCeremonyComplete) return;
    cakeMicButton.disabled = false;
    const messages = {
      NotAllowedError: "Microphone permission was declined. You can still tap the candle button.",
      NotFoundError: "No microphone was found. You can still tap the candle button.",
      NotReadableError: "The microphone is busy. You can still tap the candle button.",
      SecurityError: "Microphone access is blocked here. You can still tap the candle button.",
    };
    const message = messages[error.name] || "Couldn't start microphone detection. You can still tap the candle button.";
    cakeMicStatus.textContent = message;
  }
}

function showCakePage() {
  constellationPage.hidden = true;
  constellationPage.inert = true;
  cakePage.hidden = false;
  cakePage.inert = false;
  cakePage.classList.remove("is-leaving");
  document.title = "The Birthday Wish Ceremony";
  requestAnimationFrame(() => {
    cakePage.classList.add("is-entering");
    launchEntranceSparkleShower();
  });
}

function continueToLetter() {
  if (!cakeCeremonyComplete) return;
  cakeNext.disabled = true;
  stopCakeFireworks();
  cakePage.classList.add("is-leaving");
  window.setTimeout(() => {
    const detail = { from: 5, to: 6 };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));
    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, 600);
}

function showSecretLetter() {
  window.setTimeout(() => {
    cakePage.hidden = true;
    cakePage.inert = true;
    envelopePage.hidden = false;
    envelopePage.inert = false;
    document.title = "A Secret Birthday Letter";
    requestAnimationFrame(() => envelopePage.classList.add("is-entering"));
  }, 400);
}

function playSealCrack() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return;

  const audioContext = new AudioContextConstructor();
  const now = audioContext.currentTime;
  const buffer = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * 0.12), audioContext.sampleRate);
  const samples = buffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) {
    samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length);
  }

  const noise = audioContext.createBufferSource();
  const noiseGain = audioContext.createGain();
  const tone = audioContext.createOscillator();
  const toneGain = audioContext.createGain();
  noise.buffer = buffer;
  noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.08, now + 0.008);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  tone.type = "triangle";
  tone.frequency.setValueAtTime(430, now);
  tone.frequency.exponentialRampToValueAtTime(175, now + 0.13);
  toneGain.gain.setValueAtTime(0.0001, now);
  toneGain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
  toneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
  noise.connect(noiseGain);
  tone.connect(toneGain);
  noiseGain.connect(audioContext.destination);
  toneGain.connect(audioContext.destination);
  noise.start(now);
  tone.start(now);
  noise.stop(now + 0.13);
  tone.stop(now + 0.18);
  window.setTimeout(() => audioContext.close(), 450);
}

function burstSealGlitter() {
  const bounds = envelopeSeal.getBoundingClientRect();
  const originX = bounds.left + bounds.width / 2;
  const originY = bounds.top + bounds.height / 2;
  const colors = ["#a92f3a", "#d7524e", "#f4d58f", "#fff0c4", "#c48a4b"];
  envelopeParticleLayer.replaceChildren();
  envelopeParticleLayer.style.left = `${originX}px`;
  envelopeParticleLayer.style.top = `${originY}px`;

  for (let i = 0; i < 42; i += 1) {
    const angle = (Math.PI * 2 * i) / 42 + (Math.random() - 0.5) * 0.28;
    const distance = 28 + Math.random() * 82;
    const particle = document.createElement("span");
    particle.className = "envelope-glitter";
    particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    particle.style.setProperty("--size", `${2 + Math.random() * 3}px`);
    particle.style.setProperty("--glitter-color", colors[Math.floor(Math.random() * colors.length)]);
    particle.style.setProperty("--glitter-delay", `${Math.random() * 100}ms`);
    envelopeParticleLayer.append(particle);
  }

  window.setTimeout(() => envelopeParticleLayer.replaceChildren(), 1000);
}

function updateLetterReading() {
  if (!letterUnfolded || letterRead) return;
  const atEnd = letterScroll.scrollTop + letterScroll.clientHeight >= letterScroll.scrollHeight - 12;
  if (!atEnd) return;

  letterRead = true;
  envelopeNext.disabled = false;
  letterReadHint.textContent = "A little something to remember. The next chapter is waiting.";
  letterReadHint.classList.add("is-read");
  envelopePage.classList.add("is-read");
}

function openSecretLetter() {
  if (envelopeOpened) return;
  envelopeOpened = true;
  envelopePage.classList.add("is-seal-broken");
  envelopeWrap.classList.add("is-open");
  envelopeDisplay.classList.add("is-opening");
  envelopeSeal.disabled = true;
  envelopeSeal.setAttribute("aria-label", "Wax seal broken");
  playSealCrack();
  burstSealGlitter();

  letterReveal.setAttribute("aria-hidden", "false");
  letterReveal.inert = false;
  let unfoldCompleted = false;
  const finishUnfold = () => {
    if (unfoldCompleted) return;
    unfoldCompleted = true;
    letterUnfolded = true;
    envelopePage.classList.add("is-unfolded");
    envelopeDisplay.classList.add("is-unfolded");
    letterReadHint.textContent = "Take your time. Read to the end to unlock the next chapter.";
    requestAnimationFrame(() => {
      if (letterScroll.scrollHeight <= letterScroll.clientHeight + 12) updateLetterReading();
    });
  };
  letterReveal.addEventListener("transitionend", (event) => {
    if (event.propertyName !== "max-height" || letterUnfolded) return;
    finishUnfold();
  });
  window.setTimeout(finishUnfold, reducedMotion.matches ? 30 : 1050);
}

function handleSealPointerDown(event) {
  if (envelopeOpened) return;
  sealPointerStart = { x: event.clientX, y: event.clientY };
  envelopeSeal.setPointerCapture?.(event.pointerId);
}

function handleSealPointerUp(event) {
  if (!sealPointerStart || envelopeOpened) return;
  const distance = Math.hypot(event.clientX - sealPointerStart.x, event.clientY - sealPointerStart.y);
  sealPointerStart = null;
  if (distance > 24) {
    event.preventDefault();
    openSecretLetter();
  }
}

function continueToMemoryLane() {
  if (!letterRead || !letterUnfolded) return;
  envelopeNext.disabled = true;
  envelopePage.classList.add("is-leaving");
  window.setTimeout(() => {
    const detail = { from: 6, to: 7 };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));
    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, 600);
}

function showCollectorPage() {
  window.setTimeout(() => {
    envelopePage.hidden = true;
    envelopePage.inert = true;
    collectorPage.hidden = false;
    collectorPage.inert = false;
    document.title = "Collect the Birthday Blessings";
    requestAnimationFrame(() => {
      collectorPage.classList.add("is-entering");
      resizeCollectorCanvas();
      startCollectorSpawning();
      startCollectorAnimation();
      collectorArena.focus({ preventScroll: true });
    });
  }, 400);
}

function spawnNextCollectorItem() {
  if (collectorComplete || collectorGreeting.hidden === false) return;
  if (collectorArena.querySelectorAll(".collector-balloon").length >= 6) return;
  const assets = ["img1.png", "img2.png", "img3.png"];
  const asset = assets[Math.floor(Math.random() * assets.length)];
  const balloon = document.createElement("button");
  const image = document.createElement("img");
  const width = 76;
  const height = 88;
  const duration = 6.5 + Math.random() * 1.5;
  balloon.className = "collector-balloon";
  balloon.type = "button";
  balloon.setAttribute("aria-label", "Collect a floating birthday gift");
  balloon.style.left = `${Math.random() * Math.max(0, collectorArena.clientWidth - width)}px`;
  balloon.style.setProperty("--float-distance", `-${Math.max(0, collectorArena.clientHeight + 60 - height)}px`);
  balloon.style.setProperty("--float-duration", `${duration}s`);
  image.src = asset;
  image.alt = "";
  balloon.append(image);
  balloon.addEventListener("animationend", () => balloon.remove(), { once: true });
  collectorArena.append(balloon);
}

function startCollectorSpawning() {
  window.clearInterval(collectorSpawnTimer);
  collectorArena.querySelectorAll(".collector-balloon, .collector-sparkle").forEach((element) => element.remove());
  for (let index = 0; index < 3; index += 1) spawnNextCollectorItem();
  collectorSpawnTimer = window.setInterval(spawnNextCollectorItem, 1000);
}

function resizeCollectorCanvas() {
  if (!window.innerWidth || !window.innerHeight) return;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  collectorWidth = window.innerWidth;
  collectorHeight = window.innerHeight;
  collectorCanvas.width = Math.round(collectorWidth * pixelRatio);
  collectorCanvas.height = Math.round(collectorHeight * pixelRatio);
  collectorContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  collectorDust = Array.from({ length: Math.max(45, Math.round(collectorWidth * collectorHeight / 9500)) }, () => ({
    x: Math.random() * collectorWidth,
    y: Math.random() * collectorHeight,
    radius: 0.4 + Math.random() * 1.2,
    alpha: 0.15 + Math.random() * 0.45,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawCollectorConfetti(delta) {
  collectorConfetti = collectorConfetti.filter((particle) => particle.life > 0);
  collectorConfetti.forEach((particle) => {
    if (!reducedMotion.matches) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 115 * delta;
      particle.rotation += particle.spin * delta;
      particle.life -= delta;
    }
    collectorContext.save();
    collectorContext.translate(particle.x, particle.y);
    collectorContext.rotate(particle.rotation);
    collectorContext.globalAlpha = Math.min(1, particle.life);
    collectorContext.fillStyle = particle.color;
    collectorContext.shadowColor = particle.color;
    collectorContext.shadowBlur = 8;
    collectorContext.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.6);
    collectorContext.restore();
  });
}

function drawCollectorFrame(timestamp) {
  const delta = collectorLastFrame ? Math.min((timestamp - collectorLastFrame) / 1000, 0.04) : 0;
  collectorLastFrame = timestamp;
  collectorElapsed += delta * 1000;
  collectorContext.clearRect(0, 0, collectorWidth, collectorHeight);

  collectorDust.forEach((dust) => {
    const twinkle = reducedMotion.matches ? 1 : 0.65 + Math.sin(collectorElapsed * 0.001 + dust.phase) * 0.3;
    collectorContext.fillStyle = `rgba(245, 220, 202, ${dust.alpha * twinkle})`;
    collectorContext.beginPath();
    collectorContext.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
    collectorContext.fill();
  });

  drawCollectorConfetti(delta);
  collectorFrame = window.requestAnimationFrame(drawCollectorFrame);
}

function startCollectorAnimation() {
  window.cancelAnimationFrame(collectorFrame);
  collectorLastFrame = 0;
  collectorFrame = window.requestAnimationFrame(drawCollectorFrame);
}

function playCollectorPop() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  if (!collectorAudio) collectorAudio = new AudioContextClass();
  if (collectorAudio.state === "suspended") collectorAudio.resume();

  const oscillator = collectorAudio.createOscillator();
  const gain = collectorAudio.createGain();
  const now = collectorAudio.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(620, now);
  oscillator.frequency.exponentialRampToValueAtTime(180, now + 0.1);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
  oscillator.connect(gain);
  gain.connect(collectorAudio.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.15);
}

function createCollectorSparkle(balloon) {
  const balloonRect = balloon.getBoundingClientRect();
  const arenaRect = collectorArena.getBoundingClientRect();
  const originX = balloonRect.left - arenaRect.left + balloonRect.width / 2;
  const originY = balloonRect.top - arenaRect.top + balloonRect.height / 2;
  for (let index = 0; index < 8; index += 1) {
    const angle = (Math.PI * 2 * index) / 8;
    const distance = 18 + Math.random() * 16;
    const sparkle = document.createElement("span");
    sparkle.className = "collector-sparkle";
    sparkle.setAttribute("aria-hidden", "true");
    sparkle.style.left = `${originX}px`;
    sparkle.style.top = `${originY}px`;
    sparkle.style.setProperty("--sparkle-x", `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty("--sparkle-y", `${Math.sin(angle) * distance}px`);
    sparkle.addEventListener("animationend", () => sparkle.remove(), { once: true });
    collectorArena.append(sparkle);
  }
}

function openCollectorGreeting(index, balloon) {
  if (collectedBlessings.has(index) || collectorComplete) return;
  collectedBlessings.add(index);
  if (balloon) {
    createCollectorSparkle(balloon);
    balloon.remove();
  }
  collectorProgressCount.textContent = String(collectedBlessings.size);
  collectorProgressBar.style.width = `${collectedBlessings.size * 20}%`;
  playCollectorPop();

  if (collectedBlessings.size === birthdayBlessings.length) {
    collectorGrand.querySelector(".collector-grand__final-greeting").textContent = birthdayBlessings[index];
    revealCollectorGrand();
    return;
  }

  collectorGreetingMessage.textContent = birthdayBlessings[index];
  collectorGreetingContinue.querySelector(".button__label").textContent = "Keep collecting";
  collectorGreeting.hidden = false;
  collectorGreetingContinue.focus({ preventScroll: true });
}

function handleCollectorPointer(event) {
  if (collectorGreeting.hidden === false || collectorComplete) return;
  const balloon = event.target.closest(".collector-balloon");
  if (!balloon) return;
  const nextBlessing = birthdayBlessings.findIndex((_, index) => !collectedBlessings.has(index));
  if (nextBlessing >= 0) openCollectorGreeting(nextBlessing, balloon);
}

function handleCollectorKeyboard(event) {
  if ((event.key === " " || event.key === "Enter") && collectorGreeting.hidden && !collectorComplete) {
    event.preventDefault();
    const focusedBalloon = event.target.closest(".collector-balloon");
    const balloon = focusedBalloon || collectorArena.querySelector(".collector-balloon");
    const nextBlessing = birthdayBlessings.findIndex((_, index) => !collectedBlessings.has(index));
    if (balloon && nextBlessing >= 0) openCollectorGreeting(nextBlessing, balloon);
  }
}

function finishCollectorGreeting() {
  collectorGreeting.hidden = true;
  collectorArena.focus({ preventScroll: true });
  spawnNextCollectorItem();
}

function revealCollectorGrand() {
  collectorComplete = true;
  window.clearInterval(collectorSpawnTimer);
  collectorSpawnTimer = 0;
  collectorArena.querySelectorAll(".collector-balloon").forEach((balloon) => balloon.remove());
  collectorPage.classList.add("is-complete");
  collectorGrand.hidden = false;
  collectorFooter.hidden = false;
  collectorNext.disabled = false;
  collectorPage.querySelector(".collector-play-hint").hidden = true;
  burstCollectorConfetti();
  collectorNext.focus({ preventScroll: true });
}

function closeCollectorGreeting() {
  if (!collectorGreeting.hidden && collectedBlessings.size < birthdayBlessings.length) {
    collectorGreeting.hidden = true;
    collectorArena.focus({ preventScroll: true });
    spawnNextCollectorItem();
  }
}

function burstCollectorConfetti() {
  const colors = ["#f7d99d", "#e8a5b5", "#fff0d8", "#d6a4df", "#f1bd78"];
  const originX = collectorWidth / 2;
  const originY = collectorHeight / 2;
  const count = reducedMotion.matches ? 60 : 210;
  collectorConfetti = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 55 + Math.random() * 245;
    const life = reducedMotion.matches ? 1 : 2.7 + Math.random() * 1.2;
    return {
      x: originX,
      y: originY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 50,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 8,
      size: 2 + Math.random() * 4,
      life,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  });
}

function continueToGrandFinale() {
  if (!collectorComplete) return;
  collectorNext.disabled = true;
  collectorPage.classList.add("is-leaving");
  window.setTimeout(() => {
    window.cancelAnimationFrame(collectorFrame);
    window.clearInterval(collectorSpawnTimer);
    collectorSpawnTimer = 0;
    collectorPage.hidden = true;
    collectorPage.inert = true;
    const detail = { from: 7, to: 8 };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));
    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, 600);
}

function showGrandFinale() {
  collectorPage.hidden = true;
  collectorPage.inert = true;
  finalePage.hidden = false;
  finalePage.inert = false;
  document.title = "The Grand Finale — Happy Birthday";
  resizeFinaleCanvas();
  finalePage.classList.remove("is-leaving");
  finaleLastFrame = 0;
  finaleElapsed = 0;
  finaleParticles = [];
  const burstCount = reducedMotion.matches ? 3 : 7;
  for (let index = 0; index < burstCount; index += 1) {
    createFinaleBurst(
      finaleWidth * (0.12 + Math.random() * 0.76),
      finaleHeight * (0.08 + Math.random() * 0.58),
      reducedMotion.matches ? 18 : 42,
    );
  }
  finaleNextBurst = 500;
  finaleFrame = window.requestAnimationFrame(drawFinaleFrame);
  finaleNext.focus({ preventScroll: true });
}

function resizeFinaleCanvas() {
  const rect = finalePage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  finaleWidth = rect.width;
  finaleHeight = rect.height;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  finaleCanvas.width = Math.round(finaleWidth * pixelRatio);
  finaleCanvas.height = Math.round(finaleHeight * pixelRatio);
  finaleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createFinaleBurst(x, y, count) {
  const colors = ["#fff0cf", "#f0cb91", "#e6a8b2", "#f8dfaa", "#d9b9e8"];
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 45 + Math.random() * 190;
    const life = 1.1 + Math.random() * 1.8;
    finaleParticles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      size: 1 + Math.random() * 2.4,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }
}

function drawFinaleFrame(timestamp) {
  const delta = finaleLastFrame ? Math.min((timestamp - finaleLastFrame) / 1000, 0.04) : 0;
  finaleLastFrame = timestamp;
  finaleElapsed += delta * 1000;
  finaleContext.clearRect(0, 0, finaleWidth, finaleHeight);

  if (finaleElapsed >= finaleNextBurst && !reducedMotion.matches) {
    createFinaleBurst(
      finaleWidth * (0.14 + Math.random() * 0.72),
      finaleHeight * (0.08 + Math.random() * 0.48),
      36 + Math.floor(Math.random() * 25),
    );
    finaleNextBurst = finaleElapsed + 720 + Math.random() * 480;
  }

  finaleParticles = finaleParticles.filter((particle) => particle.life > 0);
  finaleParticles.forEach((particle) => {
    if (!reducedMotion.matches) {
      particle.x += particle.vx * delta;
      particle.y += particle.vy * delta;
      particle.vy += 42 * delta;
      particle.life -= delta;
    }
    const opacity = Math.max(0, particle.life / particle.maxLife);
    finaleContext.save();
    finaleContext.globalAlpha = opacity;
    finaleContext.fillStyle = particle.color;
    finaleContext.shadowColor = particle.color;
    finaleContext.shadowBlur = 13;
    finaleContext.beginPath();
    finaleContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    finaleContext.fill();
    finaleContext.restore();
  });

  finaleFrame = window.requestAnimationFrame(drawFinaleFrame);
}

function continueToApology() {
  finaleNext.disabled = true;
  finalePage.classList.add("is-leaving");
  window.setTimeout(() => {
    window.cancelAnimationFrame(finaleFrame);
    finalePage.hidden = true;
    finalePage.inert = true;
    const detail = { from: 8, to: 9 };
    window.dispatchEvent(new CustomEvent("birthday:page-change", { bubbles: true, detail }));
    if (typeof window.onBirthdayPageChange === "function") {
      window.onBirthdayPageChange(detail);
    }
  }, reducedMotion.matches ? 0 : 600);
}

function showApologyPage() {
  apologyPage.hidden = false;
  apologyPage.inert = false;
  apologyPage.classList.remove("is-leaving");
  document.title = "A Heartfelt Final Note";
  apologyPage.querySelector(".apology-card").classList.remove("is-entering");
  requestAnimationFrame(() => {
    apologyPage.querySelector(".apology-card").classList.add("is-entering");
    apologyReplay.focus({ preventScroll: true });
  });
}

function replayFromApology() {
  apologyPage.classList.add("is-leaving");
  apologyReplay.disabled = true;
  window.setTimeout(() => window.location.reload(), reducedMotion.matches ? 0 : 650);
}

resizeCanvas();
drawStars();
window.addEventListener("resize", () => {
  cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawStars();
  if (!cakePage.hidden) resizeCakeCanvas();
  if (!collectorPage.hidden) resizeCollectorCanvas();
  if (!finalePage.hidden) resizeFinaleCanvas();
});
document.addEventListener("visibilitychange", () => {
  if (!cakeFireworksActive) return;
  if (document.hidden) {
    if (fireworksFrame) cancelAnimationFrame(fireworksFrame);
    fireworksFrame = 0;
  } else if (!cakePage.hidden && !fireworksFrame) {
    lastCakeFrame = 0;
    fireworksFrame = requestAnimationFrame(animateCakeFireworks);
  }
});
button.addEventListener("click", unlock);
window.addEventListener("birthday:page-change", (event) => {
  if (event.detail?.from === 1 && event.detail?.to === 2) showTimeline();
  if (event.detail?.from === 2 && event.detail?.to === 3) showWishes();
  if (event.detail?.from === 3 && event.detail?.to === 4) showConstellation();
  if (event.detail?.from === 4 && event.detail?.to === 5) showCakePage();
  if (event.detail?.from === 5 && event.detail?.to === 6) showSecretLetter();
  if (event.detail?.from === 6 && event.detail?.to === 7) showCollectorPage();
  if (event.detail?.from === 7 && event.detail?.to === 8) showGrandFinale();
  if (event.detail?.from === 8 && event.detail?.to === 9) showApologyPage();
});
memoryCard.addEventListener("click", flipMemoryCard);
timelineNext.addEventListener("click", enterMemoryLane);
wishOptions.forEach((option) => option.addEventListener("click", selectWish));
wishNext.addEventListener("click", continueFromWishes);
traitOrbs.forEach((orb) => orb.addEventListener("click", openTrait));
traitDialogCloseButtons.forEach((closeButton) => {
  closeButton.addEventListener("click", closeTrait);
});
constellationNext.addEventListener("click", continueFromConstellation);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeTrait();
});
cakeBlowButton.addEventListener("click", completeCakeCeremony);
cakeMicButton.addEventListener("click", enableMicrophone);
cakeNext.addEventListener("click", continueToLetter);
envelopeSeal.addEventListener("click", openSecretLetter);
envelopeSeal.addEventListener("pointerdown", handleSealPointerDown);
envelopeSeal.addEventListener("pointerup", handleSealPointerUp);
letterScroll.addEventListener("scroll", updateLetterReading, { passive: true });
envelopeNext.addEventListener("click", continueToMemoryLane);
collectorArena.addEventListener("click", handleCollectorPointer);
collectorArena.addEventListener("keydown", handleCollectorKeyboard);
collectorGreetingContinue.addEventListener("click", finishCollectorGreeting);
collectorGreeting.querySelector(".collector-greeting__backdrop").addEventListener("click", closeCollectorGreeting);
collectorNext.addEventListener("click", continueToGrandFinale);
finaleNext.addEventListener("click", continueToApology);
apologyReplay.addEventListener("click", replayFromApology);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCollectorGreeting();
});
