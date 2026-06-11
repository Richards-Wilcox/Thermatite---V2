/* =========================================================================
   Thermatite — test_bundles_browser.js
   =========================================================================
   Paste this ENTIRE file into the browser DevTools console while the
   configurator is loaded, then call:

     testBundles()                       → 12'2 x 14'2 custom (your case)
     testBundles({wFt:12, wIn:2, hFt:14, hIn:2})   → any custom size
     testBundles({preset:"0"})           → a preset SIZE radio (value attr)
     testBundles({wFt:20, wIn:0, hFt:14, hIn:0, model:"T200", color:"white", pattern:"Multi Rib"})

   It drives the REAL inputs, runs the REAL recompute (recomputeSectionBundles),
   then prints:
     • the resolved stack (heights per section, tallest/shortest qty)
     • the bundleByHeight() result (which sections paired vs shipped alone)
     • every SB / SC / RP description + SmartPart# that is non-empty
   so you can eyeball them against the stack chart.

   Nothing is asserted as right/wrong — it surfaces the live values for YOU
   to compare against Bill's chart. Re-run after changing any input to confirm
   it updates.
   ========================================================================= */
(function () {
  const N = (id) => (window.nodeset && nodeset[id] ? nodeset[id].value : undefined);
  const sv = (id) => { try { return getState(id); } catch (e) { return "(unregistered)"; } };

  function setCustom(o) {
    // Turn ON custom dimensions and push width/height/fraction.
    const $cd = $("#custom_dimensions");
    if (!$cd.is(":checked")) $cd.prop("checked", true).trigger("change");
    if (o.wFt != null) $("#CUSTOM_WIDTH_FEET").val(String(o.wFt)).trigger("change");
    if (o.wIn != null) $("#CUSTOM_WIDTH_INCHES").val(String(o.wIn)).trigger("change");
    if (o.frac != null) $("#CUSTOM_WIDTH_FRACTION").val(String(o.frac)).trigger("change");
    if (o.hFt != null) $("#CUSTOM_HEIGHT_FEET").val(String(o.hFt)).trigger("change");
    if (o.hIn != null) $("#CUSTOM_HEIGHT_INCHES").val(String(o.hIn)).trigger("change");
  }
  function setPreset(val) {
    const $cd = $("#custom_dimensions");
    if ($cd.is(":checked")) $cd.prop("checked", false).trigger("change");
    const $r = $(`input[name='SIZE'][value='${val}']`);
    if (!$r.length) { console.warn("No SIZE radio value=" + val); return; }
    $r.prop("checked", true).trigger("change");
  }

  window.testBundles = async function (opts = {}) {
    const o = Object.assign({ wFt: 12, wIn: 2, hFt: 14, hIn: 2 }, opts);

    if (o.model) $(`input[name='DOOR_MODEL'][value='${o.model}']`).prop("checked", true).trigger("change");
    if (o.color) { const $c = $(`input[name='COLOR'][value='${o.color}']`); if ($c.length) $c.prop("checked", true).trigger("change"); }
    if (o.pattern) { const $p = $(`input[name='Pattern'][value='${o.pattern}']`); if ($p.length) $p.prop("checked", true).trigger("change"); }

    if (o.preset != null) setPreset(o.preset);
    else setCustom(o);

    // Let the debounced cascade (80ms) + framework walks settle, then force a
    // clean recompute reading current DOM.
    await new Promise(r => setTimeout(r, 400));
    if (typeof invalidateSectionHeightsCache === "function") invalidateSectionHeightsCache();
    if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
    if (typeof renderNumOfSections === "function") renderNumOfSections();
    if (typeof recomputeSectionBundles === "function") recomputeSectionBundles();

    // ---- header ----
    const model = $("input[name='DOOR_MODEL']:checked").val();
    const color = $("input[name='COLOR']:checked").attr("desc");
    const pattern = $("input[name='Pattern']:checked").val();
    console.log("%c=== Thermatite bundle/desc/part# check ===", "font-weight:bold;color:#06c;");
    console.log(`Input:  ${o.preset != null ? "PRESET " + o.preset : `${o.wFt}'${o.wIn}" x ${o.hFt}'${o.hIn}"`}  | model=${model} color=${color} pattern=${pattern}`);
    console.log(`Nodes:  WIDTH=${sv("WIDTH")}  HEIGHT=${sv("HEIGHT")}  NUM_OF_SEC=${sv("NUM_OF_SEC")}`);
    console.log(`Stack:  TALLEST=${sv("TALLEST_SECTION")} x${sv("TALLEST_SECTION_QTY")}  SHORTEST=${sv("SHORTEST_SECTION")} x${sv("SHORTEST_SECTIONS_QTY")}`);

    // ---- bundling internals ----
    if (typeof getSectionBundle === "function") {
      const stack = getSectionBundle();
      console.log("Sections (btm→top, inches):", JSON.stringify(stack));
    }
    if (typeof bundleByHeight === "function") {
      const bundles = bundleByHeight();
      console.table(bundles.map((b, i) => ({
        bundle: i + 1,
        sections: JSON.stringify(b.sections),
        indexes: JSON.stringify(b.indexes),
        single_or_pair: b.sections.length === 2 ? "PAIR" : "single",
        weight: b.weight,
      })));
    }

    // ---- SB / SC / RP descriptions + part numbers ----
    const rows = [];
    const push = (label, descId, spId) => {
      const d = N(descId), p = N(spId);
      if ((d && d !== "None" && d !== "") || (p && p !== "None" && p !== "")) {
        rows.push({ row: label, SmartPart: p ?? "", Description: d ?? "" });
      }
    };
    for (let i = 1; i <= 9; i++) push(`SB${i}`, `SB${i}_DESC`, `SB${i}_SPNUM`);
    for (let b = 1; b <= 9; b++) {
      for (let s = 1; s <= 2; s++) push(`B${b}_SC${s}`, `BUNDLE${b}_SC${s}_DESC`, `BUNDLE${b}_SC${s}_SPNUM`);
      for (let s = 1; s <= 2; s++) push(`B${b}_RP${s}`, `BUNDLE${b}_RP${s}_DESC`, `BUNDLE${b}_RP${s}_SPNUM`);
    }
    console.log("%cBOM rows (non-empty):", "font-weight:bold;");
    console.table(rows);

    // ---- Y-line (door face) desc ----
    console.log("Y_LINE_DESC (door face):", N("Y_LINE_DESC"));

    return { width: sv("WIDTH"), height: sv("HEIGHT"), sections: sv("NUM_OF_SEC"), rows };
  };

  console.log("%cLoaded. Run: testBundles()  or  testBundles({wFt:12,wIn:2,hFt:14,hIn:2})", "color:#0a6;font-weight:bold;");
})();
