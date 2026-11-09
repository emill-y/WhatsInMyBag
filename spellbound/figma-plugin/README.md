# Spellbound · Figma file builder

A Figma plugin that builds the complete Spellbound design file in about a minute: cover, case study, design system, component library, 16 hi-fi screens and a wired prototype. Everything is native Figma: variables, text styles, components with variants and properties, and auto layout throughout.

## Run it (Figma desktop app)

Development plugins only run in the **desktop app**, not in the browser.

1. Download this folder (`spellbound/figma-plugin/`) to your computer. It needs `manifest.json` and `code.js`; nothing else, no install.
2. In Figma desktop, create a **new, empty design file**. If an earlier run stopped partway, start a fresh file; the plugin won't build into a file that already has layers.
3. Menu → **Plugins → Development → Import plugin from manifest…** and pick `manifest.json`.
4. Menu → **Plugins → Development → Spellbound · build design file**. A **Spellbound** panel opens and ticks off each step: fonts, variables, every component, all 16 screens, the design system, the case study, the cover, the prototype links. Leave Figma alone until the panel says *Built*.
5. Open the **Prototype** page. In the right panel, under **Prototype**, set the device to **iPhone 15** (or 16). Press **Present**, choose a flow, and click through.

**Fonts:** Inter ships with Figma. The verdict headlines use **Instrument Serif** (a Google font). If it isn't available, the plugin falls back to Playfair Display, then Inter. Nothing breaks, but install Instrument Serif first for the intended look.

### If something goes wrong

The panel lists anything that failed, with Figma's exact error. One failed piece doesn't stop the rest: a screen that can't be built is replaced by a labelled placeholder frame, and the build carries on. Press **Copy log** and send the log over; it names the exact step to fix.

## What you get

Three pages, so it works on every Figma plan (the free Starter plan allows three per file):

| Page | Contents |
|---|---|
| **Cover & story** | 1920 × 1080 cover, set as the file thumbnail. Below it, the case study: problem · insight (operant conditioning, Ramp's "in the moment") · the idea · how Spellcheck decides · the loop · user flow · Ramp Family · design principles. |
| **Design system** | **Component library:** Remy (Mood variant) · Button (6 styles, *Label* and *Show icon* properties) · Row/Purchase and Row/Spell (icon is an instance-swap property) · segmented control · field · pill · stat tile · toast · notification · logo · iOS status bar and home indicator · 17 icons. **Beside it, the design system:** colour (variables with usage notes) · type (20 app styles + 9 presentation styles) · spacing and radius · icons · Remy's moods · motion and sound spec · voice. |
| **Prototype** | All 16 hi-fi screens, each with its design note, wired into 5 flows (below), plus the full-length home scroll. |

### Prototype flows

1. **First run:** Welcome → Start casting → Home.
2. **The spending moment:** Home → *Cast before you pay* (sheet slides up) → pick a purchase → Casting (auto-advances after 1.1 s) → verdict → Pay / Skip → Home with Remy's mood and stats updated.
   - Groceries → **Good spell**.
   - Water bill → **Good · on purpose**.
   - Matcha or hoodie → **Bad spell**.
   - The $275 clothes cart → **Bad · Mom's money**.
   - Dinner → **Meh**.
3. **Treat unlocked:** the matcha when you've earned charms → **Earned it**.
4. **Apple Pay matcha:** notification → Casting → **Just paid** → Remy wilts.
5. **Ramp Family:** Mom's view, *Send a nudge*, *Switch to Jordan*.

Also wired: "How Spellcheck decides" on Home opens the explainer (push transition). The avatar opens Mom's view.

### Built to be judged

- **Colour:** 18 colour variables (Brand, Surface, Text, Remy, Effect) bound to every fill, including inside Remy's artwork.
- **Spacing and radius:** 24 number variables bound to gaps, padding and corners.
- **Type:** every text layer uses one of 29 text styles. There are no loose overrides.
- **Components:** 73 components; every screen is built from instances.
- **Overlays:** fixed status bar and home indicator while screens scroll; sheet and toast pinned to the bottom; effects pinned to the centre.

## Change it

- Screens, copy and components live in `src/plugin.js`. Art (Remy, the wand, sparkles, smoke, icons) lives in `assets.json`. Rebuild with `node make.mjs`, which writes `code.js`.
- Re-export the art from the app with `node tools/extract-assets.mjs` (needs Playwright).
- **Test without Figma:** `node tools/mock-figma.mjs code.js` runs the build against a strict mock of the Figma API.
  - It fails on the mistakes real Figma rejects: FILL outside auto layout, unloaded fonts, bad component-property keys, prototype links to frames that aren't top-level, and more than 3 pages (the Starter limit; `PAGE_LIMIT=0` lifts it).
  - It reports layer counts, flows, dead ends and unstyled text.
  - Add `RENDER=1` to also write an HTML preview of every page.
