# 🎾 Pickleball Birthday Match — share-anywhere version

This is the same game, with the Python server removed. It's now just plain web
files, so you can host it for free and send Karen a link she opens on **any**
computer or phone — no install, no terminal.

First, add your stuff (same as before):
- Drop photos into `static/images/` as `memory1.png` … `memory9.png`
- Edit names/captions/prize in the `CONFIG` block at the top of `static/game.js`

---

## Easiest: Netlify Drop (no account, ~1 minute)

1. Go to **https://app.netlify.com/drop**
2. Drag this **whole folder** (`pickleball-birthday-web`) onto the page.
3. It uploads and gives you a public link like `https://something-random.netlify.app`.
4. Send that link to Karen. Done.

To customize the link or keep it permanent, make a free Netlify account
(the drop will prompt you) and you can rename the site.

---

## If you'd rather use GitHub Pages (you already know GitHub)

1. Make a new repo, upload everything in this folder to the repo root.
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   pick `main` and `/ (root)`, Save.
3. After a minute your link is `https://<your-username>.github.io/<repo-name>/`.

(The file paths in this build are relative, so it works fine on a GitHub Pages
sub-path like that.)

---

## Other one-click options
- **Vercel** (vercel.com) — import the folder/repo, deploy, get a link.
- **Cloudflare Pages** — same idea.

All free for something this small.

---

## Good to know about saved progress

Progress (which squares are revealed, the win) is stored in **the browser she
opens it in**. So:
- If Karen plays on her laptop, then later opens the link on her phone, the
  phone starts fresh — it doesn't follow her between devices.
- For a birthday surprise that's usually perfect: she opens it once, plays
  through, sees the prize. The 🏆 VIEW PRIZE button brings the prize back any
  time on that same device.

If you ever want progress to follow her across devices, that needs a small
back-end to save state — tell your helper and it's a quick add.
