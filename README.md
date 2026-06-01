# For Aizirek 💙 - a tiny birthday surprise

A playful little Next.js site built as a birthday gift for **Aizirek (Miracle)**.

It has three parts:

1. **Hero** - a soft welcome with her name and a gentle invitation to start.
2. **Heart Puzzle** - a 3×3 slide puzzle of a pastel-blue heart with her name on it. Click tiles or use arrow keys.
3. **Reveal** - once she solves it, confetti fires and a stack of personal messages slides in.

A floating 3D scene of hearts, balloons, and sparkles drifts behind everything.

---

## Tech

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **React Three Fiber** + **drei** for the 3D background
- **Framer Motion** for the smooth UI animations
- **canvas-confetti** for the celebration

---

## Run it locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

To make a production build:

```bash
npm run build
npm start
```

---

## Personalize it before you give it to her

The site is designed so you can swap in your own words without touching the layout. Things you might want to change:

| What                                               | Where                                                    |
| -------------------------------------------------- | -------------------------------------------------------- |
| Her name & nickname on screen (Айзирек / МОЁ ЧУДО) | `src/components/Hero.tsx` and `public/heart.svg`         |
| The hero subtitle ("моё Чудо ✿")                   | `src/components/Hero.tsx`                                |
| The personal messages in the reveal                | `WISHES` array at the top of `src/components/Reveal.tsx` |
| Tab title / browser metadata                       | `src/app/layout.tsx` (`metadata` export)                 |
| Colors / palette                                   | CSS variables at the top of `src/app/globals.css`        |
| 3D shapes & colors floating in the background      | `src/components/SceneBackground.tsx`                     |

Tip: open `Reveal.tsx`, scroll to the top, and rewrite each card's `title` and `body`. That's the most meaningful edit.

If you want to put **a real photo** behind the puzzle instead of the SVG heart, replace `public/heart.svg` with a square image (e.g. `photo.jpg`) and change `backgroundImage: "url(/heart.svg)"` in `src/components/HeartPuzzle.tsx` to point to it.

---

## Deploy to Vercel (free, ~2 minutes)

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> and import the repository.
3. Vercel auto-detects Next.js - just click **Deploy**. No env vars needed.
4. You'll get a URL like `https://wifey-hb.vercel.app` to send her.

Alternatively, from the CLI:

```bash
npm i -g vercel
vercel
```

---

Made with love.
