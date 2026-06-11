function loadJDENodes(){
  
  addLogic("GL_NUMBER_OF_SECTION", function() {
    this.value = 4
  }, [])
  addLogic("GL_DOOR_COLOUR", function() {
    this.value = getNode("COLOR").getAttribute("desc")

  }, ["COLOR"])
  addLogic("GL_DOOR_QUANTITY", function(){
    this.value = '1'
  }, [])
  addLogic("GL_DOOR_SIZE", function() {
    this.value = `${getState("DOOR_WIDTH_FEET")}'${getState("DOOR_WIDTH_INCHES")}" x ${getState("DOOR_HEIGHT_FEET")}'${getState("DOOR_HEIGHT_INCHES")}"`
  }, ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES"])
  addLogic("GL_DOOR_MODEL", function(){
	this.value = getState("DOOR_MODEL")
  }, ["DOOR_MODEL"])
  addLogic("GL_TRUSS_STYLE", function(){
    const truss = getState("TRUSS")
    switch(truss){
	   case("327-071-160P"):
	   this.value = `Univ 20ga U-bar Truss 15'-11"`
	      case("327-071-080P"):
	   this.value = `Univ 20ga U-bar Truss 7'-11"`
	      case("327-071-090P"):
	   this.value = `Univ 20ga U-bar Truss 8'-11"`
		   
    }
    
  }, ["TRUSS"])
  addLogic("GL_END_CAPS", function(){
	this.value = getNode("END_CAPS").getAttribute("desc")
  }, ["END_CAPS"])
  addLogic("GL_WINDOW_TYPE", function(){
    this.value = getNode("WINDOWS").getAttribute("desc")
  }, ["WINDOWS"])
  addLogic("GL_GLAZING_TYPE", function(){
    this.value = getState("GLAZING_TYPE") !== 'none' ? getNode("GLAZING_TYPE").getAttribute("desc") : 'None'
  }, ["GLAZING_TYPE"])
  addLogic("GL_NUMBER_OF_LITES", function(){
    this.value = getState("GLAZING_TYPE") === 'none' ? 0 : getState("WINDOWS_LAYOUT") ==='both' ? 8:4
  }, ['GLAZING_TYPE', 'WINDOWS_LAYOUT'])
  addLogic("GL_HARDWARE_SIZE", function(){
    this.value = getState("HARDWARE_SZ") ?? 2
  }, ["HARDWARE_SZ"])
  addLogic("GL_HARDWARE_TYPE", function(){
    this.value = "Standard Plus"
  }, [])
    addLogic("GL_LIFT_TYPE", function(){
	this.value = getNode("LIFT_TYPE").getAttribute("display")

    }, ["LIFT_TYPE"])
    addLogic("GL_JAMB", function(){
	 this.value = getState("JAMB")
    }, ["JAMB"])
    addLogic("GL_SHAFT_TYPE", function(){
	 this.value = getNode("SHAFT_TYPE").getAttribute("display")
    }, ["SHAFT_TYPE"])
    addLogic("GL_BOTTOM_SEAL", function(){
	 let value = ""
	 switch(getState("BOTTOM_SEAL_OUTPUT")){
		case("NINE"):
			this.value =  "S160 9ft Bottom Seal"
			break;
		case("EIGHT"):
			this.value =  "S160 8ft Bottom Seal"
			break;
		case("SIXTEEN"):
			this.value =  "S160 16ft Bottom Seal"
	 }
    }, ["BOTTOM_SEAL_OUTPUT", "DOOR_MODEL"])
    addLogic("GL_SPRING_RH", function(){
	 this.value = getState("SPRING_RH")
    }, ["SPRING_RH"])
    addLogic("GL_SPRING_RH_DESCRIPTION", function(){
	 this.value = getState("SPRING_RH_DESC")
    }, ['SPRING_RH_DESC'])
     addLogic("GL_SPRING_LH", function(){
	 this.value = getState("SPRING_LH")
    }, ["SPRING_LH"])
    addLogic("GL_SPRING_LH_DESCRIPTION", function(){
	 this.value = getState("SPRING_LH_DESC")
    }, ["SPRING_LH_DESC"])
    addLogic("GL_STYLE", function(){
	 this.value = "Flush"
    }, [])
    $("#groupInputTable_1094153584").find('input[id], select[id]').toArray().map(e => e.id).forEach(e => nodeset[e].logic && nodeset[e].logic())
}
