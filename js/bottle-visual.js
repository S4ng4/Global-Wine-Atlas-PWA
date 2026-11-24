/**
 * Luxury Bespoke SVG Wine Bottle Renderer
 * Generates authentic bottle silhouettes (Bordeaux, Burgundy, Champagne, Alsace Flute, Fortified)
 * with wine-style color glass tinting and parchment estate labels when no custom photo is supplied.
 */
(function (global) {
    'use strict';

    const STYLE_PALETTE = {
        'RED':           { glass: '#1A1113', glassHi: '#3A1D23', liquid: '#6C1A28', foil: '#7A2331', accent: '#D4AF37', labelBg: '#F4EDE0', labelText: '#1A1512' },
        'WHITE':         { glass: '#212618', glassHi: '#424C2B', liquid: '#D7C26B', foil: '#C4A84D', accent: '#B89535', labelBg: '#FAF6EC', labelText: '#1B1814' },
        'ROSE':          { glass: '#2B1F22', glassHi: '#4F353B', liquid: '#D98E96', foil: '#C47B86', accent: '#C47B86', labelBg: '#FBF4F3', labelText: '#231719' },
        'ORANGE':        { glass: '#261D13', glassHi: '#4B361F', liquid: '#C97B36', foil: '#B96B29', accent: '#C97B36', labelBg: '#F8EFE2', labelText: '#231A10' },
        'SPARKLING':     { glass: '#162119', glassHi: '#2F4636', liquid: '#E4CE83', foil: '#D4AF37', accent: '#D4AF37', labelBg: '#161412', labelText: '#F5EFE2' },
        'DESSERT':       { glass: '#241B10', glassHi: '#49361C', liquid: '#B97822', foil: '#B58932', accent: '#D4AF37', labelBg: '#F5E9D3', labelText: '#21180E' },
        'NON-ALCOHOLIC': { glass: '#17231C', glassHi: '#2E4739', liquid: '#77A884', foil: '#5B8C67', accent: '#5B8C67', labelBg: '#F4F7F4', labelText: '#16211A' }
    };

    function escapeXml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function normalizeStyle(raw) {
        const s = String(raw || '').toUpperCase().trim();
        if (s.includes('SPARK') || s.includes('BOLLICINE') || s.includes('CHAMPAGNE')) return 'SPARKLING';
        if (s.includes('ROSE') || s.includes('ROSÉ') || s.includes('ROSATO')) return 'ROSE';
        if (s.includes('ORANGE') || s.includes('ARANCIONE') || s.includes('AMBER') || s.includes('SKIN')) return 'ORANGE';
        if (s.includes('DESSERT') || s.includes('FORTIFIED') || s.includes('SWEET') || s.includes('PORT') || s.includes('SHERRY')) return 'DESSERT';
        if (s.includes('NON') || s.includes('ZERO') || s.includes('ALCOHOL')) return 'NON-ALCOHOLIC';
        if (s.includes('WHITE') || s.includes('BIANCO')) return 'WHITE';
        return 'RED';
    }

    function detectShape(wine, style) {
        if (style === 'SPARKLING') return 'champagne';
        const region = String(wine.region || '').toUpperCase();
        const varietals = String(wine.varietals || '').toUpperCase();
        const country = String(wine.country || '').toUpperCase();
        if (country === 'GERMANY' || region.includes('ALSACE') || region.includes('MOSEL') || region.includes('RHEINGAU') || region.includes('WACHAU') || varietals.includes('RIESLING')) {
            return 'flute';
        }
        if (region.includes('BURGUNDY') || region.includes('PIEMONTE') || region.includes('RHÔNE') || region.includes('RHONE') || region.includes('OREGON') || region.includes('WILLAMETTE') || region.includes('CENTRAL OTAGO') || varietals.includes('PINOT NOIR') || varietals.includes('CHARDONNAY') || varietals.includes('NEBBIOLO')) {
            return 'burgundy';
        }
        return 'bordeaux';
    }

    function getBottlePath(shape) {
        if (shape === 'champagne') {
            return {
                body: 'M46,16 L64,16 L65,64 C66,84 85,102 86,136 L86,250 C86,260 80,264 72,264 L38,264 C30,264 24,260 24,250 L24,136 C25,102 44,84 45,64 Z',
                foil: 'M45,14 L65,14 L66,64 L44,64 Z',
                labelY: 146,
                labelH: 76
            };
        }
        if (shape === 'flute') {
            return {
                body: 'M48,14 L62,14 L64,66 C66,92 78,118 79,154 L79,252 C79,261 74,264 67,264 L43,264 C36,264 31,261 31,252 L31,154 C32,118 44,92 46,66 Z',
                foil: 'M47,13 L63,13 L64,52 L46,52 Z',
                labelY: 152,
                labelH: 76
            };
        }
        if (shape === 'burgundy') {
            return {
                body: 'M47,16 L63,16 L64,64 C66,86 84,104 85,136 L85,250 C85,260 79,264 72,264 L38,264 C31,264 25,260 25,250 L25,136 C26,104 44,86 46,64 Z',
                foil: 'M46,15 L64,15 L65,50 L45,50 Z',
                labelY: 148,
                labelH: 76
            };
        }
        // Classic Bordeaux high-shoulder silhouette
        return {
            body: 'M47,16 L63,16 L63,68 C63,82 82,86 82,108 L82,252 C82,260 77,264 70,264 L40,264 C33,264 28,260 28,252 L28,108 C28,86 47,82 47,68 Z',
            foil: 'M46,15 L64,15 L64,50 L46,50 Z',
            labelY: 128,
            labelH: 86
        };
    }

    function truncate(str, max) {
        const s = String(str || '').trim();
        return s.length > max ? s.slice(0, max - 1) + '…' : s;
    }

    function renderSvg(wine, opts = {}) {
        const style = normalizeStyle(wine.wine_type);
        const pal = STYLE_PALETTE[style] || STYLE_PALETTE.RED;
        const shape = detectShape(wine, style);
        const geom = getBottlePath(shape);
        const uid = 'btl_' + Math.random().toString(36).slice(2, 9);

        const producer = escapeXml(truncate((wine.wine_producer || 'ESTATE').toUpperCase(), 16));
        const name = escapeXml(truncate(wine.wine_name || 'Reserve', 18));
        const origin = escapeXml(truncate(wine.region || wine.country || '', 16));
        const vintageMatch = String(wine.wine_vintage || wine.vintage || '').match(/(19|20)\d{2}|NV/i);
        const vintage = vintageMatch ? escapeXml(vintageMatch[0].toUpperCase()) : 'NV';

        const isDarkLabel = style === 'SPARKLING';
        const subColor = isDarkLabel ? '#D4AF37' : '#6A5B47';
        const borderColor = isDarkLabel ? '#D4AF37' : '#C5A76A';

        const cls = opts.className ? ` class="${escapeXml(opts.className)}"` : '';
        return `<svg${cls} viewBox="0 0 110 278" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${name} wine bottle">
          <defs>
            <linearGradient id="${uid}_g" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${pal.glass}"/>
              <stop offset="28%" stop-color="${pal.glassHi}"/>
              <stop offset="52%" stop-color="${pal.glass}"/>
              <stop offset="85%" stop-color="#0B0A09"/>
              <stop offset="100%" stop-color="${pal.glassHi}"/>
            </linearGradient>
            <linearGradient id="${uid}_f" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="${pal.foil}" stop-opacity="0.85"/>
              <stop offset="40%" stop-color="${pal.accent}"/>
              <stop offset="100%" stop-color="${pal.foil}" stop-opacity="0.7"/>
            </linearGradient>
          </defs>
          <!-- Soft bottle floor shadow -->
          <ellipse cx="55" cy="268" rx="28" ry="5" fill="rgba(0,0,0,0.45)"/>
          <!-- Bottle glass silhouette -->
          <path d="${geom.body}" fill="url(#${uid}_g)" stroke="rgba(212,175,55,0.28)" stroke-width="0.9"/>
          <!-- Liquid glow line inside neck/shoulder -->
          <path d="M47,68 C47,82 32,88 32,110 L32,126 L78,126 L78,110 C78,88 63,82 63,68 Z" fill="${pal.liquid}" fill-opacity="0.22"/>
          <!-- Specular glass highlight -->
          <path d="M36,112 L36,246" stroke="rgba(255,255,255,0.16)" stroke-width="3" stroke-linecap="round"/>
          <path d="M51,22 L51,64" stroke="rgba(255,255,255,0.18)" stroke-width="1.6" stroke-linecap="round"/>
          <!-- Neck capsule / foil -->
          <path d="${geom.foil}" fill="url(#${uid}_f)"/>
          <rect x="44" y="13" width="22" height="5" rx="2" fill="${pal.accent}"/>
          <!-- Estate Parchment Label -->
          <rect x="30" y="${geom.labelY}" width="50" height="${geom.labelH}" rx="2" fill="${pal.labelBg}" stroke="${borderColor}" stroke-width="0.9"/>
          <rect x="33" y="${geom.labelY + 3}" width="44" height="${geom.labelH - 6}" rx="1" fill="none" stroke="${borderColor}" stroke-width="0.45" stroke-opacity="0.75"/>
          <!-- Crest dot -->
          <polygon points="55,${geom.labelY + 9} 57.5,${geom.labelY + 12} 55,${geom.labelY + 15} 52.5,${geom.labelY + 12}" fill="${pal.accent}"/>
          <text x="55" y="${geom.labelY + 25}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="4.4" font-weight="600" letter-spacing="0.5" fill="${subColor}">${producer}</text>
          <text x="55" y="${geom.labelY + 39}" text-anchor="middle" font-family="Cormorant, Georgia, serif" font-size="6.4" font-weight="700" fill="${pal.labelText}">${name}</text>
          <line x1="40" y1="${geom.labelY + 46}" x2="70" y2="${geom.labelY + 46}" stroke="${borderColor}" stroke-width="0.5"/>
          <text x="55" y="${geom.labelY + 56}" text-anchor="middle" font-family="Inter, sans-serif" font-size="3.9" letter-spacing="0.5" fill="${subColor}">${origin}</text>
          <text x="55" y="${geom.labelY + 67}" text-anchor="middle" font-family="Cinzel, Georgia, serif" font-size="5" font-weight="600" fill="${pal.accent}">${vintage}</text>
        </svg>`;
    }

    function renderHtml(wine, opts = {}) {
        const svg = renderSvg(wine, opts);
        if (wine && wine.bottle_image_url && String(wine.bottle_image_url).trim().startsWith('http')) {
            const safeUrl = escapeXml(wine.bottle_image_url);
            const safeAlt = escapeXml(`${wine.wine_name || 'Wine'} bottle`);
            return `<div class="bottle-visual-frame ${opts.frameClass || ''}">
                <img src="${safeUrl}" alt="${safeAlt}" loading="lazy" decoding="async"
                     onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='block';" />
                <div class="bottle-svg-fallback" style="display:none;">${svg}</div>
            </div>`;
        }
        return `<div class="bottle-visual-frame ${opts.frameClass || ''}">${svg}</div>`;
    }

    global.AtlasBottle = {
        renderSvg,
        renderHtml,
        normalizeStyle
    };
})(window);
