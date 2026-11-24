# Global Wine Cellar Atlas PWA (White-Label Edition)

A zero-dependency, offline-first, white-label Progressive Web App (PWA) for luxury restaurants, hotels, wine bars, and private cellars — featuring a **two-level interactive World & Regional Wine Atlas**, sommelier-grade multi-facet filtering, rich tasting dossiers, side-by-side comparison, and a built-in **Cellar & White-Label Brand Manager**.

## Key Features

- **Interactive Two-Level Global Wine Atlas (`wine-map.html`)**:
  - **Level 1 — World Wine Map**: Interactive vector cartography spanning **14 wine-producing countries/zones** with 30°–50° North & South wine belt latitude guides, dynamic bottle-count choropleth shading, zoom/pan, hover tooltips, and quick-jump pills.
  - **Level 2 — Country Regional Drill-Down Maps**: Click any country to open its dedicated interactive regional map across **97 global wine regions**:
    - **France** (Bordeaux, Burgundy, Champagne, Rhône Valley, Loire Valley, Alsace, Provence, Languedoc-Roussillon, Jura & Savoie, Corsica)
    - **Italy** (Piemonte, Toscana, Veneto, Sicilia, Lombardia, Friuli-Venezia Giulia, Trentino-Alto Adige, Emilia-Romagna, Abruzzo, Campania, Puglia, Sardegna, Umbria, Marche, Lazio, Liguria, Valle d'Aosta, Basilicata, Calabria)
    - **Spain** (Rioja, Ribera del Duero, Priorat, Rías Baixas, Penedès & Cava, Jerez, Rueda, Bierzo, Toro)
    - **United States** (California: Napa Valley, Sonoma County, Paso Robles, Santa Barbara & Central Coast; Oregon: Willamette Valley; Washington: Columbia Valley; New York: Finger Lakes)
    - **Chile** (Maipo Valley, Colchagua Valley, Casablanca Valley, Aconcagua Valley, Limarí Valley, Leyda Valley, Maule Valley)
    - **Argentina** (Mendoza, Salta, Patagonia, San Juan)
    - **Portugal** (Douro Valley, Vinho Verde, Dão, Bairrada, Alentejo)
    - **Germany** (Mosel, Rheingau, Rheinhessen, Pfalz, Franken, Baden)
    - **Austria** (Wachau, Kamptal, Kremstal, Burgenland, Styria)
    - **Australia** (Barossa Valley, Margaret River, Clare Valley, McLaren Vale, Yarra Valley, Hunter Valley, Tasmania)
    - **New Zealand** (Marlborough, Central Otago, Hawke's Bay, Martinborough)
    - **South Africa** (Stellenbosch, Swartland, Franschhoek, Constantia, Walker Bay)
    - **Greece** (Santorini, Naoussa, Nemea, Crete)
    - **World Gems** (Georgia — Kakheti, Hungary — Tokaj, Lebanon — Bekaa Valley, Uruguay — Canelones, Canada — Okanagan & Niagara)
- **Sommelier Filter Engine**:
  - Wine styles (`Red`, `White`, `Rosé`, `Orange / Amber`, `Sparkling`, `Dessert & Port`, `Zero-Proof`)
  - Old World / New World hemisphere toggle
  - Palate & body (`Light & Fresh`, `Balanced`, `Rich & Bold`)
  - Curated filters (`Organic / Biodynamic`, `By the Glass`, Price Tiers)
  - Grape Varietal picker modal & Countries/Regions picker modal
  - Live instant search with autocomplete across wine name, producer, country, region, appellation, varietals, and tasting notes
- **100% White-Label Customization**:
  - Edit `config/brand.json` directly or customize live in `cellar-manager.html` (venue name, tagline, location, currency symbol, and 4 luxury accent presets).
  - Manage the cellar inventory (`data/wines.json`) with full add/edit/delete, JSON import/export, and bespoke SVG bottle rendering when no bottle image URL is supplied.
- **Complete Hospitality Page Suite**:
  - `index.html` — Atmospheric landing page with live cellar metrics
  - `wine-map.html` — Interactive World & Regional Wine Atlas
  - `wine-details.html` — Single-screen Sommelier Dossier
  - `WineByTheGlass.html` — Curated Daily Pours by the Glass
  - `wine-comparison.html` — Side-by-side 3-bottle comparison table
  - `regions.html` — Global Wine Regions Viticultural Encyclopedia
  - `SparklingWineDoc.html` — World Sparkling Winemaking Guide
  - `OurStory.html` — White-label Cellar Philosophy page
  - `cellar-manager.html` — Inventory & White-Label Brand Customizer

## Quick Start

No build step or third-party packages required — only Python 3 (or any static web server):

```bash
python3 server.py
```

Then open:
- Public Landing Page: `http://localhost:8000/index.html`
- Interactive World Wine Atlas: `http://localhost:8000/wine-map.html`
- Cellar & White-Label Brand Manager: `http://localhost:8000/cellar-manager.html`

## White-Label Deployment (GitHub Pages / Netlify / Vercel)

Because all cartography, icons, and bottle visuals are bundled locally with zero build step, you can deploy the repository directly to any static host. To re-brand for a client venue:
1. Replace `image/crest.svg` and `image/cellar-hero.jpg` (optional) with client assets.
2. Update `config/brand.json` (or use the Brand Customizer in `cellar-manager.html` and click **Download brand.json**).
3. Replace or edit `data/wines.json` with the venue's cellar inventory.
