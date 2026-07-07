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
      `<canvas id="CONFIG_CANVAS" width=1400 height=1000 style="height:65vh; border:none;background: transparent;"></canvas>`
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
    // On the Glazing page, widen the right margin so the per-section pencil
    // icons (drawn past the height dim line, see GLAZING_PENCIL_OFFSET_X)
    // always have room and never clip off the canvas.
    const inGlazingTab = typeof isGlazingSectionVisible === "function" && isGlazingSectionVisible();
    const marginX = inGlazingTab ? 170 : 120; // room for vertical dim line + text (+ pencils) on the right
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

    // Real per-section heights (inches, bottom-to-top from getSectionBundle) when
    // available, converted to pixels and reversed to top-to-bottom canvas order.
    // Falls back to equal division if the caller didn't supply them (or the count
    // doesn't match numSections), so this never breaks older callers.
    const realHeightsInches = Array.isArray(dimensions.sectionHeights) ? dimensions.sectionHeights : [];
    const useRealHeights = realHeightsInches.length === numSections;
    const sectionHeightsPx = useRealHeights
      ? realHeightsInches.slice().reverse().map(h => (Number(h) || 0) * heightRatio)
      : Array(numSections).fill(height / numSections);
    // Cumulative top offset (in px, relative to the door's top y) for each section.
    const sectionOffsetsPx = [];
    let _cum = 0;
    for (let k = 0; k < sectionHeightsPx.length; k++) {
      sectionOffsetsPx.push(_cum);
      _cum += sectionHeightsPx[k];
    }

    // Per-section clickable glazing box rects (canvas coords), rebuilt fresh
    // every render — only populated on the Glazing page.
    CANVAS_PLUGIN._glazingBoxRects = [];
    // Per-slot clickable rects (one per window box, not per section) so users
    // can click an individual box on the canvas to toggle its position.
    CANVAS_PLUGIN._glazingSlotRects = [];
    const inGlazing = typeof isGlazingSectionVisible === "function" && isGlazingSectionVisible();

    for(let i =0;i<dimensions.numSections;i++){
 	 //Background
    const background = layerObj.background;

    const bgColor = background.color;
    const sectionHeight = sectionHeightsPx[i];
    const sY = y + sectionOffsetsPx[i];

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

    if (inGlazing && typeof drawGlazingBoxes === "function") {
      drawGlazingBoxes(ctx, i, x, sY, width, sectionHeight);
    }


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
	 const gradientLines = ctx.createLinearGradient(0, sY, 0, sY + highlightHeight);
	 gradientLines.addColorStop(0, shadeColors[bgColor][0]);
	 gradientLines.addColorStop(1, shadeColors[bgColor][1]);

	 ctx.fillStyle = gradientLines;
	 ctx.fillRect(x, sY, width, highlightHeight);

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
	   ctx.fillRect(x + width - highlightWidth, sY, highlightWidth,sectionHeight);

	   // Panel side shading left
	   const gradientLeftSide = ctx.createLinearGradient(x, sectionHeight, x + highlightWidth, sectionHeight);
	   gradientLeftSide.addColorStop(0, shadeColors[bgColor][5]);
	   gradientLeftSide.addColorStop(0.3, shadeColors[bgColor][4]);
	   gradientLeftSide.addColorStop(0.7, shadeColors[bgColor][3]);
	   gradientLeftSide.addColorStop(1, shadeColors[bgColor][2]);

	   ctx.fillStyle = gradientLeftSide;
	   ctx.fillRect(x, sY, highlightWidth, sectionHeight);

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
	   const panelTop = sY;
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
            sY + sectionHeight / 2 - glazingHeightCanvas / 2,
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
            sY + sectionHeight / 2 - glazingHeightCanvas / 2,
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
            sY + sectionHeight / 2 - glazingHeightCanvas / 2,
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
          sY + sectionHeight / 2 - glazingHeightCanvas / 2,
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

// ===== [GLAZING-BOXES] Per-section glazing. Each section has its own full set
// of glazing settings (type, material, frame color, lites count, spacing,
// size) edited via one popover opened from a pencil icon next to the section.
// The section's "lites" count (1-3) decides how many of its up-to-3 window
// boxes are drawn/glazed; Position (left/center/right/both) only supplies the
// starting default when a section is first set up. All glazed boxes render
// with the same neutral "glass" fill — color doesn't encode type. Only active
// on the Glazing page. GLAZING_TYPE_0 (hidden) is kept in sync as "has any
// glazing at all" for code elsewhere (hasGlazing() in section_bundles.js, the
// Position-bar CSS gate) that still reads GLAZING_TYPE as a single
// none/not-none flag.

const GLAZING_BOXES_PER_SECTION = 3;
const GLAZING_GLASS_FILL = ["#dfe9ef", "#aebfc9"];

const GLAZING_TYPE_CHOICES = [
  { value: "",                    label: "None",      desc: "None" },
  { value: "lites",               label: "Lites",     desc: "Lites" },
  { value: "polytite_fullview",   label: "Polytite",  desc: "Polytite Fullview" },
  { value: "alumatite_fullview",  label: "Alumatite", desc: "Alumatite Fullview" },
];
const GLAZING_MATERIAL_CHOICES = [
  { value: "",              label: "None" },
  { value: "glass",         label: "Glass" },
  { value: "acrylic",       label: "Acrylic" },
  { value: "polycarbonate", label: "Polycarbonate" },
];
const GLAZING_FRAME_COLOR_CHOICES = [
  { value: "black", label: "Black" },
  { value: "brown", label: "Brown" },
  { value: "white", label: "White" },
];
const GLAZING_LITES_CHOICES = [1, 2, 3];
const GLAZING_SPACING_CHOICES = [
  { value: "evenly_spaced",             label: "Evenly Spaced" },
  { value: "evenly_spaced_fixed_ends",  label: "Evenly Spaced Fixed Ends" },
];
const GLAZING_SIZE_CHOICES = [
  { value: "",    label: "None" },
  { value: "AA",  label: "AA - (26\" x 13\")" },
  { value: "B",   label: "B - (24\" x 6\")" },
  { value: "CPL", label: "CPL - (24\" x 8\")" },
  { value: "D",   label: "D - (34\" x 16\")" },
  { value: "E",   label: "E - (24\" x 12\")" },
];

// slots: which of the 3 fixed grid slots (0=left, 1=center, 2=right) are lit.
// Kept alongside lites (the count shown/edited in the popover) so Position
// (Left/Center/Right) can place a single lite in the actually-correct slot;
// changing Lites manually in the popover falls back to GLAZING_LITES_SLOTS
// (see drawGlazingBoxes) since a manual count has no left/right intent.
function glazingDefaultSectionSettings() {
  return {
    type: "",
    material: "",
    frameColor: "black",
    lites: 2,
    slots: null,
    spacing: "evenly_spaced",
    size: "",
  };
}

// True when the Glazing page is on screen (#GLAZING_OPTIONS is unique to it).
function isGlazingSectionVisible() {
  const el = document.getElementById("GLAZING_OPTIONS");
  return !!(el && el.offsetParent !== null && el.getClientRects().length > 0);
}

// In-memory only: { sectionIndex: { type, material, frameColor, lites, slots, spacing, size } }.
CANVAS_PLUGIN._glazingSections = CANVAS_PLUGIN._glazingSections || {};

function getGlazingSectionSettings(sectionIndex) {
  return CANVAS_PLUGIN._glazingSections[sectionIndex] || glazingDefaultSectionSettings();
}

// WINDOW_POSITION -> which box slot(s) (0=left, 1=center, 2=right) light up,
// used to seed every section's defaults when a Position radio is picked.
const GLAZING_POSITION_BOXES = {
  left:   [0],
  center: [1],
  right:  [2],
  both:   [0, 2],
};

// Other code (weight_controller.js, glazing_code.js, global_data_controller.js,
// load_jde_nodes.js, canvas_controller.js) still reads a single GLAZING_TYPE
// node via getState/getNode(...).getAttribute("value"/"desc"), expecting one
// selected type. Since sections can still differ from each other, we pick the
// most common non-empty type as the "representative" value/desc for that
// node, and only flip checked to reflect none-vs-any. Keeps every existing
// consumer working without per-file changes.
function syncGlazingTypeFlag() {
  const counts = {};
  Object.values(CANVAS_PLUGIN._glazingSections).forEach(s => {
    if (s.type) counts[s.type] = (counts[s.type] || 0) + 1;
  });
  const values = Object.keys(counts);
  const dominantValue = values.sort((a, b) => counts[b] - counts[a])[0] || "";
  const hasAny = !!dominantValue;
  const dominantType = GLAZING_TYPE_CHOICES.find(t => t.value === dominantValue) || GLAZING_TYPE_CHOICES[0];

  const el = document.getElementById("GLAZING_TYPE_0");
  if (!el) return;
  const newValue = hasAny ? dominantType.value : "none";
  const newDesc = hasAny ? dominantType.desc : "None";
  const shouldBeChecked = !hasAny;
  const changed = el.getAttribute("value") !== newValue || el.checked !== shouldBeChecked;

  el.setAttribute("value", newValue);
  el.setAttribute("desc", newDesc);
  if (!changed) return;
  $(el).prop("checked", shouldBeChecked).trigger("change");
}

// Reset every section to Lites (with Position's default box pattern) when a
// Position radio is picked, replacing (not merging with) any prior manual picks.
function applyGlazingPositionToBoxes() {
  const position = $("input[name='WINDOW_POSITION']:checked").val();
  const boxIndexes = GLAZING_POSITION_BOXES[position];
  if (!boxIndexes) return;

  const numSections = parseInt($("#NUM_OF_SEC").val()) || 0;
  const newState = {};
  for (let s = 0; s < numSections; s++) {
    newState[s] = Object.assign(glazingDefaultSectionSettings(), {
      type: "lites",
      lites: boxIndexes.length,
      slots: boxIndexes.slice(),
    });
  }
  CANVAS_PLUGIN._glazingSections = newState;
  syncGlazingTypeFlag();
}

$(document).on("change", "input[name='WINDOW_POSITION']", function() {
  applyGlazingPositionToBoxes();
  renderGlazingSectionPanel(CANVAS_PLUGIN._activeGlazingSection || 0);
  if (typeof redrawCanvas === "function") {
    redrawCanvas();
  } else if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
    CANVAS_PLUGIN.redrawFromCurrentForm();
  }
});

const GLAZING_PENCIL_RADIUS = 34;
// Distance right of the door's right edge — clears the height dimension
// line (~+30) and its text (extends to ~+110).
const GLAZING_PENCIL_OFFSET_X = 155;

// Lites count -> which of the 3 fixed slots (0=left, 1=center, 2=right) are
// glazed. 1 lite centers, 2 lites go symmetric left+right, 3 fills the grid —
// matches common real garage-door glazing layouts.
const GLAZING_LITES_SLOTS = {
  1: [1],
  2: [0, 2],
  3: [0, 1, 2],
};

// Draws the fixed 3-slot box grid for one section (canvas coords) — slot
// positions never move, only which slots are glazed changes with the
// section's Lites count, so "1 lite" reads as a single centered window rather
// than one box stretched across the whole section. One pencil icon, outside
// the door to the right, centered on the section, opens the settings
// popover. Records the section's pencil rect (for click hit-testing) into
// CANVAS_PLUGIN._glazingBoxRects.
function drawGlazingBoxes(ctx, sectionIndex, x, sY, width, sectionHeight) {
  const settings = getGlazingSectionSettings(sectionIndex);
  const litesCount = Math.min(Math.max(parseInt(settings.lites) || 0, 1), GLAZING_BOXES_PER_SECTION);
  // Position (Left/Center/Right) sets exact slots; a manual Lites-count edit
  // in the popover clears slots and falls back to the generic count rule.
  const litSlots = Array.isArray(settings.slots) ? settings.slots : (GLAZING_LITES_SLOTS[litesCount] || GLAZING_LITES_SLOTS[2]);

  const n = GLAZING_BOXES_PER_SECTION;
  // Slim horizontal slat, not a square window — most of the section height is
  // padding, leaving a short, wide bar centered in the section.
  const padY = sectionHeight * 0.42;
  // One uniform gap used both between boxes AND from the door's left/right
  // edges, so spacing is equal all around (n boxes -> n+1 gaps across width).
  const gap = width * 0.03;
  const boxW = (width - gap * (n + 1)) / n;
  const boxH = sectionHeight - padY * 2;
  const boxY = sY + padY;

  const glazed = !!settings.type;

  for (let b = 0; b < n; b++) {
    const boxX = x + gap + b * (boxW + gap);
    const boxLit = glazed && litSlots.includes(b);

    ctx.save();
    if (boxLit) {
      const grad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
      grad.addColorStop(0, GLAZING_GLASS_FILL[0]);
      grad.addColorStop(1, GLAZING_GLASS_FILL[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeStyle = GLAZING_FRAME_COLOR_CHOICES.find(c => c.value === settings.frameColor)
        ? settings.frameColor
        : "#333";
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
    } else {
      ctx.strokeStyle = "rgba(0,0,0,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);
    }
    ctx.restore();

    CANVAS_PLUGIN._glazingSlotRects.push({
      sectionIndex, slot: b, x: boxX, y: boxY, w: boxW, h: boxH,
    });
  }

  // Pencil sits outside the door on the right, past the height dimension
  // line/label (drawn at roughly x + width + 30, text extending to ~x + width
  // + 110) so it never overlaps them, at this section's vertical center.
  const pencilCx = x + width + GLAZING_PENCIL_OFFSET_X;
  const pencilCy = sY + sectionHeight / 2;
  const isActiveSection = (CANVAS_PLUGIN._activeGlazingSection || 0) === sectionIndex;
  drawPencilIcon(ctx, pencilCx, pencilCy, GLAZING_PENCIL_RADIUS, isActiveSection);

  CANVAS_PLUGIN._glazingBoxRects.push({
    key: sectionIndex, x, y: boxY, w: width, h: boxH,
    pencilCx, pencilCy, pencilR: GLAZING_PENCIL_RADIUS,
  });
}

// Round pencil button centered at (cx, cy) — white fill with a dark glyph and
// thin border when idle, reading as a neutral icon button against the door
// art. When active (this section's options are showing on the right) it
// flips to a solid black fill with a white glyph, matching the site's
// black-fill "selected" convention (.rw-button.btn-checked,
// .rw-sliding-button.selected) plus a black ring so it's unmistakable which
// pencil is currently selected. Pure canvas shapes, no glyph/SVG (glyph
// rendering was unreliable across fonts in an earlier attempt).
function drawPencilIcon(ctx, cx, cy, r, active) {
  ctx.save();

  const fillColor = active ? "#000" : "#fff";
  const glyphColor = active ? "#fff" : "#333";

  // Drop shadow so the button lifts off the grey page background.
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 1;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = active ? "#000" : "#333";
  ctx.stroke();

  if (active) {
    ctx.beginPath();
    ctx.arc(cx, cy, r + 4, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000";
    ctx.stroke();
  }

  // Pencil glyph: real pencil silhouette (flat eraser-end body, pale wood
  // band, dark pointed tip), outlined like the reference icon rather than a
  // plain filled bar+triangle. Tilted tip-down-left, same as a pencil about
  // to write. 3π/4 (not π/4) so local +x (the tip end) points down-LEFT, not
  // down-right.
  ctx.translate(cx, cy);
  ctx.rotate(3 * Math.PI / 4);
  const len = r * 1.5;
  const bodyW = r * 0.5;
  const half = bodyW / 2;
  const backX = -len / 2;          // flat back (eraser) end
  const woodStartX = len / 2 - bodyW * 1.5; // where the pale wood band begins
  const tipX = len / 2;            // point

  const strokeColor = glyphColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1.5, r * 0.09);

  // Body: flat-ended rectangle from the back to where the wood band starts.
  ctx.fillStyle = strokeColor;
  ctx.beginPath();
  ctx.rect(backX, -half, woodStartX - backX, bodyW);
  ctx.fill();
  ctx.stroke();

  // Wood band: pale trapezoid tapering toward the tip.
  ctx.fillStyle = active ? "#ccc" : "#eee";
  ctx.beginPath();
  ctx.moveTo(woodStartX, -half);
  ctx.lineTo(tipX - bodyW * 0.35, -half * 0.35);
  ctx.lineTo(tipX - bodyW * 0.35, half * 0.35);
  ctx.lineTo(woodStartX, half);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tip: dark triangle at the point.
  ctx.fillStyle = strokeColor;
  ctx.beginPath();
  ctx.moveTo(tipX - bodyW * 0.35, -half * 0.35);
  ctx.lineTo(tipX, 0);
  ctx.lineTo(tipX - bodyW * 0.35, half * 0.35);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

// Makes sectionIndex the active section shown in the right-pane panel and
// redraws immediately (both a pencil click and a box click land here) so the
// active pencil highlight and the panel update in the same click, not on the
// next unrelated redraw.
function activateGlazingSection(sectionIndex) {
  renderGlazingSectionPanel(sectionIndex);
  if (typeof redrawCanvas === "function") {
    redrawCanvas();
  } else if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
    CANVAS_PLUGIN.redrawFromCurrentForm();
  }
}

// Clicking an individual window box toggles that slot's position on/off
// directly on the canvas (in addition to the Lites/Spacing controls in the
// right panel) and makes its section the active one being edited, same as
// clicking the pencil — clicking a box counts as "now editing this section."
function toggleGlazingSlot(sectionIndex, slot) {
  const settings = getGlazingSectionSettings(sectionIndex);
  const litesCount = Math.min(Math.max(parseInt(settings.lites) || 0, 1), GLAZING_BOXES_PER_SECTION);
  const currentSlots = Array.isArray(settings.slots) ? settings.slots.slice() : (GLAZING_LITES_SLOTS[litesCount] || GLAZING_LITES_SLOTS[2]).slice();

  const glazed = !!settings.type;
  if (!glazed) {
    // First click on an unglazed section: turn glazing on and light only the clicked slot.
    settings.type = "lites";
    settings.slots = [slot];
  } else if (currentSlots.includes(slot)) {
    // Clicking a lit box turns it off; if that was the last lit box, drop back to unglazed.
    const next = currentSlots.filter(s => s !== slot);
    settings.slots = next;
    if (next.length === 0) settings.type = "";
  } else {
    settings.slots = currentSlots.concat(slot).sort();
  }
  settings.lites = Math.max((settings.slots || []).length, 1);

  CANVAS_PLUGIN._glazingSections[sectionIndex] = settings;
  syncGlazingTypeFlag();
  activateGlazingSection(sectionIndex);
}

// Hit-test a canvas-coordinate click against the recorded pencil-icon rects
// first (clicking a pencil just makes that section active), then against the
// individual window-box rects (clicking a box also toggles that slot).
function handleGlazingCanvasClick(evt) {
  if (!isGlazingSectionVisible()) return;
  const pencilRects = CANVAS_PLUGIN._glazingBoxRects || [];
  const slotRects = CANVAS_PLUGIN._glazingSlotRects || [];
  if (!pencilRects.length && !slotRects.length) return;

  const canvas = document.getElementById("CONFIG_CANVAS");
  if (!canvas) return;
  const cRect = canvas.getBoundingClientRect();
  const sx = canvas.width / cRect.width;
  const sy = canvas.height / cRect.height;
  const clickX = (evt.clientX - cRect.left) * sx;
  const clickY = (evt.clientY - cRect.top) * sy;

  const pencilHit = pencilRects.find(r => {
    const dx = clickX - r.pencilCx, dy = clickY - r.pencilCy;
    return Math.sqrt(dx * dx + dy * dy) <= r.pencilR + 20; // generous tap-target pad
  });
  if (pencilHit) {
    activateGlazingSection(pencilHit.key);
    return;
  }

  const slotHit = slotRects.find(r =>
    clickX >= r.x && clickX <= r.x + r.w && clickY >= r.y && clickY <= r.y + r.h
  );
  if (slotHit) {
    toggleGlazingSlot(slotHit.sectionIndex, slotHit.slot);
  }
}

$(document).on("click", "#CONFIG_CANVAS", handleGlazingCanvasClick);

// Builds one labeled row of choice-buttons for the section panel, styled and
// structured like the rest of the right pane instead of the old small popover
// chips — the panel now lives in the right pane where there's no floating-box
// width limit. 2-3 choices (Frame Color, Lites, Spacing) use the compact
// sliding-toggle style from Glass Material (Clear/Tempered); 4+ choices
// (Glazing Type, Material, Size) use the Door Model / Dimensions button grid
// — a 3-column grid reads awkwardly for only 2-3 options. Either way the
// page's generic delegated handlers (load_html.js: [JS-RADIO-STYLE] for
// .rw-button, [JS-SLIDING-BUTTON] for .rw-sliding-button) take care of
// toggling the selected look and forwarding padding-clicks to the radio, so
// this only needs to build real radio+label markup and react to "change".
function buildGlazingPopoverRow($panel, sectionIndex, label, field, choices, valueOf, labelOf) {
  $panel.append($('<div style="text-align: left;" class="config-option-title-style"></div>').text(label));
  const groupName = "GLZ_SEC" + sectionIndex + "_" + field;
  const current = getGlazingSectionSettings(sectionIndex)[field];
  const useSlider = choices.length <= 3;

  const $row = useSlider
    ? $('<div class="combined-button-container"></div>').append($('<div class="combined-button-container-inner"></div>'))
    : $('<div class="dimension-layout"></div>');
  const $items = useSlider ? $row.find(".combined-button-container-inner") : $row;

  choices.forEach((choice, i) => {
    const value = valueOf(choice);
    const text = labelOf(choice);
    const inputId = groupName + "_" + i;
    const isChecked = value === current;

    const btnClass = useSlider ? "rw-sliding-button" : "rw-button";
    const selectedClass = useSlider ? "selected" : "btn-checked";
    const $btn = $('<div tabindex="0"></div>').addClass(btnClass).toggleClass(selectedClass, isChecked);
    const $label = $('<label></label>').attr("for", inputId).text(text);
    const $input = $('<input type="radio" style="display:none;">').attr({
      id: inputId, name: groupName, value: value,
    });
    if (isChecked) $input.prop("checked", true);

    $input.on("change", function() {
      const settings = getGlazingSectionSettings(sectionIndex);
      settings[field] = value;
      // A manual Lites-count change overrides whatever exact slots Position
      // had set — fall back to the generic count-based slot rule instead.
      if (field === "lites") settings.slots = null;
      CANVAS_PLUGIN._glazingSections[sectionIndex] = settings;
      syncGlazingTypeFlag();
      if (typeof redrawCanvas === "function") {
        redrawCanvas();
      } else if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
        CANVAS_PLUGIN.redrawFromCurrentForm();
      }
    });

    $btn.append($label, $input);
    $items.append($btn);
  });
  $panel.append($row);
}

// Which section's options are currently shown in the right-pane panel.
// Defaults to section 0 so the panel isn't empty before any pencil is clicked.
CANVAS_PLUGIN._activeGlazingSection = CANVAS_PLUGIN._activeGlazingSection || 0;

// Renders the "Section N Options" block into #GLAZING_SECTION_PANEL for the
// given section index, replacing whatever section was shown before. Edits
// apply immediately (see buildGlazingPopoverRow) — there is no Done/cancel
// step since this is an inline panel, not a popover.
function renderGlazingSectionPanel(sectionIndex) {
  const $panel = $("#GLAZING_SECTION_PANEL");
  if (!$panel.length) return;
  CANVAS_PLUGIN._activeGlazingSection = sectionIndex;

  $panel.empty();
  $panel.append($('<div class="glazing-active-section-banner"></div>').text("Section " + (sectionIndex + 1) + " Options"));

  buildGlazingPopoverRow($panel, sectionIndex, "Glazing Type", "type", GLAZING_TYPE_CHOICES, c => c.value, c => c.label);
  buildGlazingPopoverRow($panel, sectionIndex, "Material", "material", GLAZING_MATERIAL_CHOICES, c => c.value, c => c.label);
  buildGlazingPopoverRow($panel, sectionIndex, "Frame Color", "frameColor", GLAZING_FRAME_COLOR_CHOICES, c => c.value, c => c.label);
  buildGlazingPopoverRow($panel, sectionIndex, "Lites", "lites", GLAZING_LITES_CHOICES, c => c, c => String(c));
  buildGlazingPopoverRow($panel, sectionIndex, "Spacing", "spacing", GLAZING_SPACING_CHOICES, c => c.value, c => c.label);
  buildGlazingPopoverRow($panel, sectionIndex, "Size", "size", GLAZING_SIZE_CHOICES, c => c.value, c => c.label);
}

// Pointer cursor over a pencil icon or a window box, default elsewhere —
// visual affordance that both are clickable while on the Glazing page.
$(document).on("mousemove", "#CONFIG_CANVAS", function(evt) {
  const canvas = this;
  if (!isGlazingSectionVisible()) { canvas.style.cursor = ""; return; }
  const pencilRects = CANVAS_PLUGIN._glazingBoxRects || [];
  const slotRects = CANVAS_PLUGIN._glazingSlotRects || [];
  const cRect = canvas.getBoundingClientRect();
  const sx = canvas.width / cRect.width;
  const sy = canvas.height / cRect.height;
  const x = (evt.clientX - cRect.left) * sx;
  const y = (evt.clientY - cRect.top) * sy;
  const overPencil = pencilRects.some(r => {
    const dx = x - r.pencilCx, dy = y - r.pencilCy;
    return Math.sqrt(dx * dx + dy * dy) <= r.pencilR + 20;
  });
  const overSlot = slotRects.some(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
  canvas.style.cursor = (overPencil || overSlot) ? "pointer" : "";
});

// Redraw when entering/leaving the Glazing page so the box grid shows/hides.
// First-ever entry seeds the grid from the current Position radio; later
// visits leave manual picks alone (only an explicit Position change resets).
let _glazingWasVisible = false;
let _glazingBoxesSeeded = false;
setInterval(function() {
  const vis = isGlazingSectionVisible();
  if (vis !== _glazingWasVisible) {
    _glazingWasVisible = vis;
    if (vis && !_glazingBoxesSeeded) {
      _glazingBoxesSeeded = true;
      applyGlazingPositionToBoxes();
    }
    if (vis) renderGlazingSectionPanel(CANVAS_PLUGIN._activeGlazingSection || 0);
    if (typeof redrawCanvas === "function") {
      redrawCanvas();
    } else if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
      CANVAS_PLUGIN.redrawFromCurrentForm();
    }
  }
}, 300);

