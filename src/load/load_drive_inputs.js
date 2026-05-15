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
  $w.empty();
  for (let v = limits.min; v <= limits.max; v++) {
    $w.append(`<option value="${v}"${v === clampedFt ? " selected" : ""}>${v}</option>`);
  }
  if (clampedFt !== curFt) $w.trigger("change");

  const inchThreshold = limits.maxInchesThreshold ?? limits.max;
  const maxIn = limits.inchExceptions?.[clampedFt] !== undefined
    ? limits.inchExceptions[clampedFt]
    : (clampedFt >= inchThreshold ? (limits.maxInches ?? 11) : 11);
  const curIn = parseInt($wi.val());
  const clampedIn = !isNaN(curIn) && curIn <= maxIn ? curIn : maxIn;
  $wi.empty();
  for (let v = 0; v <= maxIn; v++) {
    $wi.append(`<option value="${v}"${v === clampedIn ? " selected" : ""}>${v}</option>`);
  }
  if (clampedIn !== curIn) $wi.trigger("change");
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
  $h.empty();
  for (let v = limits.min; v <= limits.max; v++) {
    $h.append(`<option value="${v}"${v === clamped ? " selected" : ""}>${v}</option>`);
  }
  if (clamped !== cur) $h.trigger("change");

  const inchThreshold = limits.maxInchesThreshold ?? limits.max;
  const maxIn = limits.inchExceptions?.[clamped] !== undefined
    ? limits.inchExceptions[clamped]
    : (clamped >= inchThreshold ? (limits.maxInches ?? 11) : 11);
  const curIn = parseInt($hi.val());
  const clampedIn = !isNaN(curIn) && curIn <= maxIn ? curIn : maxIn;
  $hi.empty();
  for (let v = 0; v <= maxIn; v++) {
    $hi.append(`<option value="${v}"${v === clampedIn ? " selected" : ""}>${v}</option>`);
  }
  if (clampedIn !== curIn) $hi.trigger("change");
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
        this.setVisibility(getState("LIFT_TYPE") === 'HL')
      },
      "",
      $("#HIGHLIFT_LAYOUT")[0],
      ["LIFT_TYPE"])
  }

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
  $(document).on("change", "#CUSTOM_HEIGHT_FEET", function () {
    if (_heightConstraintRunning) return;
    _heightConstraintRunning = true;
    const { model, hwSize, doorOpts } = getSelections();
    applyHeightConstraint(model, hwSize, doorOpts);
    _heightConstraintRunning = false;
  });

  let _widthConstraintRunning = false;
  $(document).on("change", "#CUSTOM_WIDTH_FEET", function () {
    if (_widthConstraintRunning) return;
    _widthConstraintRunning = true;
    const { model, hwSize, doorOpts } = getSelections();
    applyWidthConstraint(model, hwSize, doorOpts);
    _widthConstraintRunning = false;
  });

  // [LIFT-TYPE-LOGIC]
  addLogic("LIFT_TYPE", function () {
    let selectedHardware = nodeset["HARDWARE_SET"]?.value;
    let SelectedSpring = nodeset["SPRINGTYPE"]?.value;
    let SelectedInclinedTrack = nodeset["INCLINEDTRACK"]?.value;
    if (!selectedHardware) { this.value = $(`input[type="radio"][name="LIFT_TYPE"]:checked`).val(); return; }
    $(".lift-option").hide();

    const liftMapTorsion = {
      "A": ["STD12", "STD15", "LHF", "LHROUT", "HL"],
      "Y": ["STD12", "STD15", "32R", "LHF", "LHROUT", "HL"],
    };

    const liftMapExtension = {
      "A": [""],
      "Y": ["STD12", "STD15", "LHREXT"],
    };

    let selectedMap =
      (SelectedSpring === "EXTENSION" || SelectedSpring === "EXT") ?
        liftMapExtension :
        liftMapTorsion;

    let showList = [];

    if (selectedHardware === "C") {
      showList = SelectedInclinedTrack === "N"
        ? ["STD12", "STD15", "LHF", "LHROUT", "HL", "VL", "LHR_VL"]
        : ["STD12", "STD15", "HL", "LHR_VL"];
    } else {
      showList = selectedMap[selectedHardware] || [];
    }

    showList.forEach(id => {
      $("#opt-" + id).show();
    });

    this.value = $(`input[type="radio"][name="LIFT_TYPE"]:checked`).val()
  }, ["HARDWARE_SET", "SPRINGTYPE", "INCLINEDTRACK"])

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
    const $select = $("#ROLLER_STYLE");
    const allowed = hwSize === "3" ? ROLLER_HW3 : ROLLER_HW2;

    $("#ROLLER_STYLE option").each(function () {
      const allowed_ = allowed.includes(this.value);
      $(this).prop("disabled", !allowed_).toggle(allowed_);
    });

    if (!allowed.includes($select.val())) $select.val("Steel");
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

  // [BOTTOM-SEAL-LOGIC] Bottom Seal row stays visible so the user sees it exists.
  // When the retainer has no seal slot, swap the options for a single "None" entry.
  const RETAINER_HAS_SEAL = ["steel", "pvc"];
  const BOTTOM_SEAL_OPTIONS = [
    { value: "pvc_4_35c",        label: '4" PVC Bottom Seal (-35C)' },
    { value: "santoprene_3_60c", label: '3" Santoprene Bottom Seal (-60C)' },
  ];
  const DEFAULT_BOTTOM_SEAL = BOTTOM_SEAL_OPTIONS[0].value;
  function applyBottomSealConstraint() {
    const $sel = $("#BOTTOM_SEAL");
    if (!$sel.length) return;
    const nextState = RETAINER_HAS_SEAL.includes($("#BOTTOM_RETAINER").val()) ? "seal" : "none";
    if ($sel.attr("data-seal-state") === nextState) return;
    $sel.attr("data-seal-state", nextState);
    if (nextState === "seal") {
      $sel[0].innerHTML = BOTTOM_SEAL_OPTIONS.map(o => `<option value="${o.value}">${o.label}</option>`).join("");
      $sel.val(DEFAULT_BOTTOM_SEAL).prop("disabled", false).removeClass("is-placeholder");
    } else {
      $sel[0].innerHTML = `<option value="none">None</option>`;
      $sel.val("none").prop("disabled", true).addClass("is-placeholder");
    }
  }
  $(document).on("change", "#BOTTOM_RETAINER", applyBottomSealConstraint);
  applyBottomSealConstraint();
  // Re-run after host framework finishes hydrating selects.
  setTimeout(applyBottomSealConstraint, 0);
  setTimeout(applyBottomSealConstraint, 250);

}
