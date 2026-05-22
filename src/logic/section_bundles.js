//This file contains all the inputs related to section bundle and raw panel.
//Author Name: Charmi Surati
//Last Modify Date: May 14, 2026


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
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle1_qty = getState("BUNDLE_1_QTY");
        this.value = bundle1_qty > 0 ? `SB${doorModelId}01` : 'None';
    }, ["DOOR_MODEL", "BUNDLE_1_QTY"])

    addLogic("SB1_DESC", function () {
        // let doorWidthFeet = getState("DOOR_WIDTH_FEET");
        // doorWidthFeet = String(doorWidthFeet).padStart(2, "0");
        // let doorWidthInches = getState("DOOR_WIDTH_INCHES");
        // let doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc")
        // let color = getState("COLOR").desc;
        // let panelStyle = getNode("FACE").getAttribute("desc");
        // let bundle1_height = getState("BUNDLE_1_HEIGHT");
        // const end_caps = getState("EndCaps");
        // const double_end_caps = end_caps === 'Y' ? 'DE' : '';
        // const TALLEST_SECTION_QTY = getState('TALLEST_SECTION_QTY');
        // let prefix = bundle1_height < 32
        //     ? 'SB-B'
        //     : 'SB-BI';
        // this.value = `${prefix} ${doorWidthFeet}-${doorWidthInches}x${bundle1_height} ${doorModelDesc} ${color} ${panelStyle} ${double_end_caps}`;
        const height = getState("BUNDLE_1_HEIGHT");
        const qty = getState("BUNDLE_1_QTY");

        const prefix = getSBPrefix("SB1", height);

        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB2
    addLogic("SB2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle2_qty = getState("BUNDLE_2_QTY");
        this.value = bundle2_qty > 0 ? `SB${doorModelId}02` : 'None';
    }, ["DOOR_MODEL", "BUNDLE_2_QTY"])

    addLogic("SB2_DESC", function () {
        const height = getState("BUNDLE_2_HEIGHT");
        const qty = getState("BUNDLE_2_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);
    }, [DIMENSION_DEPS, "BUNDLE_2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB3
    addLogic("SB3_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_qty = getState("BUNDLE_3_QTY");
        this.value = bundle3_qty > 0 ? `SB${doorModelId}03` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_3_QTY"])

    addLogic("SB3_DESC", function () {
        const height = getState("BUNDLE_3_HEIGHT");
        const qty = getState("BUNDLE_3_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_3_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 4
    addLogic("SB4_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_qty = getState("BUNDLE_4_QTY");
        this.value = bundle4_qty > 0 ? `SB${doorModelId}04` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_4_QTY"])

    addLogic("SB4_DESC", function () {
        const height = getState("BUNDLE_4_HEIGHT");
        const qty = getState("BUNDLE_4_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_4_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 5
    addLogic("SB5_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle5_qty = getState("BUNDLE_5_QTY");
        this.value = bundle5_qty > 0 ? `SB${doorModelId}05` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_5_QTY"])

    addLogic("SB5_DESC", function () {
        const height = getState("BUNDLE_5_HEIGHT");
        const qty = getState("BUNDLE_5_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_5_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 6
    addLogic("SB6_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle6_qty = getState("BUNDLE_6_QTY");
        this.value = bundle6_qty > 0 ? `SB${doorModelId}06` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_6_QTY"])

    addLogic("SB6_DESC", function () {
        const height = getState("BUNDLE_6_HEIGHT");
        const qty = getState("BUNDLE_6_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_6_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 7
    addLogic("SB7_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle7_qty = getState("BUNDLE_7_QTY");
        this.value = bundle7_qty > 0 ? `SB${doorModelId}07` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_7_QTY"])

    addLogic("SB7_DESC", function () {
        const height = getState("BUNDLE_7_HEIGHT");
        const qty = getState("BUNDLE_7_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_7_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 8
    addLogic("SB8_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle8_qty = getState("BUNDLE_8_QTY");
        this.value = bundle8_qty > 0 ? `SB${doorModelId}08` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_8_QTY"])

    addLogic("SB8_DESC", function () {
        const height = getState("BUNDLE_8_HEIGHT");
        const qty = getState("BUNDLE_8_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_8_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SB 9
    addLogic("SB9_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle9_qty = getState("BUNDLE_9_QTY");
        this.value = bundle9_qty > 0 ? `SB${doorModelId}09` : 'None';
    }, ["DOOR_MODEL", "WIDTH", "HEIGHT", "NUM_OF_SEC", "BUNDLE_9_QTY"])

    addLogic("SB9_DESC", function () {
        const height = getState("BUNDLE_9_HEIGHT");
        const qty = getState("BUNDLE_9_QTY");
        const prefix = getSBPrefix("DEFAULT", height);
        this.value = buildSBDescription(prefix, height, qty);

    }, [DIMENSION_DEPS, "BUNDLE_9_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])


    //Section Components part# and Desc for each bundle
    //SC1
    addLogic("BUNDLE1_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle1_sc1_qty = getState("BUNDLE1_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[0] ? bundles[0].indexes[0] : '';
        this.value = bundle1_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE1_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC1_DESC", function () {
        const height = getState("BUNDLE1_SC1_HEIGHT");
        const qty = getState("BUNDLE1_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    addLogic("BUNDLE1_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle1_sc2_qty = getState("BUNDLE1_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[0] ? bundles[0].indexes[1] : '';

        this.value = bundle1_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE1_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE1_SC2_DESC", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        const qty = getState("BUNDLE1_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SC2
    addLogic("BUNDLE2_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle2_sc1_qty = getState("BUNDLE2_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[1] ? bundles[1].indexes[0] : '';

        this.value = bundle2_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE2_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC1_DESC", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        const qty = getState("BUNDLE2_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    addLogic("BUNDLE2_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle2_sc2_qty = getState("BUNDLE2_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[1] ? bundles[1].indexes[1] : '';

        this.value = bundle2_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE2_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE2_SC2_DESC", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        const qty = getState("BUNDLE2_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //SC 3
    addLogic("BUNDLE3_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc1_qty = getState("BUNDLE3_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[2] ? bundles[2].indexes[0] : '';

        this.value = bundle3_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE3_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC1_DESC", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        const qty = getState("BUNDLE3_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["DOOR_MODEL", "COLOR", "FACE", DIMENSION_DEPS, "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY", "EndCaps"])

    addLogic("BUNDLE3_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle3_sc2_qty = getState("BUNDLE3_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[2] ? bundles[2].indexes[1] : '';

        this.value = bundle3_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';

    }, ["DOOR_MODEL", "BUNDLE3_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE3_SC2_DESC", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        const qty = getState("BUNDLE3_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY", "DOOR_MODEL", "COLOR", "FACE", "EndCaps"])

    //sc 4
    addLogic("BUNDLE4_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_sc1_qty = getState("BUNDLE4_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[3] ? bundles[3].indexes[0] : '';

        this.value = bundle4_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE4_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC1_DESC", function () {
        const height = getState("BUNDLE4_SC1_HEIGHT");
        const qty = getState("BUNDLE4_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, ["DOOR_MODEL", "COLOR", "FACE", DIMENSION_DEPS, "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY", "EndCaps"])

    addLogic("BUNDLE4_SC2_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle4_sc2_qty = getState("BUNDLE4_SC2_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[3] ? bundles[3].indexes[1] : '';

        this.value = bundle4_sc2_qty > 0 ? `SC${doorModelId}0${index}` : 'None';

    }, ["DOOR_MODEL", "BUNDLE4_SC2_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE4_SC2_DESC", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        const qty = getState("BUNDLE4_SC2_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE4_SC2_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE4_SC2_QTY"])

    //sc 5
    addLogic("BUNDLE5_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle5_sc1_qty = getState("BUNDLE5_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[4] ? bundles[4].indexes[0] : '';

        this.value = bundle5_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE5_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE5_SC1_DESC", function () {
        const height = getState("BUNDLE5_SC1_HEIGHT");
        const qty = getState("BUNDLE5_SC1_QTY");
        this.value = buildSCDescription(height, qty);

    }, [DIMENSION_DEPS, "BUNDLE5_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE5_SC1_QTY"])

    //BUNDLE 6
    addLogic("BUNDLE6_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle6_sc1_qty = getState("BUNDLE6_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[5] ? bundles[5].indexes[0] : '';

        this.value = bundle6_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE6_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE6_SC1_DESC", function () {
        const height = getState("BUNDLE6_SC1_HEIGHT");
        const qty = getState("BUNDLE6_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, [DIMENSION_DEPS, "BUNDLE6_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE6_SC1_QTY"])

    //BUNDLE 7
    addLogic("BUNDLE7_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle7_sc1_qty = getState("BUNDLE7_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[6] ? bundles[6].indexes[0] : '';

        this.value = bundle7_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE7_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE7_SC1_DESC", function () {
        const height = getState("BUNDLE7_SC1_HEIGHT");
        const qty = getState("BUNDLE7_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, [DIMENSION_DEPS, "BUNDLE7_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE7_SC1_QTY"])

    //BUNDLE 8
    addLogic("BUNDLE8_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle8_sc1_qty = getState("BUNDLE8_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[7] ? bundles[7].indexes[0] : '';

        this.value = bundle8_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE8_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE8_SC1_DESC", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        const qty = getState("BUNDLE8_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, [DIMENSION_DEPS, "BUNDLE8_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE8_SC1_QTY"])

    //BUNDLE 9
    addLogic("BUNDLE9_SC1_SPNUM", function () {
        let doorModelId = getNode("DOOR_MODEL").getAttribute("id").substring(1);
        let bundle9_sc1_qty = getState("BUNDLE9_SC1_QTY");
        const bundles = bundleByHeight(getSectionBundle());
        const index = bundles[8] ? bundles[8].indexes[0] : '';

        this.value = bundle9_sc1_qty > 0 ? `SC${doorModelId}0${index}` : 'None';
    }, ["DOOR_MODEL", "BUNDLE9_SC1_QTY", DIMENSION_DEPS])

    addLogic("BUNDLE9_SC1_DESC", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        const qty = getState("BUNDLE9_SC1_QTY");
        this.value = buildSCDescription(height, qty);
    }, [DIMENSION_DEPS, "BUNDLE9_SC1_HEIGHT", "DOOR_MODEL", "COLOR", "FACE", "EndCaps", "BUNDLE9_SC1_QTY"])


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

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE1_SC1_HEIGHT", "BUNDLE1_SC1_QTY"])

    // set bundle 1 rp2 part#
    addLogic("BUNDLE1_RP2_SPNUM", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // set bundle 1 rp2 desc
    addLogic("BUNDLE1_RP2_DESC", function () {
        const height = getState("BUNDLE1_SC2_HEIGHT");
        const qty = getState("BUNDLE1_SC2_QTY");

        this.value = buildRPDescription(height, qty);
    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE1_SC2_HEIGHT", "BUNDLE1_SC2_QTY"])

    // bundle2 rp1 part#
    addLogic("BUNDLE2_RP1_SPNUM", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // bundle 2 rp1 desc
    addLogic("BUNDLE2_RP1_DESC", function () {
        const height = getState("BUNDLE2_SC1_HEIGHT");
        const qty = getState("BUNDLE2_SC1_QTY");

        this.value = buildRPDescription(height, qty);
    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE2_SC1_HEIGHT", "BUNDLE2_SC1_QTY"])

    // bundle 2 rp2 part#
    addLogic("BUNDLE2_RP2_SPNUM", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL"])

    // bundle 2 rp2 desc
    addLogic("BUNDLE2_RP2_DESC", function () {
        const height = getState("BUNDLE2_SC2_HEIGHT");
        const qty = getState("BUNDLE2_SC2_QTY");

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE2_SC2_HEIGHT", "BUNDLE2_SC2_QTY"])

    //bundle 3 rp1 part#
    addLogic("BUNDLE3_RP1_SPNUM", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE3_SC1_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp1 desc
    addLogic("BUNDLE3_RP1_DESC", function () {
        const height = getState("BUNDLE3_SC1_HEIGHT");
        const qty = getState("BUNDLE3_SC1_QTY");

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE3_SC1_HEIGHT", "BUNDLE3_SC1_QTY"])

    //bundle3 rp2 
    addLogic("BUNDLE3_RP2_SPNUM", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        this.value = buildRPSPNum(height);
    }, ["DOOR_MODEL", "BUNDLE3_SC2_HEIGHT", DIMENSION_DEPS])

    //bundle 3 rp2 desc
    addLogic("BUNDLE3_RP2_DESC", function () {
        const height = getState("BUNDLE3_SC2_HEIGHT");
        const qty = getState("BUNDLE3_SC2_QTY");

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE3_SC2_HEIGHT", "BUNDLE3_SC2_QTY"])

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

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE4_SC1_HEIGHT", "BUNDLE4_SC1_QTY"])

    //bundle4 RP2 PART#
    addLogic("BUNDLE4_RP2_SPNUM", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE4_SC2_HEIGHT", DIMENSION_DEPS])

    //BUNDLE4 RP2 DESC
    addLogic("BUNDLE4_RP2_DESC", function () {
        const height = getState("BUNDLE4_SC2_HEIGHT");
        const qty = getState("BUNDLE4_SC2_QTY");

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE4_SC2_HEIGHT", "BUNDLE4_SC2_QTY"])

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

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE5_SC1_HEIGHT", "BUNDLE5_SC1_QTY"])

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

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE6_SC1_HEIGHT", "BUNDLE6_SC1_QTY"])

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

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE7_SC1_HEIGHT", "BUNDLE7_SC1_QTY"])

    //BUNDLE 8
    //BUNDLE8 RP1    
    addLogic("BUNDLE8_RP1_SPNUM", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE8_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE7 RP1 DESC
    addLogic("BUNDLE8_RP1_DESC", function () {
        const height = getState("BUNDLE8_SC1_HEIGHT");
        const qty = getState("BUNDLE8_SC1_QTY");

        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE8_SC1_HEIGHT", "BUNDLE8_SC1_QTY"])

    //BUNDLE 9
    //BUNDLE9 RP1    
    addLogic("BUNDLE9_RP1_SPNUM", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        this.value = buildRPSPNum(height);

    }, ["DOOR_MODEL", "BUNDLE9_SC1_HEIGHT", DIMENSION_DEPS])

    //BUNDLE7 RP1 DESC
    addLogic("BUNDLE9_RP1_DESC", function () {
        const height = getState("BUNDLE9_SC1_HEIGHT");
        const qty = getState("BUNDLE9_SC1_QTY");
        this.value = buildRPDescription(height, qty);

    }, [DIMENSION_DEPS, "DOOR_MODEL", "COLOR", "FACE", "BUNDLE9_SC1_HEIGHT", "BUNDLE9_SC1_QTY"])


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

    //Calculate the section bundle logic
    addLogic("SHORTEST_SECTION", function () { //find the shortest value
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.floor((door_height / num_of_sec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC", "WIDTH"])

    addLogic("SHORTEST_SECTIONS_QTY", function () {
        let num_of_sec = getState("NUM_OF_SEC");
        let door_height = getState("HEIGHT");
        let shortest_section = getState("SHORTEST_SECTION");
        let diff = (door_height / num_of_sec) - shortest_section;

        this.value = Math.round((1 - (diff) / 3) * num_of_sec);

    }, ["HEIGHT", "NUM_OF_SEC", "SHORTEST_SECTION"])


    addLogic("TALLEST_SECTION", function () {
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.ceil((door_height / num_of_sec) / 3) * 3;
    }, ["HEIGHT", "NUM_OF_SEC"])

    addLogic("TALLEST_SECTION_QTY", function () {
        let door_height = getState("HEIGHT");
        let num_of_sec = getState("NUM_OF_SEC");
        this.value = Math.round((((door_height / num_of_sec) - getState("SHORTEST_SECTION")) / 3) * num_of_sec);
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

    for (let i = 0; i < configArray.length; i++) {
        const item = configArray[i];
        if (Number(item.num_sections) === Number(num_of_sec)) {
            // return item.btm_section_height;
            return item;
        }
    }
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

function bundleByHeight() {

    // BUSINESS-LOGIC TBD: width threshold (199") and pair weight cap (150 lb)
    // are inherited from Landmark. Awaiting Bill's confirmation for
    // Thermatite-correct values. Width-split branch and weight-based pair
    // limit are commented out below; current behavior pairs same-height
    // sections by first+last regardless of shipping weight.

    if (_bundleByHeightCacheKey === _sectionBundleCacheKey && _bundleByHeightCache) {
        return _bundleByHeightCache;
    }

    const result = [];

    // const width = Number(getState("WIDTH"));
    //
    // // WIDTH >= 199 -> every section ships alone
    // if (width >= 199) {
    //     const allSections = getSectionBundle();
    //     return allSections.map((h, i) => ({
    //         sections: [h],
    //         indexes: [i + 1],
    //         weight: calculateSectionShipWeight(h, false)
    //     }));
    // }

    const sections = getSectionBundle();

    if (!sections.length) {
        return result;
    }

    // =========================================
    // STEP 1: BOTTOM SECTION ALWAYS SINGLE
    // =========================================

    result.push({
        sections: [sections[0]],
        indexes: [1],
        weight: calculateSectionShipWeight(sections[0], true)
    });

    // =========================================
    // STEP 2:
    // GROUP SAME HEIGHTS
    // PRESERVE FIRST APPEARANCE ORDER
    // =========================================

    const remainingSections = sections.slice(1);

    const processed = new Set();

    remainingSections.forEach((height) => {

        // already handled
        if (processed.has(height)) {
            return;
        }

        processed.add(height);

        // collect indexes for this height
        const matches = [];

        remainingSections.forEach((h, idx) => {

            if (h === height) {
                // +2 because:
                // slice(1) removed first section
                // and indexes are 1-based
                matches.push(idx + 2);
            }
        });

        // =====================================
        // CREATE PAIRS
        // first + last
        // =====================================

        while (matches.length >= 2) {

            const firstIndex = matches.shift();
            const lastIndex = matches.pop();

            const pairWeight =
                calculateSectionShipWeight(height, false) +
                calculateSectionShipWeight(height, false);

            // if (pairWeight < 150) {
                result.push({
                    sections: [height, height],
                    indexes: [firstIndex, lastIndex],
                    weight: pairWeight
                });
            // } else {
            //     break;
            // }
        }

        // =====================================
        // LEFTOVER SINGLE
        // =====================================

        while (matches.length) {

            result.push({
                sections: [height],
                indexes: [matches.shift()],
                weight: calculateSectionShipWeight(height, false)
            });
        }
    });

    _bundleByHeightCache = result;
    _bundleByHeightCacheKey = _sectionBundleCacheKey;
    return result;
}


// =====================================================================
// BUSINESS-LOGIC TBD: weight constants/thresholds below are inherited
// from Landmark (DOOR_MODEL === "A" branches, 0.4 lb/ft retainer,
// 150 lb pair cap, etc.). Awaiting confirmation from Bill for
// Thermatite-correct values. Stubbed to 0 in the meantime so packing
// logic still runs; pair cap in bundleByHeight will treat everything
// as pairable while weights are stubbed.
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

// Stub: returns 0 until Thermatite weight constants are confirmed.
function calculateSectionShipWeight(/* sectionHeightInInches, isBottomSection = true */) {
    return 0;
}

//function to get the section component desc
function buildSCDescription(height, qty) {

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    const endCaps = getState("EndCaps");
    const doubleEndCaps = endCaps === "Y" ? "DE" : "";

    return qty > 0
        ? `SC ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle} ${doubleEndCaps}`
        : "";
}

//function to get the desc of raw panel 
function buildRPDescription(height, qty) {

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    return qty > 0
        ? `SR ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle}`
        : "";
}

//function to get the raw panel base part#
function buildRPBaseSpNum(height) {
    const doorModelId = getNode("DOOR_MODEL").getAttribute("id");
    return `${doorModelId}-${height}`;
}

//function to get the raw panel top sheet part#
function buildRPTopSpNum(height) {
    const color = getState("COLOR").value;
    return `LND-${height}${color}`;
}

//function to build section bundle desc
function buildSBDescription(prefix, height, qty) {

    if (qty <= 0) return "";

    let doorWidthFeet = getState("DOOR_WIDTH_FEET");
    doorWidthFeet = String(doorWidthFeet).padStart(2, "0");

    const doorWidthInches = getState("DOOR_WIDTH_INCHES");
    const doorModelDesc = getNode("DOOR_MODEL").getAttribute("desc");
    const color = getState("COLOR").desc;
    const panelStyle = getNode("FACE").getAttribute("desc");

    const endCaps = getState("EndCaps");
    const doubleEndCaps = endCaps === "Y" ? "DE" : "";


    return `${prefix} ${doorWidthFeet}-${doorWidthInches}x${height} ${doorModelDesc} ${color} ${panelStyle} ${doubleEndCaps}`;
}

// BUSINESS-LOGIC TBD: SB prefix thresholds (< 32 / > 32) and codes
// (SB-B / SB-BI / SB-I / SB-II) inherited from Landmark. Awaiting
// confirmation from Bill on Thermatite part-number conventions.
function getSBPrefix(/* type, height */) {
    return "SB";
}

// function getSBPrefix(type, height) {
//     switch (type) {
//         case "SB1":
//             return height < 32 ? "SB-B" : "SB-BI";
//         default:
//             return height > 32 ? "SB-II" : "SB-I";
//     }
// }

//function to create raw panel part#
function buildRPSPNum(height, suffix = "01") {

    const doorModelId = getNode("DOOR_MODEL")
        .getAttribute("id")
        .substring(1);

    return height > 0
        ? `SR${doorModelId}${suffix}`
        : "None";

}