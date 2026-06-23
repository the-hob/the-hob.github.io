# The Hobbit — Audiobook site

A simple static HTML/JS site to play and download audiobook chapters.

## Add your audio
Put your MP3 files in the `chapters/` folder, named exactly:

```
chapters/01.mp3   ← Chapter 1: An Unexpected Party
chapters/02.mp3   ← Chapter 2: Roast Mutton
chapters/03.mp3   ← Chapter 3: A Short Rest
chapters/04.mp3   ← Chapter 4: Over Hill and Under Hill
chapters/05.mp3   ← Chapter 5: Riddles in the Dark
```

Chapters 6–9 show **(editing…)** and stay greyed out until you flip them on.
After Chapter 9 the page reads **still reading!**

## Map background
Drop your map image here:

```
assets/map.jpg
```

It fills the screen behind the parchment (faded + sepia-toned). If the file
is missing, the page falls back to a plain parchment texture — nothing breaks.
`.png` works too; just change the filename in `styles.css` (`body::before`).

## In-book illustrations (the "View illustration" button)
Each available chapter can show pictures from the book in a pop-up lightbox.
Put images in `chapters/media/` and list them in `script.js` under that
chapter's `media` array. The scaffold already references, for example:

```
chapters/media/ch01-thrors-map.jpg   → "Thrór's Map"
chapters/media/ch02-the-trolls.jpg   → "The Trolls"
chapters/media/ch03-rivendell.jpg    → "Rivendell"
```

Add the image file and the button appears automatically. Multiple images per
chapter get arrow navigation (← →); Esc or clicking outside closes it.
If an image isn't there yet, the lightbox shows a friendly "add this file" note.

> Note: the Wilderland map and Tolkien's illustrations are copyrighted, so they
> aren't bundled here — supply your own scans/files using the names above.

## Turn on more chapters later
Open `script.js`, drop the MP3 in `chapters/` (e.g. `06.mp3`), and change that
chapter's `available: false` to `available: true`.

## Preview locally
Simplest: just double-click `index.html` (or drag it into your browser).
Everything uses relative paths, so playback, downloads, and the illustration
lightbox all work straight from `file://`.

Optional — running a tiny local server makes audio seeking/scrubbing smoother
and matches how it'll behave once hosted online:

```
cd hobbit
python3 -m http.server 8000
```

Then open http://localhost:8000

## Hosting
Upload the whole `hobbit/` folder (including `chapters/`) to any static host —
GitHub Pages, Netlify, Cloudflare Pages, etc.
# the-hob.github.io
