/**
 * White-Label Brand Engine
 * Loads config/brand.json (with optional localStorage preview override from Cellar Manager),
 * applies theme CSS variables, and hydrates all [data-brand] elements across every page.
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'atlas_brand_override_v1';

    const ACCENT_PRESETS = {
        'antique-gold': {
            label: 'Antique Gold',
            gold: '#D4AF37',
            goldSoft: '#E6CB78',
            goldDeep: '#A88424',
            burgundy: '#7A2331'
        },
        'rose-copper': {
            label: 'Rose Copper',
            gold: '#D48A6A',
            goldSoft: '#EBB096',
            goldDeep: '#A66246',
            burgundy: '#6E2535'
        },
        'champagne-platinum': {
            label: 'Champagne Platinum',
            gold: '#CFC4AD',
            goldSoft: '#E8DFCC',
            goldDeep: '#9E937D',
            burgundy: '#732A38'
        },
        'cellar-emerald': {
            label: 'Cellar Emerald',
            gold: '#7BB68D',
            goldSoft: '#A3D1B1',
            goldDeep: '#4F8560',
            burgundy: '#6E2B38'
        }
    };

    const DEFAULT_BRAND = {
        venueName: 'Atelier Cellar',
        shortName: 'Wine Atlas',
        venueKicker: 'Curated Cellar · Global Terroirs · Sommelier Selection',
        venueTagline: 'Global Wine Cellar Atlas & Digital List',
        location: 'White-Label Hospitality Edition · Customizable Venue',
        address: '120 Mercer Gallery · New York, NY · +1 (212) 555-0194',
        heroLead: "An interactive cellar journey across the world's great wine regions — from Bordeaux, Piedmont, and Rioja to Napa Valley, Mendoza, Chile, and Marlborough.",
        storyEyebrow: 'Cellar Philosophy',
        storyTitle: 'Curated Across Latitudes & Vintages',
        storyParagraphs: [
            'Every bottle in our cellar begins with a sense of place — volcanic slopes in Sicily and Santorini, limestone ridges in Burgundy and Champagne, coastal fog along California and Casablanca Valley, and high-altitude Andes vineyards in Mendoza and Maipo.',
            'This white-label digital wine atlas was crafted to bridge sommelier expertise with effortless guest discovery. Browse interactively by country and wine region, filter by palate weight, grape varietal, or organic farming, and explore detailed tasting dossiers at the table.',
            'Customize this venue identity, cellar inventory, pricing, and accent palette directly inside the Cellar & Brand Manager or by editing config/brand.json and data/wines.json.'
        ],
        currency: '$',
        accentPreset: 'antique-gold',
        theme: {
            bg: '#0B0A09',
            surface: '#141210',
            surfaceElevated: '#1C1916',
            gold: '#D4AF37',
            goldSoft: '#E6CB78',
            goldDeep: '#A88424',
            burgundy: '#7A2331',
            ivory: '#F5F0E6',
            muted: '#B6ADA0'
        }
    };

    let currentBrand = JSON.parse(JSON.stringify(DEFAULT_BRAND));

    function mergeBrand(base, patch) {
        if (!patch || typeof patch !== 'object') return base;
        return {
            ...base,
            ...patch,
            theme: {
                ...(base.theme || {}),
                ...(patch.theme || {})
            }
        };
    }

    function applyThemeVars(brand) {
        const root = document.documentElement;
        const t = brand.theme || DEFAULT_BRAND.theme;
        if (t.bg) root.style.setProperty('--atlas-bg', t.bg);
        if (t.surface) root.style.setProperty('--atlas-surface', t.surface);
        if (t.surfaceElevated) root.style.setProperty('--atlas-surface-elevated', t.surfaceElevated);
        if (t.gold) root.style.setProperty('--atlas-gold', t.gold);
        if (t.goldSoft) root.style.setProperty('--atlas-gold-soft', t.goldSoft);
        if (t.goldDeep) root.style.setProperty('--atlas-gold-deep', t.goldDeep);
        if (t.burgundy) root.style.setProperty('--atlas-burgundy', t.burgundy);
        if (t.ivory) root.style.setProperty('--atlas-ivory', t.ivory);
        if (t.muted) root.style.setProperty('--atlas-muted', t.muted);
    }

    function hydrateDom(brand) {
        document.querySelectorAll('[data-brand]').forEach(el => {
            const key = el.getAttribute('data-brand');
            if (!key) return;
            if (key === 'titleSuffix') {
                const prefix = el.getAttribute('data-title-prefix') || '';
                document.title = prefix ? `${prefix} — ${brand.venueName}` : `${brand.venueName} — ${brand.venueTagline}`;
                return;
            }
            if (brand[key] !== undefined && brand[key] !== null) {
                el.textContent = brand[key];
            }
        });
        // Update document title if marked via meta/data-page-title
        const pageTitle = document.body && document.body.getAttribute('data-page-title');
        if (pageTitle) {
            document.title = `${pageTitle} — ${brand.venueName}`;
        }
    }

    async function loadBrand() {
        let fetched = null;
        try {
            const res = await fetch('./config/brand.json', { cache: 'no-cache' });
            if (res.ok) fetched = await res.json();
        } catch (_) {
            // Offline or file protocol fallback
        }

        let localOverride = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) localOverride = JSON.parse(raw);
        } catch (_) {
            // Ignore storage errors
        }

        currentBrand = mergeBrand(DEFAULT_BRAND, fetched);
        if (localOverride) {
            currentBrand = mergeBrand(currentBrand, localOverride);
        }

        applyThemeVars(currentBrand);
        hydrateDom(currentBrand);
        global.dispatchEvent(new CustomEvent('atlas:brand-ready', { detail: currentBrand }));
        return currentBrand;
    }

    function saveLocalOverride(brandObj) {
        currentBrand = mergeBrand(DEFAULT_BRAND, brandObj);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(currentBrand));
        } catch (_) {
            // Ignore quota errors
        }
        applyThemeVars(currentBrand);
        hydrateDom(currentBrand);
        return currentBrand;
    }

    function clearLocalOverride() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (_) {}
    }

    function formatPrice(val) {
        if (val === null || val === undefined || String(val).trim() === '') return '';
        const cleaned = String(val).replace(/[^0-9.,]/g, '');
        if (!cleaned) return String(val);
        const curr = (currentBrand && currentBrand.currency) ? currentBrand.currency : '$';
        return `${curr}${cleaned}`;
    }

    const readyPromise = (document.readyState === 'loading')
        ? new Promise(resolve => document.addEventListener('DOMContentLoaded', () => resolve(loadBrand())))
        : loadBrand();

    global.AtlasBrand = {
        ready: readyPromise,
        get: () => currentBrand,
        presets: ACCENT_PRESETS,
        defaults: DEFAULT_BRAND,
        apply: (b) => {
            currentBrand = mergeBrand(DEFAULT_BRAND, b);
            applyThemeVars(currentBrand);
            hydrateDom(currentBrand);
        },
        saveLocalOverride,
        clearLocalOverride,
        formatPrice
    };
})(window);
