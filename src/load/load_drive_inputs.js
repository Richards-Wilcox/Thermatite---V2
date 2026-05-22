/* =========================================================================
   Thermatite — load_drive_inputs.js
   =========================================================================
   Drives input constraints, dependent visibility, and dimension limits for
   the configurator form built in load_html.js. Search by the [TAGS] below.

   DATA TABLES
     [WIDTH-LIMITS]       MODEL_WIDTH_LIMITS — per-model min/max width feet
                          + maxInches caps, keyed by hardware size and door
                          option (face-only / hw-only). Variants:
                            "2", "3"                — full door, hw size 2 / 3
                            "face_only_2", "face_only_3"
                            "hw_only_2",   "hw_only_3"
     [HEIGHT-LIMITS]      MODEL_HEIGHT_LIMITS — per-model min/max height feet,
                          keyed by door-option + hw-size composite key:
                            "complete_2", "complete_3"
                            "face_2",     "face_3"
                            "hw_2",       "hw_3"

   SELECTION READERS
     [GET-SELECTIONS]     getSelections() — current DOOR_MODEL / HARDWARE_SIZE
                          / DOOR_OPTIONS values from the form

   CONSTRAINT APPLIERS (regenerate <select> options based on current model/hw)
     [WIDTH-CONSTRAINT]   applyWidthConstraint(model, hwSize, doorOpts)
                            - rebuilds #CUSTOM_WIDTH_FEET / #CUSTOM_WIDTH_INCHES
                            - clamps current values into the new range
                            - honors maxInchesThreshold + inchExceptions
     [HEIGHT-CONSTRAINT]  applyHeightConstraint(model, hwSize, doorOpts)
                            - same logic for #CUSTOM_HEIGHT_FEET / _INCHES
     [APPLY-ALL]          applyConstraints(model, hwSize, doorOpts)
                            - convenience wrapper for both width + height

   DRIVEN-INPUT WIRING (called once from load_html.js → loadDrivenInputEvents)
     [HIGHLIFT-LAYOUT]    HIGHLIFT_LAYOUT visibility (when LIFT_TYPE === HL)
     [HIGHLIFT-VALUE]     HIGHLIFT_VALUE node mirrors HIGHLIFT
     [HEADROOM-VALUE]     HEADROOM_VALUE = HIGHLIFT + 9
     [COLOR-NODE]         COLOR node — reads selected swatch attrs
     [FRAME-COLOR]        FRAME_COLOR / INSERT_COLOR placeholder nodes
     [MIXED-PANEL]        Show .mixed-panel for DOOR_MODEL = D and width >= 96
     [NUM-OF-SEC-NODE]    NUM_OF_SEC node — section count tied to height,
                          customSwitch, and HARDWARE_SIZE (2 forces 2)
     [FINISH-VIS]         Show/hide .finish-stucco for FACE in F/V/T
     [SPRING-TYPE]        SPRINGTYPE — disable Extension for hardware A/C
     [SPRING-CYCLE]       SPRINGCYCLE — disable 10K for hardware Y, force 20K
     [INITIAL-APPLY]      First applyConstraints() on page load
     [CHANGE-HOOKS]       Re-apply constraints on DOOR_MODEL / HARDWARE_SIZE /
                          DOOR_OPTIONS / CUSTOM_HEIGHT_FEET / CUSTOM_WIDTH_FEET
                          (height + width hooks are re-entrancy guarded)
     [LIFT-TYPE-LOGIC]    LIFT_TYPE — show/hide .lift-option entries based on
                          HARDWARE_SET, SPRINGTYPE, INCLINEDTRACK
   ========================================================================= */

// [WIDTH-LIMITS]
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

// [HEIGHT-LIMITS]
// Rule: 32' max for all models except T150 (16/18) and T150U (18/22).
const MODEL_HEIGHT_LIMITS = {
  "complete_2": {
    "T150":    { min: 4, max: 16 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 32 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
  "complete_3": {
    "T150":    { min: 4, max: 18 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 32 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
  "face_2": {
    "T150":    { min: 4, max: 16 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 18 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
  "face_3": {
    "T150":    { min: 4, max: 18 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 22 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
  "hw_2": {
    "T150":    { min: 4, max: 16 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 18 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
  "hw_3": {
    "T150":    { min: 4, max: 18 },
    "T175":    { min: 4, max: 32 },
    "T200":    { min: 4, max: 32 },
    "T300":    { min: 4, max: 32 },
    "T200-20": { min: 4, max: 32 },
    "T200C":   { min: 4, max: 32 },
    "T150U":   { min: 4, max: 22 },
    "T175U":   { min: 4, max: 32 },
    "T200U":   { min: 4, max: 32 },
    "U200C":   { min: 4, max: 32 },
  },
};

// [GET-SELECTIONS]
function getSelections() {
  return {
    model:    $("input[name='DOOR_MODEL']:checked").val(),
    hwSize:   $("input[name='HARDWARE_SIZE']:checked").val(),
    doorOpts: $("input[name='DOOR_OPTIONS']:checked").val(),
  };
}

// [WIDTH-CONSTRAINT]
function applyWidthConstraint(model, hwSize, doorOptions) {
  let effectiveKey;
  if (doorOptions === "1" && hwSize === "2") {
    effectiveKey = "face_only_2";
  } else if (doorOptions === "1" && hwSize === "3") {
    effectiveKey = "face_only_3";
  } else if (doorOptions === "1") {
    effectiveKey = "3";
  } else if (doorOptions === "2" && hwSize === "2") {
    effectiveKey = "hw_only_2";
  } else if (doorOptions === "2" && hwSize === "3") {
    effectiveKey = "hw_only_3";
  } else {
    effectiveKey = hwSize;
  }
  const hwLimits = MODEL_WIDTH_LIMITS[effectiveKey] ?? MODEL_WIDTH_LIMITS["2"];
  const limits = hwLimits[model] ?? { min: 4, max: 22 };
  const $w = $("#CUSTOM_WIDTH_FEET");
  const $wi = $("#CUSTOM_WIDTH_INCHES");

  const curFt = parseInt($w.val());
  const clampedFt = isNaN(curFt) || curFt < limits.min ? limits.min : curFt > limits.max ? limits.max : curFt;
  $w.attr("min", limits.min).attr("max", limits.max);
  const ftRangeChanged = $w.children().length !== (limits.max - limits.min + 1)
    || parseInt($w.children().first().val()) !== limits.min
    || parseInt($w.children().last().val()) !== limits.max;
  if (ftRangeChanged) {
    $w.empty();
    for (let v = limits.min; v <= limits.max; v++) {
      $w.append(`<option value="${v}"${v === clampedFt ? " selected" : ""}>${v}</option>`);
    }
  }
  if (clampedFt !== curFt) {
    $w.val(clampedFt).trigger("change");
  }

  const inchThreshold = limits.maxInchesThreshold ?? limits.max;
  const maxIn = limits.inchExceptions?.[clampedFt] !== undefined
    ? limits.inchExceptions[clampedFt]
    : (clampedFt >= inchThreshold ? (limits.maxInches ?? 11) : 11);
  const curIn = parseInt($wi.val());
  const clampedIn = !isNaN(curIn) && curIn <= maxIn ? curIn : maxIn;
  const inRangeChanged = $wi.children().length !== (maxIn + 1);
  if (inRangeChanged) {
    $wi.empty();
    for (let v = 0; v <= maxIn; v++) {
      $wi.append(`<option value="${v}"${v === clampedIn ? " selected" : ""}>${v}</option>`);
    }
  }
  if (clampedIn !== curIn) {
    $wi.val(clampedIn).trigger("change");
  }
}

// [HEIGHT-CONSTRAINT]
function applyHeightConstraint(model, hwSize, doorOptions) {
  const keyMap = {
    "0": { "2": "complete_2", "3": "complete_3" },
    "1": { "2": "face_2",     "3": "face_3"     },
    "2": { "2": "hw_2",       "3": "hw_3"        },
  };
  const effectiveKey = keyMap[doorOptions]?.[hwSize] ?? "complete_2";
  const hwLimits = MODEL_HEIGHT_LIMITS[effectiveKey] ?? MODEL_HEIGHT_LIMITS["complete_2"];
  const limits = hwLimits[model] ?? { min: 4, max: 16 };
  const $h = $("#CUSTOM_HEIGHT_FEET");
  const $hi = $("#CUSTOM_HEIGHT_INCHES");
  if (!limits) return;

  const cur = parseInt($h.val());
  const clamped = isNaN(cur) || cur < limits.min ? limits.min : cur > limits.max ? limits.max : cur;
  $h.attr("min", limits.min).attr("max", limits.max);
  const ftRangeChanged = $h.children().length !== (limits.max - limits.min + 1)
    || parseInt($h.children().first().val()) !== limits.min
    || parseInt($h.children().last().val()) !== limits.max;
  if (ftRangeChanged) {
    $h.empty();
    for (let v = limits.min; v <= limits.max; v++) {
      $h.append(`<option value="${v}"${v === clamped ? " selected" : ""}>${v}</option>`);
    }
  }
  if (clamped !== cur) {
    $h.val(clamped).trigger("change");
  }

  const inchThreshold = limits.maxInchesThreshold ?? limits.max;
  const maxIn = limits.inchExceptions?.[clamped] !== undefined
    ? limits.inchExceptions[clamped]
    : (clamped >= inchThreshold ? (limits.maxInches ?? 11) : 11);
  const curIn = parseInt($hi.val());
  const clampedIn = !isNaN(curIn) && curIn <= maxIn ? curIn : maxIn;
  const inRangeChanged = $hi.children().length !== (maxIn + 1);
  if (inRangeChanged) {
    $hi.empty();
    for (let v = 0; v <= maxIn; v++) {
      $hi.append(`<option value="${v}"${v === clampedIn ? " selected" : ""}>${v}</option>`);
    }
  }
  if (clampedIn !== curIn) {
    $hi.val(clampedIn).trigger("change");
  }
}

// [APPLY-ALL]
function applyConstraints(model, hwSize, doorOpts) {
  applyWidthConstraint(model, hwSize, doorOpts);
  applyHeightConstraint(model, hwSize, doorOpts);
}

function loadDrivenInputEvents() {
  // [HIGHLIFT-LAYOUT]
  if ($("#HIGHLIFT_LAYOUT")[0]) {
    createNode(
      "HIGHLIFT_LAYOUT",
      function () {
        this.setVisibility(getState("LIFT_TYPE") === 'High_Lift')
      },
      "",
      $("#HIGHLIFT_LAYOUT")[0],
      ["LIFT_TYPE"])
  }

  // [HIGHLIFT-CLEARANCE-VIS] Show HIGHLIFT (in) and CLEARANCE only when LIFT_TYPE === High_Lift.
  // Clearance options: High_Lift → [HighLift, HeadRoom]; everything else → [None].
  // Also shows Custom LHR Setup toggle when LIFT_TYPE === LHR_Vertical_Lift.
  function applyHighLiftControlsVisibility() {
    const liftType = $("#LIFT_TYPE").val();
    const isHL = liftType === "High_Lift";
    const isLHRVL = liftType === "LHR_Vertical_Lift";
    $("#HIGHLIFT_ROW").css("display", isHL ? "flex" : "none");
    $("#CUSTOM_LHR_ROW").css("display", isLHRVL ? "flex" : "none");
    const $cl = $("#CLEARANCE");
    if (!$cl.length) return;
    const allowed = isHL ? ["HighLift", "HeadRoom"] : ["None"];
    $cl.find("option").each(function () {
      const ok = allowed.includes(this.value);
      $(this).toggle(ok).prop("disabled", !ok);
    });
    if (!allowed.includes($cl.val())) $cl.val(allowed[0]);
  }
  $(document).on("change", "#LIFT_TYPE", applyHighLiftControlsVisibility);
  applyHighLiftControlsVisibility();
  setTimeout(applyHighLiftControlsVisibility, 0);
  setTimeout(applyHighLiftControlsVisibility, 250);

  // [HIGHLIFT-VALUE]
  addLogic("HIGHLIFT_VALUE", function () {
    this.value = getState("HIGHLIFT")
  }, ["HIGHLIFT"])

  // [HEADROOM-VALUE]
  addLogic("HEADROOM_VALUE", function () {
    this.value = parseInt(getState("HIGHLIFT")) + 9;
  }, ["HIGHLIFT"])

  // [COLOR-NODE]
  addNode({
    id: "COLOR",
    value: "",
    logic: function () {
      const color = $(".color-button-container.selected input[type='radio']");
      this.value = {
        value: color.attr("value"),
        hex: color.attr("hex"),
        desc: color.attr("desc"),
        colorName: color.attr("colorName")
      };
    }
  }, [""])

	// [FRAME-COLOR]
	addNode({
		id: "FRAME_COLOR",
		value: null,
	}, []);

	addNode({
		id: "INSERT_COLOR",
		value: null,
	}, []);

  // [MIXED-PANEL]
  addLogic("MIXED", function () {
    if (getState("DOOR_MODEL") === "D" && (nodeset["WIDTH"]?.value ?? 0) >= 96) {
      $(".mixed-panel").show();
    } else $(".mixed-panel").hide();
  }, ["DOOR_MODEL", "WIDTH"])

  // [NUM-OF-SEC-NODE]
  if ($("#NUM_OF_SEC")[0]) {
    createNode(
      "NUM_OF_SEC",
      function () {
        const $select = $("#NUM_OF_SEC");
        this.value = Number($select.val()) || 4;
      },
      "",
      $("#NUM_OF_SEC")[0],
      ["HEIGHT", "customSwitch", "HARDWARE_SIZE"])
  }

  // [FINISH-VIS]
  addLogic("FINISH", function () {
    const face = nodeset["FACE"]?.value;
    if (face === 'F' || face === 'V' || face === 'T') {
      $(".finish-stucco").show();
    } else $(".finish-stucco").hide();
  }, ["FACE"])

  // [SPRING-TYPE]
  addLogic("SPRINGTYPE", function () {
    let hardware = nodeset["HARDWARE_SET"]?.value;
    if (!hardware) { this.value = $(`input[type="radio"][name="SPRINGTYPE"]:checked`).val(); return; }
    const torsionBtn = $("#TORSION").closest(".rw-sliding-button");
    const extensionBtn = $("#EXTENSION").closest(".rw-sliding-button");
    var labelText = $('input[name="HARDWARE_SET"]:checked').next('label').text();

    if (hardware === "A" || hardware === "C") {
      $("#EXTENSION").prop("disabled", true);
      extensionBtn.addClass("disabled color-tooltip");
      extensionBtn.attr("data-tooltip", `Extension not available for ${labelText} Hardware`);

      if (getState("SPRINGTYPE") === "EXT") {
        $("#TORSION").prop("checked", true).trigger("change");
      }
    } else {
      $("#EXTENSION").prop("disabled", false);
      extensionBtn.removeClass("disabled color-tooltip");
      extensionBtn.removeAttr("data-tooltip");
    }

    this.value = $(`input[type="radio"][name="SPRINGTYPE"]:checked`).val();
  }, ["HARDWARE_SET"]);

  // [SPRING-CYCLE]
  addLogic("SPRINGCYCLE", function () {
    let hardware = nodeset["HARDWARE_SET"]?.value;
    if (!hardware) { this.value = $(`input[type="radio"][name="SPRINGCYCLE"]:checked`).val(); return; }
    const springCycle10k = $("#10K").closest(".rw-sliding-button");
    const springCycle20k = $("#20K").closest(".rw-sliding-button");
    var labelText = $('input[name="HARDWARE_SET"]:checked').next('label').text();

    console.log("hardware", hardware);
    if (hardware === "Y") {
      $("#10K").prop("disabled", true).removeAttr("checked");
      springCycle10k.addClass("disabled color-tooltip").removeClass("btn-checked selected");
      springCycle10k.attr("data-tooltip", `Spring Cycle 10K not available for ${labelText} Hardware`);

      $("#20K").prop("checked", true).attr("checked", "checked");
      springCycle20k.addClass("btn-checked selected");
    } else {
      springCycle10k.prop('disabled', false);
      springCycle20k.prop('disabled', false);

      $("#10K").prop('checked', true).attr("checked", "checked");
      $("#20K").prop('checked', false).removeAttr("checked");

      springCycle10k.addClass('selected btn-checked');
      springCycle20k.removeClass('selected btn-checked');
    }

    this.value = $(`input[type="radio"][name="SPRINGCYCLE"]:checked`).val()
  }, ["HARDWARE_SET"])

  // [INITIAL-APPLY] Apply constraints on initial load
  const initial = getSelections();
  applyConstraints(initial.model, initial.hwSize, initial.doorOpts);

  // [CHANGE-HOOKS] Re-apply constraints whenever model, hw size, or door option changes
  $(document).on("change", "input[name='DOOR_MODEL'], input[name='HARDWARE_SIZE'], input[name='DOOR_OPTIONS']", function () {
    const { model, hwSize, doorOpts } = getSelections();
    applyConstraints(model, hwSize, doorOpts);
    if (this.name === "HARDWARE_SIZE") nodeset["NUM_OF_SEC"]?.update?.();
  });

  let _heightConstraintRunning = false;
  let _heightConstraintTimer = null;
  $(document).on("change", "#CUSTOM_HEIGHT_FEET", function () {
    if (_heightConstraintTimer) clearTimeout(_heightConstraintTimer);
    _heightConstraintTimer = setTimeout(() => {
      _heightConstraintTimer = null;
      if (_heightConstraintRunning) return;
      _heightConstraintRunning = true;
      const { model, hwSize, doorOpts } = getSelections();
      applyHeightConstraint(model, hwSize, doorOpts);
      _heightConstraintRunning = false;
    }, 80);
  });

  let _widthConstraintRunning = false;
  let _widthConstraintTimer = null;
  $(document).on("change", "#CUSTOM_WIDTH_FEET", function () {
    if (_widthConstraintTimer) clearTimeout(_widthConstraintTimer);
    _widthConstraintTimer = setTimeout(() => {
      _widthConstraintTimer = null;
      if (_widthConstraintRunning) return;
      _widthConstraintRunning = true;
      const { model, hwSize, doorOpts } = getSelections();
      applyWidthConstraint(model, hwSize, doorOpts);
      _widthConstraintRunning = false;
    }, 80);
  });

  // [LIFT-TYPE-LOGIC] LIFT_TYPE is a plain <select>; framework binds value natively. No addLogic needed.

  // [TRACK-MOUNT-LOGIC] Filter Track Mount options by (door thickness, HW size, CSBB Door Height, No Lap Steel Jamb).
  // Thickness mapping: 150 = T150/T150U, 175 = T175/T175U, 200 = T200/T200U/T200-20, 300 = T300, 200C = T200C/U200C.
  // Values: 3A=ADCA_3, 2A=ADCA_2, 3C=CLIP_3, 2C=CLIP_2, B=B, NONE=NONE.
  const TRK_MODEL_THICKNESS = {
    "T150": "150", "T150U": "150",
    "T175": "175", "T175U": "175",
    "T200": "200", "T200U": "200", "T200-20": "200",
    "T300": "300",
    "T200C": "200C", "U200C": "200C",
  };
  // Key: thickness|hwSize|csbb|nolap → allowed Track Mount values.
  // hwSize: 2|3, csbb: no_csbb|csbb_dhlte20ft|csbb_dhgt20, nolap: yes|no.
  const TRK_MOUNT_RULES = {
    "150|2|no_csbb|no":         ["ADCA_2", "CLIP_2", "B"],
    "150|3|no_csbb|no":         ["ADCA_3", "ADCA_2", "CLIP_3", "CLIP_2", "B"],
    "150|2|csbb_dhlte20ft|no":  ["ADCA_2"],
    "150|3|csbb_dhlte20ft|no":  ["ADCA_3", "ADCA_2"],
    "150|2|csbb_dhgt20|no":     ["ADCA_2"],
    "150|3|csbb_dhgt20|no":     ["ADCA_3"],
    "150|2|no_csbb|yes":        ["B"],
    "150|3|no_csbb|yes":        ["ADCA_2", "CLIP_2", "B"],
    "150|2|csbb_dhlte20ft|yes": ["NONE"],
    "150|3|csbb_dhlte20ft|yes": ["ADCA_2"],
    "150|2|csbb_dhgt20|yes":    ["ADCA_2", "B"],
    "150|3|csbb_dhgt20|yes":    ["B"],

    "175|2|no_csbb|no":         ["ADCA_2", "CLIP_2", "B"],
    "175|3|no_csbb|no":         ["ADCA_3", "ADCA_2", "CLIP_3", "CLIP_2", "B"],
    "175|2|csbb_dhlte20ft|no":  ["ADCA_2"],
    "175|3|csbb_dhlte20ft|no":  ["ADCA_3", "ADCA_2", "B"],
    "175|2|csbb_dhgt20|no":     ["ADCA_2"],
    "175|3|csbb_dhgt20|no":     ["ADCA_3"],
    "175|2|no_csbb|yes":        ["B"],
    "175|3|no_csbb|yes":        ["ADCA_2", "CLIP_2", "B"],
    "175|2|csbb_dhlte20ft|yes": ["NONE"],
    "175|3|csbb_dhlte20ft|yes": ["ADCA_2"],
    "175|2|csbb_dhgt20|yes":    ["NONE"],
    "175|3|csbb_dhgt20|yes":    ["NONE"],

    "200|2|no_csbb|no":         ["ADCA_2", "CLIP_2", "B"],
    "200|3|no_csbb|no":         ["ADCA_3", "ADCA_2", "CLIP_3", "CLIP_2", "B"],
    "200|2|csbb_dhlte20ft|no":  ["ADCA_2"],
    "200|3|csbb_dhlte20ft|no":  ["ADCA_3", "ADCA_2"],
    "200|2|csbb_dhgt20|no":     ["ADCA_2"],
    "200|3|csbb_dhgt20|no":     ["ADCA_3"],
    "200|2|no_csbb|yes":        ["B"],
    "200|3|no_csbb|yes":        ["ADCA_2", "CLIP_2", "B"],
    "200|2|csbb_dhlte20ft|yes": ["NONE"],
    "200|3|csbb_dhlte20ft|yes": ["ADCA_2"],
    "200|2|csbb_dhgt20|yes":    ["NONE"],
    "200|3|csbb_dhgt20|yes":    ["NONE"],

    "300|2|no_csbb|no":         ["ADCA_2"],
    "300|3|no_csbb|no":         ["ADCA_3"],
    "300|2|csbb_dhlte20ft|no":  ["ADCA_2"],
    "300|3|csbb_dhlte20ft|no":  ["ADCA_3"],
    "300|2|csbb_dhgt20|no":     ["ADCA_2"],
    "300|3|csbb_dhgt20|no":     ["ADCA_3"],
    "300|2|no_csbb|yes":        ["ADCA_2"],
    "300|3|no_csbb|yes":        ["ADCA_2"],
    "300|2|csbb_dhlte20ft|yes": ["NONE"],
    "300|3|csbb_dhlte20ft|yes": ["NONE"],
    "300|2|csbb_dhgt20|yes":    ["NONE"],
    "300|3|csbb_dhgt20|yes":    ["NONE"],

    "200C|2|no_csbb|no":         ["ADCA_2", "CLIP_2", "B"],
    "200C|3|no_csbb|no":         ["ADCA_3", "ADCA_2", "CLIP_3", "CLIP_2", "B"],
    "200C|2|csbb_dhlte20ft|no":  ["ADCA_2"],
    "200C|3|csbb_dhlte20ft|no":  ["ADCA_3", "ADCA_2"],
    "200C|2|csbb_dhgt20|no":     ["ADCA_2"],
    "200C|3|csbb_dhgt20|no":     ["ADCA_3"],
    "200C|2|no_csbb|yes":        ["B"],
    "200C|3|no_csbb|yes":        ["ADCA_2", "CLIP_2", "B"],
    "200C|2|csbb_dhlte20ft|yes": ["NONE"],
    "200C|3|csbb_dhlte20ft|yes": ["ADCA_3", "ADCA_2"],
    "200C|2|csbb_dhgt20|yes":    ["NONE"],
    "200C|3|csbb_dhgt20|yes":    ["NONE"],
  };
  const TRK_MOUNT_LABEL = {
    "ADCA_3": "3 IN ADCA",
    "ADCA_2": "2 IN ADCA",
    "CLIP_3": "3 IN Clip Angle",
    "CLIP_2": "2 IN Clip Angle",
    "B":      "Bracket Mount",
    "NONE":   "None",
  };
  const TRK_MOUNT_HWSET = {
    "ADCA_3": "ADCA3",
    "ADCA_2": "ADCA2",
    "CLIP_3": "CLIP3",
    "CLIP_2": "CLIP2",
    "B":      "BM",
    "NONE":   "NONE",
  };
  function applyTrackMountConstraint() {
    const $sel = $("#TRK_MOUNT_TYP");
    if (!$sel.length) return;
    const model    = $("input[name='DOOR_MODEL']:checked").val();
    const hwSize   = $("input[name='HARDWARE_SIZE']:checked").val();
    const csbbDr   = $("input[name='CSBBDrHgt']:checked").val()    || "no_csbb";
    const noLap    = $("input[name='NoLapSteelJamb']:checked").val() || "no";
    const thickness = TRK_MODEL_THICKNESS[model];
    if (!thickness) return;
    const key = `${thickness}|${hwSize}|${csbbDr}|${noLap}`;
    const allowed = TRK_MOUNT_RULES[key];
    if (!allowed) return;
    const prev = $sel.val();
    $sel[0].innerHTML = allowed.map(v =>
      `<option value="${v}" hwset="${TRK_MOUNT_HWSET[v]}">${TRK_MOUNT_LABEL[v]}</option>`
    ).join("");
    const next = allowed.includes(prev) ? prev : allowed[0];
    $sel.val(next);
    if ($sel.val() !== next) $sel[0].selectedIndex = 0;
  }
  $(document).on("change",
    "input[name='DOOR_MODEL'], input[name='HARDWARE_SIZE'], input[name='CSBBDrHgt'], input[name='NoLapSteelJamb']",
    applyTrackMountConstraint);
  applyTrackMountConstraint();
  setTimeout(applyTrackMountConstraint, 0);
  setTimeout(applyTrackMountConstraint, 250);
  setTimeout(applyTrackMountConstraint, 1000);

  // [LOWER-SPLICE-LOGIC] Lower Splice depends on Lift Type. Track Mount = NONE forces None.
  // Std lifts (12R/16R/LHR_Fr/LHR_Rr) → None only. High Lift / VL / LHR_VL → UWA + UBM.
  const LOWER_SPLICE_LABEL = {
    "NONE":                "None",
    "UPPER_WALL_ANGLE":    "With Upper Wall Angle",
    "UPPER_BRACKET_MOUNT": "With Upper Bracket Mount",
  };
  const LIFT_TYPES_STD = ["Std_Lift_12R", "Std_Lift_16R", "LHR_Fr_Mnt", "LHR_Rr_Mnt"];
  function applyLowerSpliceConstraint() {
    const $sel = $("#LOWER_SPLICE");
    if (!$sel.length) return;
    const trkMount = $("#TRK_MOUNT_TYP").val();
    const liftType = $("#LIFT_TYPE").val();
    const allowed = trkMount === "NONE" || LIFT_TYPES_STD.includes(liftType)
      ? ["NONE"]
      : ["UPPER_WALL_ANGLE", "UPPER_BRACKET_MOUNT"];
    const prev = $sel.val();
    $sel[0].innerHTML = allowed.map(v => `<option value="${v}">${LOWER_SPLICE_LABEL[v]}</option>`).join("");
    const next = allowed.includes(prev) ? prev : allowed[0];
    $sel.val(next);
    if ($sel.val() !== next) $sel[0].selectedIndex = 0;
  }
  $(document).on("change", "#TRK_MOUNT_TYP, #LIFT_TYPE", applyLowerSpliceConstraint);
  applyLowerSpliceConstraint();
  setTimeout(applyLowerSpliceConstraint, 0);
  setTimeout(applyLowerSpliceConstraint, 250);
  setTimeout(applyLowerSpliceConstraint, 1000);

  // [INCLINED-TRACK-LOGIC] Yes/No toggle reveals the Degree-or-No-Slope picker.
  // For LHR_Fr/LHR_Rr/VL/LHR_VL lift types, degree values are disabled — only No Slope remains.
  const LIFT_TYPES_NO_DEGREES = ["LHR_Fr_Mnt", "LHR_Rr_Mnt", "Vertical_Lift", "LHR_Vertical_Lift"];
  function applyInclinedTrackConstraint() {
    const $details = $("#INCLINED_TRACK_DETAILS");
    if (!$details.length) return;
    const isYes = $("#INCLINED_TRACK_YES").is(":checked");
    $details.css("display", isYes ? "flex" : "none");
    const $sel = $("#INCLINED_TRACK_VALUE");
    const blockDegrees = LIFT_TYPES_NO_DEGREES.includes($("#LIFT_TYPE").val());
    $sel.find("option").each(function () {
      if (this.value === "no_slope") return;
      $(this).prop("disabled", blockDegrees).toggle(!blockDegrees);
    });
    if (blockDegrees && $sel.val() !== "no_slope") $sel.val("no_slope");
    // Mirror state to the legacy InclinedTrack hidden input for host config.
    const v = $sel.val();
    const hidden = !isYes || v === "no_slope" ? "none" : "degrees";
    $("#INCLINED_TRACK_HIDDEN").val(hidden);
  }
  $(document).on("change", "#LIFT_TYPE, input[name='InclinedTrackOn'], #INCLINED_TRACK_VALUE", applyInclinedTrackConstraint);
  applyInclinedTrackConstraint();
  setTimeout(applyInclinedTrackConstraint, 0);
  setTimeout(applyInclinedTrackConstraint, 250);

  // [12GA-HINGES-LOGIC] Double End Caps forces 12 Gauge Hinges to Yes and disables No button.
  function apply12GaHingesConstraint() {
    const isDouble = $("input[name='EndCaps']:checked").val() === "1";
    const $yes = $("#HINGES_12GA_0");
    const $no = $("#HINGES_12GA_1");
    const $noBtn = $("#HINGES_12GA_1").closest(".rw-sliding-button");

    if (isDouble) {
      $yes.prop("checked", true);
      $no.prop("checked", false).prop("disabled", true);
      $noBtn.addClass("disabled");
    } else {
      $no.prop("disabled", false);
      $noBtn.removeClass("disabled");
    }
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("Hinges12Gauge");
  }

  $(document).on("change", "input[name='EndCaps']", apply12GaHingesConstraint);
  apply12GaHingesConstraint();

  // [ROLLER-STYLE-LOGIC]
  // HW Size 2: Steel, Nylon, Nylon w/ sealed bearing
  // HW Size 3: Steel, UHMW W/Sealed bearing, Nylon w/ stainless stem and sealed bearing
  const ROLLER_HW2 = ["Steel", "Nylon", "Nylon w/ sealed bearing"];
  const ROLLER_HW3 = ["Steel", "UHMW W/Sealed bearing", "Nylon w/ stainless stem and sealed bearing"];

  function applyRollerStyleConstraint() {
    const hwSize = $("input[name='HARDWARE_SIZE']:checked").val();
    const allowed = hwSize === "3" ? ROLLER_HW3 : ROLLER_HW2;

    $("input[name='RollerStyle']").each(function () {
      const $btn = $(this).closest(".rw-button");
      const ok = allowed.includes(this.value);
      $btn.toggle(ok);
      $(this).prop("disabled", !ok);
    });

    const $checked = $("input[name='RollerStyle']:checked");
    if (!$checked.length || !allowed.includes($checked.val())) {
      $("input[name='RollerStyle']").prop("checked", false);
      $("input[name='RollerStyle'][value='Steel']").prop("checked", true);
      $("input[name='RollerStyle']").closest(".rw-button").removeClass("btn-checked");
      $("input[name='RollerStyle'][value='Steel']").closest(".rw-button").addClass("btn-checked");
    }
  }

  $(document).on("change", "input[name='HARDWARE_SIZE']", applyRollerStyleConstraint);
  applyRollerStyleConstraint();

  // [EXHAUST-PORT-LOGIC] Size and Latched only apply when a position is selected.
  function applyExhaustPortConstraint() {
    const isNone = $("input[name='ExhaustPortView']:checked").val() === "none";
    $("#EXHAUST_PORT_DETAILS_WRAP").css("display", isNone ? "none" : "flex");
    if (isNone) {
      $("input[name='ExhaustPortSize']").prop("checked", false);
      $("#EXHAUST_PORT_SIZE_0").prop("checked", true);
      $("#EXHAUST_PORT_LATCHED_NO").prop("checked", true);
      $("#EXHAUST_PORT_LATCHED_YES").prop("checked", false);
      if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("ExhaustPortLatched");
    }
  }

  $(document).on("change", "input[name='ExhaustPortView']", applyExhaustPortConstraint);
  applyExhaustPortConstraint();

  // [EXHAUST-PORT-SIZE-LATCHED] Latched is forced based on selected Size:
  //   sizes 0, 3, 4 → Latched = No;  size 6 → Latched = Yes.
  // The Latched radios are disabled so the user can't override.
  function applyExhaustPortLatchedConstraint() {
    const size = $("input[name='ExhaustPortSize']:checked").val();
    if (size == null) return;
    const shouldBeYes = size === "6";
    $("#EXHAUST_PORT_LATCHED_YES").prop("checked", shouldBeYes).prop("disabled", true);
    $("#EXHAUST_PORT_LATCHED_NO").prop("checked", !shouldBeYes).prop("disabled", true);
    $("input[name='ExhaustPortLatched']").closest(".rw-sliding-button").addClass("disabled");
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("ExhaustPortLatched");
  }
  $(document).on("change", "input[name='ExhaustPortSize']", applyExhaustPortLatchedConstraint);
  applyExhaustPortLatchedConstraint();

  // [BAR-LATCH-VS-ONE-POINT] If One Point Latch = Yes, disable Bar Latch (force No).
  function applyBarLatchOnePointConstraint() {
    const onePointYes = $("input[name='OnePointLatch']:checked").val() === "yes";
    const $yes = $("#BAR_LATCH_YES");
    const $no  = $("#BAR_LATCH_NO");
    if (onePointYes) {
      $yes.prop("checked", false).prop("disabled", true);
      $no.prop("checked", true).prop("disabled", true);
      $("input[name='BarLatch']").closest(".rw-sliding-button").addClass("disabled");
    } else {
      $yes.prop("disabled", false);
      $no.prop("disabled", false);
      $("input[name='BarLatch']").closest(".rw-sliding-button").removeClass("disabled");
    }
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("BarLatch");
    // Hide the side selector since Bar Latch was forced to No.
    if (typeof syncBarLatchSideVisibility === "function") syncBarLatchSideVisibility();
  }
  $(document).on("change", "input[name='OnePointLatch']", applyBarLatchOnePointConstraint);
  applyBarLatchOnePointConstraint();

  // [WEATHER-SEAL-LOGIC] JAMB_SEAL options filtered by (color, track mount, model).
  // Source: data/weather_seal/*.csv — 600 (color × mount × model) rows compressed
  // into 12 unique seal-code sets. Options not in the allowed list are hidden
  // (display:none) rather than removed, so they remain available for
  // colors/mounts/models we don't have data for yet.
  // CSV seal code → JAMB_SEAL <option> value:
  const WS_SEAL_TO_VALUE = {
    "None":                   "NONE",
    "ADCAMntJamb":            "ADCA_MOUNT_JWS",
    "EU_ADCA":                "EU_ADCA",
    "AlumBlkVinyl":           "ALUM_BLACK_VINYL",
    "AlumCafeVinyl":          "ALUM_CAFE_VINYL",
    "AlumBrownVinyl":         "ALUM_BROWN_VINYL",
    "AlumCharcoalVinyl":      "ALUM_CHARCOAL_VINYL",
    "AlumBronzeVinyl":        "ALUM_BRONZE_VINYL",
    "AlumCherryVinyl":        "ALUM_CHERRY_VINYL",
    "AlumGoldenOakVinyl":     "ALUM_GOLDEN_OAK_VINYL",
    "AlumDarkOakVinyl":       "ALUM_DARK_OAK_VINYL",
    "AlumWhtVinyl":           "ALUM_WHITE_VINYL",
    "AlumTpeVinyl":           "ALUM_TAUPE_VINYL",
    "AlumAlmVinyl":           "ALUM_ALMOND_VINYL",
    "StlWhtVinyl":            "STEEL_WHITE_VINYL",
    "StlAlmVinyl":            "STEEL_ALMOND_VINYL",
    "StlTpeVinyl":            "STEEL_TAUPE_VINYL",
    "StlBrwnVinyl":           "STEEL_BROWN_VINYL",
    "StlBlkVinyl":            "STEEL_BLACK_VINYL",
    "StlCharCoalVinyl":       "STEEL_CHARCOAL_VINYL",
    "StlBronzeVinyl":         "STEEL_BRONZE_VINYL",
    "HeavyDutyAlumBlacVinyl": "HD_ALUM_BLACK_DUAL_FIN",
  };
  // Pre-map sets at module load to JAMB_SEAL values for O(1) lookup.
  const WS_SET_CODES = [
    [],                                                                                                                                                            // 0 EMPTY -> only NONE
    ["None"],                                                                                                                                                       // 1
    ["None","ADCAMntJamb","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl"], // 2
    ["None","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl"],              // 3
    ["None","ADCAMntJamb","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","StlCharCoalVinyl","StlBronzeVinyl","HeavyDutyAlumBlacVinyl"], // 4
    ["None","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","StlCharCoalVinyl","StlBronzeVinyl"],                                       // 5
    ["None","ADCAMntJamb","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","StlCharCoalVinyl","StlBronzeVinyl"],                       // 6
    ["None","ADCAMntJamb","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","HeavyDutyAlumBlacVinyl"],                                  // 7
    ["None","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","StlCharCoalVinyl","StlBronzeVinyl","HeavyDutyAlumBlacVinyl"],             // 8
    ["None","AlumBlkVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl"],                                                                                                                                                                                                                                                       // 9
    ["None","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl","HeavyDutyAlumBlacVinyl"],                                                // 10
    ["None","EU_ADCA","AlumBlkVinyl","AlumCafeVinyl","AlumBrownVinyl","AlumCharcoalVinyl","AlumBronzeVinyl","AlumCherryVinyl","AlumGoldenOakVinyl","AlumDarkOakVinyl","AlumWhtVinyl","AlumTpeVinyl","AlumAlmVinyl","StlWhtVinyl","StlAlmVinyl","StlTpeVinyl","StlBrwnVinyl","StlBlkVinyl"],                                                               // 11
  ];
  // Set 0 (empty CSV) means no seals — only NONE option visible. Otherwise map codes through.
  const WS_SET_VALUES = WS_SET_CODES.map(codes =>
    codes.length === 0 ? ["NONE"] : codes.map(c => WS_SEAL_TO_VALUE[c]).filter(Boolean)
  );
  // COLOR swatch key → CSV color prefix
  const WS_COLOR_KEY = {
    "white":      "white",
    "brown":      "brown",
    "silver":     "silver",
    "bronze":     "Bronze",
    "slate_grey": "SlateGrey",
    "iron_ore":   "IronOre",
    "black":      "Black",
    "sandstone":  "Sandstone",
    "almond":     "Almond",
    "cafe":       "Cafe",
  };
  // TRK_MOUNT_TYP value → CSV mount suffix
  const WS_MOUNT_KEY = {
    "ADCA_3": "3A",
    "ADCA_2": "2A",
    "CLIP_3": "3C",
    "CLIP_2": "2C",
    "B":      "B",
    "NONE":   "None",
  };
  // (colorPrefix-mount|model) → set index. Generated from data/weather_seal/*.csv.
  const WS_LOOKUP = {
    "Almond-3A|T150":0,"Almond-3A|T175":0,"Almond-3A|T200":0,"Almond-3A|T300":0,"Almond-3A|T200-20":1,"Almond-3A|T200C":1,"Almond-3A|T150U":1,"Almond-3A|T175U":1,"Almond-3A|T200U":1,"Almond-3A|U200C":1,
    "Almond-2A|T150":0,"Almond-2A|T175":0,"Almond-2A|T200":0,"Almond-2A|T300":0,"Almond-2A|T200-20":1,"Almond-2A|T200C":1,"Almond-2A|T150U":1,"Almond-2A|T175U":1,"Almond-2A|T200U":1,"Almond-2A|U200C":1,
    "Almond-3C|T150":2,"Almond-3C|T175":2,"Almond-3C|T200":2,"Almond-3C|T300":2,"Almond-3C|T200-20":1,"Almond-3C|T200C":1,"Almond-3C|T150U":1,"Almond-3C|T175U":1,"Almond-3C|T200U":1,"Almond-3C|U200C":1,
    "Almond-2C|T150":2,"Almond-2C|T175":2,"Almond-2C|T200":2,"Almond-2C|T300":2,"Almond-2C|T200-20":1,"Almond-2C|T200C":1,"Almond-2C|T150U":1,"Almond-2C|T175U":1,"Almond-2C|T200U":1,"Almond-2C|U200C":1,
    "Almond-B|T150":2,"Almond-B|T175":2,"Almond-B|T200":2,"Almond-B|T300":2,"Almond-B|T200-20":1,"Almond-B|T200C":1,"Almond-B|T150U":1,"Almond-B|T175U":1,"Almond-B|T200U":1,"Almond-B|U200C":1,
    "Almond-None|T150":1,"Almond-None|T175":1,"Almond-None|T200":1,"Almond-None|T300":1,"Almond-None|T200-20":1,"Almond-None|T200C":1,"Almond-None|T150U":1,"Almond-None|T175U":1,"Almond-None|T200U":1,"Almond-None|U200C":1,
    "Black-3A|T150":0,"Black-3A|T175":0,"Black-3A|T200":0,"Black-3A|T300":0,"Black-3A|T200-20":1,"Black-3A|T200C":1,"Black-3A|T150U":1,"Black-3A|T175U":1,"Black-3A|T200U":1,"Black-3A|U200C":1,
    "Black-2A|T150":0,"Black-2A|T175":0,"Black-2A|T200":0,"Black-2A|T300":0,"Black-2A|T200-20":1,"Black-2A|T200C":1,"Black-2A|T150U":1,"Black-2A|T175U":1,"Black-2A|T200U":1,"Black-2A|U200C":1,
    "Black-3C|T150":2,"Black-3C|T175":2,"Black-3C|T200":2,"Black-3C|T300":3,"Black-3C|T200-20":1,"Black-3C|T200C":1,"Black-3C|T150U":1,"Black-3C|T175U":1,"Black-3C|T200U":1,"Black-3C|U200C":1,
    "Black-2C|T150":2,"Black-2C|T175":2,"Black-2C|T200":2,"Black-2C|T300":2,"Black-2C|T200-20":1,"Black-2C|T200C":1,"Black-2C|T150U":1,"Black-2C|T175U":1,"Black-2C|T200U":1,"Black-2C|U200C":1,
    "Black-B|T150":4,"Black-B|T175":4,"Black-B|T200":2,"Black-B|T300":2,"Black-B|T200-20":1,"Black-B|T200C":1,"Black-B|T150U":1,"Black-B|T175U":1,"Black-B|T200U":1,"Black-B|U200C":1,
    "Black-None|T150":1,"Black-None|T175":1,"Black-None|T200":1,"Black-None|T300":1,"Black-None|T200-20":1,"Black-None|T200C":1,"Black-None|T150U":1,"Black-None|T175U":1,"Black-None|T200U":1,"Black-None|U200C":1,
    "Bronze-3A|T150":5,"Bronze-3A|T175":5,"Bronze-3A|T200":5,"Bronze-3A|T300":0,"Bronze-3A|T200-20":1,"Bronze-3A|T200C":1,"Bronze-3A|T150U":1,"Bronze-3A|T175U":1,"Bronze-3A|T200U":1,"Bronze-3A|U200C":1,
    "Bronze-2A|T150":5,"Bronze-2A|T175":5,"Bronze-2A|T200":5,"Bronze-2A|T300":0,"Bronze-2A|T200-20":1,"Bronze-2A|T200C":1,"Bronze-2A|T150U":1,"Bronze-2A|T175U":1,"Bronze-2A|T200U":1,"Bronze-2A|U200C":1,
    "Bronze-3C|T150":6,"Bronze-3C|T175":6,"Bronze-3C|T200":6,"Bronze-3C|T300":2,"Bronze-3C|T200-20":1,"Bronze-3C|T200C":1,"Bronze-3C|T150U":1,"Bronze-3C|T175U":1,"Bronze-3C|T200U":1,"Bronze-3C|U200C":1,
    "Bronze-2C|T150":6,"Bronze-2C|T175":6,"Bronze-2C|T200":6,"Bronze-2C|T300":2,"Bronze-2C|T200-20":1,"Bronze-2C|T200C":1,"Bronze-2C|T150U":1,"Bronze-2C|T175U":1,"Bronze-2C|T200U":1,"Bronze-2C|U200C":1,
    "Bronze-B|T150":6,"Bronze-B|T175":6,"Bronze-B|T200":6,"Bronze-B|T300":2,"Bronze-B|T200-20":1,"Bronze-B|T200C":1,"Bronze-B|T150U":1,"Bronze-B|T175U":1,"Bronze-B|T200U":1,"Bronze-B|U200C":1,
    "Bronze-None|T150":1,"Bronze-None|T175":1,"Bronze-None|T200":1,"Bronze-None|T300":1,"Bronze-None|T200-20":1,"Bronze-None|T200C":1,"Bronze-None|T150U":1,"Bronze-None|T175U":1,"Bronze-None|T200U":1,"Bronze-None|U200C":1,
    "brown-3A|T150":7,"brown-3A|T175":7,"brown-3A|T200":0,"brown-3A|T300":0,"brown-3A|T200-20":1,"brown-3A|T200C":1,"brown-3A|T150U":1,"brown-3A|T175U":1,"brown-3A|T200U":1,"brown-3A|U200C":1,
    "brown-2A|T150":7,"brown-2A|T175":7,"brown-2A|T200":0,"brown-2A|T300":0,"brown-2A|T200-20":1,"brown-2A|T200C":1,"brown-2A|T150U":1,"brown-2A|T175U":1,"brown-2A|T200U":1,"brown-2A|U200C":1,
    "brown-3C|T150":7,"brown-3C|T175":7,"brown-3C|T200":7,"brown-3C|T300":7,"brown-3C|T200-20":8,"brown-3C|T200C":1,"brown-3C|T150U":1,"brown-3C|T175U":1,"brown-3C|T200U":1,"brown-3C|U200C":1,
    "brown-2C|T150":7,"brown-2C|T175":7,"brown-2C|T200":7,"brown-2C|T300":7,"brown-2C|T200-20":8,"brown-2C|T200C":1,"brown-2C|T150U":1,"brown-2C|T175U":1,"brown-2C|T200U":1,"brown-2C|U200C":1,
    "brown-B|T150":9,"brown-B|T175":9,"brown-B|T200":9,"brown-B|T300":10,"brown-B|T200-20":9,"brown-B|T200C":1,"brown-B|T150U":1,"brown-B|T175U":1,"brown-B|T200U":1,"brown-B|U200C":1,
    "brown-None|T150":1,"brown-None|T175":1,"brown-None|T200":1,"brown-None|T300":1,"brown-None|T200-20":1,"brown-None|T200C":1,"brown-None|T150U":1,"brown-None|T175U":1,"brown-None|T200U":1,"brown-None|U200C":1,
    "Cafe-3A|T150":0,"Cafe-3A|T175":0,"Cafe-3A|T200":0,"Cafe-3A|T300":0,"Cafe-3A|T200-20":1,"Cafe-3A|T200C":1,"Cafe-3A|T150U":1,"Cafe-3A|T175U":1,"Cafe-3A|T200U":1,"Cafe-3A|U200C":1,
    "Cafe-2A|T150":0,"Cafe-2A|T175":0,"Cafe-2A|T200":0,"Cafe-2A|T300":0,"Cafe-2A|T200-20":1,"Cafe-2A|T200C":1,"Cafe-2A|T150U":1,"Cafe-2A|T175U":1,"Cafe-2A|T200U":1,"Cafe-2A|U200C":1,
    "Cafe-3C|T150":0,"Cafe-3C|T175":0,"Cafe-3C|T200":0,"Cafe-3C|T300":0,"Cafe-3C|T200-20":1,"Cafe-3C|T200C":1,"Cafe-3C|T150U":1,"Cafe-3C|T175U":1,"Cafe-3C|T200U":1,"Cafe-3C|U200C":1,
    "Cafe-2C|T150":0,"Cafe-2C|T175":0,"Cafe-2C|T200":0,"Cafe-2C|T300":0,"Cafe-2C|T200-20":1,"Cafe-2C|T200C":1,"Cafe-2C|T150U":1,"Cafe-2C|T175U":1,"Cafe-2C|T200U":1,"Cafe-2C|U200C":1,
    "Cafe-B|T150":2,"Cafe-B|T175":2,"Cafe-B|T200":2,"Cafe-B|T300":2,"Cafe-B|T200-20":1,"Cafe-B|T200C":1,"Cafe-B|T150U":1,"Cafe-B|T175U":1,"Cafe-B|T200U":1,"Cafe-B|U200C":1,
    "Cafe-None|T150":1,"Cafe-None|T175":1,"Cafe-None|T200":1,"Cafe-None|T300":1,"Cafe-None|T200-20":1,"Cafe-None|T200C":1,"Cafe-None|T150U":1,"Cafe-None|T175U":1,"Cafe-None|T200U":1,"Cafe-None|U200C":1,
    "IronOre-3A|T150":0,"IronOre-3A|T175":0,"IronOre-3A|T200":0,"IronOre-3A|T300":0,"IronOre-3A|T200-20":1,"IronOre-3A|T200C":1,"IronOre-3A|T150U":1,"IronOre-3A|T175U":1,"IronOre-3A|T200U":1,"IronOre-3A|U200C":1,
    "IronOre-2A|T150":0,"IronOre-2A|T175":0,"IronOre-2A|T200":0,"IronOre-2A|T300":0,"IronOre-2A|T200-20":1,"IronOre-2A|T200C":1,"IronOre-2A|T150U":1,"IronOre-2A|T175U":1,"IronOre-2A|T200U":1,"IronOre-2A|U200C":1,
    "IronOre-3C|T150":2,"IronOre-3C|T175":2,"IronOre-3C|T200":2,"IronOre-3C|T300":2,"IronOre-3C|T200-20":1,"IronOre-3C|T200C":1,"IronOre-3C|T150U":1,"IronOre-3C|T175U":1,"IronOre-3C|T200U":1,"IronOre-3C|U200C":1,
    "IronOre-2C|T150":2,"IronOre-2C|T175":2,"IronOre-2C|T200":2,"IronOre-2C|T300":2,"IronOre-2C|T200-20":1,"IronOre-2C|T200C":1,"IronOre-2C|T150U":1,"IronOre-2C|T175U":1,"IronOre-2C|T200U":1,"IronOre-2C|U200C":1,
    "IronOre-B|T150":2,"IronOre-B|T175":2,"IronOre-B|T200":2,"IronOre-B|T300":2,"IronOre-B|T200-20":1,"IronOre-B|T200C":1,"IronOre-B|T150U":1,"IronOre-B|T175U":1,"IronOre-B|T200U":1,"IronOre-B|U200C":1,
    "IronOre-None|T150":1,"IronOre-None|T175":1,"IronOre-None|T200":1,"IronOre-None|T300":1,"IronOre-None|T200-20":1,"IronOre-None|T200C":1,"IronOre-None|T150U":1,"IronOre-None|T175U":1,"IronOre-None|T200U":1,"IronOre-None|U200C":1,
    "Sandstone-3A|T150":0,"Sandstone-3A|T175":0,"Sandstone-3A|T200":0,"Sandstone-3A|T300":0,"Sandstone-3A|T200-20":1,"Sandstone-3A|T200C":1,"Sandstone-3A|T150U":1,"Sandstone-3A|T175U":1,"Sandstone-3A|T200U":1,"Sandstone-3A|U200C":1,
    "Sandstone-2A|T150":0,"Sandstone-2A|T175":0,"Sandstone-2A|T200":0,"Sandstone-2A|T300":0,"Sandstone-2A|T200-20":1,"Sandstone-2A|T200C":1,"Sandstone-2A|T150U":1,"Sandstone-2A|T175U":1,"Sandstone-2A|T200U":1,"Sandstone-2A|U200C":1,
    "Sandstone-3C|T150":2,"Sandstone-3C|T175":2,"Sandstone-3C|T200":2,"Sandstone-3C|T300":2,"Sandstone-3C|T200-20":1,"Sandstone-3C|T200C":1,"Sandstone-3C|T150U":1,"Sandstone-3C|T175U":1,"Sandstone-3C|T200U":1,"Sandstone-3C|U200C":1,
    "Sandstone-2C|T150":2,"Sandstone-2C|T175":2,"Sandstone-2C|T200":2,"Sandstone-2C|T300":2,"Sandstone-2C|T200-20":1,"Sandstone-2C|T200C":1,"Sandstone-2C|T150U":1,"Sandstone-2C|T175U":1,"Sandstone-2C|T200U":1,"Sandstone-2C|U200C":1,
    "Sandstone-B|T150":2,"Sandstone-B|T175":2,"Sandstone-B|T200":2,"Sandstone-B|T300":2,"Sandstone-B|T200-20":1,"Sandstone-B|T200C":1,"Sandstone-B|T150U":1,"Sandstone-B|T175U":1,"Sandstone-B|T200U":1,"Sandstone-B|U200C":1,
    "Sandstone-None|T150":1,"Sandstone-None|T175":1,"Sandstone-None|T200":1,"Sandstone-None|T300":1,"Sandstone-None|T200-20":1,"Sandstone-None|T200C":1,"Sandstone-None|T150U":1,"Sandstone-None|T175U":1,"Sandstone-None|T200U":1,"Sandstone-None|U200C":1,
    "silver-3A|T150":8,"silver-3A|T175":8,"silver-3A|T200":5,"silver-3A|T300":0,"silver-3A|T200-20":1,"silver-3A|T200C":1,"silver-3A|T150U":1,"silver-3A|T175U":1,"silver-3A|T200U":1,"silver-3A|U200C":1,
    "silver-2A|T150":8,"silver-2A|T175":8,"silver-2A|T200":5,"silver-2A|T300":0,"silver-2A|T200-20":1,"silver-2A|T200C":1,"silver-2A|T150U":1,"silver-2A|T175U":1,"silver-2A|T200U":1,"silver-2A|U200C":1,
    "silver-3C|T150":8,"silver-3C|T175":8,"silver-3C|T200":5,"silver-3C|T300":0,"silver-3C|T200-20":1,"silver-3C|T200C":1,"silver-3C|T150U":1,"silver-3C|T175U":1,"silver-3C|T200U":1,"silver-3C|U200C":1,
    "silver-2C|T150":7,"silver-2C|T175":7,"silver-2C|T200":0,"silver-2C|T300":0,"silver-2C|T200-20":1,"silver-2C|T200C":1,"silver-2C|T150U":1,"silver-2C|T175U":1,"silver-2C|T200U":1,"silver-2C|U200C":1,
    "silver-B|T150":9,"silver-B|T175":9,"silver-B|T200":6,"silver-B|T300":2,"silver-B|T200-20":1,"silver-B|T200C":1,"silver-B|T150U":1,"silver-B|T175U":1,"silver-B|T200U":1,"silver-B|U200C":1,
    "silver-None|T150":1,"silver-None|T175":1,"silver-None|T200":1,"silver-None|T300":1,"silver-None|T200-20":1,"silver-None|T200C":1,"silver-None|T150U":1,"silver-None|T175U":1,"silver-None|T200U":1,"silver-None|U200C":1,
    "SlateGrey-3A|T150":5,"SlateGrey-3A|T175":5,"SlateGrey-3A|T200":5,"SlateGrey-3A|T300":0,"SlateGrey-3A|T200-20":1,"SlateGrey-3A|T200C":1,"SlateGrey-3A|T150U":1,"SlateGrey-3A|T175U":1,"SlateGrey-3A|T200U":1,"SlateGrey-3A|U200C":1,
    "SlateGrey-2A|T150":5,"SlateGrey-2A|T175":5,"SlateGrey-2A|T200":5,"SlateGrey-2A|T300":0,"SlateGrey-2A|T200-20":1,"SlateGrey-2A|T200C":1,"SlateGrey-2A|T150U":1,"SlateGrey-2A|T175U":1,"SlateGrey-2A|T200U":1,"SlateGrey-2A|U200C":1,
    "SlateGrey-3C|T150":6,"SlateGrey-3C|T175":6,"SlateGrey-3C|T200":6,"SlateGrey-3C|T300":2,"SlateGrey-3C|T200-20":1,"SlateGrey-3C|T200C":1,"SlateGrey-3C|T150U":1,"SlateGrey-3C|T175U":1,"SlateGrey-3C|T200U":1,"SlateGrey-3C|U200C":1,
    "SlateGrey-2C|T150":6,"SlateGrey-2C|T175":6,"SlateGrey-2C|T200":6,"SlateGrey-2C|T300":2,"SlateGrey-2C|T200-20":1,"SlateGrey-2C|T200C":1,"SlateGrey-2C|T150U":1,"SlateGrey-2C|T175U":1,"SlateGrey-2C|T200U":1,"SlateGrey-2C|U200C":1,
    "SlateGrey-B|T150":6,"SlateGrey-B|T175":6,"SlateGrey-B|T200":6,"SlateGrey-B|T300":2,"SlateGrey-B|T200-20":1,"SlateGrey-B|T200C":1,"SlateGrey-B|T150U":1,"SlateGrey-B|T175U":1,"SlateGrey-B|T200U":1,"SlateGrey-B|U200C":1,
    "SlateGrey-None|T150":1,"SlateGrey-None|T175":1,"SlateGrey-None|T200":1,"SlateGrey-None|T300":1,"SlateGrey-None|T200-20":1,"SlateGrey-None|T200C":1,"SlateGrey-None|T150U":1,"SlateGrey-None|T175U":1,"SlateGrey-None|T200U":1,"SlateGrey-None|U200C":1,
    "white-3A|T150":8,"white-3A|T175":8,"white-3A|T200":8,"white-3A|T300":8,"white-3A|T200-20":8,"white-3A|T200C":8,"white-3A|T150U":8,"white-3A|T175U":8,"white-3A|T200U":8,"white-3A|U200C":1,
    "white-2A|T150":8,"white-2A|T175":8,"white-2A|T200":8,"white-2A|T300":11,"white-2A|T200-20":8,"white-2A|T200C":8,"white-2A|T150U":8,"white-2A|T175U":8,"white-2A|T200U":8,"white-2A|U200C":1,
    "white-3C|T150":8,"white-3C|T175":8,"white-3C|T200":5,"white-3C|T300":0,"white-3C|T200-20":8,"white-3C|T200C":8,"white-3C|T150U":8,"white-3C|T175U":8,"white-3C|T200U":8,"white-3C|U200C":1,
    "white-2C|T150":8,"white-2C|T175":8,"white-2C|T200":8,"white-2C|T300":7,"white-2C|T200-20":8,"white-2C|T200C":8,"white-2C|T150U":8,"white-2C|T175U":8,"white-2C|T200U":8,"white-2C|U200C":1,
    "white-B|T150":9,"white-B|T175":9,"white-B|T200":9,"white-B|T300":10,"white-B|T200-20":9,"white-B|T200C":9,"white-B|T150U":9,"white-B|T175U":9,"white-B|T200U":9,"white-B|U200C":1,
    "white-None|T150":1,"white-None|T175":1,"white-None|T200":1,"white-None|T300":1,"white-None|T200-20":1,"white-None|T200C":1,"white-None|T150U":1,"white-None|T175U":1,"white-None|T200U":1,"white-None|U200C":1,
  };
  // Coverage matrix (data/weather_seal/Coverage.csv): which seals are valid for
  // each Weather Seal Coverage mode. NONE is always selectable; selecting NONE
  // disables the coverage control (no coverage applies).
  const WS_COVERAGE_BLOCKS = {
    complete:      new Set(["EU_ADCA", "ADCA_MOUNT_JWS"]),
    vertical_only: new Set([]),
  };
  function applyJambSealConstraint() {
    const $sel = $("#JAMB_SEAL");
    if (!$sel.length) return;
    const colorKey = $("input[name='COLOR']:checked").val();
    const mountVal = $("#TRK_MOUNT_TYP").val();
    const model    = $("input[name='DOOR_MODEL']:checked").val();
    const coverage = $("input[name='WeatherSealCoverage']:checked").val() || "complete";
    const colorPrefix = WS_COLOR_KEY[colorKey];
    const mountKey    = WS_MOUNT_KEY[mountVal];
    if (!colorPrefix || !mountKey || !model) {
      if (!$sel.val()) $sel[0].selectedIndex = 0;
      return;
    }
    const setIdx = WS_LOOKUP[`${colorPrefix}-${mountKey}|${model}`];
    // Unknown combo (no data) → show all options rather than blank out.
    const dataAllowed = setIdx === undefined ? null : new Set(WS_SET_VALUES[setIdx]);
    const coverageBlocks = WS_COVERAGE_BLOCKS[coverage] || new Set();
    const $options = $sel.find("option");
    $options.each(function () {
      const v = this.value;
      const dataOk = dataAllowed === null || dataAllowed.has(v);
      const coverageOk = v === "NONE" || !coverageBlocks.has(v);
      const allow = dataOk && coverageOk;
      $(this).toggle(allow).prop("disabled", !allow);
    });
    const current = $sel.val();
    const stillValid = current &&
      (dataAllowed === null || dataAllowed.has(current)) &&
      (current === "NONE" || !coverageBlocks.has(current));
    if (!stillValid) {
      // Default is always NONE — it's never blocked by data or coverage.
      $sel.find("option[value='NONE']").prop("selected", true);
      $sel.val("NONE");
    }
    if (!$sel.val()) {
      $sel.find("option[value='NONE']").prop("selected", true);
      $sel.val("NONE");
    }
  }
  // Coverage toggle is disabled when JAMB_SEAL = NONE (no coverage applies).
  function applyCoverageEnablement() {
    const val = $("#JAMB_SEAL").val();
    if (!val) return;
    const isNone = val === "NONE";
    const $btns = $("#WS_COVERAGE_COMPLETE_BTN, #WS_COVERAGE_VERTICAL_BTN");
    $btns.toggleClass("disabled", isNone);
    $("input[name='WeatherSealCoverage']").prop("disabled", isNone);
  }
  $(document).on("change",
    "input[name='COLOR'], #TRK_MOUNT_TYP, input[name='DOOR_MODEL'], input[name='WeatherSealCoverage']",
    applyJambSealConstraint);
  $(document).on("change", "#JAMB_SEAL", applyCoverageEnablement);
  applyJambSealConstraint();
  applyCoverageEnablement();
  setTimeout(() => { applyJambSealConstraint(); applyCoverageEnablement(); }, 0);
  setTimeout(() => { applyJambSealConstraint(); applyCoverageEnablement(); }, 250);
  setTimeout(() => { applyJambSealConstraint(); applyCoverageEnablement(); }, 1000);

  // [NOLAP-STEEL-JAMB-LOGIC] Forced by (Jamb, OverlapRequired):
  //   Steel  + Overlap Yes → NoLap = No   (Yes disabled)
  //   Steel  + Overlap No  → NoLap = Yes  (No disabled)
  //   Wood   / Masonry     → NoLap = No   (Yes disabled, both overlap states)
  function applyNoLapSteelJambConstraint() {
    const $yes = $("#NOLAP_STEEL_JAMB_YES");
    const $no  = $("#NOLAP_STEEL_JAMB_NO");
    if (!$yes.length) return;
    const $yesBtn = $("#NOLAP_STEEL_JAMB_YES_BTN");
    const $noBtn  = $("#NOLAP_STEEL_JAMB_NO_BTN");
    const jamb    = $("#JAMB").val();
    const overlap = $("input[name='OverlapRequired']:checked").val();
    let forced;
    if (jamb === "steel") forced = overlap === "yes" ? "no" : "yes";
    else forced = "no";
    $yes.prop("checked", forced === "yes").prop("disabled", forced !== "yes");
    $no.prop("checked",  forced === "no").prop("disabled",  forced !== "no");
    $yesBtn.toggleClass("disabled", forced !== "yes").toggleClass("selected", forced === "yes");
    $noBtn.toggleClass("disabled",  forced !== "no").toggleClass("selected",  forced === "no");
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("NoLapSteelJamb");
    if (typeof applyTrackMountConstraint === "function") applyTrackMountConstraint();
  }
  $(document).on("change", "#JAMB, input[name='OverlapRequired']", applyNoLapSteelJambConstraint);
  applyNoLapSteelJambConstraint();
  setTimeout(applyNoLapSteelJambConstraint, 0);
  setTimeout(applyNoLapSteelJambConstraint, 250);

  // [CSBB-DRHGT-LOGIC] CSBB Door Height is forced by (CSBB, CUSTOM_HEIGHT_FEET):
  //   CSBB = No                        → NO CSBB
  //   CSBB = Yes + height ≤ 20 ft      → DHLTE20FT
  //   CSBB = Yes + height > 20 ft      → DHGT20
  // Buttons stay visible but are disabled.
  function applyCsbbDrHgtConstraint() {
    const $none = $("#CSBB_DRHGT_NONE");
    if (!$none.length) return;
    const csbb = $("input[name='CSBB']:checked").val();
    const heightFt = parseInt($("#CUSTOM_HEIGHT_FEET").val(), 10);
    let forced;
    if (csbb !== "yes") forced = "no_csbb";
    else if (!isNaN(heightFt) && heightFt > 20) forced = "csbb_dhgt20";
    else forced = "csbb_dhlte20ft";
    $("input[name='CSBBDrHgt']").each(function () {
      const isForced = this.value === forced;
      $(this).prop("checked", isForced).prop("disabled", true);
      const $btn = $(this).closest(".rw-sliding-button");
      $btn.toggleClass("btn-checked selected", isForced).addClass("disabled");
    });
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("CSBBDrHgt");
    if (typeof applyTrackMountConstraint === "function") applyTrackMountConstraint();
  }
  let _csbbDrHgtTimer = null;
  $(document).on("change", "input[name='CSBB'], #CUSTOM_HEIGHT_FEET", function () {
    if (_csbbDrHgtTimer) clearTimeout(_csbbDrHgtTimer);
    _csbbDrHgtTimer = setTimeout(() => {
      _csbbDrHgtTimer = null;
      applyCsbbDrHgtConstraint();
    }, 80);
  });
  applyCsbbDrHgtConstraint();
  setTimeout(applyCsbbDrHgtConstraint, 0);
  setTimeout(applyCsbbDrHgtConstraint, 250);

  // [BOTTOM-SEAL-LOGIC] Bottom Seal row stays visible so the user sees it exists.
  // When the retainer has no seal slot, only "None" is selectable.
  const RETAINER_HAS_SEAL = ["steel", "pvc"];
  const DEFAULT_BOTTOM_SEAL = "pvc_4_35c";
  function applyBottomSealConstraint() {
    const $row = $("#BOTTOM_SEAL_ROW");
    if (!$row.length) return;
    const nextState = RETAINER_HAS_SEAL.includes($("input[name='BottomRetainer']:checked").val()) ? "seal" : "none";
    if ($row.attr("data-seal-state") === nextState) return;
    $row.attr("data-seal-state", nextState);

    const $sealBtns = $("input[name='BottomSeal'][value='pvc_4_35c'], input[name='BottomSeal'][value='santoprene_3_60c']");
    const $noneBtn = $("input[name='BottomSeal'][value='none']");

    if (nextState === "seal") {
      $sealBtns.each(function () { $(this).closest(".rw-button").show(); $(this).prop("disabled", false); });
      $noneBtn.closest(".rw-button").hide();
      $noneBtn.prop("disabled", true);
      $("input[name='BottomSeal']").prop("checked", false);
      $("input[name='BottomSeal']").closest(".rw-button").removeClass("btn-checked");
      $("input[name='BottomSeal'][value='" + DEFAULT_BOTTOM_SEAL + "']").prop("checked", true).closest(".rw-button").addClass("btn-checked");
    } else {
      $sealBtns.each(function () { $(this).closest(".rw-button").hide(); $(this).prop("disabled", true); });
      $noneBtn.closest(".rw-button").show();
      $noneBtn.prop("disabled", false);
      $("input[name='BottomSeal']").prop("checked", false);
      $("input[name='BottomSeal']").closest(".rw-button").removeClass("btn-checked");
      $noneBtn.prop("checked", true).closest(".rw-button").addClass("btn-checked");
    }
  }
  $(document).on("change", "input[name='BottomRetainer']", applyBottomSealConstraint);
  applyBottomSealConstraint();
  // Re-run after host framework finishes hydrating selects.
  setTimeout(applyBottomSealConstraint, 0);
  setTimeout(applyBottomSealConstraint, 250);

}
