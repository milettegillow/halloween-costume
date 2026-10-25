/* Halloween costume - state, rendering, controls, look names and PNG download. */
(function () {
  'use strict';

  const M = DATA.makeup;
  const MAKEUP_KEYS = ['skin', 'underEyes', 'lenses', 'eyes', 'facePaint', 'effects', 'lips', 'extras'];

  // Thumbnail crops, in portrait coordinates.
  const CROP = {
    head: '55 46 290 290',
    hair: '10 30 380 380',
    eyes: '122 150 156 156',
    mouth: '126 196 148 148',
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
    { id: 'underEyes', label: 'Under-eyes', groups: [{ key: 'underEyes', options: M.underEyes, crop: 'eyes' }] },
    { id: 'lenses', label: 'Lenses', groups: [{ key: 'lenses', options: M.lenses, crop: 'eyes' }] },
    { id: 'eyes', label: 'Eye makeup', groups: [{ key: 'eyes', options: M.eyes, crop: 'eyes' }] },
    { id: 'facePaint', label: 'Face paint', groups: [{ key: 'facePaint', options: M.facePaint, crop: 'head' }] },
    { id: 'effects', label: 'Effects', groups: [{ key: 'effects', options: M.effects, crop: 'head' }] },
    { id: 'lips', label: 'Lips', groups: [{ key: 'lips', options: M.lips, crop: 'mouth' }] },
    { id: 'extras', label: 'Extras', groups: [{ key: 'extras', options: M.extras, crop: 'head', multi: true }] },
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

  let state = clone(DATA.defaults);
  let activeTab = 'face';

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
      skin: s.skin, underEyes: s.underEyes, lenses: s.lenses, eyes: s.eyes,
      facePaint: s.facePaint, effects: s.effects, lips: s.lips, extras: s.extras.slice(),
      clothing: s.clothing, headwear: s.headwear, accessory: s.accessory
    };
  }

  /* ---------- look name ---------- */

  function adjective(s, key) {
    if (key === 'extras') {
      const first = M.extras.find(o => o.id !== 'none' && s.extras.includes(o.id));
      return first ? first.namePart : '';
    }
    const o = byId(M[key], s[key]);
    return o.id === 'none' ? '' : o.namePart;
  }

  function lookName(s) {
    const firstOrder = ['effects', 'facePaint', 'extras', 'eyes', 'lenses', 'underEyes', 'lips', 'skin'];
    const secondOrder = ['skin', 'underEyes', 'lips', 'lenses', 'eyes', 'extras', 'facePaint', 'effects'];
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
    if (s.outfit) noun = byId(DATA.outfits, s.outfit).nouns[s.features];
    else if (s.clothing !== 'plain') noun = byId(DATA.clothing, s.clothing).noun;
    else noun = byId(DATA.features, s.features).noun;

    return `The ${first} ${second} ${noun}`;
  }

  /* ---------- method and shopping list ---------- */

  function recipe(s) {
    const steps = [];
    const products = [];
    const add = item => {
      if (!item) return;
      (item.steps || []).forEach(st => steps.push(typeof st === 'string' ? [item.applyOrder, st] : st));
      (item.products || []).forEach(p => products.push(p));
    };

    const chosen = [];
    MAKEUP_KEYS.forEach(k => {
      if (k === 'extras') s.extras.forEach(id => chosen.push(byId(M.extras, id)));
      else if (s[k] !== 'none') chosen.push(byId(M[k], s[k]));
    });
    const onSkin = MAKEUP_KEYS.some(k => k !== 'lenses' && (k === 'extras' ? s.extras.length : s[k] !== 'none'));
    if (onSkin) add(DATA.prep);
    chosen.forEach(add);
    if (s.lenses !== 'none') add(M.lensCare);
    if (onSkin) add(DATA.setting);

    const d = DATA.defaults;
    const outfit = s.outfit ? byId(DATA.outfits, s.outfit) : null;
    const hairSet = (outfit && outfit.set.hairStyle) || s.hairStyle !== d.hairStyle || s.hairColour !== d.hairColour;
    if (hairSet) {
      const style = byId(DATA.hairStyles, s.hairStyle);
      if (style.id === 'shaved') {
        add(DATA.baldCap);
        products.push({ name: 'Latex bald cap', q: 'latex bald cap' });
      } else {
        const colour = byId(DATA.hairColours, s.hairColour);
        add(DATA.wig);
        products.push({ name: `${colour.label} ${style.wig}`, q: `${colour.label.toLowerCase()} ${style.wig}` });
      }
    }

    add(byId(DATA.clothing, s.clothing));
    add(byId(DATA.headwear, s.headwear));
    add(byId(DATA.accessories, s.accessory));
    if (outfit) add(Object.assign({ applyOrder: 110 }, outfit));

    const seen = new Set();
    const method = steps
      .map((st, i) => ({ order: st[0], text: st[1], i }))
      .sort((a, b) => a.order - b.order || a.i - b.i)
      .filter(st => !seen.has(st.text) && seen.add(st.text))
      .map(st => st.text);

    const names = new Set();
    const shopping = products.filter(p => !names.has(p.name) && names.add(p.name));
    return { method, shopping };
  }

  function amazonUrl(q) {
    let url = 'https://www.amazon.co.uk/s?k=' + encodeURIComponent(q);
    if (AMAZON_TAG) url += '&tag=' + encodeURIComponent(AMAZON_TAG);
    return url;
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
    const name = lookName(state);
    $('#mirror').innerHTML = Art.mirrorSVG(resolve(state), 'm', `role="img" aria-label="${name}"`);
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

  function isSelected(group, id) {
    if (group.multi) return id === 'none' ? state.extras.length === 0 : state.extras.includes(id);
    return state[group.key] === id;
  }

  function choose(group, id) {
    if (group.multi) {
      if (id === 'none') state.extras = [];
      else if (state.extras.includes(id)) state.extras = state.extras.filter(x => x !== id);
      else state.extras = state.extras.concat(id);
    } else {
      state[group.key] = id;
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
        const sel = isSelected(g, o.id);
        const b = el('button', { class: 'pan', type: 'button', 'aria-pressed': String(sel) });
        const art = el('span', { class: 'pan-art' });
        if (g.swatch) {
          art.classList.add('pan-swatch');
          art.style.setProperty('--swatch', o.hex);
        } else {
          const look = Object.assign({}, base);
          if (g.multi) look.extras = o.id === 'none' ? [] : [o.id];
          else if (g.key === 'skinTone') look.skinTone = o.hex;
          else look[g.key] = o.id;
          art.innerHTML = Art.portraitSVG(look, `t${gi}_${oi}_`, CROP[g.crop], 'aria-hidden="true" focusable="false"');
        }
        b.appendChild(art);
        b.appendChild(el('span', { class: 'pan-label' }, o.label));
        b.addEventListener('click', () => choose(g, o.id));
        grid.appendChild(b);
      });
      section.appendChild(grid);
      wrap.appendChild(section);
    });
  }

  function renderOutfits() {
    const wrap = $('#outfits');
    wrap.innerHTML = '';
    [{ id: null, label: 'Create your own' }].concat(DATA.outfits).forEach(o => {
      const b = el('button', { class: 'outfit', type: 'button', 'aria-pressed': String(state.outfit === o.id) }, o.label);
      b.addEventListener('click', () => applyOutfit(o.id));
      wrap.appendChild(b);
    });
  }

  function renderNotebook() {
    const name = lookName(state);
    $('#look-name').textContent = name;
    const { method, shopping } = recipe(state);

    const ol = $('#method');
    ol.innerHTML = '';
    if (!method.length) ol.appendChild(el('li', { class: 'empty' }, 'Bare-faced and ready.'));
    method.forEach(t => ol.appendChild(el('li', {}, t)));

    const ul = $('#shopping');
    ul.innerHTML = '';
    if (!shopping.length) ul.appendChild(el('li', { class: 'empty' }, 'Nothing to buy yet.'));
    shopping.forEach(p => {
      const li = el('li');
      li.appendChild(el('a', { href: amazonUrl(p.q), target: '_blank', rel: AMAZON_TAG ? 'noopener sponsored' : 'noopener' }, p.name));
      ul.appendChild(li);
    });
    $('#affiliate').hidden = !AMAZON_TAG || !shopping.length;
  }

  function update() {
    renderMirror();
    renderPans();
    renderOutfits();
    renderNotebook();
  }

  /* ---------- outfits, randomise and reset ---------- */

  function outfitState(s, id) {
    const o = byId(DATA.outfits, id);
    const next = Object.assign({}, s, {
      skin: 'none', underEyes: 'none', lenses: 'none', eyes: 'none', facePaint: 'none', effects: 'none', lips: 'none', extras: [],
      clothing: 'plain', headwear: 'none', accessory: 'none'
    }, clone(o.set));
    next.outfit = id;
    return next;
  }

  // Picking the selected outfit again, or "Create your own", returns to the neutral default.
  function applyOutfit(id) {
    if (id === null || id === state.outfit) {
      if (state.outfit === null) return;
      state = clone(DATA.defaults);
    } else {
      state = outfitState(state, id);
    }
    update();
  }

  const pick = list => list[Math.floor(Math.random() * list.length)];

  function clashes(s) {
    const has = tag => {
      const [k, v] = tag.split(':');
      return k === 'extras' ? s.extras.includes(v) : s[k] === v;
    };
    return DATA.incompatible.some(([a, b]) => has(a) && has(b));
  }

  function randomise() {
    const others = DATA.outfits.filter(o => o.id !== state.outfit);
    let s = outfitState(state, pick(others).id);
    s.shape = pick(DATA.faceShapes).id;
    s.features = pick(DATA.features).id;
    s.skinTone = pick(DATA.skinTones).id;
    if (Math.random() < 0.4) s.hairColour = pick(DATA.hairColours).id;
    const keys = ['underEyes', 'lenses', 'eyes', 'lips', 'effects', 'extras'];
    let tweaks = 1 + Math.floor(Math.random() * 2);
    for (let tries = 0; tweaks > 0 && tries < 40; tries++) {
      const k = pick(keys);
      const t = clone(s);
      if (k === 'extras') {
        const id = pick(M.extras.filter(o => o.id !== 'none' && !s.extras.includes(o.id))).id;
        t.extras = s.extras.concat(id);
      } else {
        if (s[k] !== 'none') continue;
        t[k] = pick(M[k].filter(o => o.id !== 'none')).id;
      }
      if (clashes(t)) continue;
      s = t;
      tweaks--;
    }
    state = s;
    update();
  }

  function reset() {
    state = clone(DATA.defaults);
    activeTab = 'face';
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
    update();
  });

  // Exposed for checking looks in the browser console.
  window.Vanity = { get state() { return state; }, set: s => { state = Object.assign(clone(DATA.defaults), s); update(); }, lookName, recipe };
})();
