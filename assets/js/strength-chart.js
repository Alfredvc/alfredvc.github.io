// Interactive "performance rating vs opponent" chart for the chess post.
// Dependency-free: builds an inline SVG from a raw-data object so it stays
// crisp, theme-aware, and can't drift from the eval numbers it is handed.
// Exposes window.StrengthChart.render(opts).
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs, kids) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (kids) kids.forEach((c) => e.appendChild(c));
    return e;
  }
  function txt(s) { return document.createTextNode(s); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Ordered spectral palette, cool (low conditioned rating) -> warm (high):
  // 8 distinct hues, all dark enough to read on a white background.
  const PALETTE = ['#7c3aed', '#2563eb', '#0891b2', '#059669', '#65a30d', '#ca8a04', '#ea580c', '#dc2626'];
  function colorAt(k, total) {
    if (total === PALETTE.length) return PALETTE[k];
    return PALETTE[Math.round((k / (total - 1)) * (PALETTE.length - 1))];
  }

  function render(opts) {
    const mount = typeof opts.mount === 'string'
      ? document.getElementById(opts.mount) : opts.mount;
    if (!mount) return;

    const opp = opts.opponents;          // [{label, rating}]
    const conds = opts.conds.slice();    // [1000 .. 2400]
    const data = opts.data;              // { rapid: {cond:[..5]}, blitz: {..} }
    let tc = opts.initial || 'rapid';

    // ---- geometry (viewBox user units) ----
    const W = 780, H = 470;
    const mL = 60, mR = 138, mT = 20, mB = 74;
    const x0 = mL, x1 = W - mR, y0 = mT, y1 = H - mB;
    const xPad = 46;                      // breathing room before/after the line ends
    const xL = x0 + xPad, xR = x1 - xPad;
    const yMin = 1500, yMax = 2820;
    const n = opp.length;
    const xi = (i) => xL + (i * (xR - xL)) / (n - 1);
    const yv = (v) => y1 - ((v - yMin) / (yMax - yMin)) * (y1 - y0);

    mount.classList.add('sc-wrap');
    mount.textContent = '';

    // ---- toolbar (HTML): rapid/blitz toggle + readout ----
    const bar = document.createElement('div');
    bar.className = 'sc-toolbar';
    const seg = document.createElement('div');
    seg.className = 'sc-seg';
    const btnRapid = document.createElement('button');
    const btnBlitz = document.createElement('button');
    btnRapid.type = btnBlitz.type = 'button';
    btnRapid.textContent = 'Rapid';
    btnBlitz.textContent = 'Blitz';
    seg.appendChild(btnRapid); seg.appendChild(btnBlitz);
    const readout = document.createElement('span');
    readout.className = 'sc-readout';
    bar.appendChild(seg); bar.appendChild(readout);
    mount.appendChild(bar);

    // ---- svg scaffold ----
    const svg = el('svg', {
      class: 'sc-svg', viewBox: '0 0 ' + W + ' ' + H,
      role: 'img', 'aria-label': 'Performance rating of the model against each Stockfish level, one line per conditioned rating.'
    });
    mount.appendChild(svg);

    // y gridlines + labels
    const gGrid = el('g', { class: 'sc-grid' });
    svg.appendChild(gGrid);
    for (let v = 1600; v <= 2800; v += 200) {
      const y = yv(v);
      gGrid.appendChild(el('line', { x1: x0, y1: y, x2: x1, y2: y, class: 'sc-gridline' }));
      const t = el('text', { x: x0 - 10, y: y + 4, class: 'sc-ylab', 'text-anchor': 'end' });
      t.appendChild(txt(String(v)));
      gGrid.appendChild(t);
    }

    // axes baseline
    svg.appendChild(el('line', { x1: x0, y1: y1, x2: x1, y2: y1, class: 'sc-axis' }));

    // x labels (opponents)
    const gX = el('g');
    svg.appendChild(gX);
    opp.forEach((o, i) => {
      const t = el('text', { x: xi(i), y: y1 + 24, class: 'sc-xlab', 'text-anchor': 'middle' });
      t.appendChild(txt(o.label));
      gX.appendChild(t);
    });

    // axis titles
    const xt = el('text', { x: (x0 + x1) / 2, y: H - 30, class: 'sc-axistitle', 'text-anchor': 'middle' });
    xt.appendChild(txt('Opponent (Stockfish level, by rating)'));
    svg.appendChild(xt);
    const yt = el('text', {
      x: 16, y: (y0 + y1) / 2, class: 'sc-axistitle', 'text-anchor': 'middle',
      transform: 'rotate(-90 16 ' + ((y0 + y1) / 2) + ')'
    });
    yt.appendChild(txt('Performance rating (Glicko)'));
    svg.appendChild(yt);

    // legend: one keyed swatch per conditioned rating, highest at the top
    const lx = x1 + 22, sw = 18;
    const ltitle = el('text', { x: lx, y: y0 - 6, class: 'sc-legtitle', 'text-anchor': 'start' });
    ltitle.appendChild(txt('conditioned rating'));
    svg.appendChild(ltitle);
    const rowH = (y1 - y0) / conds.length;
    conds.forEach((_, k) => {
      const idx = conds.length - 1 - k;           // 2400 first
      const yy = y0 + rowH * k + rowH / 2;
      svg.appendChild(el('line', { x1: lx, y1: yy, x2: lx + sw, y2: yy, stroke: colorAt(idx, conds.length), 'stroke-width': 3.2, 'stroke-linecap': 'round' }));
      const t = el('text', { x: lx + sw + 8, y: yy + 4, class: 'sc-ylab', 'text-anchor': 'start' });
      t.appendChild(txt(String(conds[idx])));
      svg.appendChild(t);
    });

    // ---- interactive layer: flat guide, then lines, then markers/tooltip ----
    const guide = el('g', { class: 'sc-guide', visibility: 'hidden' });
    const guideLine = el('line', { x1: xL, x2: xR, class: 'sc-guideline' });
    const guideLab = el('text', { class: 'sc-guidelab', 'text-anchor': 'start' });
    guide.appendChild(guideLine); guide.appendChild(guideLab);
    svg.appendChild(guide);

    const gLines = el('g');
    svg.appendChild(gLines);
    const lines = conds.map((c, k) => {
      const pl = el('polyline', {
        class: 'sc-line', fill: 'none', stroke: colorAt(k, conds.length),
        'stroke-width': 2.1, 'stroke-linejoin': 'round', 'stroke-linecap': 'round'
      });
      pl.dataset.cond = c;
      gLines.appendChild(pl);
      return pl;
    });

    const marker = el('circle', { class: 'sc-marker', r: 4.5, visibility: 'hidden' });
    svg.appendChild(marker);
    const tip = el('g', { class: 'sc-tip', visibility: 'hidden' });
    const tipRect = el('rect', { class: 'sc-tiprect', rx: 4, x: 0, y: 0, width: 0, height: 22 });
    const tipText = el('text', { class: 'sc-tiptext', x: 0, y: 15, 'text-anchor': 'middle' });
    tip.appendChild(tipRect); tip.appendChild(tipText);
    svg.appendChild(tip);

    // overlay for pointer tracking
    const overlay = el('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: 'transparent', style: 'cursor:crosshair' });
    svg.appendChild(overlay);

    function drawLines() {
      conds.forEach((c, k) => {
        const row = data[tc][c];
        lines[k].setAttribute('points', row.map((v, i) => xi(i) + ',' + yv(v)).join(' '));
      });
    }

    function setActive(k, col) {
      conds.forEach((c, j) => {
        lines[j].setAttribute('stroke-width', j === k ? 3.4 : 2.1);
        lines[j].setAttribute('opacity', j === k ? 1 : 0.16);
      });
      const c = conds[k];
      const val = data[tc][c][col];
      // marker
      marker.setAttribute('cx', xi(col));
      marker.setAttribute('cy', yv(val));
      marker.setAttribute('fill', colorAt(k, conds.length));
      marker.setAttribute('visibility', 'visible');
      // tooltip
      const label = 'conditioned ' + c + '  ·  ' + opp[col].label + '  ·  ' + val;
      tipText.textContent = label;
      tip.setAttribute('visibility', 'visible');
      const w = tipText.getComputedTextLength() + 18;
      let tx = xi(col), ty = yv(val) - 14;
      tx = Math.max(x0 + w / 2, Math.min(x1 - w / 2, tx));
      if (ty < y0 + 22) ty = yv(val) + 30;
      tipRect.setAttribute('x', tx - w / 2);
      tipRect.setAttribute('y', ty - 26);
      tipRect.setAttribute('width', w);
      tipText.setAttribute('x', tx);
      tipText.setAttribute('y', ty - 11);
      // flat guide at this line's weakest-opponent value
      const gy = yv(data[tc][c][0]);
      guideLine.setAttribute('y1', gy); guideLine.setAttribute('y2', gy);
      guideLab.setAttribute('x', xL + 4); guideLab.setAttribute('y', gy - 6);
      guideLab.textContent = 'a single-Elo player would stay flat';
      guide.setAttribute('visibility', 'visible');
      // readout
      readout.textContent = 'conditioned ' + c + ' → ' + data[tc][c][0] + ' vs the weakest, ' + data[tc][c][n - 1] + ' vs the strongest';
    }

    function clearActive() {
      conds.forEach((c, j) => { lines[j].setAttribute('stroke-width', 2.1); lines[j].setAttribute('opacity', 1); });
      marker.setAttribute('visibility', 'hidden');
      tip.setAttribute('visibility', 'hidden');
      guide.setAttribute('visibility', 'hidden');
      readout.textContent = '';
    }

    // pointer -> nearest line
    const pt = svg.createSVGPoint();
    function toUser(evt) {
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
    function onMove(evt) {
      const p = toUser(evt);
      const tt = Math.max(0, Math.min(n - 1, ((p.x - xL) / (xR - xL)) * (n - 1)));
      const i0 = Math.max(0, Math.min(n - 2, Math.floor(tt)));
      const frac = tt - i0;
      const col = Math.round(tt);
      let best = -1, bestD = 1e9;
      conds.forEach((c, k) => {
        const row = data[tc][c];
        const y = lerp(yv(row[i0]), yv(row[i0 + 1]), frac);
        const d = Math.abs(p.y - y);
        if (d < bestD) { bestD = d; best = k; }
      });
      if (best >= 0 && bestD <= 18) setActive(best, col); else clearActive();
    }
    overlay.addEventListener('mousemove', onMove);
    overlay.addEventListener('mouseleave', clearActive);

    // ---- toggle ----
    function setTC(next) {
      tc = next;
      btnRapid.classList.toggle('is-on', tc === 'rapid');
      btnBlitz.classList.toggle('is-on', tc === 'blitz');
      btnRapid.setAttribute('aria-pressed', tc === 'rapid');
      btnBlitz.setAttribute('aria-pressed', tc === 'blitz');
      drawLines();
      clearActive();
    }
    btnRapid.addEventListener('click', () => setTC('rapid'));
    btnBlitz.addEventListener('click', () => setTC('blitz'));

    setTC(tc);
  }

  window.StrengthChart = { render: render };
})();
