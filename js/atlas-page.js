/**
 * Controller for wine-map.html — connects WorldWineAtlasMap, Sommelier Sidebar Filters,
 * Mobile Dock, Live Search Autocomplete, Varietals/Countries Modals, and Wine Cards Grid.
 */
(function () {
    'use strict';

    const state = {
        allWines: [],
        view: 'map', // 'map' | 'list'
        filters: {
            world: 'ALL',
            country: null,
            region: null,
            style: 'ALL',
            body: null,
            varietal: null,
            organicOnly: false,
            byTheGlassOnly: false,
            priceTier: 'ALL',
            search: '',
            sort: 'price-asc'
        }
    };

    let atlasMap = null;

    function getMapFilteredWines() {
        // For the map heatmap, apply all non-geographic filters (plus world hemisphere)
        return window.AtlasStore.filterWines(state.allWines, {
            ...state.filters,
            country: null,
            region: null
        });
    }

    function getListFilteredWines() {
        return window.AtlasStore.filterWines(state.allWines, state.filters);
    }

    function parseUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const country = params.get('country');
        const region = params.get('region');
        const style = params.get('style') || params.get('type');
        const varietal = params.get('varietal');
        const view = params.get('view');
        const search = params.get('q');

        if (country) state.filters.country = country.toUpperCase();
        if (region) state.filters.region = region.toUpperCase();
        if (style) state.filters.style = window.AtlasStore.normalizeStyle(style);
        if (varietal) state.filters.varietal = varietal;
        if (search) state.filters.search = search;
        if (view === 'list' || region || search || varietal) {
            state.view = 'list';
        }
    }

    function renderStyleSelectors() {
        const store = window.AtlasStore;
        // Count per style under current non-style filters
        const base = store.filterWines(state.allWines, { ...state.filters, style: 'ALL' });
        const counts = { ALL: base.length };
        base.forEach(w => { counts[w.style] = (counts[w.style] || 0) + 1; });

        // Desktop sidebar cards
        const desktopEl = document.getElementById('desktopStyleList');
        if (desktopEl) {
            desktopEl.innerHTML = store.STYLE_ORDER.map(key => {
                const meta = store.STYLE_META[key];
                const cnt = counts[key] || 0;
                const active = state.filters.style === key;
                return `<button type="button" class="style-card-btn ${active ? 'is-active' : ''}" data-style="${key}">
                    <span class="style-card-left">
                        <span class="style-dot style-dot--${key}"></span>
                        <span>
                            <div class="style-card-name">${store.escapeHtml(meta.label)}</div>
                            <div class="style-card-sub">${store.escapeHtml(meta.sub)}</div>
                        </span>
                    </span>
                    <span class="style-card-count">${cnt}</span>
                </button>`;
            }).join('');

            desktopEl.querySelectorAll('[data-style]').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.filters.style = btn.getAttribute('data-style');
                    syncAll();
                });
            });
        }

        // Mobile style pill rail & list header pills
        const pillHtml = store.STYLE_ORDER.map(key => {
            const meta = store.STYLE_META[key];
            const cnt = counts[key] || 0;
            const active = state.filters.style === key;
            return `<button type="button" class="filter-chip ${active ? 'is-active' : ''}" data-style="${key}">
                <span class="style-dot style-dot--${key}"></span>
                <span>${store.escapeHtml(meta.label.replace(' Wines', ''))} (${cnt})</span>
            </button>`;
        }).join('');

        ['mobileStyleRail', 'winesViewStylePills'].forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            el.innerHTML = pillHtml;
            el.querySelectorAll('[data-style]').forEach(btn => {
                btn.addEventListener('click', () => {
                    state.filters.style = btn.getAttribute('data-style');
                    syncAll();
                });
            });
        });
    }

    function renderActiveFilterPills() {
        const strip = document.getElementById('activeFiltersStrip');
        if (!strip) return;
        const pills = [];
        const store = window.AtlasStore;

        if (state.filters.world !== 'ALL') pills.push({ label: state.filters.world, clear: () => { state.filters.world = 'ALL'; } });
        if (state.filters.country) pills.push({ label: `Country: ${store.getCountryDisplayName(state.filters.country)}`, clear: () => { state.filters.country = null; state.filters.region = null; } });
        if (state.filters.region) pills.push({ label: `Region: ${store.getRegionDisplayName(state.filters.country, state.filters.region)}`, clear: () => { state.filters.region = null; } });
        if (state.filters.style !== 'ALL') pills.push({ label: store.STYLE_META[state.filters.style]?.label || state.filters.style, clear: () => { state.filters.style = 'ALL'; } });
        if (state.filters.body) pills.push({ label: `Palate: ${state.filters.body.replace('-', ' & ')}`, clear: () => { state.filters.body = null; } });
        if (state.filters.varietal) pills.push({ label: `Grape: ${state.filters.varietal}`, clear: () => { state.filters.varietal = null; } });
        if (state.filters.organicOnly) pills.push({ label: 'Organic / Biodynamic', clear: () => { state.filters.organicOnly = false; } });
        if (state.filters.byTheGlassOnly) pills.push({ label: 'By the Glass', clear: () => { state.filters.byTheGlassOnly = false; } });
        if (state.filters.priceTier !== 'ALL') pills.push({ label: `Price: ${state.filters.priceTier}`, clear: () => { state.filters.priceTier = 'ALL'; } });
        if (state.filters.search) pills.push({ label: `Search: "${state.filters.search}"`, clear: () => { state.filters.search = ''; const inp = document.getElementById('atlasSearchInput'); if (inp) inp.value = ''; } });

        if (pills.length === 0) {
            strip.classList.remove('has-filters');
            strip.innerHTML = '';
            return;
        }

        strip.classList.add('has-filters');
        strip.innerHTML = pills.map((p, idx) => `
            <span class="active-pill">
                ${store.escapeHtml(p.label)}
                <button type="button" data-clear-pill="${idx}" aria-label="Remove filter">&times;</button>
            </span>
        `).join('') + `<button type="button" class="filter-chip" id="clearAllPillsBtn" style="padding:0.2rem 0.65rem;font-size:0.7rem;">Reset All</button>`;

        strip.querySelectorAll('[data-clear-pill]').forEach(btn => {
            btn.addEventListener('click', () => {
                const i = Number(btn.getAttribute('data-clear-pill'));
                if (pills[i]) pills[i].clear();
                syncAll();
            });
        });
        const resetBtn = strip.querySelector('#clearAllPillsBtn');
        if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
    }

    function renderWinesGrid() {
        const list = getListFilteredWines();
        const store = window.AtlasStore;
        const grid = document.getElementById('winesCardsGrid');
        const titleEl = document.getElementById('winesViewTitle');
        const subEl = document.getElementById('winesViewSubtitle');

        let heading = 'Global Wine Cellar';
        if (state.filters.region && state.filters.country) {
            heading = `${store.getRegionDisplayName(state.filters.country, state.filters.region)} — ${store.getCountryDisplayName(state.filters.country)}`;
        } else if (state.filters.country) {
            heading = `${store.getCountryDisplayName(state.filters.country)} Selections`;
        } else if (state.filters.varietal) {
            heading = `${state.filters.varietal} Across the World`;
        } else if (state.filters.search) {
            heading = `Search Results for "${state.filters.search}"`;
        }

        if (titleEl) titleEl.textContent = heading;
        if (subEl) subEl.textContent = `${list.length} ${list.length === 1 ? 'selection' : 'selections'} matching your sommelier filters`;

        if (!grid) return;
        if (list.length === 0) {
            grid.innerHTML = `
                <div class="editorial-panel" style="grid-column:1/-1;text-align:center;padding:3rem 1.5rem;">
                    <h3 style="font-family:var(--atlas-font-display);color:var(--atlas-gold-soft);margin-bottom:0.6rem;">No Matching Selections</h3>
                    <p style="color:var(--atlas-muted);margin-bottom:1.25rem;">Try broadening your style, palate, or regional filters to discover more bottles.</p>
                    <button type="button" class="atlas-btn atlas-btn--primary" id="emptyResetBtn">Reset All Filters</button>
                </div>`;
            const btn = grid.querySelector('#emptyResetBtn');
            if (btn) btn.addEventListener('click', resetAllFilters);
            return;
        }

        grid.innerHTML = list.map(w => store.renderWineCard(w)).join('');
        grid.querySelectorAll('.wine-card').forEach(card => {
            const num = card.getAttribute('data-wine-number');
            const openDossier = () => {
                window.location.href = `./wine-details.html?wine=${encodeURIComponent(num)}`;
            };
            card.addEventListener('click', (e) => {
                const cmpBtn = e.target.closest('[data-compare-btn]');
                if (cmpBtn) {
                    e.stopPropagation();
                    const res = store.toggleCompareId(num);
                    if (!res.full) {
                        cmpBtn.classList.toggle('is-added', res.added);
                        cmpBtn.textContent = res.added ? 'Compared ✓' : '+ Compare';
                    }
                    return;
                }
                openDossier();
            });
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDossier(); }
            });
        });
    }

    function syncChipsUI() {
        document.querySelectorAll('[data-world]').forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-world') === state.filters.world);
        });
        document.querySelectorAll('[data-body]').forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-body') === state.filters.body);
        });
        document.querySelectorAll('[data-price]').forEach(btn => {
            btn.classList.toggle('is-active', btn.getAttribute('data-price') === state.filters.priceTier);
        });
        ['chipOrganic', 'mobileChipOrganic'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('is-active', state.filters.organicOnly);
        });
        ['chipGlass', 'mobileChipGlass'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('is-active', state.filters.byTheGlassOnly);
        });
    }

    function syncViewMode() {
        const mapEl = document.getElementById('atlasMapContainer');
        const listEl = document.getElementById('atlasWinesView');
        const toggleBtn = document.getElementById('toggleMapListBtn');
        const mobileBrowse = document.getElementById('mobileBrowseListBtn');

        if (state.view === 'list') {
            if (mapEl) mapEl.style.display = 'none';
            if (listEl) listEl.classList.add('is-open');
            if (toggleBtn) toggleBtn.textContent = 'Map View';
            if (mobileBrowse) mobileBrowse.textContent = 'Back to Map';
            renderWinesGrid();
        } else {
            if (mapEl) mapEl.style.display = 'flex';
            if (listEl) listEl.classList.remove('is-open');
            if (toggleBtn) toggleBtn.textContent = 'List View';
            if (mobileBrowse) {
                const cnt = getListFilteredWines().length;
                mobileBrowse.innerHTML = `View Wines (<span id="mobileMatchCount">${cnt}</span>)`;
            }
        }
    }

    function syncAll() {
        const mapWines = getMapFilteredWines();
        const listWines = getListFilteredWines();

        const sideCount = document.getElementById('sidebarMatchCount');
        if (sideCount) sideCount.textContent = String(listWines.length);
        const mobCount = document.getElementById('mobileMatchCount');
        if (mobCount) mobCount.textContent = String(listWines.length);

        renderStyleSelectors();
        syncChipsUI();
        renderActiveFilterPills();

        if (atlasMap) {
            atlasMap.updateData(mapWines, state.filters.style, state.filters.country);
        }
        syncViewMode();
    }

    function resetAllFilters() {
        state.filters = {
            world: 'ALL',
            country: null,
            region: null,
            style: 'ALL',
            body: null,
            varietal: null,
            organicOnly: false,
            byTheGlassOnly: false,
            priceTier: 'ALL',
            search: '',
            sort: state.filters.sort
        };
        const inp = document.getElementById('atlasSearchInput');
        if (inp) inp.value = '';
        const clr = document.getElementById('atlasSearchClear');
        if (clr) clr.classList.remove('visible');
        state.view = 'map';
        syncAll();
    }

    function buildCountriesModal() {
        const body = document.getElementById('countriesModalBody');
        const atlas = window.WorldAtlasData;
        const store = window.AtlasStore;
        if (!body || !atlas) return;

        body.innerHTML = atlas.countries.map(c => {
            const cCount = state.allWines.filter(w => w.country === c.id).length;
            const regButtons = c.regions.map(r => {
                const rCount = state.allWines.filter(w => w.country === c.id && w.region === r.id).length;
                if (rCount === 0) return '';
                return `<button type="button" class="filter-chip" data-pick-country="${c.id}" data-pick-region="${r.id}">
                    ${store.escapeHtml(r.name)} (${rCount})
                </button>`;
            }).join('');
            return `
                <div style="margin-bottom:1.15rem;padding-bottom:0.95rem;border-bottom:1px solid rgba(212,175,55,0.12);">
                    <div style="display:flex;align-items:center;justify-content:space-between;gap:0.5rem;margin-bottom:0.45rem;">
                        <button type="button" class="crumb-btn" data-pick-country-map="${c.id}" style="padding-left:0;font-size:0.86rem;">
                            ${store.escapeHtml(c.name)} &middot; ${cCount} wines (${store.escapeHtml(c.world)})
                        </button>
                        <button type="button" class="filter-chip" data-pick-country-map="${c.id}" style="font-size:0.7rem;">Open Map &rarr;</button>
                    </div>
                    <div class="sidebar-chips">${regButtons}</div>
                </div>
            `;
        }).join('');

        body.querySelectorAll('[data-pick-country-map]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.country = btn.getAttribute('data-pick-country-map');
                state.filters.region = null;
                state.view = 'map';
                closeModal('countriesModal');
                syncAll();
            });
        });

        body.querySelectorAll('[data-pick-region]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.country = btn.getAttribute('data-pick-country');
                state.filters.region = btn.getAttribute('data-pick-region');
                state.view = 'list';
                closeModal('countriesModal');
                syncAll();
            });
        });
    }

    function buildVarietalsModal(filterText = '') {
        const grid = document.getElementById('varietalsModalGrid');
        if (!grid) return;
        const varietals = window.AtlasStore.extractTopVarietals(state.allWines)
            .filter(v => !filterText || v.name.toLowerCase().includes(filterText.toLowerCase()));

        grid.innerHTML = varietals.map(v => `
            <button type="button" class="filter-chip ${state.filters.varietal === v.name ? 'is-active' : ''}" data-pick-varietal="${window.AtlasStore.escapeHtml(v.name)}">
                ${window.AtlasStore.escapeHtml(v.name)} (${v.count})
            </button>
        `).join('');

        grid.querySelectorAll('[data-pick-varietal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const chosen = btn.getAttribute('data-pick-varietal');
                state.filters.varietal = state.filters.varietal === chosen ? null : chosen;
                state.view = 'list';
                closeModal('varietalsModal');
                syncAll();
            });
        });
    }

    function openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('open');
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('open');
    }

    function bindEvents() {
        // Mobile top nav toggle
        const mobNavBtn = document.getElementById('mobileNavToggle');
        const navLinks = document.getElementById('atlasNavLinks');
        if (mobNavBtn && navLinks) {
            mobNavBtn.addEventListener('click', () => {
                const open = navLinks.classList.toggle('is-mobile-open');
                mobNavBtn.setAttribute('aria-expanded', String(open));
            });
        }

        // Hemisphere chips
        document.querySelectorAll('[data-world]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.world = btn.getAttribute('data-world');
                state.filters.country = null;
                state.filters.region = null;
                syncAll();
            });
        });

        // Body / Palate chips (toggleable)
        document.querySelectorAll('[data-body]').forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-body');
                state.filters.body = state.filters.body === val ? null : val;
                syncAll();
            });
        });

        // Price tier chips
        document.querySelectorAll('[data-price]').forEach(btn => {
            btn.addEventListener('click', () => {
                state.filters.priceTier = btn.getAttribute('data-price');
                syncAll();
            });
        });

        // Organic & By the Glass toggles
        ['chipOrganic', 'mobileChipOrganic'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => { state.filters.organicOnly = !state.filters.organicOnly; syncAll(); });
        });
        ['chipGlass', 'mobileChipGlass'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.addEventListener('click', () => { state.filters.byTheGlassOnly = !state.filters.byTheGlassOnly; syncAll(); });
        });

        // Sort select
        const sortSel = document.getElementById('atlasSortSelect');
        if (sortSel) {
            sortSel.addEventListener('change', () => {
                state.filters.sort = sortSel.value;
                if (state.view === 'list') renderWinesGrid();
            });
        }

        // View toggles
        const toggleBtn = document.getElementById('toggleMapListBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                state.view = state.view === 'map' ? 'list' : 'map';
                syncViewMode();
            });
        }
        const sideBrowse = document.getElementById('sidebarBrowseAllBtn');
        if (sideBrowse) {
            sideBrowse.addEventListener('click', () => { state.view = 'list'; syncViewMode(); });
        }
        const backBtn = document.getElementById('backToMapBtn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                state.filters.region = null;
                state.view = 'map';
                syncAll();
            });
        }

        // Mobile dock buttons
        const mobFilterBtn = document.getElementById('mobileFiltersToggleBtn');
        const mobSheet = document.getElementById('mobileFilterSheet');
        if (mobFilterBtn && mobSheet) {
            mobFilterBtn.addEventListener('click', () => mobSheet.classList.toggle('open'));
        }
        const mobBrowse = document.getElementById('mobileBrowseListBtn');
        if (mobBrowse) {
            mobBrowse.addEventListener('click', () => {
                state.view = state.view === 'list' ? 'map' : 'list';
                syncViewMode();
            });
        }
        const mobVar = document.getElementById('mobileOpenVarietals');
        if (mobVar) mobVar.addEventListener('click', () => { buildVarietalsModal(); openModal('varietalsModal'); });
        const mobReset = document.getElementById('mobileResetFilters');
        if (mobReset) mobReset.addEventListener('click', resetAllFilters);

        // Modals
        const openCountriesBtn = document.getElementById('openCountriesModalBtn');
        if (openCountriesBtn) openCountriesBtn.addEventListener('click', () => { buildCountriesModal(); openModal('countriesModal'); });
        const openVarBtn = document.getElementById('openVarietalsModalBtn');
        if (openVarBtn) openVarBtn.addEventListener('click', () => { buildVarietalsModal(); openModal('varietalsModal'); });

        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => closeModal(btn.getAttribute('data-close-modal')));
        });
        document.querySelectorAll('.atlas-modal-backdrop').forEach(bg => {
            bg.addEventListener('click', (e) => { if (e.target === bg) bg.classList.remove('open'); });
        });

        const varSearch = document.getElementById('varietalModalSearch');
        if (varSearch) {
            varSearch.addEventListener('input', () => buildVarietalsModal(varSearch.value));
        }

        // Live Search + Autocomplete
        const searchInp = document.getElementById('atlasSearchInput');
        const clearBtn = document.getElementById('atlasSearchClear');
        const autoBox = document.getElementById('atlasAutocomplete');

        if (searchInp && autoBox) {
            if (state.filters.search) {
                searchInp.value = state.filters.search;
                if (clearBtn) clearBtn.classList.add('visible');
            }

            searchInp.addEventListener('input', () => {
                const q = searchInp.value.trim();
                state.filters.search = q;
                if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);

                if (q.length >= 2) {
                    const matches = window.AtlasStore.filterWines(state.allWines, { search: q }).slice(0, 8);
                    if (matches.length > 0) {
                        autoBox.innerHTML = matches.map(w => `
                            <button type="button" class="autocomplete-item" data-goto-wine="${window.AtlasStore.escapeHtml(w.wine_number)}">
                                <div>
                                    <div class="autocomplete-title">${window.AtlasStore.escapeHtml(w.wine_name)}</div>
                                    <div class="autocomplete-meta">${window.AtlasStore.escapeHtml(w.wine_producer)} &middot; ${window.AtlasStore.escapeHtml(window.AtlasStore.getRegionDisplayName(w.country, w.region))}, ${window.AtlasStore.escapeHtml(window.AtlasStore.getCountryDisplayName(w.country))}</div>
                                </div>
                                <span class="autocomplete-price">${window.AtlasBrand.formatPrice(w.wine_price_bottle || w.wine_price)}</span>
                            </button>
                        `).join('') + `
                            <button type="button" class="autocomplete-item" id="autoShowAllBtn" style="justify-content:center;color:var(--atlas-gold-soft);font-family:var(--atlas-font-ui);font-size:0.78rem;font-weight:600;">
                                View all matching results in list &rarr;
                            </button>
                        `;
                        autoBox.classList.add('open');
                        autoBox.querySelectorAll('[data-goto-wine]').forEach(item => {
                            item.addEventListener('click', () => {
                                window.location.href = `./wine-details.html?wine=${encodeURIComponent(item.getAttribute('data-goto-wine'))}`;
                            });
                        });
                        const showAll = autoBox.querySelector('#autoShowAllBtn');
                        if (showAll) {
                            showAll.addEventListener('click', () => {
                                autoBox.classList.remove('open');
                                state.view = 'list';
                                syncAll();
                            });
                        }
                    } else {
                        autoBox.classList.remove('open');
                    }
                } else {
                    autoBox.classList.remove('open');
                }
                syncAll();
            });

            searchInp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    autoBox.classList.remove('open');
                    if (searchInp.value.trim()) {
                        state.view = 'list';
                        syncAll();
                    }
                }
            });

            document.addEventListener('click', (e) => {
                if (!e.target.closest('.atlas-search-wrap')) autoBox.classList.remove('open');
            });
        }

        if (clearBtn && searchInp) {
            clearBtn.addEventListener('click', () => {
                searchInp.value = '';
                state.filters.search = '';
                clearBtn.classList.remove('visible');
                if (autoBox) autoBox.classList.remove('open');
                syncAll();
            });
        }
    }

    async function init() {
        await window.AtlasBrand.ready;
        state.allWines = await window.AtlasStore.loadWines();
        window.AtlasStore.updateCompareBadges();
        parseUrlParams();

        const mapHost = document.getElementById('atlasMapContainer');
        atlasMap = new window.WorldWineAtlasMap(mapHost, {
            onSelectCountry: (countryId) => {
                state.filters.country = countryId;
                state.filters.region = null;
                state.view = 'map';
                syncAll();
            },
            onSelectRegion: (countryId, regionId) => {
                state.filters.country = countryId;
                state.filters.region = regionId;
                state.view = 'list';
                syncAll();
            },
            onBackToWorld: () => {
                state.filters.country = null;
                state.filters.region = null;
                state.view = 'map';
                syncAll();
            },
            onViewCountryWines: (countryId) => {
                state.filters.country = countryId;
                state.filters.region = null;
                state.view = 'list';
                syncAll();
            }
        });

        bindEvents();
        syncAll();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
