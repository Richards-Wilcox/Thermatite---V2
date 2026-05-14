// Run in browser console or Node.js: copy-paste or: node test_constraints.js

(function testConstraints() {
  const MODEL_WIDTH_LIMITS = {
    "2": {
      "T150":    { min: 4, max: 24 },
      "T175":    { min: 4, max: 19 },
      "T200":    { min: 4, max: 19 },
      "T300":    { min: 4, max: 19 },
      "T200-20": { min: 4, max: 19 },
      "T200C":   { min: 4, max: 20 },
      "U200C":   { min: 4, max: 20 },
      "T150U":   { min: 4, max: 20 },
      "T175U":   { min: 4, max: 20 },
      "T200U":   { min: 4, max: 20 },
    },
    "3": {
      "T150":    { min: 4, max: 24 },
      "T175":    { min: 4, max: 38 },
      "T200":    { min: 4, max: 38 },
      "T300":    { min: 4, max: 38 },
      "T200-20": { min: 4, max: 38 },
      "T200C":   { min: 4, max: 32 },
      "U200C":   { min: 4, max: 32 },
      "T150U":   { min: 4, max: 20 },
      "T175U":   { min: 4, max: 38 },
      "T200U":   { min: 4, max: 38 },
    },
    "hw_only_2": {
      "T150":    { min: 4, max: 24 },
      "T175":    { min: 4, max: 20 },
      "T200":    { min: 4, max: 20 },
      "T300":    { min: 4, max: 20 },
      "T200-20": { min: 4, max: 20 },
      "T200C":   { min: 4, max: 20 },
      "U200C":   { min: 4, max: 20 },
      "T150U":   { min: 4, max: 20 },
      "T175U":   { min: 4, max: 20 },
      "T200U":   { min: 4, max: 20 },
    },
  };

  const MODEL_HEIGHT_LIMITS = {
    "complete_2": {
      "T150":    { min: 4, max: 16 },
      "T175":    { min: 4, max: 18 },
      "T200":    { min: 4, max: 18 },
      "T300":    { min: 4, max: 18 },
      "T200-20": { min: 4, max: 18 },
      "T200C":   { min: 4, max: 18 },
      "T150U":   { min: 4, max: 18 },
      "T175U":   { min: 4, max: 18 },
      "T200U":   { min: 4, max: 18 },
      "U200C":   { min: 4, max: 18 },
    },
    "complete_3": {
      "T150":    { min: 4, max: 18 },
      "T175":    { min: 4, max: 32 },
      "T200":    { min: 4, max: 32 },
      "T300":    { min: 4, max: 32 },
      "T200-20": { min: 4, max: 32 },
      "T200C":   { min: 4, max: 32 },
      "T150U":   { min: 4, max: 18 },
      "T175U":   { min: 4, max: 22 },
      "T200U":   { min: 4, max: 22 },
      "U200C":   { min: 4, max: 22 },
    },
    "face_2": {
      "T150":    { min: 4, max: 16 },
      "T175":    { min: 4, max: 18 },
      "T200":    { min: 4, max: 18 },
      "T300":    { min: 4, max: 18 },
      "T200-20": { min: 4, max: 18 },
      "T200C":   { min: 4, max: 18 },
      "T150U":   { min: 4, max: 18 },
      "T175U":   { min: 4, max: 18 },
      "T200U":   { min: 4, max: 18 },
      "U200C":   { min: 4, max: 18 },
    },
    "face_3": {
      "T150":    { min: 4, max: 18 },
      "T175":    { min: 4, max: 32 },
      "T200":    { min: 4, max: 32 },
      "T300":    { min: 4, max: 32 },
      "T200-20": { min: 4, max: 32 },
      "T200C":   { min: 4, max: 32 },
      "T150U":   { min: 4, max: 18 },
      "T175U":   { min: 4, max: 22 },
      "T200U":   { min: 4, max: 22 },
      "U200C":   { min: 4, max: 22 },
    },
    "hw_2": {
      "T150":    { min: 4, max: 16 },
      "T175":    { min: 4, max: 16 },
      "T200":    { min: 4, max: 16 },
      "T300":    { min: 4, max: 16 },
      "T200-20": { min: 4, max: 16 },
      "T200C":   { min: 4, max: 16 },
      "T150U":   { min: 4, max: 16 },
      "T175U":   { min: 4, max: 16 },
      "T200U":   { min: 4, max: 16 },
      "U200C":   { min: 4, max: 16 },
    },
    "hw_3": {
      "T150":    { min: 4, max: 18 },
      "T175":    { min: 4, max: 32 },
      "T200":    { min: 4, max: 32 },
      "T300":    { min: 4, max: 32 },
      "T200-20": { min: 4, max: 32 },
      "T200C":   { min: 4, max: 32 },
      "T150U":   { min: 4, max: 18 },
      "T175U":   { min: 4, max: 22 },
      "T200U":   { min: 4, max: 22 },
      "U200C":   { min: 4, max: 22 },
    },
  };

  function getWidthMax(model, hwSize, doorOptions) {
    let effectiveKey;
    if (doorOptions === "1") {
      effectiveKey = "3";
    } else if (doorOptions === "2" && hwSize === "2") {
      effectiveKey = "hw_only_2";
    } else {
      effectiveKey = hwSize;
    }
    const hwLimits = MODEL_WIDTH_LIMITS[effectiveKey] ?? MODEL_WIDTH_LIMITS["2"];
    return (hwLimits[model] ?? { max: 22 }).max;
  }

  function getHeightMax(model, hwSize, doorOptions) {
    const keyMap = {
      "0": { "2": "complete_2", "3": "complete_3" },
      "1": { "2": "face_2",     "3": "face_3"     },
      "2": { "2": "hw_2",       "3": "hw_3"        },
    };
    const effectiveKey = keyMap[doorOptions]?.[hwSize] ?? "complete_2";
    const hwLimits = MODEL_HEIGHT_LIMITS[effectiveKey] ?? MODEL_HEIGHT_LIMITS["complete_2"];
    const limits = hwLimits[model] ?? { max: 16 };
    return limits === null ? 30 : limits.max;
  }

  // Expected values from Excel tables
  // [doorOptions, hwSize, model, expectedWidth, expectedHeight]
  const cases = [
    // Screenshot 1: DOOR_OPTIONS=0 (complete), HW_SIZE=2
    ["0", "2", "T150",    24, 16],
    ["0", "2", "T175",    19, 18],
    ["0", "2", "T200",    19, 18],
    ["0", "2", "T300",    19, 18],
    ["0", "2", "T200-20", 19, 18],
    ["0", "2", "T200C",   20, 18],
    ["0", "2", "T150U",   20, 18],
    ["0", "2", "T175U",   20, 18],
    ["0", "2", "T200U",   20, 18],
    ["0", "2", "U200C",   20, 18],
    // Screenshot 1: DOOR_OPTIONS=0 (complete), HW_SIZE=3
    ["0", "3", "T150",    24, 18],
    ["0", "3", "T175",    38, 32],
    ["0", "3", "T200",    38, 32],
    ["0", "3", "T300",    38, 32],
    ["0", "3", "T200-20", 38, 32],
    ["0", "3", "T200C",   32, 32],
    ["0", "3", "T150U",   20, 18],
    ["0", "3", "T175U",   38, 22],
    ["0", "3", "T200U",   38, 22],
    ["0", "3", "U200C",   32, 22],
    // Screenshot 2: DOOR_OPTIONS=1 (face only), HW_SIZE=2 — width always uses "3" key
    ["1", "2", "T150",    24, 16],
    ["1", "2", "T175",    38, 18],
    ["1", "2", "T200",    38, 18],
    ["1", "2", "T300",    38, 18],
    ["1", "2", "T200-20", 38, 18],
    ["1", "2", "T200C",   32, 18],
    ["1", "2", "T150U",   20, 18],
    ["1", "2", "T175U",   38, 18],
    ["1", "2", "T200U",   38, 18],
    ["1", "2", "U200C",   32, 18],
    // Screenshot 2: DOOR_OPTIONS=1 (face only), HW_SIZE=3
    ["1", "3", "T150",    24, 18],
    ["1", "3", "T175",    38, 32],
    ["1", "3", "T200",    38, 32],
    ["1", "3", "T300",    38, 32],
    ["1", "3", "T200-20", 38, 32],
    ["1", "3", "T200C",   32, 32],
    ["1", "3", "T150U",   20, 18],
    ["1", "3", "T175U",   38, 22],
    ["1", "3", "T200U",   38, 22],
    ["1", "3", "U200C",   32, 22],
    // Screenshot 3: DOOR_OPTIONS=2 (hw only), HW_SIZE=2
    ["2", "2", "T150",    24, 16],
    ["2", "2", "T175",    20, 16],
    ["2", "2", "T200",    20, 16],
    ["2", "2", "T300",    20, 16],
    ["2", "2", "T200-20", 20, 16],
    ["2", "2", "T200C",   20, 16],
    ["2", "2", "T150U",   20, 16],
    ["2", "2", "T175U",   20, 16],
    ["2", "2", "T200U",   20, 16],
    ["2", "2", "U200C",   20, 16],
    // Screenshot 3: DOOR_OPTIONS=2 (hw only), HW_SIZE=3
    ["2", "3", "T150",    24, 18],
    ["2", "3", "T175",    38, 32],
    ["2", "3", "T200",    38, 32],
    ["2", "3", "T300",    38, 32],
    ["2", "3", "T200-20", 38, 32],
    ["2", "3", "T200C",   32, 32],
    ["2", "3", "T150U",   20, 18],
    ["2", "3", "T175U",   38, 22],
    ["2", "3", "T200U",   38, 22],
    ["2", "3", "U200C",   32, 22],
  ];

  const doorOptionsLabel = { "0": "complete", "1": "face", "2": "hw_only" };
  let passed = 0;
  let failed = 0;

  for (const [doorOptions, hwSize, model, expectedW, expectedH] of cases) {
    const gotW = getWidthMax(model, hwSize, doorOptions);
    const gotH = getHeightMax(model, hwSize, doorOptions);
    const label = `[${doorOptionsLabel[doorOptions]}, HW_SIZE=${hwSize}, ${model}]`;

    if (gotW !== expectedW) {
      console.error(`FAIL ${label} width: expected ${expectedW}, got ${gotW}`);
      failed++;
    } else {
      passed++;
    }

    if (gotH !== expectedH) {
      console.error(`FAIL ${label} height: expected ${expectedH}, got ${gotH}`);
      failed++;
    } else {
      passed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed === 0) console.log("All tests passed.");
})();
