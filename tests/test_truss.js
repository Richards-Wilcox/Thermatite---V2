/* =========================================================================
   Thermatite — test_truss.js
   =========================================================================
   Test harness for truss_style_logic.js + key driven inputs.

   USAGE
     1. Upload this file alongside the others in the quote software (after
        truss_style_logic.js and load_drive_inputs.js).
     2. Trigger:
          - URL flag: ?debug=truss   → runs automatically 1.5s after load
          - Console:  runTrussTests() → run on demand
     3. Open DevTools console — pass/fail prints with ✓/✗ + summary + table.
   ========================================================================= */

(function() {
    const debugRequested = window.location.search.includes("debug=truss");
    window.runTrussTests = runTrussTests;
    if (debugRequested) setTimeout(runTrussTests, 1500);

    const results = [];

    function assert(name, actual, expected) {
        const pass = JSON.stringify(actual) === JSON.stringify(expected);
        results.push({ name, pass, actual, expected });
        if (pass) {
            console.log(`%c ✓ ${name}`, "color: #2a8");
        } else {
            console.error(`✗ ${name}`, { actual, expected });
        }
        return pass;
    }

    function trussCase(label, input, expectedKind) {
        if (typeof lookupTrussStyle !== "function") {
            console.error("lookupTrussStyle not defined — truss_style_logic.js may not be loaded");
            return;
        }
        const r = lookupTrussStyle(input);
        assert(`${label} → kind=${expectedKind}`, r.kind, expectedKind);
    }

    function setRadio(name, value) {
        const $input = $(`input[name='${name}'][value='${value}']`);
        if (!$input.length) {
            console.warn(`setRadio: no radio found for name='${name}' value='${value}'`);
            return false;
        }
        $(`input[name='${name}']`).prop("checked", false);
        $input.prop("checked", true).trigger("change");
        return true;
    }


    function summarize() {
        const passed = results.filter(r => r.pass).length;
        const failed = results.length - passed;
        console.log(`\n%c=== Truss Tests: ${passed}/${results.length} passed (${failed} failed) ===`,
            failed === 0 ? "color: #2a8; font-weight: bold" : "color: #c33; font-weight: bold");
        if (failed > 0) {
            console.table(results.filter(r => !r.pass).map(r => ({
                name: r.name, actual: JSON.stringify(r.actual), expected: JSON.stringify(r.expected)
            })));
        }
    }

    function runTrussTests() {
        results.length = 0;
        console.log("%c=== Running truss + driven-input tests ===", "color: #06f; font-weight: bold");

        // ---- T150 basic + 15psf / lte5 ----
        trussCase("T150 basic lte5 @ width=100", { model: "T150", wind: "basic", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T150 basic lte5 @ width=181 (boundary 15'1\")", { model: "T150", wind: "basic", widthIn: 181, sections: 4 }, "ALLOWED");
        trussCase("T150 basic lte5 @ width=182", { model: "T150", wind: "basic", widthIn: 182, sections: 4 }, "ALLOWED");
        trussCase("T150 basic lte5 @ width=360 (NO_OPTIONS)", { model: "T150", wind: "basic", widthIn: 360, sections: 4 }, "NO_OPTIONS");
        trussCase("T150 basic lte5 @ width=400 (EXCEEDS_CAPACITY)", { model: "T150", wind: "basic", widthIn: 400, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T150 basic + 15psf / gt5 ----
        trussCase("T150 basic gt5 @ width=120", { model: "T150", wind: "basic", widthIn: 120, sections: 8 }, "ALLOWED");
        trussCase("T150 basic gt5 @ width=350", { model: "T150", wind: "basic", widthIn: 350, sections: 8 }, "ALLOWED");
        trussCase("T150 basic gt5 @ width=400 (EXCEEDS_CAPACITY)", { model: "T150", wind: "basic", widthIn: 400, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- T150 — confirm 15psf shares basic slice ----
        trussCase("T150 15psf lte5 @ width=200", { model: "T150", wind: "15psf", widthIn: 200, sections: 4 }, "ALLOWED");
        trussCase("T150 15psf gt5 @ width=300", { model: "T150", wind: "15psf", widthIn: 300, sections: 8 }, "ALLOWED");

        // ---- T150 20psf / lte5 ----
        trussCase("T150 20psf lte5 @ width=100", { model: "T150", wind: "20psf", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T150 20psf lte5 @ width=127 (boundary 10'7\")", { model: "T150", wind: "20psf", widthIn: 127, sections: 4 }, "ALLOWED");
        trussCase("T150 20psf lte5 @ width=128", { model: "T150", wind: "20psf", widthIn: 128, sections: 4 }, "ALLOWED");
        trussCase("T150 20psf lte5 @ width=245 (last ALLOWED)", { model: "T150", wind: "20psf", widthIn: 245, sections: 4 }, "ALLOWED");
        trussCase("T150 20psf lte5 @ width=246 (first EXCEEDS_CAPACITY)", { model: "T150", wind: "20psf", widthIn: 246, sections: 4 }, "EXCEEDS_CAPACITY");
        trussCase("T150 20psf lte5 @ width=290 (T150 max, EXCEEDS_CAPACITY)", { model: "T150", wind: "20psf", widthIn: 290, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T150 20psf / gt5 ----
        trussCase("T150 20psf gt5 @ width=120", { model: "T150", wind: "20psf", widthIn: 120, sections: 8 }, "ALLOWED");
        trussCase("T150 20psf gt5 @ width=239 (last ALLOWED)", { model: "T150", wind: "20psf", widthIn: 239, sections: 8 }, "ALLOWED");
        trussCase("T150 20psf gt5 @ width=240 (first EXCEEDS_CAPACITY)", { model: "T150", wind: "20psf", widthIn: 240, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- T175 basic (10psf) lte5 ----
        trussCase("T175 basic lte5 @ width=100 (all allowed)", { model: "T175", wind: "basic", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=209 (last all-allowed)", { model: "T175", wind: "basic", widthIn: 209, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=210 (first w/ exclusions)", { model: "T175", wind: "basic", widthIn: 210, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=385 (last w/ regular styles)", { model: "T175", wind: "basic", widthIn: 385, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=389 (NO_OPTIONS gap)", { model: "T175", wind: "basic", widthIn: 389, sections: 4 }, "NO_OPTIONS");
        trussCase("T175 basic lte5 @ width=390 (HatTruss starts)", { model: "T175", wind: "basic", widthIn: 390, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=421 (last HatTruss)", { model: "T175", wind: "basic", widthIn: 421, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=422 (HatTruss_UbarTruss starts)", { model: "T175", wind: "basic", widthIn: 422, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=456 (last allowed, model max)", { model: "T175", wind: "basic", widthIn: 456, sections: 4 }, "ALLOWED");
        trussCase("T175 basic lte5 @ width=457 (EXCEEDS)", { model: "T175", wind: "basic", widthIn: 457, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T175 15psf lte5 ----
        trussCase("T175 15psf lte5 @ width=100", { model: "T175", wind: "15psf", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=193 (last all-allowed)", { model: "T175", wind: "15psf", widthIn: 193, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=194", { model: "T175", wind: "15psf", widthIn: 194, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=304 (last w/ regular styles)", { model: "T175", wind: "15psf", widthIn: 304, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=305 (HatTruss only)", { model: "T175", wind: "15psf", widthIn: 305, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=373 (last HatTruss)", { model: "T175", wind: "15psf", widthIn: 373, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=374 (HatTruss_UbarTruss)", { model: "T175", wind: "15psf", widthIn: 374, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=456 (last allowed)", { model: "T175", wind: "15psf", widthIn: 456, sections: 4 }, "ALLOWED");
        trussCase("T175 15psf lte5 @ width=457 (EXCEEDS)", { model: "T175", wind: "15psf", widthIn: 457, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T175 20psf lte5 ----
        trussCase("T175 20psf lte5 @ width=100", { model: "T175", wind: "20psf", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=166 (last all-allowed)", { model: "T175", wind: "20psf", widthIn: 166, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=167", { model: "T175", wind: "20psf", widthIn: 167, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=264 (last w/ regular styles)", { model: "T175", wind: "20psf", widthIn: 264, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=265 (HatTruss only)", { model: "T175", wind: "20psf", widthIn: 265, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=311 (last HatTruss)", { model: "T175", wind: "20psf", widthIn: 311, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=312 (HatTruss_UbarTruss)", { model: "T175", wind: "20psf", widthIn: 312, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=363 (last allowed)", { model: "T175", wind: "20psf", widthIn: 363, sections: 4 }, "ALLOWED");
        trussCase("T175 20psf lte5 @ width=364 (first EXCEEDS)", { model: "T175", wind: "20psf", widthIn: 364, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T175 basic (10psf) gt5 ----
        trussCase("T175 basic gt5 @ width=100", { model: "T175", wind: "basic", widthIn: 100, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=204 (last all-allowed)", { model: "T175", wind: "basic", widthIn: 204, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=205 (first w/ exclusions)", { model: "T175", wind: "basic", widthIn: 205, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=421 (last regular)", { model: "T175", wind: "basic", widthIn: 421, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=422 (HatTruss starts)", { model: "T175", wind: "basic", widthIn: 422, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=461 (last HatTruss)", { model: "T175", wind: "basic", widthIn: 461, sections: 8 }, "ALLOWED");
        trussCase("T175 basic gt5 @ width=462 (HatTruss_UbarTruss)", { model: "T175", wind: "basic", widthIn: 462, sections: 8 }, "ALLOWED");

        // ---- T175 15psf gt5 ----
        trussCase("T175 15psf gt5 @ width=100", { model: "T175", wind: "15psf", widthIn: 100, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=187 (last all-allowed)", { model: "T175", wind: "15psf", widthIn: 187, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=299 (last regular)", { model: "T175", wind: "15psf", widthIn: 299, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=300 (HatTruss)", { model: "T175", wind: "15psf", widthIn: 300, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=360 (last HatTruss)", { model: "T175", wind: "15psf", widthIn: 360, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=361 (HatTruss_UbarTruss)", { model: "T175", wind: "15psf", widthIn: 361, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=421 (last allowed)", { model: "T175", wind: "15psf", widthIn: 421, sections: 8 }, "ALLOWED");
        trussCase("T175 15psf gt5 @ width=422 (first EXCEEDS)", { model: "T175", wind: "15psf", widthIn: 422, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- T175 20psf gt5 ----
        trussCase("T175 20psf gt5 @ width=100", { model: "T175", wind: "20psf", widthIn: 100, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=166 (last all-allowed)", { model: "T175", wind: "20psf", widthIn: 166, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=287 (last regular)", { model: "T175", wind: "20psf", widthIn: 287, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=288 (HatTruss)", { model: "T175", wind: "20psf", widthIn: 288, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=307 (last HatTruss)", { model: "T175", wind: "20psf", widthIn: 307, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=308 (HatTruss_UbarTruss)", { model: "T175", wind: "20psf", widthIn: 308, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=363 (last allowed)", { model: "T175", wind: "20psf", widthIn: 363, sections: 8 }, "ALLOWED");
        trussCase("T175 20psf gt5 @ width=364 (first EXCEEDS)", { model: "T175", wind: "20psf", widthIn: 364, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- T200 basic / lte5 ----
        trussCase("T200 basic lte5 @ width=100", { model: "T200", wind: "basic", widthIn: 100, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=211 (last empty excl)", { model: "T200", wind: "basic", widthIn: 211, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=212 (first excl row)", { model: "T200", wind: "basic", widthIn: 212, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=374 (last regular)", { model: "T200", wind: "basic", widthIn: 374, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=375 (HatTruss)", { model: "T200", wind: "basic", widthIn: 375, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=421 (last HatTruss)", { model: "T200", wind: "basic", widthIn: 421, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=422 (HatTruss_UbarTruss)", { model: "T200", wind: "basic", widthIn: 422, sections: 4 }, "ALLOWED");
        trussCase("T200 basic lte5 @ width=456 (last allowed)", { model: "T200", wind: "basic", widthIn: 456, sections: 4 }, "ALLOWED");

        // ---- T200 15psf / lte5 ----
        trussCase("T200 15psf lte5 @ width=210 (last empty excl)", { model: "T200", wind: "15psf", widthIn: 210, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=211 (first excl row)", { model: "T200", wind: "15psf", widthIn: 211, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=300 (last regular)", { model: "T200", wind: "15psf", widthIn: 300, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=301 (HatTruss)", { model: "T200", wind: "15psf", widthIn: 301, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=340 (last HatTruss)", { model: "T200", wind: "15psf", widthIn: 340, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=341 (HatTruss_UbarTruss)", { model: "T200", wind: "15psf", widthIn: 341, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=405 (last allowed)", { model: "T200", wind: "15psf", widthIn: 405, sections: 4 }, "ALLOWED");
        trussCase("T200 15psf lte5 @ width=406 (first EXCEEDS)", { model: "T200", wind: "15psf", widthIn: 406, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T200 20psf / lte5 ----
        trussCase("T200 20psf lte5 @ width=182 (last empty excl)", { model: "T200", wind: "20psf", widthIn: 182, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=183 (first excl row)", { model: "T200", wind: "20psf", widthIn: 183, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=258 (last regular)", { model: "T200", wind: "20psf", widthIn: 258, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=259 (HatTruss)", { model: "T200", wind: "20psf", widthIn: 259, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=287 (last HatTruss)", { model: "T200", wind: "20psf", widthIn: 287, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=288 (HatTruss_UbarTruss)", { model: "T200", wind: "20psf", widthIn: 288, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=331 (last allowed)", { model: "T200", wind: "20psf", widthIn: 331, sections: 4 }, "ALLOWED");
        trussCase("T200 20psf lte5 @ width=332 (first EXCEEDS)", { model: "T200", wind: "20psf", widthIn: 332, sections: 4 }, "EXCEEDS_CAPACITY");

        // ---- T200 basic / gt5 ----
        trussCase("T200 basic gt5 @ width=211 (last empty excl)", { model: "T200", wind: "basic", widthIn: 211, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=212 (first excl row)", { model: "T200", wind: "basic", widthIn: 212, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=402 (last regular)", { model: "T200", wind: "basic", widthIn: 402, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=403 (HatTruss)", { model: "T200", wind: "basic", widthIn: 403, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=421 (last HatTruss)", { model: "T200", wind: "basic", widthIn: 421, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=422 (HatTruss_UbarTruss)", { model: "T200", wind: "basic", widthIn: 422, sections: 8 }, "ALLOWED");
        trussCase("T200 basic gt5 @ width=456 (last allowed)", { model: "T200", wind: "basic", widthIn: 456, sections: 8 }, "ALLOWED");

        // ---- T200 15psf / gt5 ----
        trussCase("T200 15psf gt5 @ width=212 (last empty excl)", { model: "T200", wind: "15psf", widthIn: 212, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=213 (first excl row)", { model: "T200", wind: "15psf", widthIn: 213, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=304 (last regular)", { model: "T200", wind: "15psf", widthIn: 304, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=305 (HatTruss)", { model: "T200", wind: "15psf", widthIn: 305, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=346 (last HatTruss)", { model: "T200", wind: "15psf", widthIn: 346, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=347 (HatTruss_UbarTruss)", { model: "T200", wind: "15psf", widthIn: 347, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=421 (last allowed)", { model: "T200", wind: "15psf", widthIn: 421, sections: 8 }, "ALLOWED");
        trussCase("T200 15psf gt5 @ width=422 (first EXCEEDS)", { model: "T200", wind: "15psf", widthIn: 422, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- T200 20psf / gt5 ----
        trussCase("T200 20psf gt5 @ width=186 (last empty excl)", { model: "T200", wind: "20psf", widthIn: 186, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=187 (first excl row)", { model: "T200", wind: "20psf", widthIn: 187, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=265 (last regular)", { model: "T200", wind: "20psf", widthIn: 265, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=266 (HatTruss)", { model: "T200", wind: "20psf", widthIn: 266, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=295 (last HatTruss)", { model: "T200", wind: "20psf", widthIn: 295, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=296 (HatTruss_UbarTruss)", { model: "T200", wind: "20psf", widthIn: 296, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=361 (last allowed)", { model: "T200", wind: "20psf", widthIn: 361, sections: 8 }, "ALLOWED");
        trussCase("T200 20psf gt5 @ width=362 (first EXCEEDS)", { model: "T200", wind: "20psf", widthIn: 362, sections: 8 }, "EXCEEDS_CAPACITY");

        // ---- NO_RULE for still-untranscribed models ----
        trussCase("T300 / basic / lte5 → NO_RULE", { model: "T300", wind: "basic", widthIn: 200, sections: 4 }, "NO_RULE");

        // ---- DOM-coupled driven inputs ----
        if (typeof $ === "function" && $("#configurator").length > 0) {
            console.log("%c--- DOM-driven input tests ---", "color: #06f");

            setRadio("ExhaustPortView", "left");

            setRadio("ExhaustPortSize", "6");
            assert("ExhaustPortSize=6 → Latched Yes checked", $("#EXHAUST_PORT_LATCHED_YES").is(":checked"), true);
            assert("ExhaustPortSize=6 → Latched Yes disabled", $("#EXHAUST_PORT_LATCHED_YES").is(":disabled"), true);

            setRadio("ExhaustPortSize", "3");
            assert("ExhaustPortSize=3 → Latched No checked", $("#EXHAUST_PORT_LATCHED_NO").is(":checked"), true);
            assert("ExhaustPortSize=3 → Latched disabled", $("#EXHAUST_PORT_LATCHED_NO").is(":disabled"), true);

            setRadio("ExhaustPortSize", "0");
            assert("ExhaustPortSize=0 → Latched No checked", $("#EXHAUST_PORT_LATCHED_NO").is(":checked"), true);

            setRadio("ExhaustPortSize", "4");
            assert("ExhaustPortSize=4 → Latched No checked", $("#EXHAUST_PORT_LATCHED_NO").is(":checked"), true);

            setRadio("ExhaustPortView", "none");

            setRadio("OnePointLatch", "yes");
            assert("OPL=yes → Bar Latch No forced", $("#BAR_LATCH_NO").is(":checked"), true);
            assert("OPL=yes → Bar Latch Yes disabled", $("#BAR_LATCH_YES").is(":disabled"), true);
            assert("OPL=yes → Bar Latch No disabled", $("#BAR_LATCH_NO").is(":disabled"), true);

            setRadio("OnePointLatch", "no");
            assert("OPL=no → Bar Latch Yes re-enabled", $("#BAR_LATCH_YES").is(":disabled"), false);
            assert("OPL=no → Bar Latch No re-enabled", $("#BAR_LATCH_NO").is(":disabled"), false);

            setRadio("DOOR_MODEL", "T300");
            assert("T300 → HW Size 2 hidden", $("#HARDWARE_SIZE_0_BTN").is(":visible"), false);
            assert("T300 → HW Size 2 radio disabled", $("#HARDWARE_SIZE_0").is(":disabled"), true);
            assert("T300 → HW Size 3 checked", $("#HARDWARE_SIZE_1").is(":checked"), true);

            setRadio("DOOR_MODEL", "T150");
            assert("T150 → HW Size 2 visible again", $("#HARDWARE_SIZE_0_BTN").is(":visible"), true);
            assert("T150 → HW Size 2 enabled", $("#HARDWARE_SIZE_0").is(":disabled"), false);

            setRadio("DOOR_OPTIONS", "1");
            assert("Door Face Only → .face-only class", $("#configurator").hasClass("face-only"), true);
            assert("Door Face Only → operation_section hidden", $("#operation_section").is(":visible"), false);

            setRadio("DOOR_OPTIONS", "0");
            assert("Complete Door → .face-only removed", $("#configurator").hasClass("face-only"), false);
            assert("Complete Door → operation_section visible", $("#operation_section").is(":visible"), true);

            // ---- TRUSS_STYLE — every interval boundary across all T150 slices ----
            console.log("%c--- TRUSS_STYLE interval coverage ---", "color: #06f");

            // For each width, assert the lookup's `kind`. Boundary pairs (hi, hi+1)
            // catch off-by-one errors in interval bounds.
            const intervals = [
                { label: "T150 basic lte5", model: "T150", wind: "basic", sections: 4,
                  cases: [[100,"ALLOWED"],[181,"ALLOWED"],[182,"ALLOWED"],[210,"ALLOWED"],[211,"ALLOWED"],
                          [227,"ALLOWED"],[228,"ALLOWED"],[241,"ALLOWED"],[242,"ALLOWED"],[246,"ALLOWED"],
                          [247,"ALLOWED"],[263,"ALLOWED"],[264,"ALLOWED"],[266,"ALLOWED"],[267,"ALLOWED"],
                          [280,"ALLOWED"],[281,"ALLOWED"],[295,"ALLOWED"],[296,"ALLOWED"],[310,"ALLOWED"],
                          [311,"ALLOWED"],[352,"ALLOWED"],[353,"NO_OPTIONS"],[360,"NO_OPTIONS"],
                          [361,"EXCEEDS_CAPACITY"],[400,"EXCEEDS_CAPACITY"],[458,"EXCEEDS_CAPACITY"]] },
                { label: "T150 basic gt5", model: "T150", wind: "basic", sections: 8,
                  cases: [[100,"ALLOWED"],[181,"ALLOWED"],[182,"ALLOWED"],[227,"ALLOWED"],[228,"ALLOWED"],
                          [241,"ALLOWED"],[242,"ALLOWED"],[263,"ALLOWED"],[264,"ALLOWED"],[280,"ALLOWED"],
                          [281,"ALLOWED"],[295,"ALLOWED"],[296,"ALLOWED"],[310,"ALLOWED"],[311,"ALLOWED"],
                          [351,"ALLOWED"],[352,"EXCEEDS_CAPACITY"],[400,"EXCEEDS_CAPACITY"]] },
                { label: "T150 15psf lte5", model: "T150", wind: "15psf", sections: 4,
                  cases: [[210,"ALLOWED"],[353,"NO_OPTIONS"],[400,"EXCEEDS_CAPACITY"]] },
                { label: "T150 15psf gt5",  model: "T150", wind: "15psf", sections: 8,
                  cases: [[295,"ALLOWED"],[352,"EXCEEDS_CAPACITY"]] },
                { label: "T150 20psf lte5", model: "T150", wind: "20psf", sections: 4,
                  cases: [[100,"ALLOWED"],[127,"ALLOWED"],[128,"ALLOWED"],[156,"ALLOWED"],[157,"ALLOWED"],
                          [168,"ALLOWED"],[169,"ALLOWED"],[173,"ALLOWED"],[174,"ALLOWED"],[181,"ALLOWED"],
                          [182,"ALLOWED"],[193,"ALLOWED"],[194,"ALLOWED"],[204,"ALLOWED"],[205,"ALLOWED"],
                          [211,"ALLOWED"],[212,"ALLOWED"],[245,"ALLOWED"],[246,"EXCEEDS_CAPACITY"],[290,"EXCEEDS_CAPACITY"]] },
                { label: "T150 20psf gt5", model: "T150", wind: "20psf", sections: 8,
                  cases: [[100,"ALLOWED"],[127,"ALLOWED"],[128,"ALLOWED"],[156,"ALLOWED"],[157,"ALLOWED"],
                          [184,"ALLOWED"],[185,"ALLOWED"],[186,"ALLOWED"],[187,"ALLOWED"],[193,"ALLOWED"],
                          [194,"ALLOWED"],[195,"ALLOWED"],[209,"ALLOWED"],[210,"ALLOWED"],[216,"ALLOWED"],
                          [217,"ALLOWED"],[222,"ALLOWED"],[239,"ALLOWED"],[240,"EXCEEDS_CAPACITY"],[290,"EXCEEDS_CAPACITY"]] },
                // T175 — boundary pairs for each interval transition
                { label: "T175 basic lte5", model: "T175", wind: "basic", sections: 4,
                  cases: [[100,"ALLOWED"],[209,"ALLOWED"],[210,"ALLOWED"],[257,"ALLOWED"],[258,"ALLOWED"],
                          [277,"ALLOWED"],[278,"ALLOWED"],[282,"ALLOWED"],[283,"ALLOWED"],[304,"ALLOWED"],
                          [305,"ALLOWED"],[311,"ALLOWED"],[312,"ALLOWED"],[315,"ALLOWED"],[316,"ALLOWED"],
                          [328,"ALLOWED"],[329,"ALLOWED"],[385,"ALLOWED"],[386,"NO_OPTIONS"],[389,"NO_OPTIONS"],
                          [390,"ALLOWED"],[421,"ALLOWED"],[422,"ALLOWED"],[456,"ALLOWED"],[457,"EXCEEDS_CAPACITY"]] },
                { label: "T175 15psf lte5", model: "T175", wind: "15psf", sections: 4,
                  cases: [[100,"ALLOWED"],[193,"ALLOWED"],[194,"ALLOWED"],[219,"ALLOWED"],[220,"ALLOWED"],
                          [229,"ALLOWED"],[230,"ALLOWED"],[233,"ALLOWED"],[234,"ALLOWED"],[245,"ALLOWED"],
                          [246,"ALLOWED"],[253,"ALLOWED"],[254,"ALLOWED"],[256,"ALLOWED"],[257,"ALLOWED"],
                          [277,"ALLOWED"],[278,"ALLOWED"],[304,"ALLOWED"],[305,"ALLOWED"],[373,"ALLOWED"],
                          [374,"ALLOWED"],[456,"ALLOWED"],[457,"EXCEEDS_CAPACITY"]] },
                { label: "T175 20psf lte5", model: "T175", wind: "20psf", sections: 4,
                  cases: [[100,"ALLOWED"],[166,"ALLOWED"],[167,"ALLOWED"],[186,"ALLOWED"],[187,"ALLOWED"],
                          [193,"ALLOWED"],[194,"ALLOWED"],[197,"ALLOWED"],[198,"ALLOWED"],[209,"ALLOWED"],
                          [210,"ALLOWED"],[214,"ALLOWED"],[215,"ALLOWED"],[223,"ALLOWED"],[224,"ALLOWED"],
                          [239,"ALLOWED"],[240,"ALLOWED"],[264,"ALLOWED"],[265,"ALLOWED"],[311,"ALLOWED"],
                          [312,"ALLOWED"],[363,"ALLOWED"],[364,"EXCEEDS_CAPACITY"]] },
                // T175 gt5 boundary pairs
                { label: "T175 basic gt5", model: "T175", wind: "basic", sections: 8,
                  cases: [[100,"ALLOWED"],[204,"ALLOWED"],[205,"ALLOWED"],[275,"ALLOWED"],[276,"ALLOWED"],
                          [303,"ALLOWED"],[304,"ALLOWED"],[313,"ALLOWED"],[314,"ALLOWED"],[323,"ALLOWED"],
                          [324,"ALLOWED"],[325,"ALLOWED"],[421,"ALLOWED"],[422,"ALLOWED"],[461,"ALLOWED"],[462,"ALLOWED"]] },
                { label: "T175 15psf gt5", model: "T175", wind: "15psf", sections: 8,
                  cases: [[100,"ALLOWED"],[187,"ALLOWED"],[188,"ALLOWED"],[229,"ALLOWED"],[230,"ALLOWED"],
                          [240,"ALLOWED"],[241,"ALLOWED"],[252,"ALLOWED"],[253,"ALLOWED"],[271,"ALLOWED"],
                          [272,"ALLOWED"],[299,"ALLOWED"],[300,"ALLOWED"],[360,"ALLOWED"],[361,"ALLOWED"],
                          [421,"ALLOWED"],[422,"EXCEEDS_CAPACITY"]] },
                { label: "T175 20psf gt5", model: "T175", wind: "20psf", sections: 8,
                  cases: [[100,"ALLOWED"],[166,"ALLOWED"],[167,"ALLOWED"],[199,"ALLOWED"],[200,"ALLOWED"],
                          [220,"ALLOWED"],[221,"ALLOWED"],[236,"ALLOWED"],[237,"ALLOWED"],[287,"ALLOWED"],
                          [288,"ALLOWED"],[307,"ALLOWED"],[308,"ALLOWED"],[363,"ALLOWED"],[364,"EXCEEDS_CAPACITY"]] },
            ];
            intervals.forEach(s => s.cases.forEach(([w, kind]) =>
                trussCase(`${s.label} w=${w}`, { model: s.model, wind: s.wind, widthIn: w, sections: s.sections }, kind)
            ));

            // For ALLOWED rows, also assert the styles list matches the rule's exclude
            // set (catches data bugs inside the array contents, not just the kind).
            // Spot-check one width per slice.
            const styleSpotCheck = [
                { label: "T150 basic lte5 w=200",  input: { model: "T150", wind: "basic", widthIn: 200, sections: 4 } },
                { label: "T150 basic gt5  w=200",  input: { model: "T150", wind: "basic", widthIn: 200, sections: 8 } },
                { label: "T150 20psf lte5 w=200", input: { model: "T150", wind: "20psf", widthIn: 200, sections: 4 } },
                { label: "T150 20psf gt5  w=200", input: { model: "T150", wind: "20psf", widthIn: 200, sections: 8 } },
            ];
            styleSpotCheck.forEach(({ label, input }) => {
                const r = lookupTrussStyle(input);
                assert(`${label} — styles non-empty & all strings`,
                    r.kind === "ALLOWED" && Array.isArray(r.styles) && r.styles.length > 0 && r.styles.every(s => typeof s === "string"),
                    true);
            });

            // HatTruss opt-in checks: must appear for T175 wide widths, must NOT appear for T150
            const tHat = lookupTrussStyle({ model: "T175", wind: "basic", widthIn: 400, sections: 4 });
            assert("T175 basic lte5 w=400 — only Hat Truss", tHat.styles, ["0.049 Hat Truss"]);
            const tUbar = lookupTrussStyle({ model: "T175", wind: "basic", widthIn: 440, sections: 4 });
            assert("T175 basic lte5 w=440 — only Hat + Ubar Truss", tUbar.styles, ["0.049 Hat Truss and Ubar Truss"]);
            const t150Wide = lookupTrussStyle({ model: "T150", wind: "basic", widthIn: 200, sections: 4 });
            assert("T150 basic lte5 w=200 — no Hat Truss appears",
                t150Wide.styles.some(s => s.includes("Hat")), false);
        } else {
            console.log("(skipping DOM tests — #configurator not present)");
        }

        summarize();
    }
})();
