/* Browser-console version of truss CSV cross-check.
   Paste into the DevTools console while the configurator is loaded.
   Requires: lookupTrussStyle, TRUSS_STYLE_CODE_TO_OPTION (defined in
   truss_style_logic.js, already loaded by the page).
   Requires: the /data/truss_excel/ folder served by the same origin.
*/
(async function verifyTruss() {
  const CSV_BASE = "data/truss_excel";   // adjust if served from a different path
  const FILES = [
    "T150/T150-basic-lte5.csv","T150/T150-10-gte5.csv","T150/T150-15-lte5.csv","T150/T150-15-gte5.csv","T150/T150-20-lte5.csv","T150/T150-20-gte5.csv",
    "T175/T175-basic-lte5.csv","T175/T175-10-gte5.csv","T175/T175-15-lte5.csv","T175/T175-15-gte5.csv","T175/T175-20-lte5.csv","T175/T175-20-gte5.csv",
    "T200/T200-10-lte5.csv","T200/T200-10-gte5.csv","T200/T200-15-lte5.csv","T200/T200-15-gte5.csv","T200/T200-20-lte5.csv","T200/T200-20-gte5.csv",
    "T300/T300-basic-lte5.csv","T300/T300-10-gte5.csv","T300/T300-15psf-lte5.csv","T300/T300-15-gte5.csv","T300/T300-20psf-lte5.csv","T300/T300-20-gte5.csv",
    "T200-20/T200-20-basic-lte5.csv","T200-20/T200-20-basic-gte5.csv","T200-20/T200-20-15-lte5.csv","T200-20/T200-20-15-gte5.csv","T200-20/T200-20-20-lte5.csv","T200-20/T200-20-20-gte5.csv",
    "T200C/T200C-basic-lte5.csv","T200C/T200C-basic-gte5.csv","T200C/T200C-15-lte5.csv","T200C/T200C-15-gte5.csv","T200C/T200C-20-lte5.csv","T200C/T200C-20-gte5.csv",
    "T150U/T150U-basic-lte5.csv","T150U/T150U-basic-gte5.csv","T150U/T150U-15-lte5.csv","T150U/T150U-15-gte5.csv","T150U/T150U-20-lte5.csv","T150U/T150U-20-gte5.csv",
    "T175U/T175U-basic-lte5.csv","T175U/T175U-basic-gte5.csv","T175U/T175U-15-lte5.csv","T175U/T175U-15-gte5.csv","T175U/T175U-20-lte5.csv","T175U/T175U-20-gte5.csv",
    "T200U/T200U-basic-lte5.csv","T200U/T200U-basic-gte5.csv","T200U/T200U-15-lte5.csv","T200U/T200U-15-gte5.csv","T200U/T200U-20-lte5.csv","T200U/T200U-20-gte5.csv",
    "U200C/U200C-basic-lte5.csv","U200C/U200C-basic-gte5.csv","U200C/U200C-15-lte5.csv","U200C/U200C-15-gte5.csv","U200C/U200C-20-lte5.csv","U200C/U200C-20-gte5.csv",
  ];

  function parseFile(p) {
    const parts = p.split("/");
    const dir = parts[0];
    const base = parts[1].replace(/\.csv$/,"");
    const suffix = base.startsWith(dir + "-") ? base.slice(dir.length+1) : base;
    const segs = suffix.split("-");
    const bucket = segs.pop();
    const windRaw = segs.join("-");
    let wind = windRaw;
    if (windRaw === "basic" || windRaw === "10") wind = "basic";
    else if (windRaw === "15" || windRaw === "15psf") wind = "15psf";
    else if (windRaw === "20" || windRaw === "20psf") wind = "20psf";
    const secBucket = bucket === "lte5" ? "lte5" : "gt5";
    const sections = secBucket === "lte5" ? 4 : 6;
    return { model: dir, wind, secBucket, sections };
  }

  function parseCsv(text) {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      if (cols.length < 7) continue;
      const widthHiIn = parseInt(cols[3]);
      const styles = cols.slice(6).join(",").split("|").map(s=>s.trim()).filter(Boolean);
      rows.push({ widthHiIn, styles });
    }
    return rows;
  }

  const codeToOption = window.TRUSS_STYLE_CODE_TO_OPTION;
  if (!codeToOption || typeof window.lookupTrussStyle !== "function") {
    console.error("Missing lookupTrussStyle or TRUSS_STYLE_CODE_TO_OPTION. Are you on the configurator page?");
    return;
  }
  const optionToCode = {};
  for (const [c,o] of Object.entries(codeToOption)) optionToCode[o] = c;

  let total = 0, mismatches = 0;
  const summary = {};

  for (const file of FILES) {
    let text;
    try {
      const res = await fetch(`${CSV_BASE}/${file}`);
      if (!res.ok) { console.warn(`skip ${file}: ${res.status}`); continue; }
      text = await res.text();
    } catch (e) { console.warn(`skip ${file}: ${e.message}`); continue; }

    const { model, wind, secBucket, sections } = parseFile(file);
    const rows = parseCsv(text);
    for (const row of rows) {
      const widthIn = row.widthHiIn;
      if (widthIn <= 0) continue;
      total++;
      const result = window.lookupTrussStyle({ model, wind, widthIn, sections });

      const csvSpecial = row.styles.length === 1 && (row.styles[0] === "EXCEEDS_CAPACITY" || row.styles[0] === "NO_OPTIONS");
      if (csvSpecial) {
        if (row.styles[0] === "EXCEEDS_CAPACITY" && result.kind !== "EXCEEDS_CAPACITY") {
          mismatches++;
          const key = `${model}/${wind}/${secBucket}`;
          (summary[key] ??= []).push(`width=${widthIn}: CSV=EXCEEDS, got=${result.kind}`);
        }
        continue;
      }

      const expectedCodes = row.styles.filter(code => {
        if (secBucket === "lte5" && code.includes("GT5")) return false;
        if (secBucket === "gt5"  && code.includes("LTE5")) return false;
        return true;
      });
      const expected = new Set(expectedCodes.map(c => codeToOption[c]).filter(Boolean));
      const actual = new Set(result.styles || []);

      const same = expected.size === actual.size && [...expected].every(s => actual.has(s));
      if (!same) {
        mismatches++;
        const key = `${model}/${wind}/${secBucket}`;
        const missing = [...expected].filter(s => !actual.has(s)).map(s => optionToCode[s] || s);
        const extra   = [...actual].filter(s => !expected.has(s)).map(s => optionToCode[s] || s);
        (summary[key] ??= []).push(`width=${widthIn}: missing=[${missing.join(",")}], extra=[${extra.join(",")}]`);
      }
    }
  }

  console.log(`%cTotal rows tested: ${total}`, "font-weight:bold");
  console.log(`%cMismatches: ${mismatches}`, `font-weight:bold;color:${mismatches?"crimson":"green"}`);
  for (const [slice, items] of Object.entries(summary)) {
    console.groupCollapsed(`${slice}  (${items.length} mismatches)`);
    items.slice(0, 30).forEach(i => console.log(i));
    if (items.length > 30) console.log(`... (+${items.length - 30} more)`);
    console.groupEnd();
  }
  window._trussVerifySummary = summary;
  console.log("Full summary saved to window._trussVerifySummary");
})();
