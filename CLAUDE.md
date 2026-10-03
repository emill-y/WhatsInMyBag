# What's In My Bag — working notes for Claude Code

Women-first app that knows what's in every bag (makeup, diaper, travel, everyday), predicts run-outs, reminds to restock, suggests dupes, and offers a curated shop. Tagline: "Everything you carry, handled."

Status: Milestone 1 first draft (clickable demo, mock data, no backend). Deploys to Vercel as a static web export; primary device is iPhone Safari.

## Stack
Expo SDK 54 + TypeScript + expo-router · Zustand (`src/store.ts`) · react-native-svg · lucide-react-native · EB Garamond + Inter via @expo-google-fonts.
Animations currently use RN `Animated`; `react-native-reanimated` is in the spec but not installed yet. Ask before adding any other dependency.

## Design rules (hard)
- Colours only from `src/theme/tokens.ts`: ink #000, paper #FFF, porcelain #F5F4F1, line #E6E3DD, stone #6B6B6B, gold #B8975A, goldDeep #8A6A35. No red/green.
- No gradients, glows or shadows. Flat fills, 1px hairlines. Cards radius 4; chips/buttons full pills.
- EB Garamond for headings/body/product names (italic for labels); Inter only for small UI text (tabs, chips, prices).
- Sentence case. No AI/sparkle/magic wording or iconography. Thin 1.25 stroke icons.
- Gold never for body text on white; small gold text uses goldDeep.
- Motion only on user action; Surprise Bag opening is the one signature animation; respect reduced motion.
- Original bag illustration, fictional brands only. Product images are placeholder SVG silhouettes (`ProductArt`) until real cut-outs arrive.

## Milestones
1. Clickable demo (this). 2. Supabase auth/data + push/email notifications. 3. Real scanning (vision via server fn) + affiliate catalog. 4. Trip live data, sponsored, premium, sharing.

## Checks
`npm run typecheck` · `npx expo export -p web` · grep for `shadow|gradient` and hex values outside tokens.
