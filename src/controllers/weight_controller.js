function getCurrentDoorWeight(){

 
	return   getSpringingWeight()
  }
function getSpringingWeight(){
  const width = Math.floor(getState("WIDTH")/12)
  const height = Math.floor(getState("HEIGHT")/12)
  const weightSqft = getNode("COLOR").getAttribute("weight")
    const faceWeight = (width * height * weightSqft) - ((width * 4) * 0.1)

   //Windows
  const weightPerLite = 2.9
  const liteWeightTotal = weightPerLite * (getState("WINDOWS") === 'none' ? 0 : getState("WINDOW_POSITION") === 'both' ? 8 : 4)
 
  const ondoorHDWRWeight = getOndoorHDWRWeight()
  const bottomSealWeight = 0.258 * getState("DOOR_WIDTH_FEET")
   const trussWeight = (0.82/12) * getState("TRUSS_LENGTH") *  getState("TRUSS_QTY")
   const totalWeight = faceWeight + liteWeightTotal + ondoorHDWRWeight + bottomSealWeight + trussWeight
  nodeset["WEIGHT_BREAKDOWN"].value = `Total: ${totalWeight.toFixed(2)} Face: ${faceWeight.toFixed(2)} Lites: ${liteWeightTotal.toFixed(2)} Ondoor HDWR: ${ondoorHDWRWeight.toFixed(2)} BttmSeal: ${bottomSealWeight.toFixed(2)} Truss: ${trussWeight.toFixed(2)}`
  //$("#WEIGHT_BREAKDOWN").val(`Total: ${(faceWeight + liteWeightTotal + ondoorHDWRWeight + bottomSealWeight).toFixed(2)} Face: ${faceWeight.toFixed(2)} Lites: ${liteWeightTotal.toFixed(2)} Ondoor HDWR: ${ondoorHDWRWeight.toFixed(2)} BttmSeal: ${bottomSealWeight.toFixed(2)}`)
	return totalWeight
}

function getOndoorHDWRWeight(){
  const height = getState("DOOR_HEIGHT_FEET")
  const endCapsMulticand = 	(getState("END_CAPS") === 'single' ? 1 : 2)
  
  const centerHinges = 0.263 * getState("CENTER_HINGE_QTY")
  const endHinges = 1.02 * 6 * endCapsMulticand
  const topBracket = 0.44 * 2 * endCapsMulticand
  const btmBracket = 0.539 * 2
  const roller = (endCapsMulticand === 1 ? 0.315 : 0.46) * 8
  
  let endcaps = 0
  switch(getState("END_CAPS_OUTPUT")){
	case("21_SINGLE"):
	 endcaps = 0.921 * 8
	 break;
	 case("24_SINGLE"):
	 endcaps = 1.06 * 8
	 break;
	 case("21_DOUBLE"):
	 endcaps = 1.485 * 8
	 break;
	 case("24_DOUBLE"):
	 endcaps = 1.71 * 8
	 break;
    default:
	 endcaps = "END_CAPS_ERROR"
	 break;
  }
  
  const total = endcaps + centerHinges + endHinges + topBracket + btmBracket + roller
  nodeset["HDWR_BREAKDOWN"].value = `End Caps: ${endcaps.toFixed(2)} Center Hinges: ${centerHinges.toFixed(2)} End Hinges: ${endHinges.toFixed(2)} Top Bracket: ${topBracket.toFixed(2)} Bottom Bracket: ${btmBracket.toFixed(2)} Roller: ${roller.toFixed(2)}`

  return total
}
