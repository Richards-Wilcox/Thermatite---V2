function addSectionBundleDrivers() {

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

    addLogic("YLINE_DESC", function () {
        const doorType = "DF"
        let color = getState("COLOR").desc;
        let doorModel = getNode("DOOR_MODEL").getAttribute("desc")
        let panelStyle = getNode("FACE").getAttribute("desc");
        let num_of_sec = getState("NUM_OF_SEC");

        this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-0x${getState("DOOR_HEIGHT_FEET")}-0(${num_of_sec}) ${doorModel} ${color} ${panelStyle}`
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "customSwitch", "FACE"])


    addLogic("T_DOOR_MODEL", function () {
        this.value = $("input[name='DOOR_MODEL']:checked").val() || "";
    }, ["DOOR_MODEL"])

    //each section heights
    addLogic("BTM_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 1 ? (sections[0] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT1_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 2 ? (sections[1] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT2_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 3 ? (sections[2] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT3_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 4 ? (sections[3] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT4_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 5 ? (sections[4] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT5_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 6 ? (sections[5] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT6_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 7 ? (sections[6] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT7_SECTION", function () {
        const sections = getSectionBundle();
        this.value = Number(getState("NUM_OF_SEC")) >= 8 ? (sections[7] ?? "") : "";
    }, SECTION_DEPS)

    addLogic("INT8_SECTION", function () {
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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_3_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_4_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_5_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_6_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_7_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_8_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE_9_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])


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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", DIMENSION_DEPS, "HEIGHT", "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE"])

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

    }, ["WIDTH", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", DIMENSION_DEPS, "HEIGHT", "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE4_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE4_SC2_QTY"])

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

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE5_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE5_SC1_QTY"])

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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE6_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE6_SC1_QTY"])

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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE7_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE7_SC1_QTY"])

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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE8_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE8_SC1_QTY"])

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
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "BUNDLE9_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE9_SC1_QTY"])


    //Raw panel Part# and Desc for Each bundle
    // set bundle 1 rp1 part#
    addLogic("BUNDLE1_RP1_SPNUM", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // set bundle1 rp1 desc
    addLogic("BUNDLE1_RP1_DESC", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        const qty = getState("BUNDLE1_SC1_QTY");

        this.value = buildRPDescription(height, qty, 0, 0);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY"])

    // set bundle 1 rp2 part#
    addLogic("BUNDLE1_RP2_SPNUM", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // set bundle 1 rp2 desc
    addLogic("BUNDLE1_RP2_DESC", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        const qty = getState("BUNDLE1_SC2_QTY");

        this.value = buildRPDescription(height, qty, 0, 0);
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY"])

    // bundle2 rp1 part#
    addLogic("BUNDLE2_RP1_SPNUM", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // bundle 2 rp1 desc
    addLogic("BUNDLE2_RP1_DESC", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        const qty = getState("BUNDLE2_SC1_QTY");

        this.value = buildRPDescription(height, qty, 1, 1);
    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY"])

    // bundle 2 rp2 part#
    addLogic("BUNDLE2_RP2_SPNUM", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // bundle 2 rp2 desc
    addLogic("BUNDLE2_RP2_DESC", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        const qty = getState("BUNDLE2_SC2_QTY");

        this.value = buildRPDescription(height, qty, 1, 1);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY"])

    //bundle 3 rp1 part#
    addLogic("BUNDLE3_RP1_SPNUM", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp1 desc
    addLogic("BUNDLE3_RP1_DESC", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        const qty = getState("BUNDLE3_SC1_QTY");

        this.value = buildRPDescription(height, qty, 2, 2);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY"])

    //bundle3 rp2 
    addLogic("BUNDLE3_RP2_SPNUM", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp2 desc
    addLogic("BUNDLE3_RP2_DESC", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        const qty = getState("BUNDLE3_SC2_QTY");

        this.value = buildRPDescription(height, qty, 2, 2);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY"])

    //BUNDLE 4
    //BUNDLE4 RP1    
    addLogic("BUNDLE4_RP1_SPNUM", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE4 RP1 DESC
    addLogic("BUNDLE4_RP1_DESC", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        const qty = getState("BUNDLE4_SC1_QTY");

        this.value = buildRPDescription(height, qty, 3, 3);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY"])

    //bundle4 RP2 PART#
    addLogic("BUNDLE4_RP2_SPNUM", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    //BUNDLE4 RP2 DESC
    addLogic("BUNDLE4_RP2_DESC", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        const qty = getState("BUNDLE4_SC2_QTY");

        this.value = buildRPDescription(height, qty, 3, 3);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE4_SC2_HEIGHT", "BUNDLE4_SC2_QTY"])

    //BUNDLE 5
    //BUNDLE5 RP1    
    addLogic("BUNDLE5_RP1_SPNUM", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL", "BUNDLE5_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE5 RP1 DESC
    addLogic("BUNDLE5_RP1_DESC", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        const qty = getState("BUNDLE5_SC1_QTY");

        this.value = buildRPDescription(height, qty, 4, 4);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE5_SC1_HEIGHT", "BUNDLE5_SC1_QTY"])

    //BUNDLE 6
    //BUNDLE6 RP1    
    addLogic("BUNDLE6_RP1_SPNUM", function () {

        const height = getState("BUNDLE6_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE6_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE6 RP1 DESC
    addLogic("BUNDLE6_RP1_DESC", function () {
        const height = getState("BUNDLE6_SC1_HEIGHT");
        const qty = getState("BUNDLE6_SC1_QTY");

        this.value = buildRPDescription(height, qty, 5, 5);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE6_SC1_HEIGHT", "BUNDLE6_SC1_QTY"])

    //BUNDLE 7
    //BUNDLE7 RP1    
    addLogic("BUNDLE7_RP1_SPNUM", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE7_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE7 RP1 DESC
    addLogic("BUNDLE7_RP1_DESC", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        const qty = getState("BUNDLE7_SC1_QTY");

        this.value = buildRPDescription(height, qty, 6, 6);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE7_SC1_HEIGHT", "BUNDLE7_SC1_QTY"])

    //BUNDLE 8
    //BUNDLE8 RP1    
    addLogic("BUNDLE8_RP1_SPNUM", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE8_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE8 RP1 DESC
    addLogic("BUNDLE8_RP1_DESC", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        const qty = getState("BUNDLE8_SC1_QTY");

        this.value = buildRPDescription(height, qty, 7, 7);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE8_SC1_HEIGHT", "BUNDLE8_SC1_QTY"])

    //BUNDLE 9
    //BUNDLE9 RP1    
    addLogic("BUNDLE9_RP1_SPNUM", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE9_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE9 RP1 DESC
    addLogic("BUNDLE9_RP1_DESC", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        const qty = getState("BUNDLE9_SC1_QTY");
        this.value = buildRPDescription(height, qty, 8, 8);

    }, ["WIDTH", DIMENSION_DEPS, "HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "Pattern", "SIZE", "BUNDLE9_SC1_HEIGHT", "BUNDLE9_SC1_QTY"])


    // RP BASE Part# for each section
    //Bundle 1
    addLogic("BUNDLE1_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);
    }, ["DOOR_MODEL", "BUNDLE1_SC1_HEIGHT"])

    addLogic("BUNDLE1_SC2_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = buildRPBaseSpNum(height);
    }, ["DOOR_MODEL", "BUNDLE1_SC2_HEIGHT"])

    //Bundle 2
    addLogic("BUNDLE2_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE2_SC1_HEIGHT"])

    addLogic("BUNDLE2_SC2_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE2_SC2_HEIGHT"])

    //Bundle 4
    addLogic("BUNDLE3_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    //Bundle 4
    addLogic("BUNDLE4_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE4_SC1_HEIGHT", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");

        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    //Bundle5
    addLogic("BUNDLE5_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);
    }, ["DOOR_MODEL", "BUNDLE5_SC1_HEIGHT", DIMENSION_DEPS])

    //Bundle6
    addLogic("BUNDLE6_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE6_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE6_SC1_HEIGHT", DIMENSION_DEPS])

    //Bundle7
    addLogic("BUNDLE7_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE7_SC1_HEIGHT", DIMENSION_DEPS])

    //Bundle8
    addLogic("BUNDLE8_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE8_SC1_HEIGHT", DIMENSION_DEPS])

    //Bundle9
    addLogic("BUNDLE9_SC1_RP_BASE_SPNUM", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        this.value = buildRPBaseSpNum(height);

    }, ["DOOR_MODEL", "BUNDLE9_SC1_HEIGHT", DIMENSION_DEPS])


    addLogic("RP_BASE_QTY", function () {
        this.value = getState("WIDTH");
    }, ["WIDTH"])

    //RP Top Sheets part# and Desc for each section
    //Bundle 1
    addLogic("BUNDLE1_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE1_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE1_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE1_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE1_SC2_HEIGHT", "COLOR"])

    //Bundle 2
    addLogic("BUNDLE2_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE2_SC1_HEIGHT", "COLOR"])

    addLogic("BUNDLE2_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE2_SC2_HEIGHT", "COLOR"])

    //Bundle 3
    addLogic("BUNDLE3_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE3_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE3_SC2_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE3_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 4
    addLogic("BUNDLE4_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE4_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE4_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE4_SC2_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE4_SC2_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 5
    addLogic("BUNDLE5_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE5_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE5_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 6
    addLogic("BUNDLE6_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE6_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE6_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 7
    addLogic("BUNDLE7_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE7_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE7_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 8
    addLogic("BUNDLE8_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE8_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE8_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])

    //Bundle 9
    addLogic("BUNDLE9_SC1_RP_TOP_SHEET_SPNUM", function () {
        let height = getState("BUNDLE9_SC1_HEIGHT");
        this.value = buildRPTopSpNum(height)
    }, ["BUNDLE9_SC1_HEIGHT", "COLOR", DIMENSION_DEPS])


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

    addLogic("BTM_SEAL_QTY", function () {
        let width = getState("WIDTH");
        this.value = ((Number(width) / 12) + 0.5)
    }, ["WIDTH"])

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

}

function getEndCapsPartNum(section_height, door_model, end_caps) {

    const partNumbers = {
        A: { // L138
            N: { // Single
                18: '426-0800',
                21: '426-0801',
                24: '426-0802'
            },
            Y: { // Double
                18: '426-0805',
                21: '426-0806',
                24: '426-0807'
            }
        },
        D: { // L200 (any non-"A" model)
            N: {
                18: '426-0810',
                21: '426-0811',
                24: '426-0812'
            },
            Y: {
                18: '426-0815',
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

function getSectionHeight(height, num_of_sec) {
    let stackChart = getStackChart();
    let configArray = stackChart[String(height)];
    if (!configArray) return undefined;

    for (let i = 0; i < configArray.length; i++) {
        const item = configArray[i];
        if (Number(item.num_sections) === Number(num_of_sec)) {
            // return item.btm_section_height;
            return item;
        }
    }
}

// Pull the individual section heights out of a stack-chart entry.
// Entry keys are top_section_height / btm_section_height / int*_height,
// all in inches and always one of 18 / 21 / 24.
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
function resolveSectionHeights() {
    const doorHeight = Number(getState("HEIGHT")) || 0;
    const numOfSec = Number(getState("NUM_OF_SEC")) || 0;

    // Arithmetic estimate (3" granularity) — kept as the cross-check / fallback.
    const per = numOfSec > 0 ? doorHeight / numOfSec : 0;
    const arithTallest = Math.ceil(per / 3) * 3;
    const arithShortest = Math.floor(per / 3) * 3;

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
        return { tallest, shortest, tallestQty, shortestQty, source: "chart" };
    }

    // No chart entry — fall back to arithmetic (clamped so an out-of-range
    // NUM_OF_SEC can't produce a section taller than the chart ever allows).
    const tallest = Math.min(arithTallest, 24);
    const shortest = arithShortest;
    const diff = per - shortest;
    const shortestQty = Math.round((1 - diff / 3) * numOfSec) || 0;
    const tallestQty = Math.max(numOfSec - shortestQty, 0);

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
    return { tallest, shortest, tallestQty, shortestQty, source: "arithmetic" };
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

// function bundleByHeight() {

//     const width = Number(getState("WIDTH"));

//     const shortest = Number(getState("SHORTEST_SECTION"));
//     const sQty = Number(getState("SHORTEST_SECTIONS_QTY"));

//     const tallest = Number(getState("TALLEST_SECTION"));
//     const tQty = Number(getState("TALLEST_SECTION_QTY"));

//     const result = [];


//     //  (width >= 199)
//     if (width >= 199) {

//         const allSections = [];

//         // expand tallest
//         for (let i = 0; i < tQty; i++) {
//             allSections.push(tallest);
//         }

//         // expand shortest
//         for (let i = 0; i < sQty; i++) {
//             allSections.push(shortest);
//         }

//         return allSections
//             .sort((a, b) => b - a) // tallest → shortest
//             .map(h => ({
//                 sections: [h],
//                 weight: calculateSectionShipWeight(h, false)
//             }));
//     }


//     // (width < 199)
//     if (tQty === 1) {
//         // single tallest will go last (handled later)
//     }

//     else if (tQty > 1 && tQty % 2 === 1) {

//         // 1️⃣ first tallest single
//         result.push({
//             sections: [tallest],
//             weight: calculateSectionShipWeight(tallest, false)
//         });

//         // 2️⃣ remaining pairs
//         let remaining = tQty - 1;

//         while (remaining >= 2) {
//             result.push({
//                 sections: [tallest, tallest],
//                 weight:
//                     calculateSectionShipWeight(tallest, false) +
//                     calculateSectionShipWeight(tallest, true)
//             });
//             remaining -= 2;
//             console.log("1", result);
//         }
//     }

//     else if (tQty > 1 && tQty % 2 === 0) {

//         let remaining = tQty;

//         while (remaining >= 2) {
//             result.push({
//                 sections: [tallest, tallest],
//                 weight:
//                     calculateSectionShipWeight(tallest, false) +
//                     calculateSectionShipWeight(tallest, true)
//             });
//             remaining -= 2;
//         }
//     }

//     // =========================
//     // STEP 2: SHORTEST RULES
//     // =========================

//     let sRemaining = sQty;

//     while (sRemaining >= 2) {
//         result.push({
//             sections: [shortest, shortest],
//             weight:
//                 calculateSectionShipWeight(shortest, false) +
//                 calculateSectionShipWeight(shortest, true)
//         });
//         sRemaining -= 2;
//     }

//     if (sRemaining === 1) {
//         result.push({
//             sections: [shortest],
//             weight: calculateSectionShipWeight(shortest, false)
//         });
//     }

//     // =========================
//     // STEP 3: SINGLE TALLEST LAST (ONLY IF 1)
//     // =========================

//     if (tQty === 1) {
//         result.push({
//             sections: [tallest],
//             weight: calculateSectionShipWeight(tallest, false)
//         });
//     }

//     console.log("result", result);
//     return result;
// }

// Maximum bundle weight in pounds. Pairs whose combined ship weight would
// meet or exceed this cap must ship as singles instead.
const MAX_BUNDLE_WEIGHT_LBS = 150;

function bundleByHeight() {

    // Thermatite bundling rules (based on Landmark v2):
    // - Width >= 199: All sections ship alone (no bundling)
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

    // WIDTH RULE: ship every section alone if width >= 199
    if (width >= 199) {
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

//function to get the section component desc
// Mirrors Landmark's buildSCDescription format
//   SC <ft>-<in>x<height> <model> <color> <panelStyle> <DE>
// but sourced the Thermatite way: custom-dim-aware width, COLOR/Pattern radios,
// and the EndCaps radio ("1" = double) instead of Landmark's .desc/FACE/"Y".
function buildSCDescription(height, qty) {

    if (qty <= 0) return "";

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
    const colorRaw = $("input[name='COLOR']:checked").val() || "";
    const color = colorRaw ? String(colorRaw).charAt(0).toUpperCase() + String(colorRaw).slice(1) : "";
    const panelStyle = $("input[name='Pattern']:checked").val() || "Standard Rib";

    const colorShortMap = {
        "White":      "Wht",
        "Brown":      "Brn",
        "Silver":     "Slv",
        "Bronze":     "Brnz",
        "Slate Grey": "SltGry",
        "Iron Ore":   "IronOre",
        "Black":      "Blk",
        "Sandstone":  "Sand",
        "Almond":     "Alm",
        "Cafe":       "Caf"
    };
    const colorShort = colorShortMap[color] || color;

    const doubleEndCaps = $("input[name='EndCaps']:checked").val() === "1" ? "DE" : "";

    return `SC ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${colorShort} ${panelStyle} ${doubleEndCaps}`;
}

//function to get the desc of raw panel 
function buildRPDescription(height, qty, isBundleIndex = 0, bundleIndex = 0) {

    if (qty <= 0) return "";

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
    const colorRaw = $("input[name='COLOR']:checked").val() || "";
    const color = colorRaw ? String(colorRaw).charAt(0).toUpperCase() + String(colorRaw).slice(1) : "";
    const panelStyle = $("input[name='Pattern']:checked").val() || "Standard Rib";

    const colorShortMap = {
        "White":      "Wht",
        "Brown":      "Brn",
        "Silver":     "Slv",
        "Bronze":     "Brnz",
        "Slate Grey": "SltGry",
        "Iron Ore":   "IronOre",
        "Black":      "Blk",
        "Sandstone":  "Sand",
        "Almond":     "Alm",
        "Cafe":       "Caf"
    };
    const colorShort = colorShortMap[color] || color;

    // Flat Landmark format: SR <ft>-<in>x<h> <model> <color> <panelStyle>.
    // (No Btm/Int or SR-B/SR-BI prefixing — matches buildRPDescription in exmaple.js.)
    return `SR ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${colorShort} ${panelStyle}`;
}

//function to get the raw panel base part#
function buildRPBaseSpNum(height) {
    const doorModelId = $("input[name='DOOR_MODEL']:checked").val() || "";
    return `${doorModelId}-${height}`;
}

//function to get the raw panel top sheet part#
function buildRPTopSpNum(height) {
    const color = getState("COLOR").value;
    return `LND-${height}${color}`;
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

// SB-description segment c: fixed pattern -> number, keyed by pattern NAME (the
// number is fixed per pattern, not by its position in a model's pattern list).
// Only Multi Rib also carries the "MR" suffix (segment c -> e.g. "T150-2MR").
// BUSINESS-LOGIC TBD: Flush (4) / Plank (5) numbers are assumed — confirm with Bill.
const SB_PATTERN_NUMBER = {
    "Standard Rib":   1,
    "Multi Rib":      2,
    "Raynor Profile": 3,
    "Flush":          4,
    "Plank":          5,
};

// SB-description segment e (step plate part): StepPlate radio -> text.
// "each" (1 Each Side) = two plates -> "2xSP"; any other non-none -> "SP".
function buildStepPlateText() {
    const sp = $("input[name='StepPlate']:checked").val() || "none";
    if (sp === "none") return "";
    return sp === "each" ? "2xSP" : "SP";
}

// SB-description segment e (exhaust port part): ExhaustPortView + ExhaustPortSize.
// "each" (1 Each Side) -> "2x{size}EP"; any other non-none -> "{size}EP".
// Sizes 3/4/5/6 are supported; 5" is programmed in but not yet offered in the UI.
// Size "0" (or any unrecognised size) yields no text.
function buildExhaustPortText() {
    const view = $("input[name='ExhaustPortView']:checked").val() || "none";
    if (view === "none") return "";

    const size = $("input[name='ExhaustPortSize']:checked").val() || "0";
    if (!["3", "4", "5", "6"].includes(String(size))) return "";

    return view === "each" ? `2x${size}EP` : `${size}EP`;
}

// SB-description segment e: section options (step plate / exhaust port).
// Both present -> step-plate text + "+" + exhaust-port text (no surrounding
// spaces), e.g. "2xSP+2x4EP". Glazing/lites (e.g. "5xE") are deferred until
// glazing is implemented.
function buildSectionOptionsText() {
    const stepPlate = buildStepPlateText();
    const exhaustPort = buildExhaustPortText();

    if (stepPlate && exhaustPort) return `${stepPlate}+${exhaustPort}`;
    return stepPlate || exhaustPort;
}

// SB-description segment f: double end caps -> "DE", single -> nothing.
// EndCaps radio value "1" = double.
function buildEndCapsText() {
    return $("input[name='EndCaps']:checked").val() === "1" ? "DE" : "";
}

//function to build section bundle desc
function buildSBDescription(prefix, height, qty, isBundleIndex = 0, bundleIndex = 0) {

    if (qty <= 0) return "";

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
    const colorRaw = $("input[name='COLOR']:checked").val() || "";
    const color = colorRaw ? String(colorRaw).charAt(0).toUpperCase() + String(colorRaw).slice(1) : "";
    const colorShort = SB_COLOR_ABBR[color] || color;

    // Segment c: model + pattern number, with "MR" suffix for Multi Rib only.
    const patternName = $("input[name='Pattern']:checked").val() || "Standard Rib";
    const patternNumber = SB_PATTERN_NUMBER[patternName] ?? "";
    const patternSuffix = patternName === "Multi Rib" ? "MR" : "";
    const modelPattern = `${doorModelDesc}-${patternNumber}${patternSuffix}`;

    // Segment a: bundle type. A bundle is a "double" when it pairs two sections.
    // SB-B / SB-BI = bottom single / double, SB-I / SB-II = intermediate.
    // SB-T / SB-TI (top) and SB-G / SB-GG / SB-IG (glazed) are defined here but
    // dormant: top-section detection and glazing are not implemented yet.
    const bundles = bundleByHeight();
    const bundle = bundles[bundleIndex];
    const isDouble = bundle && bundle.sections.length === 2;

    let sbPrefix;
    if (isBundleIndex === 0) {
        sbPrefix = isDouble ? "SB-BI" : "SB-B";
    } else {
        sbPrefix = isDouble ? "SB-II" : "SB-I";
    }

    // Segments a–d are always present; e (section options) and f (end caps) are
    // conditional. Join with single spaces, dropping any empty conditional segment.
    const segments = [
        sbPrefix,                                            // a
        `${doorWidthFeet}-${doorWidthInches}x${height}`,     // b
        modelPattern,                                        // c
        colorShort,                                          // d
        buildSectionOptionsText(),                           // e (conditional)
        buildEndCapsText(),                                  // f (conditional)
    ];

    return segments.filter(Boolean).join(" ");
}

// Maps the selected DOOR_MODEL to the part-number code segment used in
// SB*/SR* part numbers. The convention is to drop the leading mount letter
// (T150 -> 150, T200C -> 200C, etc.), but a few models need explicit codes
// because the naive strip would collide or lose information. Notably:
//   U200C -> "U200C"  (NOT "200C": that strip collides with T200C; the
//                       designated part# is SBU200C0x, i.e. the full model name)
// Add future exceptions to MODEL_CODE_OVERRIDES rather than special-casing
// individual blocks.
const MODEL_CODE_OVERRIDES = {
    "U200C": "U200C",
};

// getState throws when a node isn't registered yet. During applyDefaults / early
// render, weight + description logic can run before every dependency node exists.
// safeState delegates to the framework's own getState (so DOM-backed nodes like
// DOOR_WIDTH_FEET / END_CAPS / COLOR resolve correctly — reimplementing the read
// via nodeset[id].value misses those) but swallows the early-render throw and
// returns undefined so callers can guard cleanly.
function safeState(id) {
    try {
        return getState(id);
    } catch (e) {
        return undefined;
    }
}

function getModelPartCode() {
    const model = $("input[name='DOOR_MODEL']:checked").val() || "";
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