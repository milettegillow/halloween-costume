/* Halloween costume - state, rendering, controls, presets, look names and PNG download. */
(function () {
  'use strict';

  const M = DATA.makeup;
  // Face makeup categories, in the order they are listed. A mask hides all of these.
  const MAKEUP_KEYS = ['skin', 'contour', 'underEyes', 'lenses', 'eyes', 'facePaint', 'effects', 'lips', 'extras'];
  const MULTI = ['effects', 'extras'];

  // Thumbnail crops, in portrait coordinates.
  const CROP = {
    head: '55 46 290 290',
    hair: '10 30 380 380',
    eyes: '122 150 156 156',
    mouth: '126 196 148 148',
    face: '80 120 240 240',
    body: '30 250 340 340',
    hat: '10 10 380 380'
  };

  const TABS = [
    {
      id: 'face', label: 'Face', groups: [
        { key: 'shape', label: 'Face shape', options: DATA.faceShapes, crop: 'head' },
        { key: 'features', label: 'Features', options: DATA.features, crop: 'head' },
        { key: 'skinTone', label: 'Skin tone', options: DATA.skinTones, swatch: true }
      ]
    },
    {
      id: 'hair', label: 'Hair', groups: [
        { key: 'hairStyle', label: 'Style', options: DATA.hairStyles, crop: 'hair' },
        { key: 'hairColour', label: 'Colour', options: DATA.hairColours, swatch: true }
      ]
    },
    { id: 'skin', label: 'Skin', groups: [{ key: 'skin', options: M.skin, crop: 'head' }] },
    { id: 'contour', label: 'Contour', groups: [{ key: 'contour', options: M.contour, crop: 'face' }] },
    { id: 'underEyes', label: 'Under-eyes', groups: [{ key: 'underEyes', options: M.underEyes, crop: 'eyes' }] },
    { id: 'lenses', label: 'Lenses', groups: [{ key: 'lenses', options: M.lenses, crop: 'eyes' }] },
    { id: 'eyes', label: 'Eye makeup', groups: [{ key: 'eyes', options: M.eyes, crop: 'face' }] },
    { id: 'facePaint', label: 'Face paint', groups: [{ key: 'facePaint', options: M.facePaint, crop: 'head' }] },
    { id: 'effects', label: 'Effects', groups: [{ key: 'effects', options: M.effects, crop: 'head' }] },
    { id: 'lips', label: 'Lips', groups: [{ key: 'lips', options: M.lips, crop: 'mouth' }] },
    { id: 'extras', label: 'Extras', groups: [{ key: 'extras', options: M.extras, crop: 'head' }] },
    { id: 'masks', label: 'Masks', groups: [{ key: 'mask', options: DATA.masks, crop: 'hat' }] },
    {
      id: 'costume', label: 'Costume', groups: [
        { key: 'clothing', label: 'Clothing', options: DATA.clothing, crop: 'body' },
        { key: 'headwear', label: 'Headwear', options: DATA.headwear, crop: 'hat' },
        { key: 'accessory', label: 'Accessory', options: DATA.accessories, crop: 'body' }
      ]
    }
  ];

  const byId = (list, id) => list.find(o => o.id === id) || list[0];
  const clone = o => JSON.parse(JSON.stringify(o));
  const isMulti = key => MULTI.includes(key);
  const optionsFor = key => key === 'mask' ? DATA.masks : M[key];

  let state = clone(DATA.defaults);
  let activeTab = 'face';
  let filter = 'all';
  let openPreset = null;

  /* ---------- presets ---------- */

  const presetById = id => DATA.presets.find(p => p.id === id);
  const versionOf = s => {
    const p = presetById(s.preset);
    return p ? p.versions.find(v => v.id === s.version) : null;
  };
  const visibleVersions = p => p.versions.filter(v => filter === 'all' || v.tag === filter);

  // The neutral default with the version applied, keeping the person's face.
  function versionState(s, presetId, versionId) {
    const v = presetById(presetId).versions.find(x => x.id === versionId);
    const next = Object.assign(clone(DATA.defaults), { shape: s.shape, features: s.features, skinTone: s.skinTone }, clone(v.set));
    if (v.byFeatures) Object.assign(next, clone(v.byFeatures[next.features] || {}));
    next.preset = presetId;
    next.version = versionId;
    return next;
  }

  /* ---------- look resolution ---------- */

  function resolve(s) {
    const colour = byId(DATA.hairColours, s.hairColour);
    return {
      shape: s.shape,
      features: s.features,
      skinTone: byId(DATA.skinTones, s.skinTone).hex,
      hairStyle: s.hairStyle,
      hairColour: colour.hex,
      browColour: colour.brow,
      skin: s.skin, contour: s.contour, underEyes: s.underEyes, lenses: s.lenses, eyes: s.eyes,
      facePaint: s.facePaint, effects: s.effects.slice(), lips: s.lips, extras: s.extras.slice(), mask: s.mask,
      clothing: s.clothing, headwear: s.headwear, accessory: s.accessory
    };
  }

  /* ---------- look name ---------- */

  function adjective(s, key) {
    if (key === 'mask') return s.mask === 'none' ? '' : byId(DATA.masks, s.mask).namePart;
    if (s.mask !== 'none') return '';
    if (isMulti(key)) {
      const first = M[key].find(o => o.id !== 'none' && s[key].includes(o.id));
      return first ? first.namePart : '';
    }
    const o = byId(M[key], s[key]);
    return o.id === 'none' ? '' : o.namePart;
  }

  function lookName(s) {
    const firstOrder = ['mask', 'effects', 'facePaint', 'extras', 'eyes', 'lenses', 'contour', 'underEyes', 'lips', 'skin'];
    const secondOrder = ['skin', 'contour', 'underEyes', 'lips', 'lenses', 'eyes', 'extras', 'facePaint', 'effects'];
    const d = DATA.defaults;
    const hairColourWord = s.hairColour !== d.hairColour ? byId(DATA.hairColours, s.hairColour).namePart : '';
    const hairStyleWord = s.hairStyle !== d.hairStyle ? byId(DATA.hairStyles, s.hairStyle).namePart : '';

    let first = '', firstKey = '';
    for (const k of firstOrder) {
      const w = adjective(s, k);
      if (w) { first = w; firstKey = k; break; }
    }
    let second = '';
    if (first) {
      for (const k of secondOrder) {
        const w = k === firstKey ? '' : adjective(s, k);
        if (w && w !== first) { second = w; break; }
      }
      second = second || hairColourWord || hairStyleWord || DATA.nameFallbacks.solo;
    } else {
      first = hairColourWord || DATA.nameFallbacks.first;
      second = hairStyleWord || DATA.nameFallbacks.second;
    }

    let noun;
    const v = versionOf(s);
    if (v) noun = (v.nouns || presetById(s.preset).nouns)[s.features];
    else if (s.clothing !== 'plain') noun = byId(DATA.clothing, s.clothing).noun;
    else noun = byId(DATA.features, s.features).noun;

    return `The ${first} ${second} ${noun}`;
  }

  /* ---------- method and shopping list ---------- */

  const product = p => typeof p === 'string' ? (DATA.kit[p] || DATA.costume[p]) : p;

  function recipe(s) {
    const steps = [];
    const products = [];
    const add = item => {
      if (!item) return;
      (item.steps || []).forEach(st => steps.push(typeof st === 'string' ? [item.applyOrder, st] : st));
      (item.products || []).forEach(p => products.push(product(p.byFeatures ? p.byFeatures[s.features] : p)));
    };

    const masked = s.mask !== 'none';
    const chosen = [];
    if (!masked) {
      MAKEUP_KEYS.forEach(k => {
        if (isMulti(k)) s[k].forEach(id => chosen.push(byId(M[k], id)));
        else if (s[k] !== 'none') chosen.push(byId(M[k], s[k]));
      });
    }
    const onSkin = chosen.some(item => !M.lenses.includes(item));

    const d = DATA.defaults;
    const v = versionOf(s);
    const hairSet = (v && v.set.hairStyle) || s.hairStyle !== d.hairStyle || s.hairColour !== d.hairColour;
    const style = byId(DATA.hairStyles, s.hairStyle);
    const bald = hairSet && style.id === 'shaved';

    if (onSkin) add(DATA.prep);
    if (chosen.some(item => item.patch) || bald) add(DATA.patchTest);
    chosen.forEach(add);
    // latex wounds share one method, after their placement lines
    if (chosen.some(item => item.wound)) add(DATA.woundMethod);
    if (onSkin) add(DATA.setting);
    if (masked) add(byId(DATA.masks, s.mask));

    if (hairSet) {
      if (bald) add(DATA.baldCap);
      else {
        const colour = byId(DATA.hairColours, s.hairColour);
        add(DATA.wig);
        products.push(Object.assign({}, DATA.kit.wig, { name: `${colour.label} ${style.wig}` }));
      }
    }

    add(byId(DATA.clothing, s.clothing));
    add(byId(DATA.headwear, s.headwear));
    add(byId(DATA.accessories, s.accessory));
    const preset = v ? presetById(s.preset) : null;
    if (preset) add({ applyOrder: 110, steps: [], products: preset.products || [] });
    if (v) add(Object.assign({ applyOrder: 110 }, v));
    const wardrobe = preset ? (preset.wardrobe || []).concat(v.wardrobe || []) : [];

    const seen = new Set();
    const method = steps
      .map((st, i) => ({ order: st[0], text: st[1], i }))
      .sort((a, b) => a.order - b.order || a.i - b.i)
      .filter(st => !seen.has(st.text) && seen.add(st.text))
      .map(st => st.text);

    const names = new Set();
    const shopping = products.filter(p => !names.has(p.name) && names.add(p.name));
    return { method, shopping, wardrobe };
  }

  // Amazon links carry the tag; external links (the lenses) do not.
  function linkFor(p) {
    if (p.url) return { href: p.url, rel: 'noopener' };
    const tag = AMAZON_TAG ? encodeURIComponent(AMAZON_TAG) : '';
    const href = p.asin
      ? `https://www.amazon.co.uk/dp/${encodeURIComponent(p.asin)}` + (tag ? `?tag=${tag}` : '')
      : 'https://www.amazon.co.uk/s?k=' + encodeURIComponent(p.q) + (tag ? `&tag=${tag}` : '');
    return { href, rel: 'sponsored noopener' };
  }

  function productRow(p) {
    const li = el('li');
    if (p.asin || p.q || p.url) {
      const link = linkFor(p);
      li.appendChild(el('a', { href: link.href, target: '_blank', rel: link.rel }, p.name));
      // alternatives sit in the same row as "or" options
      (p.alts || []).forEach(alt => {
        const l = linkFor(alt);
        li.appendChild(document.createTextNode(' or '));
        li.appendChild(el('a', { href: l.href, target: '_blank', rel: l.rel }, alt.label));
      });
    } else {
      li.appendChild(el('span', {}, p.name));
    }
    if (p.note) li.appendChild(el('p', { class: 'product-note' }, p.note));
    return li;
  }

  /* ---------- rendering ---------- */

  const $ = sel => document.querySelector(sel);
  const el = (tag, attrs, text) => {
    const n = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') n.className = v;
      else n.setAttribute(k, v);
    });
    if (text !== undefined) n.textContent = text;
    return n;
  };

  function renderMirror() {
    $('#mirror').innerHTML = Art.mirrorSVG(resolve(state), 'm', `role="img" aria-label="${lookName(state)}"`);
  }

  function renderTabs() {
    const bar = $('#palette-tabs');
    bar.innerHTML = '';
    TABS.forEach(t => {
      const b = el('button', {
        class: 'tab', type: 'button', role: 'tab', id: 'tab-' + t.id,
        'aria-selected': String(t.id === activeTab), 'aria-controls': 'palette-pans', tabindex: t.id === activeTab ? '0' : '-1'
      }, t.label);
      b.addEventListener('click', () => { activeTab = t.id; renderTabs(); renderPans(); });
      b.addEventListener('keydown', e => {
        const i = TABS.findIndex(x => x.id === activeTab);
        let j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % TABS.length;
        if (e.key === 'ArrowLeft') j = (i - 1 + TABS.length) % TABS.length;
        if (j === null) return;
        e.preventDefault();
        activeTab = TABS[j].id;
        renderTabs();
        renderPans();
        $('#tab-' + activeTab).focus();
      });
      bar.appendChild(b);
    });
  }

  function isSelected(key, id) {
    if (isMulti(key)) return id === 'none' ? state[key].length === 0 : state[key].includes(id);
    return state[key] === id;
  }

  function choose(key, id) {
    if (isMulti(key)) {
      if (id === 'none') state[key] = [];
      else if (state[key].includes(id)) state[key] = state[key].filter(x => x !== id);
      else state[key] = state[key].concat(id);
    } else {
      state[key] = id;
      // some versions change with the features setting
      const v = versionOf(state);
      if (key === 'features' && v && v.byFeatures) Object.assign(state, clone(v.byFeatures[id] || {}));
    }
    update();
  }

  function renderPans() {
    const tab = TABS.find(t => t.id === activeTab);
    const wrap = $('#palette-pans');
    wrap.setAttribute('aria-labelledby', 'tab-' + tab.id);
    wrap.innerHTML = '';
    const base = resolve(state);
    tab.groups.forEach((g, gi) => {
      const section = el('div', { class: 'pan-group' });
      if (g.label) section.appendChild(el('h3', { class: 'pan-heading' }, g.label));
      const grid = el('div', { class: g.swatch ? 'pans pans-swatch' : 'pans' });
      g.options.forEach((o, oi) => {
        const b = el('button', { class: 'pan', type: 'button', 'aria-pressed': String(isSelected(g.key, o.id)) });
        const art = el('span', { class: 'pan-art' });
        if (g.swatch) {
          art.classList.add('pan-swatch');
          art.style.setProperty('--swatch', o.hex);
        } else {
          const look = Object.assign({}, base);
          if (isMulti(g.key)) look[g.key] = o.id === 'none' ? [] : [o.id];
          else look[g.key] = o.id;
          // show makeup on a bare face, so a mask never hides the tile
          if (g.key !== 'mask' && optionsFor(g.key)) look.mask = 'none';
          art.innerHTML = Art.portraitSVG(look, `t${gi}_${oi}_`, CROP[g.crop], 'aria-hidden="true" focusable="false"');
        }
        b.appendChild(art);
        b.appendChild(el('span', { class: 'pan-label' }, o.label));
        b.addEventListener('click', () => choose(g.key, o.id));
        grid.appendChild(b);
      });
      section.appendChild(grid);
      wrap.appendChild(section);
    });
  }

  function renderFilters() {
    const wrap = $('#preset-filters');
    wrap.innerHTML = '';
    DATA.filters.forEach(f => {
      const b = el('button', { class: 'filter', type: 'button', 'aria-pressed': String(filter === f.id) }, f.label);
      b.addEventListener('click', () => {
        filter = f.id;
        const p = presetById(openPreset);
        if (p && !visibleVersions(p).length) openPreset = null;
        renderPresets();
      });
      wrap.appendChild(b);
    });
  }

  // Preset thumbnails only change with the face, so they are cached against it.
  let thumbKey = '';
  const thumbs = {};
  function presetThumb(p) {
    const v = visibleVersions(p)[0];
    const key = `${p.id}:${v.id}`;
    if (!thumbs[key]) thumbs[key] = Art.portraitSVG(resolve(versionState(state, p.id, v.id)), `p_${p.id}_${v.id}_`, CROP.head, 'aria-hidden="true" focusable="false"');
    return thumbs[key];
  }

  function renderPresets() {
    renderFilters();
    const face = `${state.shape}:${state.features}:${state.skinTone}`;
    if (face !== thumbKey) {
      thumbKey = face;
      Object.keys(thumbs).forEach(k => delete thumbs[k]);
    }
    const grid = $('#preset-grid');
    grid.innerHTML = '';

    const own = el('button', { class: 'preset', type: 'button', 'aria-pressed': String(state.version === null) });
    const ownArt = el('span', { class: 'pan-art' });
    ownArt.innerHTML = Art.portraitSVG(resolve(clone(DATA.defaults)), 'p_own_', CROP.head, 'aria-hidden="true" focusable="false"');
    own.appendChild(ownArt);
    own.appendChild(el('span', { class: 'pan-label' }, 'Create your own'));
    own.addEventListener('click', () => {
      openPreset = null;
      if (state.version !== null) state = clone(DATA.defaults);
      update();
    });
    grid.appendChild(own);

    DATA.presets.forEach(p => {
      if (!visibleVersions(p).length) return;
      const loaded = state.preset === p.id && state.version !== null;
      const b = el('button', {
        class: 'preset' + (loaded ? ' is-loaded' : ''), type: 'button',
        'aria-expanded': String(openPreset === p.id), 'aria-controls': 'preset-versions'
      });
      const art = el('span', { class: 'pan-art' });
      art.innerHTML = presetThumb(p);
      b.appendChild(art);
      b.appendChild(el('span', { class: 'pan-label' }, p.label));
      b.addEventListener('click', () => {
        openPreset = openPreset === p.id ? null : p.id;
        renderPresets();
        if (openPreset) $('#preset-versions').scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });
      grid.appendChild(b);
    });

    const versions = $('#preset-versions');
    versions.innerHTML = '';
    const p = presetById(openPreset);
    versions.hidden = !p;
    if (!p) return;
    versions.appendChild(el('h3', { class: 'versions-heading' }, p.label));
    const row = el('div', { class: 'version-buttons' });
    visibleVersions(p).forEach(v => {
      const on = state.preset === p.id && state.version === v.id;
      const b = el('button', { class: 'version', type: 'button', 'aria-pressed': String(on) }, v.label);
      b.addEventListener('click', () => {
        if (on) state = clone(DATA.defaults);
        else state = versionState(state, p.id, v.id);
        update();
      });
      row.appendChild(b);
    });
    versions.appendChild(row);
  }

  function renderNotebook() {
    $('#look-name').textContent = lookName(state);
    const { method, shopping, wardrobe } = recipe(state);

    const wr = $('#wardrobe');
    wr.innerHTML = '';
    wardrobe.forEach(t => wr.appendChild(el('li', {}, t)));
    $('#wardrobe-section').hidden = !wardrobe.length;

    const ol = $('#method');
    ol.innerHTML = '';
    if (!method.length) ol.appendChild(el('li', { class: 'empty' }, 'Bare-faced and ready.'));
    method.forEach(t => ol.appendChild(el('li', {}, t)));

    const ul = $('#shopping');
    ul.innerHTML = '';
    if (!shopping.length) ul.appendChild(el('li', { class: 'empty' }, 'Nothing to buy yet.'));
    shopping.forEach((p, i) => {
      ul.appendChild(productRow(p));
      // the lens notes sit once, under the lens
      if (p.lens && !(shopping[i + 1] && shopping[i + 1].lens)) {
        const notes = el('li', { class: 'lens-notes' });
        DATA.lensNotes.forEach(t => notes.appendChild(el('p', {}, t)));
        ul.appendChild(notes);
      }
    });
    $('#affiliate').hidden = !AMAZON_TAG;
  }

  function renderEssentials() {
    $('#essentials-intro').textContent = DATA.essentials.intro;
    const ul = $('#essentials');
    ul.innerHTML = '';
    DATA.essentials.products.forEach(k => ul.appendChild(productRow(product(k))));
  }

  function update() {
    renderMirror();
    renderPans();
    renderPresets();
    renderNotebook();
  }

  /* ---------- randomise and reset ---------- */

  const pick = list => list[Math.floor(Math.random() * list.length)];

  function clashes(s) {
    const has = tag => {
      const [k, v] = tag.split(':');
      return isMulti(k) ? s[k].includes(v) : s[k] === v;
    };
    return DATA.incompatible.some(([a, b]) => has(a) && has(b));
  }

  function randomise() {
    const pool = [];
    DATA.presets.forEach(p => visibleVersions(p).forEach(v => {
      if (!(p.id === state.preset && v.id === state.version)) pool.push([p.id, v.id]);
    }));
    const [pid, vid] = pick(pool);
    let s = clone(state);
    s.shape = pick(DATA.faceShapes).id;
    s.features = pick(DATA.features).id;
    s.skinTone = pick(DATA.skinTones).id;
    s = versionState(s, pid, vid);
    if (Math.random() < 0.4) s.hairColour = pick(DATA.hairColours).id;
    if (s.mask === 'none') {
      const keys = ['contour', 'underEyes', 'lenses', 'eyes', 'lips', 'effects', 'extras'];
      let tweaks = 1 + Math.floor(Math.random() * 2);
      for (let tries = 0; tweaks > 0 && tries < 40; tries++) {
        const k = pick(keys);
        const t = clone(s);
        if (isMulti(k)) {
          const options = M[k].filter(o => o.id !== 'none' && !s[k].includes(o.id));
          t[k] = s[k].concat(pick(options).id);
        } else {
          if (s[k] !== 'none') continue;
          t[k] = pick(M[k].filter(o => o.id !== 'none')).id;
        }
        if (clashes(t)) continue;
        s = t;
        tweaks--;
      }
    }
    openPreset = pid;
    state = s;
    update();
  }

  function reset() {
    state = clone(DATA.defaults);
    activeTab = 'face';
    openPreset = null;
    renderTabs();
    update();
  }

  /* ---------- PNG download ---------- */

  function slug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-look';
  }

  function download() {
    const V = Art.VIEW, scale = 2;
    const w = V.w * scale, h = V.h * scale;
    const svg = Art.mirrorSVG(resolve(state), 'dl', `width="${w}" height="${h}"`);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#0c1310';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = slug(lookName(state)) + '.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, 'image/png');
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  }

  /* ---------- start ---------- */

  function decorate() {
    document.querySelectorAll('.ornate').forEach(panel => {
      ['tl', 'tr', 'bl', 'br'].forEach(pos => {
        const c = el('span', { class: 'corner corner-' + pos, 'aria-hidden': 'true' });
        c.innerHTML = Art.cornerSVG();
        panel.appendChild(c);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    decorate();
    $('#randomise').addEventListener('click', randomise);
    $('#reset').addEventListener('click', reset);
    $('#download').addEventListener('click', download);
    renderTabs();
    renderEssentials();
    update();
  });

  // Exposed for checking looks in the browser console.
  window.Vanity = {
    get state() { return state; },
    set: s => { state = Object.assign(clone(DATA.defaults), s); update(); },
    lookFor: (presetId, versionId, shape, features) => resolve(versionState(Object.assign(clone(DATA.defaults), { shape, features }), presetId, versionId)),
    lookName, recipe
  };
})();
