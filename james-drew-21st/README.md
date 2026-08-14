# James Drew's 21st — Invitation Site

A single-page invitation site. No build step, no framework — just
`index.html`, `styles.css`, and `script.js`, so it deploys on Vercel instantly.

## 1. Add the photos

Drop these files into the `images/` folder (PNG, transparent background,
i.e. no white box around the person — that's what makes them look like
they're "floating" on the page):

| File | Used where | Suggested size |
|---|---|---|
| `images/celebrant-hero.png` | Big cutout next to the "21" in the hero | ~800px tall |
| `images/celebrant-1.png` | Left photo in the gallery collage | ~700px tall |
| `images/celebrant-2.png` | Center (larger) photo in the gallery | ~800px tall |
| `images/celebrant-3.png` | Right photo in the gallery | ~700px tall |

If a file is missing, the page automatically falls back to a soft gold
silhouette placeholder — nothing will look broken while you're gathering
photos. Free background remover if you need one: remove.bg or Canva's
"Background Remover".

## 2. Set the RSVP email and double-check the date

Open `script.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  eventDate: "2026-08-29T18:30:00+08:00", // already set to Aug 29, 2026, 6:30 PM Manila time
  hostEmail: "REPLACE-WITH-HOST-EMAIL@example.com", // <-- put the real host email here
};
```

The RSVP form opens the guest's email app with a pre-filled message to
this address — no server, database, or paid form service needed.

**Optional upgrade:** if you'd rather collect RSVPs into a spreadsheet
automatically instead of email, swap the `initRsvpForm` submit handler for
a fetch() to a free [Formspree](https://formspree.io) endpoint or a Google
Form action URL — both are drop-in replacements for the mailto line.

## 3. Edit the guest lists

The 21 Bills / 21 Dance / 21 Shots names live in the `ENTOURAGE` object in
`script.js` — edit names there and the page re-renders the numbered lists
automatically. Use `null` for a not-yet-filled slot (renders as "to be
announced").

## 4. Preview locally

Any static server works, e.g. with Node installed:

```bash
npx serve .
```

or with Python:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## 5. Deploy to Vercel

**Easiest — Vercel CLI:**
```bash
npm i -g vercel
vercel
```
Answer the prompts (link/create a project, keep defaults — it's a static
site, no build command needed). Run `vercel --prod` when you're ready to
go live.

**Or — GitHub import:**
1. Push this folder to a new GitHub repo.
2. On vercel.com → **Add New → Project** → import that repo.
3. Framework preset: "Other" / static. Leave build command blank, output
   directory blank (root). Deploy.

Either way you'll get a `your-project.vercel.app` link to share — you can
also add a custom domain later from the Vercel project settings.

## Notes

- Colors, fonts, and spacing all live in `styles.css` under the `:root`
  variables at the top if you want to tweak the palette.
- The countdown, scroll-reveal animations, and RSVP form are all in
  `script.js` — plain JS, no dependencies.
