/* ==========================================================================
   HPSA site code. You normally don't need to edit this file -
   everyday changes are made in config.js and in your Google Sheets.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.HPSA;
  var SAMPLE = window.HPSA_SAMPLE || {};
  var TZ = 'America/Toronto';

  /* ---------------- tiny helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }

  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    for (var i = 2; i < arguments.length; i++) {
      var kid = arguments[i];
      if (kid == null) continue;
      node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    }
    return node;
  }

  function slugify(name) {
    return String(name).toLowerCase()
      .replace(/[‘’'`]/g, '')
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function isNum(v) { return /^-?(\d+\.?\d*|\.\d+)$/.test(String(v).trim()); }

  /* ---------------- CSV loading ---------------- */
  function parseCSV(text) {
    text = String(text).replace(/^﻿/, '');
    var rows = [], row = [], cur = '', q = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ',') { row.push(cur); cur = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text[i + 1] === '\n') i++;
        row.push(cur); cur = ''; rows.push(row); row = [];
      } else cur += c;
    }
    if (cur !== '' || row.length) { row.push(cur); rows.push(row); }

    rows = rows.map(function (r) { return r.map(function (c) { return c.trim(); }); })
               .filter(function (r) { return r.some(function (c) { return c !== ''; }); });
    if (!rows.length) return { headers: [], rows: [] };

    var head = rows[0], body = rows.slice(1);
    // drop columns that have no heading and no data
    var keepIdx = [];
    head.forEach(function (h, i) {
      if (h !== '' || body.some(function (r) { return (r[i] || '') !== ''; })) keepIdx.push(i);
    });
    return {
      headers: keepIdx.map(function (i) { return head[i]; }),
      rows: body.map(function (r) { return keepIdx.map(function (i) { return r[i] || ''; }); })
    };
  }

  function loadTable(url, sampleCsv) {
    if (!url) {
      return Promise.resolve({ table: parseCSV(sampleCsv || ''), sample: true });
    }
    var sep = url.indexOf('?') === -1 ? '?' : '&';
    return fetch(url + sep + '_=' + Math.floor(Date.now() / 60000), { cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.text(); })
      .then(function (txt) { return { table: parseCSV(txt), sample: false }; });
  }

  /* ---------------- header, menu, footer ---------------- */
  function currentFile() {
    var f = location.pathname.split('/').pop();
    return f === '' ? 'index.html' : f;
  }

  function buildHeader() {
    var host = $('#site-header');
    if (!host) return;
    var cur = currentFile();

    var logo = el('img', { class: 'brand-logo', src: 'assets/logo.png', alt: '' });
    var brandText = el('span', { class: 'brand-text', text: CFG.siteName });
    logo.addEventListener('load', function () { logo.style.display = 'block'; brandText.style.display = 'none'; });
    logo.addEventListener('error', function () { logo.remove(); });
    var brand = el('a', { class: 'brand', href: 'index.html', 'aria-label': CFG.fullName + ' home' }, logo, brandText);

    var list = el('ul', { class: 'nav-list' });
    CFG.nav.forEach(function (item) {
      var li = el('li', { class: 'nav-item' + (item.children ? ' has-sub' : '') });
      if (item.children) {
        var active = item.children.some(function (c) { return c.href === cur; });
        var btn = el('button', { class: 'nav-link nav-toggle' + (active ? ' is-active' : ''), type: 'button', 'aria-expanded': 'false', 'aria-haspopup': 'true' }, item.label);
        var sub = el('ul', { class: 'subnav' });
        item.children.forEach(function (c) {
          var a = el('a', { href: c.href }, c.label);
          if (c.href === cur) a.setAttribute('aria-current', 'page');
          sub.append(el('li', {}, a));
        });
        btn.addEventListener('click', function () {
          var open = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        li.append(btn, sub);
      } else {
        var link = el('a', { class: 'nav-link', href: item.href }, item.label);
        if (item.href === cur) link.setAttribute('aria-current', 'page');
        li.append(link);
      }
      list.append(li);
    });

    var nav = el('nav', { class: 'nav', id: 'site-nav', 'aria-label': 'Main' }, list);
    var burger = el('button', { class: 'nav-burger', type: 'button', 'aria-controls': 'site-nav', 'aria-expanded': 'false' }, 'Menu');
    var header = el('header', { class: 'site-header' }, el('div', { class: 'bar' }, brand, burger, nav));

    burger.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        header.classList.remove('nav-open');
        burger.setAttribute('aria-expanded', 'false'); burger.textContent = 'Menu';
        header.querySelectorAll('.has-sub.open').forEach(function (n) { n.classList.remove('open'); });
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') header.querySelectorAll('.has-sub.open').forEach(function (n) { n.classList.remove('open'); });
    });

    host.replaceWith(el('div', {}, el('a', { class: 'skip', href: '#main' }, 'Skip to content'), header));
  }

  function buildFooter() {
    var host = $('#site-footer');
    if (!host) return;
    host.replaceWith(el('footer', { class: 'site-footer' }, el('div', { class: 'wrap' },
      el('p', {}, '© ' + new Date().getFullYear() + ' ' + CFG.fullName),
      el('p', {}, el('a', { href: 'contact.html' }, 'Contact us'))
    )));
  }

  /* ---------------- team logos ---------------- */
  function initials(name) {
    var words = String(name).replace(/[^A-Za-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    var sig = words.filter(function (w) { return !/^the$/i.test(w); });
    if (!sig.length) sig = words;
    if (sig.length === 1) return sig[0].slice(0, 2).toUpperCase();
    return (sig[0][0] + sig[1][0]).toUpperCase();
  }

  function teamLogo(name) {
    var wrap = el('span', { class: 'team-logo', 'aria-hidden': 'true' });
    var srcs = [];
    var custom = (CFG.logos || {})[name];
    if (custom) srcs.push(custom);
    var slug = slugify(name);
    (CFG.logoExtensions || ['png']).forEach(function (ext) { srcs.push('logos/' + slug + '.' + ext); });

    var n = 0, img = new Image();
    img.alt = ''; img.decoding = 'async';
    img.onerror = function () {
      n++;
      if (n < srcs.length) { img.src = srcs[n]; return; }
      var h = 0; for (var i = 0; i < name.length; i++) h = (h + name.charCodeAt(i)) % 3;
      wrap.textContent = '';
      wrap.className = 'team-logo is-badge badge-' + h;
      wrap.append(initials(name));
    };
    img.src = srcs[0];
    wrap.append(img);
    return wrap;
  }

  function teamCell(name) {
    return el('span', { class: 'team-cell' }, teamLogo(name), el('span', { text: name }));
  }

  /* ---------------- sortable table ---------------- */
  function buildTable(host, data, opts) {
    var headers = data.headers, rows = data.rows;
    var lower = (CFG.lowerIsBetter || []).map(function (s) { return s.toUpperCase(); });
    var rankI = -1, nameI = -1, teamI = -1, strkI = -1;
    headers.forEach(function (h, i) {
      var t = h.trim();
      if (rankI < 0 && /^(rank|pos|#)$/i.test(t)) rankI = i;
      if (nameI < 0 && /^(player(\s*name)?|name)$/i.test(t)) nameI = i;
      if (teamI < 0 && /^team$/i.test(t)) teamI = i;
      if (/^(strk|streak)$/i.test(t)) strkI = i;
    });
    var mainI = nameI >= 0 ? nameI : teamI;               // column that stays visible when scrolling
    var cols = headers.map(function (_, i) { return i; });
    if (opts.computedRank && rankI >= 0) cols = cols.filter(function (i) { return i !== rankI; });

    var numeric = headers.map(function (_, i) {
      var vals = rows.map(function (r) { return r[i]; });
      return vals.some(function (v) { return v !== ''; }) && vals.every(function (v) { return v === '' || isNum(v); });
    });

    var items = rows.map(function (r, n) { return { r: r, n: n }; });
    var sort = { i: -1, dir: 1 }, query = '', showAll = false;

    var wrap = el('div', { class: 'table-wrap' });
    var note = el('p', { class: 'table-note', 'aria-live': 'polite' });
    var tools = el('div', { class: 'table-tools' });
    var search, toggle;

    if (opts.search) {
      search = el('input', { class: 'search', type: 'search', placeholder: 'Search players or teams', 'aria-label': 'Search players or teams' });
      search.addEventListener('input', function () { query = search.value.trim().toLowerCase(); render(); });
      tools.append(search);
    }
    if (opts.limit) {
      toggle = el('button', { class: 'btn-quiet', type: 'button' });
      toggle.addEventListener('click', function () { showAll = !showAll; render(); });
      tools.append(toggle);
    }

    function compare(a, b) {
      var av = a.r[sort.i], bv = b.r[sort.i];
      if (av === '' && bv === '') return a.n - b.n;
      if (av === '') return 1;                 // blanks always last
      if (bv === '') return -1;
      var d = numeric[sort.i] ? parseFloat(av) - parseFloat(bv)
                              : av.localeCompare(bv, undefined, { numeric: true, sensitivity: 'base' });
      return d !== 0 ? d * sort.dir : a.n - b.n;
    }

    // First click: biggest first for numbers (smallest first for ERA etc.), A to Z for text.
    function firstDir(i) {
      return numeric[i] && lower.indexOf(headers[i].toUpperCase()) === -1 ? -1 : 1;
    }

    function clickHeader(i) {
      if (sort.i !== i) sort = { i: i, dir: firstDir(i) };
      else if (sort.dir === firstDir(i)) sort = { i: i, dir: -firstDir(i) };
      else sort = { i: -1, dir: 1 };            // third click: back to the sheet's own order
      render();
    }

    function classFor(i) {
      var c = [];
      if (i === rankI) c.push('col-rank', 'is-sticky', 'sticky-0');
      else if (i === mainI) c.push('t-left', 'is-sticky', rankI >= 0 || opts.computedRank ? 'sticky-1' : 'sticky-1-only');
      else if (i === teamI || !numeric[i]) c.push('t-left');
      if (i === sort.i) c.push('is-sorted');
      return c.join(' ');
    }

    function render() {
      var view = items.slice();
      if (sort.i >= 0) view.sort(compare);
      view.forEach(function (it, pos) { it.rank = pos + 1; });

      if (query) {
        view = view.filter(function (it) { return it.r.join(' ').toLowerCase().indexOf(query) !== -1; });
      }
      var total = view.length;
      var limited = opts.limit && !showAll && !query && total > opts.limit;
      if (limited) view = view.slice(0, opts.limit);

      var table = el('table', { class: 'data' });
      var tr = el('tr');
      if (opts.computedRank) tr.append(el('th', { scope: 'col', class: 'col-rank is-sticky sticky-0', text: '#' }));
      cols.forEach(function (i) {
        var th = el('th', { scope: 'col', class: classFor(i) });
        th.setAttribute('aria-sort', i === sort.i ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none');
        if (i === rankI) {
          th.textContent = headers[i];
        } else {
          var btn = el('button', { class: 'sort-btn', type: 'button', title: 'Sort by ' + headers[i] },
            headers[i], el('span', { class: 'sort-ind', 'aria-hidden': 'true', text: i === sort.i ? (sort.dir === 1 ? '▲' : '▼') : '⇅' }));
          btn.addEventListener('click', function () { clickHeader(i); });
          th.append(btn);
        }
        tr.append(th);
      });
      table.append(el('thead', {}, tr));

      var tbody = el('tbody');
      view.forEach(function (it) {
        var row = el('tr');
        if (opts.computedRank) row.append(el('td', { class: 'col-rank is-sticky sticky-0', text: it.rank }));
        cols.forEach(function (i) {
          var td = el('td', { class: classFor(i) });
          var v = it.r[i];
          if (i === teamI && v) td.append(teamCell(v));
          else if (i === strkI && /^[WLT]/i.test(v)) td.append(el('span', { class: /^W/i.test(v) ? 'strk-w' : /^L/i.test(v) ? 'strk-l' : '', text: v }));
          else td.textContent = v;
          row.append(td);
        });
        tbody.append(row);
      });
      table.append(tbody);
      wrap.textContent = '';
      wrap.append(table);

      if (!total) {
        note.textContent = query ? 'No matches for “' + search.value.trim() + '”.' : '';
      } else {
        note.textContent = limited ? 'Showing the top ' + view.length + ' of ' + total + '.'
                         : (query ? total + ' match' + (total === 1 ? '' : 'es') + '.' : '');
      }
      if (toggle) {
        var tooFew = rows.length <= opts.limit;
        toggle.hidden = tooFew || !!query;
        toggle.textContent = showAll ? 'Show top ' + opts.limit : 'Show all ' + rows.length;
      }
    }

    host.textContent = '';
    if (tools.children.length) host.append(tools);
    host.append(wrap, note);
    render();
  }

  /* ---------------- division page ---------------- */
  function initDivisionPage() {
    var key = document.body.getAttribute('data-division');
    var div = key && CFG.divisions[key];
    if (!div) return;

    var usedSample = false;
    function section(sel, url, sampleCsv, opts, label) {
      var host = $(sel);
      return loadTable(url, sampleCsv).then(function (res) {
        if (res.sample) usedSample = true;
        if (!res.table.headers.length) throw new Error('empty');
        buildTable(host, res.table, opts);
      }).catch(function () {
        host.textContent = '';
        host.append(el('p', { class: 'empty', text: label + ' can’t be shown right now. Check that the sheet tab is still published and the link in config.js is correct.' }));
      });
    }

    var smp = SAMPLE[key] || {};
    Promise.all([
      section('#standings-table', div.standingsUrl, smp.standings, { computedRank: false }, 'Standings'),
      section('#leaders-table', div.leadersUrl, smp.leaders, { computedRank: true, search: true, limit: CFG.leadersToShow || 10 }, 'Leaders')
    ]).then(function () {
      var note = $('#sample-note');
      if (note && usedSample) note.hidden = false;
    });
  }

  /* ---------------- home page: who is in first ---------------- */
  function initHomeCards() {
    document.querySelectorAll('[data-division-card]').forEach(function (card) {
      var key = card.getAttribute('data-division-card');
      var div = CFG.divisions[key];
      if (!div) return;
      var line = $('.div-first', card);
      loadTable(div.standingsUrl, (SAMPLE[key] || {}).standings).then(function (res) {
        var t = res.table, ti = t.headers.findIndex(function (h) { return /^team$/i.test(h); });
        if (ti >= 0 && t.rows[0] && t.rows[0][ti]) line.textContent = 'In first place: ' + t.rows[0][ti];
      }).catch(function () { /* leave the line blank */ });
    });
  }

  /* ---------------- countdown ---------------- */
  function tzOffsetMs(ts) {
    var dtf = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    var p = {};
    dtf.formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second) - ts;
  }

  function torontoToTs(y, mo, d, h, mi) {
    var guess = Date.UTC(y, mo - 1, d, h, mi);
    var ts = guess - tzOffsetMs(guess);
    return guess - tzOffsetMs(ts);
  }

  function parseWhen(s) {
    s = String(s || '').trim();
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T](\d{1,2}):(\d{2}))?/);
    if (m) return torontoToTs(+m[1], +m[2], +m[3], +(m[4] || 0), +(m[5] || 0));
    m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::\d{2})?\s*([AaPp][Mm])?)?/);   // 5/3/2027 6:30 PM
    if (m) {
      var h = +(m[4] || 0);
      if (m[6]) { var pm = /p/i.test(m[6]); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; }
      return torontoToTs(+m[3], +m[1], +m[2], h, +(m[5] || 0));
    }
    var t = Date.parse(s);
    return isNaN(t) ? NaN : t;
  }

  function whenText(ts) {
    var p = {};
    new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
      .formatToParts(new Date(ts)).forEach(function (x) { p[x.type] = x.value; });
    var thisYear = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric' }).format(new Date()) === p.year;
    return p.weekday + ', ' + p.month + ' ' + p.day + (thisYear ? '' : ', ' + p.year) + ' at ' + p.hour + ':' + p.minute + ' ' + (p.dayPeriod || '');
  }

  function initCountdown() {
    var host = $('#countdown');
    if (!host) return;
    var cd = CFG.countdown || {};

    var getEvents = cd.sheetUrl
      ? loadTable(cd.sheetUrl).then(function (res) {
          var h = res.table.headers.map(function (x) { return x.toLowerCase(); });
          var li = h.findIndex(function (x) { return /^(label|event|title|name)$/.test(x); });
          var di = h.findIndex(function (x) { return /^(date|when|datetime|start)$/.test(x); });
          if (li < 0 || di < 0) throw new Error('columns');
          return res.table.rows.map(function (r) { return { label: r[li], date: r[di] }; });
        }).catch(function () { return cd.events || []; })
      : Promise.resolve(cd.events || []);

    getEvents.then(function (events) {
      var list = events.map(function (e) { return { label: e.label, ts: parseWhen(e.date) }; })
                       .filter(function (e) { return e.label && !isNaN(e.ts); })
                       .sort(function (a, b) { return a.ts - b.ts; });

      var title = el('h1', { class: 'cd-title' });
      var when = el('p', { class: 'cd-when' });
      var tiles = {};
      var board = el('div', { class: 'cd-board', role: 'timer' });
      [['d', 'Days'], ['h', 'Hours'], ['m', 'Minutes'], ['s', 'Seconds']].forEach(function (u) {
        var num = el('span', { class: 'cd-num', text: '00' });
        tiles[u[0]] = num;
        board.append(el('div', { class: 'cd-tile' }, num, el('span', { class: 'cd-unit', text: u[1] })));
      });
      var after = el('p', { class: 'cd-after', text: cd.afterMessage || '' });

      host.textContent = '';
      host.append(title, when, board, after);

      var shown = null, timer = null;
      function pad(n) { return String(n).padStart(2, '0'); }

      function tick() {
        var now = Date.now();
        var next = list.find(function (e) { return e.ts > now; });
        if (!next) {
          board.hidden = true; when.hidden = true; after.hidden = false;
          title.textContent = list.length ? list[list.length - 1].label + ' is here' : CFG.fullName;
          if (!list.length) after.textContent = 'Check back soon for the next date.';
          clearInterval(timer);
          return;
        }
        if (next !== shown) {
          shown = next;
          title.textContent = next.label;
          when.textContent = whenText(next.ts);
          board.hidden = false; when.hidden = false; after.hidden = true;
        }
        var diff = Math.floor((next.ts - now) / 1000);
        tiles.d.textContent = pad(Math.floor(diff / 86400));
        tiles.h.textContent = pad(Math.floor(diff % 86400 / 3600));
        tiles.m.textContent = pad(Math.floor(diff % 3600 / 60));
        tiles.s.textContent = pad(diff % 60);
      }
      tick();
      timer = setInterval(tick, 1000);
    });
  }

  /* ---------------- go ---------------- */
  buildHeader();
  buildFooter();
  initCountdown();
  initHomeCards();
  initDivisionPage();

  // exposed for testing only
  window.__hpsa = { parseCSV: parseCSV, parseWhen: parseWhen, slugify: slugify, buildTable: buildTable };
})();
