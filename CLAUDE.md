# Chelsea (What's in my bag) — working notes for Claude Code

Women-first app that knows what's in every bag (makeup, diaper, travel, everyday), predicts run-outs, reminds to restock, suggests dupes, and offers a curated shop. Tagline: "Everything you carry, handled."

Status: Milestone 1 demo, second pass (clickable, mock data, no backend). Deploys to Vercel as a static web export; primary device is iPhone Safari.

Product shape after the first walkthrough:
- Bag types: travel, makeup, mom (diaper), work, study. Users pick one or several.
- Onboarding asks the use case first, then only follow-ups for the chosen bags.
- The app is called Chelsea. Never show the word "demo" in the UI.
- Three sample accounts (`src/data/demos.ts`): Ava (travel), Sofia (makeup), Maya (mom). Reached via "I already have an account" on the welcome page.
- Welcome (`app/welcome.tsx`): one bag photo, "Chelsea", "What's in my bag", a short description. Nothing else.
- Tabs: Home · Search · Shop · Community · Profile.
  - Shop: products grouped by category (`CATEGORY_ORDER`), plus a full-screen swipe feed (`app/shop-feed.tsx`).
  - Community: people's bags as a swipe feed (For you) or browsed by bag type. One-tap import of a list, publish your own (`app/share.tsx`).
- Adding a bag uses `/onboarding?mode=add` and never asks for the name again.
- Navigation: `src/nav.ts` (`enterApp`, `goBack`, `openLink`). Signed-in users are redirected away from the welcome page.
- Every product links to a real retailer search (Amazon, Sephora or Target) via `retailerUrl`.
- Profile has a bag status tracker and reminders; the bell opens `/notifications`.
- The Surprise feature was removed.

Marketing website: `website/index.html` (static). `npm run build` puts it at `dist/index.html` and the app at `dist/app.html`; Vercel serves "/" as the website and every other path as the app.

## Stack
Expo SDK 54 + TypeScript + expo-router · Zustand (`src/store.ts`) · react-native-svg · lucide-react-native · EB Garamond + Inter via @expo-google-fonts.
Animations currently use RN `Animated`; `react-native-reanimated` is in the spec but not installed yet. Ask before adding any other dependency.

## Design rules (hard)
- Colours only from `src/theme/tokens.ts`: ink #000, paper #FFF, porcelain #F5F4F1, line #E6E3DD, stone #6B6B6B, gold #B8975A, goldDeep #8A6A35. No red/green.
- No gradients, glows or shadows. Flat fills, 1px hairlines. Cards radius 4; chips/buttons full pills.
- EB Garamond for headings/body/product names (italic for labels); Inter only for small UI text (tabs, chips, prices).
- Sentence case. No AI/sparkle/magic wording or iconography. Thin 1.25 stroke icons.
- Gold never for body text on white; small gold text uses goldDeep.
- Motion only on user action (photo fade-in, double-tap heart); respect reduced motion.
- Real photography only, never drawn or AI-generated. Every product has a photo of that specific kind of item (`Product.photo`, an Unsplash id). Load through `<Photo>` (`src/components/Photo.tsx`), which fades in and falls back to an italic serif label.
- Text on photos sits on `veil` (translucent paper) or `scrim` (translucent ink) tokens: flat layers, not gradients.
- Fictional brands only.

## Milestones
1. Clickable demo (this). 2. Supabase auth/data + push/email notifications. 3. Real scanning (vision via server fn) + affiliate catalog. 4. Trip live data, sponsored, premium, sharing.

## Checks
`npm run typecheck` · `npx expo export -p web` · grep for `shadow|gradient` and hex values outside tokens.

## Photos
Photos load from `unsplash.com/photos/<id>/download?w=…`. `npm run photos` downloads them to `public/photos/`; build with `EXPO_PUBLIC_PHOTO_BASE=/photos` to serve them locally.
