# Hairy Moon

A lunar haircut calendar for 44 cities (Los Angeles, New York, Moscow, Buenos Aires and more): good windows, days to avoid, and calendar feeds.

- Static site: `index.html`, `app.js`, `style.css`, `cities.json`; data in `data/<city>/<year>.json` (2026-11 to 2035-12).
- Calendar feeds: `ics/<city>.ics` (subscribe with `webcal://`; `la.ics` is kept as an alias for Los Angeles).
- Times are computed offline with a calibrated astronomical model and stored as minutes since the Unix epoch (UTC); the page renders them in the selected city's time zone. Location is only used in the browser to pick the nearest listed city (within 50 km).

The rules come from publicly published lunar haircut calendars and traditions that disagree with each other. There is no scientific evidence that the Moon affects hair growth. Not medical advice. Independent project.
