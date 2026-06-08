function loadGlobalNodes() {
  //   addNode({id:"DOOR_MODEL", value:""}, [])

  // addNode({id:"WEIGHT",logic:function(){
  //   this.value = getCurrentDoorWeight()
  // }, value:500}, ["WIDTH", "HEIGHT","COLOR","HANGER_ANGLE", "HANGER_ANGLE_QTY",  "END_CAPS_OUTPUT","TRUSS_QTY","WINDOW_POSITION" ,"WINDOWS","LIFT_TYPE"])

  addNode({
    id: "SIZE_HEIGHT",
    logic() {
      const $checked = $("input[name='SIZE']:checked");
      this.value = Number($checked.attr("height")) || 0;
    }
  }, ["SIZE"]);

  addNode({
    id: "SIZE_WIDTH",
    logic() {
      const $checked = $("input[name='SIZE']:checked");
      this.value = Number($checked.attr("width")) || 0;
    }
  }, ["SIZE"]);

  addNode({
    id: "WIDTH",
    logic: function () {
      const sizeWidth = nodeset["SIZE_WIDTH"]?.value ?? 0;
      this.value = $("#custom_dimensions").is(":checked")
        ? getGlobalDoorWidthFromFeetInches()
        : sizeWidth * 12;
    }
  },
    ["SIZE_WIDTH"])

  addNode({
    id: "HEIGHT",
    logic: function () {
      const sizeHeight = nodeset["SIZE_HEIGHT"]?.value ?? 0;
      this.value = $("#custom_dimensions").is(":checked")
        ? getGlobalDoorHeightFromFeetInches()
        : sizeHeight * 12;
    }
  },
    ["SIZE_HEIGHT"]);

  addLogic("DOOR_WIDTH_FEET", function () {
    if ($("#custom_dimensions").is(":checked")) {
      this.value = parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0;
    } else {
      this.value = getDoorWidthFeetFromSize();
    }
  }, ["SIZE"])

  addLogic("DOOR_HEIGHT_FEET", function () {
    if ($("#custom_dimensions").is(":checked")) {
      this.value = parseInt($("#CUSTOM_HEIGHT_FEET").val()) || 0;
    } else {
      this.value = getDoorHeightFeetFromSize();
    }
  }, ["SIZE"])

  addLogic("DOOR_WIDTH_INCHES", function () {
    if ($("#custom_dimensions").is(":checked")) {
      this.value = parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0;
    } else {
      this.value = 0;
    }
  }, ["SIZE"])

  addLogic("DOOR_HEIGHT_INCHES", function () {
    if ($("#custom_dimensions").is(":checked")) {
      this.value = parseInt($("#CUSTOM_HEIGHT_INCHES").val()) || 0;
    } else {
      this.value = 0;
    }
  }, ["SIZE"])


  addLogic("LM_DOOR_MODEL", function () {
    this.value = getNode("DOOR_MODEL").getAttribute("id")
  }, ["DOOR_MODEL"])

  addNode({ id: "WEIGHT_BREAKDOWN", value: "" }, [])
  addNode({ id: "HDWR_BREAKDOWN", value: "" }, [])

  addNode({
    id: "WEIGHT",
    logic: function () {
      // this.value = getCurrentDoorWeight()
    }
  }, ["WIDTH", "HEIGHT", "COLOR", "WINDOWS", "WINDOW_POSITION",
      "DOOR_WIDTH_FEET", "DOOR_HEIGHT_FEET",
      "TRUSS_LENGTH", "TRUSS_QTY",
      "END_CAPS", "END_CAPS_OUTPUT", "CENTER_HINGE_QTY"])
}

function updatePrice() {
  //Temp Function
  return Number.MAX_SAFE_INTEGER
}

function getFrameWidth() {
  return 5;
}
function getSectionHeight() {
  return 21;
}
function getNumberOfPanes() {
  return getStackChart()[`${getGlobalDoorWidth()}`].num_panes
}

function getSelectedNumberOfSection() {
  return parseInt(getState("NUM_OF_SEC"))
}

function getNumberOfSections(height) {
  //return (Number)(getState("NUM_OF_SEC"))
  //return getStackChart()[`${getGlobalDoorHeight()}`].num_sections
  const chart = getStackChart();
  const entries = chart[String(height)] || [];
  return entries.map(e => e.num_sections);

}

function getNumInsideHinges() {
  const width = getGlobalDoorWidth()
  if (width <= 110)
    return 1;
  if (width <= 146)
    return 2
  if (width <= 194)
    return 3
  if (width <= 230)
    return 4
  if (width <= 290)
    return 5
  if (width <= 336)
    return 6
  if (width <= 386)
    return 7
  if (width <= 434)
    return 9

}
//Needed in case we introduce headroom
function getHiLift() {
  return (Number)($("#HIGHLIFT").val())
}
function getTotalCenterHingeQTY() {

  return 1 //Yeah this isn't right but whatever
}
function getNumberOfGlazedSections() {
  if ($('#BOTTOM_SECTION > option:selected').val() === "Kick Panel")
    return getNumberofSections() - 1
  if ($('#BOTTOM_SECTION > option:selected').val() === "Thermatite")
    return getNumberOfSections() - $('#THERMA_SECTION_QTY > option:selected').attr('qty')
  return getNumberOfSections()

}
function getWindowsPerSection() {
  return getNumberOfPanes()
}
function getGlobalDoorWidth() {
  return getState("WIDTH")
}

function getGlobalDoorHeight() {
  return getState("HEIGHT")
}

function getGlobalDoorWidthFromFeetInches() {
  const feet = parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0;
  const inches = parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0;
  return feet * 12 + inches;
}

function getGlobalDoorWidthFromSizeRadio() {
  return (parseInt($("input[name='SIZE']:checked").attr("width")) || 0) * 12;
};

function getDoorWidthFeetFromSize() {
  return parseInt($("input[name='SIZE']:checked").attr("width")) || 0;
};

function getGlobalDoorHeightFromFeetInches() {
  const feet = parseInt($("#CUSTOM_HEIGHT_FEET").val()) || 0;
  const inches = parseInt($("#CUSTOM_HEIGHT_INCHES").val()) || 0;
  return feet * 12 + inches;
}

function getDoorHeightFeetFromSize() {
  return parseInt($("input[name='SIZE']:checked").attr("height")) || 0;
}

function getGlobalDoorHeightFromSizeRadio() {
  return (parseInt($("input[name='SIZE']:checked").attr("height")) || 0) * 12;
};

function getEndCapsData() {

}

//EasyWeb uses a fixed table to calculate section heights. This chart is provided here. 
// Constant lookup table. Built once and cached — it was previously re-allocated
// (a 33-key nested object, hundreds of sub-objects) on EVERY call, and it's
// called many times per section-bundle walk via resolveSectionHeights. That
// allocation churn drove GC pressure and made each rw() walk slower/variable.
let _stackChartCache = null;
function getStackChart() {
  if (_stackChartCache) return _stackChartCache;
  _stackChartCache = {
    '72': [
      { num_sections: 3, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24 }, //6-0
      { num_sections: 4, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18 }, //6-0
    ],

    '75': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18 }
    ], //6-3
    '78': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18 }, //6-6
    ],
    '81': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 18 },//6-9
    ],
    '84': [
      { num_sections: 4, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21 }, //7-0
    ],
    '87': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21 }, //7-3    
    ],
    '90': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21 }, //7-6
      { num_sections: 5, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 },//7-6- optional
    ],
    '93': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 21 },//7-9
      { num_sections: 5, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 },//7-9 optional
    ],
    '96': [
      { num_sections: 4, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24 }, //8-0
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18 }, //8-0 optional  
    ],
    '99': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 21 }, //8-3
    ],
    '102': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, },//8-6
    ],
    '105': [
      { num_sections: 5, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //8-9
    ],
    '108': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //9-0
      { num_sections: 6, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-0 optional
    ],
    '111': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21 }, //9-3
      { num_sections: 6, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-3 optional
    ],
    '114': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 24 }, //9-6
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-6 optional
    ],
    '117': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21 }, //9-9
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18 }, //9-9 optional
    ],
    '120': [
      { num_sections: 5, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24 }, //10-0
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18 }, //10-0 optional
    ],
    '123': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 18, }, //10-3    
    ],
    '126': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //10-6
      { num_sections: 7, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //10-6 optional
    ],
    '129': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //10-9
      { num_sections: 7, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //10-9 optional
    ],
    '132': [
      { num_sections: 6, top_section_height: 21, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21 }, //11-0
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //11-0 optional
    ],
    '135': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21 }, //11-3
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18 }, //11-3 optional
    ],
    '138': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, }, //11-6
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, }, //11-6 optional
    ],
    '141': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 24 }, //11-9
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 21, int3_rp1_height: 18 }, //11-9 optional
    ],
    '144': [
      { num_sections: 6, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24 }, //12-0
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18 }, //12-0 optional
    ],
    '147': [
      { num_sections: 7, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-3
      { num_sections: 8, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-3 optional
    ],
    '150': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-6
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-6 optional
    ],
    '153': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //12-9
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //12-9 optional
    ],
    '156': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 21, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-0
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-0 optional
    ],
    '159': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-3
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 18, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-3 optional
    ],
    '162': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 21, int3_rp1_height: 21 }, //13-6
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 18 }, //13-6 optional
      { num_sections: 9, top_section_height: 18, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 }, //13-6 optional
    ],
    '165': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24, int3_rp1_height: 21 }, //13-9
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 18, int3_rp2_height: 21 }, //13-9 optional
      { num_sections: 9, top_section_height: 21, btm_section_height: 18, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 }, //13-9 optional
    ],
    '168': [
      { num_sections: 7, top_section_height: 24, btm_section_height: 24, int1_rp1_height: 24, int1_rp2_height: 24, int2_rp1_height: 24, int2_rp2_height: 24, int3_rp1_height: 24 }, //14-0
      { num_sections: 8, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 21, int1_rp2_height: 21, int2_rp1_height: 21, int2_rp2_height: 21, int3_rp1_height: 21, int3_rp2_height: 21 }, //14-0 optional      
      { num_sections: 9, top_section_height: 21, btm_section_height: 21, int1_rp1_height: 18, int1_rp2_height: 18, int2_rp1_height: 18, int2_rp2_height: 18, int3_rp1_height: 18, int3_rp2_height: 18, int4_rp1_height: 18 } //14-0 optional
    ]
  };
  return _stackChartCache;
}
