//This file is always always always fired last. 
function finalvalidation(){
  
  const cache = {}
  //Section bundle part nums
  const sectionBundleNums = $("#groupInputSection_671686949 input[type='text']").toArray().map(e => e.id)
  sectionBundleNums.forEach(e => {
    cache[e] = {node:nodeset[e], logic:nodeset[e].logic}
    nodeset[e].logic = () => {}
  })
  const cncLogic = getNode("CNC_CODE").logic
  const springLogic = getNode("SPRING_SOLUTION").logic
  const priceLogic = getNode("PRICE").logic
  getNode("CNC_CODE").logic = () => {}
  getNode("SPRING_SOLUTION").logic = () => {}
  getNode("PRICE").logic = () => {}
  
  
  forceInitialValidation().then(res => {
    
  sectionBundleNums.forEach(e => {
    nodeset[e].logic = cache[e].logic
    nodeset[e].logic()
  })
        getNode("CNC_CODE").logic = cncLogic
  rw(getNode("CNC_CODE"))
    getNode("SPRING_SOLUTION").logic = springLogic
    rw(getNode("SPRING_SOLUTION"))
    getNode("PRICE").logic = priceLogic
    rw(getNode("PRICE"))
    initRadio()
    
  })
 
}
function initRadio(){
  $('input[type="radio"][checked]').not("input[name='COLOR'], input[name='section_select']").each((i,radio) => {
	radio.parentElement.setAttribute("style", "background:black;");
    	$(`label[for="${radio.id}"`).attr("style", "color:white;")
  })
}
function loadTestResults(json){
  $("#INPUT_JSON").val(json)
  loadInputValues()
  finalvalidation()
}
