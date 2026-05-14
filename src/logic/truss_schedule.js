function loadTrussSchedule(){
 
  addLogic("TRUSS_QTY", function(){
    
    let value = 0
    if(getState("EXTRA_TRUSS") === "yes"){
	 value += 1
  }
    if(getState("WIDTH") === 16 * 12 ){
	 if(getState("HEIGHT") === 8*12){
	   value += 3
	 }else {
	 value += 1
	}
	 
    }
   
    this.value = value
   
  }, ["EXTRA_TRUSS", "WIDTH", "HEIGHT"])
  
  addLogic("TRUSS_CUT_INSTR", function(){
     
  	const cutLength = Math.floor(getState("TRUSS_LENGTH")/12)
    this.value = (`Cut truss down to ${cutLength}'-6"`)
  }, ["TRUSS_LENGTH"])
  
	addLogic("TRUSS", function() {
	  const width = getState("WIDTH")
	  if(width === 16*12){
	    this.value = '327-071-160P'
	  }
	//   if(getState("EXTRA_TRUSS") !== 'yes')
//		return;
	  if(width === 8*12)
	    this.value = '327-071-080P'
	  if(width === 9*12)
	    this.value = '327-071-090P'
	}, ["WIDTH", "EXTRA_TRUSS"])
  createNode("TRUSS_LENGTH", function(){
    const width = getState("WIDTH")
    const endCaps = getState("END_CAPS") === 'single' ? 6 : 12
    this.value = width - endCaps
  },"",null, ["WIDTH", "END_CAPS"])
}


