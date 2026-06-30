/* ============================================================
   Pickleball Birthday Match — game logic
   ============================================================
   ✏️  EDIT THIS BLOCK — it's the only part you need to touch.
   ============================================================ */
const CONFIG = {
  playerName: "karen",        // ← your bestie's name
  prizeAmount: "i love seeing you grow into the person you are today",        // ← the prize headline
  prizeSub:    "you are so passionate about things you love and i want to help you be the best version of yourself",
  prizeNote:   "please find winry to redeem your grand prize 💛",

  // The 9 squares. Order = top-left → bottom-right.
  // Drop matching photos into  static/images/  named memory1.png ... memory9.png
  // (square photos look best). Until you do, a cute placeholder shows.
  memories: [
    { img: "memory1.png", caption: "you make arts & crafts so fun.. esp during holidays" },
    { img: "memory2.png", caption: "always room for ice cream" },
    { img: "memory3.png", caption: "MOOOOOOO!" },
    { img: "memory4.png", caption: "need s'more dinner nights with you" },
    { img: "memory5.png", caption: "future pdx roadtrips will look like" },
    { img: "memory6.png", caption: "catching flights with you >>>" },
    { img: "memory7.png", caption: "best doodauntie" },
    { img: "memory8.png", caption: "your reactions are the best" },
    { img: "memory9.png", caption: "im still wifey tho right" },
  ],
};
/* ============================================================
   You can stop reading here. The rest just runs the game.
   ============================================================ */

const STORAGE_KEY = "pickleball-birthday-v1";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const IDLE_SPRITE  = "static/images/player_idle.png";
const SWING_SPRITE = "static/images/player_swing.png";

// --- state -------------------------------------------------
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { revealed: Array(9).fill(false), won: false };
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
}

// --- elements ----------------------------------------------
const court      = document.getElementById("court");
const grid       = document.getElementById("grid");
const ball       = document.getElementById("ball");
const player     = document.getElementById("player");
const scoreEl    = document.getElementById("score");
const dialogue   = document.getElementById("dialogueText");
const winOverlay = document.getElementById("winOverlay");
const winFlash   = document.getElementById("winFlash");
const prizeBox   = document.getElementById("prizeBox");
const viewPrize  = document.getElementById("viewPrize");

let busy = false; // block clicks mid-serve

// --- build the board ---------------------------------------
function buildBoard() {
  CONFIG.memories.forEach((mem, i) => {
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "cell";
    cell.setAttribute("aria-label", "Serve into square " + (i + 1));
    cell.dataset.index = i;

    cell.innerHTML = `
      <span class="qmark">?</span>
      <span class="face">
        <img alt="${escapeHtml(mem.caption)}" />
        <span class="placeholder">
          <span class="ph-num">${i + 1}</span>
          <span>ADD<br>PHOTO</span>
        </span>
        <span class="caption">${escapeHtml(mem.caption)}</span>
      </span>`;

    // wire up the photo (with graceful placeholder fallback)
    const img = cell.querySelector("img");
    const ph  = cell.querySelector(".placeholder");
    img.src = "static/images/" + mem.img;
    img.onload  = () => { ph.style.display = "none"; };
    img.onerror = () => { img.style.display = "none"; }; // keep placeholder

    cell.addEventListener("click", () => onCellClick(i, cell));
    grid.appendChild(cell);

    if (state.revealed[i]) cell.classList.add("revealed");
  });
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// --- the serve ---------------------------------------------
function onCellClick(i, cell) {
  if (busy || state.revealed[i]) return;
  busy = true;

  player.src = SWING_SPRITE;
  setTimeout(() => { player.src = IDLE_SPRITE; }, 260);

  serveBallTo(cell, () => {
    revealCell(i, cell);
    busy = false;
  });
}

function serveBallTo(cell, done) {
  if (reduceMotion) { done(); return; }

  const wrap = court.parentElement.getBoundingClientRect();
  const start = player.getBoundingClientRect();
  const target = cell.getBoundingClientRect();

  const x0 = start.left - wrap.left + start.width / 2;
  const y0 = start.top  - wrap.top;
  const x1 = target.left - wrap.left + target.width / 2;
  const y1 = target.top  - wrap.top + target.height / 2;

  ball.classList.add("live");
  ball.style.left = "0px";
  ball.style.bottom = "auto";

  const dur = 520;
  const arc = Math.max(90, (y0 - y1) * 0.5 + 70); // hop height
  const t0 = performance.now();

  function frame(now) {
    let t = Math.min(1, (now - t0) / dur);
    const ease = t; // linear horizontal
    const x = x0 + (x1 - x0) * ease;
    const y = y0 + (y1 - y0) * ease - Math.sin(Math.PI * t) * arc;
    ball.style.transform = `translate(${x - 10}px, ${y - 10}px)`;
    if (t < 1) requestAnimationFrame(frame);
    else { ball.classList.remove("live"); done(); }
  }
  requestAnimationFrame(frame);
}

function revealCell(i, cell) {
  state.revealed[i] = true;
  saveState();

  cell.classList.add("revealed", "justRevealed", "flash");
  setTimeout(() => cell.classList.remove("justRevealed", "flash"), 400);

  const mem = CONFIG.memories[i];
  say(`Square ${i + 1}: “${mem.caption}” ♥`);

  updateScore();

  if (state.revealed.every(Boolean) && !state.won) {
    state.won = true;
    saveState();
    setTimeout(triggerWin, 650);
  }
}

function updateScore() {
  const n = state.revealed.filter(Boolean).length;
  scoreEl.textContent = `SERVE ${n}/9`;
}

function say(msg) { dialogue.textContent = msg; }

// --- winning -----------------------------------------------
function triggerWin() {
  // fill in prize text from CONFIG
  document.getElementById("prizeAmount").textContent = CONFIG.prizeAmount;
  document.getElementById("prizeSub").textContent    = CONFIG.prizeSub;
  document.getElementById("prizeNote").textContent   = CONFIG.prizeNote;

  winOverlay.hidden = false;
  prizeBox.hidden = true;
  winFlash.style.display = "block";

  confettiBurst();
  // flash "MATCH WON!" then drop the prize in
  setTimeout(() => {
    winFlash.style.display = reduceMotion ? "block" : "none";
    prizeBox.hidden = false;
    confettiBurst();
  }, reduceMotion ? 200 : 1500);
}

function showPrizeAgain() {
  document.getElementById("prizeAmount").textContent = CONFIG.prizeAmount;
  document.getElementById("prizeSub").textContent    = CONFIG.prizeSub;
  document.getElementById("prizeNote").textContent   = CONFIG.prizeNote;
  winOverlay.hidden = false;
  winFlash.style.display = "none";
  prizeBox.hidden = false;
  confettiBurst();
}

function confettiBurst() {
  if (reduceMotion) return;
  const colors = ["#ffc83d", "#ff5c8a", "#e8f33a", "#ffffff", "#f58fb6"];
  for (let k = 0; k < 60; k++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[k % colors.length];
    const dur = 1.6 + Math.random() * 1.8;
    c.style.animation = `fall ${dur}s linear ${Math.random() * 0.6}s forwards`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), (dur + 1) * 1000);
  }
}

// --- buttons & boot ----------------------------------------
document.getElementById("closeWin").addEventListener("click", () => {
  winOverlay.hidden = true;
});
viewPrize.addEventListener("click", showPrizeAgain);

document.getElementById("resetBtn").addEventListener("click", () => {
  if (confirm("Start a brand new game? This clears the revealed squares.")) {
    state = { revealed: Array(9).fill(false), won: false };
    saveState();
    location.reload();
  }
});

function boot() {
  // personalize the title text
  const title = document.getElementById("titleText");
  title.textContent = `HAPPY BIRTHDAY ${CONFIG.playerName.toUpperCase()}`;

  buildBoard();
  updateScore();

  if (state.won) {
    viewPrize.hidden = false;
    say(`You won the match! Tap a square to revisit a memory.`);
  } else {
    say(`happy birthday, ${CONFIG.playerName}! pick a square to serve to. clear all 9 to win.`);
  }
}

boot();
