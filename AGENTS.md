# AGENTS.md

## Project Overview

This repository is a zero-dependency, white-label Progressive Web App (PWA) — a Global Wine Cellar Atlas with interactive World & Country Regional SVG maps, sommelier filters, tasting dossiers, and a cellar/brand manager.

## Local Development Server

- Start the server with `python3 server.py` (default port `8000`, or pass a custom port via `PORT=8080 python3 server.py`).
- Endpoints:
  - `GET /index.html` — Landing page
  - `GET /wine-map.html` — Interactive World & Regional Wine Atlas
  - `GET /cellar-manager.html` — Cellar Inventory & White-Label Brand Customizer
  - `POST /save-wines-json` — Writes `{ "wines": [...] }` to `data/wines.json`
  - `POST /save-brand-json` — Writes brand config JSON to `config/brand.json`

## Architecture Notes

- All cartographic geometry (14 countries, 97 wine regions) lives in `js/world-atlas-data.js` and is rendered offline-first by `js/world-atlas-map.js` with zero external tile/GeoJSON dependencies.
- White-label venue branding lives in `config/brand.json` and is hydrated dynamically by `js/brand.js`.
- All wine inventory lives in `data/wines.json` and is queried/filtered by `js/cellar-store.js`.
- A service worker (`sw.js`) caches static assets; hard-refresh or clear site storage if edits don't immediately appear.
