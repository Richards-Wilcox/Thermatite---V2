function addGlazingCodeLogic(){
  //Bottom
  addLogic("GLZ_CODE_SB_RP_1", function(){
    const sectionBundleNum = "SBS4001,"
    if(getState("GLAZING_TYPE") === 'none')
	 //10 Zeroes
	 this.value = sectionBundleNum + "0,0,0,0,0,0,0,0,0,0"
    else
    	this.value = sectionBundleNum + getState("CNC_SB_RP1")
  }, ["CNC_SB_RP1", "GLAZING_TYPE"])
   //Top
  addLogic("GLZ_CODE_SB_RP_2", function(){
    const sectionBundleNum = "SBS4002,"
    if(getState("GLAZING_TYPE") === 'none')
	 //10 Zeroes
	 this.value = sectionBundleNum + "0,0,0,0,0,0,0,0,0,0"
    else
    	this.value = sectionBundleNum + getState("CNC_SB_RP2")
  }, ["CNC_SB_RP2", "GLAZING_TYPE"])
   //INT1
  addLogic("GLZ_CODE_SB_RP_3", function(){
    const sectionBundleNum = "SBS4003,"
    if(getState("GLAZING_TYPE") === 'none')
	 //10 Zeroes
	 this.value = sectionBundleNum + "0,0,0,0,0,0,0,0,0,0"
    else
    	this.value = sectionBundleNum + getState("CNC_INT1_RP1")
  }, ["CNC_INT1_RP1", "GLAZING_TYPE"])
   //INT2
  addLogic("GLZ_CODE_SB_RP_4", function(){
    const sectionBundleNum = "SBS4004,"
    if(getState("GLAZING_TYPE") === 'none')
	 //10 Zeroes
	 this.value = sectionBundleNum + "0,0,0,0,0,0,0,0,0,0"
    else
    	this.value = sectionBundleNum + getState("CNC_INT1_RP2")
  }, ["CNC_INT1_RP2", "GLAZING_TYPE"])
}
