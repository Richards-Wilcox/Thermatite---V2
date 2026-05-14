/* =========================================================================
   Truss data scraper — matrix-table version
   =========================================================================
   USAGE
     1. Open the configurator page in your browser.
     2. Open DevTools (F12) → Console.
     3. Paste this entire file.
     4. Edit the CONFIG block (selectors + sweep values).
     5. Run:  scrapeTrussData()
     6. Output prints as TSV to the console. Copy → paste into Excel.

   PAGE SHAPE
     The page shows a matrix table per (model, wind, sections):
       columns = width buckets, labeled e.g. "GT12-4LTE12-5"
                 (Greater Than 12'4" and Less Than or Equal 12'5")
       rows    = truss style names
       cells   = checkboxes — checked means that style is allowed
                 for that width bucket.
     The first column may be a label like "LTE10-7" (no lower bound — covers
     everything up to that width).
   ========================================================================= */

(function () {
  // ---- EDIT THIS BLOCK TO MATCH THE PAGE -----------------------------------
  const CONFIG = {
    // Combos to drive. The script picks each (model, wind, sections), then
    // reads the entire matrix once per combo.
    models:   ["T300"],
    winds:    ["basic", "15psf", "20psf"],
    sections: [4, 8],   // 4 = lte5 bucket, 8 = gt5 bucket

    // Settle time after each set() before reading (ms).
    settleMs: 200,

    // --- Selectors for the matrix table -------------------------------------
    // The <table> element.
    trussTableSelector: "#TableContainer",            // ← replace
    // The <th>/<td> cells in the header row that hold width-bucket labels
    // like "GT12-4LTE12-5". Default skips the first cell (assumed to be a
    // top-left blank/label). Adjust if the page differs.
    headerCellSelector: "thead tr th:not(:first-child)",
    // Each body row corresponds to one truss style.
    bodyRowSelector: "tbody tr",
    // Within a body row, the cell that holds the style name (first column).
    styleNameCellSelector: "th, td:first-child",
    // Within a body row, the checkbox cells that align with header columns.
    // Default selects every checkbox in the row.
    checkboxSelector: "input[type='checkbox']",

    // --- How to SET each driver on the page. Replace stubs with real code. -
    set: {
      model: async (v) => {
        // EXAMPLE: radio
        // document.querySelector(`input[name='DOOR_MODEL'][value='${v}']`).click();
        throw new Error("CONFIG.set.model not implemented");
      },
      wind: async (v) => {
        // document.querySelector(`input[name='WindLoad'][value='${v}']`).click();
        throw new Error("CONFIG.set.wind not implemented");
      },
      sections: async (v) => {
        // setVal("#NUM_OF_SEC", v);
        throw new Error("CONFIG.set.sections not implemented");
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

  // Convert a header label into { model, loIn, hiIn, raw }.
  // Supports optional "<MODEL>-" prefix, e.g.:
  //   "175U-GT15-6-LTE16-6"   → model=175U, lo=186, hi=198
  //   "GT12-4LTE12-5"         → model="",    lo=148, hi=149
  //   "LTE10-7"               → model="",    lo=0,   hi=127
  //   "GT40-2"                → model="",    lo=482, hi=Infinity
  function parseHeader(label) {
    const t = label.replace(/\s+/g, "");

    // Split optional "<MODEL>-" prefix. Model = leading chunk before the first
    // "GT" or "LTE" token. If the chunk ends with "-", strip it.
    let model = "";
    let rest = t;
    const pfx = t.match(/^([^-]*?[A-Za-z]+[^-]*?)-(?=GT|LTE)/);
    if (pfx) {
      model = pfx[1];
      rest  = t.slice(pfx[0].length);
    }

    let m;
    if ((m = rest.match(/^GT(\d+)-(\d+)-?LTE(\d+)-(\d+)$/))) {
      return {
        model,
        loIn: parseInt(m[1]) * 12 + parseInt(m[2]),
        hiIn: parseInt(m[3]) * 12 + parseInt(m[4]),
        raw:  label,
      };
    }
    if ((m = rest.match(/^LTE(\d+)-(\d+)$/))) {
      return { model, loIn: 0, hiIn: parseInt(m[1]) * 12 + parseInt(m[2]), raw: label };
    }
    if ((m = rest.match(/^GT(\d+)-(\d+)$/))) {
      return { model, loIn: parseInt(m[1]) * 12 + parseInt(m[2]), hiIn: Infinity, raw: label };
    }
    return { model, loIn: null, hiIn: null, raw: label };
  }

  // Reads the matrix table and returns:
  //   [ { model, loIn, hiIn, rawHeader, allowedStyles: [name, name, ...] }, ... ]
  // One entry per width-bucket column.
  //
  // If window.__excludeFromHeader is set (e.g. "175U-GT15-6-LTE16-6"),
  // columns from that header onward are dropped.
  function readMatrix() {
    const table = document.querySelector(CONFIG.trussTableSelector);
    if (!table) return { error: "MISSING_TABLE", buckets: [] };

    const headerCells = [...table.querySelectorAll(CONFIG.headerCellSelector)];
    let headers = headerCells.map(c => parseHeader(c.innerText.trim()));

    // Exclusion: either an exact raw header match, or a model-prefix match.
    // window.__excludeFromHeader      = "175U-GT15-6-LTE16-6"  → exact match
    // window.__excludeFromModelPrefix = "175U"                 → first column whose model === this
    // If both are set, whichever matches earlier wins.
    const excl   = window.__excludeFromHeader;
    const exclMP = window.__excludeFromModelPrefix;
    let keepCount = headers.length;
    let cutoffIdx = -1;
    let cutoffReason = "";

    if (excl) {
      const idx = headers.findIndex(h => h.raw === excl);
      if (idx >= 0) { cutoffIdx = idx; cutoffReason = `header "${excl}"`; }
      else { console.warn(`[scrape] exclude header "${excl}" not found`); }
    }
    if (exclMP) {
      const idx = headers.findIndex(h => h.model === exclMP);
      if (idx >= 0 && (cutoffIdx < 0 || idx < cutoffIdx)) {
        cutoffIdx = idx; cutoffReason = `model prefix "${exclMP}"`;
      } else if (idx < 0) {
        console.warn(`[scrape] exclude model prefix "${exclMP}" not found`);
      }
    }

    if (cutoffIdx >= 0) {
      keepCount = cutoffIdx;
      headers = headers.slice(0, cutoffIdx);
      console.log(`[scrape] excluding from ${cutoffReason} onward — keeping ${keepCount} columns`);
    }

    const buckets = headers.map(h => ({ ...h, allowedStyles: [] }));

    const bodyRows = [...table.querySelectorAll(CONFIG.bodyRowSelector)];
    for (const row of bodyRows) {
      const nameCell = row.querySelector(CONFIG.styleNameCellSelector);
      const styleName = nameCell ? nameCell.innerText.trim() : "(unknown)";
      const cbs = [...row.querySelectorAll(CONFIG.checkboxSelector)];
      cbs.forEach((cb, i) => {
        if (i < keepCount && cb.checked) {
          buckets[i].allowedStyles.push(styleName);
        }
      });
    }
    return { buckets };
  }

  // Build a CSV string from a buckets array.
  function bucketsToCSV(buckets) {
    const esc = v => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["model","widthLoIn","widthHiIn","styleCount","styles"];
    const lines = [header.join(",")];
    for (const b of buckets) {
      lines.push([
        esc(b.model),
        esc(b.loIn),
        esc(b.hiIn === Infinity ? "" : b.hiIn),
        esc(b.allowedStyles.length),
        esc(b.allowedStyles.join(" | ")),
      ].join(","));
    }
    return lines.join("\n");
  }

  // Trigger a CSV download of the current matrix read.
  // Usage in console:
  //   window.__excludeFromHeader = "175U-GT15-6-LTE16-6";
  //   downloadTrussCSV("T300-basic-lte5.csv");
  function downloadTrussCSV(filename = "truss_scrape.csv") {
    const { error, buckets } = readMatrix();
    if (error) { console.warn("[scrape] read error:", error); return; }
    const csv = bucketsToCSV(buckets);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`[scrape] downloaded ${filename} — ${buckets.length} rows`);
    return csv;
  }
  window.downloadTrussCSV = downloadTrussCSV;

  // ---- Multi-batch accumulator (persisted to localStorage) -----------------
  // Workflow:
  //   1. Set width range #1 on the page  → trussBatchAdd("range1")
  //   2. Change width range (page may reload) → re-paste this script
  //   3. trussBatchAdd("range2")
  //   ... repeat for all 9 ranges ...
  //   N. trussBatchDownload("T300-basic-lte5.csv")  → single CSV of all batches
  //
  // Data is stored in localStorage["__trussBatches"] so page reloads don't
  // wipe progress. Use trussBatchReset() to clear when starting fresh.
  const LS_KEY = "__trussBatches";

  function loadBatches() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[scrape] localStorage read failed:", e);
      return [];
    }
  }

  function saveBatches(rows) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(rows));
    } catch (e) {
      console.warn("[scrape] localStorage write failed:", e);
    }
  }

  // Refresh window.__trussBatches from storage every time the script loads.
  window.__trussBatches = loadBatches();
  if (window.__trussBatches.length) {
    const labels = [...new Set(window.__trussBatches.map(r => r.batch))];
    console.log(`[scrape] restored ${window.__trussBatches.length} rows from localStorage across ${labels.length} batches: ${labels.join(", ")}`);
  }

  function trussBatchAdd(label = "") {
    const { error, buckets } = readMatrix();
    if (error) { console.warn("[scrape] read error:", error); return; }
    const rows = loadBatches();
    const batchLabel = label || `batch${new Set(rows.map(r => r.batch)).size + 1}`;
    for (const b of buckets) {
      rows.push({
        batch: batchLabel,
        model: b.model,
        loIn:  b.loIn,
        hiIn:  b.hiIn === Infinity ? null : b.hiIn,  // JSON-safe
        raw:   b.raw,
        allowedStyles: b.allowedStyles,
      });
    }
    saveBatches(rows);
    window.__trussBatches = rows;
    console.log(`[scrape] +${buckets.length} rows for "${batchLabel}" — total ${rows.length} (persisted)`);
    return buckets.length;
  }

  function trussBatchReset() {
    const n = (loadBatches()).length;
    localStorage.removeItem(LS_KEY);
    window.__trussBatches = [];
    console.log(`[scrape] cleared ${n} rows from localStorage`);
  }

  function trussBatchDownload(filename = "truss_scrape.csv") {
    const rows = loadBatches();
    if (!rows.length) { console.warn("[scrape] nothing to download — call trussBatchAdd() first"); return; }
    const esc = v => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["batch","model","widthLoIn","widthHiIn","styleCount","styles"];
    const lines = [header.join(",")];
    for (const r of rows) {
      lines.push([
        esc(r.batch),
        esc(r.model),
        esc(r.loIn),
        esc(r.hiIn == null ? "" : r.hiIn),
        esc(r.allowedStyles.length),
        esc(r.allowedStyles.join(" | ")),
      ].join(","));
    }
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    console.log(`[scrape] downloaded ${filename} — ${rows.length} rows across ${new Set(rows.map(r=>r.batch)).size} batches`);
    return csv;
  }

  window.trussBatchAdd      = trussBatchAdd;
  window.trussBatchReset    = trussBatchReset;
  window.trussBatchDownload = trussBatchDownload;

  async function scrapeTrussData() {
    const rows = [];
    const total = CONFIG.models.length * CONFIG.winds.length * CONFIG.sections.length;
    let done = 0;

    console.log(`%c[scrape] starting — ${total} combos`, "color:#06f;font-weight:bold");

    for (const model of CONFIG.models) {
      await CONFIG.set.model(model);    await sleep(CONFIG.settleMs);
      for (const wind of CONFIG.winds) {
        await CONFIG.set.wind(wind);    await sleep(CONFIG.settleMs);
        for (const sec of CONFIG.sections) {
          await CONFIG.set.sections(sec); await sleep(CONFIG.settleMs);

          const { error, buckets } = readMatrix();
          if (error) {
            console.warn(`[scrape] read error @ ${model}/${wind}/sec=${sec}: ${error}`);
            done++; continue;
          }
          for (const b of buckets) {
            rows.push({
              model, wind, sections: sec,
              widthLo: b.loIn, widthHi: b.hiIn === Infinity ? "" : b.hiIn,
              rawHeader: b.rawHeader,
              styleCount: b.allowedStyles.length,
              styles: b.allowedStyles.join(", "),
            });
          }
          done++;
          console.log(`[scrape] ${done}/${total}  ${model}/${wind}/sec=${sec} — ${buckets.length} buckets`);
        }
      }
    }

    printTSV(rows);
    window.__trussRows = rows;
    console.log(`%c[scrape] done — ${rows.length} bucket rows. Data at window.__trussRows`,
                "color:#2a8;font-weight:bold");
    return rows;
  }

  function printTSV(rows) {
    const header = ["model","wind","sections","widthLo","widthHi","rawHeader","styleCount","styles"];
    const lines = [header.join("\t")];
    for (const r of rows) lines.push(header.map(h => String(r[h] ?? "")).join("\t"));
    const tsv = lines.join("\n");
    console.log("%c--- TSV (copy below) ---", "color:#06f;font-weight:bold");
    console.log(tsv);
    return tsv;
  }

  window.scrapeTrussData = scrapeTrussData;
  window.readTrussMatrix = readMatrix;   // expose for quick sanity-check
  console.log("[scrape] loaded. Edit CONFIG, then run scrapeTrussData()  " +
              "or sanity-check the table with readTrussMatrix()");
})();
