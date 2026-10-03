# What's In My Bag

*Everything you carry, handled.* Milestone 1 draft: a clickable demo on mock data (Expo + expo-router, runs on iOS, Android and web).

## Run locally
```bash
npm install
npm run web        # opens in the browser; use responsive mode at 390×844 for iPhone
npm start          # Expo Go on a phone (scan the QR code)
```

## Deploy to Vercel
Import the repo in Vercel. `vercel.json` already sets the build (`npx expo export -p web`), output (`dist`) and SPA rewrites. No env vars needed.

On iPhone, open the URL in Safari → Share → *Add to Home Screen* for a full-screen app feel.

## Layout
```
app/            screens (expo-router)
src/theme       colour tokens + typography
src/data        mock user, bags, items, 44 products, dupes, trip
src/logic       depletion, search, surprise
src/components  shared UI (pills, buttons, tiles, gauge, bag illustration)
```
