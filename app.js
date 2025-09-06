/* app.js
   - SPA: dashboard, games, checker, results
   - Simple i18n using SEED.TRANSLATIONS (safe DOM updates)
   - Adjusted rendering to match updated CSS spacing
*/

(() => {
  // ---------- i18n ----------
  const availableLangs = ["en","si","ta"];
  const savedLang = localStorage.getItem("site_lang");
  const browserPref = (navigator.language || navigator.userLanguage || "en").slice(0,2);
  const defaultLang = (savedLang && availableLangs.includes(savedLang)) ? savedLang : (availableLangs.includes(browserPref) ? browserPref : "en");
  let LANG = defaultLang;

  function t(path, lang = LANG) {
    if (!path) return "";
    const parts = path.split(".");
    let obj = (SEED && SEED.TRANSLATIONS && SEED.TRANSLATIONS[lang]) ? SEED.TRANSLATIONS[lang] : SEED.TRANSLATIONS.en;
    for (const p of parts) {
      if (obj && (p in obj)) obj = obj[p];
      else return path;
    }
    return (typeof obj === "string") ? obj : path;
  }

  // translate elements without clobbering innerHTML/game state
  function translatePage() {
    // set html lang for font selection if needed
    document.documentElement.lang = LANG;

    // elements with data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const val = t(key);
      if (val !== undefined) el.textContent = val;
    });

    // placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = t(key);
      if (val !== undefined) el.setAttribute("placeholder", val);
    });

    // translate <title> tag
    const titleEl = document.querySelector("title[data-i18n]");
    if (titleEl) {
      const key = titleEl.getAttribute("data-i18n");
      titleEl.textContent = t(key);
    } else {
      // if no data-i18n attribute on title, but translations exist, set it
      document.title = t("title");
    }

    // translate <option> elements that have data-i18n
    document.querySelectorAll("option[data-i18n]").forEach(opt => {
      const key = opt.getAttribute("data-i18n");
      opt.textContent = t(key);
    });
  }

  function setLang(lang) {
    if (!availableLangs.includes(lang)) lang = "en";
    LANG = lang;
    localStorage.setItem("site_lang", lang);
    translatePage();
    // re-render current view so dynamic content uses updated text
    renderByRoute(state.route);
  }

  // ---------- State ----------
  const state = {
    orgs: SEED.orgs,
    games: SEED.games,
    results: SEED.results,
    upcoming: SEED.upcoming,
    route: "dashboard",
    checker: { gameId: null, drawId: null, picks: [] }
  };

  // helpers
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const formatLKR = n => "LKR " + (n || 0).toLocaleString("en-LK");
  const byId = id => state.games.find(g => g.id === id);
  const getResultsByGame = gid => state.results.filter(r => r.gameId === gid).sort((a,b) => b.drawNo - a.drawNo);

  // ---------- Router ----------
  function setRoute(route) {
    state.route = route;
    qsa(".nav-link").forEach(b => b.classList.toggle("active", b.dataset.route === route));
    qsa(".view").forEach(v => v.classList.remove("active"));
    const view = qs(`#view-${route}`);
    if (view) view.classList.add("active");
    renderByRoute(route);
  }

  function renderByRoute(route) {
    translatePage();
    if (route === "dashboard") renderDashboard();
    if (route === "games") renderGames();
    if (route === "checker") renderChecker();
    if (route === "results") renderResults();
  }

  // ---------- Dashboard ----------
  function renderDashboard() {
    qs("#stat-dlb").textContent = state.games.filter(g => g.org === "DLB").length;
    qs("#stat-nlb").textContent = state.games.filter(g => g.org === "NLB").length;
    qs("#stat-sl4d").textContent = state.games.filter(g => g.org === "SL4D").length;
    qs("#stat-total").textContent = state.games.length;

    const latest = [...state.results].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,8);
    const wrap = qs("#latest-results");
    wrap.innerHTML = "";
    if (latest.length === 0) {
      wrap.innerHTML = `<div class="muted">${t("other.noData")}</div>`;
    } else {
      latest.forEach(r => {
        const orgClass = r.org.toLowerCase();
        const item = document.createElement("div");
        item.className = "result-item";
        item.innerHTML = `
          <div class="result-meta">
            <div><span class="pill">${r.org}</span> <strong>${r.gameName}</strong> <span class="muted">#${r.drawNo}</span></div>
            <div class="muted">${r.date}</div>
          </div>
          <div class="badges">${r.numbers.map(n => `<span class="badge ${orgClass}">${String(n).padStart(2,"0")}</span>`).join("")}</div>
        `;
        wrap.appendChild(item);
      });
    }

    const upWrap = qs("#upcoming-draws");
    upWrap.innerHTML = "";
    const upcoming = [...state.upcoming].slice(0,8);
    if (upcoming.length === 0) {
      upWrap.innerHTML = `<div class="muted">${t("other.noData")}</div>`;
    } else {
      upcoming.forEach(u => {
        const item = document.createElement("div");
        item.className = "upcoming";
        item.innerHTML = `
          <div>
            <div><span class="pill">${u.org}</span> <strong>${u.gameName}</strong></div>
            <div class="muted">${u.date} • ${u.time}</div>
          </div>
          <div class="jackpot">${formatLKR(u.estJackpot)}</div>
        `;
        upWrap.appendChild(item);
      });
    }
  }

  // ---------- Games ----------
  function renderGames() {
    const grid = qs("#games-grid");
    const term = (qs("#games-search").value || "").trim().toLowerCase();
    const org = qs("#games-org").value;
    const list = state.games.filter(g => (!org || g.org === org) && (!term || g.name.toLowerCase().includes(term)));
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = `<div class="muted">${t("other.noData")}</div>`;
      return;
    }

    list.forEach(g => {
      const card = document.createElement("div");
      card.className = "game-card";
      card.innerHTML = `
        <div class="game-head">
          <div>
            <h4 class="game-name">${g.name}</h4>
            <div class="game-meta"><span class="game-org">${g.org}</span> • ${g.schedule}</div>
          </div>
          <span class="game-chip ${g.org}">${g.price ? "Rs. "+g.price : ""}</span>
        </div>
        <div class="game-meta mt-8">${t("games.pickLabel")} <strong>${g.picks}</strong> • ${g.range === 9 ? t("games.rangeDigits") : `1–${g.range}`}</div>
        <div class="game-actions">
          <button class="btn btn-primary" data-open="${g.id}">${t("btn.viewAll")}</button>
          <button class="btn" data-check="${g.id}">${t("cta.checkTicket")}</button>
          <button class="btn btn-outline" data-results="${g.id}">${t("nav.results")}</button>
        </div>
      `;
      grid.appendChild(card);
    });

    qsa("[data-open]").forEach(b => b.onclick = () => openGameModal(b.dataset.open));
    qsa("[data-check]").forEach(b => b.onclick = () => {
      setRoute("checker");
      setTimeout(()=> {
        qs("#checker-game").value = b.dataset.check;
        handleCheckerGameChange();
      }, 30);
    });
    qsa("[data-results]").forEach(b => b.onclick = () => {
      setRoute("results");
      const g = state.games.find(x => x.id === b.dataset.results);
      if (g) {
        qs("#results-org").value = g.org;
        qs("#results-search").value = g.name;
      }
      renderResults();
    });
  }

  function openGameModal(id) {
    const g = byId(id);
    if (!g) return;
    const modal = qs("#game-modal");
    qs("#modal-title").textContent = `${g.name} — ${g.org}`;
    const perWeek = g.drawsPerWeek ? `<li><strong>${t("games.drawsPerWeek")}</strong> ${g.drawsPerWeek}</li>` : "";
    qs("#modal-body").innerHTML = `
      <p class="muted">${g.description || ""}</p>
      <ul>
        <li><strong>${t("games.numberOfPicks")}</strong> ${g.picks}</li>
        <li><strong>${t("games.numberRange")}</strong> ${g.range === 9 ? t("games.rangeDigits") : `1–${g.range}`}</li>
        <li><strong>${t("games.ticketPrice")}</strong> ${g.price ? "Rs. "+g.price : "—"}</li>
        ${perWeek}
        <li><strong>${t("games.schedule")}</strong> ${g.schedule}</li>
      </ul>
      <div class="mt-8">
        <button class="btn btn-primary" id="modal-check">${t("cta.checkTicket")}</button>
        <button class="btn btn-outline" id="modal-view-results">${t("btn.viewAll")}</button>
      </div>
    `;
    modal.showModal();
    qs("#modal-check").onclick = () => { modal.close(); setRoute("checker"); setTimeout(()=>{ qs("#checker-game").value = g.id; handleCheckerGameChange(); }, 30); };
    qs("#modal-view-results").onclick = () => {
      modal.close();
      setRoute("results");
      qs("#results-org").value = g.org;
      qs("#results-search").value = g.name;
      renderResults();
    };
  }

  // ---------- Checker ----------
  function renderChecker() {
    const sel = qs("#checker-game");
    sel.innerHTML = `<option value="">${t("other.allOrgs")}</option>` + state.games.map(g => `<option value="${g.id}">${g.name} (${g.org})</option>`).join("");
    if (state.checker.gameId) sel.value = state.checker.gameId;
    handleCheckerGameChange(true);
  }

  function handleCheckerGameChange(skipReset=false) {
    const gid = qs("#checker-game").value;
    state.checker.gameId = gid || null;
    const info = qs("#checker-game-info");
    const drawSel = qs("#checker-draw");
    const picker = qs("#number-picker");
    const resBox = qs("#check-result");
    resBox.hidden = true;

    if (!gid) {
      info.textContent = t("checker.selectGameInfo");
      drawSel.innerHTML = `<option value="">${t("checker.selectDraw")}</option>`;
      picker.innerHTML = "";
      return;
    }
    const g = byId(gid);
    info.innerHTML = `${t("checker.rules")} <strong>${g.picks}</strong> ${t("checker.picks")} • ${g.range===9 ? t("games.rangeDigits") : `1–${g.range}`}`;
    const draws = getResultsByGame(gid);
    drawSel.innerHTML = `<option value="">${t("checker.selectDraw")}</option>` + draws.map(d => `<option value="${d.id}">#${d.drawNo} — ${d.date}</option>`).join("");
    if (!skipReset) { state.checker.drawId = null; state.checker.picks = []; }
    drawSel.onchange = handleCheckerDrawChange;
    renderNumberPicker();
  }

  function handleCheckerDrawChange() {
    state.checker.drawId = qs("#checker-draw").value || null;
    qs("#check-result").hidden = true;
    renderNumberPicker();
  }

  function renderNumberPicker() {
    const gid = state.checker.gameId;
    const picker = qs("#number-picker");
    picker.innerHTML = "";
    if (!gid) return;
    const g = byId(gid);
    const isDigit = g.range === 9;

    if (isDigit) {
      const picks = state.checker.picks.length ? [...state.checker.picks] : Array(g.picks).fill(null);
      state.checker.picks = picks;
      for (let pos = 0; pos < g.picks; pos++) {
        const groupTitle = document.createElement("div");
        groupTitle.className = "muted";
        groupTitle.style.gridColumn = "1 / -1";
        groupTitle.textContent = `${t("checker.digitLabel")} ${pos+1}`;
        picker.appendChild(groupTitle);

        const group = document.createElement("div");
        group.style.display = "grid";
        group.style.gridTemplateColumns = "repeat(10, 1fr)";
        group.style.gap = "8px";
        for (let d = 0; d <= 9; d++) {
          const btn = document.createElement("button");
          btn.className = "num" + (picks[pos] === d ? " active" : "");
          btn.textContent = d;
          btn.onclick = () => {
            picks[pos] = d;
            state.checker.picks = picks;
            renderNumberPicker();
          };
          group.appendChild(btn);
        }
        picker.appendChild(group);
      }
    } else {
      const pool = Array.from({ length: g.range }, (_, i) => i + 1);
      const selected = new Set(state.checker.picks);
      pool.forEach(n => {
        const b = document.createElement("button");
        b.className = "num" + (selected.has(n) ? " active" : "");
        b.textContent = n.toString().padStart(2, "0");
        b.onclick = () => {
          if (selected.has(n)) selected.delete(n);
          else {
            if (selected.size >= g.picks) {
              const first = state.checker.picks[0];
              selected.delete(first);
              state.checker.picks.shift();
            }
            selected.add(n);
          }
          state.checker.picks = Array.from(selected).sort((a,b)=>a-b);
          renderNumberPicker();
        };
        picker.appendChild(b);
      });
    }

    qs("#btn-check").onclick = checkTicket;
    qs("#btn-clear").onclick = () => { state.checker.picks = []; renderNumberPicker(); qs("#check-result").hidden = true; };
    qs("#checker-draw-info").textContent = state.checker.drawId ? t("checker.ready") : t("checker.pickDraw");
  }

  // ---------- Check & Prize ----------
  function checkTicket() {
    const gid = state.checker.gameId, did = state.checker.drawId;
    const resBox = qs("#check-result");
    if (!gid || !did) { alert(t("checker.alertSelectGameDraw")); return; }
    const g = byId(gid);
    const draw = state.results.find(r => r.id === did);
    let matches = 0, exactOrder = false, anyOrder = false;
    const selected = state.checker.picks;

    if (g.range === 9) {
      if (selected.filter(v => v !== null && v !== undefined).length !== g.picks) { alert(t("checker.alertFillDigits")); return; }
      const win = draw.numbers;
      exactOrder = selected.every((d,i) => d === win[i]);
      anyOrder = selected.slice().sort().join(",") === win.slice().sort().join(",");
      matches = selected.reduce((acc,d,i) => acc + (d === win[i] ? 1 : 0), 0);
    } else {
      if (selected.length !== g.picks) { alert(t("checker.alertSelectNumbers")); return; }
      const winSet = new Set(draw.numbers);
      matches = selected.filter(n => winSet.has(n)).length;
    }

    const tiers = computePrize(g, draw, selected, { matches, exactOrder, anyOrder });
    resBox.hidden = false;

    const numsHtml = draw.numbers.map((n, idx) => {
      let matched = false;
      if (g.range === 9) matched = selected[idx] === n;
      else matched = selected.includes(n);
      return `<span class="badge ${matched ? "win" : (g.org||"").toLowerCase()}">${(g.range===9? n : n.toString().padStart(2,"0"))}</span>`;
    }).join("");

    const yourHtml = (g.range===9 ? selected.map(d => `<span class="badge">${d}</span>`).join("") : selected.map(n => `<span class="badge">${n.toString().padStart(2,"0")}</span>`).join(""));

    resBox.innerHTML = `
      <h4 class="check-title">${t("checker.resultFor")} <strong>${g.name}</strong> — #${draw.drawNo} (${draw.date})</h4>
      <div class="muted">${t("checker.winningNumbers")}</div>
      <div class="badges mt-8">${numsHtml}</div>
      <div class="muted mt-8">${t("checker.yourNumbers")}</div>
      <div class="badges mt-8">${yourHtml}</div>
      <hr style="border:0;border-top:1px solid var(--line);margin:12px 0" />
      <div><span class="pill">${t("other.matches")}</span> <strong>${tiers.matchesText}</strong></div>
      <div class="mt-8"><span class="pill">${t("other.prizeTier")}</span> <span class="prize">${tiers.tier}</span></div>
      <div class="muted mt-8">${t("other.estimatedPrize")}: <strong>${formatLKR(tiers.estimatedPrize)}</strong> <span class="muted">(${t("footer.note")})</span></div>
    `;
  }

  function computePrize(g, draw, sel, info) {
    const basePool = draw.prizePoolLKR || 10_000_000;
    const weights = { jackpot: .65, t1:.15, t2:.12, t3:.08 };
    let tier = t("checker.noPrize");
    let est = 0;
    let matchesText = "";

    if (g.range === 9) {
      matchesText = info.exactOrder ? `${g.picks}/${g.picks} exact` : `${info.matches}/${g.picks} exact`;
      if (g.name.toLowerCase().includes("box")) {
        if (info.anyOrder && info.matches === g.picks) { tier = t("checker.jackpot"); est = basePool*weights.jackpot; }
        else if (info.matches === g.picks-1) { tier = t("checker.secondPrize"); est = basePool*weights.t1; }
        else if (info.matches === g.picks-2) { tier = t("checker.thirdPrize"); est = basePool*weights.t2; }
      } else {
        if (info.exactOrder) { tier = t("checker.jackpot"); est = basePool*weights.jackpot; }
        else if (info.matches === g.picks-1) { tier = t("checker.firstPrize"); est = basePool*weights.t1; }
        else if (info.matches === g.picks-2) { tier = t("checker.secondPrize"); est = basePool*weights.t2; }
        else if (info.matches === g.picks-3) { tier = t("checker.thirdPrize"); est = basePool*weights.t3; }
      }
    } else {
      const m = info.matches;
      matchesText = `${m}/${g.picks}`;
      if (m === g.picks) { tier = t("checker.jackpot"); est = basePool*weights.jackpot; }
      else if (m === g.picks-1) { tier = t("checker.firstPrize"); est = basePool*weights.t1; }
      else if (m === g.picks-2) { tier = t("checker.secondPrize"); est = basePool*weights.t2; }
      else if (m === g.picks-3) { tier = t("checker.thirdPrize"); est = basePool*weights.t3; }
    }
    est = Math.round(est/1000)*1000;
    return { tier, estimatedPrize: est, matchesText };
  }

  // ---------- Results ----------
  function renderResults() {
    const org = qs("#results-org").value;
    const term = (qs("#results-search").value || "").trim().toLowerCase();
    const df = qs("#date-from").value ? new Date(qs("#date-from").value) : null;
    const dt = qs("#date-to").value ? new Date(qs("#date-to").value) : null;

    let list = [...state.results];
    if (org) list = list.filter(r => r.org === org);
    if (term) list = list.filter(r => (r.gameName.toLowerCase().includes(term) || String(r.drawNo).includes(term)));
    if (df) list = list.filter(r => new Date(r.date) >= df);
    if (dt) list = list.filter(r => new Date(r.date) <= dt);

    list.sort((a,b) => new Date(b.date)-new Date(a.date) || b.drawNo - a.drawNo);

    const table = qs("#results-table");
    table.innerHTML = "";
    if (list.length === 0) {
      table.innerHTML = `<div class="muted">${t("other.noData")}</div>`;
      return;
    }

    const head = row([t("results.from"), t("nav.games"), t("nav.results"), t("checker.winningNumbers")], true);
    table.appendChild(head);
    list.slice(0,200).forEach(r => {
      const nums = r.numbers.map(n => `<span class="badge ${r.org.toLowerCase()}">${(r.range===9? n : n.toString().padStart(2,"0"))}</span>`).join("");
      const el = row([
        r.date,
        `<span class="pill">${r.org}</span> <strong>${r.gameName}</strong>`,
        `#${r.drawNo} <div class="muted">${formatLKR(r.prizePoolLKR)} pool</div>`,
        `<div class="badges">${nums}</div>`
      ]);
      table.appendChild(el);
    });

    function row(cells, header=false){
      const r = document.createElement("div");
      r.className = "table-row" + (header ? " header" : "");
      for (const c of cells){
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.innerHTML = c;
        r.appendChild(cell);
      }
      return r;
    }
  }

  // ---------- Bind global & boot ----------
  function bindGlobal() {
    qsa(".nav-link").forEach(b => b.onclick = () => setRoute(b.dataset.route));
    qsa("[data-route]").forEach(b => (b.tagName === "BUTTON") && (b.onclick = () => setRoute(b.dataset.route)));
    qs("#games-search").oninput = debounce(renderGames, 120);
    qs("#games-org").onchange = renderGames;
    qs("#results-org").onchange = renderResults;
    qs("#results-search").oninput = debounce(renderResults, 120);
    qs("#date-from").onchange = renderResults;
    qs("#date-to").onchange = renderResults;
    qs("#modal-close").onclick = () => qs("#game-modal").close();
    qs("#year").textContent = new Date().getFullYear();

    const langSel = qs("#lang-select");
    if (langSel) { langSel.value = LANG; langSel.onchange = (e) => setLang(e.target.value); }
  }

  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(()=>fn(...a), ms); }; }

  // initial fill for some localized UI tokens if any were empty
  function ensureKeys() {
    // keys already added in data.js; nothing needed here. Keep for extension.
  }

  // boot
  ensureKeys();
  bindGlobal();
  setLang(LANG);
  setRoute("dashboard");
})();
