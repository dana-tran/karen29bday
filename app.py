"""
Pickleball Birthday Match — a tiny local website.

HOW TO RUN (see README.md for the friendly version):
    pip install flask
    python app.py
Then open Chrome to:  http://localhost:5001
"""

from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    # Port 5001 on purpose: on macOS, port 5000 is grabbed by AirPlay Receiver.
    app.run(debug=True, port=5001)
