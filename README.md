# Chelsea · What's in my bag

*Everything you carry, handled.* Chelsea knows what's in every bag you carry, restocks before you run out, and lets you borrow lists from other women. Expo + expo-router app (iOS, Android, web) plus a static marketing website.

## Run locally
```bash
npm install
npm run web                 # the app with live reload, http://localhost:8081
npm run build && npm run preview   # website + app exactly as Vercel serves them, http://localhost:3000
```

## Deploy to Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```
`vercel.json` sets the build (`npm run build`), the output (`dist`) and routing: `/` is the website, everything else (`/welcome`, `/home`, …) is the app.

## Photos
Real photographs from [Unsplash](https://unsplash.com/license), loaded straight from Unsplash. To bundle them instead: `npm run photos`, commit `public/photos`, and set `EXPO_PUBLIC_PHOTO_BASE=/photos`.

## Layout
```
app/            app screens (expo-router)
website/        marketing homepage
src/theme       colour tokens + typography
src/data        sample accounts, products, community posts, photos
src/logic       depletion, search, notifications
src/components  shared UI
scripts/        build-site, preview server, photo download
```
