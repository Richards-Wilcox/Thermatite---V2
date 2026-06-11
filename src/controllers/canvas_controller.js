function addRenderNode(){
  addNode({
    id:"RENDER", 
    type:"VARIABLE",
    logic:renderDoor,
    value:"", 
  }, 
	    ["WIDTH", "HEIGHT", "COLOR", "WINDOWS", "WINDOW_POSITION", "GLAZING_TYPE"])
  addLogic("GLAZING_OBJ", function(){
    this.value = JSON.stringify(getState("RENDER"))
  }, ["RENDER"])
}

function renderDoor(){
  const layer_obj = getGlazingObj()
  const svg = CANVAS_PLUGIN.drawThermatiteDoor(layer_obj)

 
  this.value = layer_obj
}
function getGlazingObj(){
  return {
	dimensions: {
	  widthInches:getState("WIDTH"), 
	  heightInches:getState("HEIGHT"),
	  numSections:getNumberOfSections(),
	  bttmSectionHeight:getStackChart()[getState("HEIGHT")].btm_section_height, 
	  topSectionHeight:getStackChart()[getState("HEIGHT")].top_section_height, 
	  intSectionHeight:"24",
	  intSectionQty: getNumberOfSections()-2,
	  endStiles: 2,
	},
    
  
    
    background:{
	 color:getNode("COLOR").getAttribute("hex"),
	 pattern:"None",
    },
	 glazing:{
	// Glazing presence is driven by GLAZING_TYPE now (WINDOWS is a frozen "none").
	type:getState("GLAZING_TYPE"),
	   width:40,
	   height:6 + 15/16,
	   frameColor: '#1B1B1B',
	   distanceFromEdge: getState("END_CAPS") === 'single' ? 23.71875 - 20 : 27.71875 - 20,
	   material:getNode("GLAZING_TYPE").getAttribute("value"),
	   spacing:getState("WINDOW_POSITION"),
	   numLites:getState("WINDOW_POSITION") === "both" ? (getState("GLAZING_TYPE") !== 'none' ? 2 : 0) : getState("GLAZING_TYPE") !== 'none' ? 1:0,

	 },
	 misc:{
	 labels:true,
    },
  
  }
}

function addChangeEvents(){
 addRenderNode()
}
