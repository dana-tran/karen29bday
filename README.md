# 🎾 Pickleball Birthday Match

A tiny pixel-art birthday game. Your friend serves a ball into 9 squares on a
pink court; each square flips open to a photo of you two. Clear all 9 and the
screen flashes **MATCH WON!** and the **$100 prize** pops up.

---

## ▶️ How to run it (VS Code + Chrome)

1. **Open the folder in VS Code** (File → Open Folder → pick `pickleball-birthday`).

2. **Open a terminal** in VS Code (Terminal → New Terminal).

3. **Install Flask** (one time):
   ```
   pip install flask
   ```
   *(If `pip` isn't found, try `pip3`. On Mac/Linux you may use `python3 -m pip install flask`.)*

4. **Start the server:**
   ```
   python app.py
   ```
   *(If `python` isn't found, use `python3 app.py`.)*

5. **Open Chrome** and go to:
   ```
   http://localhost:5001
   ```

To stop the server: click the terminal and press **Ctrl + C**.

> Using port **5001** on purpose — on macOS, port 5000 is taken by AirPlay.

---

## ✏️ How to make it yours

Everything you'd want to change is at the **top of `static/game.js`** in the
`CONFIG` block:

- `playerName` — her name (shows in the title + greeting)
- `prizeAmount`, `prizeSub`, `prizeNote` — the prize wording
- `memories` — the caption under each of the 9 squares

**Add your photos:** drop 9 images into `static/images/` named
`memory1.png` … `memory9.png`. Square photos look best. See
`static/images/README.txt` for details. Until you add them, each square shows
an "ADD PHOTO" placeholder, so it works out of the box.

---

## 🗂️ What's in here

```
pickleball-birthday/
├── app.py                 ← the Python server you run
├── requirements.txt
├── templates/
│   └── index.html         ← page structure
└── static/
    ├── style.css          ← the pink pixel look
    ├── game.js            ← game logic + CONFIG (edit me)
    └── images/            ← drop memory1.png … memory9.png here
```

Progress is saved in the browser, so the squares stay revealed if she closes
and reopens the tab. The **↺ new game** link resets it.
