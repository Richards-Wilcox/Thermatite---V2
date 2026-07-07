/* =========================================================================
   Thermatite — debug_glazing_click.js
   =========================================================================
   Paste this whole file into the configurator's DevTools console while on
   the Glazing tab. It wraps the real click handler so every click on
   #CONFIG_CANVAS logs:
     - the raw event + canvas.getBoundingClientRect()
     - the computed canvas-pixel click coordinate
     - every rect currently in CANVAS_PLUGIN._glazingSlotRects
     - which rect (if any) the click matched
   This diagnoses whether the bug is in the CSS-to-canvas coordinate
   conversion (sx/sy) or in how the slot rects themselves were computed.
   ========================================================================= */
(function () {
  const canvas = document.getElementById("CONFIG_CANVAS");
  if (!canvas) { console.log("No #CONFIG_CANVAS found"); return; }

  canvas.addEventListener("click", function (evt) {
    const cRect = canvas.getBoundingClientRect();
    const sx = canvas.width / cRect.width;
    const sy = canvas.height / cRect.height;
    const clickX = (evt.clientX - cRect.left) * sx;
    const clickY = (evt.clientY - cRect.top) * sy;

    console.log("%c[glazing-debug] click", "color:#0a0;font-weight:bold");
    console.log("  canvas.width/height (buffer):", canvas.width, canvas.height);
    console.log("  getBoundingClientRect:", JSON.stringify({
      width: cRect.width, height: cRect.height, top: cRect.top, left: cRect.left
    }));
    console.log("  sx, sy:", sx, sy);
    console.log("  clientX/Y relative to canvas:", evt.clientX - cRect.left, evt.clientY - cRect.top);
    console.log("  computed canvas-pixel click:", clickX, clickY);

    const slotRects = (window.CANVAS_PLUGIN && CANVAS_PLUGIN._glazingSlotRects) || [];
    console.log(`  _glazingSlotRects (${slotRects.length} total):`);
    slotRects.forEach(r => {
      const hit = clickX >= r.x && clickX <= r.x + r.w && clickY >= r.y && clickY <= r.y + r.h;
      console.log(
        `    section ${r.sectionIndex} slot ${r.slot}: x=${r.x.toFixed(1)} y=${r.y.toFixed(1)} w=${r.w.toFixed(1)} h=${r.h.toFixed(1)}` +
        (hit ? "  <-- HIT" : "")
      );
    });
  }, true); // capture, so it logs even if the real handler stops propagation

  console.log("[glazing-debug] installed. Click any box on the door preview.");
})();
