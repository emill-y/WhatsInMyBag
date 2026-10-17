# Spellbound · Ramp Family (hackathon demo)

Instant feedback on a purchase, right before or right after you pay. Remy the gecko reacts, a sound plays, and Spellcheck explains why.

One self-contained file (`index.html`): no build and no dependencies. Fonts come from Google Fonts. Sounds are made in the browser with Web Audio, so there are no sound files.

## Run it
- **On your phone:** deploy (`npm run build` copies it to `dist/spellbound/`, so it's at `https://<your-vercel-app>/spellbound/`). In Safari use Share → Add to Home Screen for a full-screen app with no browser bar while filming.
- **On a laptop:** open `spellbound/index.html` in a browser, or serve the folder with `npx serve spellbound`.
- Turn off silent mode on the iPhone, otherwise Web Audio is muted.

## Demo script (from a fresh start)
| Step | Tap | What happens |
|---|---|---|
| 1 | Cart · 6 clothing items, $275 | **Bad spell.** "That's Mom's money for the water bill." Smoke, sad trombone, Remy cries. Hit *Skip it*. |
| 2 | Iced oat matcha | **Bad spell.** "3rd matcha this week." It's bad because of how often, not because it's matcha. *Skip it* (+1 charm). |
| 3 | Weekly groceries | **Good spell.** Sparkles and a chime, Remy hops. *Pay*. |
| 4 | Water bill | **Good spell.** "Exactly what Mom sent it for." *Pay*. |
| 5 | Iced oat matcha again | **Meh: treat unlocked.** The charms you earned make it okay. This is the "no boy who cried wolf" moment. |
| 6 | Another hoodie | **Bad spell.** Over the clothing budget. |

"Just paid" (or the toggle in the sheet) logs a purchase that already happened and still gives instant feedback.

## Pop up while you shop (iOS Shortcuts)
A web page can't see inside other apps, so an iPhone Shortcut does the detecting and opens Spellbound with the purchase already loaded:

`<spellbound url>#spell?m=DoorDash&a=32.40` (optional `&mode=after`, `&i=item name`, `&c=category`)

Spellbound opens with a notification banner (*"Hold up · DoorDash, $32.40"*). Tap it and the spell is cast with the sound. Safari only allows sound after a tap, which is why there's a banner to tap.

**When DoorDash opens:** Shortcuts → Automation → + → App → DoorDash, *Is Opened*, *Run Immediately* → actions:
1. *Wait* 8 seconds (time to reach checkout)
2. *Show Notification* "Remy is watching this order 👀" (plays the system sound)
3. *Open URLs* → the link above

**When you tap Apple Pay in a store:** Automation → + → Transaction → your card → *Run Immediately* → *Open URLs* with `#spell?m=` + the **Merchant** variable + `&a=` + the **Amount** variable + `&mode=after`.

Links open in Safari, which keeps its own Spellbound state separate from the Home Screen copy, so film these in Safari.

## Filming shortcuts
- **Reset:** long-press the `JK` avatar, tap *Reset* at the bottom, or open the page with `#reset`.
- **Keyboard (desktop screen recordings):** `1`–`8` casts a preset before paying, `Shift`+`1`–`8` logs it as already paid, `Esc` takes the main button, `r` resets.
- You can also type any merchant into the sheet ("Trader Joe's", "boba", "Zara"…). The category is guessed live.

## How Spellcheck decides
A small logistic model that runs on the phone in microseconds (`spellcheck()` in `index.html`). Its features:
- how essential the category is
- room left in that budget
- how many purchases of the same kind in the last 7 days
- whether it dips into money a parent set aside, or matches what that money was for
- whether you have a charm to spend on a small treat
- how big the discretionary amount is

Score ≥ 66 is good, < 40 is bad, and anything in between is meh. Good spells and skipped bad ones earn charms and vibe; bad ones cost vibe. Remy's colour and mood follow your vibe, Tamagotchi style.
