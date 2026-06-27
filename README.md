# Mithu Love 💗

A private, romantic photo gallery built for one person to see.

## Run it

```bash
npm install
npm run dev
```

Open the URL it gives you (usually `http://localhost:5173`).

## Pages

- `/` — Landing page: the "I Love You Mithu" seal. Click it to enter.
- `/home` — Gallery: floating hearts + your photo grid with love notes. Open to everyone, no login needed to view. If you're signed in, you'll also see **"+ Add memory"**, caption editing, and delete (✕) controls. Visitors just see a small "Sign in" link tucked in the header.
- `/login` — Owner sign-in. Not linked anywhere visible except that small header link — share this URL with no one but yourself.

## Setting up your own login (one-time)

Firebase Authentication needs at least one account created before you can sign in:

1. Firebase console → **Build → Authentication** → **Get started**
2. Under **Sign-in method**, enable **Email/Password**
3. Go to the **Users** tab → **Add user** → enter the email + password you want to log in with
4. That's it — go to `/login` in the app and sign in with those credentials

## Firebase + Cloudinary setup

- **Firestore** (`src/firebase/config.js`) stores photo metadata: image URL, caption, date.
- **Firebase Auth** (`src/firebase/AuthContext.jsx`) gates all write actions (upload, edit caption, delete) to whoever is logged in — currently just you, since you're the only account.
- **Cloudinary** (`src/firebase/cloudinary.js`) stores the actual image files. Uploads go straight from the browser using an **unsigned upload preset** — no API secret needed, no backend required.
  - Cloud name: `dyitn40fy`
  - Upload preset: `Mithu-Love` (configured as Unsigned in your Cloudinary dashboard, uploading into the `Mithu` asset folder)

### A note on deleting photos

Unsigned uploads can't delete files from the browser — Cloudinary requires a signed request (using your API secret) for that, which means a small server. Since this project is frontend-only, clicking ✕ on a photo removes it from Firestore (so it disappears from the gallery immediately), but the file itself stays on Cloudinary. Their free tier is generous (25GB+ storage), so this isn't something to worry about for a personal gallery — but if you ever want true deletion, that would require adding a small serverless function (e.g. a single Cloudinary-recommended Netlify/Vercel function) that holds the API secret safely server-side.

### ⚠️ Required before sharing this site with Mithu — lock down Firestore rules

Firebase Auth alone doesn't block anything by itself — it only tells your app *who's* logged in. The actual lock happens in Firestore's rules. Right now Firestore is in **test mode** (open to anyone) and **expires after 30 days**.

Go to the Firebase console → Firestore Database → Rules, and use this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photos/{photoId} {
      allow read: if true;                  // anyone with the link can view
      allow write: if request.auth != null; // only signed-in users (you) can write
    }
  }
}
```

This is the rule that actually matters — without it, anyone could still write to your database directly (bypassing the UI entirely) even with the login screen in place.

### A note on Cloudinary uploads specifically

The login screen hides the upload button from visitors in the UI, so there's no obvious way for someone to trigger an upload. But because Cloudinary's unsigned preset isn't aware of Firebase Auth at all, a very determined person digging through your site's JS could technically still find the preset name and cloud name and upload directly to Cloudinary, bypassing your app entirely. This is a much smaller real-world risk than an open "anyone can click and upload" button, but it's not the same as a true server-enforced lock. If you ever want that fully closed too, it requires a small serverless function that performs a *signed* Cloudinary upload using your API secret — happy to add that later if you want the extra layer.

## Adding photos

Sign in at `/login`, then use the "+ Add memory" button in the gallery — no code changes needed. It uploads to Cloudinary and saves the image URL + caption to Firestore automatically.

## Tech used

- React + Vite
- React Router (page navigation)
- Framer Motion (animations — floating hearts, card transitions)
- Firebase Firestore (photo captions/metadata)
- Firebase Authentication (owner-only login, gates uploads/edits/deletes)
- Cloudinary (image hosting + CDN delivery, unsigned browser upload)

## Project structure

```
src/
 ├─ firebase/
 │   ├─ config.js          → Firebase (Firestore + Auth) initialization
 │   ├─ AuthContext.jsx    → tracks logged-in state app-wide
 │   ├─ cloudinary.js      → Cloudinary unsigned upload helper
 │   └─ photoService.js    → upload/fetch/update/delete helpers
 ├─ components/
 │   ├─ Landing.jsx         → "I Love You Mithu" entry screen
 │   ├─ FloatingHearts.jsx  → ambient hearts layer (used on every page)
 │   ├─ Gallery.jsx         → home page, fetches + displays photos
 │   ├─ PhotoCard.jsx       → single photo + caption + delete (owner-only controls)
 │   ├─ UploadModal.jsx     → upload new photo + caption form (owner-only)
 │   ├─ Lightbox.jsx        → full-screen photo view
 │   └─ Login.jsx           → owner sign-in screen
 └─ styles/                → one CSS file per component
```
