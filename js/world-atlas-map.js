/**
 * Interactive Two-Level World & Country Regional Wine Atlas Map
 * Level 1: Interactive World Wine Map (14 countries / wine zones with 30°-50° wine belts)
 * Level 2: Detailed Country Regional Map drill-down (France, Italy, Spain, USA/California, Chile, etc.)
 * Features: Real-time choropleth by active filters & wine style, zoom/pan, hover tooltips,
 * terroir dossier card, keyboard accessibility, and 100% offline vector rendering.
 */
(function (global) {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    function createEl(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
        return el;
    }

    class WorldWineAtlasMap {
        constructor(containerEl, callbacks = {}) {
            this.container = containerEl;
            this.onSelectCountry = callbacks.onSelectCountry || (() => {});
            this.onSelectRegion = callbacks.onSelectRegion || (() => {});
            this.onBackToWorld = callbacks.onBackToWorld || (() => {});
            this.onViewCountryWines = callbacks.onViewCountryWines || (() => {});

            this.mode = 'world'; // 'world' | 'country'
            this.activeCountryId = null;
            this.activeStyle = 'ALL';
            this.filteredWines = [];
            this.zoom = 1;
            this.panX = 0;
            this.panY = 0;
            this.isDragging = false;
            this.dragStart = { x: 0, y: 0 };

            this._buildShell();
            this._bindZoomPan();
        }

        _buildShell() {
            this.container.innerHTML = `
                <div class="map-subbar">
                    <div class="map-breadcrumbs" id="atlasBreadcrumbs"></div>
                    <div style="display:flex;align-items:center;gap:0.65rem;flex-wrap:wrap;">
                        <span class="map-status-text" id="atlasMapStatus">Select a country to explore its wine regions</span>
                        <button type="button" class="atlas-btn" id="atlasViewAllCountryBtn" style="display:none;padding:0.35rem 0.8rem;font-size:0.74rem;"></button>
                    </div>
                </div>
                <div class="map-stage-wrap" id="atlasMapStage">
                    <div class="map-zoom-controls" aria-label="Map zoom controls">
                        <button type="button" class="map-zoom-btn" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
                        <button type="button" class="map-zoom-btn" data-zoom="out" title="Zoom out" aria-label="Zoom out">&minus;</button>
                        <button type="button" class="map-zoom-btn" data-zoom="reset" title="Reset view" aria-label="Reset map view">&#8634;</button>
                    </div>
                    <div class="atlas-map-tooltip" id="atlasMapTooltip" aria-hidden="true"></div>
                    <div class="atlas-terroir-card" id="atlasTerroirCard"></div>
                </div>
                <div class="map-quickjump-strip" id="atlasQuickJump" aria-label="Quick jump destinations"></div>
            `;

            this.breadcrumbsEl = this.container.querySelector('#atlasBreadcrumbs');
            this.statusEl = this.container.querySelector('#atlasMapStatus');
            this.viewAllBtn = this.container.querySelector('#atlasViewAllCountryBtn');
            this.stageEl = this.container.querySelector('#atlasMapStage');
            this.tooltipEl = this.container.querySelector('#atlasMapTooltip');
            this.terroirCardEl = this.container.querySelector('#atlasTerroirCard');
            this.quickJumpEl = this.container.querySelector('#atlasQuickJump');

            this.viewAllBtn.addEventListener('click', () => {
                if (this.activeCountryId) this.onViewCountryWines(this.activeCountryId);
            });

            this.container.querySelectorAll('.map-zoom-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.getAttribute('data-zoom');
                    if (action === 'in') this.setZoom(this.zoom * 1.28);
                    else if (action === 'out') this.setZoom(this.zoom / 1.28);
                    else this.resetView();
                });
            });
        }

        _bindZoomPan() {
            this.stageEl.addEventListener('wheel', (e) => {
                if (!this.svgEl) return;
                e.preventDefault();
                const factor = e.deltaY < 0 ? 1.15 : 0.87;
                this.setZoom(this.zoom * factor);
            }, { passive: false });

            this.stageEl.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button') || e.target.closest('.atlas-geo-shape')) return;
                this.isDragging = true;
                this.dragStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
                this.stageEl.style.cursor = 'grabbing';
            });

            window.addEventListener('pointermove', (e) => {
                if (!this.isDragging) return;
                this.panX = Math.max(-320, Math.min(320, e.clientX - this.dragStart.x));
                this.panY = Math.max(-240, Math.min(240, e.clientY - this.dragStart.y));
                this._applyTransform();
            });

            window.addEventListener('pointerup', () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                this.stageEl.style.cursor = '';
            });
        }

        setZoom(z) {
            this.zoom = Math.max(1, Math.min(3.2, z));
            if (this.zoom === 1) {
                this.panX = 0;
                this.panY = 0;
            }
            this._applyTransform();
        }

        resetView() {
            this.zoom = 1;
            this.panX = 0;
            this.panY = 0;
            this._applyTransform();
        }

        _applyTransform() {
            if (!this.svgEl) return;
            this.svgEl.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
        }

        updateData(filteredWines, activeStyle = 'ALL', activeCountryId = null) {
            this.filteredWines = filteredWines || [];
            this.activeStyle = activeStyle || 'ALL';
            if (activeCountryId) {
                this.mode = 'country';
                this.activeCountryId = activeCountryId;
            } else {
                this.mode = 'world';
                this.activeCountryId = null;
            }
            this.resetView();
            this.render();
        }

        showWorld() {
            this.mode = 'world';
            this.activeCountryId = null;
            this.resetView();
            this.render();
        }

        showCountry(countryId) {
            this.mode = 'country';
            this.activeCountryId = countryId;
            this.resetView();
            this.render();
        }

        _getPalette() {
            const meta = global.AtlasStore ? global.AtlasStore.STYLE_META : {};
            return meta[this.activeStyle] || meta.ALL || { active: '#D4AF37', accent: '#E6CB78', label: 'All Wines' };
        }

        _showTooltip(ev, title, countText, subtitle) {
            this.tooltipEl.innerHTML = `
                <div class="tip-title">${global.AtlasStore.escapeHtml(title)}</div>
                <div class="tip-count">${global.AtlasStore.escapeHtml(countText)}</div>
                ${subtitle ? `<div class="tip-sub">${global.AtlasStore.escapeHtml(subtitle)}</div>` : ''}
            `;
            this.tooltipEl.classList.add('visible');
            this.tooltipEl.setAttribute('aria-hidden', 'false');

            if (ev && ev.clientX) {
                const rect = this.stageEl.getBoundingClientRect();
                const left = Math.min(rect.width - 270, Math.max(12, ev.clientX - rect.left + 16));
                const top = Math.min(rect.height - 110, Math.max(12, ev.clientY - rect.top - 18));
                this.tooltipEl.style.left = `${left}px`;
                this.tooltipEl.style.top = `${top}px`;
            }
        }

        _hideTooltip() {
            this.tooltipEl.classList.remove('visible');
            this.tooltipEl.setAttribute('aria-hidden', 'true');
        }

        render() {
            const atlas = global.WorldAtlasData;
            if (!atlas) return;
            if (this.svgEl) this.svgEl.remove();
            this._hideTooltip();

            if (this.mode === 'country' && this.activeCountryId) {
                const country = atlas.countries.find(c => c.id === this.activeCountryId);
                if (country) {
                    this._renderCountryView(country);
                    return;
                }
            }
            this._renderWorldView(atlas);
        }

        _renderWorldView(atlas) {
            const palette = this._getPalette();
            const counts = {};
            this.filteredWines.forEach(w => {
                counts[w.country] = (counts[w.country] || 0) + 1;
            });
            const maxCount = Math.max(1, ...Object.values(counts));
            const totalWines = this.filteredWines.length;
            const activeCountriesCount = Object.keys(counts).length;

            this.breadcrumbsEl.innerHTML = `<span class="crumb-current">World Wine Atlas</span>`;
            this.statusEl.textContent = `${palette.label} · ${totalWines} selections across ${activeCountriesCount} countries`;
            this.viewAllBtn.style.display = 'none';

            this.terroirCardEl.innerHTML = `
                <div class="terroir-kicker">Interactive Global Cellar</div>
                <div class="terroir-title">30&deg;&ndash;50&deg; Wine Latitudes</div>
                <div class="terroir-desc">Click any illuminated wine nation on the atlas or quick-jump strip below to open its interactive regional map.</div>
            `;

            const svg = createEl('svg', {
                class: 'atlas-svg-canvas',
                viewBox: atlas.worldViewBox,
                role: 'img',
                'aria-label': 'Interactive World Wine Atlas Map'
            });

            // Subtle wine belt lines (30°-50° N & S)
            const belts = atlas.wineBelts;
            const beltGroup = createEl('g');
            [
                { y: belts.n50, label: '50° N — COOL NORTHERN BELT' },
                { y: belts.n30, label: '30° N — MEDITERRANEAN & CALIFORNIA BELT' },
                { y: belts.eq,  label: 'EQUATOR' },
                { y: belts.s30, label: '30° S — ANDES, CAPE & AUSTRALIA BELT' },
                { y: belts.s50, label: '50° S — PATAGONIA & OTAGO BELT' }
            ].forEach(b => {
                beltGroup.appendChild(createEl('line', {
                    x1: 0, y1: b.y, x2: 1000, y2: b.y, class: 'wine-belt-line'
                }));
                const txt = createEl('text', { x: 14, y: b.y - 4, class: 'wine-belt-label' });
                txt.textContent = b.label;
                beltGroup.appendChild(txt);
            });
            svg.appendChild(beltGroup);

            // Soft translucent wine belt bands
            svg.appendChild(createEl('rect', {
                x: 0, y: belts.n50, width: 1000, height: belts.n30 - belts.n50,
                fill: 'rgba(212, 175, 55, 0.032)', 'pointer-events': 'none'
            }));
            svg.appendChild(createEl('rect', {
                x: 0, y: belts.s30, width: 1000, height: belts.s50 - belts.s30,
                fill: 'rgba(212, 175, 55, 0.032)', 'pointer-events': 'none'
            }));

            // Continent base silhouettes
            const contGroup = createEl('g');
            Object.values(atlas.continents).forEach(pts => {
                contGroup.appendChild(createEl('polygon', { points: pts, class: 'world-continent' }));
            });
            svg.appendChild(contGroup);

            // Clickable Wine Country polygons + markers
            const countriesGroup = createEl('g');
            const labelsGroup = createEl('g');

            atlas.countries.forEach(c => {
                const count = counts[c.id] || 0;
                const intensity = count > 0 ? 0.38 + 0.56 * Math.sqrt(count / maxCount) : 0;

                const poly = createEl('polygon', {
                    points: c.worldPoints,
                    class: `atlas-geo-shape ${count > 0 ? 'has-wines' : 'no-wines'}`,
                    'data-country': c.id,
                    tabindex: '0',
                    role: 'button',
                    'aria-label': `${c.name}: ${count} wines. Open regional map.`
                });
                if (count > 0) {
                    poly.style.fill = palette.active;
                    poly.style.fillOpacity = String(Math.min(0.92, intensity));
                    poly.style.stroke = palette.accent;
                } else {
                    poly.style.fill = '#231F1B';
                    poly.style.fillOpacity = '0.6';
                    poly.style.stroke = 'rgba(212,175,55,0.22)';
                }

                const onEnter = (ev) => {
                    poly.classList.add('is-hovered');
                    this._showTooltip(
                        ev,
                        `${c.name} (${c.world})`,
                        `${count} ${count === 1 ? 'selection' : 'selections'} · ${c.regions.length} wine regions`,
                        c.tagline
                    );
                };
                const onLeave = () => {
                    poly.classList.remove('is-hovered');
                    this._hideTooltip();
                };
                const onClick = () => this.onSelectCountry(c.id);

                poly.addEventListener('mouseenter', onEnter);
                poly.addEventListener('mousemove', onEnter);
                poly.addEventListener('mouseleave', onLeave);
                poly.addEventListener('click', onClick);
                poly.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
                });
                countriesGroup.appendChild(poly);

                // Clean circular interactive pin & count badge (helps small European countries stay easy to tap!)
                const pinGroup = createEl('g', {
                    class: 'atlas-country-pin',
                    style: 'cursor:pointer;'
                });
                const r = count > 0 ? Math.min(11, 6.5 + Math.sqrt(count) * 1.1) : 5;
                pinGroup.appendChild(createEl('circle', {
                    cx: c.worldLx, cy: c.worldLy, r: r + 3.5,
                    fill: count > 0 ? palette.active : '#2A2520',
                    'fill-opacity': count > 0 ? '0.24' : '0.12'
                }));
                pinGroup.appendChild(createEl('circle', {
                    cx: c.worldLx, cy: c.worldLy, r,
                    fill: count > 0 ? palette.accent : '#3A342E',
                    stroke: '#0B0A09',
                    'stroke-width': '1.2'
                }));

                if (count > 0) {
                    const cntTxt = createEl('text', {
                        x: c.worldLx, y: c.worldLy + 3,
                        'text-anchor': 'middle',
                        class: 'atlas-geo-count-text'
                    });
                    cntTxt.textContent = String(count);
                    pinGroup.appendChild(cntTxt);
                }

                // Offset overlapping European labels cleanly
                const labelOffsets = {
                    'FRANCE': [-16, -15],
                    'SPAIN': [-22, 16],
                    'PORTUGAL': [-34, 4],
                    'ITALY': [16, 18],
                    'GERMANY': [4, -18],
                    'AUSTRIA': [28, -6],
                    'GREECE': [22, 18],
                    'WORLD GEMS': [0, -16],
                    'CHILE': [-24, 4],
                    'ARGENTINA': [24, 10],
                    'USA': [0, -16],
                    'AUSTRALIA': [0, -16],
                    'NEW ZEALAND': [0, -16],
                    'SOUTH AFRICA': [0, -16]
                };
                const [dx, dy] = labelOffsets[c.id] || [0, -14];
                const lbl = createEl('text', {
                    x: c.worldLx + dx,
                    y: c.worldLy + dy,
                    'text-anchor': 'middle',
                    class: 'atlas-geo-label'
                });
                lbl.textContent = c.short;
                pinGroup.appendChild(lbl);

                pinGroup.addEventListener('mouseenter', onEnter);
                pinGroup.addEventListener('mousemove', onEnter);
                pinGroup.addEventListener('mouseleave', onLeave);
                pinGroup.addEventListener('click', onClick);
                labelsGroup.appendChild(pinGroup);
            });

            svg.appendChild(countriesGroup);
            svg.appendChild(labelsGroup);

            this.svgEl = svg;
            this.stageEl.insertBefore(svg, this.stageEl.firstChild);

            // Populate Country Quick-Jump Strip
            const sortedCountries = [...atlas.countries].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
            this.quickJumpEl.innerHTML = sortedCountries.map(c => {
                const cnt = counts[c.id] || 0;
                return `<button type="button" class="quickjump-pill" data-jump-country="${c.id}">
                    <span>${global.AtlasStore.escapeHtml(c.name)}</span>
                    <span class="qj-count">${cnt}</span>
                </button>`;
            }).join('');

            this.quickJumpEl.querySelectorAll('[data-jump-country]').forEach(btn => {
                const cid = btn.getAttribute('data-jump-country');
                btn.addEventListener('click', () => this.onSelectCountry(cid));
                btn.addEventListener('mouseenter', () => {
                    const target = countriesGroup.querySelector(`[data-country="${CSS.escape(cid)}"]`);
                    if (target) target.classList.add('is-hovered');
                });
                btn.addEventListener('mouseleave', () => {
                    const target = countriesGroup.querySelector(`[data-country="${CSS.escape(cid)}"]`);
                    if (target) target.classList.remove('is-hovered');
                });
            });
        }

        _renderCountryView(country) {
            const palette = this._getPalette();
            const countryWines = this.filteredWines.filter(w => w.country === country.id);
            const regionCounts = {};
            countryWines.forEach(w => {
                regionCounts[w.region] = (regionCounts[w.region] || 0) + 1;
            });
            const maxCount = Math.max(1, ...Object.values(regionCounts));

            this.breadcrumbsEl.innerHTML = `
                <button type="button" class="crumb-btn" id="crumbBackWorld">&larr; World Atlas</button>
                <span class="crumb-sep">/</span>
                <span class="crumb-current">${global.AtlasStore.escapeHtml(country.name)}</span>
            `;
            this.breadcrumbsEl.querySelector('#crumbBackWorld').addEventListener('click', () => this.onBackToWorld());

            this.statusEl.textContent = `${countryWines.length} ${countryWines.length === 1 ? 'selection' : 'selections'} across ${Object.keys(regionCounts).length} active regions`;
            this.viewAllBtn.style.display = 'inline-flex';
            this.viewAllBtn.textContent = `View All ${country.name} (${countryWines.length})`;

            this.terroirCardEl.innerHTML = `
                <div class="terroir-kicker">${global.AtlasStore.escapeHtml(country.world)} &middot; Regional Atlas</div>
                <div class="terroir-title">${global.AtlasStore.escapeHtml(country.name)}</div>
                <div class="terroir-desc">${global.AtlasStore.escapeHtml(country.tagline)}</div>
            `;

            const svg = createEl('svg', {
                class: 'atlas-svg-canvas',
                viewBox: country.mapViewBox || '0 0 600 520',
                role: 'img',
                'aria-label': `Interactive Wine Map of ${country.name}`
            });

            // Subtle compass rose watermark in corner
            const compass = createEl('g', { opacity: '0.28', transform: 'translate(546, 56)' });
            compass.appendChild(createEl('circle', { cx: 0, cy: 0, r: 22, fill: 'none', stroke: '#D4AF37', 'stroke-width': '0.9' }));
            compass.appendChild(createEl('line', { x1: 0, y1: -28, x2: 0, y2: 28, stroke: '#D4AF37', 'stroke-width': '0.8' }));
            compass.appendChild(createEl('line', { x1: -28, y1: 0, x2: 28, y2: 0, stroke: '#D4AF37', 'stroke-width': '0.8' }));
            const nTxt = createEl('text', { x: 0, y: -31, 'text-anchor': 'middle', fill: '#D4AF37', 'font-size': '9', 'font-family': 'Cinzel, serif' });
            nTxt.textContent = 'N';
            compass.appendChild(nTxt);
            svg.appendChild(compass);

            // Base Country Outline(s)
            if (!country.isShowcaseGrid) {
                const baseGroup = createEl('g');
                (country.outlines || []).forEach(pts => {
                    baseGroup.appendChild(createEl('polygon', { points: pts, class: 'country-outline-base' }));
                });
                svg.appendChild(baseGroup);
            }

            // Clickable Wine Region Polygons
            const regionsGroup = createEl('g');
            const labelsGroup = createEl('g');

            country.regions.forEach((reg, idx) => {
                const count = regionCounts[reg.id] || 0;
                const intensity = count > 0 ? 0.36 + 0.56 * Math.sqrt(count / maxCount) : 0;

                let shapeEl;
                let lx = reg.lx;
                let ly = reg.ly;

                if (country.isShowcaseGrid) {
                    // Clean curated medallion layout for World Gems (Georgia, Hungary, Lebanon, Uruguay, Canada)
                    const cols = 3;
                    const col = idx % cols;
                    const row = Math.floor(idx / cols);
                    const rx = 68 + col * 164 + (row === 1 ? 82 : 0);
                    const ry = 105 + row * 175;
                    lx = rx + 68;
                    ly = ry + 62;
                    shapeEl = createEl('rect', {
                        x: rx, y: ry, width: 136, height: 124, rx: 16,
                        class: `atlas-geo-shape ${count > 0 ? 'has-wines' : 'no-wines'}`,
                        'data-region': reg.id,
                        tabindex: '0',
                        role: 'button',
                        'aria-label': `${reg.name}: ${count} wines`
                    });
                } else {
                    shapeEl = createEl('polygon', {
                        points: reg.points,
                        class: `atlas-geo-shape ${count > 0 ? 'has-wines' : 'no-wines'}`,
                        'data-region': reg.id,
                        tabindex: '0',
                        role: 'button',
                        'aria-label': `${reg.name}: ${count} wines`
                    });
                }

                if (count > 0) {
                    shapeEl.style.fill = palette.active;
                    shapeEl.style.fillOpacity = String(Math.min(0.88, intensity));
                    shapeEl.style.stroke = palette.accent;
                } else {
                    shapeEl.style.fill = '#211D19';
                    shapeEl.style.fillOpacity = '0.55';
                    shapeEl.style.stroke = 'rgba(212, 175, 55, 0.22)';
                }

                const onEnter = (ev) => {
                    shapeEl.classList.add('is-hovered');
                    this._showTooltip(
                        ev,
                        reg.name,
                        `${count} ${count === 1 ? 'selection' : 'selections'} · ${reg.climate}`,
                        `${reg.grapes} — ${reg.summary}`
                    );
                    this.terroirCardEl.innerHTML = `
                        <div class="terroir-kicker">${global.AtlasStore.escapeHtml(country.name)} &middot; ${global.AtlasStore.escapeHtml(reg.climate)}</div>
                        <div class="terroir-title">${global.AtlasStore.escapeHtml(reg.name)}</div>
                        <div class="terroir-desc"><strong>Grapes:</strong> ${global.AtlasStore.escapeHtml(reg.grapes)}<br><strong>Soil:</strong> ${global.AtlasStore.escapeHtml(reg.soil)}</div>
                    `;
                };
                const onLeave = () => {
                    shapeEl.classList.remove('is-hovered');
                    this._hideTooltip();
                };
                const onClick = () => this.onSelectRegion(country.id, reg.id);

                shapeEl.addEventListener('mouseenter', onEnter);
                shapeEl.addEventListener('mousemove', onEnter);
                shapeEl.addEventListener('mouseleave', onLeave);
                shapeEl.addEventListener('click', onClick);
                shapeEl.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
                });
                regionsGroup.appendChild(shapeEl);

                // Region Label + Bottle Count Pill
                const lbl = createEl('text', {
                    x: lx, y: ly - (count > 0 ? 4 : 0),
                    'text-anchor': 'middle',
                    class: 'atlas-geo-label'
                });
                lbl.textContent = reg.short;
                labelsGroup.appendChild(lbl);

                if (count > 0) {
                    const badgeG = createEl('g', { class: 'atlas-geo-count-pill' });
                    badgeG.appendChild(createEl('rect', {
                        x: lx - 12, y: ly + 2, width: 24, height: 14, rx: 7,
                        fill: palette.accent, stroke: '#0B0A09', 'stroke-width': '0.9'
                    }));
                    const cnt = createEl('text', {
                        x: lx, y: ly + 12,
                        'text-anchor': 'middle',
                        class: 'atlas-geo-count-text'
                    });
                    cnt.textContent = String(count);
                    badgeG.appendChild(cnt);
                    labelsGroup.appendChild(badgeG);
                }
            });

            svg.appendChild(regionsGroup);
            svg.appendChild(labelsGroup);

            this.svgEl = svg;
            this.stageEl.insertBefore(svg, this.stageEl.firstChild);

            // Populate Region Quick-Jump Strip
            const sortedRegions = [...country.regions].sort((a, b) => (regionCounts[b.id] || 0) - (regionCounts[a.id] || 0));
            this.quickJumpEl.innerHTML = sortedRegions.map(r => {
                const cnt = regionCounts[r.id] || 0;
                return `<button type="button" class="quickjump-pill" data-jump-region="${r.id}">
                    <span>${global.AtlasStore.escapeHtml(r.name)}</span>
                    <span class="qj-count">${cnt}</span>
                </button>`;
            }).join('');

            this.quickJumpEl.querySelectorAll('[data-jump-region]').forEach(btn => {
                const rid = btn.getAttribute('data-jump-region');
                btn.addEventListener('click', () => this.onSelectRegion(country.id, rid));
                btn.addEventListener('mouseenter', () => {
                    const target = regionsGroup.querySelector(`[data-region="${CSS.escape(rid)}"]`);
                    if (target) target.classList.add('is-hovered');
                });
                btn.addEventListener('mouseleave', () => {
                    const target = regionsGroup.querySelector(`[data-region="${CSS.escape(rid)}"]`);
                    if (target) target.classList.remove('is-hovered');
                });
            });
        }
    }

    global.WorldWineAtlasMap = WorldWineAtlasMap;
})(window);
