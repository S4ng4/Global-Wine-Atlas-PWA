/**
 * Global Wine Cellar Store & Sommelier Filter Engine
 * Shared across all pages for consistent data loading, style normalization,
 * multi-facet filtering, sorting, and wine comparison persistence.
 */
(function (global) {
    'use strict';

    const WINES_LOCAL_KEY = 'atlas_wines_override_v1';
    const COMPARE_KEY = 'atlas_compare_wines_v1';

    const STYLE_META = {
        'ALL':           { label: 'All Wines',     sub: 'Complete Global Cellar', fill: '#26211B', active: '#D4AF37', accent: '#E6CB78' },
        'RED':           { label: 'Red Wines',     sub: 'Structured & Expressive', fill: '#3A151B', active: '#9B293C', accent: '#D85E70' },
        'WHITE':         { label: 'White Wines',   sub: 'Crisp & Mineral',         fill: '#35301C', active: '#C5A952', accent: '#E8D282' },
        'ROSE':          { label: 'Rosé Wines',    sub: 'Delicate & Dry',          fill: '#3A1F24', active: '#B96E7B', accent: '#E0A3AE' },
        'ORANGE':        { label: 'Orange / Amber',sub: 'Skin-Contact & Amphora',  fill: '#3B2514', active: '#C87D3B', accent: '#E5A162' },
        'SPARKLING':     { label: 'Sparkling',     sub: 'Champagne & Classic',     fill: '#332D1B', active: '#D4AF37', accent: '#F2DC8A' },
        'DESSERT':       { label: 'Dessert & Port',sub: 'Fortified & Late Harvest',fill: '#382914', active: '#B98332', accent: '#E2B46A' },
        'NON-ALCOHOLIC': { label: 'Zero-Proof',    sub: '0.0% Artisanal',          fill: '#1D2E22', active: '#5B8C67', accent: '#8BC098' }
    };

    const STYLE_ORDER = ['ALL', 'RED', 'WHITE', 'ROSE', 'ORANGE', 'SPARKLING', 'DESSERT', 'NON-ALCOHOLIC'];

    function normalizeStyle(raw) {
        const s = String(raw || '').toUpperCase().trim();
        if (!s || s === 'ALL') return 'ALL';
        if (s.includes('SPARK') || s.includes('BOLLICINE') || s.includes('CHAMPAGNE') || s.includes('SPUMANTE')) return 'SPARKLING';
        if (s.includes('ROSE') || s.includes('ROSÉ') || s.includes('ROSATO')) return 'ROSE';
        if (s.includes('ORANGE') || s.includes('ARANCIONE') || s.includes('AMBER') || s.includes('SKIN')) return 'ORANGE';
        if (s.includes('DESSERT') || s.includes('FORTIFIED') || s.includes('SWEET') || s.includes('PASSITO') || s.includes('PORT') || s.includes('SHERRY')) return 'DESSERT';
        if (s.includes('NON') || s.includes('ZERO') || s.includes('ALCOL')) return 'NON-ALCOHOLIC';
        if (s.includes('WHITE') || s.includes('BIANCO')) return 'WHITE';
        if (s.includes('RED') || s.includes('ROSSO')) return 'RED';
        return 'RED';
    }

    function normalizeBodyMood(bodyStr) {
        const b = String(bodyStr || '').toLowerCase();
        if (b.includes('light')) return 'light-refreshing';
        if (b.includes('full') || b.includes('bold') || b.includes('rich')) return 'rich-powerful';
        return 'balanced';
    }

    function getNumericPrice(wine) {
        const raw = wine.wine_price_bottle || wine.wine_price || wine.wine_price_glass;
        if (!raw) return Infinity;
        const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
        return Number.isFinite(n) ? n : Infinity;
    }

    function getCountryWorld(countryId) {
        const atlas = global.WorldAtlasData;
        if (!atlas || !Array.isArray(atlas.countries)) return 'Old World';
        const match = atlas.countries.find(c => c.id === countryId);
        return match ? match.world : 'Old World';
    }

    function getCountryDisplayName(countryId) {
        const atlas = global.WorldAtlasData;
        if (!atlas || !Array.isArray(atlas.countries)) return countryId || '';
        const match = atlas.countries.find(c => c.id === countryId);
        return match ? match.name : (countryId || '');
    }

    function getRegionDisplayName(countryId, regionId) {
        const atlas = global.WorldAtlasData;
        if (!atlas || !Array.isArray(atlas.countries)) return regionId || '';
        const country = atlas.countries.find(c => c.id === countryId);
        if (country) {
            const reg = country.regions.find(r => r.id === regionId);
            if (reg) return reg.name;
        }
        return regionId || '';
    }

    let cachedWines = null;

    async function loadWines(forceRefresh = false) {
        if (cachedWines && !forceRefresh) return cachedWines;

        // Check if Cellar Manager saved local override in static deployments
        try {
            const localRaw = localStorage.getItem(WINES_LOCAL_KEY);
            if (localRaw) {
                const parsed = JSON.parse(localRaw);
                if (parsed && Array.isArray(parsed.wines) && parsed.wines.length > 0) {
                    cachedWines = parsed.wines.map(enrichWine);
                    return cachedWines;
                }
            }
        } catch (_) {}

        try {
            const res = await fetch('./data/wines.json', { cache: 'no-cache' });
            if (!res.ok) throw new Error('Failed to load wines.json');
            const data = await res.json();
            const list = Array.isArray(data.wines) ? data.wines : [];
            cachedWines = list.map(enrichWine);
            return cachedWines;
        } catch (err) {
            console.error('[AtlasStore] Could not load data/wines.json:', err);
            cachedWines = [];
            return cachedWines;
        }
    }

    function enrichWine(w, idx) {
        const style = normalizeStyle(w.wine_type);
        const country = String(w.country || 'ITALY').toUpperCase().trim();
        const region = String(w.region || '').toUpperCase().trim();
        return {
            ...w,
            id: w.id || w.wine_number || String(idx + 1),
            wine_number: String(w.wine_number || (idx + 1)),
            country,
            region,
            style,
            bodyMood: normalizeBodyMood(w.body),
            priceNum: getNumericPrice(w),
            hasGlass: Boolean(w.wine_price_glass && String(w.wine_price_glass).trim() !== ''),
            world: getCountryWorld(country)
        };
    }

    function saveLocalWines(winesArray) {
        const payload = { wines: winesArray };
        try {
            localStorage.setItem(WINES_LOCAL_KEY, JSON.stringify(payload));
        } catch (_) {}
        cachedWines = winesArray.map(enrichWine);
        return cachedWines;
    }

    function clearLocalWines() {
        try { localStorage.removeItem(WINES_LOCAL_KEY); } catch (_) {}
        cachedWines = null;
    }

    function filterWines(wines, filters = {}) {
        const {
            world = 'ALL',
            country = null,
            region = null,
            style = 'ALL',
            body = null,
            varietal = null,
            organicOnly = false,
            byTheGlassOnly = false,
            priceTier = 'ALL',
            search = '',
            sort = 'price-asc'
        } = filters;

        const q = String(search || '').trim().toLowerCase();
        const vq = varietal ? String(varietal).trim().toLowerCase() : '';

        const out = wines.filter(w => {
            if (world && world !== 'ALL') {
                if (world === 'Old World' && !String(w.world).includes('Old')) return false;
                if (world === 'New World' && !String(w.world).includes('New')) return false;
            }
            if (country && w.country !== country) return false;
            if (region && w.region !== region) return false;
            if (style && style !== 'ALL' && w.style !== style) return false;
            if (body && w.bodyMood !== body) return false;
            if (organicOnly && !w.organic) return false;
            if (byTheGlassOnly && !w.hasGlass) return false;

            if (priceTier === 'value' && !(w.priceNum <= 65)) return false;
            if (priceTier === 'classic' && !(w.priceNum > 65 && w.priceNum <= 125)) return false;
            if (priceTier === 'reserve' && !(w.priceNum > 125)) return false;

            if (vq && !String(w.varietals || '').toLowerCase().includes(vq)) return false;

            if (q) {
                const hay = [
                    w.wine_name,
                    w.wine_producer,
                    w.country,
                    getCountryDisplayName(w.country),
                    w.region,
                    getRegionDisplayName(w.country, w.region),
                    w.appellation,
                    w.varietals,
                    w.vintage,
                    w.wine_number,
                    w.wine_description,
                    w.food_pairing,
                    w.tasting_notes && w.tasting_notes.olfactory,
                    w.tasting_notes && w.tasting_notes.gustatory
                ].filter(Boolean).join(' ').toLowerCase();
                if (!hay.includes(q)) return false;
            }

            return true;
        });

        out.sort((a, b) => {
            if (sort === 'price-desc') return b.priceNum - a.priceNum;
            if (sort === 'country') return (a.country + a.region).localeCompare(b.country + b.region);
            if (sort === 'name') return String(a.wine_name).localeCompare(String(b.wine_name));
            if (sort === 'vintage-desc') {
                const va = parseInt(String(a.vintage || '0').replace(/\D/g, ''), 10) || 0;
                const vb = parseInt(String(b.vintage || '0').replace(/\D/g, ''), 10) || 0;
                return vb - va;
            }
            return a.priceNum - b.priceNum;
        });

        return out;
    }

    function extractTopVarietals(wines) {
        const counts = new Map();
        const canonical = [
            'Cabernet Sauvignon', 'Pinot Noir', 'Chardonnay', 'Sauvignon Blanc',
            'Nebbiolo', 'Sangiovese', 'Riesling', 'Syrah', 'Shiraz', 'Merlot',
            'Malbec', 'Tempranillo', 'Grenache', 'Garnacha', 'Carménère',
            'Cabernet Franc', 'Chenin Blanc', 'Grüner Veltliner', 'Albariño',
            'Mourvèdre', 'Assyrtiko', 'Sémillon', 'Carignan', 'Nerello Mascalese',
            'Carricante', 'Montepulciano', 'Xinomavro', 'Touriga Nacional',
            'Tannat', 'Blaufränkisch', 'Silvaner', 'Verdejo', 'Mencía', 'Fiano', 'Torrontés'
        ];
        wines.forEach(w => {
            const v = String(w.varietals || '');
            canonical.forEach(grape => {
                if (v.toLowerCase().includes(grape.toLowerCase())) {
                    counts.set(grape, (counts.get(grape) || 0) + 1);
                }
            });
        });
        return Array.from(counts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    }

    // Comparison List helpers (up to 3 wines)
    function getCompareIds() {
        try {
            const raw = localStorage.getItem(COMPARE_KEY);
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr.slice(0, 3) : [];
        } catch (_) {
            return [];
        }
    }

    function toggleCompareId(wineNumber) {
        const id = String(wineNumber);
        const list = getCompareIds();
        const idx = list.indexOf(id);
        let added = false;
        if (idx >= 0) {
            list.splice(idx, 1);
            added = false;
        } else {
            if (list.length >= 3) {
                showToast('Comparison holds up to 3 wines. Remove one first.');
                return { list, added: false, full: true };
            }
            list.push(id);
            added = true;
        }
        try { localStorage.setItem(COMPARE_KEY, JSON.stringify(list)); } catch (_) {}
        updateCompareBadges();
        showToast(added ? 'Added to Wine Comparison' : 'Removed from Wine Comparison');
        return { list, added, full: false };
    }

    function clearCompare() {
        try { localStorage.removeItem(COMPARE_KEY); } catch (_) {}
        updateCompareBadges();
    }

    function updateCompareBadges() {
        const count = getCompareIds().length;
        document.querySelectorAll('[data-compare-count]').forEach(el => {
            el.textContent = String(count);
            el.style.display = count > 0 ? 'inline-flex' : 'none';
        });
    }

    function showToast(msg) {
        let toast = document.getElementById('atlasGlobalToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'atlasGlobalToast';
            toast.className = 'atlas-toast';
            toast.setAttribute('role', 'status');
            toast.setAttribute('aria-live', 'polite');
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    function escapeHtml(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function renderWineCard(wine) {
        const compareIds = getCompareIds();
        const isCompared = compareIds.includes(String(wine.wine_number));
        const bottleHtml = global.AtlasBottle ? global.AtlasBottle.renderHtml(wine) : '';
        const bottlePrice = global.AtlasBrand ? global.AtlasBrand.formatPrice(wine.wine_price_bottle || wine.wine_price) : `$${wine.wine_price}`;
        const glassPrice = wine.hasGlass && global.AtlasBrand ? global.AtlasBrand.formatPrice(wine.wine_price_glass) : '';
        const countryLabel = getCountryDisplayName(wine.country);
        const regionLabel = getRegionDisplayName(wine.country, wine.region);

        return `
        <article class="wine-card" data-wine-number="${escapeHtml(wine.wine_number)}" tabindex="0" role="button" aria-label="${escapeHtml(wine.wine_name)} by ${escapeHtml(wine.wine_producer)}">
            ${bottleHtml}
            <div class="wine-card-info">
                <div>
                    <div class="wine-card-badges">
                        <span class="wine-style-badge wine-style-badge--${escapeHtml(wine.style)}">
                            <span class="style-dot style-dot--${escapeHtml(wine.style)}"></span>
                            ${escapeHtml(STYLE_META[wine.style]?.label || wine.style)}
                        </span>
                        ${wine.organic ? '<span class="organic-badge">Organic</span>' : ''}
                    </div>
                    <div class="wine-card-producer" style="margin-top:0.35rem;">${escapeHtml(wine.wine_producer)}</div>
                    <h3 class="wine-card-name">${escapeHtml(wine.wine_name)}</h3>
                    <div class="wine-card-origin">${escapeHtml(regionLabel)} &middot; ${escapeHtml(countryLabel)}${wine.vintage ? ` &middot; ${escapeHtml(wine.vintage)}` : ''}</div>
                    <div class="wine-card-varietal">${escapeHtml(wine.varietals || '')}</div>
                </div>
                <div class="wine-card-footer">
                    <div class="wine-card-prices">
                        <span class="price-bottle">${escapeHtml(bottlePrice)}</span>
                        ${glassPrice ? `<span class="price-glass">Glass ${escapeHtml(glassPrice)}</span>` : ''}
                    </div>
                    <button type="button" class="wine-compare-toggle ${isCompared ? 'is-added' : ''}" data-compare-btn="${escapeHtml(wine.wine_number)}" aria-label="Compare ${escapeHtml(wine.wine_name)}">
                        ${isCompared ? 'Compared ✓' : '+ Compare'}
                    </button>
                </div>
            </div>
        </article>`;
    }

    global.AtlasStore = {
        STYLE_META,
        STYLE_ORDER,
        normalizeStyle,
        normalizeBodyMood,
        getCountryWorld,
        getCountryDisplayName,
        getRegionDisplayName,
        loadWines,
        saveLocalWines,
        clearLocalWines,
        filterWines,
        extractTopVarietals,
        getCompareIds,
        toggleCompareId,
        clearCompare,
        updateCompareBadges,
        showToast,
        escapeHtml,
        renderWineCard
    };
})(window);
