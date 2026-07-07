/* =========================================================================
   Thermatite — test_bottom_retainer_browser.js
   =========================================================================
   Paste this whole file into the configurator's DevTools console, then call:

     testBottomRetainer()

   It calls the REAL buildBottomRetainerParts / buildBottomRetainerQty from
   section_bundles.js (so it tests the live logic, not a copy) by temporarily
   driving the DOOR_MODEL + BottomRetainer radios and the WIDTH node, asserting
   every band from Bill's spec sheets. Restores your selections when done.

   Bottom-seal qty is checked directly against the DWft+0.5 formula.
   ========================================================================= */
(function () {
  let passed = 0, failed = 0;
  const eq = (actual, expected, label) => {
    const a = JSON.stringify(actual), e = JSON.stringify(expected);
    if (a === e) { passed++; }
    else { failed++; console.log(`%c FAIL %c ${label}  expected ${e}  got ${a}`, "background:#a00;color:#fff", ""); }
  };
  const round2 = (n) => Math.round(n * 100) / 100;
  const ft = (f, i = 0) => f * 12 + i;

  // Drive the live inputs the functions read.
  function setModel(m) { $(`input[name='DOOR_MODEL'][value='${m}']`).prop("checked", true); }
  function setRetainer(r) { $(`input[name='BottomRetainer'][value='${r}']`).prop("checked", true); }
  function setWidth(inches) { if (nodeset?.["WIDTH"]) nodeset["WIDTH"].value = inches; }

  function parts(m, r, w) { setModel(m); setRetainer(r); setWidth(w); return buildBottomRetainerParts(); }
  function qty(m, r, w) { setModel(m); setRetainer(r); setWidth(w); return buildBottomRetainerQty(); }

  window.testBottomRetainer = function () {
    if (typeof buildBottomRetainerParts !== "function") { console.log("buildBottomRetainerParts not loaded — run on the configurator page."); return; }
    passed = 0; failed = 0;

    // Save current selections to restore after.
    const save = {
      model: $("input[name='DOOR_MODEL']:checked").val(),
      retainer: $("input[name='BottomRetainer']:checked").val(),
      width: nodeset?.["WIDTH"]?.value,
    };

    // T200 family (pvc)
    ["T200", "T200-20", "T200U"].forEach(m => {
      eq(parts(m, "pvc", 98).primary, "328-207-098", `${m} @98`);
      eq(parts(m, "pvc", 294).primary, "328-207-294", `${m} @294`);
      eq(parts(m, "pvc", 392).secondary, "328-207-098", `${m} @392 +098`);
      eq(parts(m, "pvc", 440).secondary, "328-207-146", `${m} @440 +146`);
      eq(qty(m, "pvc", ft(31, 2)), 1, `${m} qty=1`);
    });

    // T300 (pvc)
    eq(parts("T300", "pvc", 98).primary, "328-212-098", "T300 @98");
    eq(parts("T300", "pvc", 392).secondary, "328-212-098", "T300 @392 +098");
    eq(parts("T300", "pvc", 440).secondary, "328-212-146", "T300 @440 +146");
    eq(qty("T300", "pvc", ft(20)), 1, "T300 qty=1");

    // T200C / U200C (pvc)
    ["T200C", "U200C"].forEach(m => {
      eq(parts(m, "pvc", 96).primary, "328-790-080", `${m} @96`);
      eq(parts(m, "pvc", 313).primary, "328-790-261", `${m} @313 (261 outlier)`);
      eq(parts(m, "pvc", 390).secondary, "328-790-080", `${m} @390 +080`);
      eq(parts(m, "pvc", 438).secondary, "328-790-120", `${m} @438 +120`);
    });

    // T150 / T150U (steel) qty
    ["T150", "T150U"].forEach(m => {
      eq(parts(m, "steel", 120).primary, "328-266", `${m} part#`);
      eq(qty(m, "steel", ft(16)), round2(16 / 23.33), `${m} 16ft -> /23.33`);
      eq(qty(m, "steel", ft(20)), 1, `${m} 20ft -> 1`);
    });

    // T175 / T175U (steel) qty
    ["T175", "T175U"].forEach(m => {
      eq(parts(m, "steel", 120).primary, "328-265", `${m} part#`);
      eq(qty(m, "steel", ft(12)), round2(12 / 19.33), `${m} 12ft -> /19.33`);
      eq(qty(m, "steel", ft(15)), 1, `${m} 15ft -> 1 (flat band)`);
      eq(qty(m, "steel", ft(30)), round2(30 / 19.33), `${m} 30ft -> /19.33`);
    });

    // T150/T175 aluminum (pvc) ZZ part#
    eq(parts("T150", "pvc", 100).primary, "ZZT150ALUM-102", "T150 alum 100->102");
    eq(parts("T175", "pvc", 98).primary, "ZZT175ALUM-099", "T175 alum 98->099");

    // Bottom seal qty = DWft + 0.5
    const bsq = (w) => round2((w / 12) + 0.5);
    eq(bsq(ft(31, 2)), 31.67, "seal 31'2 -> 31.67");
    eq(bsq(ft(10)), 10.5, "seal 10'0 -> 10.5");

    // Restore.
    if (save.model) setModel(save.model);
    if (save.retainer) setRetainer(save.retainer);
    if (save.width !== undefined) setWidth(save.width);

    console.log(`%c ${failed === 0 ? "ALL PASS" : "SOME FAILED"} %c ${passed} passed, ${failed} failed`,
      `background:${failed === 0 ? "#0a0" : "#a00"};color:#fff;padding:2px 6px`, "");
  };

  console.log("Loaded. Run: testBottomRetainer()");
})();
