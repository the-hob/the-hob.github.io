/* ===========================================================
   The Hobbit — Audiobook chapter list
   -----------------------------------------------------------
   AUDIO:  drop an MP3 in "chapters/" and set available: true.
   IMAGES: drop a picture in "chapters/media/" and list it in the
           chapter's `media` array as { file, caption }. Each
           chapter's "View illustration" button opens a lightbox.
   File names are case-sensitive and must match exactly.
   =========================================================== */

const CHAPTERS = [
  {
    num: 1, title: "An Unexpected Party", file: "01.mp3", available: true,
    media: [
      { file: "01-thror-map.jpg", caption: "Thrór's Map" },
    ],
  },
  {
    num: 2, title: "Roast Mutton", file: "02.mp3", available: true,
    media: [
      { file: "02-trolls.jpeg", caption: "The Trolls" },
    ],
  },
  {
    num: 3, title: "A Short Rest", file: "03.mp3", available: true,
    media: [],
  },
  {
    num: 4, title: "Over Hill and Under Hill", file: "04.mp3", available: true,
    media: [
      { file: "04-mountain-path.png", caption: "The Mountain-path" },
    ],
  },
  {
    num: 5, title: "Riddles in the Dark", file: "05.mp3", available: true,
    media: [],
  },
  { num: 6, title: "Out of the Frying-Pan into the Fire", file: "06.mp3", available: false, media: [] },
  { num: 7, title: "Queer Lodgings",                      file: "07.mp3", available: false, media: [] },
  { num: 8, title: "Flies and Spiders",                   file: "08.mp3", available: false, media: [] },
];

const MEDIA_DIR = "assets/";
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

/* ---------- Build a chapter row ---------- */
function chapterNode(ch) {
  const li = document.createElement("li");
  li.className = "chapter " + (ch.available ? "available" : "locked");

  const num = document.createElement("span");
  num.className = "ch-num";
  num.textContent = `Chapter ${ROMAN[ch.num] || ch.num}`;

  const body = document.createElement("div");
  body.className = "ch-body";

  const title = document.createElement("h2");
  title.className = "ch-title";
  title.textContent = ch.title;
  body.appendChild(title);

  if (ch.available) {
    const src = "chapters/" + ch.file;

    const audio = document.createElement("audio");
    audio.className = "ch-audio";
    audio.controls = true;
    audio.preload = "metadata";
    audio.src = src;
    body.appendChild(audio);

    const actions = document.createElement("div");
    actions.className = "ch-actions";

    const dl = document.createElement("a");
    dl.href = src;
    dl.download = `The Hobbit - Chapter ${ch.num} - ${ch.title}.mp3`;
    dl.textContent = "Download";
    actions.appendChild(dl);

    if (ch.media && ch.media.length) {
      const view = document.createElement("button");
      view.type = "button";
      view.className = "ch-illus";
      view.textContent = ch.media.length > 1 ? "View illustrations" : "View illustration";
      view.addEventListener("click", () => openLightbox(ch.media, 0));
      actions.appendChild(view);
    }

    body.appendChild(actions);
  } else {
    const status = document.createElement("p");
    status.className = "ch-status";
    status.textContent = "Still Editing!";
    body.appendChild(status);
  }

  li.appendChild(num);
  li.appendChild(body);
  return li;
}

/* ---------- Lightbox ---------- */
let lbItems = [];
let lbIndex = 0;

const lb        = document.getElementById("lightbox");
const lbImg     = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");
const lbPrev    = document.querySelector(".lb-prev");
const lbNext    = document.querySelector(".lb-next");
const lbClose   = document.querySelector(".lb-close");

function showLbItem() {
  const item = lbItems[lbIndex];
  lbImg.src = MEDIA_DIR + item.file;
  lbImg.alt = item.caption || "";
  lbCaption.textContent = item.caption || "";
  const many = lbItems.length > 1;
  lbPrev.classList.toggle("hidden", !many);
  lbNext.classList.toggle("hidden", !many);
}

function openLightbox(items, index) {
  lbItems = items;
  lbIndex = index;
  showLbItem();
  lb.hidden = false;
}

function closeLightbox() { lb.hidden = true; lbImg.src = ""; }
function step(delta) {
  lbIndex = (lbIndex + delta + lbItems.length) % lbItems.length;
  showLbItem();
}

/* Friendly placeholder if an image file hasn't been added yet */
lbImg.addEventListener("error", () => {
  lbCaption.textContent =
    `Image not found — add "${MEDIA_DIR}${lbItems[lbIndex].file}"`;
});

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => step(-1));
lbNext.addEventListener("click", () => step(1));
lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
document.addEventListener("keydown", (e) => {
  if (lb.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft" && lbItems.length > 1) step(-1);
  if (e.key === "ArrowRight" && lbItems.length > 1) step(1);
});

/* ---------- Render ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("chapter-list");
  CHAPTERS.forEach((ch) => list.appendChild(chapterNode(ch)));
});

/* ===========================================================
   Riddle gate
   -----------------------------------------------------------
   The answer is never stored in plain text — only the SHA-256
   hash of the (lower-cased, trimmed) answer. To change the
   riddle: edit the text in index.html and replace ANSWER_HASH
   below with the hash of your new answer. Generate one with:
       printf '%s' "youranswer" | shasum -a 256
   =========================================================== */

const ANSWER_HASH =
  "1ed3abbac1582570fb62de965d106755e3cfb0513d1b4e814cf2b099f0695914";
const UNLOCK_KEY = "hobbit-riddle-unlocked";

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function unlockSite() {
  document.body.classList.remove("locked");
  const gate = document.getElementById("gate");
  if (gate) gate.remove();
}

document.addEventListener("DOMContentLoaded", () => {
  // Stay unlocked for the rest of this browser session
  if (sessionStorage.getItem(UNLOCK_KEY) === "yes") {
    unlockSite();
    return;
  }

  const form  = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const msg   = document.getElementById("gate-msg");
  if (input) input.focus();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const guess = input.value.trim().toLowerCase().replace(/[.!?]+$/, "");
    const hash = await sha256Hex(guess);
    if (hash === ANSWER_HASH) {
      sessionStorage.setItem(UNLOCK_KEY, "yes");
      unlockSite();
    } else {
      msg.textContent = "That is not the answer. Think again, and guess again.";
      input.select();
    }
  });
});
