function loadPriceDrivers(){
  addLogic("ALUM_PANEL_PRICE", function(){
    this.value = ((getState("WIDTH")/12) * (getState("HEIGHT") /12) * 91.15).toFixed(2)
  }, ["WIDTH", "HEIGHT"])
  
	addLogic("PANEL_PRICE", function(){
	  this.value = getState("ALUM_PANEL_PRICE")
	}, ["ALUM_PANEL_PRICE"])
  addNode({
    id:"PRICE", 
    logic:async function(){
		const value = await getPrice() 
	
		this.value = value.reduce((a,b) => a += b.NET_PRICE, 0)
	 	const totalListPrice = value.reduce((a,b) => a += 1*b.PRICE, 0)
	 	value.forEach(lineItem => {
		  lineItem.NET_PRICE = (lineItem.NET_PRICE.toFixed(2))
		})
	 	value.push({
		  LINE_ITEM_VALUE:"TOTAL", 
		  QTY: "-",
		  DISCOUNT: "-",
		  PRICE: totalListPrice.toFixed(2),
		  MULT_ID: "-",
		  NET_PRICE: this.value.toFixed(2)
		  
		})

	 const valueSorted = value.sort((a, b) => {
	   const comp0 = a.LINE_ITEM_VALUE.localeCompare(b.LINE_ITEM_VALUE)
	   const comp1 = ((Number)(a.QTY)) - ((Number)(b.QTY))
	    if(comp0 !== 0)
		 return comp0
	   	else
		  return comp1
	 })
	 savePriceBom(JSON.stringify(valueSorted))
	 
	
	
    },
     value:{TOTAL:0},
  }, 
		//Price should only ever fire AFTER outputs change
	    ["OPERATOR_BRACKET_OUTPUT","PANEL_PRICE","WINDOW_ASSEMBLY","WEIGHT", "SPRING_RH","SPRING_LH", "JAMB", "SCREW_PACKAGE_QTY", "HANGER_ANGLE", "HANGER_ANGLE_QTY", "SHAFT_L1_PART", "OPERATOR_OUTPUT", "ADDITIONAL_TRANSMITTER_QTY", "ADDITIONAL_CONTROL_PANEL_OUTPUT", "ADDITIONAL_KEYLESS_ENTRY_OUTPUT", "ADDITIONAL_KEYLESS_ENTRY_QTY", "ADDIITONAL_CONTROL_PANEL_QTY"]
	    )
	addLogic("PRICE_DISPLAY", 
		    function(){

	    this.value = "$" + getState("PRICE").toFixed(2)
	  }, ["PRICE"])
  
  addLogic("TOTAL_PRICE_OUTPUT", 
		function(){
		 this.value = getState("PRICE")
		 }, ["PRICE"])
	
}

function getPriceJSON(){
  const priceQueryParent = '#displayMainInputGroups > div > div:not(#accordion1094153584):not(#configurator)'
  const priceQueryChild = 
	   "input[id]:not(#SPC_BOM):not(#GLAZING_OBJ):not(#INPUT_JSON):not(#OUTPUT_JSON):not(#FLATTEN_BOM_flatten):not(#TOTAL_PRICE_OUTPUT), select[id]"
  const arr = $(priceQueryParent).find(priceQueryChild).toArray().map(element => {
    let value = !!nodeset[element.id] ? "" + nodeset[element.id].value : ""
    if((value.includes(`"`) || value.includes(`'`)))
	  value = ""
        return {
            ITEM_NAME:element.id, 
            ITEM_VALUE:value
        }
	})

                                             
  const body = JSON.stringify(arr).replaceAll("'", "''")
  return body
}

async function getPrice(){
  
  

 //Collect all relevant inputs
//const arr = $("#displayMainInputGroups > div > div:not(#accordion636324516):not(#configurator)").find("input[id]:not(#GLAZING_OBJ):not(#INPUT_JSON):not(#OUTPUT_JSON):not(#FLATTEN_BOM_flatten):not(#TOTAL_PRICE_OUTPUT), select[id]").toArray().map(element => {
const body = getPriceJSON()
  
  try{
 return await $.ajax({
    method:"POST",
    url: "/spr/custom/jpoc/json/1413526219?1008928433&product_id=1008928433&pricebook_id=265613349",
    data:body,
    dataType: "json",
     contentType: "text/plain",
   processData: false, 
   headers: {
	LOG:'false'
   }
   });
  }catch(e){
    console.log(e)
return "ERROR"
  }
}
