/**
 * Interactive Two-Level World & Country Regional Wine Atlas Map (Mobile-First Luxury Edition)
 * Features:
 * - Smooth cubic-Bezier engraved cartography (24 landmass silhouettes, 14 countries, 97 wine regions)
 * - Animated viewport focus tabs (World, Europe, Americas, South) for effortless mobile thumb tapping
 * - Scale-aware pins, collision-free labels, generous touch hit-targets, and two-finger pinch/pan
 * - Real-time choropleth intensity shading synced to active wine style & sommelier filters
 */
(function (global) {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    function createEl(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
        return el;
    }

    function parseVB(str) {
        return str.trim().split(/\s+/).map(Number);
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
            this.activeFocus = 'world'; // 'world' | 'europe' | 'americas' | 'southern'
            this.activeStyle = 'ALL';
            this.filteredWines = [];

            this.zoom = 1;
            this.panX = 0;
            this.panY = 0;
            this.isDragging = false;
            this.dragStart = { x: 0, y: 0 };
            this.pinchDist = 0;
            this._vbAnim = null;
            this._currentVB = [0, 0, 1000, 500];

            this._buildShell();
            this._bindInteractions();
        }

        _buildShell() {
            this.container.innerHTML = `
                <div class="map-subbar">
                    <div class="map-breadcrumbs" id="atlasBreadcrumbs"></div>
                    <div class="map-focus-tabs" id="atlasFocusTabs" role="tablist" aria-label="Map region focus"></div>
                    <div class="map-subbar-right">
                        <span class="map-status-text" id="atlasMapStatus"></span>
                        <button type="button" class="atlas-btn atlas-btn--sm" id="atlasViewAllCountryBtn" style="display:none;"></button>
                    </div>
                </div>
                <div class="map-stage-wrap" id="atlasMapStage">
                    <div class="map-zoom-controls" aria-label="Map zoom controls">
                        <button type="button" class="map-zoom-btn" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button>
                        <button type="button" class="map-zoom-btn" data-zoom="out" title="Zoom out" aria-label="Zoom out">&minus;</button>
                        <button type="button" class="map-zoom-btn" data-zoom="reset" title="Reset view" aria-label="Reset view">&#8634;</button>
                    </div>
                    <div class="atlas-map-tooltip" id="atlasMapTooltip" aria-hidden="true"></div>
                    <div class="atlas-terroir-card" id="atlasTerroirCard"></div>
                </div>
                <div class="map-quickjump-strip" id="atlasQuickJump" aria-label="Quick jump destinations"></div>
            `;

            this.breadcrumbsEl = this.container.querySelector('#atlasBreadcrumbs');
            this.focusTabsEl = this.container.querySelector('#atlasFocusTabs');
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
                    if (action === 'in') this.setZoom(this.zoom * 1.3);
                    else if (action === 'out') this.setZoom(this.zoom / 1.3);
                    else this.resetView();
                });
            });
        }

        _bindInteractions() {
            // Wheel zoom on desktop
            this.stageEl.addEventListener('wheel', (e) => {
                if (!this.svgEl) return;
                e.preventDefault();
                this.setZoom(this.zoom * (e.deltaY < 0 ? 1.16 : 0.86));
            }, { passive: false });

            // Pointer drag pan (desktop + mobile 1-finger when zoomed)
            this.stageEl.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button') || e.target.closest('.atlas-geo-shape') || e.target.closest('.atlas-country-pin')) return;
                this.isDragging = true;
                this.dragStart = { x: e.clientX - this.panX, y: e.clientY - this.panY };
                this.stageEl.style.cursor = 'grabbing';
            });

            window.addEventListener('pointermove', (e) => {
                if (!this.isDragging) return;
                const limit = 260 * this.zoom;
                this.panX = Math.max(-limit, Math.min(limit, e.clientX - this.dragStart.x));
                this.panY = Math.max(-limit, Math.min(limit, e.clientY - this.dragStart.y));
                this._applyTransform();
            });

            window.addEventListener('pointerup', () => {
                if (!this.isDragging) return;
                this.isDragging = false;
                this.stageEl.style.cursor = '';
            });

            // Mobile two-finger pinch zoom
            this.stageEl.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this.pinchDist = Math.hypot(dx, dy);
                }
            }, { passive: true });

            this.stageEl.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2 && this.pinchDist > 0) {
                    e.preventDefault();
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    const ratio = dist / this.pinchDist;
                    this.pinchDist = dist;
                    this.setZoom(this.zoom * ratio);
                }
            }, { passive: false });

            this.stageEl.addEventListener('touchend', () => { this.pinchDist = 0; }, { passive: true });
        }

        setZoom(z) {
            this.zoom = Math.max(1, Math.min(3.5, z));
            if (this.zoom <= 1.02) {
                this.zoom = 1;
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

        _animateViewBox(targetStr, duration = 360) {
            if (!this.svgEl) return;
            if (this._vbAnim) cancelAnimationFrame(this._vbAnim);
            const from = [...this._currentVB];
            const to = parseVB(targetStr);
            const start = performance.now();

            const step = (now) => {
                const t = Math.min(1, (now - start) / duration);
                const ease = 1 - Math.pow(1 - t, 3);
                const cur = from.map((v, i) => v + (to[i] - v) * ease);
                this._currentVB = cur;
                if (this.svgEl) {
                    this.svgEl.setAttribute('viewBox', cur.map(n => n.toFixed(1)).join(' '));
                }
                if (t < 1) this._vbAnim = requestAnimationFrame(step);
            };
            this._vbAnim = requestAnimationFrame(step);
        }

        setFocus(focusKey) {
            const atlas = global.WorldAtlasData;
            if (!atlas || !atlas.focusPresets || !atlas.focusPresets[focusKey]) return;
            this.activeFocus = focusKey;
            this.resetView();
            if (this.mode === 'world') {
                const preset = atlas.focusPresets[focusKey];
                this._renderFocusTabs(atlas);
                this._updateWorldPinScale(focusKey);
                this._animateViewBox(preset.viewBox, 380);
                if (this.terroirCardEl) {
                    this.terroirCardEl.innerHTML = `
                        <div class="terroir-kicker">Interactive Atlas &middot; ${global.AtlasStore.escapeHtml(preset.label)}</div>
                        <div class="terroir-title">Select a Wine Nation</div>
                        <div class="terroir-desc">${global.AtlasStore.escapeHtml(preset.desc)}</div>
                    `;
                }
            }
        }

        _updateWorldPinScale(focusKey) {
            if (!this.svgEl) return;
            // Scale down SVG pin/label geometry proportionally when zoomed into Europe or Americas
            const scaleMap = { world: 1, europe: 0.34, americas: 0.62, southern: 0.68 };
            const s = scaleMap[focusKey] || 1;
            this.svgEl.querySelectorAll('.atlas-country-pin').forEach(g => {
                const cx = g.getAttribute('data-cx');
                const cy = g.getAttribute('data-cy');
                g.setAttribute('transform', `translate(${cx}, ${cy}) scale(${s})`);
            });
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

        _getPalette() {
            const meta = global.AtlasStore ? global.AtlasStore.STYLE_META : {};
            return meta[this.activeStyle] || meta.ALL || { active: '#D4AF37', accent: '#E6CB78', label: 'All Wines' };
        }

        _showTooltip(ev, title, countText, subtitle) {
            if (window.matchMedia('(pointer: coarse)').matches) return; // Skip hover tooltip on touch screens
            this.tooltipEl.innerHTML = `
                <div class="tip-title">${global.AtlasStore.escapeHtml(title)}</div>
                <div class="tip-count">${global.AtlasStore.escapeHtml(countText)}</div>
                ${subtitle ? `<div class="tip-sub">${global.AtlasStore.escapeHtml(subtitle)}</div>` : ''}
            `;
            this.tooltipEl.classList.add('visible');
            this.tooltipEl.setAttribute('aria-hidden', 'false');

            if (ev && ev.clientX) {
                const rect = this.stageEl.getBoundingClientRect();
                const left = Math.min(rect.width - 275, Math.max(12, ev.clientX - rect.left + 16));
                const top = Math.min(rect.height - 115, Math.max(12, ev.clientY - rect.top - 18));
                this.tooltipEl.style.left = `${left}px`;
                this.tooltipEl.style.top = `${top}px`;
            }
        }

        _hideTooltip() {
            this.tooltipEl.classList.remove('visible');
            this.tooltipEl.setAttribute('aria-hidden', 'true');
        }

        _renderFocusTabs(atlas) {
            if (!this.focusTabsEl) return;
            if (this.mode !== 'world' || !atlas.focusPresets) {
                this.focusTabsEl.style.display = 'none';
                return;
            }
            this.focusTabsEl.style.display = 'inline-flex';
            this.focusTabsEl.innerHTML = Object.entries(atlas.focusPresets).map(([key, p]) => `
                <button type="button" class="focus-tab-btn ${this.activeFocus === key ? 'is-active' : ''}" data-focus="${key}" role="tab" aria-selected="${this.activeFocus === key}">
                    ${global.AtlasStore.escapeHtml(p.label)}
                </button>
            `).join('');
            this.focusTabsEl.querySelectorAll('[data-focus]').forEach(btn => {
                btn.addEventListener('click', () => this.setFocus(btn.getAttribute('data-focus')));
            });
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
            this.filteredWines.forEach(w => { counts[w.country] = (counts[w.country] || 0) + 1; });
            const maxCount = Math.max(1, ...Object.values(counts));
            const totalWines = this.filteredWines.length;
            const activeCountriesCount = Object.keys(counts).length;

            this.breadcrumbsEl.innerHTML = `<span class="crumb-current">World Atlas</span>`;
            this._renderFocusTabs(atlas);
            this.statusEl.textContent = `${totalWines} wines · ${activeCountriesCount} countries`;
            this.viewAllBtn.style.display = 'none';

            const preset = (atlas.focusPresets && atlas.focusPresets[this.activeFocus]) || { label: 'World', viewBox: atlas.worldViewBox, desc: 'Tap any illuminated wine nation to open its regional terroir map.' };
            this._currentVB = parseVB(preset.viewBox);

            this.terroirCardEl.innerHTML = `
                <div class="terroir-kicker">Global Cellar &middot; ${global.AtlasStore.escapeHtml(preset.label)}</div>
                <div class="terroir-title">30&deg;&ndash;50&deg; Wine Belts</div>
                <div class="terroir-desc">${global.AtlasStore.escapeHtml(preset.desc)}</div>
            `;

            const svg = createEl('svg', {
                class: 'atlas-svg-canvas',
                viewBox: preset.viewBox,
                preserveAspectRatio: 'xMidYMid meet',
                role: 'img',
                'aria-label': 'Interactive World Wine Atlas Map'
            });

            // Engraved cartographic defs: ocean glow, gold land gradient, soft shadow
            const defs = createEl('defs');
            defs.innerHTML = `
                <radialGradient id="atlasOceanGlow" cx="50%" cy="46%" r="58%">
                    <stop offset="0%" stop-color="rgba(212, 175, 55, 0.085)" />
                    <stop offset="100%" stop-color="rgba(9, 8, 7, 0)" />
                </radialGradient>
                <filter id="atlasLandShadow" x="-6%" y="-6%" width="112%" height="112%">
                    <feDropShadow dx="0" dy="1.8" stdDeviation="2.2" flood-color="#000000" flood-opacity="0.65" />
                </filter>
            `;
            svg.appendChild(defs);
            svg.appendChild(createEl('rect', { x: 0, y: 0, width: 1000, height: 500, fill: 'url(#atlasOceanGlow)', 'pointer-events': 'none' }));

            // Subtle Longitude Graticule (every 30 deg)
            const grat = createEl('g', { 'pointer-events': 'none' });
            for (let x = 83.3; x < 980; x += 83.33) {
                grat.appendChild(createEl('line', {
                    x1: x.toFixed(1), y1: 0, x2: x.toFixed(1), y2: 500,
                    stroke: 'rgba(212, 175, 55, 0.055)', 'stroke-width': '0.55'
                }));
            }
            svg.appendChild(grat);

            // Wine Belt Bands & Latitude Parallels (30°-50° N & S)
            const belts = atlas.wineBelts;
            const beltGroup = createEl('g', { 'pointer-events': 'none' });
            beltGroup.appendChild(createEl('rect', {
                x: 0, y: belts.n50, width: 1000, height: belts.n30 - belts.n50,
                fill: 'rgba(212, 175, 55, 0.036)'
            }));
            beltGroup.appendChild(createEl('rect', {
                x: 0, y: belts.s30, width: 1000, height: belts.s50 - belts.s30,
                fill: 'rgba(212, 175, 55, 0.036)'
            }));
            [
                { y: belts.n50, label: '50° N' },
                { y: belts.n30, label: '30° N' },
                { y: belts.eq,  label: '0°' },
                { y: belts.s30, label: '30° S' },
                { y: belts.s50, label: '50° S' }
            ].forEach(b => {
                beltGroup.appendChild(createEl('line', { x1: 0, y1: b.y, x2: 1000, y2: b.y, class: 'wine-belt-line' }));
                const txt = createEl('text', { x: 10, y: b.y - 3, class: 'wine-belt-label' });
                txt.textContent = b.label;
                beltGroup.appendChild(txt);
            });
            svg.appendChild(beltGroup);

            // Smooth Continents & Islands Base Layer
            const contGroup = createEl('g', { filter: 'url(#atlasLandShadow)' });
            Object.values(atlas.continentPaths || {}).forEach(d => {
                contGroup.appendChild(createEl('path', { d, class: 'world-continent' }));
            });
            svg.appendChild(contGroup);

            // Clickable Wine Nations + Scale-Aware Pins
            const countriesGroup = createEl('g');
            const pinsGroup = createEl('g');

            const labelOffsets = {
                'FRANCE': [-20, -14],
                'SPAIN': [-22, 17],
                'PORTUGAL': [-34, 4],
                'ITALY': [16, 18],
                'GERMANY': [4, -18],
                'AUSTRIA': [28, -5],
                'GREECE': [22, 18],
                'WORLD GEMS': [6, -16],
                'CHILE': [-24, 4],
                'ARGENTINA': [26, 11],
                'USA': [0, -17],
                'AUSTRALIA': [0, -17],
                'NEW ZEALAND': [0, -17],
                'SOUTH AFRICA': [0, -17]
            };

            atlas.countries.forEach(c => {
                const count = counts[c.id] || 0;
                const intensity = count > 0 ? 0.42 + 0.52 * Math.sqrt(count / maxCount) : 0;

                const shape = createEl('path', {
                    d: c.worldPath,
                    class: `atlas-geo-shape ${count > 0 ? 'has-wines' : 'no-wines'}`,
                    'data-country': c.id,
                    tabindex: '0',
                    role: 'button',
                    'aria-label': `${c.name}: ${count} wines. Open regional map.`
                });
                if (count > 0) {
                    shape.style.fill = palette.active;
                    shape.style.fillOpacity = String(Math.min(0.92, intensity));
                    shape.style.stroke = palette.accent;
                } else {
                    shape.style.fill = '#231F1B';
                    shape.style.fillOpacity = '0.55';
                    shape.style.stroke = 'rgba(212,175,55,0.22)';
                }

                const onEnter = (ev) => {
                    shape.classList.add('is-hovered');
                    this._showTooltip(
                        ev,
                        `${c.name} · ${c.world}`,
                        `${count} ${count === 1 ? 'selection' : 'selections'} across ${c.regions.length} wine regions`,
                        c.tagline
                    );
                };
                const onLeave = () => {
                    shape.classList.remove('is-hovered');
                    this._hideTooltip();
                };
                const onClick = () => this.onSelectCountry(c.id);

                shape.addEventListener('mouseenter', onEnter);
                shape.addEventListener('mousemove', onEnter);
                shape.addEventListener('mouseleave', onLeave);
                shape.addEventListener('click', onClick);
                shape.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
                });
                countriesGroup.appendChild(shape);

                // Local-origin pin group so we can cleanly scale it on focus zoom
                const pin = createEl('g', {
                    class: 'atlas-country-pin',
                    'data-cx': c.worldLx,
                    'data-cy': c.worldLy,
                    transform: `translate(${c.worldLx}, ${c.worldLy}) scale(1)`,
                    style: 'cursor:pointer;'
                });

                // Invisible generous tap target
                pin.appendChild(createEl('circle', { cx: 0, cy: 0, r: 16, fill: 'transparent' }));

                const r = count > 0 ? Math.min(10.5, 6.2 + Math.sqrt(count) * 1.05) : 4.5;
                if (count > 0) {
                    pin.appendChild(createEl('circle', {
                        cx: 0, cy: 0, r: r + 4,
                        fill: palette.active, 'fill-opacity': '0.26'
                    }));
                }
                pin.appendChild(createEl('circle', {
                    cx: 0, cy: 0, r,
                    fill: count > 0 ? palette.accent : '#3C3630',
                    stroke: '#0B0A09', 'stroke-width': '1.2'
                }));

                if (count > 0) {
                    const cntTxt = createEl('text', { x: 0, y: 3, 'text-anchor': 'middle', class: 'atlas-geo-count-text' });
                    cntTxt.textContent = String(count);
                    pin.appendChild(cntTxt);
                }

                const [dx, dy] = labelOffsets[c.id] || [0, -15];
                const lbl = createEl('text', { x: dx, y: dy, 'text-anchor': 'middle', class: 'atlas-geo-label' });
                lbl.textContent = c.short;
                pin.appendChild(lbl);

                pin.addEventListener('mouseenter', onEnter);
                pin.addEventListener('mousemove', onEnter);
                pin.addEventListener('mouseleave', onLeave);
                pin.addEventListener('click', onClick);
                pinsGroup.appendChild(pin);
            });

            svg.appendChild(countriesGroup);
            svg.appendChild(pinsGroup);

            this.svgEl = svg;
            this.stageEl.insertBefore(svg, this.stageEl.firstChild);
            this._updateWorldPinScale(this.activeFocus);

            // Populate Thumb-Friendly Country Carousel below map
            const sortedCountries = [...atlas.countries].sort((a, b) => (counts[b.id] || 0) - (counts[a.id] || 0));
            this.quickJumpEl.innerHTML = sortedCountries.map(c => {
                const cnt = counts[c.id] || 0;
                return `<button type="button" class="quickjump-pill" data-jump-country="${c.id}">
                    <span class="qj-name">${global.AtlasStore.escapeHtml(c.name)}</span>
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
            countryWines.forEach(w => { regionCounts[w.region] = (regionCounts[w.region] || 0) + 1; });
            const maxCount = Math.max(1, ...Object.values(regionCounts));

            this.breadcrumbsEl.innerHTML = `
                <button type="button" class="crumb-btn" id="crumbBackWorld">&larr; World</button>
                <span class="crumb-sep">/</span>
                <span class="crumb-current">${global.AtlasStore.escapeHtml(country.name)}</span>
            `;
            this.breadcrumbsEl.querySelector('#crumbBackWorld').addEventListener('click', () => this.onBackToWorld());
            if (this.focusTabsEl) this.focusTabsEl.style.display = 'none';

            this.statusEl.textContent = `${countryWines.length} wines · ${Object.keys(regionCounts).length} regions`;
            this.viewAllBtn.style.display = 'inline-flex';
            this.viewAllBtn.textContent = `All ${country.short} (${countryWines.length})`;

            this.terroirCardEl.innerHTML = `
                <div class="terroir-kicker">${global.AtlasStore.escapeHtml(country.world)} &middot; Regional Atlas</div>
                <div class="terroir-title">${global.AtlasStore.escapeHtml(country.name)}</div>
                <div class="terroir-desc">${global.AtlasStore.escapeHtml(country.tagline)}</div>
            `;

            const vb = country.mapViewBox || '0 0 600 520';
            this._currentVB = parseVB(vb);

            const svg = createEl('svg', {
                class: 'atlas-svg-canvas',
                viewBox: vb,
                preserveAspectRatio: 'xMidYMid meet',
                role: 'img',
                'aria-label': `Interactive Wine Map of ${country.name}`
            });

            const defs = createEl('defs');
            defs.innerHTML = `
                <radialGradient id="countryGlow" cx="50%" cy="48%" r="55%">
                    <stop offset="0%" stop-color="rgba(212, 175, 55, 0.09)" />
                    <stop offset="100%" stop-color="rgba(9, 8, 7, 0)" />
                </radialGradient>
                <filter id="countryDrop" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.65" />
                </filter>
            `;
            svg.appendChild(defs);
            svg.appendChild(createEl('rect', { x: 0, y: 0, width: 600, height: 520, fill: 'url(#countryGlow)', 'pointer-events': 'none' }));

            // Fine engraved compass rose
            const compass = createEl('g', { opacity: '0.32', transform: 'translate(544, 52)', 'pointer-events': 'none' });
            compass.appendChild(createEl('circle', { cx: 0, cy: 0, r: 20, fill: 'none', stroke: '#D4AF37', 'stroke-width': '0.9' }));
            compass.appendChild(createEl('circle', { cx: 0, cy: 0, r: 14, fill: 'none', stroke: '#D4AF37', 'stroke-width': '0.5', 'stroke-dasharray': '2 2' }));
            compass.appendChild(createEl('polygon', { points: '0,-24 3.5,-6 0,-10 -3.5,-6', fill: '#D4AF37' }));
            compass.appendChild(createEl('line', { x1: 0, y1: -24, x2: 0, y2: 24, stroke: '#D4AF37', 'stroke-width': '0.7' }));
            compass.appendChild(createEl('line', { x1: -24, y1: 0, x2: 24, y2: 0, stroke: '#D4AF37', 'stroke-width': '0.7' }));
            const nTxt = createEl('text', { x: 0, y: -27, 'text-anchor': 'middle', fill: '#D4AF37', 'font-size': '8.5', 'font-family': 'Cinzel, serif', 'font-weight': '600' });
            nTxt.textContent = 'N';
            compass.appendChild(nTxt);
            svg.appendChild(compass);

            // Smooth Country Base Silhouette
            if (!country.isShowcaseGrid) {
                const baseGroup = createEl('g', { filter: 'url(#countryDrop)' });
                (country.outlinePaths || []).forEach(d => {
                    baseGroup.appendChild(createEl('path', { d, class: 'country-outline-base' }));
                });
                svg.appendChild(baseGroup);
            }

            // Organic Clickable Wine Region Zones + Crisp Labels
            const regionsGroup = createEl('g');
            const labelsGroup = createEl('g');

            country.regions.forEach((reg, idx) => {
                const count = regionCounts[reg.id] || 0;
                const intensity = count > 0 ? 0.38 + 0.54 * Math.sqrt(count / maxCount) : 0;

                let shapeEl;
                let lx = reg.lx;
                let ly = reg.ly;

                if (country.isShowcaseGrid) {
                    const col = idx % 3;
                    const row = Math.floor(idx / 3);
                    const rx = 56 + col * 172 + (row === 1 ? 86 : 0);
                    const ry = 95 + row * 175;
                    lx = rx + 72;
                    ly = ry + 64;
                    shapeEl = createEl('rect', {
                        x: rx, y: ry, width: 144, height: 128, rx: 18,
                        class: `atlas-geo-shape ${count > 0 ? 'has-wines' : 'no-wines'}`,
                        'data-region': reg.id,
                        tabindex: '0',
                        role: 'button',
                        'aria-label': `${reg.name}: ${count} wines`
                    });
                } else {
                    shapeEl = createEl('path', {
                        d: reg.path,
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
                    shapeEl.style.fillOpacity = '0.5';
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

                // Clean label + count pill
                const lbl = createEl('text', {
                    x: lx, y: ly - (count > 0 ? 5 : 0),
                    'text-anchor': 'middle',
                    class: 'atlas-geo-label atlas-geo-label--region'
                });
                lbl.textContent = reg.short;
                labelsGroup.appendChild(lbl);

                if (count > 0) {
                    const badgeG = createEl('g', { class: 'atlas-geo-count-pill' });
                    badgeG.appendChild(createEl('rect', {
                        x: lx - 12, y: ly + 1, width: 24, height: 15, rx: 7.5,
                        fill: palette.accent, stroke: '#0B0A09', 'stroke-width': '1'
                    }));
                    const cnt = createEl('text', {
                        x: lx, y: ly + 11.5,
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

            // Populate Regional Quick-Jump Carousel below map
            const sortedRegions = [...country.regions].sort((a, b) => (regionCounts[b.id] || 0) - (regionCounts[a.id] || 0));
            this.quickJumpEl.innerHTML = sortedRegions.map(r => {
                const cnt = regionCounts[r.id] || 0;
                return `<button type="button" class="quickjump-pill" data-jump-region="${r.id}">
                    <span class="qj-name">${global.AtlasStore.escapeHtml(r.name)}</span>
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
