# For Anveshna 💕

A Valentine's Week website — one surprise per day (Rose Day through Valentine's Day), with a lock-and-key login and a timer.

## How to run

1. Open `index.html` in a browser (double-click or use a local server).
2. To avoid CORS issues with the font, you can run a simple server:
   - **Node:** `npx serve .` then open http://localhost:3000
   - **Python 3:** `python -m http.server 8000` then open http://localhost:8000

## Login

- **Her password:** `LOVE` (hint on screen: “Four letters — what this week is all about 💕”).
- **Your admin password:** `1968` — unlocks **all days** regardless of date. You get a day picker to view any page and see every surprise.
- To change either, edit `PASSWORD` and `ADMIN_PASSWORD` at the top of `app.js`.

## How it works

- **Feb 7** – Rose Day 🌹  
- **Feb 8** – Propose Day 💍  
- **Feb 9** – Chocolate Day 🍫  
- **Feb 10** – Teddy Day 🧸  
- **Feb 11** – Promise Day 💝  
- **Feb 12** – Hug Day 🤗  
- **Feb 13** – Kiss Day 💋  
- **Feb 14** – Valentine's Day ❤️  

She can only see the page for **that day** (e.g. on Feb 7 only Rose Day). Before Feb 7 she sees a countdown to Rose Day; after Feb 14 she sees a “see you next year” message. The timer shows time left in the current day or countdown to the next. After unlocking, a daily popup appears (e.g. “Happy Rose Day Anveshna” with a rose on Rose Day).

- **Personal note per day** — Edit the `note` field for each day in `VALENTINE_WEEK` in `app.js` to add your own message. It appears below the greeting.
- **Tomorrow teaser** — Footer shows “Tomorrow: [next day]” during the week.
- **Floating hearts** — Subtle hearts animation on the main screen after login.
- **Favicon** — Heart icon in the browser tab.

Login state is kept in **session storage** (one session per browser tab).
