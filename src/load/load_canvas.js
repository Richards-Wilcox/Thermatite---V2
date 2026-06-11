function loadImageCanvasPlugin(url, elem) {
  if(url === "")
    return ""
  return new Promise((resolve, reject) => {
    elem.onload = () => resolve(elem);
    elem.onerror = reject;
    elem.src = url;
  });
}

// Detects whether a background colour is dark (so groove lines render light)
// or light (so they render dark) — keeps Plank lines visible across colours.
function isDarkColor(hex) {
    if (!hex || typeof hex !== "string") return false;
    let h = hex.replace("#", "");
    if (h.length === 3) h = h.split("").map(c => c + c).join("");
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    if ([r, g, b].some(v => isNaN(v))) return false;
    return (0.299 * r + 0.587 * g + 0.114 * b) < 128;
}

// Draws horizontal Plank grooves across one section of the door.
// Inspired by drawPlankSection in the Landmark canvas — uses a fixed line
// count per section regardless of section height, with a soft inset shadow.
function drawPlankGrooves(ctx, x, y, width, sectionHeight, bgColor) {
    const dark = isDarkColor(bgColor);
    const numLines = 4; // grooves per section
    const spacing = sectionHeight / (numLines + 1);

    ctx.save();
    ctx.strokeStyle = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = -1;
    ctx.shadowColor = dark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.45)";

    for (let p = 1; p <= numLines; p++) {
        ctx.beginPath();
        ctx.moveTo(x, y + spacing * p);
        ctx.lineTo(x + width, y + spacing * p);
        ctx.stroke();
    }
    ctx.restore();
}

// Draws horizontal rib grooves procedurally — like Plank but with adjustable
// line count and a paired highlight underneath each shadow for that "carved"
// metal-rib look. Used for Standard Rib (~10 ribs/section) and Multi Rib
// (~24 ribs/section).
function drawRibGrooves(ctx, x, y, width, sectionHeight, bgColor, numRibs) {
    const dark = isDarkColor(bgColor);
    const spacing = sectionHeight / (numRibs + 1);
    const shadow = dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.45)";
    const highlight = dark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.55)";

    ctx.save();
    ctx.lineWidth = 1;
    for (let p = 1; p <= numRibs; p++) {
        const ly = y + spacing * p;
        // Shadow line
        ctx.strokeStyle = shadow;
        ctx.beginPath();
        ctx.moveTo(x, ly);
        ctx.lineTo(x + width, ly);
        ctx.stroke();
        // Highlight line just below — sells the bevelled rib edge
        ctx.strokeStyle = highlight;
        ctx.beginPath();
        ctx.moveTo(x, ly + 1);
        ctx.lineTo(x + width, ly + 1);
        ctx.stroke();
    }
    ctx.restore();
}

function dimensionText(ctx, x, y, length_in) {
	// Calculate feet and remaining inches
	const feet = Math.floor(length_in / 12);
	const inches = length_in % 12;

	// Format the string: handle perfect multiples of 12
	let dimensionText = "";
	if (feet > 0 && inches > 0) {
		dimensionText = `${feet}' ${inches}"`;
	} else if (feet > 0) {
		dimensionText = `${feet}'`;
	} else {
		dimensionText = `${inches}"`;
	}

	ctx.fillText(dimensionText, x, y);
}

const CANVAS_PLUGIN = {
  /*
  The layerObj defines five layers:
  dimensions, background, sections, glazings, and misc.
  They are rendered in that order.
  Each layer is an object. Each layer object contains *strings* that are interpreted by the canvas.
  Do not pass SVG instructions, images, or anything similar.
  */
  darker: function (color) {
    const r = parseInt(color.substring(1,3), 16) - 10
    const g = parseInt(color.substring(3,5), 16) - 10
    const b = parseInt(color.substring(5,7), 16) - 10
    return "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0')
  },

  loadCanvasHTML: () => {
    $("#CANVAS_PLUGIN").html(
      `<canvas id="CONFIG_CANVAS" width=1400 height=1000 style="height:65vh; padding-bottom: 30px; border:none;background: transparent;"></canvas>`
    );
  },
  //958177
  //F5F5DC00

  drawThermatiteDoor:async function (layerObj){


    const canvas = $("#CONFIG_CANVAS")[0];
    const dimensions = layerObj.dimensions
    const doorWidthInches = dimensions.widthInches
    const doorHeightInches = dimensions.heightInches
    const numSections = dimensions.numSections
    const canvasWidth = canvas.getAttribute("width");
    //const canvasWidth = 1400; // Had to set canvas width higher to fit larger image
    const canvasHeight = canvas.getAttribute("height");
    const raster = document.createElement("canvas");
    raster.setAttribute("width", canvasWidth);
    raster.setAttribute("height", canvasHeight);
    const ctx =  raster.getContext("2d");

    const dimRatio = doorWidthInches / doorHeightInches

    // Fit the door to the canvas while preserving real-world proportions.
    // Reserve margin for dimension labels/lines drawn outside the door rect.
    const marginX = 120; // room for vertical dim line + text on the right
    const marginY = 120; // room for horizontal dim line + text on the bottom
    const availableWidth  = canvasWidth  - marginX * 2;
    const availableHeight = canvasHeight - marginY * 2;

    // Pixels-per-inch baseline: an 8'x7' (96"x84") door fills the 595x595 box.
    const basePxPerInch = 595 / 96;
    let pxPerInch = basePxPerInch;

    // If the real-world door at the baseline scale would overflow the
    // available area, shrink uniformly so both axes fit. Both axes use the
    // same pxPerInch, so proportions stay accurate.
    const fitPxPerInch = Math.min(
      availableWidth  / doorWidthInches,
      availableHeight / doorHeightInches
    );
    if (fitPxPerInch < pxPerInch) pxPerInch = fitPxPerInch;

    let width  = doorWidthInches  * pxPerInch;
    let height = doorHeightInches * pxPerInch;


 //   console.log("Width " + doorWidthInches);
 //   console.log("THe door height inches " + doorHeightInches);

    const x = (canvasWidth - width) / 2;
    const y = (canvasHeight - height) / 2;
    const widthRatio = width / doorWidthInches;
    const heightRatio = height / doorHeightInches;
    const scale = dimensions.scale ?? 1
    const inchConversion = (doorWidthInches > doorHeightInches ? 800 / doorWidthInches : 800 / doorHeightInches) * scale

    const sectionHeight = height / numSections;


    for(let i =0;i<dimensions.numSections;i++){
 	 //Background
    const background = layerObj.background;

    const bgColor = background.color;
    const sY = y + sectionHeight * i;

    // All patterns render procedurally — flat coloured fill, then crisp rib
    // lines drawn on top. Replaces the prior image-texture approach which
    // washed out under colour tints.
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, sY, width, sectionHeight);

    switch (background.pattern) {
      case "Standard Rib":
        drawRibGrooves(ctx, x, sY, width, sectionHeight, bgColor, 10);
        break;
      case "Multi Rib":
        drawRibGrooves(ctx, x, sY, width, sectionHeight, bgColor, 24);
        break;
      case "Raynor Profile":
        drawRibGrooves(ctx, x, sY, width, sectionHeight, bgColor, 6);
        break;
      case "Plank":
        drawPlankGrooves(ctx, x, sY, width, sectionHeight, bgColor);
        break;
      // Flush and None: flat panel, no rib detail.
    }

    ctx.strokeStyle = "black";
    ctx.strokeRect(x, sY, width, sectionHeight);


    // Testing highlights
    const highlightHeight = sectionHeight * 0.02;
    let highlightColor = bgColor; // Defaults for door shading

    switch (bgColor) {
	 case "#000":
	   highlightColor = 'rgba(0, 0, 0, 1)';
	 case "#FFF":
	   highlightColor = 'rgb(255, 255, 255, 1)';
	 case "#3f3f3f":
	   highlightColor = 'rgb(63, 63, 63, 1)';
    }

    const shadeColors = {
	 "#000": [
	   "rgba(255, 255, 255, 0.3)",//lines
	   "rgba(255, 255, 255, 0.1)",
	   "rgba(0, 0, 0, 0.1",//Sides
	   "rgba(0, 0, 0, 0.5)",
	   "rgba(0, 0, 0, 0.8)",
	   "rgba(0, 0, 0, 1",
	   "rgba(255, 0, 0, 0.1)",
	   "rgba(255, 0, 0, 0.5)",
	   "rgba(255, 0, 0, 0.8)",
	   "rgba(255, 0, 0, 1)",
	   "rgba(0, 0, 0, 0.825)",//Sections
	   "rgba(255, 255, 255, 0.275)",
	   "rgba(255, 255, 255, 0.25)",
	   "rgba(255, 255, 255, 0.225)",
	   "rgba(255, 255, 255, 0.2)",
	   "rgba(255, 255, 255, 0.175)",
	   "rgba(255, 255, 255, 0.15)",
	   "rgba(255, 255, 255, 0.075)",
	   "rgba(255, 255, 255, 0.01)",
	   "rgba(0, 0, 0, 0.05)",
	   "rgba(0, 0, 0, 0.825)"
	 ],
	 "#FFF": [
	   "rgba(160, 160, 160, 1)",//Lines
	   "rgba(160, 160, 160, 0.35)",
	   "rgba(63, 63, 63, 0.025",//Sides
	   "rgba(63, 63, 63, 0.05)",
	   "rgba(63, 63, 63, 0.2)",
	   "rgba(63, 63, 63, 0.1)",
	   "rgba(255, 0, 0, 0.1)",
	   "rgba(255, 0, 0, 0.5)",
	   "rgba(255, 0, 0, 0.8)",
	   "rgba(255, 0, 0, 1)",
	   "rgba(63, 63, 63, 0.125)",//Sections
	   "rgba(63, 63, 63, 0.055)",
	   "rgba(63, 63, 63, 0.05)",
	   "rgba(63, 63, 63, 0.015)",
	   "rgba(63, 63, 63, 0.01)",
	   "rgba(63, 63, 63, 0.015)",
	   "rgba(63, 63, 63, 0.05)",
	   "rgba(63, 63, 63, 0.015)",
	   "rgba(63, 63, 63, 0.01)",
	   "rgba(63, 63, 63, 0.05)",
	   "rgba(63, 63, 63, 0.125)"
	 ],
	 "#3f3f3f": [
	   "rgba(255, 255, 255, 0.5)",//lines
	   "rgba(255, 255, 255, 0.2)",
	   "rgba(45, 45, 45, 0.1)",//Sides
	   "rgba(45, 45, 45, 0.5)",
	   "rgba(45, 45, 45, 0.8)",
	   "rgba(45, 45, 45, 1",
	   "rgba(255, 0, 0, 0.1)",
	   "rgba(255, 0, 0, 0.5)",
	   "rgba(255, 0, 0, 0.8)",
	   "rgba(255, 0, 0, 1)",
	   "rgba(45, 45, 45, 0.925)",//Sections
	   "rgba(255, 255, 255, 0.275)",
	   "rgba(255, 255, 255, 0.25)",
	   "rgba(255, 255, 255, 0.225)",
	   "rgba(255, 255, 255, 0.2)",
	   "rgba(255, 255, 255, 0.175)",
	   "rgba(255, 255, 255, 0.15)",
	   "rgba(255, 255, 255, 0.075)",
	   "rgba(255, 255, 255, 0.01)",
	   "rgba(45, 45, 45, 0.05)",
	   "rgba(45, 45, 45, 0.925)"

	 ]
    }



	//For now only enabling gradients for black only
    if (bgColor === "#000" || bgColor === "#FFF" || bgColor === "#3f3f3f") {
	 // Top Highlight Line
	 const gradientLines = ctx.createLinearGradient(0, y + sectionHeight * i, 0, y + sectionHeight * i + highlightHeight);
	 gradientLines.addColorStop(0, shadeColors[bgColor][0]);
	 gradientLines.addColorStop(1, shadeColors[bgColor][1]);

	 ctx.fillStyle = gradientLines;
	 ctx.fillRect(x, y + sectionHeight * i, width, highlightHeight);

	 // Bottom Highlight
	 //30 og
	 let highlightWidth = 18 + (2 * i); // pixels
	   // createLinearGradient x0, y0, x1, y1 start start end end This is gradient
	   // cts.fillRect x y width height specifies the properties of the actual rectangle the gradient is applied to
	   //

	   // Panel side shading Right
	   const gradientRightSide = ctx.createLinearGradient(x + width - highlightWidth, 0, x + width, 0);
	   gradientRightSide.addColorStop(0, shadeColors[bgColor][2]);
	   gradientRightSide.addColorStop(0.5, shadeColors[bgColor][3]);
	   gradientRightSide.addColorStop(0.8, shadeColors[bgColor][4]);
	   gradientRightSide.addColorStop(1, shadeColors[bgColor][5]);

	   ctx.fillStyle = gradientRightSide;
	   ctx.fillRect(x + width - highlightWidth, y + sectionHeight * i, highlightWidth,sectionHeight);

	   // Panel side shading left
	   const gradientLeftSide = ctx.createLinearGradient(x, sectionHeight, x + highlightWidth, sectionHeight);
	   gradientLeftSide.addColorStop(0, shadeColors[bgColor][5]);
	   gradientLeftSide.addColorStop(0.3, shadeColors[bgColor][4]);
	   gradientLeftSide.addColorStop(0.7, shadeColors[bgColor][3]);
	   gradientLeftSide.addColorStop(1, shadeColors[bgColor][2]);

	   ctx.fillStyle = gradientLeftSide;
	   ctx.fillRect(x, y + sectionHeight * i, highlightWidth, sectionHeight);

	   /*// Window shading test
	   const windowsGradient = ctx.createLinearGradient(0, sectionHeight, 100, 0);
	   windowsGradient.addColorStop(0, shadeColors[bgColor][6]);
	   windowsGradient.addColorStop(0.5, shadeColors[bgColor][7]);
	   windowsGradient.addColorStop(0.8, shadeColors[bgColor][8]);
	   windowsGradient.addColorStop(1, shadeColors[bgColor][9]);

	   ctx.fillStyle = windowsGradient;
	   ctx.fillRect(0, sectionHeight, 100, 100);
	   */

	   // Panel full gradients
	   const panelTop = y + sectionHeight * i;
	   const panelBottom = panelTop + sectionHeight;

	//   console.log("Panel top = Index:" + i + "   :" + panelTop);
	//   console.log("Panel panelBottom = Index:" + i + "   :" + panelBottom);

	   let gradientShading;
	   if (i === 0) {
		   gradientShading = ctx.createLinearGradient(x, panelTop, x, panelBottom);
		   gradientShading.addColorStop(0, shadeColors[bgColor][10]);
		   gradientShading.addColorStop(0.5, shadeColors[bgColor][11]);
		   gradientShading.addColorStop(1, shadeColors[bgColor][12]);
	   } else if (i === 1) {
		   gradientShading = ctx.createLinearGradient(x, panelTop, x, panelBottom);
		   gradientShading.addColorStop(0, shadeColors[bgColor][13]);
		   gradientShading.addColorStop(0.5, shadeColors[bgColor][14]);
		   gradientShading.addColorStop(1, shadeColors[bgColor][15]);
	   } else if (i === 2) {
		   gradientShading = ctx.createLinearGradient(x, panelTop, x, panelBottom);
		   gradientShading.addColorStop(0, shadeColors[bgColor][16]);
		   gradientShading.addColorStop(0.5, shadeColors[bgColor][17]);
		   gradientShading.addColorStop(1, shadeColors[bgColor][18]);
	   } else if (i === 3) {
		   gradientShading = ctx.createLinearGradient(x, panelTop, x, panelBottom);
		   gradientShading.addColorStop(0, shadeColors[bgColor][19]);
		   gradientShading.addColorStop(1, shadeColors[bgColor][20]);
	   }
	   if (gradientShading) {
		   ctx.fillStyle = gradientShading;
		   ctx.fillRect(x, panelTop, width, sectionHeight);
	   }
    }

    //Glazing
    const glazing = layerObj.glazing;

    //Now we need to convert the real inches to pixels on the canvas.
    const glazingWidthCanvas = glazing.width * widthRatio;
    const glazingHeightCanvas = glazing.height * heightRatio;
    const distanceFromEdgeCanvas = glazing.distanceFromEdge * widthRatio || 5;

   // console.log("GLazing object = " + JSON.stringify(glazing));
	//Need to add this to the windows
    //const windowLinearGradientFill = ctx.createLinearGradient();

    switch (glazing.material) {
      case "lites":
      case "polytite_fullview":
      case "alumatite_fullview":
        // Glazed styles draw as clear glass on the preview.
        ctx.fillStyle = "#ADD8E6";
        break;
      case "none":
      default:
        ctx.fillStyle = "white";
    }

    const corners = glazing.liteType === "AA" ? 20 : 0;

    ctx.strokeStyle = glazing.frameColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (glazing.numLites == 1) {
      switch (glazing.spacing.toLowerCase()) {
        case "left":
          ctx.roundRect(
            x + distanceFromEdgeCanvas,
            y + (sectionHeight/2) + sectionHeight * i  - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();

          break;
        case "right":
          ctx.roundRect(
            width + x - glazingWidthCanvas - distanceFromEdgeCanvas,
            y + (sectionHeight/2) + sectionHeight * i  - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();
          break;
        case "center":
          ctx.roundRect(
            canvasWidth / 2 - glazingWidthCanvas / 2,
            y + (sectionHeight/2) + sectionHeight * i  - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();
          break;
      }
    } else {
      const numLites = glazing.numLites;
      const spaceBetween =
        (width - distanceFromEdgeCanvas * 2 - glazingWidthCanvas * numLites) /
        (numLites - 1);
      const start = x + distanceFromEdgeCanvas;
      for (let j = 0; j < numLites; j++) {

        ctx.beginPath();
        ctx.roundRect(
          start + (spaceBetween + glazingWidthCanvas) * j,
          y + (sectionHeight/2) + sectionHeight * i  - glazingHeightCanvas / 2,
          glazingWidthCanvas,
          glazingHeightCanvas,
          corners
        );
        ctx.fill();
        ctx.stroke();
      }
    }
	if(!!layerObj.misc.labels || layerObj.misc.labels === true ){


    //Drawing the dimensions on the canvas
    const dimGap = 20;
    const textGap = 30;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "32px sans serif";

    ctx.beginPath();
    ctx.moveTo(x, y + height + dimGap);
    ctx.lineTo(x, y + height + 30);
    ctx.lineTo(x + width / 2 - 40, y + height + 30);
	dimensionText(ctx, x + width / 2 - 30, y + height + 40, doorWidthInches);
    ctx.moveTo(x + width / 2 + 60, y + height + 30);
    ctx.lineTo(x + width, y + height + 30);
    ctx.lineTo(x + width, y + height + dimGap);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width + dimGap, y);
    ctx.lineTo(x + width + 30, y);
    ctx.lineTo(x + width + 30, y + height / 2 - 30);
	dimensionText(ctx, x + width + 20, y + height / 2 + 10, doorHeightInches);
    ctx.moveTo(x + width + 30, y + height / 2 + 30);
    ctx.lineTo(x + width + 30, y + height);
    ctx.lineTo(x + width + dimGap, y + height);
    ctx.stroke();
	}

	  //Door border
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, width, height);

    }

    // Draw Text Warning
    ctx.font = 'bold 18px "Arial", sans-serif';
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("Actual door appearance may differ slightly.", canvas.width / 2, canvas.height - 10);




    document
      .getElementById("CONFIG_CANVAS")
      .getContext("2d")
      .putImageData(ctx.getImageData(0, 0, canvasWidth, canvasHeight), 0, 0);
  },

  drawAlumatiteDoor: function (layerObj) {
    	  const svg = document.createElement("svg")
    const canvas = $("#CONFIG_CANVAS")[0];

    //Dimensions
    const dimensions = layerObj.dimensions;
    //const canvasWidth = (Number)(canvas.getAttribute("width"));
    const canvasWidth = 1000; // Reduced Original Canvas height
    const canvasHeight = (Number)(canvas.getAttribute("height"));
	svg.setAttribute("width", canvasWidth.toFixed(0))
    svg.setAttribute("height", canvasHeight.toFixed(0))
    svg.setAttribute("xmlns","http://www.w3.org/2000/svg")
    const doorWidthInches = dimensions.widthInches;
    const doorHeightInches = dimensions.heightInches;
    const dimRatio = doorWidthInches / doorHeightInches
    let width = 800;
    let height = 800;
    if(doorWidthInches > doorHeightInches){
		height = height / dimRatio
    }else{
	 width = width * dimRatio
    }

    const x = (canvasWidth - width) / 2;
    const y = (canvasHeight - height) / 2;
    const widthRatio = width / doorWidthInches;
    const heightRatio = height / doorHeightInches;
    const scale = dimensions.scale ?? 1
    const inchConversion = (doorWidthInches > doorHeightInches ? 800 / doorWidthInches : 800 / doorHeightInches) * scale

    const raster = document.createElement("canvas");
    raster.setAttribute("width", 1000);
    raster.setAttribute("height", 1000);
    const ctx = raster.getContext("2d");
    //Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // ** BACKGROUND ** //

    //This becomes the glazing color
    const bgColor = layerObj.glazing.windowColor;
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height)

    svg.innerHTML += `<rect width="${width.toFixed(0)}" height="${height.toFixed(0)}" x="${x}" y="${y}" fill="${bgColor}" />`
    //** Frame **//
    const sections = layerObj.glazing;
	const windowsPerSection = sections.windowsPerSection
    //The windows are just the negative space between the stiles
    const centerStileInches = 2;
    const endStileInches = 2 * dimensions.endStiles;
    const intStileInches = 2.25;
    const topStileInches = 5;

    const centerStileWidth = centerStileInches * inchConversion
    const endStileWidth = endStileInches * inchConversion
    const intStileHeight = intStileInches * inchConversion
    const topStileHeight = topStileInches * inchConversion

    //These values are passed in in inches. They need to be converted to pixels.
    const bttmSectionHeight = inchConversion * dimensions.bttmSectionHeight
    const topSectionHeight = inchConversion * dimensions.topSectionHeight
    const intSectionHeight = inchConversion *  dimensions.intSectionHeight
    const intSectionQTY = dimensions.intSectionQty
    const centerStileQTY = windowsPerSection - 1;
    const frameColor = sections.frameColor

    ctx.fillStyle = frameColor
    //Top Stile
    ctx.fillRect(x, y,width, topStileHeight )
//    svg.innerHTML += `<rect width="${width.toFixed(0)}" height="${topStileHeight.toFixed(0)}" x="${x.toFixed(0)}" y="${y.toFixed(0)}" fill="${ctx.fillStyle}" />`
    //Bottom Stile
    ctx.fillRect(x, y+height - topStileHeight, width, topStileHeight)
//    svg.innerHTML += `<rect width="${width.toFixed(0)}" height="${topStileHeight.toFixed(0)}" x="${x.toFixed(0)}" y="${(y-topStileHeight).toFixed(0)}" fill="${ctx.fillStyle}" />`

    //End Stile Left
    ctx.fillRect(x,y, endStileWidth, height)
  //   svg.innerHTML += `<rect width="${endStileWidth.toFixed(0)}" height="${height.toFixed(0)}" x="${x.toFixed(0)}" y="${y.toFixed(0)}" fill="${ctx.fillStyle}" />`

    //End Stile Right
    ctx.fillRect(x + width - endStileWidth,y, endStileWidth, height)
   //  svg.innerHTML += `<rect width="${endStileWidth.toFixed(0)}" height="${height.toFixed(0)}" x="${(x + width - endStileWidth).toFixed(0)}" y="${y.toFixed(0)}" fill="${ctx.fillStyle}" />`

    //Intermediate Styles
    for(let i = 0;i<intSectionQTY+1;i++){

	 ctx.fillRect(x, y+topSectionHeight-intStileHeight + (i)*(intSectionHeight), width, intStileHeight*2)
	 svg.innerHTML += `<rect width="${width.toFixed(0)}" height="${(intStileHeight*2).toFixed(0)}" x="${x}" y="${(y+topSectionHeight-intStileHeight).toFixed(0)}" fill="${ctx.fillStyle}" />`


    }
    const windowWidth = (((width - centerStileWidth*centerStileQTY - endStileWidth*2)/windowsPerSection)).toFixed(0)
    //Center Stiles
    for(let i = 0;i<centerStileQTY;i++){
	 	 ctx.fillRect(x + endStileWidth + (i+1)*windowWidth + i*centerStileWidth, y , centerStileWidth, height)
	 	 svg.innerHTML += `<rect x="${(x + endStileWidth + (i+1)*windowWidth + i*centerStileWidth).toFixed(0)}" y="${y.toFixed(0)}" width="${centerStileWidth.toFixed(0)}" height="${height.toFixed(0)}"  fill="${ctx.fillStyle}" />`

    }
    //Glazing Lines
    ctx.strokeStyle= "white"
    ctx.lineWidth = 1;
    const glazingLineLength = intSectionHeight / 7
    for(let i = 0;i<windowsPerSection;i++){
	 const centerx = x + endStileWidth +windowWidth/2 + (i)*windowWidth + i*centerStileWidth/2
	 for(let j = 0;j< dimensions.numSections;j++){
	   const centery = y + topStileHeight/2 + topSectionHeight/2 + j*intSectionHeight
	   ctx.moveTo(centerx - glazingLineLength, centery - glazingLineLength)
	   ctx.lineTo(centerx + glazingLineLength, centery + glazingLineLength)
	   ctx.stroke()
	   svg.innerHTML += `<line x1="${(centerx - glazingLineLength).toFixed(0)}" y1="${(centery - glazingLineLength).toFixed(0)}" x2="${(centerx + glazingLineLength).toFixed(0)}" y2="${(centery + glazingLineLength).toFixed(0)}" style="stroke:white;stroke-width:1" />`

	   ctx.moveTo(centerx - glazingLineLength/2 - 2*inchConversion, centery - glazingLineLength/2 )
	   ctx.lineTo(centerx + glazingLineLength/2 - 2*inchConversion, centery + glazingLineLength/2)
	   ctx.stroke()
   	   svg.innerHTML += `<line x1="${(centerx - glazingLineLength/2 - 2*inchConversion).toFixed(0)}" y1="${ (centery - glazingLineLength/2).toFixed(0)}" x2="${(centerx + glazingLineLength/2 - 2*inchConversion).toFixed(0)}" y2="${(centery + glazingLineLength/2).toFixed(0)}" style="stroke:white;stroke-width:1" />`

	   ctx.moveTo(centerx - glazingLineLength/2 + 2*inchConversion, centery - glazingLineLength/2)
	   ctx.lineTo(centerx + glazingLineLength/2 + 2*inchConversion, centery + glazingLineLength/2 )
	   ctx.stroke()
	   svg.innerHTML += `<line x1="${(centerx - glazingLineLength/2 + 2*inchConversion).toFixed(0)}" y1="${ (centery - glazingLineLength/2).toFixed(0)}" x2="${(centerx + glazingLineLength/2 + 2*inchConversion).toFixed(0)}" y2="${(centery + glazingLineLength/2).toFixed(0)}" style="stroke:white;stroke-width:1" />`
	 }
  }
    /*
	//Drawing the section divisions, debug purposes
    ctx.strokeStyle = "white"
    ctx.moveTo(x,y+topSectionHeight )
    ctx.lineTo(x + width, y+topSectionHeight )
    ctx.stroke()
     ctx.strokeStyle = "white"
//    ctx.moveTo(x, y+height-bttmSectionHeight)
//    ctx.lineTo(x + width,y+height-bttmSectionHeight)
//    ctx.stroke()
    for(let i = 0;i<intSectionQTY;i++){
	ctx.strokeStyle = "white"
    ctx.moveTo(x, y+topSectionHeight + (i+1)*(intSectionHeight + intStileHeight))
    ctx.lineTo(x + width,y+topSectionHeight + (i+1)*(intSectionHeight + intStileHeight))
    ctx.stroke()

    }*/

 //Drawing the dimensions on the canvas
    const dimGap = 20;
    const textGap = 30;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "32px sans serif";

    ctx.beginPath();
    ctx.moveTo(x, y + height + dimGap);
    ctx.lineTo(x, y + height + 30);
    ctx.lineTo(x + width / 2 - 40, y + height + 30);
	dimensionText(ctx, x + width / 2 - 30, y + height + 40, doorWidthInches);
    ctx.moveTo(x + width / 2 + 60, y + height + 30);
    ctx.lineTo(x + width, y + height + 30);
    ctx.lineTo(x + width, y + height + dimGap);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width + dimGap, y);
    ctx.lineTo(x + width + 30, y);
    ctx.lineTo(x + width + 30, y + height / 2 - 30);
	dimensionText(ctx, x + width + 20, y + height / 2 + 10, doorHeightInches);
    ctx.moveTo(x + width + 30, y + height / 2 + 30);
    ctx.lineTo(x + width + 30, y + height);
    ctx.lineTo(x + width + dimGap, y + height);
    ctx.stroke();
    /*
    //Debugging Lines
    ctx.strokeStyle = "black"
    ctx.lineWidth = 1
    ctx.moveTo(canvasWidth/2, 0)
    ctx.lineTo(canvasWidth/2, canvasHeight)
    ctx.stroke()
        ctx.strokeStyle = "black"
     ctx.moveTo(0, canvasHeight/2)
    ctx.lineTo(canvasWidth, canvasHeight/2)
    ctx.stroke()
        ctx.strokeStyle = "black"

    ctx.moveTo(x,0)
    ctx.lineTo(x, canvasWidth)
    ctx.stroke()

    for(let i = 0;i < intSectionQTY+1;i++){
	     ctx.strokeStyle = "black"
	 ctx.moveTo(0, y +topSectionHeight + intSectionHeight*i, 0)
     ctx.lineTo(canvasWidth,y+topSectionHeight + intSectionHeight*i)
      ctx.stroke()
    }
    ctx.strokeStyle="red"
 	ctx.moveTo(0, y  + height - bttmSectionHeight)
     ctx.lineTo(canvasWidth   ,  y  + height - bttmSectionHeight)
      ctx.stroke()
    ctx.strokeStyle = "black"
    */
    //Render the image to the canvas
    document
      .getElementById("CONFIG_CANVAS")
      .getContext("2d")
      .putImageData(ctx.getImageData(0, 0, canvasWidth, canvasHeight), 0, 0);
    return svg;
  },

  drawThermatitePanel: async function (layerObj, section_x, section_y,section_width, section_height, context ) {
    const canvas = $("#CONFIG_CANVAS")[0];

    //Dimensions
    const dimensions = layerObj.dimensions;
    const canvasWidth = canvas.getAttribute("width");
    //const canvasWidth = 1000; // Reduced Canvas Width
    const canvasHeight = canvas.getAttribute("height");

    const doorWidthInches = section_width ?? dimensions.widthInches;
    const doorHeightInches = section_height ?? dimensions.heightInches;


    const dimRatio = doorWidthInches / doorHeightInches
    let width = 800;
    let height = 800;
    if(doorWidthInches > doorHeightInches){
		height = height / dimRatio
    }else{
	 width = width * dimRatio
    }

    const x = section_x ?? 0//(canvasWidth - width) / 2;
    const y = section_y ?? (canvasHeight - height) / 2;
    const widthRatio = width / doorWidthInches;
    const heightRatio = height / doorHeightInches;


    const scale = dimensions.scale ?? 1
    const inchConversion = (doorWidthInches > doorHeightInches ? 800 / doorWidthInches : 800 / doorHeightInches) * scale


    const raster = document.createElement("canvas");
    raster.setAttribute("width", canvas.getAttribute("width"));
    raster.setAttribute("height", canvas.getAttribute("height"));

    const ctx = context ;

    ctx.font = '14pt sans-serif'
    //Clear canvas
 //  if(!context)
  //  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    //Background
    const background = layerObj.background;
    let pattern = "";
    switch (background.pattern) {
      case "Multi Rib":
        pattern = "/Image/item_master/images/EW-1-0116.jpg";
        break;
      case "Standard Rib":
        pattern = "/Image/item_master/images/EW-1-0108.jpg";
        break;
      case "Flush":
        pattern = "/Image/item_master/images/EW-1-0155.jpg";
        break;
      case "Raynor Profile":
        pattern = "/Image/item_master/images/EW-2201-4182.jpg";
        break;
      case "Plank":
        pattern = "/Image/item_master/images/EW-1-0155.jpg"; // TODO: replace with actual plank texture
        break;
    }

    const bgImage = new Image(width, height);
    bgImage.src = pattern;
    await loadImageCanvasPlugin(pattern, bgImage);

    // Draw the image after it has loaded
    ctx.drawImage(bgImage, x, y, width, height);
    const bgColor = background.color;

    ctx.globalAlpha = 0.5;
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, width, height);
    ctx.globalAlpha = 1;

    //Glazing
    const glazing = layerObj.glazing;

    //Now we need to convert the real inches to pixels on the canvas.
    const glazingWidthCanvas = glazing.width * widthRatio;
    const glazingHeightCanvas = glazing.height * heightRatio;
    const distanceFromEdgeCanvas = glazing.distanceFromEdge * widthRatio || 0;
    switch (glazing.material) {
      case "A":
        ctx.fillStyle = "#ADD8E6";
        break;
      case "C":
        ctx.fillStyle = "#D3D3D3";
        break;
      case "T":
        ctx.fillStyle = "#B0C4DE";
        break;
      default:
        ctx.fillStyle = "white";
    }

    const corners = glazing.liteType === "AA" ? 20 : 0;

    ctx.strokeStyle = glazing.frameColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (glazing.numLites == 1) {
      switch (glazing.spacing.toLowerCase()) {
        case "left":
          ctx.roundRect(
            x + distanceFromEdgeCanvas,
            canvasHeight / 2 - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();

          break;
        case "right":
          ctx.roundRect(
            width + x - glazingWidthCanvas - distanceFromEdgeCanvas,
            canvasHeight / 2 - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();
          break;
        case "center":
          ctx.roundRect(
            canvasWidth / 2 - glazingWidthCanvas / 2,
            canvasHeight / 2 - glazingHeightCanvas / 2,
            glazingWidthCanvas,
            glazingHeightCanvas,
            corners
          );
          ctx.fill();
          ctx.stroke();
          break;
      }
    } else {
      const numLites = glazing.numLites;
      const spaceBetween =
        (width - distanceFromEdgeCanvas * 2 - glazingWidthCanvas * numLites) /
        (numLites - 1);
      const start = x + distanceFromEdgeCanvas;
      for (let i = 0; i < numLites; i++) {
        ctx.beginPath();
        ctx.roundRect(
          start + (spaceBetween + glazingWidthCanvas) * i,
          canvasHeight / 2 - glazingHeightCanvas / 2,
          glazingWidthCanvas,
          glazingHeightCanvas,
          corners
        );
        ctx.fill();
        ctx.stroke();
      }
    }
	if(!!layerObj.misc.labels || layerObj.misc.labels === true ){


    //Drawing the dimensions on the canvas
    const dimGap = 20;
    const textGap = 30;
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.font = "32px sans serif";

    ctx.beginPath();
    ctx.moveTo(x, y + height + dimGap);
    ctx.lineTo(x, y + height + 30);
    ctx.lineTo(x + width / 2 - 40, y + height + 30);
	dimensionText(ctx, x + width / 2 - 30, y + height + 40, doorWidthInches);
    ctx.moveTo(x + width / 2 + 60, y + height + 30);
    ctx.lineTo(x + width, y + height + 30);
    ctx.lineTo(x + width, y + height + dimGap);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + width + dimGap, y);
    ctx.lineTo(x + width + 30, y);
    ctx.lineTo(x + width + 30, y + height / 2 - 30);
	dimensionText(ctx, x + width + 20, y + height / 2 + 10, doorHeightInches);
    ctx.moveTo(x + width + 30, y + height / 2 + 30);
    ctx.lineTo(x + width + 30, y + height);
    ctx.lineTo(x + width + dimGap, y + height);
    ctx.stroke();
	}

	  //Door border
    ctx.strokeStyle = "black";
    ctx.strokeRect(x, y, width, height);



    //Render the image to the canvas
  	//if(!context)
    document
      .getElementById("CONFIG_CANVAS")
      .getContext("2d")
      .putImageData(ctx.getImageData(0, 0, canvasWidth, canvasHeight), 0, 0);

  },

  redrawFromCurrentForm: async function() {
    let widthInches, heightInches;

    if ($("#custom_dimensions").is(":checked")) {
      const wFt = parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0;
      const wIn = parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0;
      const hFt = parseInt($("#CUSTOM_HEIGHT_FEET").val()) || 0;
      const hIn = parseInt($("#CUSTOM_HEIGHT_INCHES").val()) || 0;
      widthInches = (wFt * 12 + wIn) || 96;
      heightInches = (hFt * 12 + hIn) || 84;
    } else {
      const selectedSize = $("input[name='SIZE']:checked");
      const wFt = Number(selectedSize.attr("width")) || 8;
      const wIn = Number(selectedSize.attr("widthInches")) || 0;
      const hFt = Number(selectedSize.attr("height")) || 7;
      const hIn = Number(selectedSize.attr("heightInches")) || 0;
      widthInches = wFt * 12 + wIn;
      heightInches = hFt * 12 + hIn;
    }

    const pattern = $("input[name='Pattern']:checked").val() || "Standard Rib";
    const color = $("input[name='COLOR']:checked").attr("hex") || "#654321";
    const numSections = parseInt($("#NUM_OF_SEC").val()) || 4;

    await CANVAS_PLUGIN.drawThermatiteDoor({
      dimensions: { widthInches, heightInches, numSections, scale: 1 },
      background: { pattern, color },
      glazing: {
        width: 0, height: 0, numLites: 0,
        material: "none", spacing: "center",
        distanceFromEdge: 5, frameColor: "black", liteType: ""
      },
      misc: { labels: true }
    });
  },
};

const HEIGHT_FEET_MIN = 4;
const HEIGHT_FEET_MAX = 22;
const WIDTH_FEET_MIN = 4;
const WIDTH_FEET_MAX = 22;

let _canvasRedrawTimer = null;
$(document).on(
  "input",
  "#CUSTOM_WIDTH_FEET, #CUSTOM_WIDTH_INCHES, #CUSTOM_HEIGHT_FEET, #CUSTOM_HEIGHT_INCHES",
  function() {
    if (this.id === "CUSTOM_HEIGHT_FEET") {
      const val = parseInt(this.value);
      const dynMin = parseInt($(this).attr("min")) || HEIGHT_FEET_MIN;
      const dynMax = parseInt($(this).attr("max")) || HEIGHT_FEET_MAX;
      if (!isNaN(val)) {
        if (val < dynMin) this.value = dynMin;
        if (val > dynMax) this.value = dynMax;
      }
    }
    if (this.id === "CUSTOM_WIDTH_FEET") {
      const val = parseInt(this.value);
      const dynMin = parseInt($(this).attr("min")) || WIDTH_FEET_MIN;
      const dynMax = parseInt($(this).attr("max")) || WIDTH_FEET_MAX;
      if (!isNaN(val)) {
        if (val < dynMin) this.value = dynMin;
        if (val > dynMax) this.value = dynMax;
      }
    }
    if (_canvasRedrawTimer) clearTimeout(_canvasRedrawTimer);
    _canvasRedrawTimer = setTimeout(() => {
      _canvasRedrawTimer = null;
      CANVAS_PLUGIN.redrawFromCurrentForm();
    }, 80);
  }
);

$(document).on("change", "#custom_dimensions", function() {
  CANVAS_PLUGIN.redrawFromCurrentForm();
});

$(document).on("focus", "#CUSTOM_HEIGHT_FEET", function() {
  if (!$(this).attr("min")) $(this).attr("min", HEIGHT_FEET_MIN);
  if (!$(this).attr("max")) $(this).attr("max", HEIGHT_FEET_MAX);
});

$(document).on("focus", "#CUSTOM_WIDTH_FEET", function() {
  if (!$(this).attr("min")) $(this).attr("min", WIDTH_FEET_MIN);
  if (!$(this).attr("max")) $(this).attr("max", WIDTH_FEET_MAX);
});
