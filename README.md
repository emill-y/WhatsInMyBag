# What's In My Bag

*Everything you carry, handled.* A clickable demo on mock data (Expo + expo-router, runs on iOS, Android and web). Three demos: Travel, Makeup and Mom.

## Run locally
```bash
npm install
npm run web        # opens in the browser; use responsive mode at 390×844 for iPhone
npm start          # Expo Go on a phone (scan the QR code)
```

## Deploy to Vercel
Import the repo in Vercel. `vercel.json` already sets the build (`npx expo export -p web`), output (`dist`) and SPA rewrites. No env vars needed.

On iPhone, open the URL in Safari → Share → *Add to Home Screen* for a full-screen app feel.

## Photos
Product and lifestyle photos are real photographs from [Unsplash](https://unsplash.com/license) and load straight from Unsplash by default. To bundle them with the app instead:
```bash
npm run photos                       # downloads to public/photos
EXPO_PUBLIC_PHOTO_BASE=/photos npm run web
```
For Vercel, commit `public/photos` and set `EXPO_PUBLIC_PHOTO_BASE=/photos` in the project's environment variables.

## Layout
```
app/            screens (expo-router)
src/theme       colour tokens + typography
src/data        demos (travel, makeup, mom), products, community posts, photos
src/logic       depletion, search
src/components  shared UI (pills, buttons, tiles, gauge, bag illustration)
```
