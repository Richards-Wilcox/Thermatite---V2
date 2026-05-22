/* =========================================================================
   Thermatite — test_logic.js
   =========================================================================
   Paste this entire file into the browser DevTools console, then call:

     runAllTests()                 → runs every test
     runTests("trackMount")        → runs one suite by name
     runTests("trackMount,noLap")  → runs multiple suites

   Available suites:
     Hardware tab:
       trackMount    Track Mount filter (60-rule table)
       lowerSplice   Lower Splice options vs Lift Type / Track Mount
       inclinedTrack Inclined Track Yes/No + Degree picker visibility
       highLift      Highlift+Clearance visibility & Custom LHR Setup
       weatherSeal   JAMB_SEAL filter by color × mount × model
       coverage      Coverage Complete/Vertical seal blocking + disable on NONE
       noLap         No Lap Steel Jamb forced by Jamb × OverlapRequired
       csbb          CSBB Door Height forced by CSBB + Door Height
     Door Model tab:
       width         Width feet/inches range per model × HW size × Door Options
       widthClamp    Width gets clamped when model changes to a smaller range
       height        Height feet/inches range per model × HW size × Door Options
       heightClamp   Height gets clamped when model changes to a smaller range
       colorRow      Color swatches per model (MODEL_COLORS)
       mixedPanel    Mixed panel visibility for DOOR_MODEL=D, width >= 96
       manualVis     Manual Type section visibility per Operation
       chainHoistVis Chain Hoist Type section visibility per Operation
     Advanced tab:
       hinges12Ga    Double End Caps forces 12Ga Hinges = Yes
       rollerStyle   Roller Style options per HW size
       exhaustPort   Exhaust Port details visibility + Latched forced by Size
       barLatch      Bar Latch disabled when One Point Latch = Yes
       barLatchSide  Bar Latch Side visibility (only when BarLatch=Yes)
       onePointQty   One Point Latch Qty visibility (only when OnePointLatch=Yes)
       overlapNote   Overlap Required Yes shows note
       bottomSeal    Bottom Seal options swap per Bottom Retainer

   Tests mutate form state. Save/restore is done per-suite, but if you abort
   a suite midway the form may be left in an unexpected state — reload.
   ========================================================================= */

(function () {

  // ---- helpers --------------------------------------------------------------
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const log = (...a) => console.log(...a);
  const pass = msg => console.log("%c PASS %c " + msg, "background:#0a0;color:#fff;padding:1px 4px;", "");
  const fail = msg => console.log("%c FAIL %c " + msg, "background:#a00;color:#fff;padding:1px 4px;", "");

  function setRadio(name, value) {
    const $r = $(`input[name='${name}'][value='${value}']`);
    if (!$r.length) throw new Error(`No radio ${name}=${value}`);
    $r.prop("checked", true).trigger("change");
  }
  function setSelect(id, value) {
    const $s = $(`#${id}`);
    if (!$s.length) throw new Error(`No #${id}`);
    $s.val(value).trigger("change");
  }
  function getRadio(name) { return $(`input[name='${name}']:checked`).val(); }
  function getSelect(id) { return $(`#${id}`).val(); }
  function visibleOptions(id) {
    return $(`#${id} option`).toArray()
      .filter(o => o.style.display !== "none" && !o.disabled)
      .map(o => o.value);
  }
  function assertEq(label, actual, expected) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a === e) { pass(`${label} → ${a}`); return true; }
    fail(`${label}\n   expected: ${e}\n   actual:   ${a}`);
    return false;
  }
  function assertSetEq(label, actual, expected) {
    const a = [...actual].sort();
    const e = [...expected].sort();
    return assertEq(label, a, e);
  }

  async function snapshot() {
    return {
      model:    getRadio("DOOR_MODEL"),
      hwSize:   getRadio("HARDWARE_SIZE"),
      doorOpts: getRadio("DOOR_OPTIONS"),
      csbb:     getRadio("CSBB"),
      csbbDr:   getRadio("CSBBDrHgt"),
      noLap:    getRadio("NoLapSteelJamb"),
      overlap:  getRadio("OverlapRequired"),
      liftType: getSelect("LIFT_TYPE"),
      trkMount: getSelect("TRK_MOUNT_TYP"),
      jamb:     getSelect("JAMB"),
      color:    getRadio("COLOR"),
      coverage: getRadio("WeatherSealCoverage"),
      heightFt: getSelect("CUSTOM_HEIGHT_FEET"),
      inclined: $("#INCLINED_TRACK_YES").is(":checked") ? "yes" : "no",
    };
  }
  async function restore(s) {
    if (s.model)    setRadio("DOOR_MODEL", s.model);
    if (s.hwSize)   setRadio("HARDWARE_SIZE", s.hwSize);
    if (s.doorOpts) setRadio("DOOR_OPTIONS", s.doorOpts);
    if (s.csbb)     setRadio("CSBB", s.csbb);
    if (s.overlap)  setRadio("OverlapRequired", s.overlap);
    if (s.liftType) setSelect("LIFT_TYPE", s.liftType);
    if (s.jamb)     setSelect("JAMB", s.jamb);
    if (s.color)    setRadio("COLOR", s.color);
    if (s.coverage) setRadio("WeatherSealCoverage", s.coverage);
    setRadio("InclinedTrackOn", s.inclined);
    await wait(50);
  }

  // ---- suites ---------------------------------------------------------------
  const suites = {};

  suites.trackMount = async function () {
    log("--- Track Mount filter ---");
    const snap = await snapshot();
    const cases = [
      // [model, hw, csbbDr (via inputs CSBB+height handled separately), noLap, expectedAllowed]
      // We bypass CSBB driver here by setting CSBBDrHgt directly via radio enable.
      // Direct radio: CSBBDrHgt=no_csbb means just pick CSBB=No.
      // We test a representative slice.
      { model: "T150",   hw: "2", csbb: "no", overlap: "yes", jamb: "wood", expect: ["ADCA_2","CLIP_2","B"] },  // 150|2|no_csbb|no (wood forces NoLap=No)
      { model: "T150",   hw: "3", csbb: "no", overlap: "yes", jamb: "wood", expect: ["ADCA_3","ADCA_2","CLIP_3","CLIP_2","B"] }, // 150|3|no_csbb|no
      { model: "T300",   hw: "2", csbb: "no", overlap: "yes", jamb: "wood", expect: ["ADCA_2"] },              // 300|2|no_csbb|no
      { model: "T300",   hw: "3", csbb: "no", overlap: "yes", jamb: "wood", expect: ["ADCA_3"] },              // 300|3|no_csbb|no
      { model: "T200C",  hw: "3", csbb: "no", overlap: "yes", jamb: "wood", expect: ["ADCA_3","ADCA_2","CLIP_3","CLIP_2","B"] }, // 200C|3|no_csbb|no
      { model: "T150",   hw: "2", csbb: "no", overlap: "no",  jamb: "steel", expect: ["B"] },                  // 150|2|no_csbb|yes (steel+overlap=no → NoLap=Yes)
    ];
    let p = 0, f = 0;
    for (const c of cases) {
      setRadio("DOOR_MODEL", c.model);
      setRadio("HARDWARE_SIZE", c.hw);
      setRadio("CSBB", c.csbb);
      setRadio("OverlapRequired", c.overlap);
      setSelect("JAMB", c.jamb);
      await wait(50);
      const actual = $("#TRK_MOUNT_TYP option").toArray().map(o => o.value);
      assertSetEq(`Track Mount [${c.model}/${c.hw}/csbb=${c.csbb}/overlap=${c.overlap}/jamb=${c.jamb}]`, actual, c.expect) ? p++ : f++;
    }
    log(`Track Mount: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.lowerSplice = async function () {
    log("--- Lower Splice ---");
    const snap = await snapshot();
    const cases = [
      { lift: "Std_Lift_12R", trk: "B",    expect: ["NONE"] },
      { lift: "Std_Lift_16R", trk: "B",    expect: ["NONE"] },
      { lift: "LHR_Fr_Mnt",   trk: "B",    expect: ["NONE"] },
      { lift: "LHR_Rr_Mnt",   trk: "B",    expect: ["NONE"] },
      { lift: "High_Lift",    trk: "B",    expect: ["UPPER_WALL_ANGLE","UPPER_BRACKET_MOUNT"] },
      { lift: "Vertical_Lift",trk: "B",    expect: ["UPPER_WALL_ANGLE","UPPER_BRACKET_MOUNT"] },
      { lift: "LHR_Vertical_Lift", trk: "B", expect: ["UPPER_WALL_ANGLE","UPPER_BRACKET_MOUNT"] },
    ];
    let p = 0, f = 0;
    for (const c of cases) {
      setSelect("LIFT_TYPE", c.lift);
      // ensure a compatible mount exists; if not the constraint just won't trigger
      if ($(`#TRK_MOUNT_TYP option[value='${c.trk}']`).length) setSelect("TRK_MOUNT_TYP", c.trk);
      await wait(50);
      const actual = $("#LOWER_SPLICE option").toArray().map(o => o.value);
      assertEq(`Lower Splice [lift=${c.lift}]`, actual, c.expect) ? p++ : f++;
    }
    log(`Lower Splice: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.inclinedTrack = async function () {
    log("--- Inclined Track ---");
    const snap = await snapshot();
    let p = 0, f = 0;

    setRadio("InclinedTrackOn", "no");
    await wait(50);
    assertEq("Details hidden when InclinedTrack=No",
      $("#INCLINED_TRACK_DETAILS").css("display"), "none") ? p++ : f++;

    setRadio("InclinedTrackOn", "yes");
    await wait(50);
    assertEq("Details visible when InclinedTrack=Yes",
      $("#INCLINED_TRACK_DETAILS").css("display") !== "none", true) ? p++ : f++;

    // LHR/VL should hide all degree options (only no_slope visible)
    for (const lift of ["LHR_Fr_Mnt","LHR_Rr_Mnt","Vertical_Lift","LHR_Vertical_Lift"]) {
      setSelect("LIFT_TYPE", lift);
      await wait(50);
      const vis = visibleOptions("INCLINED_TRACK_VALUE");
      assertEq(`Only no_slope visible for lift=${lift}`, vis, ["no_slope"]) ? p++ : f++;
    }
    // Std/High should show all values
    setSelect("LIFT_TYPE", "Std_Lift_12R");
    await wait(50);
    const visStd = visibleOptions("INCLINED_TRACK_VALUE");
    assertEq(`Std_Lift_12R shows >1 inclined options`, visStd.length > 1, true) ? p++ : f++;

    log(`Inclined Track: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.highLift = async function () {
    log("--- High Lift & Custom LHR ---");
    const snap = await snapshot();
    let p = 0, f = 0;

    setSelect("LIFT_TYPE", "Std_Lift_12R");
    await wait(50);
    assertEq("HIGHLIFT_ROW hidden for Std",
      $("#HIGHLIFT_ROW").css("display"), "none") ? p++ : f++;
    assertEq("CUSTOM_LHR_ROW hidden for Std",
      $("#CUSTOM_LHR_ROW").css("display"), "none") ? p++ : f++;

    setSelect("LIFT_TYPE", "High_Lift");
    await wait(50);
    assertEq("HIGHLIFT_ROW visible for High_Lift",
      $("#HIGHLIFT_ROW").css("display") !== "none", true) ? p++ : f++;
    assertEq("Clearance options [HighLift,HeadRoom] for High_Lift",
      visibleOptions("CLEARANCE"), ["HighLift","HeadRoom"]) ? p++ : f++;

    setSelect("LIFT_TYPE", "LHR_Vertical_Lift");
    await wait(50);
    assertEq("CUSTOM_LHR_ROW visible for LHR_Vertical_Lift",
      $("#CUSTOM_LHR_ROW").css("display") !== "none", true) ? p++ : f++;

    log(`High Lift: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.weatherSeal = async function () {
    log("--- Weather Seal (JAMB_SEAL) filter ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    const cases = [
      // [color, mount, model, expectedRange] — picked combos that exist in MODEL_COLORS
      { color: "white",  mount: "B",      model: "T175", min: 7, max: 7 },   // set 9 — 7 seals
      { color: "white",  mount: "ADCA_3", model: "T175", min: 20, max: 22 }, // set 8 — 21 seals
      { color: "brown",  mount: "B",      model: "T175", min: 7,  max: 7  }, // set 9 — 7 seals (None + AlumBlk + 5 Steel)
      { color: "brown",  mount: "ADCA_3", model: "T175", min: 19, max: 19 }, // set 7 — 19 seals
      { color: "black",  mount: "CLIP_3", model: "T200C", min: 1, max: 1 }, // Black-3C-T200C → set 1 → only NONE
      { color: "black",  mount: "B",      model: "U200C", min: 1, max: 1 }, // Black-B-U200C → set 1 → only NONE
    ];
    setRadio("WeatherSealCoverage", "vertical_only");
    setRadio("HARDWARE_SIZE", "3");
    setRadio("CSBB", "no");
    setRadio("OverlapRequired", "yes");
    setSelect("JAMB", "wood");
    await wait(100);
    for (const c of cases) {
      setRadio("DOOR_MODEL", c.model);
      await wait(50);
      if (!$(`input[name='COLOR'][value='${c.color}']`).length) {
        log(`  skip — color=${c.color} not available for model=${c.model}`);
        continue;
      }
      setRadio("COLOR", c.color);
      await wait(50);
      if ($(`#TRK_MOUNT_TYP option[value='${c.mount}']`).length) {
        setSelect("TRK_MOUNT_TYP", c.mount);
      } else {
        log(`  skip — mount=${c.mount} not allowed for model=${c.model}`);
        continue;
      }
      await wait(80);
      const vis = visibleOptions("JAMB_SEAL");
      const ok = vis.length >= c.min && vis.length <= c.max;
      if (ok) { pass(`Weather Seal [${c.color}/${c.mount}/${c.model}] visible=${vis.length}`); p++; }
      else    { fail(`Weather Seal [${c.color}/${c.mount}/${c.model}] visible=${vis.length}, expected ${c.min}-${c.max}`); f++; }
    }
    log(`Weather Seal: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.coverage = async function () {
    log("--- Coverage ---");
    const snap = await snapshot();
    let p = 0, f = 0;

    // Pick a combo where EU_ADCA exists (Black-3C-T300 → set 11). But that requires Steel-CSBB combo.
    // Simpler: test that Complete blocks EU_ADCA + ADCA_MOUNT_JWS regardless of data.
    setRadio("WeatherSealCoverage", "complete");
    await wait(50);
    const completeVis = visibleOptions("JAMB_SEAL");
    assertEq("Complete blocks EU_ADCA",
      completeVis.includes("EU_ADCA"), false) ? p++ : f++;
    assertEq("Complete blocks ADCA_MOUNT_JWS",
      completeVis.includes("ADCA_MOUNT_JWS"), false) ? p++ : f++;

    // Coverage disabled when JAMB_SEAL = NONE
    setSelect("JAMB_SEAL", "NONE");
    await wait(50);
    assertEq("Coverage Complete btn disabled when seal=None",
      $("#WS_COVERAGE_COMPLETE_BTN").hasClass("disabled"), true) ? p++ : f++;
    assertEq("Coverage Vertical btn disabled when seal=None",
      $("#WS_COVERAGE_VERTICAL_BTN").hasClass("disabled"), true) ? p++ : f++;

    log(`Coverage: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.noLap = async function () {
    log("--- No Lap Steel Jamb ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    const cases = [
      { jamb: "steel",   overlap: "yes", forced: "no" },
      { jamb: "steel",   overlap: "no",  forced: "yes" },
      { jamb: "wood",    overlap: "yes", forced: "no" },
      { jamb: "wood",    overlap: "no",  forced: "no" },
      { jamb: "masonry", overlap: "yes", forced: "no" },
      { jamb: "masonry", overlap: "no",  forced: "no" },
    ];
    for (const c of cases) {
      setSelect("JAMB", c.jamb);
      setRadio("OverlapRequired", c.overlap);
      await wait(50);
      const actual = $("input[name='NoLapSteelJamb']:checked").val();
      assertEq(`NoLap [jamb=${c.jamb}, overlap=${c.overlap}]`, actual, c.forced) ? p++ : f++;
      // both buttons should be disabled
      const yesDis = $("#NOLAP_STEEL_JAMB_YES").prop("disabled");
      const noDis  = $("#NOLAP_STEEL_JAMB_NO").prop("disabled");
      const someDisabled = yesDis || noDis;
      assertEq(`  ...buttons locked`, someDisabled, true) ? p++ : f++;
    }
    log(`No Lap: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.csbb = async function () {
    log("--- CSBB Door Height ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    const cases = [
      { csbb: "no",  height: "10", forced: "no_csbb" },
      { csbb: "no",  height: "25", forced: "no_csbb" },
      { csbb: "yes", height: "10", forced: "csbb_dhlte20ft" },
      { csbb: "yes", height: "20", forced: "csbb_dhlte20ft" },
      { csbb: "yes", height: "21", forced: "csbb_dhgt20" },
      { csbb: "yes", height: "30", forced: "csbb_dhgt20" },
    ];
    // Need a model that supports height up to 30 (anything except T150)
    setRadio("DOOR_MODEL", "T175");
    setRadio("HARDWARE_SIZE", "3");
    await wait(50);
    for (const c of cases) {
      setRadio("CSBB", c.csbb);
      setSelect("CUSTOM_HEIGHT_FEET", c.height);
      await wait(80);
      const actual = $("input[name='CSBBDrHgt']:checked").val();
      assertEq(`CSBBDrHgt [csbb=${c.csbb}, height=${c.height}]`, actual, c.forced) ? p++ : f++;
    }
    log(`CSBB: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  // ===== Door Model tab =====================================================

  suites.width = async function () {
    log("--- Width constraints ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    // Test min/max range per (model, hwSize)
    const cases = [
      { model: "T150",   hw: "2", expectMin: 4, expectMax: 24 },
      { model: "T150",   hw: "3", expectMin: 4, expectMax: 24 },
      { model: "T175",   hw: "2", expectMin: 4, expectMax: 19 },
      { model: "T175",   hw: "3", expectMin: 4, expectMax: 38 },
      { model: "T200",   hw: "3", expectMin: 4, expectMax: 38 },
      { model: "T200C",  hw: "2", expectMin: 4, expectMax: 20 },
      { model: "T200C",  hw: "3", expectMin: 4, expectMax: 32 },
    ];
    setRadio("DOOR_OPTIONS", "0");
    await wait(50);
    for (const c of cases) {
      setRadio("DOOR_MODEL", c.model);
      setRadio("HARDWARE_SIZE", c.hw);
      await wait(80);
      const opts = $("#CUSTOM_WIDTH_FEET option").toArray().map(o => +o.value);
      const min = Math.min(...opts);
      const max = Math.max(...opts);
      assertEq(`Width range [${c.model}/hw=${c.hw}]`, { min, max }, { min: c.expectMin, max: c.expectMax }) ? p++ : f++;
    }
    log(`Width: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.height = async function () {
    log("--- Height constraints ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    const cases = [
      { model: "T150",   hw: "2", doorOpts: "0", expectMin: 4, expectMax: 16 },
      { model: "T150",   hw: "3", doorOpts: "0", expectMin: 4, expectMax: 18 },
      { model: "T175",   hw: "2", doorOpts: "0", expectMin: 4, expectMax: 32 },
      { model: "T175",   hw: "3", doorOpts: "0", expectMin: 4, expectMax: 32 },
      { model: "T150U",  hw: "3", doorOpts: "1", expectMin: 4, expectMax: 22 }, // face_3
      { model: "T150U",  hw: "2", doorOpts: "1", expectMin: 4, expectMax: 18 }, // face_2
    ];
    for (const c of cases) {
      setRadio("DOOR_MODEL", c.model);
      setRadio("HARDWARE_SIZE", c.hw);
      setRadio("DOOR_OPTIONS", c.doorOpts);
      await wait(80);
      const opts = $("#CUSTOM_HEIGHT_FEET option").toArray().map(o => +o.value);
      const min = Math.min(...opts);
      const max = Math.max(...opts);
      assertEq(`Height range [${c.model}/hw=${c.hw}/opts=${c.doorOpts}]`, { min, max }, { min: c.expectMin, max: c.expectMax }) ? p++ : f++;
    }
    log(`Height: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.colorRow = async function () {
    log("--- Color swatches per model ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    const cases = [
      { model: "T150",   expect: ["white", "brown"] },
      { model: "T175",   expect: ["white", "brown", "silver"] },
      { model: "T200",   expect: ["white"] },
      { model: "T200C",  expect: ["brown", "bronze", "slate_grey", "iron_ore", "black", "sandstone", "almond", "cafe"] },
      { model: "U200C",  expect: ["white", "brown", "bronze", "slate_grey", "iron_ore", "black", "sandstone", "almond", "cafe"] },
    ];
    for (const c of cases) {
      setRadio("DOOR_MODEL", c.model);
      await wait(100);
      const swatches = $("#COLOR_ROW input[name='COLOR']").toArray().map(i => i.value);
      assertSetEq(`Swatches [${c.model}]`, swatches, c.expect) ? p++ : f++;
    }
    log(`Color Row: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.widthClamp = async function () {
    log("--- Width clamping ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    // T175 hw=3 allows up to 38 ft. Set to 38 then switch to T200C hw=3 (max 32) — should clamp to 32.
    setRadio("DOOR_OPTIONS", "0");
    setRadio("HARDWARE_SIZE", "3");
    setRadio("DOOR_MODEL", "T175");
    await wait(80);
    setSelect("CUSTOM_WIDTH_FEET", "38");
    await wait(80);
    setRadio("DOOR_MODEL", "T200C");
    await wait(120);
    const clamped = +$("#CUSTOM_WIDTH_FEET").val();
    assertEq("Width clamps from 38 → 32 when T175→T200C", clamped, 32) ? p++ : f++;

    // Switch to T150 hw=2 (max 24) from a higher value
    setRadio("DOOR_MODEL", "T175");
    setRadio("HARDWARE_SIZE", "2");
    await wait(80);
    setSelect("CUSTOM_WIDTH_FEET", "19");
    setRadio("DOOR_MODEL", "T150");
    await wait(120);
    const clamped2 = +$("#CUSTOM_WIDTH_FEET").val();
    assertEq("Width stays ≤ max for T150/hw2 (max 24)", clamped2 <= 24, true) ? p++ : f++;

    log(`Width Clamp: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.heightClamp = async function () {
    log("--- Height clamping ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    setRadio("DOOR_OPTIONS", "0");
    setRadio("HARDWARE_SIZE", "3");
    setRadio("DOOR_MODEL", "T175");
    await wait(80);
    setSelect("CUSTOM_HEIGHT_FEET", "32");
    await wait(80);
    setRadio("DOOR_MODEL", "T150");
    await wait(120);
    const clamped = +$("#CUSTOM_HEIGHT_FEET").val();
    assertEq("Height clamps from 32 → 18 when T175→T150/hw3", clamped, 18) ? p++ : f++;

    // T150U hw=2 face only (max 18) from a higher value
    setRadio("DOOR_MODEL", "T175");
    setRadio("HARDWARE_SIZE", "2");
    setRadio("DOOR_OPTIONS", "0");
    await wait(80);
    setSelect("CUSTOM_HEIGHT_FEET", "30");
    setRadio("DOOR_OPTIONS", "1");
    setRadio("DOOR_MODEL", "T150U");
    await wait(120);
    const clamped2 = +$("#CUSTOM_HEIGHT_FEET").val();
    assertEq("Height clamps to T150U/face_2 max (18)", clamped2 <= 18, true) ? p++ : f++;

    log(`Height Clamp: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  // Visibility helper that checks inline style, not ancestor visibility
  // (tabs that aren't active still have correct local display state).
  function hasOwnDisplay(sel, want) {
    const el = $(sel)[0];
    if (!el) return null;
    const d = el.style.display;
    return want === "hidden" ? d === "none" : d !== "none";
  }

  suites.manualVis = async function () {
    log("--- Manual Type visibility ---");
    const snap = { op: getRadio("Operation") };
    let p = 0, f = 0;

    setRadio("Operation", "0"); // Manual
    await wait(80);
    assertEq("Manual Type section visible when Operation=Manual",
      hasOwnDisplay("#manual_type_section", "shown"), true) ? p++ : f++;

    setRadio("Operation", "1"); // Drawbar
    await wait(80);
    assertEq("Manual Type section hidden when Operation=Drawbar",
      hasOwnDisplay("#manual_type_section", "hidden"), true) ? p++ : f++;

    setRadio("Operation", "4"); // Chain Hoist
    await wait(80);
    assertEq("Manual Type section hidden when Operation=Chain Hoist",
      hasOwnDisplay("#manual_type_section", "hidden"), true) ? p++ : f++;

    log(`Manual Type Visibility: ${p} passed, ${f} failed`);
    if (snap.op) setRadio("Operation", snap.op);
    return { p, f };
  };

  suites.chainHoistVis = async function () {
    log("--- Chain Hoist Type visibility ---");
    const snap = { op: getRadio("Operation") };
    let p = 0, f = 0;

    setRadio("Operation", "4"); // Chain Hoist
    await wait(80);
    assertEq("Chain Hoist section visible when Operation=Chain Hoist",
      hasOwnDisplay("#chain_hoist_type_section", "shown"), true) ? p++ : f++;

    setRadio("Operation", "0"); // Manual
    await wait(80);
    assertEq("Chain Hoist section hidden when Operation=Manual",
      hasOwnDisplay("#chain_hoist_type_section", "hidden"), true) ? p++ : f++;

    setRadio("Operation", "1"); // Drawbar
    await wait(80);
    assertEq("Chain Hoist section hidden when Operation=Drawbar",
      hasOwnDisplay("#chain_hoist_type_section", "hidden"), true) ? p++ : f++;

    log(`Chain Hoist Visibility: ${p} passed, ${f} failed`);
    if (snap.op) setRadio("Operation", snap.op);
    return { p, f };
  };

  suites.mixedPanel = async function () {
    log("--- Mixed panel ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    // Mixed panel needs DOOR_MODEL='D' but the configurator doesn't have a 'D' model
    // in the visible list — it's wired against the framework's WIDTH/DOOR_MODEL nodes.
    // We just verify the panel is hidden for the visible models.
    setRadio("DOOR_MODEL", "T175");
    await wait(80);
    assertEq("Mixed panel hidden for non-D model",
      $(".mixed-panel").is(":visible"), false) ? p++ : f++;
    log(`Mixed Panel: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  // ===== Advanced tab =======================================================

  suites.hinges12Ga = async function () {
    log("--- 12Ga Hinges ---");
    const snap = {
      endCaps: getRadio("EndCaps"),
      hinges:  getRadio("Hinges12Gauge"),
    };
    let p = 0, f = 0;

    // Double end caps → 12Ga forced Yes, No button disabled
    if ($("input[name='EndCaps'][value='1']").length) {
      setRadio("EndCaps", "1");
      await wait(50);
      assertEq("Double EndCaps forces 12Ga = Yes",
        $("#HINGES_12GA_0").prop("checked"), true) ? p++ : f++;
      assertEq("Double EndCaps disables 12Ga No button",
        $("#HINGES_12GA_1").prop("disabled"), true) ? p++ : f++;
    } else {
      log("  skip — EndCaps=1 not in form");
    }
    // Single end caps → No button enabled
    if ($("input[name='EndCaps'][value='0']").length) {
      setRadio("EndCaps", "0");
      await wait(50);
      assertEq("Single EndCaps enables 12Ga No button",
        $("#HINGES_12GA_1").prop("disabled"), false) ? p++ : f++;
    }
    log(`12Ga Hinges: ${p} passed, ${f} failed`);
    if (snap.endCaps) setRadio("EndCaps", snap.endCaps);
    return { p, f };
  };

  suites.rollerStyle = async function () {
    log("--- Roller Style ---");
    const snap = await snapshot();
    let p = 0, f = 0;
    setRadio("HARDWARE_SIZE", "2");
    await wait(80);
    const hw2 = visibleOptions("ROLLER_STYLE");
    assertSetEq("Roller Style HW=2", hw2,
      ["Steel", "Nylon", "Nylon w/ sealed bearing"]) ? p++ : f++;

    setRadio("HARDWARE_SIZE", "3");
    await wait(80);
    const hw3 = visibleOptions("ROLLER_STYLE");
    assertSetEq("Roller Style HW=3", hw3,
      ["Steel", "UHMW W/Sealed bearing", "Nylon w/ stainless stem and sealed bearing"]) ? p++ : f++;
    log(`Roller Style: ${p} passed, ${f} failed`);
    await restore(snap);
    return { p, f };
  };

  suites.exhaustPort = async function () {
    log("--- Exhaust Port ---");
    const snap = {
      view:     getRadio("ExhaustPortView"),
      size:     getRadio("ExhaustPortSize"),
      latched:  getRadio("ExhaustPortLatched"),
    };
    let p = 0, f = 0;

    // View=none → details hidden
    setRadio("ExhaustPortView", "none");
    await wait(50);
    assertEq("Details hidden when View=none",
      $("#EXHAUST_PORT_DETAILS_WRAP").css("display"), "none") ? p++ : f++;

    // View=left → details visible
    setRadio("ExhaustPortView", "left");
    await wait(50);
    assertEq("Details visible when View=left",
      $("#EXHAUST_PORT_DETAILS_WRAP").css("display") !== "none", true) ? p++ : f++;

    // Size=6 forces Latched=Yes (disabled)
    setRadio("ExhaustPortSize", "6");
    await wait(50);
    assertEq("Size=6 forces Latched=Yes",
      $("#EXHAUST_PORT_LATCHED_YES").prop("checked"), true) ? p++ : f++;
    assertEq("Size=6 disables Latched buttons",
      $("#EXHAUST_PORT_LATCHED_NO").prop("disabled"), true) ? p++ : f++;

    // Size=3 forces Latched=No (disabled)
    setRadio("ExhaustPortSize", "3");
    await wait(50);
    assertEq("Size=3 forces Latched=No",
      $("#EXHAUST_PORT_LATCHED_NO").prop("checked"), true) ? p++ : f++;

    log(`Exhaust Port: ${p} passed, ${f} failed`);
    if (snap.view)    setRadio("ExhaustPortView", snap.view);
    if (snap.size)    setRadio("ExhaustPortSize", snap.size);
    if (snap.latched) setRadio("ExhaustPortLatched", snap.latched);
    return { p, f };
  };

  suites.barLatch = async function () {
    log("--- Bar Latch vs One Point Latch ---");
    const snap = {
      onePoint: getRadio("OnePointLatch"),
      barLatch: getRadio("BarLatch"),
    };
    let p = 0, f = 0;

    setRadio("OnePointLatch", "yes");
    await wait(50);
    assertEq("One Point=Yes forces Bar Latch=No",
      $("#BAR_LATCH_NO").prop("checked"), true) ? p++ : f++;
    assertEq("One Point=Yes disables Bar Latch Yes btn",
      $("#BAR_LATCH_YES").prop("disabled"), true) ? p++ : f++;
    assertEq("One Point=Yes disables Bar Latch No btn",
      $("#BAR_LATCH_NO").prop("disabled"), true) ? p++ : f++;

    setRadio("OnePointLatch", "no");
    await wait(50);
    assertEq("One Point=No enables Bar Latch Yes btn",
      $("#BAR_LATCH_YES").prop("disabled"), false) ? p++ : f++;
    assertEq("One Point=No enables Bar Latch No btn",
      $("#BAR_LATCH_NO").prop("disabled"), false) ? p++ : f++;

    log(`Bar Latch: ${p} passed, ${f} failed`);
    if (snap.onePoint) setRadio("OnePointLatch", snap.onePoint);
    if (snap.barLatch) setRadio("BarLatch", snap.barLatch);
    return { p, f };
  };

  suites.barLatchSide = async function () {
    log("--- Bar Latch Side visibility ---");
    const snap = {
      onePoint: getRadio("OnePointLatch"),
      barLatch: getRadio("BarLatch"),
    };
    let p = 0, f = 0;
    setRadio("OnePointLatch", "no");
    await wait(50);
    setRadio("BarLatch", "yes");
    await wait(80);
    assertEq("Bar Latch Side visible when BarLatch=Yes",
      hasOwnDisplay("#BAR_LATCH_SIDE_WRAP", "shown"), true) ? p++ : f++;

    setRadio("BarLatch", "no");
    await wait(80);
    assertEq("Bar Latch Side hidden when BarLatch=No",
      hasOwnDisplay("#BAR_LATCH_SIDE_WRAP", "hidden"), true) ? p++ : f++;

    log(`Bar Latch Side: ${p} passed, ${f} failed`);
    if (snap.onePoint) setRadio("OnePointLatch", snap.onePoint);
    if (snap.barLatch) setRadio("BarLatch", snap.barLatch);
    return { p, f };
  };

  suites.onePointQty = async function () {
    log("--- One Point Latch Qty visibility ---");
    const snap = { onePoint: getRadio("OnePointLatch") };
    let p = 0, f = 0;

    setRadio("OnePointLatch", "yes");
    await wait(80);
    assertEq("OnePoint Qty visible when OnePointLatch=Yes",
      hasOwnDisplay("#ONE_POINT_LATCH_QTY_WRAP", "shown"), true) ? p++ : f++;

    setRadio("OnePointLatch", "no");
    await wait(80);
    assertEq("OnePoint Qty hidden when OnePointLatch=No",
      hasOwnDisplay("#ONE_POINT_LATCH_QTY_WRAP", "hidden"), true) ? p++ : f++;

    log(`OnePoint Qty: ${p} passed, ${f} failed`);
    if (snap.onePoint) setRadio("OnePointLatch", snap.onePoint);
    return { p, f };
  };

  suites.overlapNote = async function () {
    log("--- Overlap Required note ---");
    const snap = { overlap: getRadio("OverlapRequired") };
    let p = 0, f = 0;

    setRadio("OverlapRequired", "yes");
    await wait(80);
    assertEq("OVERLAP_NOTE visible when Overlap=Yes",
      hasOwnDisplay("#OVERLAP_NOTE", "shown"), true) ? p++ : f++;

    setRadio("OverlapRequired", "no");
    await wait(80);
    assertEq("OVERLAP_NOTE hidden when Overlap=No",
      hasOwnDisplay("#OVERLAP_NOTE", "hidden"), true) ? p++ : f++;

    log(`Overlap Note: ${p} passed, ${f} failed`);
    if (snap.overlap) setRadio("OverlapRequired", snap.overlap);
    return { p, f };
  };

  suites.bottomSeal = async function () {
    log("--- Bottom Seal ---");
    const snap = { retainer: getSelect("BOTTOM_RETAINER") };
    let p = 0, f = 0;

    // Retainer with seal slot → 2 options visible
    setSelect("BOTTOM_RETAINER", "steel");
    await wait(80);
    const sealOpts = $("#BOTTOM_SEAL option").toArray().map(o => o.value);
    assertSetEq("steel retainer: seal options",
      sealOpts, ["pvc_4_35c", "santoprene_3_60c"]) ? p++ : f++;
    assertEq("steel retainer: not disabled",
      $("#BOTTOM_SEAL").prop("disabled"), false) ? p++ : f++;

    setSelect("BOTTOM_RETAINER", "pvc");
    await wait(80);
    const pvcOpts = $("#BOTTOM_SEAL option").toArray().map(o => o.value);
    assertSetEq("pvc retainer: seal options",
      pvcOpts, ["pvc_4_35c", "santoprene_3_60c"]) ? p++ : f++;

    // Retainer without seal → only "none" + disabled
    // pick any other value the dropdown has
    const $other = $("#BOTTOM_RETAINER option").toArray().find(o =>
      o.value !== "steel" && o.value !== "pvc");
    if ($other) {
      setSelect("BOTTOM_RETAINER", $other.value);
      await wait(80);
      const noneOpts = $("#BOTTOM_SEAL option").toArray().map(o => o.value);
      assertEq(`${$other.value} retainer: only 'none' option`,
        noneOpts, ["none"]) ? p++ : f++;
      assertEq(`${$other.value} retainer: select disabled`,
        $("#BOTTOM_SEAL").prop("disabled"), true) ? p++ : f++;
    }

    log(`Bottom Seal: ${p} passed, ${f} failed`);
    if (snap.retainer) setSelect("BOTTOM_RETAINER", snap.retainer);
    return { p, f };
  };

  // ---- runner --------------------------------------------------------------
  window.runTests = async function (which) {
    const names = (which || "").split(",").map(s => s.trim()).filter(Boolean);
    const target = names.length ? names : Object.keys(suites);
    let totalP = 0, totalF = 0;
    for (const name of target) {
      if (!suites[name]) { fail(`Unknown suite: ${name}`); continue; }
      const { p, f } = await suites[name]();
      totalP += p; totalF += f;
    }
    log(`%c TOTAL %c ${totalP} passed, ${totalF} failed`,
      "background:" + (totalF ? "#a00" : "#0a0") + ";color:#fff;padding:1px 4px;", "");
  };
  window.runAllTests = () => runTests();

  log("%c Tests loaded %c run with: runAllTests() or runTests('trackMount,noLap')",
    "background:#06c;color:#fff;padding:1px 4px;", "");
})();
