
let _sectionBundleNodeIds = [];

function recomputeSectionBundles() {

    for (let pass = 0; pass < 2; pass++) {
        for (const id of _sectionBundleNodeIds) {
            const node = nodeset?.[id];
            if (node && typeof node.logic === "function") {
                try { node.logic.call(node); } catch (e) { /* leave stale value */ }
            }
        }
    }

    for (const id of _sectionBundleNodeIds) {
        const node = nodeset?.[id];
        if (!node) continue;
        // Prefer the LIVE element by id: the platform can re-create field DOM on
        // page/section navigation (e.g. Back), leaving node.element detached — so
        // writing to node.element would update an orphan while the visible field
        // keeps its stale value. Fall back to node.element if no id match.
        const el = document.getElementById(id) || node.element;
        if (!el) continue;
        const tag = el.tagName;
        if (tag === "SELECT") {
            // A <select> ignores el.value = "" when it has no empty option, so a
            // blanked node would otherwise leave the previously-selected part#
            // (which then lands on the BOM). Force "no selection" in that case.
            const v = node.value;
            if (v === "" || v === undefined || v === null) {
                el.selectedIndex = -1;
            } else {
                el.value = v;
                // If the value matched no option, also clear (don't leave stale).
                if (el.value !== String(v)) el.selectedIndex = -1;
            }
        } else if (tag === "INPUT" || tag === "OPTION") {
            el.value = node.value;
        } else if (node.type === "LABEL" && !node.text) {
            el.innerText = node.value;
        } else if (node.type !== "CONTAINER" && node.text) {
            el.innerText = node.text;
        }
    }
}

function addSectionBundleDrivers() {
    _sectionBundleNodeIds = [];
    function addLogic(id, logic, _edges) {
        if (!nodeset[id]) return;
        nodeset[id].logic = logic;
        _sectionBundleNodeIds.push(id);
    }

    const SECTION_DEPS = [
        "SHORTEST_SECTION",
        "SHORTEST_SECTIONS_QTY",
        "TALLEST_SECTION",
        "TALLEST_SECTION_QTY",
        "NUM_OF_SEC"
    ];

    const DIMENSION_DEPS = [
        "DOOR_HEIGHT_FEET",
        "DOOR_HEIGHT_INCHES",
        "DOOR_WIDTH_FEET",
        "DOOR_WIDTH_INCHES",
        "NUM_OF_SEC"
    ];

    addLogic("Y_LINE_DESC", function () {
        this.value = buildDoorFaceDescription();
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE", "Pattern", "StepPlate", "ExhaustPortView", "ExhaustPortSize", "EndCaps"])


    addLogic("T_DOOR_MODEL", function () {
        this.value = $("input[name='DOOR_MODEL']:checked").val() || "";
    }, ["DOOR_MODEL"])

    //each section heights
    addLogic("BTM_SECTION_1", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 1 ? (sections[0] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT1_SECTION_2", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 2 ? (sections[1] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT2_SECTION_3", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 3 ? (sections[2] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT3_SECTION_4", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 4 ? (sections[3] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT4_SECTION_5", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 5 ? (sections[4] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT5_SECTION_6", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 6 ? (sections[5] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT6_SECTION_7", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 7 ? (sections[6] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT7_SECTION_8", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 8 ? (sections[7] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT8_SECTION_9", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 9 ? (sections[8] ?? "") : "";
    }, SECTION_DEPS)


    //Bundle heights and Qty
    // bundle 1 
    addLogic("BUNDLE_1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections?.reduce((a, b) => a + b, 0) ?? 0;

    }, SECTION_DEPS);

    addLogic("BUNDLE1_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections[0] ?? 0;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[0]?.sections[1] ?? 0;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE_1_QTY", function () {
        this.value = getState("BUNDLE_1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC1_QTY", function () {
        this.value = getState("BUNDLE1_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE1_SC2_QTY", function () {
        this.value = getState("BUNDLE1_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_1_HEIGHT"])

    // BUNDLE 2 
    addLogic("BUNDLE_2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE2_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections[0] ?? 0;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[1]?.sections[1] ?? 0;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE_2_QTY", function () {
        this.value = getState("BUNDLE_2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC1_QTY", function () {
        this.value = getState("BUNDLE2_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE2_SC2_QTY", function () {
        this.value = getState("BUNDLE2_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_2_HEIGHT"])


    //BUNDLE 3
    addLogic("BUNDLE_3_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE3_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections[0] ?? 0;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[2]?.sections[1] ?? 0;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE_3_QTY", function () {
        this.value = getState("BUNDLE_3_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC1_QTY", function () {
        this.value = getState("BUNDLE3_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE3_SC2_QTY", function () {
        this.value = getState("BUNDLE3_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_3_HEIGHT"])


    //BUNDLE 4
    addLogic("BUNDLE_4_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE4_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections[0] ?? 0;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC2_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[3]?.sections[1] ?? 0;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE_4_QTY", function () {
        this.value = getState("BUNDLE_4_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC1_QTY", function () {
        this.value = getState("BUNDLE4_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE4_SC2_QTY", function () {
        this.value = getState("BUNDLE4_SC2_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_4_HEIGHT"])


    //BUNDLE 5
    addLogic("BUNDLE_5_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[4]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE5_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[4]?.sections[0] ?? 0;
    }, ["BUNDLE_5_HEIGHT"])

    addLogic("BUNDLE_5_QTY", function () {
        this.value = getState("BUNDLE_5_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_5_HEIGHT"])

    addLogic("BUNDLE5_SC1_QTY", function () {
        this.value = getState("BUNDLE5_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_5_HEIGHT"])

    //BUNDLE 6
    addLogic("BUNDLE_6_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[5]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE6_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[5]?.sections[0] ?? 0;
    }, ["BUNDLE_6_HEIGHT"])

    addLogic("BUNDLE_6_QTY", function () {
        this.value = getState("BUNDLE_6_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_6_HEIGHT"])

    addLogic("BUNDLE6_SC1_QTY", function () {
        this.value = getState("BUNDLE6_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_6_HEIGHT"])

    //BUNDLE 7
    addLogic("BUNDLE_7_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[6]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE7_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[6]?.sections[0] ?? 0;
    }, ["BUNDLE_7_HEIGHT"])

    addLogic("BUNDLE_7_QTY", function () {
        this.value = getState("BUNDLE_7_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_7_HEIGHT"])

    addLogic("BUNDLE7_SC1_QTY", function () {
        this.value = getState("BUNDLE7_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_7_HEIGHT"])

    //BUNDLE 8
    addLogic("BUNDLE_8_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[7]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE8_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[7]?.sections[0] ?? 0;
    }, ["BUNDLE_8_HEIGHT"])

    addLogic("BUNDLE_8_QTY", function () {
        this.value = getState("BUNDLE_8_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_8_HEIGHT"])

    addLogic("BUNDLE8_SC1_QTY", function () {
        this.value = getState("BUNDLE8_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_8_HEIGHT"])

    //BUNDLE 9
    addLogic("BUNDLE_9_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[8]?.sections?.reduce((a, b) => a + b, 0) ?? 0;
    }, SECTION_DEPS);

    addLogic("BUNDLE9_SC1_HEIGHT", function () {
        const bundles = bundleByHeight(getSectionBundle());
        this.value = bundles[8]?.sections[0] ?? 0;
    }, ["BUNDLE_9_HEIGHT"])

    addLogic("BUNDLE_9_QTY", function () {
        this.value = getState("BUNDLE_9_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_9_HEIGHT"])

    addLogic("BUNDLE9_SC1_QTY", function () {
        this.value = getState("BUNDLE9_SC1_HEIGHT") === 0 ? 0 : 1;
    }, ["BUNDLE_9_HEIGHT"])


    //Section bundles part# and Desc
    //SB1
    addLogic("SB1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle1_qty = getState("BUNDLE_1_QTY");
        this.value = bundle1_qty > 0 ? `SB${doorModelId}01` : 'None';
    }, ["DOOR_MODEL", "BUNDLE_1_QTY"])

    addLogic("SB1_DESC", function () {
        const height = getState("BUNDLE_1_HEIGHT");
        const qty = getState("BUNDLE_1_QTY");
        try {
            this.value = buildSBDescription("SB", height, qty, 0, 0);
        } catch (e) {
            console.error("SB1_DESC ERROR:", e);
            this.value = "";
        }
    }, ["WIDTH", "BUNDLE_1_HEIGHT", "BUNDLE_1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB2
    addLogic("SB2_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle2_qty = getState("BUNDLE_2_QTY");
        this.value = bundle2_qty > 0 ? `SB${doorModelId}02` : 'None';
    }, ["DOOR_MODEL", "BUNDLE_2_QTY"])

    addLogic("SB2_DESC", function () {
        const height = getState("BUNDLE_2_HEIGHT");
        const qty = getState("BUNDLE_2_QTY");
        this.value = buildSBDescription("SB", height, qty, 1, 1);
    }, ["WIDTH", "BUNDLE_2_HEIGHT", "BUNDLE_2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB3
    addLogic("SB3_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle3_qty = getState("BUNDLE_3_QTY");
        this.value = bundle3_qty > 0 ? `SB${doorModelId}03` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_3_QTY"])

    addLogic("SB3_DESC", function () {
        const height = getState("BUNDLE_3_HEIGHT");
        const qty = getState("BUNDLE_3_QTY");
        this.value = buildSBDescription("SB", height, qty, 2, 2);

    }, ["WIDTH", "BUNDLE_3_HEIGHT", "BUNDLE_3_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 4
    addLogic("SB4_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle4_qty = getState("BUNDLE_4_QTY");
        this.value = bundle4_qty > 0 ? `SB${doorModelId}04` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_4_QTY"])

    addLogic("SB4_DESC", function () {
        const height = getState("BUNDLE_4_HEIGHT");
        const qty = getState("BUNDLE_4_QTY");
        this.value = buildSBDescription("SB", height, qty, 3, 3);

    }, ["WIDTH", "BUNDLE_4_HEIGHT", "BUNDLE_4_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 5
    addLogic("SB5_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle5_qty = getState("BUNDLE_5_QTY");
        this.value = bundle5_qty > 0 ? `SB${doorModelId}05` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_5_QTY"])

    addLogic("SB5_DESC", function () {
        const height = getState("BUNDLE_5_HEIGHT");
        const qty = getState("BUNDLE_5_QTY");
        this.value = buildSBDescription("SB", height, qty, 4, 4);

    }, ["WIDTH", "BUNDLE_5_HEIGHT", "BUNDLE_5_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 6
    addLogic("SB6_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle6_qty = getState("BUNDLE_6_QTY");
        this.value = bundle6_qty > 0 ? `SB${doorModelId}06` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_6_QTY"])

    addLogic("SB6_DESC", function () {
        const height = getState("BUNDLE_6_HEIGHT");
        const qty = getState("BUNDLE_6_QTY");
        this.value = buildSBDescription("SB", height, qty, 5, 5);

    }, ["WIDTH", "BUNDLE_6_HEIGHT", "BUNDLE_6_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 7
    addLogic("SB7_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle7_qty = getState("BUNDLE_7_QTY");
        this.value = bundle7_qty > 0 ? `SB${doorModelId}07` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_7_QTY"])

    addLogic("SB7_DESC", function () {
        const height = getState("BUNDLE_7_HEIGHT");
        const qty = getState("BUNDLE_7_QTY");
        this.value = buildSBDescription("SB", height, qty, 6, 6);

    }, ["WIDTH", "BUNDLE_7_HEIGHT", "BUNDLE_7_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 8
    addLogic("SB8_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle8_qty = getState("BUNDLE_8_QTY");
        this.value = bundle8_qty > 0 ? `SB${doorModelId}08` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_8_QTY"])

    addLogic("SB8_DESC", function () {
        const height = getState("BUNDLE_8_HEIGHT");
        const qty = getState("BUNDLE_8_QTY");
        this.value = buildSBDescription("SB", height, qty, 7, 7);

    }, ["WIDTH", "BUNDLE_8_HEIGHT", "BUNDLE_8_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SB 9
    addLogic("SB9_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle9_qty = getState("BUNDLE_9_QTY");
        this.value = bundle9_qty > 0 ? `SB${doorModelId}09` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_9_QTY"])

    addLogic("SB9_DESC", function () {
        const height = getState("BUNDLE_9_HEIGHT");
        const qty = getState("BUNDLE_9_QTY");
        this.value = buildSBDescription("SB", height, qty, 8, 8);

    }, ["WIDTH", "BUNDLE_9_HEIGHT", "BUNDLE_9_QTY", "DOOR_MODEL", "COLOR", "Pattern"])


    //Section Components part# and Desc for each bundle
    //SC1
    addLogic("BUNDLE1_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle1_sc1_qty = getState("BUNDLE1_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[0] ? bundles[0].indexes[0] : '';
        this.value = bundle1_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE1_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC1_DESC", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        const qty = getState("BUNDLE1_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE1_SC2_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle1_sc2_qty = getState("BUNDLE1_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[0] ? bundles[0].indexes[1] : '';

        this.value = bundle1_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE1_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC2_DESC", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        const qty = getState("BUNDLE1_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE1_SC1_RP_BT_DESC", function () {
        this.value = "";
    }, ["WIDTH", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE1_SC2_RP_BT_DESC", function () {
        this.value = "";
    }, ["WIDTH", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SC2
    addLogic("BUNDLE2_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle2_sc1_qty = getState("BUNDLE2_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[1] ? bundles[1].indexes[0] : '';

        this.value = bundle2_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE2_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC1_DESC", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        const qty = getState("BUNDLE2_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE2_SC2_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle2_sc2_qty = getState("BUNDLE2_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[1] ? bundles[1].indexes[1] : '';

        this.value = bundle2_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE2_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC2_DESC", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        const qty = getState("BUNDLE2_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //SC 3
    addLogic("BUNDLE3_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle3_sc1_qty = getState("BUNDLE3_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[2] ? bundles[2].indexes[0] : '';

        this.value = bundle3_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE3_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC1_DESC", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        const qty = getState("BUNDLE3_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE3_SC2_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle3_sc2_qty = getState("BUNDLE3_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[2] ? bundles[2].indexes[1] : '';

        this.value = bundle3_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';

    }, ["DOOR_MODEL", "BUNDLE3_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_DESC", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        const qty = getState("BUNDLE3_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //sc 4
    addLogic("BUNDLE4_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle4_sc1_qty = getState("BUNDLE4_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[3] ? bundles[3].indexes[0] : '';

        this.value = bundle4_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE4_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC1_DESC", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        const qty = getState("BUNDLE4_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    addLogic("BUNDLE4_SC2_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle4_sc2_qty = getState("BUNDLE4_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[3] ? bundles[3].indexes[1] : '';

        this.value = bundle4_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';

    }, ["DOOR_MODEL", "BUNDLE4_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_DESC", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        const qty = getState("BUNDLE4_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE4_SC2_HEIGHT", "BUNDLE4_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //sc 5
    addLogic("BUNDLE5_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle5_sc1_qty = getState("BUNDLE5_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[4] ? bundles[4].indexes[0] : '';

        this.value = bundle5_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE5_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE5_SC1_DESC", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        const qty = getState("BUNDLE5_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["WIDTH", "BUNDLE5_SC1_HEIGHT", "BUNDLE5_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 6
    addLogic("BUNDLE6_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle6_sc1_qty = getState("BUNDLE6_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[5] ? bundles[5].indexes[0] : '';

        this.value = bundle6_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE6_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE6_SC1_DESC", function () {
        const height = getState("BUNDLE6_SC1_HEIGHT");
        const qty = getState("BUNDLE6_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, ["WIDTH", "BUNDLE6_SC1_HEIGHT", "BUNDLE6_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 7
    addLogic("BUNDLE7_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle7_sc1_qty = getState("BUNDLE7_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[6] ? bundles[6].indexes[0] : '';

        this.value = bundle7_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE7_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE7_SC1_DESC", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        const qty = getState("BUNDLE7_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, ["WIDTH", "BUNDLE7_SC1_HEIGHT", "BUNDLE7_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 8
    addLogic("BUNDLE8_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle8_sc1_qty = getState("BUNDLE8_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[7] ? bundles[7].indexes[0] : '';

        this.value = bundle8_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE8_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE8_SC1_DESC", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        const qty = getState("BUNDLE8_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, ["WIDTH", "BUNDLE8_SC1_HEIGHT", "BUNDLE8_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 9
    addLogic("BUNDLE9_SC1_SPNUM", function () {
        let doorModelId = getModelPartCode();
        let bundle9_sc1_qty = getState("BUNDLE9_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[8] ? bundles[8].indexes[0] : '';

        this.value = bundle9_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE9_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE9_SC1_DESC", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        const qty = getState("BUNDLE9_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, ["WIDTH", "BUNDLE9_SC1_HEIGHT", "BUNDLE9_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])


    //Raw panel Part# and Desc for Each bundle
    // set bundle 1 rp1 part#
    addLogic("BUNDLE1_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE1_SC1_HEIGHT"), "01");
    }, ["DOOR_MODEL", "BUNDLE1_SC1_HEIGHT", DIMENSION_DEPS])

    // set bundle1 rp1 desc
    addLogic("BUNDLE1_RP1_DESC", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        const qty = getState("BUNDLE1_SC1_QTY");

        this.value = buildRPDescription(height, qty, 0, 0);

    }, ["WIDTH", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    // set bundle 1 rp2 part#
    addLogic("BUNDLE1_RP2_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE1_SC2_HEIGHT"), "01");
    }, ["DOOR_MODEL", "BUNDLE1_SC2_HEIGHT", DIMENSION_DEPS])

    // set bundle 1 rp2 desc
    addLogic("BUNDLE1_RP2_DESC", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        const qty = getState("BUNDLE1_SC2_QTY");

        this.value = buildRPDescription(height, qty, 0, 0);
    }, ["WIDTH", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    // bundle2 rp1 part#
    addLogic("BUNDLE2_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE2_SC1_HEIGHT"), "02");
    }, ["DOOR_MODEL", "BUNDLE2_SC1_HEIGHT", DIMENSION_DEPS])

    // bundle 2 rp1 desc
    addLogic("BUNDLE2_RP1_DESC", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        const qty = getState("BUNDLE2_SC1_QTY");

        this.value = buildRPDescription(height, qty, 1, 1);
    }, ["WIDTH", "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    // bundle 2 rp2 part#
    addLogic("BUNDLE2_RP2_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE2_SC2_HEIGHT"), "02");
    }, ["DOOR_MODEL", "BUNDLE2_SC2_HEIGHT", DIMENSION_DEPS])

    // bundle 2 rp2 desc
    addLogic("BUNDLE2_RP2_DESC", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        const qty = getState("BUNDLE2_SC2_QTY");

        this.value = buildRPDescription(height, qty, 1, 1);

    }, ["WIDTH", "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //bundle 3 rp1 part#
    addLogic("BUNDLE3_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE3_SC1_HEIGHT"), "03");
    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp1 desc
    addLogic("BUNDLE3_RP1_DESC", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        const qty = getState("BUNDLE3_SC1_QTY");

        this.value = buildRPDescription(height, qty, 2, 2);

    }, ["WIDTH", "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //bundle3 rp2
    addLogic("BUNDLE3_RP2_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE3_SC2_HEIGHT"), "03");
    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp2 desc
    addLogic("BUNDLE3_RP2_DESC", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        const qty = getState("BUNDLE3_SC2_QTY");

        this.value = buildRPDescription(height, qty, 2, 2);

    }, ["WIDTH", "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 4
    //BUNDLE4 RP1
    addLogic("BUNDLE4_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE4_SC1_HEIGHT"), "04");
    }, ["DOOR_MODEL", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE4 RP1 DESC
    addLogic("BUNDLE4_RP1_DESC", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        const qty = getState("BUNDLE4_SC1_QTY");

        this.value = buildRPDescription(height, qty, 3, 3);

    }, ["WIDTH", "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //bundle4 RP2 PART#
    addLogic("BUNDLE4_RP2_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE4_SC2_HEIGHT"), "04");
    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    //BUNDLE4 RP2 DESC
    addLogic("BUNDLE4_RP2_DESC", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        const qty = getState("BUNDLE4_SC2_QTY");

        this.value = buildRPDescription(height, qty, 3, 3);

    }, ["WIDTH", "BUNDLE4_SC2_HEIGHT", "BUNDLE4_SC2_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 5
    //BUNDLE5 RP1
    addLogic("BUNDLE5_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE5_SC1_HEIGHT"), "05");
    }, ["DOOR_MODEL", "BUNDLE5_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE5 RP1 DESC
    addLogic("BUNDLE5_RP1_DESC", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        const qty = getState("BUNDLE5_SC1_QTY");

        this.value = buildRPDescription(height, qty, 4, 4);

    }, ["WIDTH", "BUNDLE5_SC1_HEIGHT", "BUNDLE5_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 6
    //BUNDLE6 RP1
    addLogic("BUNDLE6_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE6_SC1_HEIGHT"), "06");
    }, ["DOOR_MODEL", "BUNDLE6_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE6 RP1 DESC
    addLogic("BUNDLE6_RP1_DESC", function () {
        const height = getState("BUNDLE6_SC1_HEIGHT");
        const qty = getState("BUNDLE6_SC1_QTY");

        this.value = buildRPDescription(height, qty, 5, 5);

    }, ["WIDTH", "BUNDLE6_SC1_HEIGHT", "BUNDLE6_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 7
    //BUNDLE7 RP1
    addLogic("BUNDLE7_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE7_SC1_HEIGHT"), "07");
    }, ["DOOR_MODEL", "BUNDLE7_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE7 RP1 DESC
    addLogic("BUNDLE7_RP1_DESC", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        const qty = getState("BUNDLE7_SC1_QTY");

        this.value = buildRPDescription(height, qty, 6, 6);

    }, ["WIDTH", "BUNDLE7_SC1_HEIGHT", "BUNDLE7_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 8
    //BUNDLE8 RP1
    addLogic("BUNDLE8_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE8_SC1_HEIGHT"), "08");
    }, ["DOOR_MODEL", "BUNDLE8_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE8 RP1 DESC
    addLogic("BUNDLE8_RP1_DESC", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        const qty = getState("BUNDLE8_SC1_QTY");

        this.value = buildRPDescription(height, qty, 7, 7);

    }, ["WIDTH", "BUNDLE8_SC1_HEIGHT", "BUNDLE8_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])

    //BUNDLE 9
    //BUNDLE9 RP1
    addLogic("BUNDLE9_RP1_SPNUM", function () {
        this.value = buildRPSPNum(getState("BUNDLE9_SC1_HEIGHT"), "09");
    }, ["DOOR_MODEL", "BUNDLE9_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE9 RP1 DESC
    addLogic("BUNDLE9_RP1_DESC", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        const qty = getState("BUNDLE9_SC1_QTY");
        this.value = buildRPDescription(height, qty, 8, 8);

    }, ["WIDTH", "BUNDLE9_SC1_HEIGHT", "BUNDLE9_SC1_QTY", "DOOR_MODEL", "COLOR", "Pattern"])


    // RP BASE Part# for each section
    //Bundle 1
    addLogic("BUNDLE1_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE1_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE1_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE1_SC1_HEIGHT"));
    }, ["BUNDLE1_SC1_HEIGHT"])

    addLogic("BUNDLE1_SC2_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE1_SC2_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE1_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC2_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE1_SC2_HEIGHT"));
    }, ["BUNDLE1_SC2_HEIGHT"])

    //Bundle 2
    addLogic("BUNDLE2_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE2_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE2_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE2_SC1_HEIGHT"));
    }, ["BUNDLE2_SC1_HEIGHT"])

    addLogic("BUNDLE2_SC2_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE2_SC2_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE2_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC2_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE2_SC2_HEIGHT"));
    }, ["BUNDLE2_SC2_HEIGHT"])

    //Bundle 4
    addLogic("BUNDLE3_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE3_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE3_SC1_HEIGHT"));
    }, ["BUNDLE3_SC1_HEIGHT"])

    addLogic("BUNDLE3_SC2_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE3_SC2_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE3_SC2_HEIGHT"));
    }, ["BUNDLE3_SC2_HEIGHT"])

    //Bundle 4
    addLogic("BUNDLE4_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE4_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE4_SC1_HEIGHT"));
    }, ["BUNDLE4_SC1_HEIGHT"])

    addLogic("BUNDLE4_SC2_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE4_SC2_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE4_SC2_HEIGHT"));
    }, ["BUNDLE4_SC2_HEIGHT"])

    //Bundle5
    addLogic("BUNDLE5_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE5_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE5_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE5_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE5_SC1_HEIGHT"));
    }, ["BUNDLE5_SC1_HEIGHT"])

    //Bundle6
    addLogic("BUNDLE6_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE6_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE6_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE6_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE6_SC1_HEIGHT"));
    }, ["BUNDLE6_SC1_HEIGHT"])

    //Bundle7
    addLogic("BUNDLE7_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE7_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE7_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE7_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE7_SC1_HEIGHT"));
    }, ["BUNDLE7_SC1_HEIGHT"])

    //Bundle8
    addLogic("BUNDLE8_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE8_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE8_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE8_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE8_SC1_HEIGHT"));
    }, ["BUNDLE8_SC1_HEIGHT"])

    //Bundle9
    addLogic("BUNDLE9_SC1_RP_BASE_SPNUM", function () {
        this.value = buildRPBasePartNum(getState("BUNDLE9_SC1_HEIGHT"));
    }, ["DOOR_MODEL", "COLOR", "BUNDLE9_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE9_SC1_RP_BASE_DESC", function () {
        this.value = buildRPBaseDesc(getState("BUNDLE9_SC1_HEIGHT"));
    }, ["BUNDLE9_SC1_HEIGHT"])


    addLogic("RP_BASE_QTY", function () {
        this.value = getState("WIDTH");
    }, ["WIDTH"])

    //RP Top Sheets part# and Desc for each section
    //Bundle 1
    addLogic("BUNDLE1_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE1_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE1_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = "";
    }, ["BUNDLE1_SC2_HEIGHT", "COLOR"])

    //Bundle 2
    addLogic("BUNDLE2_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE2_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE2_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = "";
    }, ["BUNDLE2_SC2_HEIGHT", "COLOR"])

    //Bundle 3
    addLogic("BUNDLE3_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE3_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE3_SC2_HEIGHT");
        this.value = "";
    }, ["BUNDLE3_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 4
    addLogic("BUNDLE4_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE4_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE4_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE4_SC2_HEIGHT");
        this.value = "";
    }, ["BUNDLE4_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 5
    addLogic("BUNDLE5_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE5_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE5_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 6
    addLogic("BUNDLE6_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE6_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE6_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 7
    addLogic("BUNDLE7_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE7_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE7_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 8
    addLogic("BUNDLE8_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE8_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE8_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 9
    addLogic("BUNDLE9_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE9_SC1_HEIGHT");
        this.value = "";
    }, ["BUNDLE9_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])


    // Bottom Retainer part# -> two output boxes (the dropdown's option VALUE is
    // the part#; the platform shows the matching description):
    //   TM_BOTTOM_RETAINER          -> PRIMARY part# for the selected model
    //                                  (all families: T150/T175 + T200/T300)
    //   TM_BOTTOM_RETAINER_T200_T300 -> SECOND retainer part#, only the wide
    //                                  T200 bands (>294") populate it; "" otherwise
    // See buildBottomRetainerParts.
    addLogic("TM_BOTTOM_RETAINER", function () {
        // Default to the "None" option (value="None") when there is no retainer
        // part — not blank — so the BOM carries an explicit None for the line.
        this.value = buildBottomRetainerParts().primary || "None";
    }, ["WIDTH", "DOOR_MODEL", "BottomRetainer"])

    addLogic("TM_BOTTOM_RETAINER_T200_T300", function () {
        // Default to the "None" option (value="None") when there is no 2nd
        // retainer — not blank — so the BOM carries an explicit None for the line.
        this.value = buildBottomRetainerParts().secondary || "None";
    }, ["WIDTH", "DOOR_MODEL", "BottomRetainer"])

    // Bottom Retainer qty. Placeholder: 1 when a primary retainer part exists,
    // blank otherwise. Exact per-model/per-band rules pending from Bill — see
    // buildBottomRetainerQty.
    addLogic("TM_BOTTOM_RETAINER_QTY", function () {
        this.value = buildBottomRetainerQty();
    }, ["WIDTH", "DOOR_MODEL", "BottomRetainer"])

    /* [BOTTOM_RETAINER — OLD] Original WIDTH-range part# lookup (328-790-XXX),
       superseded by BOTTOM_RETAINER_SPNUM (model + retainer driven). Restore if
       the new per-model logic ever needs to roll back.

    addLogic("BOTTOM_RETAINER", function () {
        let width = getState("WIDTH");
        const ranges = [
            { max: 96, code: '328-790-080' },
            { max: 108, code: '328-790-090' },
            { max: 120, code: '328-790-100' },
            { max: 144, code: '328-790-120' },
            { max: 168, code: '328-790-140' },
            { max: 180, code: '328-790-150' },
            { max: 192, code: '328-790-160' },
            { max: 216, code: '328-790-180' },
            { max: 240, code: '328-790-200' }
        ];

        let value = '';

        for (let i = 0; i < ranges.length; i++) {
            if (width <= ranges[i].max) {
                value = ranges[i].code;
                break;
            }
        }
        this.value = value;
    }, ["WIDTH"])
    */

    addLogic("BTM_SEAL_QTY", function () {
        // Bottom seal qty = DWft + 0.5 (UoM FT). DWft = WIDTH/12 (custom-dim
        // aware). Round to 2 decimals so wide doors don't show 31.66666… etc.
        // Blank when the seal itself produces no BOM line (None, or a suppressed
        // 4" PVC) — mirror the BTM_SEAL/BTM_SEAL_SPNUM blanking so the qty box
        // can't carry an orphan value with no part#.
        const seal = $("input[name='BottomSeal']:checked").val() || "none";
        const model = $("input[name='DOOR_MODEL']:checked").val() || "";
        const retainer = $("input[name='BottomRetainer']:checked").val() || "";
        if (seal === "none" || isNoSealOutput(seal, model, retainer)) { this.value = ""; return; }
        let width = getState("WIDTH");
        this.value = Math.round(((Number(width) / 12) + 0.5) * 100) / 100;
    }, ["WIDTH", "BottomSeal", "DOOR_MODEL", "BottomRetainer"])

    // Bottom Seal -> two text fields: BTM_SEAL = Name/desc, BTM_SEAL_SPNUM = item
    // number. Both blank for None. Read the radio directly.
    addLogic("BTM_SEAL", function () {
        const seal = $("input[name='BottomSeal']:checked").val() || "none";
        const model = $("input[name='DOOR_MODEL']:checked").val() || "";
        const retainer = $("input[name='BottomRetainer']:checked").val() || "";
        // 4" PVC with no BOM output (see isNoSealOutput) — blank desc + part#.
        if (isNoSealOutput(seal, model, retainer)) { this.value = ""; return; }
        const names = {
            none: "",
            pvc_4_35c: '4" PVC Bottom Seal (-35C)',
            santoprene_3_60c: '3" Santoprene Bottom Seal (-60C)',
            dual_durometer: 'T150 Btm Retainer & Seal 24\'6"',
        };
        this.value = names[seal] ?? "";
    }, ["BottomSeal", "DOOR_MODEL", "BottomRetainer"])

    addLogic("BTM_SEAL_SPNUM", function () {
        const seal = $("input[name='BottomSeal']:checked").val() || "none";
        const model = $("input[name='DOOR_MODEL']:checked").val() || "";
        const retainer = $("input[name='BottomRetainer']:checked").val() || "";
        // 4" PVC with no BOM output — blank.
        if (isNoSealOutput(seal, model, retainer)) { this.value = ""; return; }
        const spnums = {
            none: "",
            pvc_4_35c: "152-318",
            santoprene_3_60c: "152-319",
            dual_durometer: "328-266",
        };
        // 3" Santoprene ships as ZZBTM-3IN (per Bill's output spec) for all
        // currently-specified models, not the default 152-319.
        const santoZZModels = ["T150", "T150U", "T175", "T175U", "T200", "T200-20", "T200U", "T300", "T200C", "U200C"];
        if (seal === "santoprene_3_60c" && santoZZModels.includes(model)) {
            this.value = "ZZBTM-3IN";
            return;
        }
        this.value = spnums[seal] ?? "";
    }, ["BottomSeal", "DOOR_MODEL", "BottomRetainer"])

    addLogic("BTM_RETAINER_SCREW_QTY", function () {
        let width_feet = getState("DOOR_WIDTH_FEET");

        this.value = ((Number(width_feet)) + 2)
    }, ["DOOR_WIDTH_FEET"])

    //Calculate the section bundle logic.
    // Heights are reconciled against getStackChart() (source of truth) with the
    // HEIGHT/NUM_OF_SEC arithmetic as a cross-check — see resolveSectionHeights.
    addLogic("SHORTEST_SECTION", function () { //find the shortest value
        this.value = resolveSectionHeights().shortest;
    }, ["HEIGHT", "NUM_OF_SEC", "WIDTH"])

    addLogic("SHORTEST_SECTIONS_QTY", function () {
        this.value = resolveSectionHeights().shortestQty;
    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"])


    addLogic("TALLEST_SECTION", function () {
        this.value = resolveSectionHeights().tallest;
    }, ["HEIGHT", "NUM_OF_SEC"])

    addLogic("TALLEST_SECTION_QTY", function () {
        this.value = resolveSectionHeights().tallestQty;
    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"])



    //End Caps
    //Bundle 1
    addLogic("BUNDLE1_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const BUNDLE1_SC1_HEIGHT = getState("BUNDLE1_SC1_HEIGHT");

        //door model = A = L138, d= L200
        //end caps = yes = double end caps
        //end caps = no = single end caps

        this.value = getEndCapsPartNum(BUNDLE1_SC1_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE1_SC2_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const BUNDLE1_SC2_HEIGHT = getState("BUNDLE1_SC2_HEIGHT");
        this.value = getEndCapsPartNum(BUNDLE1_SC2_HEIGHT, door_model, end_caps);

    }, ["BUNDLE1_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 2
    addLogic("BUNDLE2_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle2_sc1_height = getState("BUNDLE2_SC1_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc1_height, door_model, end_caps);

    }, ["BUNDLE2_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE2_SC2_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle2_sc2_height = getState("BUNDLE2_SC2_HEIGHT");

        this.value = getEndCapsPartNum(bundle2_sc2_height, door_model, end_caps);

    }, ["BUNDLE2_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    // Thermatite End Caps — flat by section height (21" / 24"), not by bundle.
    // The part# / desc only depend on model + single/double + hand + height, so
    // every bundle reuses the same value. Blank when the door has no section of
    // that height (getSectionBundle is the resolved list of section heights).
    addLogic("LH_21_END_CAPS_SPNUM", function () {
        const has21 = getSectionBundle().includes(21);
        this.value = has21 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "LH", 21).spnum : 'None';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("LH_21_END_CAPS_DESC", function () {
        const has21 = getSectionBundle().includes(21);
        this.value = has21 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "LH", 21).desc : '';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("RH_21_END_CAPS_SPNUM", function () {
        const has21 = getSectionBundle().includes(21);
        this.value = has21 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "RH", 21).spnum : 'None';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("RH_21_END_CAPS_DESC", function () {
        const has21 = getSectionBundle().includes(21);
        this.value = has21 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "RH", 21).desc : '';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("LH_24_END_CAPS_SPNUM", function () {
        const has24 = getSectionBundle().includes(24);
        this.value = has24 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "LH", 24).spnum : 'None';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("LH_24_END_CAPS_DESC", function () {
        const has24 = getSectionBundle().includes(24);
        this.value = has24 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "LH", 24).desc : '';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("RH_24_END_CAPS_SPNUM", function () {
        const has24 = getSectionBundle().includes(24);
        this.value = has24 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "RH", 24).spnum : 'None';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    addLogic("RH_24_END_CAPS_DESC", function () {
        const has24 = getSectionBundle().includes(24);
        this.value = has24 ? getThermatiteEndCap(getState("DOOR_MODEL"), getState("EndCaps"), "RH", 24).desc : '';
    }, ["SHORTEST_SECTION", "TALLEST_SECTION", "DOOR_MODEL", "EndCaps"])

    //Bundle 3
    addLogic("BUNDLE3_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle3_sc1_height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = bundle3_sc1_height > 0 ? getEndCapsPartNum(bundle3_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE3_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE3_SC2_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle3_sc2_height = getState("BUNDLE3_SC2_HEIGHT");

        this.value = bundle3_sc2_height > 0 ? getEndCapsPartNum(bundle3_sc2_height, door_model, end_caps) : 'None';


    }, ["BUNDLE3_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 4
    addLogic("BUNDLE4_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle4_sc1_height = getState("BUNDLE4_SC1_HEIGHT");
        this.value = bundle4_sc1_height > 0 ? getEndCapsPartNum(bundle4_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE4_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    addLogic("BUNDLE4_SC2_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle4_sc2_height = getState("BUNDLE4_SC2_HEIGHT");

        this.value = bundle4_sc2_height > 0 ? getEndCapsPartNum(bundle4_sc2_height, door_model, end_caps) : 'None';

    }, ["BUNDLE4_SC2_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 5
    addLogic("BUNDLE5_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle5_sc1_height = getState("BUNDLE5_SC1_HEIGHT");
        this.value = bundle5_sc1_height > 0 ? getEndCapsPartNum(bundle5_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE5_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 6
    addLogic("BUNDLE6_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle6_sc1_height = getState("BUNDLE6_SC1_HEIGHT");

        this.value = bundle6_sc1_height > 0 ? getEndCapsPartNum(bundle6_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE6_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 7
    addLogic("BUNDLE7_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle7_sc1_height = getState("BUNDLE7_SC1_HEIGHT");

        this.value = bundle7_sc1_height > 0 ? getEndCapsPartNum(bundle7_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE7_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 8
    addLogic("BUNDLE8_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle8_sc1_height = getState("BUNDLE8_SC1_HEIGHT");

        this.value = bundle8_sc1_height > 0 ? getEndCapsPartNum(bundle8_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE8_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])

    //Bundle 9
    addLogic("BUNDLE9_SC1_END_CAPS_SPNUM", function () {
        const end_caps = getState("EndCaps");
        const door_model = getState("DOOR_MODEL");
        const bundle9_sc1_height = getState("BUNDLE9_SC1_HEIGHT");

        this.value = bundle9_sc1_height > 0 ? getEndCapsPartNum(bundle9_sc1_height, door_model, end_caps) : 'None';

    }, ["BUNDLE9_SC1_HEIGHT", "DOOR_MODEL", "EndCaps"])


    addLogic("PKG_QTY", function () {
        this.value = Number(getState("WIDTH") / 12).toFixed(1);
    }, ["WIDTH"])

    addLogic("BUNDLE_1_PKG_QTY_DBL", function () {
        this.value = getState("BUNDLE_1_HEIGHT") > 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE_1_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_1_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_1_HEIGHT"])

    addLogic("BUNDLE_2_PKG_QTY_DBL", function () {
        this.value = getState("BUNDLE_2_HEIGHT") > 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE_2_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_2_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_2_HEIGHT"])

    addLogic("BUNDLE_3_PKG_QTY_DBL", function () {
        this.value = getState("BUNDLE_3_HEIGHT") > 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE_3_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_3_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_3_HEIGHT"])

    addLogic("BUNDLE_4_PKG_QTY_DBL", function () {
        this.value = getState("BUNDLE_4_HEIGHT") > 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE_4_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_4_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_4_HEIGHT"])

    addLogic("BUNDLE_5_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_5_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_5_HEIGHT"])

    addLogic("BUNDLE_6_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_6_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_6_HEIGHT"])

     addLogic("BUNDLE_7_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_7_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_7_HEIGHT"])

     addLogic("BUNDLE_8_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_8_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_8_HEIGHT"])

    addLogic("BUNDLE_9_PKG_QTY_SGL", function () {
        this.value = getState("BUNDLE_9_HEIGHT") < 32 ? getState("PKG_QTY") : 0
    }, ["BUNDLE_9_HEIGHT"])

    // End cap fastener quantity per section component (part# is the fixed
    // ENDCAPS_FASTENERS dropdown selection, not driven here).
    //   T200C (SE or DE) -> 2 ; other models SE -> 4 ; other models DE -> 8.
    addLogic("ENDCAPS_FASTENERS_QTY", function () {
        const numSec = Number(getState("NUM_OF_SEC")) || 0;
        if (numSec <= 0) { this.value = 0; return; }
        this.value = getEndCapFastenerQtyPerSC(getState("DOOR_MODEL"), getState("EndCaps"));
    }, ["NUM_OF_SEC", "DOOR_MODEL", "EndCaps"])

    // Bottom retainer fasteners. Part# is model-dependent (T200C = 215-203,
    // all other models = 215-306). Qty = Round(DWft + 1) for every model, where
    // DWft = WIDTH/12 (custom-dim aware, same convention as BTM_SEAL_QTY).
    addLogic("BOTTOM_FASTENERS", function () {
        this.value = getState("DOOR_MODEL") === "T200C" ? "215-203" : "215-306";
    }, ["DOOR_MODEL"])

    addLogic("BOTTOM_FASTENERS_QTY", function () {
        const dwft = Number(getState("WIDTH")) / 12;
        this.value = Math.round(dwft + 1);
    }, ["WIDTH"])

    // Top coil 21" — part# by model then colour code (1=white, 2=brown, 4=silver).
    // T200C uses a letter colour code -> 127-032<letter> (see TOP_COIL_T200C_LETTER).
    addLogic("TOP_COIL_21_INCH", function () {
        const parts = {
            T150: { "1": "126-829",  "2": "126-846B", "4": "126-885" },
            T175: { "1": "126-821",  "2": "126-844",  "4": "126-883" },
            T200: { "1": "126-838W" },
            "T200-20": { "1": "126-865" },
            T300: { "1": "126-886" },
        };
        const model = topCoilModelKey(getState("DOOR_MODEL"));
        const colorKey = $("input[name='COLOR']:checked").val() || "";
        if (model === "T200C" || model === "U200C") {
            const letter = TOP_COIL_T200C_LETTER[colorKey];
            this.value = letter ? `127-032${letter}` : "None";
            return;
        }
        this.value = parts[model]?.[RP_BASE_COLOR_CODE[colorKey]] || "None";
    }, ["COLOR", "DOOR_MODEL"])

    // Top coil 24" — part# by model then colour code (1=white, 2=brown, 4=silver).
    // T200C uses a letter colour code -> 127-033<letter> (see TOP_COIL_T200C_LETTER).
    addLogic("TOP_COIL_24_INCH", function () {
        const parts = {
            T150: { "1": "126-828", "2": "126-845B", "4": "126-884" },
            T175: { "1": "126-820", "2": "126-843",  "4": "126-882" },
            T200: { "1": "126-837W" },
            "T200-20": { "1": "126-864" },
            T300: { "1": "126-887" },
        };
        const model = topCoilModelKey(getState("DOOR_MODEL"));
        const colorKey = $("input[name='COLOR']:checked").val() || "";
        if (model === "T200C" || model === "U200C") {
            const letter = TOP_COIL_T200C_LETTER[colorKey];
            this.value = letter ? `127-033${letter}` : "None";
            return;
        }
        this.value = parts[model]?.[RP_BASE_COLOR_CODE[colorKey]] || "None";
    }, ["COLOR", "DOOR_MODEL"])

    // Top coil qty = model multiplier * door width (ft). 0 when there's no part#.
    addLogic("TOP_COIL_21_INCH_QTY", function () {
        const mult = TOP_COIL_QTY_MULT["21"][topCoilModelKey(getState("DOOR_MODEL"))];
        const hasPart = getState("TOP_COIL_21_INCH") && getState("TOP_COIL_21_INCH") !== "None";
        this.value = (mult && hasPart) ? Math.round(mult * (Number(getState("WIDTH")) / 12) * 100) / 100 : 0;
    }, ["TOP_COIL_21_INCH", "DOOR_MODEL", "WIDTH"])

    addLogic("TOP_COIL_24_INCH_QTY", function () {
        const mult = TOP_COIL_QTY_MULT["24"][topCoilModelKey(getState("DOOR_MODEL"))];
        const hasPart = getState("TOP_COIL_24_INCH") && getState("TOP_COIL_24_INCH") !== "None";
        this.value = (mult && hasPart) ? Math.round(mult * (Number(getState("WIDTH")) / 12) * 100) / 100 : 0;
    }, ["TOP_COIL_24_INCH", "DOOR_MODEL", "WIDTH"])

}

function getEndCapsPartNum(section_height, door_model, end_caps) {

    const partNumbers = {
        A: { // L138
            N: { // Single
                21: '426-0801',
                24: '426-0802'
            },
            Y: { // Double
                21: '426-0806',
                24: '426-0807'
            }
        },
        D: { // L200 (any non-"A" model)
            N: {
                21: '426-0811',
                24: '426-0812'
            },
            Y: {
                21: '426-0816',
                24: '426-0817'
            }
        }
    };

    // If door_model is not "A", treat it as L200
    //const modelKey = door_model === "A" ? "A" : "B";

    // If end_caps is not "N", treat as double
    //const capKey = end_caps === "N" ? "N" : "Y";
    // console.log("end caps part$", partNumbers[door_model]?.[end_caps]?.[section_height]);
    return partNumbers[door_model]?.[end_caps]?.[section_height] || null;
}

// Thermatite end caps. Galvanized is the only finish; single vs double comes
// from the EndCaps radio ("0" = single, "1" = double — see ENDCAPS_0/_1 in
// load_html.js). Each cap is handed (LH/RH). Only the 21" and 24" panels exist.
// Part numbers group by base model — the U-variants and T200-20 reuse their
// base model's number — but the DESC must print the ORIGINAL model string
// (e.g. "T200-20", "U200C").
function getThermatiteEndCap(model, end_caps, hand, height) {
    // "0" = single, "1" = double
    const partNumbers = {
        T150:  { "0": { LH: { 21: '426-0901', 24: '426-0903' }, RH: { 21: '426-0902', 24: '426-0904' } },
                 "1": { LH: { 21: '426-0905', 24: '426-0907' }, RH: { 21: '426-0906', 24: '426-0908' } } },
        T175:  { "0": { LH: { 21: '426-0911', 24: '426-0913' }, RH: { 21: '426-0912', 24: '426-0914' } },
                 "1": { LH: { 21: '426-0915', 24: '426-0917' }, RH: { 21: '426-0916', 24: '426-0918' } } },
        T200:  { "0": { LH: { 21: '426-0921', 24: '426-0923' }, RH: { 21: '426-0922', 24: '426-0924' } },
                 "1": { LH: { 21: '426-0925', 24: '426-0927' }, RH: { 21: '426-0926', 24: '426-0928' } } },
        T300:  { "0": { LH: { 21: '426-0931', 24: '426-0933' }, RH: { 21: '426-0932', 24: '426-0934' } },
                 "1": { LH: { 21: '426-0935', 24: '426-0937' }, RH: { 21: '426-0936', 24: '426-0938' } } },
        T200C: { "0": { LH: { 21: '426-0842', 24: '426-0844' }, RH: { 21: '426-0843', 24: '426-0845' } },
                 "1": { LH: { 21: '426-0852', 24: '426-0854' }, RH: { 21: '426-0853', 24: '426-0855' } } },
    };

    // U-variants and T200-20 share their base model's part numbers.
    const baseModelByModel = {
        T150: 'T150', T150U: 'T150',
        T175: 'T175', T175U: 'T175',
        T200: 'T200', 'T200-20': 'T200', T200U: 'T200',
        T300: 'T300',
        T200C: 'T200C', U200C: 'T200C',
    };

    const baseModel = baseModelByModel[model];
    const spnum = partNumbers[baseModel]?.[end_caps]?.[hand]?.[height] || null;

    if (!spnum) return { spnum: 'None', desc: '' };

    const dbl = end_caps === '1' ? 'Dbl ' : '';
    const desc = `${height}" Galv ${dbl}End Cap ${hand} ${model}`;
    return { spnum, desc };
}

// End cap fastener (part# 215-308R) quantity PER section component.
// Per Bill:
//   T200C, single OR double end caps -> 2 / SC
//   all other models, single end caps -> 4 / SC
//   all other models, double end caps -> 8 / SC
// end_caps is the EndCaps radio value: "0" = single (SE), "1" = double (DE).
function getEndCapFastenerQtyPerSC(door_model, end_caps) {
    const isDouble = String(end_caps) === "1";
    if (door_model === "T200C") return 2;
    return isDouble ? 8 : 4;
}

// U-variants share their base model's top-coil parts: T150U->T150, T175U->T175,
// T200U->T200. (U200C is NOT normalized here — it has its own white entry.)
function topCoilModelKey(model) {
    const base = { T150U: "T150", T175U: "T175", T200U: "T200" };
    return base[model] || model;
}

function getSectionHeight(height, num_of_sec) {
    // Thermatite has exactly ONE section configuration per height: the single
    // chart row. (The Landmark-only "// optional" alternate rows have been
    // removed from getStackChart().) Always return that entry. num_of_sec is
    // accepted for signature compatibility but not used for selection.
    const configArray = getStackChart()[String(height)];
    if (!configArray || !configArray.length) return undefined;
    return configArray[0];
}

// The single valid section count for a given door height (inches). Drives
// NUM_OF_SEC so the dropdown and the bundle heights always agree.
//
// Rule (per Bill): one section is added every 2 ft of height. Each band runs
// from X'1" up to (X+2)'0" inclusive, so the boundary sits ON the even-foot
// mark (that height keeps the lower count; one inch more bumps it). Base case
// is 4'0" (48") -> 2 sections; every full 24" above 48" adds one section.
//   48"        -> 2      |  49"-72"  (4'1"-6'0")  -> 3
//   73"-96"    -> 4      |  97"-120" (8'1"-10'0") -> 5   ... etc.
//   265"-288"  (22'1"-24'0") -> 12  ...  361"-384" (30'1"-32'0") -> 16
function getChartNumSections(heightInches) {
    const h = Number(heightInches) || 0;
    if (h <= 48) return h > 0 ? 2 : 0;
    return 2 + Math.ceil((h - 48) / 24);
}

// Pull the individual section heights out of a stack-chart entry.
// Entry keys are top_section_height / btm_section_height / int*_height,
// all in inches and always one of 21 / 24.
function chartEntryHeights(entry) {
    if (!entry) return [];
    return Object.keys(entry)
        .filter(k => k.endsWith("_height"))
        .map(k => Number(entry[k]))
        .filter(n => Number.isFinite(n));
}

// Double-authentication height resolver. The stack chart (getStackChart) is the
// source of truth, but section_bundles also derives heights arithmetically from
// HEIGHT / NUM_OF_SEC. This reconciles the two: when the chart has a matching
// (height, num_of_sec) entry we trust it; otherwise we fall back to the rounded
// arithmetic. Returns { tallest, shortest, tallestQty, shortestQty, source }.
let _resolveSectionHeightsCache = null;
let _resolveSectionHeightsKey = null;
// Force the next resolveSectionHeights() to recompute. Call after HEIGHT/NUM_OF_SEC
// settle for a new selection but before recomputing bundles — otherwise the memo
// (keyed HEIGHT|NUM_OF_SEC) can serve the previous selection's values, which made
// the BOM lag one click behind / show a stale arithmetic fallback on load.
function invalidateSectionHeightsCache() {
    _resolveSectionHeightsCache = null;
    _resolveSectionHeightsKey = null;
    // Clear the two downstream bundle caches too. They self-key on the section
    // qtys/heights, but on a fast dimension change those node values are written
    // during the framework's stale (HEIGHT, NUM_OF_SEC) walk, so the keys match
    // and the stale bundle/end-cap result keeps being served. Resetting here —
    // the single "section data changed" signal — forces a clean rebuild once the
    // SHORTEST/TALLEST_SECTION nodes are re-walked with the settled selection.
    _sectionBundleCache = null;
    _sectionBundleCacheKey = null;
    _bundleByHeightCache = null;
    _bundleByHeightCacheKey = null;
}
function resolveSectionHeights() {
    const doorHeight = Number(getState("HEIGHT")) || 0;
    const numOfSec = Number(getState("NUM_OF_SEC")) || 0;

    // Memoize on (HEIGHT, NUM_OF_SEC): called by SHORTEST/TALLEST_SECTION (+ QTY)
    // and indirectly by the whole section-bundle fan-out, so it runs many times
    // per walk with identical inputs. Auto-invalidates when height/sections change.
    const cacheKey = `${doorHeight}|${numOfSec}`;
    if (_resolveSectionHeightsKey === cacheKey && _resolveSectionHeightsCache) {
        return _resolveSectionHeightsCache;
    }

    // Arithmetic estimate (3" granularity) — kept as the cross-check / fallback.
    // Thermatite only ever uses 21" or 24" sections, so clamp the floor to 21:
    // the raw arithmetic can otherwise land on 15/18, which aren't valid heights.
    const per = numOfSec > 0 ? doorHeight / numOfSec : 0;
    const arithTallest = per > 0 ? Math.max(Math.ceil(per / 3) * 3, 21) : 0;
    const arithShortest = per > 0 ? Math.max(Math.floor(per / 3) * 3, 21) : 0;

    // Chart lookup. Chart keys step every 3"; snap non-charted heights (e.g. 122)
    // to the nearest 3" key so a 10'2" door still authenticates against the chart.
    const snapped = Math.round(doorHeight / 3) * 3;
    const entry = getSectionHeight(doorHeight, numOfSec) || getSectionHeight(snapped, numOfSec);
    const heights = chartEntryHeights(entry);

    if (heights.length) {
        const tallest = Math.max(...heights);
        const shortest = Math.min(...heights);
        const tallestQty = heights.filter(h => h === tallest).length;
        // When every section is the same height, count them all as "tallest"
        // and leave shortest qty at 0 so getSectionBundle doesn't double-count.
        const shortestQty = tallest === shortest
            ? 0
            : heights.filter(h => h === shortest).length;

        if (tallest !== arithTallest || shortest !== arithShortest) {
            console.warn(
                `[section heights] chart/arithmetic mismatch for HEIGHT=${doorHeight} ` +
                `NUM_OF_SEC=${numOfSec}: chart tallest/shortest=${tallest}/${shortest}, ` +
                `arithmetic=${arithTallest}/${arithShortest}. Using chart.`
            );
        }
        _resolveSectionHeightsCache = { tallest, shortest, tallestQty, shortestQty, source: "chart" };
        _resolveSectionHeightsKey = cacheKey;
        return _resolveSectionHeightsCache;
    }

    // No chart entry — fall back to arithmetic (clamped so an out-of-range
    // NUM_OF_SEC can't produce a section taller than the chart ever allows).
    const tallest = Math.min(arithTallest, 24);
    const shortest = arithShortest;
    // All sections the same clamped height: put the full count in tallestQty
    // (matches the chart path) instead of the split formula, which overshoots
    // numOfSec when per <= shortest (diff negative).
    let shortestQty, tallestQty;
    if (tallest === shortest || per <= shortest) {
        shortestQty = 0;
        tallestQty = numOfSec;
    } else {
        const diff = per - shortest;
        shortestQty = Math.round((1 - diff / 3) * numOfSec) || 0;
        tallestQty = Math.max(numOfSec - shortestQty, 0);
    }

    // Only warn for a genuinely off-chart HEIGHT. When the height IS charted but
    // the (height, num_of_sec) combo isn't, it's almost always the transient
    // default NUM_OF_SEC=4 before renderNumOfSections() corrects it — not worth
    // spamming the console on every early-render pass.
    const heightIsCharted = !!(getStackChart()[String(doorHeight)] || getStackChart()[String(snapped)]);
    if (!heightIsCharted) {
        console.warn(
            `[section heights] no stack-chart entry for HEIGHT=${doorHeight} ` +
            `(snapped ${snapped}) NUM_OF_SEC=${numOfSec}; using arithmetic fallback.`
        );
    }
    _resolveSectionHeightsCache = { tallest, shortest, tallestQty, shortestQty, source: "arithmetic" };
    _resolveSectionHeightsKey = cacheKey;
    return _resolveSectionHeightsCache;
}

// function getSectionBundle() {
//     let sectionHeights = [];
//     const shortest_section_qty = Math.ceil(Number(getState("SHORTEST_SECTIONS_QTY"))) || 0;
//     const shortest_sections = Number(getState("SHORTEST_SECTION")) || 0;

//     const tallest_sections = Number(getState("TALLEST_SECTION")) || 0;
//     const tallest_sections_qty = Math.ceil(Number(getState("TALLEST_SECTION_QTY"))) || 0;


//     for (let i = 0; i < shortest_section_qty; i++) {
//         sectionHeights.push(shortest_sections);
//     }

//     // Add tallest sections ONLY if qty is not 0
//     for (let i = 0; i < tallest_sections_qty; i++) {
//         sectionHeights.push(tallest_sections);
//     }

//     sectionHeights.sort((a, b) => b - a);
//     console.log("section heights", sectionHeights);
//     // console.log("Sections", sectionHeights);
//     return sectionHeights;
// }

let _sectionBundleCache = null;
let _sectionBundleCacheKey = null;
let _bundleByHeightCache = null;
let _bundleByHeightCacheKey = null;

function getSectionBundle() {
    // Thermatite stack rule: tallest at the bottom, shortest at the top.
    // Index 0 = BTM_SECTION, last index = top section.
    const shortestQty = Math.ceil(Number(getState("SHORTEST_SECTIONS_QTY"))) || 0;
    const shortestSection = Number(getState("SHORTEST_SECTION")) || 0;
    const tallestQty = Math.ceil(Number(getState("TALLEST_SECTION_QTY"))) || 0;
    const tallestSection = Number(getState("TALLEST_SECTION")) || 0;

    const key = `${tallestQty}|${tallestSection}|${shortestQty}|${shortestSection}`;
    if (_sectionBundleCacheKey === key && _sectionBundleCache) return _sectionBundleCache;

    _sectionBundleCache = [
        ...Array(tallestQty).fill(tallestSection),
        ...Array(shortestQty).fill(shortestSection),
    ];
    _sectionBundleCacheKey = key;
    _bundleByHeightCache = null;
    _bundleByHeightCacheKey = null;
    return _sectionBundleCache;
}


// Maximum bundle weight in pounds. Pairs whose combined ship weight would
// meet or exceed this cap must ship as singles instead.
const MAX_BUNDLE_WEIGHT_LBS = 150;

function bundleByHeight() {

    // Thermatite bundling rules (based on Landmark v2):
    // - Width >= 199: All sections ship alone (no bundling)
    // - Height > 12'2" (146"): All sections ship alone (no double bundling)
    // - If tallest section qty is odd (or all sections have same height with odd count),
    //   the bottom section always ships alone. Remaining sections pair up.
    // - If tallest section qty is even, pair up adjacent same-height sections from the start.
    // - Forward nearest match: pair each section with the next same-height section
    // - Weight cap: if a paired bundle would be >= 150 lbs, the two sections ship as singles

    if (_bundleByHeightCacheKey === _sectionBundleCacheKey && _bundleByHeightCache) {
        return _bundleByHeightCache;
    }

    const width = Number(getState("WIDTH"));
    const sections = getSectionBundle();
    const result = [];

    if (!sections.length) return result;

    // HEIGHT RULE: doors taller than 12'2" (146") ship every section alone —
    // no double bundling past that height. (12'2" itself can still pair.)
    // WIDTH RULE: ship every section alone if width >= 199.
    const doorHeight = Number(getState("HEIGHT"));
    if (width >= 199 || doorHeight > 146) {
        sections.forEach((h, i) => {
            result.push({
                sections: [h],
                indexes: [i + 1],
                weight: calculateSectionShipWeight(h, i === 0),
            });
        });
        _bundleByHeightCache = result;
        _bundleByHeightCacheKey = _sectionBundleCacheKey;
        return result;
    }

    // Determine if all sections are the same height (edge case).
    // In this case TALLEST_SECTION_QTY may be 0, so use total section count instead.
    const allSameHeight = sections.every(h => h === sections[0]);
    const tallestQty = allSameHeight
        ? sections.length
        : Math.ceil(Number(getState("TALLEST_SECTION_QTY"))) || 0;
    const bottomShipsAlone = tallestQty % 2 === 1;

    const used = new Array(sections.length).fill(false);
    let startIndex = 0;

    // BOTTOM RULE: bottom section ships alone only when tallest qty is odd
    if (bottomShipsAlone) {
        result.push({
            sections: [sections[0]],
            indexes: [1],
            weight: calculateSectionShipWeight(sections[0], true),
        });
        used[0] = true;
        startIndex = 1;
    }

    // FORWARD NEAREST MATCH BUNDLING for remaining sections.
    // If pairing would push combined weight >= MAX_BUNDLE_WEIGHT_LBS, ship as singles.
    for (let i = startIndex; i < sections.length; i++) {
        if (used[i]) continue;

        const height = sections[i];
        const isBottom = i === 0;
        const sectionWeight = calculateSectionShipWeight(height, isBottom);

        // Search forward for next same-height section to pair with.
        let pairIndex = -1;
        for (let j = i + 1; j < sections.length; j++) {
            if (!used[j] && sections[j] === height) {
                pairIndex = j;
                break;
            }
        }

        if (pairIndex !== -1) {
            // Neither section in a pair is the bottom (bottom ships alone above),
            // so both are computed with isBottomSection = false.
            const pairWeight =
                calculateSectionShipWeight(height, false) +
                calculateSectionShipWeight(height, false);

            // WEIGHT CAP: only pair if combined weight stays under the cap.
            // While weights are 0 (early render / retainer placeholder) this is
            // always true, so pairing still happens — matching prior behavior.
            if (pairWeight < MAX_BUNDLE_WEIGHT_LBS) {
                result.push({
                    sections: [height, height],
                    indexes: [i + 1, pairIndex + 1],
                    weight: pairWeight,
                });
                used[i] = true;
                used[pairIndex] = true;
                continue;
            }
            // Too heavy to pair — fall through and ship section i as a single.
        }

        // Ship as single
        result.push({
            sections: [height],
            indexes: [i + 1],
            weight: sectionWeight,
        });
        used[i] = true;
    }

    _bundleByHeightCache = result;
    _bundleByHeightCacheKey = _sectionBundleCacheKey;
    return result;
}


// =====================================================================
// SKELETON ENABLED: the Thermatite weight calc below is live (non-glazed).
// One value is still a placeholder pending Bill's calculator:
//   - bottom-retainer rate: currently the Landmark 0.4 lb/ft (see
//     calculateBTMRetainerWeight). Bill indicated this is the component
//     most likely to differ for Thermatite — swap when confirmed.
// The 150 lb pair cap (MAX_BUNDLE_WEIGHT_LBS) is also re-enabled.
// The commented-out Landmark v2 originals below are kept as a reference
// for cross-checking against Bill's numbers.
// =====================================================================

// function calculateRawPanelWeight(sectionHeightInInches) {
//     let RPWeight = getState("DOOR_MODEL") === "A" ? 1.775 : 1.74;
//
//     let width = Number(getState("DOOR_WIDTH_FEET")) || 0;
//     const sectionHeightInFeet = sectionHeightInInches / 12;
//     let areaSqFt = (width * sectionHeightInFeet);
//     const totalWeight = Number((RPWeight * areaSqFt).toFixed(2));
//
//     return totalWeight;
// }

// function calculateEndCaps(sectionHeightInInches) {
//     let getEndCaps = getState("EndCaps");
//     let sectionHeightInFeet = sectionHeightInInches / 12;
//     let weightPerFoot;
//
//     if (getEndCaps === "N") { //case single
//         weightPerFoot = getState("DOOR_MODEL") === "A" ? 1.02 : 1.14;
//     } else {
//         weightPerFoot = getState("DOOR_MODEL") === "A" ? 3.07 : 3.3;
//     }
//
//     return Number((sectionHeightInFeet * weightPerFoot).toFixed(2));
// }

// function calculateBTMRetainer(isBottomSection = true) { //only for bottom section
//     if (!isBottomSection) return 0;
//     const width = Number(getState("DOOR_WIDTH_FEET")) || 0;
//     return Number((width * 0.4).toFixed(2));
// }

// Thermatite weight calculation - mirrors Landmark V2 structure.
// Uses values from weight_controller.js where available, Landmark defaults elsewhere.
// BUSINESS-LOGIC TBD: confirm Thermatite-specific values with Bill.

function calculateRawPanelWeight(sectionHeightInInches) {
    // Panel weight per sq ft. The value lives as a weight="" attribute on the
    // checked COLOR radio (2.2 for all Thermatite colors — see COLOR_DEFS /
    // colorSwatchHTML in load_html.js). NOTE: getNode("COLOR") is the state node,
    // not the <input>, so it has no weight attr — read the radio directly.
    // Falls back to 1.74 (Landmark default) if missing.
    const RPWeight = Number($("input[name='COLOR']:checked").attr("weight")) || 1.74;

    // WIDTH is total width in INCHES and already folds in custom dimensions +
    // inches (DOOR_WIDTH_FEET drops the inches part). Convert to feet here.
    const widthFt = (Number(safeState("WIDTH")) || 0) / 12;
    const sectionHeightInFeet = sectionHeightInInches / 12;
    const areaSqFt = widthFt * sectionHeightInFeet;
    return Number((RPWeight * areaSqFt).toFixed(2));
}

function calculateEndCapsWeight(sectionHeightInInches) {
    // Per-foot end cap weight. Thermatite-specific values from weight_controller.js
    // are per-section (21"/24"), so we derive lbs/ft by dividing by section height in feet.
    // Falls back to Landmark values (1.14 single / 3.3 double) for non-standard heights.
    // The live selection is the radio name="EndCaps": value "0" = single, "1" = double.
    // (The END_CAPS node is unreliable here — undefined during this calc — so we read
    // the input directly.)
    const isDouble = $("input[name='EndCaps']:checked").val() === "1";
    const sectionHeightInFeet = sectionHeightInInches / 12;

    // Lookup table from weight_controller.js (per-piece weight, multiply by 2 for both ends).
    // Section height (inches) → { single, double } per piece.
    const endCapTable = {
        21: { single: 0.921, double: 1.485 },
        24: { single: 1.06,  double: 1.71  },
    };

    const entry = endCapTable[sectionHeightInInches];
    if (entry) {
        const perPiece = isDouble ? entry.double : entry.single;
        return Number((perPiece * 2).toFixed(2));
    }

    // Fallback: per-foot calculation using Landmark rates.
    const weightPerFoot = isDouble ? 3.3 : 1.14;
    return Number((sectionHeightInFeet * weightPerFoot).toFixed(2));
}

function calculateBTMRetainerWeight(isBottomSection) {
    if (!isBottomSection) return 0;
    // WIDTH (inches, custom-dim aware) → feet, so inches aren't dropped.
    const widthFt = (Number(safeState("WIDTH")) || 0) / 12;
    // Landmark uses 0.4 lbs/ft - assume same for Thermatite until confirmed.
    return Number((widthFt * 0.4).toFixed(2));
}

function calculateSectionShipWeight(sectionHeightInInches, isBottomSection = true) {
    if (!sectionHeightInInches) return 0;

    // Early-render guard: during applyDefaults the nodes feeding this calc aren't
    // registered yet. safeState swallows the throw and returns undefined. A
    // missing width makes the whole calc meaningless, so bail to 0 until the
    // form is populated. (WIDTH = total inches, custom-dim aware — same basis
    // the sub-calcs use.)
    const width = Number(safeState("WIDTH"));
    if (!width) return 0;

    // SKELETON — Thermatite weight model (non-glazed). Mirrors Landmark v2.
    // BUSINESS-LOGIC TBD: bottom-retainer rate is still the Landmark 0.4 lb/ft
    // placeholder pending Bill's calculator; glazing (lites) intentionally 0
    // until glazed doors are implemented.
    const RPWeight     = calculateRawPanelWeight(sectionHeightInInches);
    const endCaps      = calculateEndCapsWeight(sectionHeightInInches);
    const btmRetainer  = calculateBTMRetainerWeight(isBottomSection);
    const lites        = 0;     // TBD: glazing weight contribution when glazed doors implemented
    const pckWeight    = 0.15;  // Landmark default packaging weight

    return Number((RPWeight + endCaps + btmRetainer + lites + pckWeight).toFixed(2));
}

// Shared segments b–d for SB / SC / SR descriptions.
// b: <ft>-<in>x<height> (feet zero-padded to 2). c: <model>-<patternNumber>[MR]
// (MR only for Multi Rib). d: <colour abbreviation>. Returns the three joined
// by single spaces — callers prepend their tag (SB prefix / "SC" / "SR") and
// append the conditional segments e/f as needed.
// Per-walk cache of the description fields that are identical across all ~186
// bundle nodes (everything except `height`). Without this, each node re-ran ~5
// jQuery/Sizzle DOM selectors — ~900+ DOM queries per dimension change, which
// is what made the rw() walk take seconds. We read the DOM once and reuse it.
// _descSegmentsToken is bumped whenever any input feeding these fields changes
// (see invalidateDescSegmentsCache), so the cache auto-refreshes.
let _descSegmentsCache = null;
let _descSegmentsToken = 0;
let _descSegmentsCacheToken = -1;

function invalidateDescSegmentsCache() {
    _descSegmentsToken++;
}

function getSharedDescFields() {
    if (_descSegmentsCache && _descSegmentsCacheToken === _descSegmentsToken) {
        return _descSegmentsCache;
    }

    let doorWidthFeet, doorWidthInches;
    if ($("#custom_dimensions").is(":checked")) {
        doorWidthFeet = $("#CUSTOM_WIDTH_FEET").val() || "";
        doorWidthInches = $("#CUSTOM_WIDTH_INCHES").val() || "0";
    } else {
        const $sz = $("input[name='SIZE']:checked");
        doorWidthFeet = $sz.attr("width") || getNode("DOOR_WIDTH_FEET")?.value || "";
        doorWidthInches = $sz.attr("widthInches") || getNode("DOOR_WIDTH_INCHES")?.value || "0";
    }
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorModelDesc = getNode("DOOR_MODEL")?.getAttribute("desc");
    // COLOR radio value is the lowercase key ("iron_ore"); its `desc` attr is the
    // proper name ("Iron Ore") that matches the SB_COLOR_ABBR keys.
    const color = $("input[name='COLOR']:checked").attr("desc") || "";
    const colorShort = SB_COLOR_ABBR[color] || color;

    const patternName = $("input[name='Pattern']:checked").val() || "Standard Rib";
    const reinforce = hasThirdReinforcing() ? "-3" : "";
    const patternSuffix = patternName === "Multi Rib" ? "MR" : "";
    const modelPattern = `${doorModelDesc}${reinforce}${patternSuffix}`;

    _descSegmentsCache = { doorWidthFeet, doorWidthInches, modelPattern, colorShort };
    _descSegmentsCacheToken = _descSegmentsToken;
    return _descSegmentsCache;
}

function buildDescSegmentsBCD(height) {
    // Only `height` varies per node; everything else is shared and cached.
    const { doorWidthFeet, doorWidthInches, modelPattern, colorShort } = getSharedDescFields();
    const size = `${doorWidthFeet}-${doorWidthInches}x${height}`;          // b
    return `${size} ${modelPattern} ${colorShort}`;                        // b c d
}

//function to get the section component desc
// SC <segments b–d> [e] [f] — same segment logic as the SB description, minus
// segment a (the SB-B/-I/etc. prefix): SC is a component nested under the bundle
// (SB -> SC -> SR), so it carries no bundle-type prefix, just the "SC" tag.
function buildSCDescription(height, qty) {

    if (qty <= 0) return "";

    return assembleDesc([
        "SC",
        buildDescSegmentsBCD(height),     // b c d
        buildSectionOptionsText(),        // e (conditional)
        buildEndCapsText(),               // f (conditional)
    ]);
}

//function to get the desc of raw panel
// SR <segments b–d> <g> — raw panel, the leaf of the SB -> SC -> SR tree.
// Reuses the shared b–d block (size / model-pattern / colour) and adds segment g
// (the RP run length). Unlike SB/SC, the raw panel carries NO section-options (e)
// or end-caps (f) segments.
function buildRPDescription(height, qty, isBundleIndex = 0, bundleIndex = 0) {

    if (qty <= 0) return "";

    return assembleDesc([
        buildDescSegmentsBCD(height),     // b c d
        buildRPRunLength(),               // g
    ]);
}

function buildRPRunLength() {
    const width = Number(safeState("WIDTH")) || 0;
    if (width <= 0) return "";
    const fraction = Number(safeState("DOOR_WIDTH_FRACTION")) || 0;
    return String(width + fraction - 0.375);
}

// Raw-panel "BT" description for the SC_RP_BT_DESC boxes.
// Format: <model> <widthFt-In> X <sectionHeight> <colourAbbr>
//   model        : full DOOR_MODEL value, with the leading "T" (e.g. "T150")
//   widthFt-In   : door width feet-inches, feet zero-padded to 2 (e.g. "16-2")
//   X            : literal separator
//   sectionHeight: section height in inches (24 or 21)
//   colourAbbr   : colour abbreviation (e.g. "Wht")
// e.g. T150 / 16'2" / 24" section / White -> "T150 16-2 X 24 Wht"
function buildRPBtDescription(height, qty) {

    if (qty <= 0) return "";

    const model = getNode("DOOR_MODEL")?.getAttribute("value")
        || $("input[name='DOOR_MODEL']:checked").val()
        || "";

    const { doorWidthFeet, doorWidthInches, colorShort } = getSharedDescFields();
    const size = `${doorWidthFeet}-${doorWidthInches}`;

    return assembleDesc([
        model,                  // T150
        size,                   // 16-2
        "X",                    // X
        String(height),         // 24
        colorShort,             // Wht
    ]);
}

// Section-height (inches) -> single-digit code. Thermatite only uses 21 and 24.
const RP_BASE_HEIGHT_CODE = { 21: "1", 24: "4" };

// Colour key -> single-digit code. Only white/brown/silver defined so far;
// remaining colours TBD (they fall through to "" until codes are provided).
const RP_BASE_COLOR_CODE = { white: "1", brown: "2", silver: "4" };

// T200C / U200C top-coil colour letter -> part# is 127-032<letter> (21") /
// 127-033<letter> (24"). U200C shares the map and also allows white (W).
const TOP_COIL_T200C_LETTER = {
    white: "W", brown: "B", bronze: "Z", slate_grey: "C", iron_ore: "V",
    black: "K", sandstone: "T", almond: "A", cafe: "F",
};

// Top-coil qty multiplier per model (qty = multiplier * door width in ft).
// U200C shares T200C's multipliers (same part# series); confirm if it differs.
const TOP_COIL_QTY_MULT = {
    "21": { T150: 1.1542, T175: 1.52205, T200: 1.19150, "T200-20": 2.79247, T300: 1.7303, T200C: 1.16027, U200C: 1.16027 },
    "24": { T150: 1.3116, T175: 1.7261,  T200: 1.3478,  "T200-20": 3.16188, T300: 1.93448, T200C: 1.31254, U200C: 1.31254 },
};

//function to get the raw panel base part#
// Format: {modelCode}{colorCode}-{heightCode}{doorHeightFtIn}
//   modelCode      : DOOR_MODEL with leading "T" stripped (T150 -> 150)
//   colorCode      : selected colour code (white -> 1)
//   heightCode     : section height code (24 -> 4, 21 -> 1)
//   doorHeightFtIn : feet concatenated with inches (no inch padding), whole
//                    string left-padded to 3 digits.
//                    8'2" -> "82"  -> "082"; 10'2" -> "102"; 10'10" -> "1010"
// e.g. T150 / white / 24" section / 8'2" door  ->  "1501-4082"
function buildRPBaseSpNum(height) {
    const modelCode = getModelPartCode();

    const colorKey = $("input[name='COLOR']:checked").val() || "";
    const colorCode = RP_BASE_COLOR_CODE[colorKey] ?? "";

    const heightCode = RP_BASE_HEIGHT_CODE[height] ?? "";

    // Door height (ft + in). Standard SIZE presets don't populate the
    // DOOR_HEIGHT_FEET/INCHES state nodes (those fill from the custom inputs),
    // so read the SIZE radio's attrs in non-custom mode — same source the
    // working door-face description uses (see buildDoorFaceSize).
    let feet, inches;
    if ($("#custom_dimensions").is(":checked")) {
        feet = parseInt($("#CUSTOM_HEIGHT_FEET").val()) || 0;
        inches = parseInt($("#CUSTOM_HEIGHT_INCHES").val()) || 0;
    } else {
        const $sz = $("input[name='SIZE']:checked");
        feet = parseInt($sz.attr("height") || getNode("DOOR_HEIGHT_FEET")?.value) || 0;
        inches = parseInt($sz.attr("heightInches")) || 0;
    }
    const doorHeightFtIn = `${feet}${inches}`.padStart(3, "0");

    return `${modelCode}${colorCode}-${heightCode}-${doorHeightFtIn}`;
}

// RP part# for the BUNDLE_RP1/RP2 boxes.
// Format: {modelCode}{colorCode}-{heightCode}-{doorWidthFt3}
//   heightCode    : section height code (24 -> 4, 21 -> 1)
//   doorWidthFt3  : width feet+inches, no inch padding, padded to 3 (10'2" -> "102")
// e.g. T150 / white / 24" section / 10'2" wide -> "1501-4-102"
function buildRPPartNum(height) {
    const modelCode = getModelPartCode();
    const colorKey = $("input[name='COLOR']:checked").val() || "";
    const colorCode = RP_BASE_COLOR_CODE[colorKey] ?? "";
    const heightCode = RP_BASE_HEIGHT_CODE[height] ?? "";

    let feet, inches;
    if ($("#custom_dimensions").is(":checked")) {
        feet = parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0;
        inches = parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0;
    } else {
        const $sz = $("input[name='SIZE']:checked");
        feet = parseInt($sz.attr("width") || getNode("DOOR_WIDTH_FEET")?.value) || 0;
        inches = parseInt($sz.attr("widthInches")) || 0;
    }
    const doorWidthFtIn = `${feet}${inches}`.padStart(3, "0");

    return `${modelCode}${colorCode}-${heightCode}-${doorWidthFtIn}`;
}

// RP base part# for the BUNDLE_RP_BASE_SPNUM boxes: {model}-{sectionHeight}.
// e.g. T150 / 24" section -> "T150-24". Blank when the section is unused.
function buildRPBasePartNum(height) {
    if (!(height > 0)) return "";
    const model = $("input[name='DOOR_MODEL']:checked").val()
        || getNode("DOOR_MODEL")?.getAttribute("value") || "";
    return `${model}-${height}`;
}

// RP base description: {sectionHeight}" Classic Base. Blank when unused.
function buildRPBaseDesc(height) {
    return height > 0 ? `${height}" Classic Base` : "";
}

//function to get the raw panel top sheet part#
function buildRPTopSpNum(height) {
    const modelCode = getModelPartCode();
    const colorKey = $("input[name='COLOR']:checked").val() || "";
    const colorCode = RP_BASE_COLOR_CODE[colorKey] ?? "";
    return `${modelCode}-${height}-${colorCode}`;
}

// SB-description segment d: door colour -> abbreviation.
// Thermatite Kynar colours are included as storage only; they are NOT offered
// in the configurator yet but the abbreviations are ready for when they are.
const SB_COLOR_ABBR = {
    "Almond":      "Alm",
    "Black":       "Blk",
    "Bronze":      "Brz",
    "Brown":       "Brn",
    "Cafe":        "Cafe",
    "Desert Tan":  "DTan",
    "Iron Ore":    "Ore",
    "Silver":      "Slv",
    "Sandstone":   "Snd",
    "Slate Grey":  "SGr",
    "White":       "Wht",
    // Kynar — storage only, not wired into the configurator.
    "Kynar Beige": "K-Bge",
    "Kynar Ivory": "K-Ivr",
    "Kynar Sepia": "K-Sep",
    "Kynar White": "K-Wht",
};

// Max characters for any section-bundle / component / raw-panel description.
const SB_DESC_MAX_CHARS = 30;

function hasThirdReinforcing() {
    return $("[name='THIRD_REINFORCE']").val() === "Yes";
}

// SB-description segment e (step plate part): StepPlate radio -> text.
// "each" (1 Each Side) = two plates -> "2xSP"; any other non-none -> "SP".
function buildStepPlateText() {
    const sp = $("input[name='StepPlate']:checked").val() || "none";
    if (sp === "none") return "";
    return sp === "each" ? "2xSP" : "SP";
}

function buildExhaustPortText() {
    const view = $("input[name='ExhaustPortView']:checked").val() || "none";
    if (view === "none") return "";

    const size = $("input[name='ExhaustPortSize']:checked").val() || "0";
    if (!["3", "4", "5", "6"].includes(String(size))) return "";

    return view === "each" ? `2x${size}EP` : `${size}EP`;
}

function buildSectionOptionsText() {
    const stepPlate = buildStepPlateText();
    const exhaustPort = buildExhaustPortText();

    if (stepPlate && exhaustPort) return `${stepPlate}+${exhaustPort}`;
    return stepPlate || exhaustPort;
}

function buildEndCapsText() {
    return $("input[name='EndCaps']:checked").val() === "1" ? "DE" : "";
}

// ---------------------------------------------------------------------------
// Door Face (Y-line) description helpers
// ---------------------------------------------------------------------------

function hasGlazing() {
    // GLAZING_TYPE_0 is the only radio left in this group (per-section glazing
    // is picked on the canvas now); checked means "no glazing anywhere".
    return !$("#GLAZING_TYPE_0").is(":checked");
}

function buildDoorTypeText() {
    return hasGlazing() ? "GF" : "DF";
}

function buildDoorFaceSize() {

    let widthFeet, widthInches, fraction, heightFeet, heightInches;
    if ($("#custom_dimensions").is(":checked")) {
        widthFeet    = $("#CUSTOM_WIDTH_FEET").val() || "";
        widthInches  = Number($("#CUSTOM_WIDTH_INCHES").val()) || 0;
        fraction     = Number($("#CUSTOM_WIDTH_FRACTION").val()) || 0;
        heightFeet   = $("#CUSTOM_HEIGHT_FEET").val() || "";
        heightInches = Number($("#CUSTOM_HEIGHT_INCHES").val()) || 0;
    } else {
        const $sz = $("input[name='SIZE']:checked");
        widthFeet    = $sz.attr("width")        || getNode("DOOR_WIDTH_FEET")?.value    || "";
        widthInches  = Number($sz.attr("widthInches"))  || 0;
        fraction     = 0;
        heightFeet   = $sz.attr("height")       || getNode("DOOR_HEIGHT_FEET")?.value   || "";
        heightInches = Number($sz.attr("heightInches")) || 0;
    }
    widthFeet = String(widthFeet).padStart(2, "0");

    // Width inches: append the fractional decimal (2 dp) only when fraction <> 0.
    const widthInchText = fraction !== 0
        ? (widthInches + fraction).toFixed(2)   // 2 + 0.125 -> "2.13"
        : String(widthInches);

    return `${widthFeet}-${widthInchText}x${heightFeet}-${heightInches}`;
}

function buildDoorFaceDescription() {
    const { modelPattern, colorShort } = getSharedDescFields();
    return assembleDesc([
        buildDoorTypeText(),         // a
        buildDoorFaceSize(),         // b
        modelPattern,                // c
        colorShort,                  // d
        buildSectionOptionsText(),   // e (conditional)
        buildEndCapsText(),          // f (conditional)
    ]);
}

// Assemble description segments: drop empty ones, join with single spaces, and
// hard-cap at SB_DESC_MAX_CHARS (30) characters.
function assembleDesc(segments) {
    return segments.filter(Boolean).join(" ").slice(0, SB_DESC_MAX_CHARS);
}

//function to build section bundle desc
function buildSBDescription(prefix, height, qty, isBundleIndex = 0, bundleIndex = 0) {

    if (qty <= 0) return "";

    const bundles = bundleByHeight();
    const bundle = bundles[bundleIndex];
    const isDouble = bundle && bundle.sections.length === 2;

    let sbPrefix;
    if (isBundleIndex === 0) {
        sbPrefix = isDouble ? "SB-BI" : "SB-B";
    } else {
        sbPrefix = isDouble ? "SB-II" : "SB-I";
    }


    return assembleDesc([
        sbPrefix,                         // a
        buildDescSegmentsBCD(height),     // b c d
        buildSectionOptionsText(),        // e (conditional)
        buildEndCapsText(),               // f (conditional)
    ]);
}

const MODEL_CODE_OVERRIDES = {
    "U200C": "U200C",
};

function safeState(id) {
    try {
        return getState(id);
    } catch (e) {
        return undefined;
    }
}

// Round a value UP to the nearest 3" increment (per the ZZ...ALUM-xxx rule).
function roundUpTo3(n) {
    return Math.ceil((Number(n) || 0) / 3) * 3;
}

// "No BOM output" for the 4" PVC bottom seal — blank the BTM_SEAL part#/desc.
// Per Bill, when the 4" PVC seal is the bundled default it must NOT appear
// separately on the BOM. Which combos count as "no output" differ by model:
//   T150 / T150U: 4" PVC has no separate output for ANY retainer
//                 (steel => "BS not required"; pvc => "no output required").
//   T175 / T175U: 4" PVC has no output only with the aluminum retainer ("pvc");
//                 with the steel/PVC retainer it DOES output 152-318.
// (3" Santoprene always outputs ZZBTM-3IN; see BTM_SEAL_SPNUM.)
function isNoSealOutput(seal, model, retainer) {
    if (seal !== "pvc_4_35c") return false;
    if (model === "T150" || model === "T150U") return true;
    if (model === "T175" || model === "T175U") return retainer === "pvc";
    return false;
}

// Bottom Retainer part# for the BOTTOM_RETAINER box.
// DWin = total width in inches = WIDTH (custom-dim aware). Reads the model +
// BottomRetainer radio directly (no state node feeds them).
//
//   retainer "steel" (Bottom seal with PVC retainer)    -> fixed part# per model
//   retainer "pvc"   (Bottom seal with aluminum retainer) -> "ZZ<MODEL>ALUM-" + DWin↑3"
//
// Per Bill, the steel part# and the aluminum-prefix model differ by model:
//   T150 / T150U: steel 328-266, aluminum ZZT150ALUM-###
//   T175 / T175U: steel 328-265, aluminum ZZT175ALUM-###
// Other models not yet specified — return "" (do NOT guess a part#).
const BR_STEEL_PARTNUM = {
    T150: "328-266", T150U: "328-266",
    T175: "328-265", T175U: "328-265",
};
// Aluminum-retainer ZZ-prefix model code (the ### suffix is DWin↑3", padded).
const BR_ALUM_PREFIX_MODEL = {
    T150: "T150", T150U: "T150",
    T175: "T175", T175U: "T175",
};

// T200 / T200-20 / T200U aluminum-retainer ("pvc") part# is a DWin-range lookup
// (first range whose max >= DWin). UP TO 294" is a single part (secondary "").
// Wider doors physically need TWO retainers: a primary 328-207-294 plus a
// secondary, each qty 1 — hence the {primary, secondary} pair below.
const BR_T200_MODELS = ["T200", "T200-20", "T200U"];
const BR_T200_RANGES = [
    { max: 98,  primary: "328-207-098", secondary: "" },
    { max: 122, primary: "328-207-122", secondary: "" },
    { max: 146, primary: "328-207-146", secondary: "" },
    { max: 170, primary: "328-207-170", secondary: "" },
    { max: 194, primary: "328-207-194", secondary: "" },
    { max: 242, primary: "328-207-242", secondary: "" },
    { max: 294, primary: "328-207-294", secondary: "" },
    // Two-part bands: 328-207-294 + a second retainer.
    { max: 392, primary: "328-207-294", secondary: "328-207-098" },
    { max: 416, primary: "328-207-294", secondary: "328-207-122" },
    // Top band capped at 440" (36'8"): the door-width limit is also capped there
    // (see MODEL_WIDTH_LIMITS), so Infinity just guards any width that slips
    // through — anything >416" uses the 440 band's parts.
    { max: Infinity, primary: "328-207-294", secondary: "328-207-146" },
];

// T300 aluminum-retainer ("pvc") part#. Same DWin breakpoints + two-part bands
// as T200, just the 328-212-XXX series. Bill's spec also lists T300-20 / T300U,
// but neither is a selectable DOOR_MODEL in EW (see the radios in load_html.js),
// so they're intentionally omitted — add here if those models are ever added.
// Top band Infinity-guarded; width limit also caps ≤440. Every part is qty 1.
const BR_T300_MODELS = ["T300"];
const BR_T300_RANGES = [
    { max: 98,  primary: "328-212-098", secondary: "" },
    { max: 122, primary: "328-212-122", secondary: "" },
    { max: 146, primary: "328-212-146", secondary: "" },
    { max: 170, primary: "328-212-170", secondary: "" },
    { max: 194, primary: "328-212-194", secondary: "" },
    { max: 242, primary: "328-212-242", secondary: "" },
    { max: 294, primary: "328-212-294", secondary: "" },
    // Two-part bands: 328-212-294 + a second retainer.
    { max: 392, primary: "328-212-294", secondary: "328-212-098" },
    { max: 416, primary: "328-212-294", secondary: "328-212-122" },
    { max: Infinity, primary: "328-212-294", secondary: "328-212-146" },
];

// T200C / U200C aluminum-retainer ("pvc") part#. Uses the 328-790-XXX series
// with its own breakpoints. Note the non-uniform steps and the 261 "outlier"
// at ≤313 before going back to 246 for the wide two-part bands. The ≤390 plus
// part (truncated "328-790-0" in the source doc) is confirmed as 328-790-080.
// U200C reuses the T200C parts (same as the end caps — see baseModelByModel).
const BR_T200C_MODELS = ["T200C", "U200C"];
const BR_T200C_RANGES = [
    { max: 96,  primary: "328-790-080", secondary: "" },
    { max: 108, primary: "328-790-090", secondary: "" },
    { max: 120, primary: "328-790-100", secondary: "" },
    { max: 144, primary: "328-790-120", secondary: "" },
    { max: 168, primary: "328-790-140", secondary: "" },
    { max: 180, primary: "328-790-150", secondary: "" },
    { max: 192, primary: "328-790-160", secondary: "" },
    { max: 216, primary: "328-790-180", secondary: "" },
    { max: 242, primary: "328-790-202", secondary: "" },
    { max: 294, primary: "328-790-246", secondary: "" },
    { max: 313, primary: "328-790-261", secondary: "" },
    // Two-part bands: 328-790-246 + a second retainer.
    { max: 390, primary: "328-790-246", secondary: "328-790-080" },
    { max: 402, primary: "328-790-246", secondary: "328-790-090" },
    { max: 414, primary: "328-790-246", secondary: "328-790-100" },
    { max: Infinity, primary: "328-790-246", secondary: "328-790-120" },
];

// Returns { primary, secondary } part#s for the Bottom Retainer. `secondary` is
// "" for every single-part case; only the wide T200-family bands populate it.
function buildBottomRetainerParts() {
    // Read the model from the LIVE checked radio first. snapBottomRetainer()
    // runs from the DOOR_MODEL change handler, where the radio is already updated
    // but the setState-backed DOOR_MODEL node still holds the PREVIOUS model
    // (the framework's state walk hasn't run yet). Using getState there computed
    // the old model's part — e.g. T300's 328-212-146 lingered after switching to
    // T150. The radio is the synchronous source of truth; state is the fallback.
    const model = $("input[name='DOOR_MODEL']:checked").val()
        || safeState("DOOR_MODEL")
        || getNode("DOOR_MODEL")?.getAttribute("value")
        || "";
    const retainer = $("input[name='BottomRetainer']:checked").val() || "";
    const dwin = Number(safeState("WIDTH")) || 0;
    const none = { primary: "", secondary: "" };

    if (retainer === "steel") {
        return { primary: BR_STEEL_PARTNUM[model] || "", secondary: "" };
    }
    if (retainer === "pvc") {
        // T200 family: DWin-range lookup (may yield two parts).
        if (BR_T200_MODELS.includes(model)) {
            const range = BR_T200_RANGES.find(r => dwin <= r.max);
            return range ? { primary: range.primary, secondary: range.secondary } : none;
        }
        // T300: same breakpoints, 328-212-XXX series.
        if (BR_T300_MODELS.includes(model)) {
            const range = BR_T300_RANGES.find(r => dwin <= r.max);
            return range ? { primary: range.primary, secondary: range.secondary } : none;
        }
        // T200C / U200C: 328-790-XXX series, its own breakpoints.
        if (BR_T200C_MODELS.includes(model)) {
            const range = BR_T200C_RANGES.find(r => dwin <= r.max);
            return range ? { primary: range.primary, secondary: range.secondary } : none;
        }
        // T150/T175 family: ZZ<MODEL>ALUM-### (DWin↑3", zero-padded to 3 digits;
        // matches the part list: 048, 051, ... 372).
        const prefix = BR_ALUM_PREFIX_MODEL[model];
        return prefix
            ? { primary: `ZZ${prefix}ALUM-${String(roundUpTo3(dwin)).padStart(3, "0")}`, secondary: "" }
            : none;
    }

    // TODO: the non-spec retainer options (ChannelCap, Galvanized,
    // Aluminum-only, None) pending part#s.
    return none;
}

// Back-compat: the primary part# only.
function buildBottomRetainerSpNum() {
    return buildBottomRetainerParts().primary;
}

// Bottom Retainer qty for the TM_BOTTOM_RETAINER_QTY box. Same inputs as
// buildBottomRetainerParts (model + retainer + WIDTH/DWin). Default is qty 1
// whenever a primary retainer part exists ("" otherwise); the T150/T150U and
// T175/T175U families have a DWft-dependent qty on the PVC retainer ("steel")
// path. The aluminum ("pvc") retainer part is implicitly qty 1; its DWft+0.5
// "FT" qty in the spec is the BOTTOM SEAL qty (BTM_SEAL_QTY), not this box.
//
// Qty rounds to 2 decimals. NOTE: use WIDTH/12 for DWft, not DOOR_WIDTH_FEET,
// which drops the inches part (so 16'4" would read as 16, not 16.33).
//
// T150 / T150U, PVC retainer (part# 328-266):
//   DWft <= 16.33 -> DWft / 23.33   |   else (T150 max DWft = 20.17) -> 1
// T175 / T175U, PVC retainer (part# 328-265):
//   DWft <= 12.17 -> DWft / 19.33   |   DWft <= 20.33 -> 1   |   else -> DWft / 19.33
function buildBottomRetainerQty() {
    const parts = buildBottomRetainerParts();
    if (!parts.primary) return "";

    // Read the live checked radio first (state node lags on model change) —
    // same as buildBottomRetainerParts.
    const model = $("input[name='DOOR_MODEL']:checked").val()
        || safeState("DOOR_MODEL")
        || getNode("DOOR_MODEL")?.getAttribute("value")
        || "";
    const retainer = $("input[name='BottomRetainer']:checked").val() || "";

    const round2 = (n) => Math.round(n * 100) / 100;
    const dwft = (Number(safeState("WIDTH")) || 0) / 12;

    if (retainer === "steel" && (model === "T150" || model === "T150U")) {
        return dwft <= 16.33 ? round2(dwft / 23.33) : 1;
    }
    if (retainer === "steel" && (model === "T175" || model === "T175U")) {
        if (dwft <= 12.17) return round2(dwft / 19.33);
        if (dwft <= 20.33) return 1;
        return round2(dwft / 19.33);
    }

    // Everything else — incl. T200/T200-20/T200U & T300/T200C/U200C on the
    // aluminum ("pvc") retainer — is qty 1 per part (both the primary and the
    // wide-door plus/secondary retainer each ship qty 1).
    return 1;
}

function getModelPartCode() {

    const model = getNode("DOOR_MODEL")?.getAttribute("value")
        || $("input[name='DOOR_MODEL']:checked").val()
        || "";
    if (MODEL_CODE_OVERRIDES[model]) return MODEL_CODE_OVERRIDES[model];
    return model.substring(1);
}

//function to create raw panel part#
function buildRPSPNum(height, suffix = "01") {

    const doorModelId = getModelPartCode();

    return height > 0
        ? `SR${doorModelId}${suffix}`
        : "None";

}
