/* =========================================================================
   Weather Seal data scraper — matrix-table version
   =========================================================================
   USAGE
     1. Open the configurator page in your browser.
     2. Open DevTools (F12) → Console.
     3. Paste this entire file.
     4. Edit the CONFIG block (selectors + sweep values).
     5. Drive the page to a given (color, trackMount) combo, then call
        wsBatchAdd("white-3A")  — repeat for every combo.
     6. wsBatchDownload("weather_seal.csv")  → single CSV across all batches.
     7. Or run scrapeWeatherSealData() to sweep all combos automatically
        (requires CONFIG.set.* stubs implemented).

   PAGE SHAPE
     A matrix table where:
       columns = door models  (T150, T175, T200, T300, T200-20, T200C, T150U, T175U, T200U, U200C)
       rows    = weather seal types (e.g. EU ADCA Jamb Weather Strip, ADCA Mount Jamb Weather Seal, ...)
       cells   = checkboxes — checked means that seal is allowed for that
                 model under the current (color, trackMount) driver state.

   OUTPUT (CSV)
     batch, color, trackMount, model, sealCount, seals
   ========================================================================= */

(function () {
  // ---- EDIT THIS BLOCK TO MATCH THE PAGE -----------------------------------
  const CONFIG = {
    // Combos to drive when using scrapeWeatherSealData().
    // Color values map to the `driver2_val_num` <select>. W and B are skipped — empty/unused.
    colors:      ["1", "2", "4", "Z", "C", "V", "K", "T", "A", "F"],
    colorLabels: {
      "1": "White", "2": "Brown", "4": "Silver", "Z": "Bronze",
      "C": "Slate Grey", "V": "Iron Ore", "K": "Black",
      "T": "SandStone", "A": "Almond", "F": "Cafe",
    },
    // Source-page short codes (driver3_val_num). Mapped back to our app's codes for output.
    trackMounts: ["3A", "2A", "3C", "2C", "B", "None"],
    trackMountToApp: {
      "3A": "ADCA_3", "2A": "ADCA_2",
      "3C": "CLIP_3", "2C": "CLIP_2",
      "B":  "B",      "None": "NONE",
    },

    // Settle time after each set() before reading (ms).
    settleMs: 200,

    // --- Selectors for the matrix table -------------------------------------
    wsTableSelector: "#TableContainer",
    headerCellSelector: "thead tr th:not(:first-child)",
    bodyRowSelector: "tbody tr",
    sealNameCellSelector: "th, td:first-child",
    checkboxSelector: "input[type='checkbox']",

    // Header letter → model code. K is intentionally absent — those columns are skipped.
    // U-series headers come through as themselves (T150U, T175U, T200U, U200C) and are passed through.
    headerToModel: {
      "C": "T150",
      "D": "T175",
      "J": "T200",
      "T": "T300",
      "G": "T200-20",
      "I": "T200C",
    },

    // --- How to SET each driver on the page. Replace stubs with real code. -
    set: {
      color: async (v) => {
        setVal("select[name='driver2_val_num']", v);
      },
      trackMount: async (v) => {
        setVal("select[name='driver3_val_num']", v);
      },
    },
  };
  // --------------------------------------------------------------------------

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function setVal(selector, value) {
    const el = document.querySelector(selector);
    if (!el) { console.warn("setVal: missing", selector); return; }
    el.value = value;
    el.dispatchEvent(new Event("input",  { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }
  window.setVal = setVal;

  // Reads the matrix table and returns:
  //   { error?, models: [name,...], seals: [{ name, allowedModels: [name,...] }, ...] }
  // Returns { rawHeaders, keepIdx, models, seals }
  //   rawHeaders : full list of column headers as they appear in the DOM
  //   keepIdx    : indices of columns we keep (K-letter and unknown letters dropped)
  //   models     : resolved model codes for the kept columns, in column order
  //   seals      : [{ name, allowedModels: [model,...] }, ...]  — only kept columns
  function readMatrix() {
    const table = document.querySelector(CONFIG.wsTableSelector);
    if (!table) return { error: "MISSING_TABLE", rawHeaders: [], keepIdx: [], models: [], seals: [] };

    const rawHeaders = [...table.querySelectorAll(CONFIG.headerCellSelector)]
      .map(c => c.innerText.trim());

    const KNOWN_USERIES = /^(T150U|T175U|T200U|U200C)$/;
    const keepIdx = [];
    const models = [];
    const seen = new Set();
    rawHeaders.forEach((h, i) => {
      const mapped = CONFIG.headerToModel[h] || (KNOWN_USERIES.test(h) ? h : null);
      if (!mapped) return;            // silently drop driver labels, K, CM/DM/etc, T300U, anything unknown
      if (seen.has(mapped)) return;   // dedupe — header row is rendered twice
      seen.add(mapped);
      keepIdx.push(i);
      models.push(mapped);
    });

    const seals = [];
    const bodyRows = [...table.querySelectorAll(CONFIG.bodyRowSelector)];
    for (const row of bodyRows) {
      const nameCell = row.querySelector(CONFIG.sealNameCellSelector);
      const sealName = nameCell ? nameCell.innerText.trim() : "(unknown)";
      const cbs = [...row.querySelectorAll(CONFIG.checkboxSelector)];
      const allowedModels = [];
      keepIdx.forEach((srcIdx, dstIdx) => {
        if (cbs[srcIdx]?.checked) allowedModels.push(models[dstIdx]);
      });
      seals.push({ name: sealName, allowedModels });
    }
    return { rawHeaders, keepIdx, models, seals };
  }

  // ---- Multi-batch accumulator (persisted to localStorage) -----------------
  // Workflow:
  //   1. Set (color=White, trackMount=3 IN ADCA) on page → wsBatchAdd("W-ADCA_3")
  //   2. Change driver inputs (page may reload) → re-paste this script
  //   3. wsBatchAdd("W-ADCA_2") ... repeat for every combo ...
  //   N. wsBatchDownload("weather_seal.csv")  → single CSV of all batches
  //
  // Data stored in localStorage["__wsBatches"] so page reloads don't wipe progress.
  const LS_KEY = "__wsBatches";

  function loadBatches() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[ws-scrape] localStorage read failed:", e);
      return [];
    }
  }

  function saveBatches(rows) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(rows));
    } catch (e) {
      console.warn("[ws-scrape] localStorage write failed:", e);
    }
  }

  window.__wsBatches = loadBatches();
  if (window.__wsBatches.length) {
    const labels = [...new Set(window.__wsBatches.map(r => r.batch))];
    console.log(`[ws-scrape] restored ${window.__wsBatches.length} rows from localStorage across ${labels.length} batches: ${labels.join(", ")}`);
  }

  // Add the current matrix read as a batch. Label convention: "<color>-<trackMount>".
  // If opts.color/trackMount are omitted, auto-read from the driver selects on the page.
  function wsBatchAdd(label, opts = {}) {
    const { error, models, seals } = readMatrix();
    if (error) { console.warn("[ws-scrape] read error:", error); return; }
    const rows = loadBatches();
    const batchLabel = label || `batch${new Set(rows.map(r => r.batch)).size + 1}`;
    const color      = opts.color      ?? document.querySelector("select[name='driver2_val_num']")?.value ?? "";
    const trackMount = opts.trackMount ?? document.querySelector("select[name='driver3_val_num']")?.value ?? "";
    if (!color || !trackMount) {
      console.warn(`[ws-scrape] could not auto-read drivers (color="${color}", trackMount="${trackMount}"). Pass {color, trackMount} explicitly.`);
    }

    // Pivot: one row per (model, seal) cell, OR one row per (batch, model) listing all seals.
    // We use the latter — one row per model with the allowed seal list.
    const modelToSeals = {};
    for (const m of models) modelToSeals[m] = [];
    for (const s of seals) {
      for (const m of s.allowedModels) {
        if (modelToSeals[m]) modelToSeals[m].push(s.name);
      }
    }
    for (const m of models) {
      rows.push({
        batch: batchLabel,
        color,
        trackMount,
        model: m,
        seals: modelToSeals[m],
      });
    }
    saveBatches(rows);
    window.__wsBatches = rows;
    console.log(`[ws-scrape] +${models.length} rows for "${batchLabel}" — total ${rows.length} (persisted)`);
    return models.length;
  }

  function wsBatchReset() {
    const n = (loadBatches()).length;
    localStorage.removeItem(LS_KEY);
    window.__wsBatches = [];
    console.log(`[ws-scrape] cleared ${n} rows from localStorage`);
  }

  function wsBatchDownload(filename = "weather_seal.csv") {
    const rows = loadBatches();
    if (!rows.length) { console.warn("[ws-scrape] nothing to download — call wsBatchAdd() first"); return; }
    const esc = v => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["batch","color","trackMount","model","sealCount","seals"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        esc(r.batch),
        esc(r.color),
        esc(r.trackMount),
        esc(r.model),
        esc(r.seals.length),
        esc(r.seals.join(" | ")),
      ].join(","));
    }
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`[ws-scrape] downloaded ${filename} — ${rows.length} rows across ${new Set(rows.map(r=>r.batch)).size} batches`);
    return csv;
  }

  window.wsBatchAdd      = wsBatchAdd;
  window.wsBatchReset    = wsBatchReset;
  window.wsBatchDownload = wsBatchDownload;

  // Optional: full automated sweep (requires CONFIG.set.* implemented).
  async function scrapeWeatherSealData() {
    const total = CONFIG.colors.length * CONFIG.trackMounts.length;
    let done = 0;
    wsBatchReset();
    console.log(`%c[ws-scrape] starting — ${total} combos`, "color:#06f;font-weight:bold");
    for (const color of CONFIG.colors) {
      await CONFIG.set.color(color); await sleep(CONFIG.settleMs);
      for (const trackMount of CONFIG.trackMounts) {
        await CONFIG.set.trackMount(trackMount); await sleep(CONFIG.settleMs);
        const trkApp = CONFIG.trackMountToApp[trackMount] || trackMount;
        wsBatchAdd(`${color}-${trkApp}`, { color, trackMount: trkApp });
        done++;
        console.log(`[ws-scrape] ${done}/${total}  color=${color} trk=${trackMount}→${trkApp}`);
      }
    }
    console.log(`%c[ws-scrape] done — ${(loadBatches()).length} rows. Call wsBatchDownload() to export.`,
                "color:#2a8;font-weight:bold");
  }

  window.scrapeWeatherSealData = scrapeWeatherSealData;
  window.readWeatherSealMatrix = readMatrix;
  console.log("[ws-scrape] loaded. Drive the page to each (color, trackMount) combo, then call wsBatchAdd(label, {color, trackMount}). Export with wsBatchDownload().");
})();
