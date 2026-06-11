function loadForm() {
    /* =========================================================================
       Thermatite — load_html.js
       =========================================================================
       This file builds the entire configurator form as one big HTML string and
       appends it into .concept-ui-form.scrollable. Search by the [TAGS] below.

       LAYOUT
         [LAYOUT-ROOT]        #configurator wrapper, splits page L/R
         [LAYOUT-LEFT]        Left pane — door preview + window position picker
         [LAYOUT-RIGHT]       Right pane — all configuration inputs

       LEFT PANE
         [NAV-TABS]           #NAVIGATION_SPC — top section tabs (filled by JS)
         [WINDOW-POSITION]    Left / Center / Right / Both buttons
         [CANVAS]             #CANVAS_PLUGIN — door preview canvas

       RIGHT PANE — header
         [HEADER-PROPS]       #DOOR_PROPERTIES — lift-type label + price display

       RIGHT PANE — section: DIMENSIONS  (id="DIMENSIONS")
         (rendered top-to-bottom in this order)
         [DOOR-OPTIONS]       Complete Door / Door Face Only / Hardware Only
         [DOOR-MODEL]         T150 / T175 / T200 / T300 (first 4)
         [DOOR-MODEL-MORE]    Toggle + hidden 5th-9th (T200-20, T200C, U-series, U200C)
         [DIMENSIONS-PRESET]  8x7 / 9x7 / 8x8 / 9x8 buttons
         [DIMENSIONS-CUSTOM]  Custom width/height feet+inches + sections
         [PATTERN]            Standard / Multi / Raynor Profile (per-model)
         [COLOUR]             Door colour buttons (per-model)
         [HARDWARE-SIZES]     2 or 3 (hidden when Door Face Only)
         [OVERLAP-REQUIRED]   Yes / No
         [OPERATION]          Manual / Drawbar / Jack Shaft / DC Pulse / Chain Hoist
         [MANUAL-TYPE]        None / Pull Cord / Pull Chain (w/ + w/o Spring) — when Operation=Manual
         [CHAIN-HOIST-TYPE]   2000 / By Others / JR / JRG — when Operation=Chain Hoist
         [END-CAPS]           Single / Double (per model + width)
         [DM-TOP-WEATHER-SEAL] Top Weather Seal — dropdown
         [DM-BOTTOM-RETAINER]  Bottom Retainer — dropdown

       RIGHT PANE — section: SECTION_OPTIONS  (id="SECTION_OPTIONS")
         [SO-BOTTOM-SEAL]      Bottom Seal — TBD button options
         [SO-WIND-LOAD]        Wind Load — TBD button options
         [SO-TRUSS-STYLE]      Truss Style — dropdown (many options)
         [SO-ROLLER-STYLE]     Roller Style — TBD button options
         [SO-12-GAUGE-HINGES]  12 Gauge Hinges — TBD button options
         [SO-STEP-PLATE]       Step Plate — TBD button options
         [SO-EXHAUST-PORT]     Exhaust Port (View / Port Size / Latched dropdowns)
         [SO-BAR-LATCH]        Bar Latch (Bar Latch / Interior-Exterior dropdowns)
         [SO-ONE-POINT-LATCH]  One Point Latch (Yes-No / Qty dropdowns)
         [SO-FENDER-GUARD]     Fender Guard (dropdown of variants)
         [SO-NUM-COUPLINGS]    Number of Couplings (number input)
         [SO-SPRING-FAILURE-DEVICE] Spring Failure Device (Yes / No)
         [SO-CABLE-TYPE]       Cable Type (Galvanized Cable / Stainless Steel Cable)
         [SO-THIMBLE-FOR-CABLE] Thimble For Cable Tor (Yes / No)
         [SO-GALVANIZED-SPRING] Galvanized Spring (Yes / No)
         [SO-WEIGHT-MODIFIER]  Current / Modify / New Adjusted Springing Weight

       RIGHT PANE — section: GLAZING
         [GLAZING-WINDOWS]    hidden input (always "none"); feeds canvas/BOM only
         [GLAZING-TYPE]       Glazing — None / Lites / Polytite Fullview / Alumatite Fullview
         [GLAZING-TEMPERED]   Untempered / Tempered

       RIGHT PANE — section: HARDWARE  (id="HARDWARE")
         [LIFT-TYPE]          Std 12R/15R/32R, LHF, LHR, High Lift dropdown
         [HIGHLIFT]           Highlift inches dropdown (hidden by default)
         [TRACK-MOUNT]        TRK_MOUNT_TYP — Track Mount buttons (filtered by thickness × HW size × CSBB × No Lap Steel Jamb)
         [LOWER-SPLICE]       LOWER_SPLICE — Lower Splice dropdown
         [JAMB]               JAMB select (hidden)
         [JAMB-SEAL]          Jamb seal type + colour + screw packages
         [HANGER-ANGLE]       Hanger angle option + qty
         [EXTRA-TRUSS]        Yes / No
         [HW-SHAFT-TYPE]      Shaft Type — Tube / Keyed Tube / 1" Solid / 1 1/4" Solid (dropdown)
         [HW-DRUMS-CABLES]    Drums & Cables options table (radio per row)
         [HW-SPRINGING-SOLUTIONS] Springing Solutions options table (radio per row)
         [HW-BUMPER-OR-PUSHER-SPRINGS] Bumper or Pusher Springs (dropdown)
         [HW-HANGER-ANGLE]    Hanger Angle (Type dropdown + Qty number)
         [HW-COUPLER]         Coupler (Yes / No)
         [HW-SELF-ALIGNING-FLANGE-BEARINGS] Self-Aligning Flange Bearings (Yes / No)
         [HW-DUPLEX-SOLUTIONS] Include Duplex Solutions? (Yes / No)

       RIGHT PANE — section: OPERATOR_OPTIONS
         [OP-CAROUSEL]        Operator selection carousel
         [OP-TRANSMITTER]     Additional transmitter + qty
         [OP-CONTROL-PANEL]   Additional control panel + qty
         [OP-KEYLESS]         Additional keyless entry + qty
         [OP-BRACKET]         Operator bracket dropdown

       RIGHT PANE — section: ANNOTATIONS
         [ANNOTATIONS]        Tag / Contractor / Architect / Reference / Client

       FOOTER
         [FOOTER-NAV]         #NEXT_PAGE_BUTTONS — Back / Configure / Next
         [DEFAULTS]           #DEFAULTS_PLUGIN — Save / Restore default buttons

       AFTER FORM (JS, below the template literal)
         [JS-APPEND]          Append form to DOM, hide unused JDE containers
         [JS-RADIO-STYLE]     Generic radio-click visual highlight handler
         [JS-COLOR-CLICK]     .color-button click forwards to inner radio
       ========================================================================= */
    const form = `<div id="configurator">

  <!-- [LAYOUT-ROOT] outermost wrapper, splits L/R -->
  <div class="rw-configurator__layout">
    <!-- [LAYOUT-LEFT] door preview side -->
    <div class="rw-configurator__layout--left">
	<!-- [NAV-TABS] section tabs (populated by JS) -->
	<div id="NAVIGATION_SPC"></div>
	<!-- [WINDOW-POSITION] Left / Center / Right / Both -->
	<div class="postion-container">
		<div style="text-align: center; padding-bottom: 5px;" class="config-option-title-style">Position</div>
		<div class="window-position-container">
		   <div class="rw-button" tabindex="0">
		   	<label for="WINDOW_POSITION_0">Left</label>
		   	<input type="radio" style="display:none;" id="WINDOW_POSITION_0"  name="WINDOW_POSITION" desc="Left" value="left" code="left" checked>
		   </div>
		   <div class="rw-button" tabindex="0">
			<label for="WINDOW_POSITION_1">Center</label>
			<input type="radio" style="display:none;" id="WINDOW_POSITION_1" name="WINDOW_POSITION" desc="Center" value="center" code="right">
		   </div>
		   <div class="rw-button" tabindex="0">
			<label for="WINDOW_POSITION_2">Right</label>
		 	<input type="radio" style="display:none;" id="WINDOW_POSITION_2"  name="WINDOW_POSITION" desc="Right" value="right" code="center" >
		   </div>
		   <div class="rw-button" tabindex="0">
			<label for="WINDOW_POSITION_3">Both</label>
			<input type="radio" style="display:none;" id="WINDOW_POSITION_3"  name="WINDOW_POSITION" desc="Both" code="both" value="both" >
		   </div>
		</div>
	</div>
     <!-- [CANVAS] door preview canvas (drawn by canvas plugin) -->
     <div id="CANVAS_PLUGIN" style="display:flex;justify-content:center;">
    		<canvas id="CONFIG_CANVAS" width=1400 height=1000 style="height:65vh; padding-bottom: 30px; border:none;background: transparent;"></canvas>
    	</div>
     <!-- [HW-LEFT-PANE-LANDING] Landing container for Hardware-tab tables that
          move here in place of the canvas. Filled by JS when entering Hardware. -->
     <div id="HW_LEFT_PANE_LANDING" style="display:none; padding: 0 24px;"></div>



    </div>
<!-- [LAYOUT-RIGHT] configuration form side -->
<div class="rw-configurator__layout--right">
    <!-- [HEADER-PROPS] lift type label + price display at top of right pane -->
    <div id="DOOR_PROPERTIES" style="display:flex;flex-direction:row;justify-content:space-between; padding: 20px 0 0 0">

        <div style="display:flex;flex-direction:column">
          <span id="DOOR_SUMMARY_LABEL" class="rw-text">Door Summary:</span>
          <span id="DOOR_SUMMARY_VALUE" class="rw-text"></span>
        </div>
        <div id="SPRING_WARNING" class="rw-text rw-warning">The current configuration has no Residential springs
          available.
	   </div>
	   <div id="PRICE_CONTAINER" style="display:flex;flex-direction:column;align-items:flex-end;" >
	   <span id="PRICE_DISPLAY" class="" style="
		  font-size: 24px;
		  font-weight: 700;
		  font-style: italic;
	   " >00.00
        </span>
	<span>Net Price</span>
</div>
      </div>

<!-- ============================================================
     SECTION: DIMENSIONS — door model + size + style options
     ============================================================ -->
<section id="DIMENSIONS" title="Door Model" class="rw-configurator__page" enabled="true" face="true" hardware="true">


	<!-- [DOOR-OPTIONS] Complete Door / Door Face Only / Hardware Only -->
	<div style="text-align:left" class="config-option-title-style">Door Options</div>
	<div class="dimension-layout">
	  <div class="rw-button" tabindex="0">
	  <label for="DOOR_OPTIONS_0">Complete Door</label>
	  <input type="radio" style="display:none;"  id="DOOR_OPTIONS_0"  name="DOOR_OPTIONS" value="0" checked>
	  </div>
	  <div class="rw-button" tabindex="0">
	  <label for="DOOR_OPTIONS_1">Door Face Only</label>
	  <input type="radio" style="display:none;"  id="DOOR_OPTIONS_1" name="DOOR_OPTIONS" value="1">
	  </div>
	  <div class="rw-button" tabindex="0">
	  <label for="DOOR_OPTIONS_2">Hardware Only</label>
	  <input type="radio" style="display:none;"   id="DOOR_OPTIONS_2" name="DOOR_OPTIONS" value="2">
	  </div>
	</div>

	  <!-- [DOOR-MODEL] first 4 models always visible -->
	  <div style="text-align:left" class="config-option-title-style">Door Model</div>
	   <!-- Show first 4 door models -->
	   <div class="dimension-layout">
		<div class="rw-button" tabindex="0">
		  <label for="DOOR_MODEL_0" style="color: black">T150</label>
		  <input type="radio" style="display:none;" id="DOOR_MODEL_0" name="DOOR_MODEL" value="T150" desc="T150" checked>
		</div>
		<div class="rw-button" tabindex="0">
		  <label for="DOOR_MODEL_1">T175</label>
		  <input type="radio" style="display:none;" id="DOOR_MODEL_1" name="DOOR_MODEL" value="T175" desc="T175">
		</div>
		<div class="rw-button" tabindex="0">
		  <label for="DOOR_MODEL_2">T200</label>
		  <input type="radio" style="display:none;" id="DOOR_MODEL_2" name="DOOR_MODEL" value="T200" desc="T200">
		</div>
		<div class="rw-button" tabindex="0">
		  <label for="DOOR_MODEL_3">T300</label>
		  <input type="radio" style="display:none;" id="DOOR_MODEL_3" name="DOOR_MODEL" value="T300" desc="T300">
		</div>
	   </div>

    <!-- [DOOR-MODEL-MORE] toggle reveals 5th-9th models below -->
    <!-- Toggle for More Door Models -->
    <div class="dropdown-item custom-dimension-item">
	 <h3>More Door Models</h3>
	 <label class="switch">
	   <input type="checkbox" id="more_door_models" value="off">
	   <span class="slider round"></span>
	 </label>
    </div>

    <!-- Hidden Models initially (5th to 9th) -->
    <div class="dropdown-item custom-panel-item-container" id="more_door_models_container" style="display: none;">
	 <div class="dimension-layout">
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_4">T200-20</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_4" name="DOOR_MODEL" value="T200-20" desc="T200-20">
	   </div>
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_5">T200C</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_5" name="DOOR_MODEL" value="T200C" desc="T200C">
	   </div>
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_6">T150U</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_6" name="DOOR_MODEL" value="T150U" desc="T150U">
	   </div>
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_7">T175U</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_7" name="DOOR_MODEL" value="T175U" desc="T175U">
	   </div>
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_8">T200U</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_8" name="DOOR_MODEL" value="T200U" desc="T200U">
	   </div>
	   <div class="rw-button panel-button" tabindex="0">
		<label for="DOOR_MODEL_9">U200C</label>
		<input type="radio" style="display:none;" id="DOOR_MODEL_9" name="DOOR_MODEL" value="U200C" desc="U200C">
	   </div>
	 </div>
    </div>

<!-- [DIMENSIONS-PRESET] preset door sizes -->
<div style="text-align:left" class="config-option-title-style">Finished Door Sizes</div>
<div class="dimension-layout">
	<div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_0">10'2x10'0</label>
	<input type="radio" style="display:none;"  id="DIMENSIONS_0"  name="SIZE" value="0" width="10" widthInches="2" height="10" checked>
	</div>
	<div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_1">14'2x14'0</label>
	<input type="radio" style="display:none;"  id="DIMENSIONS_1" name="SIZE" value="1" width="14" widthInches="2" height="14" >
	</div>
	<div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_2">12'2x12'0</label>
	<input type="radio" style="display:none;"   id="DIMENSIONS_2" name="SIZE" value="2" width="12" widthInches="2" height="12" >
	</div>
	<div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_3">12'2x14'0</label>
	<input type="radio" style="display:none;"   id="DIMENSIONS_3"  name="SIZE" value="3" width="12" widthInches="2" height="14" >
	</div>
  <div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_4">8'2x10'0</label>
	<input type="radio" style="display:none;"   id="DIMENSIONS_4"  name="SIZE" value="4" width="8" widthInches="2" height="10" >
	</div>
  <div class="rw-button" tabindex="0">
	<label for="DIMENSIONS_5">12'0x12'0</label>
	<input type="radio" style="display:none;"   id="DIMENSIONS_5"  name="SIZE" value="5" width="12" widthInches="0" height="12" >
	</div>
	</div>

<!-- [DIMENSIONS-CUSTOM] toggle reveals custom width/height/sections selectors below.
     Allowed ranges driven by MODEL_WIDTH_LIMITS / MODEL_HEIGHT_LIMITS in load_drive_inputs.js -->
<div class="dropdown-item custom-dimension-item">
    <h3>Custom Door Sizes</h3>
    <label class="switch">
        <input type="checkbox" id="custom_dimensions">
        <span class="slider round"></span>
    </label>
</div>

<div id="custom_dimensions_container" style="display:none;">
    <!-- align-items:flex-end bottom-aligns the three columns so the Width/Height/
         Sections SELECTS share one baseline even though "Number Of Sections" has a
         shorter column (one select vs the feet/inches sub-row). -->
    <div style="display:flex; gap:16px; width:100%; align-items:flex-end;">
        <div style="display:flex; flex-direction:column; gap:4px; position:relative;">
            <span class="config-option-title-style">Door Width</span>
            <div style="display:flex; gap:6px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; color:#555;">Feet</span>
                    <select id="CUSTOM_WIDTH_FEET" name="CUSTOM_WIDTH_FEET" style="width:60px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                        <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                        <option value="8" selected>8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                        <option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                        <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option>
                        <option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                        <option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option>
                        <option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>
                        <option value="32">32</option><option value="33">33</option><option value="34">34</option><option value="35">35</option>
                        <option value="36">36</option><option value="37">37</option><option value="38">38</option>
                    </select>
                </div>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; color:#555;">Inches</span>
                    <select id="CUSTOM_WIDTH_INCHES" name="CUSTOM_WIDTH_INCHES" style="width:60px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                        <option value="0">0</option><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option>
                        <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                        <option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                    </select>
                </div>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; color:#555;">Fraction</span>
                    <!-- Fractional inch (eighths). value is the decimal used in the RP run-length (segment g). -->
                    <select id="CUSTOM_WIDTH_FRACTION" name="CUSTOM_WIDTH_FRACTION" style="width:60px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                        <option value="0" selected>0</option><option value="0.125">1/8</option><option value="0.25">1/4</option><option value="0.375">3/8</option>
                        <option value="0.5">1/2</option><option value="0.625">5/8</option><option value="0.75">3/4</option><option value="0.875">7/8</option>
                    </select>
                </div>
            </div>
            <!-- Clarifies the Fraction dropdown above only applies to custom raw panels.
                 Absolutely positioned so it adds no column height — otherwise the row's
                 align-items:flex-end would shove the Width selects up off the Height baseline. -->
            <span style="position:absolute; top:100%; left:0; margin-top:2px; white-space:nowrap; font-size:11px; color:#999; font-style:italic;">Fraction applies to custom raw panels only.</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
            <span class="config-option-title-style">Door Height</span>
            <div style="display:flex; gap:6px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; color:#555;">Feet</span>
                    <select id="CUSTOM_HEIGHT_FEET" name="CUSTOM_HEIGHT_FEET" style="width:60px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                        <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                        <option value="8" selected>8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                        <option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option>
                        <option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option>
                        <option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option>
                        <option value="24">24</option><option value="25">25</option><option value="26">26</option><option value="27">27</option>
                        <option value="28">28</option><option value="29">29</option><option value="30">30</option><option value="31">31</option>
                        <option value="32">32</option>
                    </select>
                </div>
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; color:#555;">Inches</span>
                    <select id="CUSTOM_HEIGHT_INCHES" name="CUSTOM_HEIGHT_INCHES" style="width:60px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                        <option value="0">0</option><option value="1">1</option><option value="2" selected>2</option><option value="3">3</option>
                        <option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option>
                        <option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option>
                    </select>
                </div>
            </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
            <span class="config-option-title-style">Number Of Sections</span>
            <select id="NUM_OF_SEC" name="NUM_OF_SEC" style="width:120px; padding:5px 4px; border:1px solid black; border-radius:6px;">
                <option value="4" selected>4</option>
            </select>
        </div>
    </div>
</div>

	<!-- [PATTERN] door rib pattern — rendered dynamically per door model -->
	<div style="text-align:left" class="config-option-title-style">Pattern</div>
	<div id="PATTERN_ROW" class="dimension-layout"></div>

	<!-- [COLOUR] door colour selection — rendered dynamically per door model -->
	<div style="text-align:left" class="config-option-title-style">Colour</div>
	<div id="COLOR_ROW" class="color-row"></div>

	<!-- [END-CAPS] single or double end caps. Availability driven by model + total width inches; see MODEL_ENDCAP_RULES. -->
	<div id="END_CAPS_CONTAINER">
	  <div style="text-align:left" class="config-option-title-style">End Caps</div>
	  <div class="combined-button-container">
	    <div class="combined-button-container-inner">
	      <div class="rw-sliding-button selected" tabindex="0" id="ENDCAPS_0_BTN">
	        <label for="ENDCAPS_0">Single End Caps</label>
	        <input type="radio" style="display:none;" id="ENDCAPS_0" name="EndCaps" value="0" checked>
	      </div>
	      <div class="rw-sliding-button" tabindex="0" id="ENDCAPS_1_BTN">
	        <label for="ENDCAPS_1">Double End Caps</label>
	        <input type="radio" style="display:none;" id="ENDCAPS_1" name="EndCaps" value="1">
	      </div>
	    </div>
	  </div>
	  <div id="END_CAPS_UNAVAILABLE" style="display:none; font-size:12px; color:#a00; margin-top:4px;">End caps not available at this width.</div>
	</div>

  <!-- [DM-WIND-LOAD] -->
  <div style="text-align:left" class="config-option-title-style">Wind Load</div>
  <div class="combined-button-container">
    <div class="combined-button-container-inner">
      <div class="rw-sliding-button selected" tabindex="0">
        <label for="WIND_LOAD_0">Basic</label>
        <input type="radio" style="display:none;" id="WIND_LOAD_0" name="WindLoad" value="basic" checked>
      </div>
      <div class="rw-sliding-button" tabindex="0">
        <label for="WIND_LOAD_1">15 psf</label>
        <input type="radio" style="display:none;" id="WIND_LOAD_1" name="WindLoad" value="15psf">
      </div>
      <div class="rw-sliding-button" tabindex="0">
        <label for="WIND_LOAD_2">20 psf</label>
        <input type="radio" style="display:none;" id="WIND_LOAD_2" name="WindLoad" value="20psf">
      </div>
    </div>
  </div>

  <!-- [DM-TRUSS-STYLE] dropdown — options are dynamically filtered by truss_style_logic.js
       based on (model, wind load, width, sections). -->
  <div style="text-align:left" class="config-option-title-style">Truss Style</div>
  <select id="TRUSS_STYLE" name="TRUSS_STYLE" class="long-select" style="padding:5px 8px; border:1px solid black; border-radius:6px;">
    <option value="none" selected>None</option>
    <option value="T 2.5 x 18 Top Section only">T 2.5 x 18 Top Section only</option>
    <option value="T 2.5 x 18 Top and Bottom only">T 2.5 x 18 Top and Bottom only</option>
    <option value="T 2.5 x 18 Top, bottom, and every 2nd section">T 2.5 x 18 Top, bottom, and every 2nd section</option>
    <option value="T 2.5 x 18 Every section">T 2.5 x 18 Every section</option>
    <option value="T 3.625 x 18 Top and bottom">T 3.625 x 18 Top and bottom</option>
    <option value="T 3.625 x 18 Top, bottom and every 2nd section">T 3.625 x 18 Top, bottom and every 2nd section</option>
    <option value="T 3.625 x 18 Every section">T 3.625 x 18 Every section</option>
    <option value="T 4.0 x 16 Top and bottom">T 4.0 x 16 Top and bottom</option>
    <option value="T 4.0 x 16 Top, bottom and every 2nd section">T 4.0 x 16 Top, bottom and every 2nd section</option>
    <option value="T 4.0 x 16 Every section">T 4.0 x 16 Every section</option>
  </select>
     </section>

<!-- ============================================================
     SECTION: GLAZING — windows + glass options
     (note: this section reuses id="DIMENSIONS", which is a quirk in the source)
     ============================================================ -->
<section id="DIMENSIONS" title="Glazing" class="rw-configurator__page" enabled="true" face="true" hardware="true">
	<!-- [GLAZING-WINDOWS] retained as a hidden input (always "none"): WINDOWS still
	     feeds the canvas render, GL_GLAZING_TYPE and the BOM output, but the visible
	     None/Slim 40" picker was replaced by the GLAZING_TYPE styles below. -->
	<input type="radio" style="display:none;" id="WINDOWS_0" name="WINDOWS" value="none" desc="None" checked>
	<!-- [GLAZING-TYPE] glazing style — sits directly under the "Glazing" heading -->
	<div id="GLAZING_OPTIONS" style="margin-top:8px;display:flex;flex-direction:column;row-gap:5px;width:100%;">
	<div style="text-align: left;" class="config-option-title-style">Glazing</div>
	<div style="display:flex;justify-content:flex-start; flex-wrap: wrap; row-gap: 3px;">
<div class="rw-button" tabindex="0">
	<label for="GLAZING_TYPE_0">None</label>
	<input type="radio" style="display:none;" id="GLAZING_TYPE_0"  name="GLAZING_TYPE" desc="None" value="none" checked>
	</div>
<div class="rw-button" tabindex="0">
	<label for="GLAZING_TYPE_1">Lites</label>
	<input type="radio" style="display:none;" id="GLAZING_TYPE_1" name="GLAZING_TYPE" desc="Lites" value="lites" >
	</div>
<div class="rw-button" tabindex="0">
	<label for="GLAZING_TYPE_2">Polytite Fullview</label>
	<input type="radio" style="display:none;" id="GLAZING_TYPE_2"  name="GLAZING_TYPE" desc="Polytite Fullview" value="polytite_fullview" >
	</div>
<div class="rw-button" tabindex="0">
	<label for="GLAZING_TYPE_3">Alumatite Fullview</label>
	<input type="radio" style="display:none;" id="GLAZING_TYPE_3"  name="GLAZING_TYPE" desc="Alumatite Fullview" value="alumatite_fullview" >
	</div>
	</div>
	<!-- [GLAZING-TEMPERED] clear / tempered glass -->
	<div style="text-align: left;" class="config-option-title-style">Glass Material</div>
	<div class="combined-button-container">
		<div class="combined-button-container-inner">
		 <div class="rw-sliding-button" tabindex="0">
		   <label for="TEMPERED_0">Clear Glass</label>
		   <input type="radio" style="display:none;" id="TEMPERED_0"  name="TEMPERED" desc="Clear Glass" value="untempered" checked>
		 </div>
		 <div class="rw-sliding-button" tabindex="0">
		   <label for="TEMPERED_1">Tempered Glass</label>
		   <input type="radio" style="display:none;" id="TEMPERED_1" name="TEMPERED" desc="Tempered Glass" value="tempered" >
		 </div>
		</div>
	</div>
	</div>
     </section>

    <!-- ============================================================
         SECTION: HARDWARE — track / lift / jamb / shaft hardware
         ============================================================ -->
    <section face="false" hardware="true" enabled="true" id="HARDWARE" title="Hardware"
      class="rw-configurator__page hardware-container-box">
	<div class="hardware-container-inputs">
      <!-- [HARDWARE-SIZES] 2 or 3. Hidden when Door Options = Door Face Only. -->
      <div id="hardware_size_section">
        <div style="text-align:left" class="config-option-title-style">Hardware Sizes</div>
        <div class="combined-button-container">
          <div class="combined-button-container-inner">
            <div class="rw-sliding-button selected" tabindex="0" id="HARDWARE_SIZE_0_BTN">
              <label for="HARDWARE_SIZE_0">2</label>
              <input type="radio" style="display:none;" id="HARDWARE_SIZE_0" name="HARDWARE_SIZE" value="2" checked>
            </div>
            <div class="rw-sliding-button" tabindex="0" id="HARDWARE_SIZE_1_BTN">
              <label for="HARDWARE_SIZE_1">3</label>
              <input type="radio" style="display:none;" id="HARDWARE_SIZE_1" name="HARDWARE_SIZE" value="3">
            </div>
          </div>
        </div>
      </div>

      <!-- [LIFT-TYPE] standard lift, low headroom, high lift, etc. -->
      <div class="horizontal-inputs inputs-container-padding-highlift" style="flex-direction:column; align-items:flex-start; gap:8px;">
        <div class="hardware-container-lift-type-inner">
          <div style="text-align:left" class="config-option-title-style">Lift Type</div>
          <select id="LIFT_TYPE" name="LIFT_TYPE" class="long-select" style="padding:5px 8px; border:1px solid black; border-radius:6px;">
            <option value="Std_Lift_12R" selected display="Standard 12R" classification="S" ic_code="H" sb_desc="12&quot; SL" numVal="1.0" radius="12" trackCode="12R" hwdesc="12R">
              Standard Lift - Radius(12 inch/305 mm)
            </option>
            <option value="Std_Lift_16R" display="Standard 16R" classification="S" ic_code="H" sb_desc="16&quot; SL" numVal="1.0" radius="16" trackCode="16R" hwdesc="16R">
              Standard Lift - Radius(16 inch/406 mm)
            </option>
            <option value="LHR_Fr_Mnt" classification="F" display="Low Head Room Front" ic_code="T" sb_desc="LHF"
              numVal="1.0" trackCode="LHF" radius="7" hwdesc="LHF">
              Front Mount (Low Head Room)
            </option>
            <option value="LHR_Rr_Mnt" classification="R" display="Low Head Room Rear" ic_code="X" sb_desc="LHR"
              numVal="1.0" trackCode="LHR" radius="7" hwdesc="LHR">
              Rear Mount (Low Head Room)
            </option>
            <option id="LIFT_TYPE_HL" maxheight="120" edges="HEIGHT" value="High_Lift" classification="H"
              display="High Lift" ic_code="?" sb_desc="HL" numVal="2.0" trackCode="" radius="0" hwdesc="HL">High Lift
            </option>
            <option value="Vertical_Lift" classification="V" display="Vertical Lift" ic_code="V" sb_desc="VL"
              numVal="1.0" trackCode="VL" radius="0" hwdesc="VL">
              Vertical Lift
            </option>
            <option value="LHR_Vertical_Lift" classification="V" display="Vertical Lift LHR" ic_code="V"
              sb_desc="LHR_VL" numVal="1.0" trackCode="LHR_VL" radius="0" hwdesc="LHR_VL">
              Vertical Lift (Low Head Room)
            </option>
          </select>
        </div>
	   <!-- [HIGHLIFT] inches + [CLEARANCE] — shown only when LIFT_TYPE === High_Lift -->
	   <div id="HIGHLIFT_ROW" style="display:none; gap:16px; align-items:center; flex-wrap:wrap;">
	   <div>
	   <div id="HIGHLIFT_LABEL" style="text-align:left" class="config-option-title-style">Highlift (in)</div>
      <select id="HIGHLIFT" name="HIGHLIFT" style="width:fit-content; padding:5px 8px; border:1px solid black; border-radius:6px;">
        <option value=15 selected>15</option>
        <option value=16>16</option>
        <option value=17>17</option>
        <option value=18>18</option>
        <option value=19>19</option>
        <option value=20>20</option>
        <option value=21>21</option>
        <option value=22>22</option>
        <option value=23>23</option>
        <option value=24>24</option>
        <option value=25>25</option>
        <option value=26>26</option>
        <option value=27>27</option>
        <option value=28>28</option>
        <option value=29>29</option>
        <option value=30>30</option>
        <option value=31>31</option>
        <option value=32>32</option>
        <option value=33>33</option>
        <option value=34>34</option>
        <option value=35>35</option>
        <option value=36>36</option>
        <option value=37>37</option>
        <option value=38>38</option>
        <option value=39>39</option>
        <option value=40>40</option>
        <option value=41>41</option>
        <option value=42>42</option>
        <option value=43>43</option>
        <option value=44>44</option>
        <option value=45>45</option>
        <option value=46>46</option>
        <option value=47>47</option>
        <option value=48>48</option>
        <option value=49>49</option>
        <option value=50>50</option>
        <option value=51>51</option>
        <option value=52>52</option>
        <option value=53>53</option>
        <option value=54>54</option>
      </select>
	   </div>
	   <!-- [CLEARANCE] -->
	   <div>
	   <div id="CLEARANCE_LABEL" style="text-align:left" class="config-option-title-style">Clearance</div>
      <select id="CLEARANCE" name="CLEARANCE" style="width:fit-content; padding:5px 8px; border:1px solid black; border-radius:6px;">
        <option value="None" selected>None</option>
        <option value="HighLift">High Lift</option>
        <option value="HeadRoom">Head Room</option>
      </select>
	   </div>
	   </div>
	   <!-- [CUSTOM-LHR-SETUP] shown only when LIFT_TYPE === LHR_Vertical_Lift -->
	   <div id="CUSTOM_LHR_ROW" style="display:none; flex-direction:column; align-items:flex-start;">
	     <div style="text-align:left" class="config-option-title-style">Include Custom Low Headroom Setup</div>
	     <div class="combined-button-container">
	       <div class="combined-button-container-inner">
	         <div class="rw-sliding-button" tabindex="0" id="CUSTOM_LHR_YES_BTN">
	           <label for="CUSTOM_LHR_YES">Yes</label>
	           <input type="radio" style="display:none;" id="CUSTOM_LHR_YES" name="CustomLHRSetup" value="yes">
	         </div>
	         <div class="rw-sliding-button selected" tabindex="0" id="CUSTOM_LHR_NO_BTN">
	           <label for="CUSTOM_LHR_NO">No</label>
	           <input type="radio" style="display:none;" id="CUSTOM_LHR_NO" name="CustomLHRSetup" value="no" checked>
	         </div>
	       </div>
	     </div>
	   </div>
      </div>


      <!-- [TRACK-MOUNT] -->
      <div style="margin-top:8px;">
        <div style="text-align:left" class="config-option-title-style">Track Mount</div>
        <div class="dimension-layout" id="TRK_MOUNT_TYP_GROUP">
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_ADCA_3">3 IN ADCA</label>
            <input type="radio" id="TRK_MOUNT_ADCA_3" name="TRK_MOUNT_TYP" value="ADCA_3" hwset="ADCA3">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_ADCA_2">2 IN ADCA</label>
            <input type="radio" id="TRK_MOUNT_ADCA_2" name="TRK_MOUNT_TYP" value="ADCA_2" hwset="ADCA2">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_CLIP_3">3 IN Clip Angle</label>
            <input type="radio" id="TRK_MOUNT_CLIP_3" name="TRK_MOUNT_TYP" value="CLIP_3" hwset="CLIP3">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_CLIP_2">2 IN Clip Angle</label>
            <input type="radio" id="TRK_MOUNT_CLIP_2" name="TRK_MOUNT_TYP" value="CLIP_2" hwset="CLIP2">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_B">Bracket Mount</label>
            <input type="radio" id="TRK_MOUNT_B" name="TRK_MOUNT_TYP" value="B" hwset="BM" checked>
          </div>
          <div class="rw-button" tabindex="0">
            <label for="TRK_MOUNT_NONE">None</label>
            <input type="radio" id="TRK_MOUNT_NONE" name="TRK_MOUNT_TYP" value="NONE" hwset="NONE">
          </div>
        </div>
      </div>

      <!-- [JAMB] -->
      <div style="margin-top:8px;">
        <div style="text-align:left" class="config-option-title-style">Jamb</div>
        <div class="dimension-layout" id="JAMB_GROUP">
          <div class="rw-button" tabindex="0">
            <label for="JAMB_STEEL">Steel</label>
            <input type="radio" id="JAMB_STEEL" name="JAMB" value="steel" hwset="SJ">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="JAMB_WOOD">Wood</label>
            <input type="radio" id="JAMB_WOOD" name="JAMB" value="wood" hwset="WJ" checked>
          </div>
          <div class="rw-button" tabindex="0">
            <label for="JAMB_MASONRY">Masonry</label>
            <input type="radio" id="JAMB_MASONRY" name="JAMB" value="masonry" hwset="MJ">
          </div>
        </div>
      </div>

      <!-- [LOWER-SPLICE] -->
      <div style="margin-top:8px;">
        <div style="text-align:left" class="config-option-title-style">Lower Splice</div>
        <select id="LOWER_SPLICE" name="LowerSplice" style="width:fit-content; padding:5px 8px; border:1px solid black; border-radius:6px;">
          <option value="NONE" selected>None</option>
          <option value="UPPER_WALL_ANGLE">With Upper Wall Angle</option>
          <option value="UPPER_BRACKET_MOUNT">With Upper Bracket Mount</option>
        </select>
      </div>

      <!-- [INCLINED-TRACK] Yes/No + Slope/Degrees + value when Yes -->
      <div style="margin-top:8px;">
        <div class="horizontal-inputs" style="display:flex; gap:16px; align-items:flex-end; flex-wrap:wrap;">
          <div>
            <div style="text-align:left" class="config-option-title-style">Inclined Track</div>
            <div class="combined-button-container">
              <div class="combined-button-container-inner">
                <div class="rw-sliding-button" tabindex="0" id="INCLINED_TRACK_YES_BTN">
                  <label for="INCLINED_TRACK_YES">Yes</label>
                  <input type="radio" style="display:none;" id="INCLINED_TRACK_YES" name="InclinedTrackOn" value="yes">
                </div>
                <div class="rw-sliding-button selected" tabindex="0" id="INCLINED_TRACK_NO_BTN">
                  <label for="INCLINED_TRACK_NO">No</label>
                  <input type="radio" style="display:none;" id="INCLINED_TRACK_NO" name="InclinedTrackOn" value="no" checked>
                </div>
                <!-- Legacy InclinedTrack name kept for host config compatibility; value mirrored by JS. -->
                <input type="hidden" id="INCLINED_TRACK_HIDDEN" name="InclinedTrack" value="none">
              </div>
            </div>
          </div>
          <div id="INCLINED_TRACK_DETAILS" style="display:none; gap:12px; align-items:flex-start; flex-wrap:wrap;">
            <div>
              <div style="text-align:left" class="config-option-title-style">Degree or No Slope</div>
              <select id="INCLINED_TRACK_VALUE" name="InclinedTrackValue" class="long-select" style="padding:5px 8px; border:1px solid black; border-radius:6px;">
                <option value="no_slope" selected>No Slope</option>
                <option value="2.39">2.39 degrees - 0.5/12 pitch</option>
                <option value="3">3 degrees</option>
                <option value="4">4 degrees</option>
                <option value="4.76">4.76 degrees - 1/12 pitch</option>
                <option value="5">5 degrees</option>
                <option value="6">6 degrees</option>
                <option value="7.13">7.13 degrees - 1.5/12 pitch</option>
                <option value="8">8 degrees</option>
                <option value="9">9 degrees</option>
                <option value="9.46">9.46 degrees - 2/12 pitch</option>
                <option value="10">10 degrees</option>
                <option value="10.5">10.5 degrees</option>
                <option value="11.7">11.7 degrees - 2.5/12 pitch</option>
                <option value="12">12 degrees</option>
                <option value="13">13 degrees</option>
                <option value="14.04">14.04 degrees - 3/12 pitch</option>
                <option value="15">15 degrees</option>
                <option value="16.26">16.26 degrees - 3.5/12 pitch</option>
                <option value="18">18 degrees</option>
                <option value="18.3">18.3 degrees - 4/12 pitch</option>
                <option value="20">20 degrees</option>
                <option value="21">21 degrees</option>
                <option value="22">22 degrees</option>
                <option value="22.62">22.62 degrees - 5/12 pitch</option>
                <option value="25">25 degrees</option>
                <option value="26.57">26.57 degrees - 6/12 pitch</option>
                <option value="30">30 degrees</option>
                <option value="30.26">30.26 degrees - 7/12 pitch</option>
                <option value="33.69">33.69 degrees - 8/12 pitch</option>
                <option value="35">35 degrees</option>
                <option value="36.87">36.87 degrees - 9/12 pitch</option>
                <option value="39.81">39.81 degrees - 10/12 pitch</option>
                <option value="40">40 degrees</option>
                <option value="42.51">42.51 degrees - 11/12 pitch</option>
                <option value="45">45 degrees - 12/12 pitch</option>
              </select>
            </div>
          </div>
        </div>
      </div>


      <!-- [JAMB-SEAL] seal type + coverage -->
      <div class="horizontal-inputs" style="display:flex; gap:16px; align-items:flex-start; flex-wrap:wrap;">
        <div>
          <div style="text-align:left" class="config-option-title-style">Weather Seal</div>
          <select id="JAMB_SEAL" name="JAMB_SEAL" class="long-select" style="padding:5px 8px; border:1px solid black; border-radius:6px;">
            <option value="NONE" selected>None</option>
            <option value="EU_ADCA_JWS">EU ADCA Jamb Weather Strip</option>
            <option value="EU_ADCA">EU ADCA</option>
            <option value="ADCA_MOUNT_JWS">ADCA Mount Jamb Weather Seal</option>
            <option value="ALUM_BLACK_VINYL">Alum Black Vinyl</option>
            <option value="ALUM_CAFE_VINYL">Alum Cafe Vinyl</option>
            <option value="ALUM_BROWN_VINYL">Alum Brown Vinyl</option>
            <option value="ALUM_CHARCOAL_VINYL">Alum Charcoal Vinyl</option>
            <option value="ALUM_ORE_VINYL">Alum Ore Vinyl</option>
            <option value="ALUM_BRONZE_VINYL">Alum Bronze Vinyl</option>
            <option value="ALUM_CHERRY_VINYL">Alum Cherry Vinyl</option>
            <option value="ALUM_GOLDEN_OAK_VINYL">Alum Golden Oak Vinyl</option>
            <option value="ALUM_DARK_OAK_VINYL">Alum Dark Oak Vinyl</option>
            <option value="ALUM_WHITE_VINYL">Alum White Vinyl</option>
            <option value="ALUM_TAUPE_VINYL">Alum Taupe Vinyl</option>
            <option value="ALUM_ALMOND_VINYL">Alum Almond Vinyl</option>
            <option value="STEEL_WHITE_VINYL">Steel White Vinyl</option>
            <option value="STEEL_ALMOND_VINYL">Steel Almond Vinyl</option>
            <option value="STEEL_TAUPE_VINYL">Steel Taupe Vinyl</option>
            <option value="STEEL_BROWN_VINYL">Steel Brown Vinyl</option>
            <option value="STEEL_BLACK_VINYL">Steel Black Vinyl</option>
            <option value="STEEL_CAFE_VINYL">Steel Cafe Vinyl</option>
            <option value="STEEL_CHARCOAL_VINYL">Steel Charcoal Vinyl</option>
            <option value="STEEL_BRONZE_VINYL">Steel Bronze Vinyl</option>
            <option value="HD_ALUM_BLACK_DUAL_FIN">Heavy Duty Alum / Black Vinyl Dual Fin</option>
          </select>
        </div>
        <div>
          <div style="text-align:left" class="config-option-title-style">Coverage</div>
          <div class="combined-button-container">
            <div class="combined-button-container-inner">
              <div class="rw-sliding-button selected" tabindex="0" id="WS_COVERAGE_COMPLETE_BTN">
                <label for="WS_COVERAGE_COMPLETE">Complete</label>
                <input type="radio" style="display:none;" id="WS_COVERAGE_COMPLETE" name="WeatherSealCoverage" value="complete" checked>
              </div>
              <div class="rw-sliding-button" tabindex="0" id="WS_COVERAGE_VERTICAL_BTN">
                <label for="WS_COVERAGE_VERTICAL">Vertical Only</label>
                <input type="radio" style="display:none;" id="WS_COVERAGE_VERTICAL" name="WeatherSealCoverage" value="vertical_only">
              </div>
            </div>
          </div>
        </div>

      </div>
	<!--
      <label for="EXTRA_TRUSS">Extra Truss?</label>
      <select id="EXTRA_TRUSS" maxwidth="180" name="EXTRA_TRUSS" class="rw-configurator__select">
        <option value="no">No</option>
        <option value="yes">Yes</option>

      </select>
	-->
	<!-- [OPERATION] how the door is operated -->
	<div id="operation_section">
	  <div style="text-align:left" class="config-option-title-style">Operation</div>
	    <div class="dimension-layout">
		 <div class="rw-button" tabindex="0">
		 <label for="OPERATION_0">Manual</label>
		 <input type="radio" style="display:none;"  id="OPERATION_0"  name="Operation" value="0" checked>
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="OPERATION_1">Prepare for Drawbar</label>
		 <input type="radio" style="display:none;"  id="OPERATION_1" name="Operation" value="1">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="OPERATION_2">Prepare for Jack Shaft</label>
		 <input type="radio" style="display:none;"   id="OPERATION_2" name="Operation" value="2">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="OPERATION_3">DC Pulse</label>
		 <input type="radio" style="display:none;"  id="OPERATION_3" name="Operation" value="3">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="OPERATION_4">Chain Hoist</label>
		 <input type="radio" style="display:none;"   id="OPERATION_4" name="Operation" value="4">
		 </div>
	    </div>
	</div>

     <!-- [MANUAL-TYPE] pull cord / chain options. Hidden by default; syncManualTypeVisibility() shows it only when Operation === "0" (Manual). -->
     <div id="manual_type_section" style="display:none;">
	  <div style="text-align:left" class="config-option-title-style">Manual Type</div>
	    <div class="dimension-layout">
		 <div class="rw-button" tabindex="0">
		 <label for="MANUALTYPE_0">None</label>
		 <input type="radio" style="display:none;"  id="MANUALTYPE_0"  name="ManualType" value="0" checked>
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="MANUALTYPE_1">Pull Cord Package</label>
		 <input type="radio" style="display:none;"  id="MANUALTYPE_1" name="ManualType" value="1">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="MANUALTYPE_2">Pull Chain Package Without Spring</label>
		 <input type="radio" style="display:none;"   id="MANUALTYPE_2" name="ManualType" value="2">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="MANUALTYPE_3">Pull Chain Package with Spring</label>
		 <input type="radio" style="display:none;"  id="MANUALTYPE_3" name="ManualType" value="3">
		 </div>
	  </div>
	</div>

	<!-- [CHAIN-HOIST-TYPE] shown only when Operation === "4" (Chain Hoist). Hidden by default; syncChainHoistTypeVisibility() reveals it. -->
	<div id="chain_hoist_type_section" style="display:none;">
	  <div style="text-align:left" class="config-option-title-style">Chain Hoist Type</div>
	  <div class="dimension-layout">
		 <div class="rw-button" tabindex="0">
		 <label for="CHAINHOISTTYPE_0">2000</label>
		 <input type="radio" style="display:none;" id="CHAINHOISTTYPE_0" name="ChainHoistType" value="2000" checked>
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="CHAINHOISTTYPE_1">By Others</label>
		 <input type="radio" style="display:none;" id="CHAINHOISTTYPE_1" name="ChainHoistType" value="by_others">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="CHAINHOISTTYPE_2">JR</label>
		 <input type="radio" style="display:none;" id="CHAINHOISTTYPE_2" name="ChainHoistType" value="JR">
		 </div>
		 <div class="rw-button" tabindex="0">
		 <label for="CHAINHOISTTYPE_3">JRG</label>
		 <input type="radio" style="display:none;" id="CHAINHOISTTYPE_3" name="ChainHoistType" value="JRG">
		 </div>
	  </div>
	</div>

	</div>

	<!-- [HW-DRUMS-CABLES] Drums & Cables options table. Radio per row — user
	     picks exactly one drum option. Filler values for now; replace with real
	     data when known. -->
	<div id="drums_cables_section" style="margin-top:18px; padding-top:14px; border-top:1px solid #ddd;">
	  <div style="text-align:left; font-weight:700; font-size:15px; margin-bottom:10px;">Drums &amp; Cables Options</div>
	  <table class="drums-cables-table hw-option-table" style="width:100%; border-collapse:collapse; font-size:14px;">
	    <thead>
	      <tr style="background:#f5f5f5;">
	        <th style="width:40px; padding:8px; text-align:center; border:1px solid #ddd;"></th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Drum Option</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Drum Stamping</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_0" name="DrumOption" value="opt_0" checked>
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_0">Standard Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D525-54</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_1" name="DrumOption" value="opt_1">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_1">High-Lift Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D600-72</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_2" name="DrumOption" value="opt_2">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_2">Vertical Lift Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D825-96</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_3" name="DrumOption" value="opt_3">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_3">Low-Headroom Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D400-36</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_4" name="DrumOption" value="opt_4">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_4">Heavy-Duty Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D900-108</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_5" name="DrumOption" value="opt_5">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_5">Follow-the-Roof Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D700-84</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="DRUM_OPTION_6" name="DrumOption" value="opt_6">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="DRUM_OPTION_6">Custom Drum</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">D000-00</td>
	      </tr>
	    </tbody>
	  </table>
	</div>

	<!-- [HW-SPRINGING-SOLUTIONS] Springing Solutions options table. Radio per
	     row — user picks exactly one. Filler values; replace with real data. -->
	<div id="springing_solutions_section" style="margin-top:18px; padding-top:14px; border-top:1px solid #ddd;">
	  <div style="text-align:left; font-weight:700; font-size:15px; margin-bottom:10px;">Springing Solutions</div>
	  <table class="springing-solutions-table hw-option-table" style="width:100%; border-collapse:collapse; font-size:14px;">
	    <thead>
	      <tr style="background:#f5f5f5;">
	        <th style="width:40px; padding:8px; text-align:center; border:1px solid #ddd;"></th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Option</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">QTY</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Cycle Life (k)</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Length</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Round or Square</th>
	        <th style="padding:8px; text-align:left; border:1px solid #ddd;">Upcharge</th>
	      </tr>
	    </thead>
	    <tbody>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_0" name="SpringingSolution" value="spr_0" checked>
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_0">Standard Spring</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">2</td>
	        <td style="padding:8px; border:1px solid #ddd;">10</td>
	        <td style="padding:8px; border:1px solid #ddd;">24"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Round</td>
	        <td style="padding:8px; border:1px solid #ddd;">$0.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_1" name="SpringingSolution" value="spr_1">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_1">High-Cycle Spring</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">2</td>
	        <td style="padding:8px; border:1px solid #ddd;">25</td>
	        <td style="padding:8px; border:1px solid #ddd;">28"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Round</td>
	        <td style="padding:8px; border:1px solid #ddd;">$75.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_2" name="SpringingSolution" value="spr_2">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_2">Extra-High-Cycle Spring</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">2</td>
	        <td style="padding:8px; border:1px solid #ddd;">50</td>
	        <td style="padding:8px; border:1px solid #ddd;">32"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Round</td>
	        <td style="padding:8px; border:1px solid #ddd;">$150.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_3" name="SpringingSolution" value="spr_3">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_3">Heavy-Duty Spring</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">2</td>
	        <td style="padding:8px; border:1px solid #ddd;">100</td>
	        <td style="padding:8px; border:1px solid #ddd;">36"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Square</td>
	        <td style="padding:8px; border:1px solid #ddd;">$225.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_4" name="SpringingSolution" value="spr_4">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_4">Dual-Spring System</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">4</td>
	        <td style="padding:8px; border:1px solid #ddd;">25</td>
	        <td style="padding:8px; border:1px solid #ddd;">24"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Round</td>
	        <td style="padding:8px; border:1px solid #ddd;">$180.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_5" name="SpringingSolution" value="spr_5">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_5">Quad-Spring System</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">4</td>
	        <td style="padding:8px; border:1px solid #ddd;">50</td>
	        <td style="padding:8px; border:1px solid #ddd;">30"</td>
	        <td style="padding:8px; border:1px solid #ddd;">Square</td>
	        <td style="padding:8px; border:1px solid #ddd;">$320.00</td>
	      </tr>
	      <tr>
	        <td style="padding:8px; text-align:center; border:1px solid #ddd;">
	          <input type="radio" id="SPRING_OPTION_6" name="SpringingSolution" value="spr_6">
	        </td>
	        <td style="padding:8px; border:1px solid #ddd;"><label for="SPRING_OPTION_6">Custom Spring</label></td>
	        <td style="padding:8px; border:1px solid #ddd;">—</td>
	        <td style="padding:8px; border:1px solid #ddd;">—</td>
	        <td style="padding:8px; border:1px solid #ddd;">—</td>
	        <td style="padding:8px; border:1px solid #ddd;">—</td>
	        <td style="padding:8px; border:1px solid #ddd;">TBD</td>
	      </tr>
	    </tbody>
	  </table>
	</div>

	<!-- [HW-BUMPER-OR-PUSHER-SPRINGS] -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Bumper or Pusher Springs</div>
	  <div class="dimension-layout">
	    <div class="rw-button" tabindex="0">
	      <label for="BUMPER_NONE">None</label>
	      <input type="radio" id="BUMPER_NONE" name="BumperOrPusherSprings" value="none" checked>
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="BUMPER_SPRG">BumperSprg</label>
	      <input type="radio" id="BUMPER_SPRG" name="BumperOrPusherSprings" value="bumper_sprg">
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="BUMPER_LEAF_SPRG">BumperLeafSprg</label>
	      <input type="radio" id="BUMPER_LEAF_SPRG" name="BumperOrPusherSprings" value="bumper_leaf_sprg">
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="PUSH_SPRG">PushSprg</label>
	      <input type="radio" id="PUSH_SPRG" name="BumperOrPusherSprings" value="push_sprg">
	    </div>
	  </div>
	</div>

	<!-- [HW-NOLAP-STEEL-JAMB] -->
	<div>
	  <div style="text-align:left" class="config-option-title-style">No Lap Steel Jamb</div>
	  <div class="combined-button-container">
	    <div class="combined-button-container-inner">
	      <div class="rw-sliding-button" tabindex="0" id="NOLAP_STEEL_JAMB_YES_BTN">
	        <label for="NOLAP_STEEL_JAMB_YES">Yes</label>
	        <input type="radio" style="display:none;" id="NOLAP_STEEL_JAMB_YES" name="NoLapSteelJamb" value="yes">
	      </div>
	      <div class="rw-sliding-button selected" tabindex="0" id="NOLAP_STEEL_JAMB_NO_BTN">
	        <label for="NOLAP_STEEL_JAMB_NO">No</label>
	        <input type="radio" style="display:none;" id="NOLAP_STEEL_JAMB_NO" name="NoLapSteelJamb" value="no" checked>
	      </div>
	    </div>
	  </div>
	  <div style="font-size:12px; color:#555; margin-top:4px; font-style:italic;">As viewed from the outside.</div>
	</div>

	<!-- [HW-SHAFT-TYPE] Tube Shaft / Keyed Tube Shaft / 1" Solid Shaft / 1 1/4" Solid Shaft -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Shaft Type</div>
	  <div class="dimension-layout">
	    <div class="rw-button" tabindex="0">
	      <label for="SHAFT_TYPE_TUBE">Tube Shaft</label>
	      <input type="radio" id="SHAFT_TYPE_TUBE" name="ShaftType" value="tube" checked>
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="SHAFT_TYPE_KEYED_TUBE">Keyed Tube Shaft</label>
	      <input type="radio" id="SHAFT_TYPE_KEYED_TUBE" name="ShaftType" value="keyed_tube">
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="SHAFT_TYPE_SOLID_1">1" Solid Shaft</label>
	      <input type="radio" id="SHAFT_TYPE_SOLID_1" name="ShaftType" value="solid_1">
	    </div>
	    <div class="rw-button" tabindex="0">
	      <label for="SHAFT_TYPE_SOLID_1_25">1 1/4" Solid Shaft</label>
	      <input type="radio" id="SHAFT_TYPE_SOLID_1_25" name="ShaftType" value="solid_1_25">
	    </div>
	  </div>
	</div>

	<!-- [HW-HANGER-ANGLE] Type dropdown + Qty number input -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Hanger Angle</div>
	  <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:6px;">
	    <div style="display:flex; align-items:center; gap:8px;">
	      <span style="font-size:14px;">Type:</span>
	      <select id="HANGER_ANGLE_TYPE" name="HangerAngleType" class="rw-configurator__select">
	        <option value="none" selected>None</option>
	        <option value="hanger_14ga">Hanger 14ga 1.25"x1.25"x10'</option>
	        <option value="hanger_11ga">Hanger 11ga 1.5"x1.5"x10-8 Slot</option>
	        <option value="hanger_12ga">Hanger 12ga 2"x2"x10'</option>
	      </select>
	    </div>
	    <div style="display:flex; align-items:center; gap:8px;">
	      <span style="font-size:14px;">Qty:</span>
	      <select id="HANGER_ANGLE_QTY_INPUT" name="HangerAngleQtyInput" class="rw-configurator__select">
	        <option value="0" selected>0</option>
	      </select>
	    </div>
	  </div>
	</div>

	<!-- [HW-COUPLER] -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Coupler</div>
	  <div class="combined-button-container">
	    <div class="combined-button-container-inner">
	      <div class="rw-sliding-button" tabindex="0">
	        <label for="COUPLER_YES">Yes</label>
	        <input type="radio" style="display:none;" id="COUPLER_YES" name="Coupler" value="yes">
	      </div>
	      <div class="rw-sliding-button selected" tabindex="0">
	        <label for="COUPLER_NO">No</label>
	        <input type="radio" style="display:none;" id="COUPLER_NO" name="Coupler" value="no" checked>
	      </div>
	    </div>
	  </div>
	</div>

	<!-- [HW-SELF-ALIGNING-FLANGE-BEARINGS] -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Self-Aligning Flange Bearings</div>
	  <div class="combined-button-container">
	    <div class="combined-button-container-inner">
	      <div class="rw-sliding-button" tabindex="0">
	        <label for="SELF_ALIGNING_FLANGE_BEARINGS_YES">Yes</label>
	        <input type="radio" style="display:none;" id="SELF_ALIGNING_FLANGE_BEARINGS_YES" name="SelfAligningFlangeBearings" value="yes">
	      </div>
	      <div class="rw-sliding-button selected" tabindex="0">
	        <label for="SELF_ALIGNING_FLANGE_BEARINGS_NO">No</label>
	        <input type="radio" style="display:none;" id="SELF_ALIGNING_FLANGE_BEARINGS_NO" name="SelfAligningFlangeBearings" value="no" checked>
	      </div>
	    </div>
	  </div>
	</div>

	<!-- [HW-DUPLEX-SOLUTIONS] -->
	<div style="margin-top:12px;">
	  <div style="text-align:left" class="config-option-title-style">Include Duplex Solutions?</div>
	  <div class="combined-button-container">
	    <div class="combined-button-container-inner">
	      <div class="rw-sliding-button" tabindex="0">
	        <label for="DUPLEX_SOLUTIONS_YES">Yes</label>
	        <input type="radio" style="display:none;" id="DUPLEX_SOLUTIONS_YES" name="DuplexSolutions" value="yes">
	      </div>
	      <div class="rw-sliding-button selected" tabindex="0">
	        <label for="DUPLEX_SOLUTIONS_NO">No</label>
	        <input type="radio" style="display:none;" id="DUPLEX_SOLUTIONS_NO" name="DuplexSolutions" value="no" checked>
	      </div>
	    </div>
	  </div>
	</div>
    </section>
<!-- ============================================================
     SECTION: SECTION_OPTIONS — placeholder, to be filled with section-level controls.
     Tab is rendered automatically by the framework from the title attribute.
     ============================================================ -->
<section face="true" hardware="true" enabled="true" id="SECTION_OPTIONS" title="Advanced"
  class="rw-configurator__page">

  <!-- [SO-BOTTOM-SEAL] -->
  <div id="BOTTOM_SEAL_ROW" style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Bottom Seal</div>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px;">
      <div class="dimension-layout">
        <div class="rw-button btn-checked" tabindex="0">
          <label for="BOTTOM_SEAL_NONE">None</label>
          <input type="radio" style="display:none;" id="BOTTOM_SEAL_NONE" name="BottomSeal" value="none" checked>
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_SEAL_PVC">4" PVC Bottom Seal (-35C)</label>
          <input type="radio" style="display:none;" id="BOTTOM_SEAL_PVC" name="BottomSeal" value="pvc_4_35c">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_SEAL_SANTOPRENE" >3" Santoprene Bottom Seal (-60C)</label>
          <input type="radio" style="display:none;" id="BOTTOM_SEAL_SANTOPRENE" name="BottomSeal" value="santoprene_3_60c">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-TOP-WEATHER-SEAL] -->
  <div style="text-align:left" class="config-option-title-style">Top Weather Seal</div>
  <select id="TOP_WEATHER_SEAL" name="TopWeatherSeal" style="width:fit-content; padding:5px 8px; border:1px solid black; border-radius:6px;">
    <option value="none" selected>None</option>
    <option value="1pc_dual_durometer_1.5_1.75">1 PC top (dual durometer) 1.5"/1.75"</option>
  </select>

  <!-- [SO-BOTTOM-RETAINER] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Bottom Retainer</div>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px;">
      <div class="dimension-layout">
        <div class="rw-button btn-checked" tabindex="0">
          <label for="BOTTOM_RETAINER_ALUMINUM">Aluminum retainer only</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_ALUMINUM" name="BottomRetainer" value="aluminum" checked>
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_RETAINER_STEEL">Bottom seal with PVC Retainer</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_STEEL" name="BottomRetainer" value="steel">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_RETAINER_PVC">Bottom seal with aluminum retainer</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_PVC" name="BottomRetainer" value="pvc">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_RETAINER_CHANNELCAP">Channel Cap</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_CHANNELCAP" name="BottomRetainer" value="ChannelCap">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_RETAINER_GALVANIZED">Galvanized bottom angle</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_GALVANIZED" name="BottomRetainer" value="GalvanizedBottomAngle">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="BOTTOM_RETAINER_NONE">None</label>
          <input type="radio" style="display:none;" id="BOTTOM_RETAINER_NONE" name="BottomRetainer" value="none">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-ROLLER-STYLE] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Roller Style</div>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px;">
      <div class="dimension-layout">
        <div class="rw-button btn-checked" tabindex="0">
          <label for="ROLLER_STYLE_STEEL">Steel</label>
          <input type="radio" style="display:none;" id="ROLLER_STYLE_STEEL" name="RollerStyle" value="Steel" checked>
        </div>
        <div class="rw-button" tabindex="0">
          <label for="ROLLER_STYLE_NYLON">Nylon</label>
          <input type="radio" style="display:none;" id="ROLLER_STYLE_NYLON" name="RollerStyle" value="Nylon">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="ROLLER_STYLE_NYLON_SB">Nylon w/ sealed bearing</label>
          <input type="radio" style="display:none;" id="ROLLER_STYLE_NYLON_SB" name="RollerStyle" value="Nylon w/ sealed bearing">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="ROLLER_STYLE_UHMW_SB">UHMW W/Sealed bearing</label>
          <input type="radio" style="display:none;" id="ROLLER_STYLE_UHMW_SB" name="RollerStyle" value="UHMW W/Sealed bearing">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="ROLLER_STYLE_NYLON_SS">Nylon w/ stainless stem and sealed bearing</label>
          <input type="radio" style="display:none;" id="ROLLER_STYLE_NYLON_SS" name="RollerStyle" value="Nylon w/ stainless stem and sealed bearing">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-12-GAUGE-HINGES] -->
  <div style="text-align:left" class="config-option-title-style">12 Gauge Hinges</div>
  <div class="combined-button-container">
    <div class="combined-button-container-inner">
      <div class="rw-sliding-button selected" tabindex="0">
        <label for="HINGES_12GA_0">Yes</label>
        <input type="radio" style="display:none;" id="HINGES_12GA_0" name="Hinges12Gauge" value="Yes" checked>
      </div>
      <div class="rw-sliding-button" tabindex="0">
        <label for="HINGES_12GA_1">No</label>
        <input type="radio" style="display:none;" id="HINGES_12GA_1" name="Hinges12Gauge" value="No">
      </div>
    </div>
  </div>

  <!-- [SO-STEP-PLATE] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Step Plate</div>
    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px;">
      <div class="dimension-layout">
        <div class="rw-button btn-checked" tabindex="0">
          <label for="STEP_PLATE_NONE">None</label>
          <input type="radio" style="display:none;" id="STEP_PLATE_NONE" name="StepPlate" value="none" checked>
        </div>
        <div class="rw-button" tabindex="0">
          <label for="STEP_PLATE_LEFT">1 Left Side</label>
          <input type="radio" style="display:none;" id="STEP_PLATE_LEFT" name="StepPlate" value="left">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="STEP_PLATE_RIGHT">1 Right Side</label>
          <input type="radio" style="display:none;" id="STEP_PLATE_RIGHT" name="StepPlate" value="right">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="STEP_PLATE_CENTRE">1 Centre</label>
          <input type="radio" style="display:none;" id="STEP_PLATE_CENTRE" name="StepPlate" value="centre">
        </div>
        <div class="rw-button" tabindex="0">
          <label for="STEP_PLATE_EACH">1 Each Side</label>
          <input type="radio" style="display:none;" id="STEP_PLATE_EACH" name="StepPlate" value="each">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-EXHAUST-PORT] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Exhaust Port</div>
    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:6px;">
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <span style="font-size:14px; color:#000; font-weight:700;">View:</span>
        <div class="dimension-layout">
          <div class="rw-button btn-checked" tabindex="0">
            <label for="EXHAUST_PORT_VIEW_NONE">None</label>
            <input type="radio" style="display:none;" id="EXHAUST_PORT_VIEW_NONE" name="ExhaustPortView" value="none" checked>
          </div>
          <div class="rw-button" tabindex="0">
            <label for="EXHAUST_PORT_VIEW_LEFT">1 Left Side</label>
            <input type="radio" style="display:none;" id="EXHAUST_PORT_VIEW_LEFT" name="ExhaustPortView" value="left">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="EXHAUST_PORT_VIEW_RIGHT">1 Right Side</label>
            <input type="radio" style="display:none;" id="EXHAUST_PORT_VIEW_RIGHT" name="ExhaustPortView" value="right">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="EXHAUST_PORT_VIEW_CENTRE">1 Centre</label>
            <input type="radio" style="display:none;" id="EXHAUST_PORT_VIEW_CENTRE" name="ExhaustPortView" value="centre">
          </div>
          <div class="rw-button" tabindex="0">
            <label for="EXHAUST_PORT_VIEW_EACH">1 Each Side</label>
            <input type="radio" style="display:none;" id="EXHAUST_PORT_VIEW_EACH" name="ExhaustPortView" value="each">
          </div>
        </div>
      </div>
      <div id="EXHAUST_PORT_DETAILS_WRAP" style="display:none; align-items:center; gap:16px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <span style="font-size:14px; color:#000; font-weight:700;">Size:</span>
          <div class="dimension-layout">
            <div class="rw-button btn-checked" tabindex="0">
              <label for="EXHAUST_PORT_SIZE_0">0</label>
              <input type="radio" style="display:none;" id="EXHAUST_PORT_SIZE_0" name="ExhaustPortSize" value="0" checked>
            </div>
            <div class="rw-button" tabindex="0">
              <label for="EXHAUST_PORT_SIZE_3">3 in</label>
              <input type="radio" style="display:none;" id="EXHAUST_PORT_SIZE_3" name="ExhaustPortSize" value="3">
            </div>
            <div class="rw-button" tabindex="0">
              <label for="EXHAUST_PORT_SIZE_4">4 in</label>
              <input type="radio" style="display:none;" id="EXHAUST_PORT_SIZE_4" name="ExhaustPortSize" value="4">
            </div>
            <div class="rw-button" tabindex="0">
              <label for="EXHAUST_PORT_SIZE_6">6 in</label>
              <input type="radio" style="display:none;" id="EXHAUST_PORT_SIZE_6" name="ExhaustPortSize" value="6">
            </div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:14px; color:#000; font-weight:700;">Latched:</span>
          <div class="combined-button-container">
            <div class="combined-button-container-inner">
              <div class="rw-sliding-button" tabindex="0">
                <label for="EXHAUST_PORT_LATCHED_YES">Yes</label>
                <input type="radio" style="display:none;" id="EXHAUST_PORT_LATCHED_YES" name="ExhaustPortLatched" value="yes">
              </div>
              <div class="rw-sliding-button selected" tabindex="0">
                <label for="EXHAUST_PORT_LATCHED_NO">No</label>
                <input type="radio" style="display:none;" id="EXHAUST_PORT_LATCHED_NO" name="ExhaustPortLatched" value="no" checked>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-BAR-LATCH] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Bar Latch</div>
    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:6px;">
      <div class="combined-button-container">
        <div class="combined-button-container-inner">
          <div class="rw-sliding-button" tabindex="0">
            <label for="BAR_LATCH_YES">Yes</label>
            <input type="radio" style="display:none;" id="BAR_LATCH_YES" name="BarLatch" value="yes">
          </div>
          <div class="rw-sliding-button selected" tabindex="0">
            <label for="BAR_LATCH_NO">No</label>
            <input type="radio" style="display:none;" id="BAR_LATCH_NO" name="BarLatch" value="no" checked>
          </div>
        </div>
      </div>
      <div id="BAR_LATCH_SIDE_WRAP" style="display:none; align-items:center; gap:8px;">
        <span style="font-size:14px; color:#000; font-weight:700;">Side:</span>
        <div class="combined-button-container">
          <div class="combined-button-container-inner">
            <div class="rw-sliding-button selected" tabindex="0">
              <label for="BAR_LATCH_SIDE_INT">Interior</label>
              <input type="radio" style="display:none;" id="BAR_LATCH_SIDE_INT" name="BarLatchSide" value="interior" checked>
            </div>
            <div class="rw-sliding-button" tabindex="0">
              <label for="BAR_LATCH_SIDE_EXT">Exterior</label>
              <input type="radio" style="display:none;" id="BAR_LATCH_SIDE_EXT" name="BarLatchSide" value="exterior">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-ONE-POINT-LATCH] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">One Point Latch</div>
    <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap; margin-top:6px;">
      <div class="combined-button-container">
        <div class="combined-button-container-inner">
          <div class="rw-sliding-button" tabindex="0">
            <label for="ONE_POINT_LATCH_YES">Yes</label>
            <input type="radio" style="display:none;" id="ONE_POINT_LATCH_YES" name="OnePointLatch" value="yes">
          </div>
          <div class="rw-sliding-button selected" tabindex="0">
            <label for="ONE_POINT_LATCH_NO">No</label>
            <input type="radio" style="display:none;" id="ONE_POINT_LATCH_NO" name="OnePointLatch" value="no" checked>
          </div>
        </div>
      </div>
      <div id="ONE_POINT_LATCH_QTY_WRAP" style="display:none; align-items:center; gap:8px;">
        <span style="font-size:14px; color:#000; font-weight:700;">Qty:</span>
        <div class="combined-button-container">
          <div class="combined-button-container-inner">
            <div class="rw-sliding-button selected" tabindex="0">
              <label for="ONE_POINT_LATCH_QTY_1">1</label>
              <input type="radio" style="display:none;" id="ONE_POINT_LATCH_QTY_1" name="OnePointLatchQty" value="1" checked>
            </div>
            <div class="rw-sliding-button" tabindex="0">
              <label for="ONE_POINT_LATCH_QTY_2">2</label>
              <input type="radio" style="display:none;" id="ONE_POINT_LATCH_QTY_2" name="OnePointLatchQty" value="2">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-OVERLAP-REQUIRED] moved to bottom of Advanced -->
  <div id="overlap_required_section" style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Is Overlap Required</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button" tabindex="0">
          <label for="OVERLAP_REQUIRED_0">Yes</label>
          <input type="radio" style="display:none;" id="OVERLAP_REQUIRED_0" name="OverlapRequired" value="yes">
        </div>
        <div class="rw-sliding-button selected" tabindex="0">
          <label for="OVERLAP_REQUIRED_1">No</label>
          <input type="radio" style="display:none;" id="OVERLAP_REQUIRED_1" name="OverlapRequired" value="no" checked>
        </div>
      </div>
    </div>
    <div style="font-size:12px; color:#555; margin-top:4px; font-style:italic;">Overlap Selection Impact The Drawing Only</div>
    <div id="OVERLAP_NOTE" style="display:none; margin-top:8px; padding:8px 12px; background:#fff8e1; border:1px solid #f0c040; border-left:4px solid #e0a020; color:#7a5a00; font-size:13px; font-weight:600; border-radius:4px;">&#9888; If Yes is selected, the door will be 2&quot; wider than normal width.</div>
  </div>

  <!-- [SO-CSBB] Cable Fail Safety Bottom Brackets (moved to bottom of Advanced) -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Cable Fail Safety Bottom Brackets</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button" tabindex="0" id="CSBB_YES_BTN">
          <label for="CSBB_YES">Yes</label>
          <input type="radio" style="display:none;" id="CSBB_YES" name="CSBB" value="yes">
        </div>
        <div class="rw-sliding-button selected" tabindex="0" id="CSBB_NO_BTN">
          <label for="CSBB_NO">No</label>
          <input type="radio" style="display:none;" id="CSBB_NO" name="CSBB" value="no" checked>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-CSBB-DRHGT] driven by CSBB + Door Height; buttons disabled in JS -->
  <div id="csbb_drhgt_section" style="display:none;">
    <div style="text-align:left" class="config-option-title-style">CSBB Door Height</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button selected" tabindex="0" id="CSBB_DRHGT_NONE_BTN">
          <label for="CSBB_DRHGT_NONE">No CSBB</label>
          <input type="radio" style="display:none;" id="CSBB_DRHGT_NONE" name="CSBBDrHgt" value="no_csbb" checked>
        </div>
        <div class="rw-sliding-button" tabindex="0" id="CSBB_DRHGT_LTE20_BTN">
          <label for="CSBB_DRHGT_LTE20">DHLTE20FT</label>
          <input type="radio" style="display:none;" id="CSBB_DRHGT_LTE20" name="CSBBDrHgt" value="csbb_dhlte20ft">
        </div>
        <div class="rw-sliding-button" tabindex="0" id="CSBB_DRHGT_GT20_BTN">
          <label for="CSBB_DRHGT_GT20">DHGT20</label>
          <input type="radio" style="display:none;" id="CSBB_DRHGT_GT20" name="CSBBDrHgt" value="csbb_dhgt20">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-FENDER-GUARD] dropdown of variants. Filler options for now. -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Fender Guard</div>
    <div class="dimension-layout">
      <div class="rw-button" tabindex="0">
        <label for="FENDER_GUARD_NONE">None</label>
        <input type="radio" id="FENDER_GUARD_NONE" name="FenderGuard" value="none" checked>
      </div>
      <div class="rw-button" tabindex="0">
        <label for="FENDER_GUARD_STD">Std</label>
        <input type="radio" id="FENDER_GUARD_STD" name="FenderGuard" value="std">
      </div>
      <div class="rw-button" tabindex="0">
        <label for="FENDER_GUARD_YELLOW">Yellow</label>
        <input type="radio" id="FENDER_GUARD_YELLOW" name="FenderGuard" value="yellow">
      </div>
    </div>
  </div>

  <!-- [SO-NUM-COUPLINGS] Driven by Hardware-tab Coupler toggle. Coupler=No
       forces 0 (and disables 1/2). Coupler=Yes enables 1/2 and defaults to 1. -->
  <div id="num_couplings_section" style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Number of Couplings</div>
    <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
      <span style="font-size:14px; color:#000; font-weight:700;">Qty:</span>
      <div class="combined-button-container">
        <div class="combined-button-container-inner">
          <div class="rw-sliding-button selected" tabindex="0" id="NUM_COUPLINGS_0_BTN">
            <label for="NUM_COUPLINGS_0">0</label>
            <input type="radio" style="display:none;" id="NUM_COUPLINGS_0" name="NumCouplings" value="0" checked>
          </div>
          <div class="rw-sliding-button" tabindex="0" id="NUM_COUPLINGS_1_BTN">
            <label for="NUM_COUPLINGS_1">1</label>
            <input type="radio" style="display:none;" id="NUM_COUPLINGS_1" name="NumCouplings" value="1">
          </div>
          <div class="rw-sliding-button" tabindex="0" id="NUM_COUPLINGS_2_BTN">
            <label for="NUM_COUPLINGS_2">2</label>
            <input type="radio" style="display:none;" id="NUM_COUPLINGS_2" name="NumCouplings" value="2">
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-SPRING-FAILURE-DEVICE] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Spring Failure Device</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button" tabindex="0">
          <label for="SPRING_FAILURE_DEVICE_YES">Yes</label>
          <input type="radio" style="display:none;" id="SPRING_FAILURE_DEVICE_YES" name="SpringFailureDevice" value="yes">
        </div>
        <div class="rw-sliding-button selected" tabindex="0">
          <label for="SPRING_FAILURE_DEVICE_NO">No</label>
          <input type="radio" style="display:none;" id="SPRING_FAILURE_DEVICE_NO" name="SpringFailureDevice" value="no" checked>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-CABLE-TYPE] Galvanized / Stainless -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Cable Type</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button selected" tabindex="0">
          <label for="CABLE_TYPE_GALV">Galvanized Cable</label>
          <input type="radio" style="display:none;" id="CABLE_TYPE_GALV" name="CableType" value="galvanized" checked>
        </div>
        <div class="rw-sliding-button" tabindex="0">
          <label for="CABLE_TYPE_STAINLESS">Stainless Steel Cable</label>
          <input type="radio" style="display:none;" id="CABLE_TYPE_STAINLESS" name="CableType" value="stainless">
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-THIMBLE-FOR-CABLE] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Thimble For Cable (Tor)</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button" tabindex="0">
          <label for="THIMBLE_FOR_CABLE_YES">Yes</label>
          <input type="radio" style="display:none;" id="THIMBLE_FOR_CABLE_YES" name="ThimbleForCable" value="yes">
        </div>
        <div class="rw-sliding-button selected" tabindex="0">
          <label for="THIMBLE_FOR_CABLE_NO">No</label>
          <input type="radio" style="display:none;" id="THIMBLE_FOR_CABLE_NO" name="ThimbleForCable" value="no" checked>
        </div>
      </div>
    </div>
  </div>
 
  <!-- [SO-GALVANIZED-SPRING] -->
  <div style="margin-top:12px;">
    <div style="text-align:left" class="config-option-title-style">Galvanized Spring</div>
    <div class="combined-button-container">
      <div class="combined-button-container-inner">
        <div class="rw-sliding-button" tabindex="0">
          <label for="GALVANIZED_SPRING_YES">Yes</label>
          <input type="radio" style="display:none;" id="GALVANIZED_SPRING_YES" name="GalvanizedSpring" value="yes">
        </div>
        <div class="rw-sliding-button selected" tabindex="0">
          <label for="GALVANIZED_SPRING_NO">No</label>
          <input type="radio" style="display:none;" id="GALVANIZED_SPRING_NO" name="GalvanizedSpring" value="no" checked>
        </div>
      </div>
    </div>
  </div>

  <!-- [SO-WEIGHT-MODIFIER] Weight Modifier subsection. Inline label-value pairs
       separated by a pipe; slider drives the Modify delta. New = Current + Modify. -->
  <div id="weight_modifier_section" class="weight-modifier">
    <div class="weight-modifier-title">Weight Modifier</div>
    <div class="weight-modifier-summary">
      <span class="weight-modifier-stat">Current (lbs) : <span id="CURRENT_SPRINGING_WEIGHT">0</span></span>
      <span class="weight-modifier-divider">|</span>
      <span class="weight-modifier-stat">Modify (lbs) : <span id="MODIFY_SPRINGING_WEIGHT_VALUE">0</span></span>
      <span class="weight-modifier-divider">|</span>
      <span class="weight-modifier-stat weight-modifier-stat--result">New Adjusted (lbs) : <span id="NEW_ADJUSTED_SPRINGING_WEIGHT">0</span></span>
    </div>
    <input type="range" id="MODIFY_SPRINGING_WEIGHT" name="ModifySpringingWeight"
           class="range-slider weight-modifier-slider" min="-100" max="100" step="1" value="0">
  </div>

</section>

    <!-- ============================================================
         SECTION: OPERATOR_OPTIONS — opener selection + accessories
         ============================================================ -->
    <section face="false" hardware="true" enabled="true" id="OPERATOR_OPTIONS" title="Operator"
      class="rw-configurator__page">



	 <!-- [OP-CAROUSEL] opener carousel populated by JS, with prev/next chevrons -->
	 <div class="operator-carousel-outer">
	   <div class="operator-group-container">
		 <h2>Operation</h2>
		 <input type="hidden" name="OPERATOR" id="OPERATOR" value="" data-max-door-height="" data-is-hi-lift-compatible=""/>
		 <div class="carousel-container-slide">
			<div id="operator-carousel-container"></div>
	 	 </div>
		
		 <div id="nextButtonOperator" class="next-button-carousel">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="chevron-icon-next">
    				<path d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
  	  		</svg>
		 </div>
		 <div id="prevButtonOperator" class="prev-button-carousel">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="chevron-icon-prev">
    				<path d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"/>
  	  		</svg>
		 </div>
	   </div>
	 </div>



      <!-- [OP-TRANSMITTER] additional transmitter accessory + qty -->
      <div class="rw-image-input">
		<a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">
		  <img id="ADDITIONAL_TRANSMITTER_IMAGE" class="rw-image-input-img"
		    href="https://www.rwdoors.com/liftmaster/" />
		  <div class="overlay"></div>
        	</a>
		<div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_TRANSMITTER" class="config-option-label-style">Additional Transmitter</h3>
		    <select id="ADDITIONAL_TRANSMITTER" style="width:75%" name="ADDITIONAL_TRANSMITTER"
			onchange="operatorImageOnChangeStilo(this)">
			 <option value=NONE selected img="" smartpartnum=>NONE</option>
			 <option value=952-232 img="L991S-(952-230)_E-Cat.png" smartpartnum=952-232>L993M</option>
			 <option value=952-233 img="L993S-(952-233)_E-Cat.png" smartpartnum=952-233>L993S</option>
			 <option value=952-231 img="L992U-(952-231)_E-Cat.png" smartpartnum=952-231>L992U</option>
			 <option value=952-229 img="L932M-(952-229)_E-Cat.png" smartpartnum=952-229>L932M</option>
			 <option value=952-230 img="L991S-(952-230)_E-Cat.png" smartpartnum=952-230>L991S</option>
		    </select>
		  </div>
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_TRANSMITTER_QTY" class="config-option-label-style">Qty</h3>
		    <select id="ADDITIONAL_TRANSMITTER_QTY"  name="ADDITIONAL_TRANSMITTER_QTY" style="min-width: 50px;">
			 <option value="0" selected>0</option>
			 <option value="1">1</option>
			 <option value="2">2</option>
			 <option value="3">3</option>
			 <option value="4">4</option>
		    </select>
		  </div>
        </div>

      </div>

      <!-- [OP-CONTROL-PANEL] additional control panel accessory + qty -->
      <div class="rw-image-input">
		<a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">

		  <img class="rw-image-input-img" id="ADDITIONAL_CONTROL_PANEL_IMAGE" href="https://www.rwdoors.com/liftmaster/">
		  <div class="overlay"></div>
        	</a>
		<div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_CONTROL_PANEL" class="config-option-label-style">Additional Control Panel</h3>
		    <select id="ADDITIONAL_CONTROL_PANEL" style="width:75%" name="ADDITIONAL_CONTROL_PANEL"
			 onchange="operatorImageOnChangeStilo(this)">
			 <option value=NONE img="" selected smartpartnum=>None</option>
			 <option value=952-227 img="L957W (952-227)_E-Cat.png" smartpartnum=952-227>L957W</option>
			 <option value=952-228 img="L958W-(952-228)_E-Cat.png" smartpartnum=952-228>L958W</option>
			 <option value=952-225 img="L955W-(952-225)_E-Cat.png" smartpartnum=952-225>L955W</option>
			 <option value=952-226 img="L956W-(952-226)_E-Cat.png" smartpartnum=952-226>L956W</option>
		    </select>
		  </div>
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_CONTROL_PANEL_QTY" class="config-option-label-style">Qty</h3>
		    <select id="ADDITIONAL_CONTROL_PANEL_QTY"  name="ADDITIONAL_CONTROL_PANEL_QTY"  style="min-width: 50px;">
			 <option value="0" selected>0</option>
			 <option value="1">1</option>
			 <option value="2">2</option>
		    </select>
		  </div>
		</div>
      </div>
      <!-- [OP-KEYLESS] additional keyless entry accessory + qty -->
      <div class="rw-image-input">
		<a href="https://www.rwdoors.com/liftmaster/" target="_blank" rel="noopener noreferrer">
          	<img class="rw-image-input-img" id="ADDITIONAL_KEYLESS_ENTRY_IMAGE"
            	href="https://www.rwdoors.com/liftmaster/">
          	<div class="overlay"></div>

        	</a>
		<div class="horizontal-inputs horizontal-inputs--quantity" style="width:75%;">
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_KEYLESS_ENTRY" class="config-option-label-style">Additional Keyless Entry</h3>
		    <select id="ADDITIONAL_KEYLESS_ENTRY" style="width:75%" name="ADDITIONAL_KEYLESS_ENTRY"
			 onchange="operatorImageOnChangeStilo(this)">
			 <option value=NONE img="" selected smartpartnum=>None</option>
			 <option value=952-234 img="L979M-(952-234)_E-Cat.png" smartpartnum=952-234>L979M</option>
			 <option value=952-235 img="L979S-(952-235)_E-Cat.png" smartpartnum=952-235>L979S</option>
			 <option value=952-236 img="L979U-(952-236)_E-Cat.png" smartpartnum=952-236>L979U</option>
		    </select>
		  </div>
		  <div class="image-input-cell">
		    <h3 for="ADDITIONAL_KEYLESS_ENTRY_QTY" class="config-option-label-style">Qty</h3>
		    <select id="ADDITIONAL_KEYLESS_ENTRY_QTY"  name="ADDITIONAL_KEYLESS_ENTRY_QTY"  style="min-width: 50px;">
			 <option value="0" selected>0</option>
			 <option value="1">1</option>
			 <option value="2">2</option>
			 <option value="3">3</option>
		    </select>
		  </div>
        </div>
      </div>
	<!-- [OP-BRACKET] operator bracket dropdown -->
	<h3 for="OPERATOR_BRACKET" class="config-option-label-style">Operator Bracket</h3>
      <select id="OPERATOR_BRACKET" name="OPERATOR_BRACKET">
        <option value="NONE"  selected>None</option>
        <option value="7-2381" >Adjustable Operator Bracket</option>
      </select>
    </section>
    <!-- ============================================================
         SECTION: ANNOTATIONS — text-input metadata (tag, contractor, etc.)
         ============================================================ -->
    <section face="true" hardware="true" enabled="true" id="ANNOTATIONS" title="Annotations"
      class="rw-configurator__page annotations-container-box">
	 <div class="config-title-style">Annotations</div>
	 <div class="hardware-container-inputs">
	 <div class="inputs-container-padding">
      <h3 for="TAG" class="config-option-label-style config-option-label-padding">Tag</h3>
      <input type="text" name="TAG" id="TAG" placeholder="Tag" />
	 </div>
	 <div class="inputs-container-padding">
      <h3 for="CONTRACTOR" class="config-option-label-style config-option-label-padding">Contractor</h3>
      <input type="text" name="CONTRACTOR" id="CONTRACTOR" placeholder="Contractor" />
	 </div>
	 <div class="inputs-container-padding">
      <h3 for="ARCHITECT" class="config-option-label-style config-option-label-padding">Architect</h3>
      <input type="text" name="ARCHITECT" id="ARCHITECT" placeholder="Architect" />
	 </div>
	 <div class="inputs-container-padding">
      <h3 for="REFERENCE" class="config-option-label-style config-option-label-padding">Reference / Project #</h3>
      <input type="text" name="REFERENCE" id="REFERENCE" placeholder="Reference / Project #" />
	 </div>
	 <div class="inputs-container-padding">
      <h3 for="CLIENT" class="config-option-label-style config-option-label-padding">Client</h3>
      <input type="text" name="CLIENT" id="CLIENT" placeholder="Client" />
	 </div>
	 </div>
    </section>
<!-- ============================================================
     FOOTER — Back / Configure / Next + Save/Restore Defaults
     ============================================================ -->
<!-- [FOOTER-NAV] page navigation buttons -->
<div class="footer-buttons-group">
<div id="NEXT_PAGE_BUTTONS">
    <button class="button-nextpage" id="BACK_BTN" onclick="formBackward()">
      <div class="chevron-outer-container" style="left:10px; right:auto;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path fill="currentColor" d="M169.4 297.4C156.9 309.9 156.9 330.2 169.4 342.7L361.4 534.7C373.9 547.2 394.2 547.2 406.7 534.7C419.2 522.2 419.2 501.9 406.7 489.4L237.3 320L406.6 150.6C419.1 138.1 419.1 117.8 406.6 105.3C394.1 92.8 373.8 92.8 361.3 105.3L169.3 297.3z"/>
        </svg>
      </div>
      Back
    </button>
    <button type="button" id="CONFIGURE_BTN" name="nextPageBtn" class="button-configure" onclick="nextPage()" data-qa-selector="continue">Configure</button>
    <button class="button-nextpage" onclick="formForward()">
      Next
      <div class="chevron-outer-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path fill="currentColor" d="M471.1 297.4C483.6 309.9 483.6 330.2 471.1 342.7L279.1 534.7C266.6 547.2 246.3 547.2 233.8 534.7C221.3 522.2 221.3 501.9 233.8 489.4L403.2 320L233.9 150.6C221.4 138.1 221.4 117.8 233.9 105.3C246.4 92.8 266.7 92.8 279.2 105.3L471.2 297.3z"/>
        </svg>
      </div>
    </button>
    <span id="ERROR_MESSAGE" class="rw-text rw-warning" style="display: none;"></span>
</div>
  <!-- [DEFAULTS] save / restore default configuration -->
  <div id="DEFAULTS_PLUGIN">
    <div style="display:flex;justify-content:space-between;width:100%">
      <button onclick="saveDefaults()" class="defaults-button">Save as Default</button>
      <button type="CONTAINER" id="LOAD_DEFAULTS" class="defaults-button">Restore Default</button>
    </div>
  </div>
</div>


</div>

</div>
</div>
`; //At least one input needs to be loaded in initially to get the title.

    // [JS-APPEND] mount the form, hide JDE-related containers
    $("#ROOT_0").hide();
    //Hides the outputs
    $("#accordion1406547076").hide();
    //Hides the global data for JDE
    $("#accordion1094153584").hide();
    //Here is where we add the HTML
    $(".concept-ui-form.scrollable").append(form);
    $(".concept-ui-form.scrollable").removeClass("concept-ui-form scrollable");

    //loadWeightNodes()

    // [JS-RADIO-STYLE] highlight radio groups (COLOR/TEMPERED have their own).
    // Uses a `btn-checked` class, not inline styles, so applyDefaults' synthetic
    // clicks don't leave stale backgrounds on multiple radios in a group.
    function syncRadioGroupHighlight(groupName) {
        $(`input[type='radio'][name='${groupName}']`).each((i, radio) => {
            const $parent = $(radio).closest(".rw-button");
            $parent.toggleClass("btn-checked", !!radio.checked);
        });
    }
    $(document).on("click change", "div.rw-configurator__layout input[type='radio']", function(e) {
        const target = e.target;
        if (target.name === "COLOR" || target.name === "TEMPERED") return;
        syncRadioGroupHighlight(target.getAttribute("name"));
    });
    // Clicks on .rw-button padding (outside the label) don't trigger the radio —
    // forward them to the inner radio.
    $(document).on("click", "div.rw-configurator__layout .rw-button", function(e) {
        if ($(e.target).is("input,label")) return; // already handled by native label/input
        const $input = $(this).find("input[type='radio']").first();
        if (!$input.length || $input.is(":checked") || $input.prop("disabled")) return;
        $input.prop("checked", true).trigger("change");
    });
    // Initial sync for any radios already on the page when the form loads.
    setTimeout(() => {
        const groups = new Set();
        $("div.rw-configurator__layout input[type='radio']").each((i, r) => {
            if (r.name && r.name !== "COLOR" && r.name !== "TEMPERED") groups.add(r.name);
        });
        groups.forEach(syncRadioGroupHighlight);
    }, 0);

    // [JS-SLIDING-BUTTON] selected class sync for combined-button-container radios
    window.syncSlidingButtonGroup = function(groupName) {
        $(`input[type='radio'][name='${groupName}']`).each((i, radio) => {
            $(radio).closest(".rw-sliding-button").toggleClass("selected", !!radio.checked);
        });
    };
    var syncSlidingButtonGroup = window.syncSlidingButtonGroup;
    function syncAllSlidingGroups() {
        const groups = new Set();
        $(".combined-button-container input[type='radio']").each((i, r) => {
            if (r.name) groups.add(r.name);
        });
        groups.forEach(syncSlidingButtonGroup);
    }
    window.syncAllSlidingGroups = syncAllSlidingGroups;
    $(document).on("click change", ".combined-button-container input[type='radio']", function() {
        syncSlidingButtonGroup(this.name);
    });
    $(document).on("click", ".rw-sliding-button", function(e) {
        if ($(e.target).is("input,label")) return;
        const $input = $(this).find("input[type='radio']").first();
        if (!$input.length || $input.is(":checked") || $input.prop("disabled")) return;
        $input.prop("checked", true).trigger("change");
    });
    setTimeout(syncAllSlidingGroups, 0);
    setTimeout(syncAllSlidingGroups, 200);
    setTimeout(syncAllSlidingGroups, 800);
    // [JS-COLOR-CLICK] clicking a color circle forwards to its inner radio
    $("div.color-button").click((e) => {
        $(e.target).find("input[type='radio']").trigger("click");
    });
    //$("#DIMENSIONS input").click(getSpringSolutions)

    //The save button isn't compatible with a single page configurator
    $("div.button-set.button-2.location-border button")[0].remove();
    //$("button[onclick='nextPage()']").text("Configure");

    //Adding indicies to sections
    $("#configurator section").each((index, e) => {
        e.setAttribute("index", index);
    });

    setTimeout(() => {
        $("#configurator section").each((_, e) => {
            e.removeAttribute("title");
        });
    }, 0);

    $(`#collapse1159850199`).remove();
    $(`#section_select`).on("change", (evt) => {
        showSection(Number(evt.target.value));
    });

    // [PERF-DEBUG] tiny timing helper — logs how long a labelled step takes.
    window.__perf = function(label, fn) {
        const t0 = performance.now();
        const r = fn();
        const dt = performance.now() - t0;
        console.log(`[perf] ${label}: ${dt.toFixed(1)}ms`);
        return r;
    };

    //Load the caching system.
    __perf("rw_init", () => rw_init("configurator"));
    __perf("loadDrivenInputEvents", () => loadDrivenInputEvents());
    __perf("loadGlobalNodes", () => loadGlobalNodes());
    __perf("loadTrussStyleLogic", () => loadTrussStyleLogic());
    // Registers the BOM-feeding section-bundle nodes. Must run after rw_init so
    // addLogic/nodeset exist.
    __perf("addSectionBundleDrivers (registers ~186 nodes)", () => addSectionBundleDrivers());
    console.log(`[perf] total nodes registered: ${Object.keys(nodeset || {}).length}`);
    setTimeout(() => {
        if (typeof getNode === "function" && nodeset?.["T_DOOR_MODEL"]) {
            __perf("initial rw(T_DOOR_MODEL) walk", () => rw(getNode("T_DOOR_MODEL")));
        }
    }, 0);
    // Part#/desc nodes depend only on DOOR_MODEL, so they compute once at load
    // (before applyDefaults' async AJAX settles the real model) and go stale.
    // Refresh after defaults land. NUM_OF_SEC must be derived from the loaded
    // HEIGHT before bundles recompute, else resolveSectionHeights misses the
    // section-count-keyed chart and falls back to wrong arithmetic.
    const _settleBundles = () => {
        // Push SIZE + dimension leaves first: on load HEIGHT can be left at the 7'
        // default (the SIZE walk didn't propagate), giving a wrong chart lookup.
        if (nodeset?.["SIZE"]) nodeset["SIZE"].value = $("input[name='SIZE']:checked").val();
        ["SIZE_HEIGHT", "SIZE_WIDTH", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES", "WIDTH", "HEIGHT"].forEach(id => {
            if (typeof getNode === "function" && nodeset?.[id]) rw(getNode(id));
        });
        if (typeof renderNumOfSections === "function") renderNumOfSections();
        if (typeof refreshAllBundleDescs === "function") refreshAllBundleDescs();
    };
    setTimeout(_settleBundles, 600);
    setTimeout(_settleBundles, 1500);
    //loadTrussSchedule();
    //loadPriceDrivers();
  // [DIMENSIONS-SOURCE-OF-TRUTH] One resolver for the selected size so summary,
  // canvas, end-caps, and section-count readers can't drift. Custom reads CUSTOM_*;
  // preset reads the checked SIZE radio's own attrs. A missing inches attr is 0 — it
  // must NOT fall through to the DOOR_*_INCHES nodes (they lag a click behind, which
  // rendered 14'0" as 14'2" after a custom→preset swap). Returns raw numbers; callers
  // apply their own "nothing selected" fallback.
  window.getCurrentDimensions = function getCurrentDimensions() {
	 if ($("#custom_dimensions").is(":checked")) {
		return {
			custom: true,
			wFt: parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0,
			wIn: parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0,
			hFt: parseInt($("#CUSTOM_HEIGHT_FEET").val()) || 0,
			hIn: parseInt($("#CUSTOM_HEIGHT_INCHES").val()) || 0,
			frac: Number($("#CUSTOM_WIDTH_FRACTION").val()) || 0,
		};
	 }
	 const $sz = $("input[name='SIZE']:checked");
	 return {
		custom: false,
		hasSelection: $sz.length > 0,
		wFt: Number($sz.attr("width")) || 0,
		wIn: Number($sz.attr("widthInches")) || 0,
		hFt: Number($sz.attr("height")) || 0,
		hIn: Number($sz.attr("heightInches")) || 0,
		frac: 0,
	 };
  };
  var getCurrentDimensions = window.getCurrentDimensions;

  async function redrawCanvas() {
	 const d = getCurrentDimensions();
	 let widthInches, heightInches;
	 if (d.custom) {
		// Preserve prior behaviour: empty custom fields fall back to 96"/84".
		widthInches = (d.wFt * 12 + d.wIn) || 96;
		heightInches = (d.hFt * 12 + d.hIn) || 84;
	 } else {
		// Preserve prior preset defaults of 8' width / 7' height when unset.
		widthInches = (d.wFt || 8) * 12 + d.wIn;
		heightInches = (d.hFt || 7) * 12 + d.hIn;
	 }

	 const pattern = $("input[name='Pattern']:checked").val() || "Standard Rib";

	 const selectedColor = $("input[name='COLOR']:checked");
	 const color = selectedColor.attr("hex") || "#654321";

	 const numSections = parseInt($("#NUM_OF_SEC").val()) || 4;

	 await CANVAS_PLUGIN.drawThermatiteDoor({
		dimensions: {
		    widthInches,
		    heightInches,
		    numSections,
		    scale: 1
		},
		background: {
		    pattern: pattern,
		    color: color
		},
		glazing: {
		    width: 0,
		    height: 0,
		    numLites: 0,
		    material: "none",
		    spacing: "center",
		    distanceFromEdge: 5,
		    frameColor: "black",
		    liteType: ""
		},
		misc: { labels: true }
	 });
  }
setTimeout(async () => await redrawCanvas(), 500);

// ===== [COLOUR-PER-MODEL] dynamic colour swatches keyed by DOOR_MODEL =====
const COLOR_DEFS = {
    white:      { desc: "White",      hex: "#FFF",    weight: 2.2 },
    brown:      { desc: "Brown",      hex: "#654321", weight: 2.2 },
    silver:     { desc: "Silver",     hex: "#C0C0C0", weight: 2.2 },
    bronze:     { desc: "Bronze",     hex: "#7B5E3C", weight: 2.2 },
    slate_grey: { desc: "Slate Grey", hex: "#708090", weight: 2.2 },
    iron_ore:   { desc: "Iron Ore",   hex: "#43464B", weight: 2.2 },
    black:      { desc: "Black",      hex: "#000000", weight: 2.2 },
    sandstone:  { desc: "Sandstone",  hex: "#D2B48C", weight: 2.2 },
    almond:     { desc: "Almond",     hex: "#EFDECD", weight: 2.2 },
    cafe:       { desc: "Cafe",       hex: "#4B3621", weight: 2.2 }
};

const MODEL_COLORS = {
    "T150":    ["white", "brown"],
    "T175":    ["white", "brown", "silver"],
    "T200":    ["white"],
    "T300":    ["white"],
    "T200-20": ["white"],
    "T200C":   ["brown", "bronze", "slate_grey", "iron_ore", "black", "sandstone", "almond", "cafe"],
    "T150U":   ["white"],
    "T175U":   ["white"],
    "T200U":   ["white"],
    "U200C":   ["white", "brown", "bronze", "slate_grey", "iron_ore", "black", "sandstone", "almond", "cafe"]
};

// Memory of last-selected swatch per group, reset on model change.
let colorGroupMemory = { primary: null, secondary: null };

function colorSwatchHTML(colorKey, isChecked) {
    const def = COLOR_DEFS[colorKey];
    if (!def) return "";
    const id = "COLOR_" + colorKey;
    const checkedAttr = isChecked ? " checked" : "";
    return `
        <div class="color-button-container" data-color-key="${colorKey}" title="">
            <div class="color-button" style="background:${def.hex};" data-tooltip="${def.desc}" title="">
                <label class="rw-text door-color-text" for="${id}" title="">${def.desc}</label>
                <input type="radio" style="display:none;" id="${id}" weight="${def.weight}" name="COLOR" value="${colorKey}" desc="${def.desc}" hex="${def.hex}"${checkedAttr}>
            </div>
        </div>`;
}

function renderColorRow() {
    const model = $("input[name='DOOR_MODEL']:checked").val() || "T175";
    const list = MODEL_COLORS[model] || ["white"];
    const previouslySelected = $("input[name='COLOR']:checked").val();

    const primary = list.slice(0, 4);
    const secondary = list.slice(4);

    // Decide selection: keep the previously selected colour if it still exists, otherwise first.
    const selected = list.includes(previouslySelected) ? previouslySelected : list[0];
    const selectedInPrimary = primary.includes(selected);

    colorGroupMemory = {
        primary: selectedInPrimary ? selected : primary[0],
        secondary: secondary.length ? (selectedInPrimary ? secondary[0] : selected) : null
    };

    const $row = $("#COLOR_ROW");
    $row.empty();

    if (secondary.length === 0) {
        // Simple case: render all swatches inline, no groups.
        primary.forEach(key => $row.append(colorSwatchHTML(key, key === selected)));
    } else {
        const expandedGroup = selectedInPrimary ? "primary" : "secondary";
        const primaryHTML = primary.map(key => colorSwatchHTML(key, key === selected)).join("");
        const secondaryHTML = secondary.map(key => colorSwatchHTML(key, key === selected)).join("");

        $row.append(`
            <div class="color-group color-group--primary ${expandedGroup === "primary" ? "expanded" : "collapsed"}" data-group="primary">
                ${primaryHTML}
            </div>
            <div class="color-divider"></div>
            <div class="color-group color-group--secondary ${expandedGroup === "secondary" ? "expanded" : "collapsed"}" data-group="secondary">
                ${secondaryHTML}
            </div>
        `);
    }

    updateColorSelectionStyling();
}

function updateColorSelectionStyling() {
    $(".color-button-container").removeClass("selected");
    $(".door-color-text").removeClass("selected");
    const $selected = $("input[name='COLOR']:checked");
    $selected.closest(".color-button-container").addClass("selected");
    $selected.siblings(".door-color-text").addClass("selected");
}

// Click on a collapsed group: expand it, collapse the other, select that group's
// remembered colour (or its first swatch if none).
$(document).on("click", "#COLOR_ROW .color-group.collapsed", function(e) {
    e.stopPropagation();
    const group = $(this).data("group");
    const otherGroup = group === "primary" ? "secondary" : "primary";
    $(`#COLOR_ROW .color-group--${group}`).removeClass("collapsed").addClass("expanded");
    $(`#COLOR_ROW .color-group--${otherGroup}`).removeClass("expanded").addClass("collapsed");

    const targetKey = colorGroupMemory[group] || $(this).find(".color-button-container").first().data("color-key");
    if (targetKey) {
        selectColor(targetKey);
    }
});

// Click on a swatch → select that colour. Delegated so it works for dynamically
// rendered swatches. Skips containers inside a collapsed group (those are
// handled by the group-level click handler above).
$(document).on("click", "#COLOR_ROW .color-button-container", function(e) {
    if ($(this).closest(".color-group.collapsed").length) return;
    e.stopPropagation();
    const key = $(this).data("color-key");
    if (key) selectColor(key);
});

function selectColor(key) {
    const $input = $("#COLOR_" + key);
    if (!$input.length) return;
    $("input[name='COLOR']").prop("checked", false);
    $input.prop("checked", true);
    $input.trigger("change");
}

// Track last-selected per group whenever the user picks a colour.
$(document).on("change", "input[name='COLOR']", function() {
    const key = $(this).val();
    const $group = $(this).closest(".color-group");
    if ($group.length) {
        const groupName = $group.data("group");
        colorGroupMemory[groupName] = key;
    }
    updateColorSelectionStyling();
});

// ===== [PATTERN-PER-MODEL] dynamic pattern buttons keyed by DOOR_MODEL =====
const MODEL_PATTERNS = {
    "T150":    ["Standard Rib", "Multi Rib", "Raynor Profile"],
    "T175":    ["Standard Rib", "Multi Rib", "Raynor Profile"],
    "T200":    ["Standard Rib", "Multi Rib", "Raynor Profile"],
    "T300":    ["Standard Rib", "Multi Rib", "Raynor Profile"],
    "T200-20": ["Flush"],
    "T200C":   ["Standard Rib", "Multi Rib"],
    "T150U":   ["Standard Rib"],
    "T175U":   ["Standard Rib"],
    "T200U":   ["Standard Rib"],
    "U200C":   ["Plank"]
};

function renderPatternRow() {
    const model = $("input[name='DOOR_MODEL']:checked").val() || "T175";
    const list = MODEL_PATTERNS[model] || ["Standard Rib"];
    const previouslySelected = $("input[name='Pattern']:checked").val();
    const selected = list.includes(previouslySelected) ? previouslySelected : list[0];

    const $row = $("#PATTERN_ROW");
    $row.empty();
    list.forEach((pattern, i) => {
        const id = "PATTERN_" + i;
        const isChecked = pattern === selected;
        const checkedAttr = isChecked ? " checked" : "";
        const btnClass = isChecked ? "rw-button btn-checked" : "rw-button";
        $row.append(`
            <div class="${btnClass}" tabindex="0">
                <label for="${id}">${pattern}</label>
                <input type="radio" style="display:none;" id="${id}" name="Pattern" value="${pattern}"${checkedAttr}>
            </div>
        `);
    });
    // Notify downstream listeners (canvas redraw, etc.) that the pattern selection changed.
    $row.find("input[name='Pattern']:checked").trigger("change");
}

// Re-render colour + pattern rows when door model changes.
$(document).on("change", "input[name='DOOR_MODEL']", function() {
    renderColorRow();
    renderPatternRow();
    renderEndCaps();
    redrawCanvas();
    if (typeof getNode === "function" && nodeset?.["T_DOOR_MODEL"]) rw(getNode("T_DOOR_MODEL"));
    // Part#s/descs depend on DOOR_MODEL but aren't always reached by the model
    // change-walk (e.g. after applyDefaults). Refresh them explicitly.
    refreshAllBundleDescs();
});

// ===== [ENDCAPS-PER-MODEL] availability of single/double end caps by model + total width inches.
// Each rule: [minInches, maxInches, options]. Options: ["single","double"], ["double"], or [].
const MODEL_ENDCAP_RULES = {
    "T150":    [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T175":    [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T200":    [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T300":    [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T200-20": [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T200C":   [[48, 195, ["single", "double"]], [196, 386, ["double"]], [387, 458, []]],
    "T150U":   [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T175U":   [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "T200U":   [[48, 195, ["single", "double"]], [196, 458, ["double"]]],
    "U200C":   [[48, 195, ["single", "double"]], [196, 386, ["double"]], [387, 458, []]]
};

function getCurrentWidthInches() {
    const d = window.getCurrentDimensions();
    // Custom: feet*12 + inches. Preset: feet*12 only (inches never counted here),
    // default 8' when unset.
    if (d.custom) return d.wFt * 12 + d.wIn;
    return (d.wFt || 8) * 12;
}

function getAllowedEndCaps(model, widthInches) {
    const rules = MODEL_ENDCAP_RULES[model];
    if (!rules) return ["single", "double"];
    for (const [min, max, opts] of rules) {
        if (widthInches >= min && widthInches <= max) return opts;
    }
    return [];
}

function renderEndCaps() {
    const model = $("input[name='DOOR_MODEL']:checked").val() || "T150";
    const width = getCurrentWidthInches();
    const allowed = getAllowedEndCaps(model, width);

    const $single = $("#ENDCAPS_0");
    const $double = $("#ENDCAPS_1");
    const $singleBtn = $("#ENDCAPS_0_BTN");
    const $doubleBtn = $("#ENDCAPS_1_BTN");
    const $unavailable = $("#END_CAPS_UNAVAILABLE");

    const singleOk = allowed.includes("single");
    const doubleOk = allowed.includes("double");

    $single.prop("disabled", !singleOk);
    $double.prop("disabled", !doubleOk);
    $singleBtn.toggle(singleOk);
    $doubleBtn.toggle(doubleOk);

    if (allowed.length === 0) {
        $unavailable.show();
        $single.prop("checked", false);
        $double.prop("checked", false);
        return;
    }
    $unavailable.hide();

    // If currently selected option is no longer allowed, fall back to the first allowed option.
    if ($single.is(":checked") && !singleOk) {
        $double.prop("checked", true).trigger("change");
    } else if ($double.is(":checked") && !doubleOk) {
        $single.prop("checked", true).trigger("change");
    } else if (!$single.is(":checked") && !$double.is(":checked")) {
        if (singleOk) $single.prop("checked", true).trigger("change");
        else if (doubleOk) $double.prop("checked", true).trigger("change");
    }
    if (typeof syncSlidingButtonGroup === "function") syncSlidingButtonGroup("EndCaps");
}

// Re-render end caps when width-affecting inputs change.
let _endCapsTimer = null;
$(document).on("change", "#CUSTOM_WIDTH_FEET, #CUSTOM_WIDTH_INCHES, input[name='SIZE'], #custom_dimensions", function() {
    if (_endCapsTimer) clearTimeout(_endCapsTimer);
    _endCapsTimer = setTimeout(() => {
        _endCapsTimer = null;
        renderEndCaps();
    }, 80);
});

$(function() { renderEndCaps(); });

// ===== [SECTIONS-PER-HEIGHT] valid section counts keyed by door height in feet.
const HEIGHT_SECTIONS = {
    4:  [2],
    5:  [3],
    6:  [3],
    7:  [4],
    8:  [4],
    9:  [5],
    10: [5],
    11: [6],
    12: [6],
    13: [7],
    14: [7],
    15: [8],
    16: [8],
    17: [9],
    18: [9],
    19: [10],
    20: [10],
    21: [11],
    22: [11],
    23: [12],
    24: [12],
    25: [13],
    26: [13],
    27: [14],
    28: [14],
    29: [15],
    30: [15],
    31: [16],
    32: [16]
};

function getCurrentHeightFeet() {
    const d = window.getCurrentDimensions();
    return d.hFt || 8;   // default 8' when unset, as before (both paths)
}

function renderNumOfSections() {
    const sel = document.getElementById("NUM_OF_SEC");
    if (!sel) return;

    const hFt = getCurrentHeightFeet();
    // The stack chart's primary row decides the section count (one per height);
    // fall back to the HEIGHT_SECTIONS table only if the chart has no entry.
    let allowed;
    if (typeof getChartNumSections === "function") {
        const n = getChartNumSections(hFt * 12);
        allowed = n ? [n] : (HEIGHT_SECTIONS[hFt] || [4]);
    } else {
        allowed = HEIGHT_SECTIONS[hFt] || [4];
    }
    const selected = allowed[0];

    // Rebuild options only if the allowed set changed, and touch raw DOM without
    // dispatching: a jQuery empty/append/val emits change events that trigger a
    // second full node walk. Sync the node value in code instead.
    const current = Array.from(sel.options).map(o => Number(o.value));
    const sameOptions = current.length === allowed.length && current.every((v, i) => v === allowed[i]);
    if (!sameOptions) {
        sel.innerHTML = allowed.map(n => `<option value="${n}">${n}</option>`).join("");
    }
    if (sel.value !== String(selected)) sel.value = String(selected);

    if (nodeset?.["NUM_OF_SEC"]) nodeset["NUM_OF_SEC"].value = selected;
}

let _numOfSecTimer = null;
$(document).on("change", "#CUSTOM_HEIGHT_FEET, input[name='SIZE']", function() {
    if (_numOfSecTimer) clearTimeout(_numOfSecTimer);
    _numOfSecTimer = setTimeout(() => {
        _numOfSecTimer = null;
        // Push the dimension leaves for the current selection before rebuilding
        // sections/bundles. The framework's SIZE walk is async, so recomputing
        // first left the BOM one selection behind.
        if (nodeset?.["SIZE"]) nodeset["SIZE"].value = $("input[name='SIZE']:checked").val();
        ["SIZE_HEIGHT", "SIZE_WIDTH", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES", "WIDTH", "HEIGHT"].forEach(id => {
            if (typeof getNode === "function" && nodeset?.[id]) rw(getNode(id));
        });
        // NUM_OF_SEC must be current before bundles recompute (it's keyed on
        // HEIGHT|NUM_OF_SEC), else the recompute reads the previous section count.
        renderNumOfSections();
        if (typeof invalidateSectionHeightsCache === "function") invalidateSectionHeightsCache();
        if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
        if (typeof refreshAllBundleDescs === "function") refreshAllBundleDescs();
        // RENDER node isn't registered, so redraw explicitly — exactly once.
        redrawCanvas();
    }, 80);
});

$(document).on("change", "#NUM_OF_SEC", function() {
    if (!$(this).val()) renderNumOfSections();
    if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
        CANVAS_PLUGIN.redrawFromCurrentForm();
    }
});

$(document).on("change", "#custom_dimensions", function() {
    renderNumOfSections();
    // renderNumOfSections() no longer fires #NUM_OF_SEC's handler, so redraw here.
    if (typeof CANVAS_PLUGIN?.redrawFromCurrentForm === "function") {
        CANVAS_PLUGIN.redrawFromCurrentForm();
    }
});

setTimeout(() => { renderColorRow(); renderPatternRow(); renderNumOfSections(); }, 0);
setTimeout(renderNumOfSections, 200);
setTimeout(renderNumOfSections, 1000);

// No custom SIZE click handler: the radio's native `change` fires the framework's
// SIZE walk, which recomputes everything. A manual rw()-per-node pass here would
// re-run the whole node walk — the source of the multi-second lag.

let _customDimsCascadeTimer = null;
$(document).on("change", "#CUSTOM_WIDTH_FEET, #CUSTOM_WIDTH_INCHES, #CUSTOM_WIDTH_FRACTION, #CUSTOM_HEIGHT_FEET, #CUSTOM_HEIGHT_INCHES, #custom_dimensions", function() {
    if (_customDimsCascadeTimer) clearTimeout(_customDimsCascadeTimer);
    _customDimsCascadeTimer = setTimeout(() => {
        _customDimsCascadeTimer = null;
        console.log("%c[CUSTOM-DIMS] change", "color:#06c;font-weight:bold");
        const tAll = performance.now();
        // Push leaf values; framework's dep chain handles the section-bundle fan-out from there.
        ["DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_WIDTH_FRACTION", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES"].forEach(id => {
            if (typeof getNode === "function" && nodeset?.[id]) {
                __perf(`  CUSTOM rw(${id})`, () => rw(getNode(id)));
            }
        });
        if (typeof getNode === "function" && nodeset?.["WIDTH"]) __perf("  CUSTOM rw(WIDTH)", () => rw(getNode("WIDTH")));
        if (typeof getNode === "function" && nodeset?.["HEIGHT"]) __perf("  CUSTOM rw(HEIGHT)", () => rw(getNode("HEIGHT")));
        renderNumOfSections();
        console.log("[CUSTOM-DIMS DEBUG] custom?", $("#custom_dimensions").is(":checked"),
            "| DOM h_ft:", $("#CUSTOM_HEIGHT_FEET").val(), "h_in:", $("#CUSTOM_HEIGHT_INCHES").val(),
            "w_ft:", $("#CUSTOM_WIDTH_FEET").val(), "w_in:", $("#CUSTOM_WIDTH_INCHES").val(),
            "|| nodes WIDTH:", nodeset?.["WIDTH"]?.value, "HEIGHT:", nodeset?.["HEIGHT"]?.value,
            "NUM_OF_SEC:", nodeset?.["NUM_OF_SEC"]?.value,
            "DOOR_WIDTH_FEET:", nodeset?.["DOOR_WIDTH_FEET"]?.value);
        if (typeof refreshAllBundleDescs === "function") __perf("  CUSTOM recomputeBundles", () => refreshAllBundleDescs());
        console.log("[CUSTOM-DIMS DEBUG] after refresh — SB1_DESC:", nodeset?.["SB1_DESC"]?.value,
            "BUNDLE_1_HEIGHT:", nodeset?.["BUNDLE_1_HEIGHT"]?.value);
        __perf("  CUSTOM redrawCanvas", () => redrawCanvas());
        console.log(`%c[CUSTOM-DIMS] total handler: ${(performance.now() - tAll).toFixed(1)}ms`, "color:#06c;font-weight:bold");
    }, 80);
});
// Refresh all section-bundle outputs (descs + part#s). The bundle nodes are out
// of the framework dep graph (edges stripped to avoid an O(n²) walk), so they
// don't auto-update — recomputeSectionBundles() runs them all once, cheaply.
function refreshAllBundleDescs() {
    // Clear both memo caches so the recompute reads current HEIGHT/NUM_OF_SEC and
    // DOM, not a stale memo.
    if (typeof invalidateSectionHeightsCache === "function") invalidateSectionHeightsCache();
    if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
    if (typeof recomputeSectionBundles === "function") {
        recomputeSectionBundles();
        return;
    }
    // Fallback (shouldn't run): the old per-node rw() path.
    const descIds = [
        // SB descriptions
        "SB1_DESC", "SB2_DESC", "SB3_DESC", "SB4_DESC", "SB5_DESC",
        "SB6_DESC", "SB7_DESC", "SB8_DESC", "SB9_DESC",
        // SC descriptions
        "BUNDLE1_SC1_DESC", "BUNDLE1_SC2_DESC",
        "BUNDLE2_SC1_DESC", "BUNDLE2_SC2_DESC",
        "BUNDLE3_SC1_DESC", "BUNDLE3_SC2_DESC",
        "BUNDLE4_SC1_DESC", "BUNDLE4_SC2_DESC",
        "BUNDLE5_SC1_DESC", "BUNDLE6_SC1_DESC",
        "BUNDLE7_SC1_DESC", "BUNDLE8_SC1_DESC",
        "BUNDLE9_SC1_DESC",
        // RP (raw panel) descriptions
        "BUNDLE1_RP1_DESC", "BUNDLE1_RP2_DESC",
        "BUNDLE2_RP1_DESC", "BUNDLE2_RP2_DESC",
        "BUNDLE3_RP1_DESC", "BUNDLE3_RP2_DESC",
        "BUNDLE4_RP1_DESC", "BUNDLE4_RP2_DESC",
        "BUNDLE5_RP1_DESC", "BUNDLE6_RP1_DESC",
        "BUNDLE7_RP1_DESC", "BUNDLE8_RP1_DESC",
        "BUNDLE9_RP1_DESC",
        // Part numbers (SB/SC/RP) — only dep on DOOR_MODEL, so they go stale when
        // the model settles after applyDefaults; refresh here too.
        "SB1_SPNUM", "SB2_SPNUM", "SB3_SPNUM", "SB4_SPNUM", "SB5_SPNUM",
        "SB6_SPNUM", "SB7_SPNUM", "SB8_SPNUM", "SB9_SPNUM",
        "BUNDLE1_SC1_SPNUM", "BUNDLE1_SC2_SPNUM",
        "BUNDLE2_SC1_SPNUM", "BUNDLE2_SC2_SPNUM",
        "BUNDLE3_SC1_SPNUM", "BUNDLE3_SC2_SPNUM",
        "BUNDLE4_SC1_SPNUM", "BUNDLE4_SC2_SPNUM",
        "BUNDLE5_SC1_SPNUM", "BUNDLE6_SC1_SPNUM",
        "BUNDLE7_SC1_SPNUM", "BUNDLE8_SC1_SPNUM",
        "BUNDLE9_SC1_SPNUM",
        "BUNDLE1_RP1_SPNUM", "BUNDLE1_RP2_SPNUM",
        "BUNDLE2_RP1_SPNUM", "BUNDLE2_RP2_SPNUM",
        "BUNDLE3_RP1_SPNUM", "BUNDLE3_RP2_SPNUM",
        "BUNDLE4_RP1_SPNUM", "BUNDLE4_RP2_SPNUM",
        "BUNDLE5_RP1_SPNUM", "BUNDLE6_RP1_SPNUM",
        "BUNDLE7_RP1_SPNUM", "BUNDLE8_RP1_SPNUM",
        "BUNDLE9_RP1_SPNUM",
    ];
    // Drop the per-walk shared-fields cache so this refresh reads current DOM.
    if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
    descIds.forEach(id => {
        if (typeof getNode === "function" && nodeset?.[id]) rw(getNode(id));
    });
}

// Invalidate the getSharedDescFields cache on any input feeding it, else descs
// go stale.
$(document).on(
    "change",
    "input[name='SIZE'], input[name='COLOR'], input[name='Pattern'], input[name='DOOR_MODEL'], " +
    "input[name='EndCaps'], [name='THIRD_REINFORCE'], #custom_dimensions, " +
    "#CUSTOM_WIDTH_FEET, #CUSTOM_WIDTH_INCHES, #CUSTOM_HEIGHT_FEET, #CUSTOM_HEIGHT_INCHES, #NUM_OF_SEC",
    function() {
        if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
    }
);

// Pattern/COLOR feed descriptions (segments c/d). Debounce so rapid toggles
// coalesce to one recompute that reads the final checked value.
let _patternColorTimer = null;
function _refreshDescsDebounced() {
    if (typeof invalidateDescSegmentsCache === "function") invalidateDescSegmentsCache();
    redrawCanvas();
    if (_patternColorTimer) clearTimeout(_patternColorTimer);
    _patternColorTimer = setTimeout(() => {
        _patternColorTimer = null;
        refreshAllBundleDescs();
    }, 80);
}
$(document).on("change", "input[name='Pattern']", _refreshDescsDebounced);
$(document).on("change", "input[name='COLOR']", _refreshDescsDebounced);
// SIZE updates descriptions through the framework dep chain, so it's omitted here.
// Section-options (e), end-caps (f), THIRD_REINFORCE (c "-3"), and glazing type
// (Y-line a: GF/DF) aren't on that chain, so refresh explicitly on their change.
$(document).on(
    "change",
    "input[name='StepPlate'], input[name='ExhaustPortView'], input[name='ExhaustPortSize'], input[name='EndCaps'], [name='THIRD_REINFORCE'], input[name='GLAZING_TYPE']",
    _refreshDescsDebounced
);
  
function syncHardwareVisibility() {
    const faceOnly = $("input[name='DOOR_OPTIONS']:checked").val() === "1";
    // Toggle .face-only class on #configurator so CSS can hide the Hardware tab.
    $("#configurator").toggleClass("face-only", faceOnly);
    // Disable the Hardware tab radio so it can't be selected programmatically/keyboard.
    $("input[name='section_select'][value='2']").prop("disabled", faceOnly);
    if (faceOnly) {
        $("#operation_section, #manual_type_section, #chain_hoist_type_section").hide();
        // If the user is currently on the Hardware tab, jump them to Door Model.
        if ($("input[name='section_select']:checked").val() === "2") {
            $("input[name='section_select'][value='0']").prop("checked", true).trigger("change");
        }
    } else {
        $("#operation_section").show();
        if (typeof syncManualTypeVisibility === "function") syncManualTypeVisibility();
        if (typeof syncChainHoistTypeVisibility === "function") syncChainHoistTypeVisibility();
    }
}
$("input[name='DOOR_OPTIONS']").on("change", syncHardwareVisibility);
syncHardwareVisibility();
// Re-run after a delay to catch the framework's async tab rendering.
setTimeout(syncHardwareVisibility, 200);
setTimeout(syncHardwareVisibility, 1000);

// div#tab_2's inline onclick="showSection(2)" bypasses the disabled radio, so
// strip/restore it around face-only mode.
function syncHardwareTabInlineClick() {
    const tab = document.getElementById("tab_2");
    if (!tab) return;
    const faceOnly = $("#configurator").hasClass("face-only");
    if (faceOnly) {
        // Save original inline onclick once, then remove it.
        if (!tab.dataset.savedOnclick && tab.getAttribute("onclick")) {
            tab.dataset.savedOnclick = tab.getAttribute("onclick");
        }
        tab.removeAttribute("onclick");
    } else {
        // Restore.
        if (tab.dataset.savedOnclick) {
            tab.setAttribute("onclick", tab.dataset.savedOnclick);
            delete tab.dataset.savedOnclick;
        }
    }
}
// Hook into every place that toggles the .face-only class.
$("input[name='DOOR_OPTIONS']").on("change", syncHardwareTabInlineClick);
syncHardwareTabInlineClick();
setTimeout(syncHardwareTabInlineClick, 200);
setTimeout(syncHardwareTabInlineClick, 1000);

// [HARDWARE-TABLE-ROW-SYNC] Shared row-select behavior for option tables on the
// Hardware tab (Drums & Cables, Springing Solutions): clicking a row selects its
// radio and the selected row highlights blue.
function syncHardwareTableRows() {
    $(".hw-option-table tbody tr").each(function() {
        const checked = $(this).find("input[type='radio']").is(":checked");
        $(this).css("background", checked ? "#e3f2fd" : "");
    });
}
$(document).on("change", ".hw-option-table input[type='radio']", syncHardwareTableRows);
$(document).on("click", ".hw-option-table tbody tr", function(e) {
    if ($(e.target).is("input,label")) return;
    $(this).find("input[type='radio']").prop("checked", true).trigger("change");
});
setTimeout(syncHardwareTableRows, 0);


// T300 only supports HW Size 3 — hide the "2" button and force selection to "3".
function syncHardwareSizeForModel() {
    const model = $("input[name='DOOR_MODEL']:checked").val();
    if (model === "T300") {
        $("#HARDWARE_SIZE_0_BTN").hide();
        $("#HARDWARE_SIZE_0").prop("disabled", true);
        if (!$("#HARDWARE_SIZE_1").is(":checked")) {
            $("#HARDWARE_SIZE_1").prop("checked", true).trigger("change");
        }
    } else {
        $("#HARDWARE_SIZE_0_BTN").show();
        $("#HARDWARE_SIZE_0").prop("disabled", false);
    }
    if (typeof window.syncSlidingButtonGroup === "function") window.syncSlidingButtonGroup("HARDWARE_SIZE");
}
$(document).on("change", "input[name='DOOR_MODEL']", syncHardwareSizeForModel);
syncHardwareSizeForModel();


function syncManualTypeVisibility() {
    const op = $("input[name='Operation']:checked").val();
    if (op === "0") {
        $("#manual_type_section").show();
    } else {
        $("#manual_type_section").hide();
    }
}
$("input[name='Operation']").on("change", syncManualTypeVisibility);
syncManualTypeVisibility();

function syncChainHoistTypeVisibility() {
    const op = $("input[name='Operation']:checked").val();
    if (op === "4") {
        $("#chain_hoist_type_section").show();
    } else {
        $("#chain_hoist_type_section").hide();
    }
}
$("input[name='Operation']").on("change", syncChainHoistTypeVisibility);
syncChainHoistTypeVisibility();

function syncOverlapNoteVisibility() {
    const v = $("input[name='OverlapRequired']:checked").val();
    $("#OVERLAP_NOTE").toggle(v === "yes");
}
$(document).on("change", "input[name='OverlapRequired']", syncOverlapNoteVisibility);
syncOverlapNoteVisibility();

function syncBarLatchSideVisibility() {
    const v = $("input[name='BarLatch']:checked").val();
    $("#BAR_LATCH_SIDE_WRAP").css("display", v === "yes" ? "flex" : "none");
}
$(document).on("change", "input[name='BarLatch']", syncBarLatchSideVisibility);
syncBarLatchSideVisibility();

function syncOnePointLatchQtyVisibility() {
    const v = $("input[name='OnePointLatch']:checked").val();
    $("#ONE_POINT_LATCH_QTY_WRAP").css("display", v === "yes" ? "flex" : "none");
}
$(document).on("change", "input[name='OnePointLatch']", syncOnePointLatchQtyVisibility);
syncOnePointLatchQtyVisibility();

$
    addLogic("CONFIGURE_BTN", buttonLogic, ["SPRING_SOLUTION", "WEIGHT", "PRICE"]);
    nodeset["CONFIGURE_BTN"].type = "BUTTON";
    //Loading Animation Behaviours
    let loadingCount = 0;
    let loadingText = "Loading";
    const loadingAnimation = () => {
        $("button[name=nextPageBtn]").text(loadingText);
        const suffix = ". . . ";
        loadingText = "Loading" + suffix.substr(0, loadingCount % suffix.length);
        loadingCount = loadingCount + 1;
    };
    let interval = 0;

    //Every time the user changes an input, we want to disable the buttons until the walk ends.
    beforeWalk = function (walk) {
        if (interval === 0) {
            interval = setInterval(loadingAnimation, 430);
            $("#CONFIGURE_BTN").attr("disabled", "");
        }
    };

    onUpdate = function (walk) {
        clearInterval(interval);
        interval = 0;
        // Restore the button label after the loading animation (it overwrites the
        // text to "Loading. . ." on each tick and never resets it otherwise).
        loadingCount = 0;
        loadingText = "Loading";
        $("button[name=nextPageBtn]").text("Configure");
        // No validation gating for now — keep Configure enabled so it always
        // proceeds to the BOM. Re-enable the isFormValid() check here later.
        $("#CONFIGURE_BTN").removeAttr("disabled");
        showErrorMessageIfError();
    };
  
function updateBackButton() {
    $("#BACK_BTN").show();
}

$("button.button-nextpage[onclick='formForward()']").on("click", function() {
    setTimeout(updateBackButton, 300);
});

$("button#BACK_BTN").on("click", function() {
    setTimeout(updateBackButton, 300);
});

$("#NAVIGATION_SPC").on("click", function() {
    setTimeout(updateBackButton, 300);
});


 // const originalFormForward = window.formForward;
 // window.formForward = function() {
//	 originalFormForward && originalFormForward();
//	 updateBackButton();
//  };

//  const originalFormBackward = window.formBackward;
//  window.formBackward = function() {
//	 originalFormBackward && originalFormBackward();
//	 updateBackButton();
//  };
    function showErrorMessageIfError() {
        const messageElement = $("#ERROR_MESSAGE");
        if (isFormValid()) {
            $("#ERROR_MESSAGE").hide();
            $("#ERROR_MESSAGE").text("");
            return;
        }
        $("#ERROR_MESSAGE").show();
        printError();
        let errorMessage = "";
        if ((nodeset["WEIGHT"]?.value ?? 0) > 750) errorMessage = "The current configuration is too heavy. Weight limit for this door is 750lbs. ";

        Object.values(nodeset).forEach((node) => (node.value + "").includes("ERROR") && (errorMessage += `${node.id} is invalid. `));
        $("#ERROR_MESSAGE").text(errorMessage);
    }

    //Needed for some minor layout
    $("#displayMain").css("margin-bottom", "24px");
    $("#displayMain").css("padding", "0 100px");

    //populatePrecons()

    //All warnings default to hidden
    $(".rw-warning").hide();
    //				$("#DEFAULTS_PLUGIN").html(DEFAULTS_PLUGIN.load("1008928433"))
    $("#configurator button").on("click", (evt) => evt.preventDefault());

    $("#LOAD_DEFAULTS").on("click", applyDefaults);
    function updateDoorSummary() {
        const ns = (typeof nodeset !== "undefined") ? nodeset : {};
        const model = $("input[name='DOOR_MODEL']:checked").val() || ns["DOOR_MODEL"]?.value || "";
        let wFt, wIn, hFt, hIn;
        const d = getCurrentDimensions();
        // Preset path with no radio checked is the only case that may read the
        // (possibly lagging) DOOR_*_INCHES nodes — every other case trusts the
        // single resolver, so the summary can't drift from canvas/BOM.
        if (!d.custom && !d.hasSelection) {
            wFt = ns["DOOR_WIDTH_FEET"]?.value || "";
            wIn = ns["DOOR_WIDTH_INCHES"]?.value || "0";
            hFt = ns["DOOR_HEIGHT_FEET"]?.value || "";
            hIn = ns["DOOR_HEIGHT_INCHES"]?.value || "0";
        } else {
            wFt = d.wFt ? String(d.wFt) : "";
            wIn = String(d.wIn);
            hFt = d.hFt ? String(d.hFt) : "";
            hIn = String(d.hIn);
        }
        const colorRaw = $("input[name='COLOR']:checked").val() || ns["COLOR"]?.value || "";
        const color = colorRaw ? String(colorRaw).charAt(0).toUpperCase() + String(colorRaw).slice(1) : "";
        const size = (wFt && hFt) ? `${wFt}'${wIn}" x ${hFt}'${hIn}"` : "";
        const summary = [model, size, color].filter(Boolean).join(" · ");
        $("#DOOR_SUMMARY_LABEL").text("Door Summary:");
        $("#DOOR_SUMMARY_VALUE").text(summary);
        if (typeof setState === "function" && nodeset?.["DOOR_SUMMARY_VALUE"]) {
            setState("DOOR_SUMMARY_VALUE", summary);
        }
    }
    window.updateDoorSummary = updateDoorSummary;
    $(document).on("change", "input[name='DOOR_MODEL'], input[name='COLOR'], input[name='SIZE'], #CUSTOM_WIDTH_FEET, #CUSTOM_WIDTH_INCHES, #CUSTOM_WIDTH_FRACTION, #CUSTOM_HEIGHT_FEET, #CUSTOM_HEIGHT_INCHES, #custom_dimensions, #LIFT_TYPE", updateDoorSummary);
    $(document).on("click", "#NAVIGATION_SPC, #tab_0, #tab_1, #tab_2, #tab_3, #tab_4, .button-nextpage", function () {
        updateDoorSummary();
        setTimeout(updateDoorSummary, 50);
        setTimeout(updateDoorSummary, 200);
        setTimeout(updateDoorSummary, 500);
    });
    setTimeout(updateDoorSummary, 300);
    setTimeout(updateDoorSummary, 1000);
    setTimeout(updateDoorSummary, 2000);


    // Changing Color selection and Position

    $(function () {
        if ($(".button-set.right").length > 0) {
            $(".button-set.right").hide();
        }

        // Show the window-position sub-nav for any GLAZING_TYPE except "None";
        // toggle a class so .postion-container.hidden does the hiding.
        function syncPositionVisibility() {
            const glazing = $('input[name="GLAZING_TYPE"]:checked').val();
            $(".postion-container").toggleClass("hidden", !glazing || glazing === "none");
        }
        $(document).on("change", "input[name='GLAZING_TYPE']", syncPositionVisibility);
        syncPositionVisibility();
        setTimeout(syncPositionVisibility, 300);
        setTimeout(syncPositionVisibility, 1000);

        // Observer for color changes
        const observer = new MutationObserver((mutations, obs) => {
            if ($(".color-button").length > 0) {
                obs.disconnect(); // stops the observer

                setupRadioSelectionTwoButtons("TEMPERED");
                setupRadioSelectionTwoButtons("WINDOWS");
		    
		      $("#more_door_models").on("change", function() {
			   if($(this).is(":checked")) {
				$("#more_door_models_container").show();
			   } else {
				$("#more_door_models_container").hide();
			   }
			 });

		      $("#more_colors_toggle").on("click", function() {
			   const $row = $("#more_colors_container");
			   const expanded = $row.hasClass("expanded");
			   $row.toggleClass("expanded", !expanded);
			   $(this).attr("aria-expanded", !expanded);
			   $(this).text(expanded ? "+" : "−");
			 });
		    
		      $("#custom_dimensions").on("change", function() {
			   if ($(this).is(":checked")) {
				  $("#custom_dimensions_container").show();
				  $("input[name='SIZE']").closest(".dimension-layout").prev(".config-option-title-style").hide();
				  $("input[name='SIZE']").closest(".dimension-layout").hide();
			   } else {
				  $("#custom_dimensions_container").hide();
				  $("input[name='SIZE']").closest(".dimension-layout").prev(".config-option-title-style").show();
				  $("input[name='SIZE']").closest(".dimension-layout").show();
				  // Toggling custom OFF must snap back to the preset SIZE. Push the
				  // SIZE node + dimension leaves synchronously so the debounced
				  // #custom_dimensions cascade reads the preset values, not the stale
				  // custom ones (a second change event would race two cascades).
				  if (typeof nodeset !== "undefined" && nodeset["SIZE"]) {
					  nodeset["SIZE"].value = $("input[name='SIZE']:checked").val();
				  }
				  ["SIZE_HEIGHT", "SIZE_WIDTH", "DOOR_WIDTH_FEET", "DOOR_WIDTH_INCHES", "DOOR_HEIGHT_FEET", "DOOR_HEIGHT_INCHES", "WIDTH", "HEIGHT"].forEach(id => {
					  if (typeof getNode === "function" && nodeset && nodeset[id]) rw(getNode(id));
				  });
			   }
			 });


                function updatedColorSelection() {
                    $(".color-button-container").removeClass("selected");
                    $(".door-color-text").removeClass("selected");
                    const $selected = $("input[name='COLOR']:checked");
                    $selected.closest(".color-button-container").addClass("selected");
                    $selected.siblings(".door-color-text").addClass("selected");
                }

                updatedColorSelection();

                $("input[name='COLOR']").on("change", updatedColorSelection);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Carousel Data
        const operatorData = {
            0: {
                id: "operator_none",
                name: "None",
                value: "PS",
                img: "",
                maxDoorHeight: 1000,
                isHiLiftCompatible: true,
                style: "",
            },
            1: {
                id: "operator_jackshaft",
                name: "98022 - Jackshaft",
                value: "951-185",
                img: "/HTML/products/1825206974/images/EW-LM-8500W.jpg",
                maxDoorHeight: 168,
                isHiLiftCompatible: true,
                style: "",
            },
            2: {
                id: "6580L_Belt",
                name: "6580L - Belt",
                value: "OP_6580L_VALUE",
                img: "/HTML/products/1008928433/images/6580L-(951-193)_E-Cat.png",
                maxDoorHeight: 120,
                isHiLiftCompatible: false,
                style: "",
            },
            3: {
                id: "6590L_Belt",
                name: "6690L - Belt",
                value: "OP_6590L_VALUE",
                img: "/HTML/products/1008928433/images/6690L-(951-194)_E-Cat.png",
                maxDoorHeight: 120,
                isHiLiftCompatible: false,
                style: "",
            },
            4: {
                id: "2220L_Chain",
                name: "2220L - Chain",
                value: "OP_2220L_CHAIN_VALUE",
                img: "/HTML/products/1008928433/images/2220L-(951-190)_E-Cat.png",
                maxDoorHeight: 120,
                isHiLiftCompatible: false,
                style: "",
            },
            5: {
                id: "2420L_Chain",
                name: "2420L - Chain",
                value: "OP_2420L_CHAIN_VALUE",
                img: "/HTML/products/1008928433/images/2420L-(951-191)_E-Cat.png",
                maxDoorHeight: 120,
                isHiLiftCompatible: false,
                style: "",
            },
        };
        // Data and default start index
        const operatorDataArray = Object.values(operatorData);

        let currentOperatorIndex = 1;
        let firstTimeLoading = true;

        // Creates the HTML for operator
        function createOperatorDiv(operator, activeStatus = false) {
            const operatorItem = document.createElement("div");
            operatorItem.classList.add("carousel-operator-item");
            operatorItem.id = operator.id;
            if (activeStatus) {
                operatorItem.classList.add("active");
            }

            // First make sure images get loaded
            let retryLoading = false;
            let retryCounter = 0;

            const image = document.createElement("img");
            image.src = operator.img;

            if (operator.img === "") {
                image.style.visibility = "hidden";
            } else {
                image.onload = () => {
                    image.style.visibility = "visible";
                };

                image.onerror = () => {
                    if (retryCounter < 5) {
                        retryCounter++;
                        setTimeout(() => {
                            image.src = operator.img + "?retry=" + Date.now();
                        }, 1000);
                    } else {
                        image.style.visibility = "hidden";
                    }
                };
            }

            const operatorInnerDiv = document.createElement("div");
            operatorInnerDiv.classList.add("carousel-operator-image");
            operatorInnerDiv.appendChild(image);

            const operatorHeader = document.createElement("h3");
            operatorHeader.textContent = operator.name;

            operatorItem.appendChild(operatorInnerDiv);
            operatorItem.appendChild(operatorHeader);

            return operatorItem;
        }

        // Creates the carousel with the data (temporary needs changing for innf scrolling)
        function operatorCarouselLoad(indexCurrent) {
            const content = document.getElementById("operator-carousel-container");
            const operatorInput = document.getElementById("OPERATOR");

            content.innerHTML = "";

            content.appendChild(createOperatorDiv(operatorDataArray[operatorDataArray.length - 1]));
            const enabledOperators = getEnabledOperators(operatorDataArray);

            enabledOperators.forEach((operator, index) => {
                const operatorItemList = createOperatorDiv(operator, index === indexCurrent);
                content.appendChild(operatorItemList);
            });
            //content.insertBefore(createOperatorDiv(operatorDataArray[operatorDataArray.length-1]), operatorDataArray[0]);
            content.appendChild(createOperatorDiv(enabledOperators[0]));
        }
        function getEnabledOperators(operatorDataArray) {
            return operatorDataArray.filter((operator) => {
                return !($("#LIFT_TYPE").val() === "High_Lift") || operator.isHiLiftCompatible;
            });
        }

        function updateActiveOperator(index) {
            const items = document.querySelectorAll(".carousel-operator-item");

            // First set the active tag
            items.forEach((item, i) => {
                item.classList.toggle("active", i === index);
            });

            // Due to clones we need to move the index so it it not out of bounds
            let dataIndex = index - 1;

            const enabledOperators = getEnabledOperators(operatorDataArray);
            if (dataIndex < 0) {
                dataIndex = enabledOperators.length - 1;
            } else if (dataIndex >= enabledOperators.length) {
                dataIndex = 0;
            }
            const currentOperator = enabledOperators[dataIndex];
            const operatorInput = document.getElementById("OPERATOR");

            console.log("THe current Operator Testing issue Index === " + dataIndex);
            console.log("THe Json?" + JSON.stringify(currentOperator));
            operatorInput.name = currentOperator.name;
            operatorInput.value = currentOperator.value;
            setState("OPERATOR", currentOperator.value);
            operatorInput.dataset.maxDoorHeight = currentOperator.maxDoorHeight;
            operatorInput.dataset.isHiLiftCompatible = currentOperator.isHiLiftCompatible;

            // if (currentOperator.id == "operator_jackshaft" || currentOperator.id == "operator_none") {
            // 	operatorInput.value = currentOperator.value;
            // }
            // else {
            // 	const getVal = currentOperator.value;
            // 	operatorInput.value = getState(getVal);
            // }

            // console.log("operatorInput", operatorInput.name, operatorInput.value)
            // setState("OPERATOR", currentOperator.value)

            // operatorInput.dataset.maxDoorHeight = currentOperator.maxDoorHeight;
            // operatorInput.dataset.isHiLiftCompatible = currentOperator.isHiLiftCompatible;
        }

        function updateCarouselPosition(index) {
            const carousel = document.getElementById("operator-carousel-container");

            // Prevents slide affect first load
            if (firstTimeLoading) {
                carousel.classList.add("no-transition");
                carousel.style.transform = `translateX(-${index * 100}%)`;
                firstTimeLoading = false;

                requestAnimationFrame(() => {
                    carousel.classList.remove("no-transition");
                });
            } else {
                carousel.style.transform = `translateX(-${index * 100}%)`;
            }
        }

        // Check if carousel buttons are added
        let buttonsAdded = false;

        // Setup carousel when tab 2 is clicked
        const observerTab2 = new MutationObserver((mutations, obs) => {
            //const tab2 = document.getElementById('tab_2');
            //We actually always want the carosel enabled ZR
            const $tab2 = true; //$('#tab_2');
            if ($tab2) {
                obs.disconnect();
                $("#tab_2, button.button-nextpage").on("click", function () {
                    const carouselContainer = document.getElementById("operator-carousel-container");

                    if (carouselContainer) {
                        operatorCarouselLoad(currentOperatorIndex);
                        updateSelectedOperator(currentOperatorIndex);

                        if (!buttonsAdded) {
                            buttonsAdded = true;

                            $("#nextButtonOperator").on("click", () => {
                                if (currentOperatorIndex > operatorDataArray.length) return;
                                currentOperatorIndex++;
                                updateSelectedOperator(currentOperatorIndex);
                            });

                            $("#prevButtonOperator").on("click", () => {
                                if (currentOperatorIndex <= 0) return;
                                currentOperatorIndex--;
                                updateSelectedOperator(currentOperatorIndex);
                            });

                            carouselContainer.addEventListener("transitionend", () => {
                                const enabledOperators = getEnabledOperators(operatorDataArray);
                                if (currentOperatorIndex > enabledOperators.length) {
                                    indexCorrectionList(carouselContainer, 1);
                                }

                                if (currentOperatorIndex <= 0) {
                                    indexCorrectionList(carouselContainer, enabledOperators.length);
                                }
                            });
                        }
                    } else {
                        console.log("Observer missing");
                    }
                });
            }
        });

        observerTab2.observe(document.body, {
            childList: true,
            subtree: true,
        });

        // Update data list selection and update positioning
        function updateSelectedOperator(index) {
            updateCarouselPosition(index);
            updateActiveOperator(index);
        }

        // Move to the correct index for infinite loop
        function indexCorrectionList(container, index) {
            container.style.transition = "none";
            currentOperatorIndex = index;
            updateSelectedOperator(currentOperatorIndex);

            requestAnimationFrame(() => {
                container.style.transition = "transform 0.3s ease";
            });
        }

        // Helper function to check if parent child exists
        function isHiddenPosition($btn) {
            return $btn.length === 0 || $btn[0].offsetParent === null;
        }

        // Adding selector (temporary)
        function setupRadioSelectionTwoButtons(radioName) {
            function updateSelection() {
                // Remove selected from all containers of this group
                $(`input[name="${radioName}"]`).each(function () {
                    $(this).closest(".rw-sliding-button").removeClass("selected");
                });

                // Add selected to the currently checked one
                const $selected = $(`input[name="${radioName}"]:checked`);
                $selected.closest(".rw-sliding-button").addClass("selected");
            }

            updateSelection();

            $(`input[name="${radioName}"]`).on("change", updateSelection);
        }
    });

    console.log(`%c[LOAD] loadForm synchronous body done @ ${performance.now().toFixed(0)}ms`, "color:#a60;font-weight:bold");
    if ($("#INPUT_JSON").val() !== "") {
        console.log("[LOAD] saved input found → loadInputValues()");
        __perf("loadInputValues", () => loadInputValues("configurator"));
        __perf("updateDoorSummary", () => updateDoorSummary());
    // [SESSION-RESTORE DISABLED] restoreSession() re-applied a snapshot on every
    // load, clicking saved radios back over the user's selection — the "reverts
    // after a few seconds" bug. Re-enable only with "Back-only" gating.
    // } else if (restoreSession()) {
    //     console.log("[LOAD] session found → restoreSession()");
    //     __perf("updateDoorSummary", () => updateDoorSummary());
    } else {
        console.log("[LOAD] no saved input → applyDefaults() (async AJAX + radio-click storm)");
        __perf("applyDefaults (sync part)", () => applyDefaults());
    }

    // Re-sync conditional visibility after defaults apply. applyDefaults populates
    // radios async, so re-run a few times to catch late writes.
    const resync = () => {
        if (typeof syncManualTypeVisibility === "function") syncManualTypeVisibility();
        if (typeof syncChainHoistTypeVisibility === "function") syncChainHoistTypeVisibility();
        if (typeof syncOverlapNoteVisibility === "function") syncOverlapNoteVisibility();
        if (typeof syncBarLatchSideVisibility === "function") syncBarLatchSideVisibility();
        if (typeof syncOnePointLatchQtyVisibility === "function") syncOnePointLatchQtyVisibility();
        if (typeof renderEndCaps === "function") renderEndCaps();
        if (typeof window.syncAllSlidingGroups === "function") window.syncAllSlidingGroups();
    };
    resync();
    setTimeout(resync, 100);
    setTimeout(resync, 500);
    setTimeout(resync, 1500);

    // [SESSION-SAVE DISABLED] paired with the restoreSession() branch above —
    // re-enable together. Would save on Configure click + beforeunload (the inline
    // nextPage() can navigate before a delegated handler runs).
    // $(document).on("click", "#CONFIGURE_BTN", function () {
    //     if (typeof saveSession === "function") saveSession();
    // });
    // $(window).on("beforeunload", function () {
    //     if (typeof saveSession === "function") saveSession();
    // });

    try {
		hp_init();

        uv_info.on_user_type = function (role) {
            if (role != "Customer") {
				return;
			}
			$('#PRICE_DISPLAY').addClass('pricing-blur');

            const disable = ["HARDWARE", "OPERATOR_OPTIONS", "ANNOTATIONS"];
            disable.forEach((id) => disableSection(id));

			$('#NEXT_PAGE_BUTTONS .button-nextpage').hide();

			$('#PRICE_DISPLAY')
				.attr('title', 'Click and submit location to reveal pricing')
				.on('click', function(event) {
				$("#CONFIGURE_BTN").trigger('click');
			});
        };

		uv_info.on_user_info = function (name, email, zip) {
			$('#PRICE_DISPLAY')
				.attr('title', '')
				.removeClass('pricing-blur')
				.off();
		};
    } catch (error) {
        // uv_info doesn't exist yet
    }
}

function saveDefaults() {
    const defaults = {};
    Object.values(nodeset).forEach((node) => {
        if (node.id !== "SPC_BOM" && node.id !== "INPUT_JSON" && node.id !== "SPRING_SOLUTION" && !node.id.startsWith("GL_") && node.id !== "RENDER")
            defaults[node.id] = node.value;
    });
    $.ajax({
        url: `/spr/custom/jpoc/json/849871261?1008928433`,
        type: "POST",
        data: JSON.stringify(defaults),
        contentType: "application/json; charset=utf-8",
        error: function (err, textStatus, errorThrown) {
            console.log(err, textStatus, errorThrown);
            simpleConfirm("Error, new defaults not saved.");
        },
    }).done((res) => {
        simpleConfirm("New Defaults Saved");
    });
}
// Session save/restore — keep selections across Configure → BOM → Back via
// sessionStorage. Collects/applies values like saveDefaults()/applyDefaults().
const SESSION_KEY = "thermatite_config_session";

function saveSession() {
    try {
        const state = {};
        Object.values(nodeset).forEach((node) => {
            if (node.id !== "SPC_BOM" && node.id !== "INPUT_JSON" && node.id !== "SPRING_SOLUTION" && !node.id.startsWith("GL_") && node.id !== "RENDER")
                state[node.id] = node.value;
        });
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
    } catch (e) {
        console.warn("saveSession failed:", e.message);
    }
}

// Returns true if a saved session was found and applied, false otherwise.
function restoreSession() {
    let saved;
    try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (!raw) return false;
        saved = JSON.parse(raw);
    } catch (e) {
        console.warn("restoreSession failed to read:", e.message);
        return false;
    }
    if (!saved || typeof saved !== "object") return false;

    // Apply values like applyDefaults()'s success path so the dependent walks match.
    Object.keys(saved).forEach((id) => {
        if (!nodeset[id]) return;
        const value = saved[id];
        if (nodeset[id].type === "RADIO_PARENT") {
            $(`input[type=radio][name="${id}"]`).removeAttr("checked").prop("checked", false);
            $(`input[type=radio][name="${id}"][value="${value}"]`).attr("checked", "").prop("checked", true);
        }
        const input = $("#" + id);
        nodeset[id].value = value;
        if (input.attr("type") !== "radio") {
            $("#" + id).val(value);
        }
    });

    const $checkedRadios = $("input[type=radio][checked]");
    console.log(`%c[LOAD] restoreSession: clicking ${$checkedRadios.length} checked radios`, "color:#0a6;font-weight:bold");
    $checkedRadios.click();
    return true;
}

function applyDefaults() {
    $.ajax({
        url: `/spr/custom/jpoc/json/849871261?1008928433`,
    })
        .done((res) => {
            if (!res) return;
            const defaultValues = JSON.parse(res.INPUT_SETTINGS);
            Object.keys(defaultValues).forEach((key) => {
                const node = {
                    id: key,
                    value: defaultValues[key],
                };
                if (!nodeset[node.id]) return;
                if (nodeset[node.id].type === "RADIO_PARENT") {
                    // Set both attribute and property: :checked reads the property,
                    // so attribute-only leaves the markup default checked while the
                    // node holds the saved value — part#s and descs would disagree.
                    $(`input[type=radio][name="${node.id}"]`).removeAttr("checked").prop("checked", false);
                    $(`input[type=radio][name="${node.id}"][value="${node.value}"]`).attr("checked", "").prop("checked", true);
                }
                const input = $("#" + node.id);
                nodeset[node.id].value = node.value;
                if (input.attr("type") !== "radio") {
                    $("#" + node.id).val(node.value);
                }
            });

            if (!!defaultValues && defaultValues.length > 0) finalvalidation();
            const $checkedRadios = $("input[type=radio][checked]");
            console.log(`%c[LOAD] applyDefaults: clicking ${$checkedRadios.length} checked radios (each fires handlers + walks)`, "color:#a60;font-weight:bold");
            if (typeof window.__perf === "function") {
                window.__perf("applyDefaults radio-click storm", () => $checkedRadios.click());
            } else {
                $checkedRadios.click();
            }
        })
        .fail((res) => {
            console.log(res);
        });
}
function buttonLogic() {
    // TODO: re-enable validation gating once SPRING_SOLUTION/WEIGHT/price are
    // wired up. For now Configure is always enabled.
    this.removeAttribute("disabled");
    this.value = "Done";
}
function isFormValid() {
    const springSolution = nodeset["SPRING_SOLUTION"]?.value;
    const weight = nodeset["WEIGHT"]?.value ?? 0;
    if (!(!!springSolution && weight < 750)) return false;
    return !Object.values(nodeset)
        .map((node) => node.value)
        .includes("ERROR");
}
function printError() {
    const springSolution = nodeset["SPRING_SOLUTION"]?.value;
    const weight = nodeset["WEIGHT"]?.value ?? 0;
    if (!springSolution || weight > 750)
        Object.values(nodeset).forEach((node) => (node.value + "").includes("ERROR") && console.log(node));
}
function additionalSaves(json) {
    // Section-bundle nodes recompute on demand — make them current before the BOM
    // is serialized.
    if (typeof recomputeSectionBundles === "function") recomputeSectionBundles();
    // pushSafe swallows failures (glazing/weight/price are WIP and may throw) and
    // falls back to "", so one bad value can't abort the save and hang nextPage().
    const pushSafe = (id, getValue) => {
        let value = "";
        try {
            const v = getValue();
            if (v !== undefined && v !== null) value = v;
        } catch (e) {
            console.warn(`additionalSaves: "${id}" skipped —`, e.message);
        }
        json.push({ id, value });
    };

    pushSafe("glazingobj", () => JSON.stringify(getGlazingObj()));
    pushSafe("weight", () => getCurrentDoorWeight());
    pushSafe("WINDOWS_LAYOUT", () => getNode("WINDOW_POSITION").getAttribute("desc"));
    pushSafe("WINDOWS_OUTPUT", () => getNode("WINDOWS").getAttribute("desc"));
    pushSafe("COLOUR_OUTPUT", () => getNode("COLOR").getAttribute("desc"));
    pushSafe("DOOR_WIDTH_OUTPUT", () => getState("WIDTH"));
    pushSafe("DOOR_HEIGHT_OUTPUT", () => getState("HEIGHT"));
    pushSafe("price", () => getState("PRICE_DISPLAY"));
    pushSafe("GLASS_TYPE_OUTPUT", () => getState("GLASS_TYPE_OUTPUT"));
    pushSafe("SIZE_CODE", () =>
        `${getState("DOOR_WIDTH_FEET")}'${getState("DOOR_WIDTH_INCHES")}"x${getState("DOOR_HEIGHT_FEET")}'${getState("DOOR_HEIGHT_INCHES")}"`);
    pushSafe("END_CAPS_OUTPUT", () => getState("END_CAPS"));
}
