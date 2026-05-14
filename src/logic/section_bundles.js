function addSectionBundleDrivers(){
    addLogic("QTY_215308R_SECTIONS", function(){
    const isDouble = getState("END_CAPS") === 'double' ? 2 : 1;
    this.value = getState("NUM_SECTIONS") * isDouble
  }, ["END_CAPS", "NUM_SECTIONS"])
  
  addLogic("WINDOW_QTY", function(){
     const windows = getState("WINDOWS")
    if(windows === "none"){
	 this.value = 0
	 return;
    }
    if(getState("WINDOW_POSITION") === 'both')
	 this.value = 8;
    else
	 this.value = 4;
  }, ["WINDOWS", "WINDOW_POSITION"])
  addLogic("WINDOW_ASSEMBLY", function(){
    const windows = getState("WINDOWS")
    if(windows === "none"){
	 this.value = "none"
	 return;
    }
	 const windowcode = getState("GLAZING_TYPE") + getState("TEMPERED")
    switch(windowcode){
	   case("clearuntempered"):
	   this.value = "4SK-300";
	   break;
	   case("black_satinuntempered"):
	   this.value = "4SK-310";
	   break;
	   case("tinted_greyuntempered"):
	   this.value = "4SK-320";
	   break;
	   case("cleartempered"):
	   this.value = "4SK-301"
	   break;
	   case("black_satintempered"):
	   this.value = "4SK-311"
	   break;
	   case("tinted_greytempered"):
	   this.value = "4SK-321"
	   break;
    }
    
  }, ["WINDOWS", "GLAZING_TYPE", "TEMPERED"])
  addLogic("WINDOW_ASSEMBLY_QTY", function(){
    const windows = getState("WINDOWS")
    if(windows === "none"){
	 this.value = 0
	 return;
    }
    if(getState("WINDOW_POSITION") === 'both')
	 this.value = 2;
    else
	 this.value = 1;
  }, ["WINDOWS",  "WINDOW_POSITION"])
  addNode({
    id:"SECTION_HEIGHT",
    logic:function(){
      this.value = getState("HEIGHT") === 7*12 ? '21' : '24'
    }
  }, ["HEIGHT"])
  addNode({
    id:"SECTION_WIDTH",
    logic:function(){
      this.value = getState("DOOR_WIDTH_FEET") === 9 ? "18-2" : "24-2"
    }
  }, ["DOOR_WIDTH_FEET"])

  //We use a unique node for the CNC code so that we don't need to make four different calls to the API
  addNode({
    id:"CNC_CODE",
    logic:async function(){
	 //Gotta calculate the code here becuase there isn't an input on smooth and I don't want to add one
	 const window_layout = getNode("WINDOW_POSITION").getAttribute("code")
	
	 
	const body = {
	door_model:"S160",
	panel_style:"smooth",
	window_style:"smooth slim 40", 
	window_layout:getState("WINDOWS") === 'none' ? 'none' : getState("WINDOW_POSITION"),
	section_width:getState("WIDTH") + "",
	section_height:getState("SECTION_HEIGHT") + "", 
	 center_line_method:getState("WINDOW_POSITION") === 'both' ? 'evenly_spaced' : getState("WINDOW_POSITION"), 
	  location:getState("WINDOW_POSITION"),
	  end_caps:getState("END_CAPS")
	}
	 
	 //1065845291 
	 try{
	  const code = await $.ajax({
    method:"POST",
    url: "/spr/custom/jpoc/json/1065845291",
    data:JSON.stringify(body) ,
    dataType: "json",
     contentType: "text/plain",
   processData: false,
    headers: {"LOG":false},
  });
	 
	this.value = code
	 }catch(e){
	   console.log("CNC ERROR: " + e)
	   this.value = "ERROR"
	 }
    }
  }, ["WIDTH", "SECTION_HEIGHT", "WINDOWS", "WINDOW_POSITION", "END_CAPS"])
  addLogic("CNC_SB_RP1", function(){
    if(!!getState("CNC_CODE"))
    this.value = "SB-RP1," + getState("CNC_CODE").code
    else
	 this.value = undefined
  }, ["CNC_CODE"])
    addLogic("CNC_SB_RP2", function(){
    if(!!getState("CNC_CODE"))
    this.value = "SB-RP2,"+ getState("CNC_CODE").code
    else
	 this.value = undefined
  }, ["CNC_CODE"])
    addLogic("CNC_INT1_RP1", function(){
    if(!!getState("CNC_CODE"))
    this.value = "INT1-RP1," + getState("CNC_CODE").code
    else
	 this.value = undefined
  }, ["CNC_CODE"])
    addLogic("CNC_INT1_RP2", function(){
    if(!!getState("CNC_CODE"))
    this.value = "INT1-RP2," + getState("CNC_CODE").code
    else
	 this.value = undefined
  }, ["CNC_CODE"])
  
  addLogic("WINDOW_FRAME_KIT", function(){
    if(getState("WINDOWS") !== 'none')
	 this.value = 'frame_blk'
    else
	 this.value = 'none'
  }, ['WINDOWS'])
  addLogic("YLINE_DESC", function(){
    const doorType = getState("WINDOWS") === 'none' ? "DF" : "GF"
    const color = getState("COLOR")
      const colorStr = color === 'anthracite' ? "Anthra" : color.charAt(0).toUpperCase() + color.substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
	
    this.value = `${doorType} ${getState("DOOR_WIDTH_FEET")}-0x${getState("DOOR_HEIGHT_FEET")}-0(4) Stilo ${colorStr} ${endcapsStr}`
  }, ["WIDTH", "WINDOWS", "HEIGHT", "END_CAPS", "COLOR"])
  
    addNode({id:"GLASS_TYPE", 
		 logic:function(){
		   if(getState("WINDOWS") === 'none'){
			this.value = "NONE"
		   	return;
		 	}
		   const tempered = getState("TEMPERED")
		   const glazing_type = getState("GLAZING_TYPE")
		   if(tempered === 'tempered'){
			if(glazing_type === 'clear')
			  this.value = 'CLR_SEALED'
		   	else if(glazing_type === 'black_satin')
			  this.value = 'BLK_SATIN_SEALED'
			 else if(glazing_type === 'tinted_grey')
			   this.value = 'TINT_GRAY_SEALED'
		   }else if(tempered === 'untempered')
			if(glazing_type === 'clear')
			  this.value = 'CLEAR'
		   	else if(glazing_type === 'black_satin')
			  this.value = 'BLK_SATIN'
			 else if(glazing_type === 'tinted_grey')
			   this.value = 'TINT_GRAY'
		 }}, ["TEMPERED", "GLAZING_TYPE", "WINDOWS"])
  //Used for the summary output
  addNode({
    id:"GLASS_TYPE_OUTPUT", 
    logic:function(){
	 switch(getState("GLASS_TYPE")){
	   
	   case 'CLR_SEALED' :
		this.value = 'Clear Sealed Tempered'
		break;
	   case 'NONE' :
		this.value = "None"
		break;
	   case 'BLK_SATIN_SEALED':
		this.value = "Satin Sealed Tempered"
		break;
	   case 'TINT_GRAY_SEALED':
		this.value = "Dark Tint Sealed Tempered"
		break;
	   case 'BLK_SATIN':
		this.value = 'Satin'
		break;
	   case 'TINT_GRAY':
		this.value = 'Dark Tint'
		break;
	   case 'CLEAR':
		this.value = 'Clear'
		break;
	   default:
		this.value = 'ERROR';
		
	 }
    }
  }, ["GLASS_TYPE"])
  
  addLogic("WINDOW_SCREW_QTY", 
		function(){
    this.value = getState("WINDOWS") !== 'none' ? 22 : 0
  }, ["WINDOWS"])
  addLogic("END_CAPS_OUTPUT", function(){
    this.value = getState("SECTION_HEIGHT") + "_" + getState("END_CAPS").toUpperCase()
  }, ["SECTION_HEIGHT", "END_CAPS"] )
  
  addLogic("BOTTOM_SEAL_OUTPUT", function(){
    const width = getState("DOOR_WIDTH_FEET")
    if(width == '8')
	 this.value = "EIGHT"
    if(width == '9')
	 this.value = 'NINE'
    if(width == '16')
	 this.value = 'SIXTEEN'
  }, ['WIDTH'])
  const spnumEdges = ["SECTION_HEIGHT", "WIDTH", "COLOR"]
  //** TOP SECTION START **//
  addLogic("TOP_RAW_SLAB_DESC", function(){
    const width = getState("SECTION_WIDTH")
    const height = getState("SECTION_HEIGHT")
    const color = getNode("COLOR").getAttribute("desc")
    const pattern = "Stilo"
    this.value = `${width}x${height} ${pattern} ${color} Raw`
  }, ["SECTION_WIDTH", "SECTION_HEIGHT", "COLOR"])
  
  addLogic("TOP_RAW_SLAB_SPNUM", function(){
    const spnumcode = `${getState("DOOR_WIDTH_FEET")}${getState("SECTION_HEIGHT")}${getState("COLOR")}`
    
    this.value = getRawSPNum(spnumcode)
  }, spnumEdges)
  
  addLogic("TOP_FINISHED_RAW_PANEL_DESC", function() {
    const paneltype = getState("WINDOWS") === 'none' ? "I" : "G"
    const colorStr = getState("COLOR") === 'anthracite' ? "Anthra" : getState("COLOR").charAt(0).toUpperCase() + getState("COLOR").substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
    this.value = `SB-${paneltype} ${("" + getState("DOOR_WIDTH_FEET")).padStart(2, "0")}x${getState("SECTION_HEIGHT")} Stilo ${colorStr} ${endcapsStr}`
  }, ["DOOR_WIDTH_FEET", "SECTION_HEIGHT", "COLOR", "END_CAPS", "WINDOWS"])
  addLogic("TOP_SECTION_QTY", function(){
    this.value = getState("DOOR_WIDTH_FEET") == 8 ? 0.33 : getState("DOOR_WIDTH_FEET") == 9 ? 0.49 :
    getState("DOOR_WIDTH_FEET") == 16 ? 0.67: 0.88
	}, ["DOOR_WIDTH_FEET"])
  addLogic("TOP_SECTION_COMPONENT_DESC", function(){
    this.value = getSectionComponentDesc(getState("WIDTH"), getState("SECTION_HEIGHT"), getState("COLOR"), getState("END_CAPS"))
  }, ["DOOR_WIDTH_FEET", "SECTION_HEIGHT", "COLOR", "END_CAPS"])
  addLogic("TOP_GLASS_TYPE", function(){
    this.value = getState("GLASS_TYPE")
  }, ["GLASS_TYPE"])
  //** TOP SECTION END **//
  
  //** BOTTOM SECTION START **//
  addLogic("BTTM_RAW_SLAB_DESC", function(){
    const width = getState("SECTION_WIDTH")
    const height = getState("SECTION_HEIGHT")
    const color = getNode("COLOR").getAttribute("desc")
    const pattern = "Stilo"
  
    this.value = `${width}x${height} ${pattern} ${color} Raw`
  }, ["SECTION_WIDTH", "SECTION_HEIGHT", "COLOR"])
  
  addLogic("BTTM_RAW_SLAB_SPNUM", function(){
    const spnumcode = `${getState("DOOR_WIDTH_FEET")}${getState("SECTION_HEIGHT")}${getState("COLOR")}`
   
    this.value = getRawSPNum(spnumcode)
  }, spnumEdges)
  

  
  addLogic("BTTM_FINISHED_RAW_PANEL_DESC", function() {
   const paneltype = getState("WINDOWS") === 'none' ? "B" : "B(G)"
    const colorStr = getState("COLOR") === 'anthracite' ? "Anthra" : getState("COLOR").charAt(0).toUpperCase() + getState("COLOR").substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
    this.value = `SB-${paneltype} ${("" + getState("DOOR_WIDTH_FEET")).padStart(2, "0")}x${getState("SECTION_HEIGHT")} Stilo ${colorStr} ${endcapsStr}`
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS", "WINDOWS"])
  addLogic("BTTM_SECTION_QTY", function(){
    this.value = getState("DOOR_WIDTH_FEET") == 8 ? 0.33 : getState("DOOR_WIDTH_FEET") == 9 ? 0.49 : 
    getState("DOOR_WIDTH_FEET") == 16 ? 0.67: 0.88
	}, ["DOOR_WIDTH_FEET"])
   addLogic("BTTM_SECTION_COMPONENT_DESC", function(){
    this.value = getSectionComponentDesc(getState("WIDTH"), getState("SECTION_HEIGHT"), getState("COLOR"), getState("END_CAPS"))
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS"])
  addLogic("BTTM_GLASS_TYPE", function(){
    this.value = getState("GLASS_TYPE")
  }, ["GLASS_TYPE"])
  //** BOTTOM SECTION END **//
  
   //** Int 1 SECTION START **//
  addLogic("INT1_RAW_SLAB_DESC", function(){
    const width = getState("SECTION_WIDTH")
    const height = getState("SECTION_HEIGHT")
    const color = getNode("COLOR").getAttribute("desc")
    const pattern = "Stilo"
  
    this.value = `${width}x${height} ${pattern} ${color} Raw`
  }, ["SECTION_WIDTH", "SECTION_HEIGHT", "COLOR"])
  
  addLogic("INT1_RAW_SLAB_SPNUM", function(){
    const spnumcode = `${getState("DOOR_WIDTH_FEET")}${getState("SECTION_HEIGHT")}${getState("COLOR")}`
    
    this.value = getRawSPNum(spnumcode)
  }, spnumEdges)
  addLogic("INT1_FINISHED_RAW_PANEL_DESC", function() {
    const paneltype = getState("WINDOWS") === 'none' ? "I" : "G"
    const colorStr = getState("COLOR") === 'anthracite' ? "Anthra" : getState("COLOR").charAt(0).toUpperCase() + getState("COLOR").substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
    this.value = `SB-${paneltype} ${("" + getState("DOOR_WIDTH_FEET")).padStart(2, "0")}x${getState("SECTION_HEIGHT")} Stilo ${colorStr} ${endcapsStr}`
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS", "WINDOWS"])
  addLogic("INT1_SECTION_QTY", function(){
    this.value = getState("DOOR_WIDTH_FEET") == 8 ? 0.33 : getState("DOOR_WIDTH_FEET") == 9 ? 0.49 : 
    getState("DOOR_WIDTH_FEET") == 16 ? 0.67: 0.88
	}, ["WIDTH"])
   addLogic("INT1_SECTION_COMPONENT_DESC", function(){
    this.value = getSectionComponentDesc(getState("WIDTH"), getState("SECTION_HEIGHT"), getState("COLOR"), getState("END_CAPS"))
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS"])
  addLogic("INT1_GLASS_TYPE", function(){
    this.value = getState("GLASS_TYPE")
  }, ["GLASS_TYPE"])
  //** Int 1 SECTION END **//
  
   //** Int 2 SECTION START **//
  addLogic("INT2_RAW_SLAB_DESC", function(){
    const width = getState("SECTION_WIDTH")
    const height = getState("SECTION_HEIGHT")
    const color = getNode("COLOR").getAttribute("desc")
    const pattern = "Stilo"
  
    this.value = `${width}x${height} ${pattern} ${color} Raw`
  }, ["SECTION_WIDTH", "SECTION_HEIGHT", "COLOR"])
  
  addLogic("INT2_RAW_SLAB_SPNUM", function(){
    const spnumcode = `${getState("DOOR_WIDTH_FEET")}${getState("SECTION_HEIGHT")}${getState("COLOR")}`
    
    this.value = getRawSPNum(spnumcode)
  }, spnumEdges)
  addLogic("INT2_FINISHED_RAW_PANEL_DESC", function() {
    const paneltype = getState("WINDOWS") === 'none' ? "I" : "G"
    const colorStr = getState("COLOR") === 'anthracite' ? "Anthra" : getState("COLOR").charAt(0).toUpperCase() + getState("COLOR").substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
    this.value = `SB-${paneltype} ${("" + getState("DOOR_WIDTH_FEET")).padStart(2, "0")}x${getState("SECTION_HEIGHT")} Stilo ${colorStr} ${endcapsStr}`
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS", "WINDOWS"])
  addLogic("INT2_SECTION_QTY", function(){
    this.value = getState("DOOR_WIDTH_FEET") == 8 ? 0.33 : getState("DOOR_WIDTH_FEET") == 9 ? 0.49 : 
    getState("DOOR_WIDTH_FEET") == 16 ? 0.67: 0.88
	}, ["WIDTH"])
   addLogic("INT2_SECTION_COMPONENT_DESC", function(){
    this.value = getSectionComponentDesc(getState("WIDTH"), getState("SECTION_HEIGHT"), getState("COLOR"), getState("END_CAPS"))
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS"])
  addLogic("INT2_GLASS_TYPE", function(){
    this.value = getState("GLASS_TYPE")
  }, ["GLASS_TYPE"])
  //** Int 2 SECTION END **//

  addLogic("FINISHED_RAW_PANEL_CHILD_DESC", function() {
  const paneltype = getState("WINDOWS") === 'none' ? "B" : "B(G)"
    const colorStr = getState("COLOR") === 'anthracite' ? "Anthra" : getState("COLOR").charAt(0).toUpperCase() + getState("COLOR").substr(1)
  const endcapsStr = getState("END_CAPS") === 'single' ? "" : "DE"
    this.value = `SR ${("" + getState("DOOR_WIDTH_FEET")).padStart(2, "0")}x${getState("SECTION_HEIGHT")} Stilo ${colorStr} ${endcapsStr}`
  }, ["WIDTH", "SECTION_HEIGHT", "COLOR", "END_CAPS", "WINDOWS"])
  
  
  
  
  //This should probably be its own file but whatever
  addIdiosyncraticLineItemLogic()
  
}
function addIdiosyncraticLineItemLogic(){
  //SIX
  addLogic("QTY_215306P020", function(){
    const widthFeet = Math.floor(getState("WIDTH")/12)
    const isDouble = getState("END_CAPS") === 'double'
     if(widthFeet === 16){
	 this.value = 5
	 return;
	}
    
    if(isDouble)
	 this.value = 4;
    else
	 this.value = 2

    
  }, ["WIDTH", "END_CAPS"])
  addLogic("QTY_215306", function(){
    this.value = 0;
  }, [])
 nodeset["QTY_215306"].value = 0
   addLogic("QTY_215308R", function(){
    this.value = 0;
  }, [])
 nodeset["QTY_215308R"].value = 0
}
function getSectionComponentDesc(width, height, color, endcaps){
  const widthStr = ("" + Math.floor(width/12)).padStart(2, "0")
  const heightStr = height
  const model = "Stilo"
  const colorStr = color === 'anthracite' ? "Anthra" : color.charAt(0).toUpperCase() + color.substr(1)
  const endcapsStr = endcaps === 'single' ? "" : "DE"
  return `SC ${widthStr}x${heightStr} ${model} ${colorStr} ${endcapsStr}`
}

function getRawSPNum(spnumcode){
  switch(spnumcode){
case("821white"): 
return "SRP-003" 
case("824white"): 
return "SRP-004" 
case("821black"): 
return "SRP-007" 
case("824black"): 
return "SRP-008" 
case("821anthracite"): 
return "SRP-011" 
case("824anthracite"): 
return "SRP-012" 
case("921white"): 
return "SRP-001" 
case("924white"): 
return "SRP-002" 
case("921black"): 
return "SRP-005" 
case("924black"): 
return "SRP-006" 
case("921anthracite"): 
return "SRP-009"
case("924anthracite"): 
return "SRP-010" 
case("1621white"): 
return "SRP-003" 	 
case("1624white"): 
return "SRP-004"  
case("1621black"): 
return "SRP-007"  
case("1624black"): 
return "SRP-008"  
case("1621anthracite"): 
return "SRP-011"  
case("1624anthracite"): 
return "SRP-012"  


  
	
  }
}
