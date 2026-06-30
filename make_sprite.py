"""
Generates the back-view pixel trainer sprite (idle + serve frames).
Run with:  python make_sprite.py
Outputs:  static/images/player_idle.png  and  player_swing.png
You normally don't need to touch this — it's just how the sprite was made.
"""
from PIL import Image, ImageDraw

W, H, SCALE = 30, 38, 9

OUT    = (38, 20, 30, 255)     # outline
CAP    = (230, 58, 58, 255)    # red cap
CAPD   = (176, 37, 37, 255)
CAPBTN = (255, 255, 255, 255)  # button on top of cap
SKIN   = (255, 214, 173, 255)
HAIR   = (24, 22, 26, 255)
TIE    = (255, 92, 138, 255)   # hair tie
SHIRT  = (255, 92, 138, 255)   # pink top
SHIRTD = (214, 58, 107, 255)
SKIRT  = (244, 244, 248, 255)  # white skirt
LEG    = (255, 214, 173, 255)
SHOE   = (44, 44, 66, 255)
PADDLE = (255, 200, 61, 255)   # gold paddle face
PADDLED= (198, 150, 28, 255)
HANDLE = (140, 92, 44, 255)


def box(d, x0, y0, x1, y1, fill, outline=OUT):
    d.rectangle([x0, y0, x1, y1], fill=fill, outline=outline)


def base(d):
    # ---- legs + shoes ----
    box(d, 11, 30, 14, 35, LEG)
    box(d, 16, 30, 19, 35, LEG)
    box(d, 10, 34, 15, 37, SHOE)
    box(d, 15, 34, 20, 37, SHOE)
    # ---- white skirt ----
    box(d, 9, 26, 21, 31, SKIRT)
    # ---- torso (pink top) ----
    box(d, 9, 18, 21, 27, SHIRT)
    box(d, 9, 24, 21, 27, SHIRTD)        # shaded hem
    # ---- left arm (down at side) ----
    box(d, 6, 19, 9, 25, SHIRT)
    box(d, 6, 24, 9, 28, SKIN)           # forearm + hand
    # ---- neck ----
    box(d, 12, 16, 18, 19, SKIN)
    # ---- back of head: hair ----
    d.ellipse([8, 5, 22, 18], fill=HAIR, outline=OUT)
    # ---- ponytail down the back ----
    box(d, 13, 15, 17, 24, HAIR)
    box(d, 13, 15, 17, 16, TIE)          # hair tie band
    # ---- cap on top (Ash style, viewed from behind) ----
    d.ellipse([7, 2, 23, 13], fill=CAP, outline=OUT)
    box(d, 7, 10, 23, 13, CAPD)          # back rim shadow
    box(d, 14, 4, 16, 6, CAPBTN, outline=None)  # top button
    box(d, 13, 11, 17, 13, CAPD)         # snapback strap gap


def add_idle_arm(d):
    # right arm resting, paddle held low to the side
    box(d, 21, 19, 24, 26, SHIRT)        # upper arm
    box(d, 21, 25, 24, 29, SKIN)         # forearm/hand
    box(d, 24, 27, 26, 31, HANDLE)       # handle
    box(d, 23, 29, 29, 36, PADDLE)       # paddle face
    box(d, 23, 33, 29, 36, PADDLED)


def add_swing_arm(d):
    # right arm raised overhead at serve contact, paddle up high
    box(d, 21, 16, 24, 20, SHIRT)        # upper arm out
    box(d, 23, 10, 26, 18, SKIN)         # forearm up
    box(d, 24, 7, 26, 11, HANDLE)        # handle
    box(d, 22, 0, 29, 8, PADDLE)         # paddle face high
    box(d, 22, 0, 29, 3, PADDLED)


def render(swing=False):
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if swing:
        add_swing_arm(d)   # behind body
    base(d)
    if not swing:
        add_idle_arm(d)
    else:
        # redraw paddle/hand in front so it reads as raised
        add_swing_arm(d)
    big = img.resize((W * SCALE, H * SCALE), Image.NEAREST)
    return big


render(False).save("static/images/player_idle.png")
render(True).save("static/images/player_swing.png")
print("saved player_idle.png and player_swing.png")
