# Avatar Art Generation Kit

**Tool:** Gemini (gemini.google.com) — best at character consistency. ChatGPT as backup.
**Format:** Download each result as PNG, largest size offered, and save into this folder with the EXACT filename shown.
**Don't worry about backgrounds** — generate on a plain background; Claude removes backgrounds automatically afterward.

---

## STEP 1 — Create the master character (do this first)

Attach your photo `Mypic.PNG` to the chat, then send:

```
Create a cartoon character version of the person in this photo. Style: flat 2D
vector cartoon illustration, soft rounded shapes, thick clean outlines, friendly
and playful like a modern animated explainer video. Keep his key features: curly
black hair, warm smile, light brown skin, navy blue suit with white shirt (no tie).
Full body, standing straight facing the viewer, arms relaxed at sides, gentle
smile. Plain solid white background. Square image.
```

Save the result as: **`master.png`**

> If the likeness feels off (hair, smile), reply in the same chat: "make the hair
> curlier / smile bigger" etc. until it feels like you. This master image is the
> reference for everything else — get it right before moving on.

---

## STEP 2 — The 8 poses

For EACH pose below: start a message, **attach `master.png`**, and send the prompt.
Every prompt starts with the same lock-in line so the style never drifts.

### 2.1 — save as `wave.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: standing, waving hello enthusiastically with his right hand raised, big
happy smile, body facing viewer. Full body visible. Plain solid white background.
Square image.
```

### 2.2 — save as `laptop.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: sitting cross-legged on the ground with an open laptop on his lap,
typing, focused happy expression. Full body visible. Plain solid white background.
Square image.
```

### 2.3 — save as `peek.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: leaning far to one side as if peeking around a corner, curious raised
eyebrow, hands behind his back. Full body visible. Plain solid white background.
Square image.
```

### 2.4 — save as `point.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: pointing to his left side with one hand, looking toward where he points,
excited expression like he is showing off something cool. Full body visible.
Plain solid white background. Square image.
```

### 2.5 — save as `read.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: wearing round reading glasses, holding an open book in one hand, other
hand raised with index finger up like making a smart point, scholarly smile.
Full body visible. Plain solid white background. Square image.
```

### 2.6 — save as `celebrate.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: jumping with both arms up in celebration, huge joyful smile, confetti
pieces floating around him. Full body visible. Plain solid white background.
Square image.
```

### 2.7 — save as `bored.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: standing slouched, looking at his phone with a bored expression,
one hand in pocket. Full body visible. Plain solid white background. Square image.
```

### 2.8 — save as `lost.png`
```
Keep this exact same cartoon character, same style, same outfit, same proportions.
New pose: holding a paper map upside down, confused expression with a sweat drop,
scratching his head with the other hand. Full body visible. Plain solid white
background. Square image.
```

---

## STEP 3 — The head sprite (for the mouse-following trick)

Attach `master.png` again:

### 3.1 — save as `head.png`
```
Keep this exact same cartoon character, same style. Now show ONLY his head and
neck, large and centered, facing directly forward at the viewer, neutral friendly
smile, eyes looking straight ahead. Plain solid white background. Square image.
```

---

## STEP 4 — The 5 world scenes (wide images)

No attachment needed, but keep the style line. These are backgrounds, the
character should NOT appear in them.

### 4.1 — save as `scene-hill.png`
```
Wide landscape illustration in flat 2D vector cartoon style with soft rounded
shapes and thick clean outlines: a peaceful green grassy hill under a bright blue
sky with puffy white clouds and a warm yellow sun, one big friendly tree on the
right side, small wildflowers in the grass, a distant tiny city skyline on the
horizon. Cheerful daylight colors: sky blue, grass green, sunny yellow. No people,
no characters. 16:9 wide aspect ratio.
```

### 4.2 — save as `scene-workshop.png`
```
Wide landscape illustration in flat 2D vector cartoon style with soft rounded
shapes and thick clean outlines: the inside of a cozy inventor's workshop with
wooden workbenches, shelves with tools and gears, a corkboard with pinned notes,
soft warm lighting from a big window showing blue sky outside. Cheerful colors.
No people, no characters. 16:9 wide aspect ratio.
```

### 4.3 — save as `scene-library.png`
```
Wide landscape illustration in flat 2D vector cartoon style with soft rounded
shapes and thick clean outlines: a warm cozy library interior with tall wooden
bookshelves full of colorful books, a rolling ladder, a comfy reading chair,
sunbeams coming through a round window. Cheerful daylight colors. No people,
no characters. 16:9 wide aspect ratio.
```

### 4.4 — save as `scene-mailbox.png`
```
Wide landscape illustration in flat 2D vector cartoon style with soft rounded
shapes and thick clean outlines: a cheerful red mailbox on a wooden post standing
at the edge of a grassy meadow path, blue sky with puffy clouds, a few birds,
flowers around the path. Cheerful daylight colors. No people, no characters.
16:9 wide aspect ratio.
```

### 4.5 — save as `scene-woods.png`
```
Wide landscape illustration in flat 2D vector cartoon style with soft rounded
shapes and thick clean outlines: a slightly mysterious but still friendly forest
with tall trees, dappled light, a winding path disappearing into the woods, a
wooden signpost with arrows pointing in silly contradictory directions. Slightly
dimmer green tones but still cartoon-friendly, not scary. No people, no
characters. 16:9 wide aspect ratio.
```

---

## Checklist (15 files total)

- [ ] master.png
- [ ] wave.png
- [ ] laptop.png
- [ ] peek.png
- [ ] point.png
- [ ] read.png
- [ ] celebrate.png
- [ ] bored.png
- [ ] lost.png
- [ ] head.png
- [ ] scene-hill.png
- [ ] scene-workshop.png
- [ ] scene-library.png
- [ ] scene-mailbox.png
- [ ] scene-woods.png

When the files are in this folder, tell Claude "art is ready" and the build begins.
