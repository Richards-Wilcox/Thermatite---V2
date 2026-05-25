/* =========================================================================
   Thermatite — test_truss.js
   =========================================================================
   Exhaustive test harness for truss_style_logic.js.

   STRATEGY
     Instead of hand-picking ~280 boundary cases, this driver walks
     TRUSS_STYLE_RULES itself. For every rule slice (model × wind × bucket)
     it generates tests at every interval's lower bound, midpoint, and
     upper bound — guaranteeing 100% coverage of every interval encoded
     in the rules. Total: ~1500–2000 tests.

   For each interval it asserts:
     1. kind matches (ALLOWED / NO_OPTIONS / EXCEEDS_CAPACITY).
     2. When ALLOWED, the returned styles set matches the interval's
        own filter (TRUSS_STYLE_ALL_CODES \ exclude \ section-auto-excl \
        opt-in non-extras).
     3. Opt-in codes (HatTruss / U-series) only appear when listed in
        allowedExtras.

   Also kept: a handful of sentinel / DOM-integration spot checks at end.

   USAGE
     - URL flag: ?debug=truss   → runs automatically 1.5s after page load
     - Console:  runTrussTests() → run on demand
   ========================================================================= */

(function() {
    const debugRequested = window.location.search.includes("debug=truss");
    window.runTrussTests = runTrussTests;
    if (debugRequested) setTimeout(runTrussTests, 1500);

    const results = [];
    let failedDetails = [];

    function assert(name, actual, expected) {
        const pass = JSON.stringify(actual) === JSON.stringify(expected);
        results.push({ name, pass });
        if (!pass) {
            failedDetails.push({ name, actual, expected });
            console.error(`✗ ${name}`, { actual, expected });
        }
        return pass;
    }

    function setEq(a, b) {
        if (a.size !== b.size) return false;
        for (const x of a) if (!b.has(x)) return false;
        return true;
    }

    function setRadio(name, value) {
        const $input = $(`input[name='${name}'][value='${value}']`);
        if (!$input.length) return false;
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
            console.table(failedDetails.slice(0, 100).map(r => ({
                name: r.name,
                actual: JSON.stringify(r.actual).slice(0, 200),
                expected: JSON.stringify(r.expected).slice(0, 200),
            })));
            if (failedDetails.length > 100) {
                console.warn(`(${failedDetails.length - 100} more failures not shown — see window._trussFailures)`);
                window._trussFailures = failedDetails;
            }
        }
    }

    /* -----------------------------------------------------------------
       Compute the expected result for a given (rule, interval, sections)
       by replicating the same exclude logic as lookupTrussStyle().
       This is the test oracle — it MUST mirror the production logic.
       ----------------------------------------------------------------- */
    function expectedFor(rule, interval, sections) {
        if (interval.exclude === TRUSS_STYLE_EXCEEDS_CAPACITY) return { kind: "EXCEEDS_CAPACITY" };
        if (interval.exclude === TRUSS_STYLE_NO_OPTIONS)       return { kind: "NO_OPTIONS" };

        const allowedExtras = new Set(interval.allowedExtras || []);
        const optInExcluded = TRUSS_STYLE_OPT_IN_CODES.filter(c => !allowedExtras.has(c));
        const sectionExcluded = TRUSS_STYLE_ALL_CODES.filter(code => {
            if (sections <= 5 && code.includes("GT5")) return true;
            if (sections > 5  && code.includes("LTE5")) return true;
            return false;
        });
        const excluded = new Set([
            ...interval.exclude,
            ...sectionExcluded,
            ...optInExcluded,
        ]);
        const styles = TRUSS_STYLE_ALL_CODES
            .filter(code => !excluded.has(code))
            .map(code => TRUSS_STYLE_CODE_TO_OPTION[code]);
        return { kind: "ALLOWED", styles };
    }

    function runIntervalTests() {
        if (typeof TRUSS_STYLE_RULES === "undefined") {
            console.error("TRUSS_STYLE_RULES not defined — truss_style_logic.js may not be loaded");
            return;
        }

        const ALL_BUCKETS = [
            { name: "lte5", sections: 4 },
            { name: "gt5",  sections: 8 },
        ];

        for (const rule of TRUSS_STYLE_RULES) {
            // For each rule, determine which section counts to test. Most rules
            // gate on rule.secBucket. "any" rules apply to both.
            const buckets = (rule.secBucket === "any")
                ? ALL_BUCKETS
                : ALL_BUCKETS.filter(b => b.name === rule.secBucket);

            // Wind can be a string or array — pick first for testing
            const wind = Array.isArray(rule.wind) ? rule.wind[0] : rule.wind;

            // Walk intervals. Lower bound of interval N is (intervals[N-1].hi + 1)
            // or 1 for the first interval.
            let prevHi = 0;
            for (let i = 0; i < rule.intervals.length; i++) {
                const interval = rule.intervals[i];
                const lo = prevHi + 1;
                const hi = interval.hi;
                const mid = Math.floor((lo + hi) / 2);
                const widths = (lo === mid && mid === hi) ? [lo] : [lo, mid, hi];

                for (const bucket of buckets) {
                    const expected = expectedFor(rule, interval, bucket.sections);

                    for (const w of widths) {
                        const result = lookupTrussStyle({
                            model: rule.model,
                            wind,
                            widthIn: w,
                            sections: bucket.sections,
                        });
                        const label = `${rule.model}/${wind}/${bucket.name} iv#${i} w=${w}`;

                        // 1. kind match
                        const kindPass = (result.kind === expected.kind);
                        if (!kindPass) {
                            assert(`${label} kind`, result.kind, expected.kind);
                            continue;
                        }
                        if (expected.kind !== "ALLOWED") {
                            assert(`${label} kind=${expected.kind}`, result.kind, expected.kind);
                            continue;
                        }

                        // 2. styles set match
                        const actualSet = new Set(result.styles);
                        const expectedSet = new Set(expected.styles);
                        if (setEq(actualSet, expectedSet)) {
                            assert(`${label} styles`, true, true);
                        } else {
                            const missing = [...expectedSet].filter(s => !actualSet.has(s));
                            const extra   = [...actualSet].filter(s => !expectedSet.has(s));
                            assert(`${label} styles`, { extra, missing }, { extra: [], missing: [] });
                        }
                    }
                }
                prevHi = hi;
            }
        }
    }

    /* -----------------------------------------------------------------
       Sentinel & invariant tests.
       ----------------------------------------------------------------- */
    function runSentinelTests() {
        // NO_RULE: unknown model / wind
        assert("NO_RULE unknown model",
            lookupTrussStyle({ model: "FAKE_MODEL", wind: "basic", widthIn: 200, sections: 4 }).kind,
            "NO_RULE");
        assert("NO_RULE unknown wind",
            lookupTrussStyle({ model: "T150", wind: "fakewind", widthIn: 200, sections: 4 }).kind,
            "NO_RULE");

        // Output shape sanity
        const sample = lookupTrussStyle({ model: "T150", wind: "basic", widthIn: 100, sections: 4 });
        assert("ALLOWED returns kind + styles array",
            sample.kind === "ALLOWED" && Array.isArray(sample.styles),
            true);
        assert("ALLOWED styles are strings",
            sample.styles.every(s => typeof s === "string"),
            true);

        // Opt-in invariant: a non-opt-in interval should NEVER return HatTruss
        // or U-series codes.
        const nonOptInSample = lookupTrussStyle({ model: "T150", wind: "basic", widthIn: 100, sections: 4 });
        const optInOptions = TRUSS_STYLE_OPT_IN_CODES.map(c => TRUSS_STYLE_CODE_TO_OPTION[c]);
        const leaked = nonOptInSample.styles.filter(s => optInOptions.includes(s));
        assert("Non-opt-in interval doesn't leak HatTruss/U-series", leaked, []);

        // Section auto-exclude invariant: sections=4 must never return *GT5* codes
        const lte5Sample = lookupTrussStyle({ model: "T150", wind: "basic", widthIn: 100, sections: 4 });
        const gt5Leaks = lte5Sample.styles.filter(s => {
            const code = Object.keys(TRUSS_STYLE_CODE_TO_OPTION).find(c => TRUSS_STYLE_CODE_TO_OPTION[c] === s);
            return code && code.includes("GT5");
        });
        assert("sections=4 strips *GT5* codes", gt5Leaks, []);

        // Section auto-exclude invariant: sections=8 must never return *LTE5* codes
        const gt5Sample = lookupTrussStyle({ model: "T150", wind: "basic", widthIn: 100, sections: 8 });
        const lte5Leaks = gt5Sample.styles.filter(s => {
            const code = Object.keys(TRUSS_STYLE_CODE_TO_OPTION).find(c => TRUSS_STYLE_CODE_TO_OPTION[c] === s);
            return code && code.includes("LTE5");
        });
        assert("sections=8 strips *LTE5* codes", lte5Leaks, []);
    }

    /* -----------------------------------------------------------------
       DOM-integration tests (only if configurator DOM is present).
       ----------------------------------------------------------------- */
    function runDomIntegrationTests() {
        if (typeof $ !== "function" || $("#configurator").length === 0 || typeof runTrussStyleLogic !== "function") {
            console.log("(skipping DOM integration — #configurator or runTrussStyleLogic not present)");
            return;
        }

        setRadio("DOOR_MODEL", "T150");
        setRadio("WindLoad", "basic");

        const $size = $("input[name='SIZE']");
        if ($size.length) {
            setRadio("SIZE", "0");
            runTrussStyleLogic();
            assert("Preset SIZE=0 + T150/basic → #TRUSS_STYLE has options",
                $("#TRUSS_STYLE").children("option").length > 0, true);

            setRadio("SIZE", "1");
            runTrussStyleLogic();
            assert("Preset SIZE=1 + T150/basic → #TRUSS_STYLE has options",
                $("#TRUSS_STYLE").children("option").length > 0, true);
        }

        if ($("#custom_dimensions").length) {
            $("#custom_dimensions").prop("checked", true).trigger("change");
            $("#CUSTOM_WIDTH_FEET").val("20").trigger("change");
            $("#CUSTOM_WIDTH_INCHES").val("0").trigger("change");
            runTrussStyleLogic();
            assert("Custom 20'0\" + T150/basic → #TRUSS_STYLE has options",
                $("#TRUSS_STYLE").children("option").length > 0, true);

            setRadio("WindLoad", "20psf");
            $("#CUSTOM_WIDTH_FEET").val("23").trigger("change");
            $("#CUSTOM_WIDTH_INCHES").val("0").trigger("change");
            runTrussStyleLogic();
            const $opts = $("#TRUSS_STYLE").children("option");
            const isDisabled = $opts.length === 1 && $opts.first().is(":disabled");
            assert("Custom 23'0\" + T150/20psf → EXCEEDS message shown", isDisabled, true);

            $("#custom_dimensions").prop("checked", false).trigger("change");
        }
    }

    function runTrussTests() {
        results.length = 0;
        failedDetails = [];
        console.log("%c=== Truss style logic — exhaustive test ===", "color: #06f; font-weight: bold");

        if (typeof lookupTrussStyle !== "function" || typeof TRUSS_STYLE_RULES === "undefined") {
            console.error("Required globals not defined — load truss_style_logic.js first.");
            summarize();
            return;
        }

        console.log("Running interval coverage tests across all rules...");
        runIntervalTests();

        console.log("Running sentinel & invariant tests...");
        runSentinelTests();

        console.log("Running DOM-integration tests...");
        runDomIntegrationTests();

        summarize();
    }
})();
