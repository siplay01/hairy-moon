# Hairy Moon

A lunar haircut calendar for Los Angeles: good windows, days to avoid, and an iPhone calendar feed.

- Static site: `index.html`, `app.js`, `style.css`, data in `data/la-YYYY.json` (2026-11 to 2035-12).
- Calendar feed: `la.ics` (subscribe with `webcal://`).
- Times are computed offline with a calibrated astronomical model and stored as minutes since the Unix epoch (UTC); the page renders them in America/Los_Angeles.

The rules come from publicly published lunar haircut calendars and traditions that disagree with each other. There is no scientific evidence that the Moon affects hair growth. Not medical advice. Independent project.
