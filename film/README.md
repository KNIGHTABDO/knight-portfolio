# The Knight's Move — hero film

An 8-second seamless loop made with the
[hand-drawn-canvas-animation](https://github.com/alesha-pro/tools/tree/main/skills/hand-drawn-canvas-animation)
skill (engine files `core.js`, `studio.js`, `cels.js`, `materials.js`, `render.mjs` are copied
from it under the MIT licence in `LICENSE-hand-drawn-canvas`).

A pencil chess knight keeps pace with a moving ECG strip and hops over every R-wave.
The brief, beat sheet and exposure notes live at the top of `knights-move.html`.

The film is drawn on pure white so the site can `mix-blend-mode: multiply` it onto its own
paper: white disappears, graphite and riso inks print through.

## Re-render

Requires Node 22+, Chrome/Chromium and ffmpeg on `PATH`.

```bash
cd film
npm i --no-audit --no-fund
node render.mjs knights-move.html --grid 24                 # contact sheet preview
node render.mjs knights-move.html --out out/wide            # 16:9, 1920 wide
node render.mjs knights-move.html --ar 1:1 --width 1080 --out out/square

# web encodes used by the site (public/film)
ffmpeg -framerate 24 -i out/wide/knights-move-frames/%04d.png -c:v libx264 -preset slow \
  -tune animation -crf 27 -pix_fmt yuv420p -movflags +faststart -an ../public/film/knights-move-wide.mp4
ffmpeg -framerate 24 -i out/square/knights-move-frames/%04d.png -c:v libx264 -preset slow \
  -tune animation -crf 27 -pix_fmt yuv420p -movflags +faststart -an ../public/film/knights-move-square.mp4
```

Open `knights-move.html` directly in a browser to scrub frame by frame.
