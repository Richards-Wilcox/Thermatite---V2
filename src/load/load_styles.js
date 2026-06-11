function loadStyles() {
  const styles = `


#displayMain{
	padding: 0 20px !important;
}

#interface label{
  padding: 0;
}

.cobalt.autodesk360 .dropdown-container{
  display: flex;
  flex-direction: column;
  gap: 20px;           /* space between dropdowns */
  /* align-items: flex-start; */
  flex-wrap: wrap;     /* allows wrapping on small screens */
}

.cobalt.autodesk360 .dropdown-item {
  display: flex;
  flex-direction: column; /* label on top, select below */
  gap: 5px;
  justify-content: space-between;
  //flex: 1;                /* equal width */
  //min-width: 200px;       /* ensures readability on small screens */
}

.dropdown-item h3{
  margin-bottom: 5px
}

.cobalt.autodesk360 .custom-dimension-item{
  flex-direction: row;
  align-items: center;        /* vertically align both */
  justify-content: flex-start;
  gap: 10px;
}

.cobalt.autodesk360 .custom-dimension-container,
.cobalt.autodesk360 .custom-panel-item-container{
	display: none;
}

.cobalt.autodesk360 .custom-dimension-section{
	display: flex;
	gap:20px;
}

.cobalt.autodesk360 .custom-dimension-item,
.cobalt.autodesk360 .panel-style-container {
    width: 100%;
}

.cobalt.autodesk360 .dropdown-item label {
  font-size: 12px;
  color: black;
  font-weight: 500;
}

.cobalt.autodesk360 .dropdown-item select {
  padding: 8px;
  font-size: 15px;
  border: 1px solid #000;
  border-radius: 6px;
  background-color: #fff;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s ease;
  cursor: pointer
}

.cobalt.autodesk360 .dropdown-item select:hover {
  background: #e4e4e4 !important
}

.cobalt.autodesk360 .dropdown-item select:focus {
 border: 2px solid #000 !important;
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1) !important;
}

.dropdown-pair {
  display: flex;
  gap: 10px;
  width:100%;
  justify-content: space-between;
  flex: 1 1 0;
  min-width: 0;
}

.dropdown-subitem{
  display:flex;
  flex-direction:column;
  gap:6px;
  flex: 1 1 0;
  min-width: 0;
}

.cobalt.autodesk360 .dropdown-subitem label{
	padding: 0px;
}

.drill-container, .end-cap-container{
  display:flex;
  flex-direction:column;
  gap:6px;
}

#more_door_models_container {
  display: none;
}

#more_door_models:checked ~ div#more_door_models_container {
  display: block;
}

 .color-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%; /* above the button */
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0,0,0,0.8);
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  font-size: 12px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}

.spring-cycle:hover::after{
  left:0;
  transform: translateX(-12px);
}

/* Show tooltip on hover */
.color-tooltip:hover::after {
  opacity: 1;
}


/*tooltip */
.tooltip {
 visibility: hidden;
  z-index: 9999;
  width: 100%;
  padding: 15px;
  position: fixed;
  top:-140%;
  left: -25%;
  border-radius: 9px;
  font-size: 16px;
  transform: translateY(9px);
  box-shadow: 0 0 3px rgba(56, 54, 54, 0.86);
  background-color:#fff;
}


/* tooltip  after*/
.tooltip::after {
  content: " ";
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px;
  border-color:  #383636DD transparent transparent transparent;
  position: absolute;
  left: 40%;
}

.stack-wrapper:hover .tooltip {
  visibility: visible;
  transform: translateY(-10px);
  opacity: 1;
}

@keyframes odsoky {
  0%{
    transform: translateY(6px);
  }

  100%{
    transform: translateY(1px);
  }

}

.right:hover {transform: translateX(6px); }
.left:hover {transform: translateX(-6px); }
.bottom:hover { transform: translateY(6px); }

.right .tooltip { top:-20%; left:115%; }

.right .tooltip::after{
  top:40%;
  left:-12%;
  transform: rotate(90deg);
}

.bottom .tooltip{
  top:160%;
  left:0%;
  transform: translateX(-50%);
}

.bottom .tooltip::after{
  top:-10px;
  left: 50%;
  transform: translateX(-50%) rotate(180deg);
}

.left .tooltip{ top:-20%; left:-110%; }

.left .tooltip::after{
  top:45%;
  left:100%;
  transform: rotate(-90deg);
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  transform: translateY(4px);

}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #000;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.range-slider-container {
    display: flex;
    flex-direction: column;
    gap: 6px;
    width: 100%;
}

.range-slider {
   width: 100%;
    height: 10px;
    border-radius: 5px;
    background: #d3d3d3;
    outline: none;
    opacity: 0.7;
    transition: background 0.3s;
    box-shadow:none !important;
}

.range-slider:hover {
  opacity: 1;
}

/* Remove focus outline on input */

.cobalt.autodesk360 .range-slider:focus {
    outline: none;
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
}

/* Thumb for Webkit browsers */
.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border: 0;
    background: #007bff;
    cursor: pointer;
}

/* Remove focus/active outline on Webkit thumb */
.range-slider:focus::-webkit-slider-thumb,
.range-slider::-webkit-slider-thumb:active {
    outline: none;
    box-shadow: none !important;
}

/* Thumb for Firefox */
.range-slider::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 0;
    background: #007bff;
}

/* Remove focus/active outline on Firefox thumb */
.range-slider:focus::-moz-range-thumb,
.range-slider::-moz-range-thumb:active {
    outline: none;
    box-shadow: none;
}

/* Track for Firefox */
.range-slider::-moz-range-track {
    height: 8px;
    border-radius: 5px;
    background: #ddd;
}

/* Track for IE/Edge */
.range-slider::-ms-track {
    width: 100%;
    height: 8px;
    background: transparent;
    border-color: transparent;
    color: transparent;
}

/* Filled track for IE/Edge */
.range-slider::-ms-fill-lower {
    background: #007bff;
    border-radius: 5px;
}

.range-slider::-ms-fill-upper {
    background: #ddd;
    border-radius: 5px;
}


/* Remove focus/active outline on IE/Edge thumb */
.range-slider:focus::-ms-thumb,
.range-slider::-ms-thumb:active {
    outline: none;
    box-shadow: none !important;
}

.cobalt.autodesk360 .info-icon {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #333;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;rw-b
  border: none;
  padding: 0;
}

.cobalt.autodesk360 .info-icon:hover {
  background-color: #d0d0d0;
}

#configurator div.panel-layout{

  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 2 equal columns */
  gap: 8px; /* spacing between buttons */
  width: 100%;           /* fill parent container */
  max-width: 100%;       /* prevent overflow */
}


.panel-button {
  display: flex;
  align-items: center;
  justify-content: center; /* centers text nicely */
  text-align: center;
  word-wrap: break-word;      /* break long words if needed */
  white-space: normal;        /* allow wrapping */
  box-sizing: border-box;
  width: 100%;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
}

.rw-button{
	height: var(--height--button);
	min-width: var(--min-width--button);
     border:1px solid black;
	border-radius: 13px;
     box-shadow: var(--box-shadow--primary-button);

	& label{
	    color: black;
	    margin:0;
	    padding:0;
	    width:100%;
	    height:100%;
	    text-align: center;
	    line-height: 2;


	}

	& label:hover{
	    cursor: pointer;
	}

	& input{
	    display:none !important;
	}
}

#configurator .rw-button label {
  color: black;
}

.rw-button:hover{
  background: #E4E4E4;
  color: #000;

}

.rw-button.disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: default;
}

/* [SO-OPTION-ROW] Exhaust Port / Bar Latch / One Point Latch rows */
.so-option-row {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.so-option-label {
  flex: 0 0 130px;
  font-weight: 600;
  font-size: 14px;
  padding-top: 6px;
}
.so-option-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  flex: 1 1 auto;
}
.so-sub-field {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.so-sub-label {
  font-size: 12px;
  color: #555;
}
.so-select {
  padding: 5px 8px;
  border: 1px solid black;
  border-radius: 6px;
  width: fit-content;
}



.btn-checked{
	background:#000;
}

.btn-checked label{
	color: #fff !important;
}


.footer-buttons-group {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin-top: auto;
	padding: 0 0 10px 0;
}

.finish-container, .doorOpt-container, .springType-container{
  display:flex;
  flex-direction: column;
  gap:6px;

}

.finish-layout{
  display: flex;
  gap:6px;
}

.finish-layout-btn{
  min-width: 100px;
}

#DEFAULTS_PLUGIN {
	margin: 8px 0 0 0;
	width: 100%;

	.defaults-button {
		all: unset;
		width: 125px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 0 5px 0;
		font-size: 16px;
		color: black;
		text-decoration: underline;
		font-weight: bold;
		cursor: pointer;
	}
}


#NEXT_PAGE_BUTTONS {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
	padding-top: 15px;
	width: 100%;
  gap:10px;
}

#NEXT_PAGE_BUTTONS button.button-configure {
    background: white;
    border: 2px solid black;
    color: black;
    font-size: 16px;
    font-weight: bold;
    border-radius: 20px;
    padding: 20px 0;
    width: 100%;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

#NEXT_PAGE_BUTTONS button.button-nextpage--back {
    background: white;
    border: 2px solid #654321;
    color: #654321;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    border-radius: 20px;
    padding: 20px 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

//#NEXT_PAGE_BUTTONS button.button-configure:hover {
//    background: #4a3018;
//    border-color: #4a3018;
//}

#NEXT_PAGE_BUTTONS button.button-nextpage{
	background: #3f3f3f;
     width: 100%;
     font-size: 16px;
     font-weight: bold;
     border-radius: 20px;

     padding: 20px 0;
     text-align: center;
     display: flex;
     align-items: center;
     justify-content: center;
	position: relative;
}

.rw-configurator__layout--right select{
	width: 100%;
}

#NAVIGATION_SPC {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	height: 75px;
	width: 100%;
	flex-shrink: 0;
	padding: 0 20px;
	box-sizing: border-box;
}

#NAVIGATION_SPC div.radio-layout--selected{
background:rgba(0,0,0,0);
border-bottom: 8px solid black;
}


div.radio-layout{
    border:none;
    border:radius:none;
    background:rgba(0,0,0,0);
    cursor: pointer; border-bottom: 1px solid black;
    padding-right:10px;
}

.postion-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin: 10px 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
	flex-shrink: 0;

	.window-position-container {
		display: flex;
		width: 100%;
		justify-content: center;
		flex-wrap: wrap;
		gap: 8px;

		.rw-button {
			padding: 8px 12px;
			flex: 1 1 70px;
			max-width: 120px;
		}
	}
}

.slim-options-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	padding: 4px;
	background:white;
	gap: 2px;
     border:1px solid black;
}


#configurator div.rw-configurator__layout{
	background: #fff;
	border-radius: 20px;
	/* height: 80vh;
	min-height: 940px; */
  height: calc(100vh - 110px);
  overflow: hidden;
}

#configurator div.rw-configurator__layout--left{
	background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(180,180,180,1) 100%);
	width:60%;
	border-radius: 20px 0px 0px 20px;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
#configurator div.rw-configurator__layout--right{
	width:40%;
	display:flex;
	flex-direction:column;
	padding: 0 30px 0 30px;
	height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}


.cobalt.autodesk360 .drawing_area, #rt2d_Landmark_door_img{
  background-color: transparent !important;
}
.cobalt.autodesk360 .rt2dViewport{
  box-shadow: none !important;
}

#configurator div.door-model-title {
	text-align: center;
	font-size: 22px;
}

#configurator div.door-model-container{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 0 10px 0;

    & input{
		display:none;
	}

    .door-model-container-label {
        display: flex;
        flex-direction: column;
        align-items: center;
	   padding: 0;

        span {
            display: block;
            line-height: 1.2;
        }

        span:first-of-type {
            font-size: 30px;
            color: black;
            font-weight: bold;
        }

        span:nth-of-type(2) {
            font-size: 30px;
            color: black;
        }
    }
}

#configurator div.color-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 50%;
    //padding: 1px;
    height: 50px;
    width: 50px;
}

#configurator div.color-button-container.selected {
    border: 2px solid #4d4a4a;
    background-color: #4d4a4a15;
}

#configurator div.color-button{
	width: 42px;
     height: 42px;
    
     background: #000;
     box-shadow: var(--box-shadow--primary-button);
     border-radius: 50%;
     display: flex;
     justify-content: center;
     align-items: center;
     box-sizing: border-box;

     & input{
		display:none;
	}
	& label {
       display: flex;
       justify-content: center;
       align-items: center;
       margin:0;
	  padding:0;
	  width:100%;
	  height:100%;
       position:relative;
	  bottom:-45px;
	  color:black;

}
}

.combined-button-container {
  display: flex;
  justify-content: left;
  align-items: center;

	.combined-button-container-inner {
	   display: flex;
	   justify-content: center;
	   align-items: center;
	   width: fit-content;
	   padding: 4px;
	   background-color: #fff;
	   border: 1px solid #ccc;
	   border-radius: 13px;


		.rw-sliding-button {
		    display: flex;
		    justify-content: center;
		    align-items: center;
		    margin: 0;
		    padding: 4px 16px;
		    border-collapse: separate;
		    outline: 0;
		    background: transparent;
		    font-size: 12px;
		    font-family: Helvetica;
		    color: #333;
		    border-radius: 10px;
		    box-sizing: border-box;
		    width: auto;
		    white-space: nowrap;
		    transition: background-color 0.2s ease, color 0.2s ease;

		    & label {
			 display: flex;
			 justify-content: center;
			 align-items: center;
			 text-align: center;
			 padding: 0;
			 margin: 0;
			 width: 100%;
			 height: 100%;
			 color: #888;
			 font-weight: 600;
			 line-height: 1.6;
			 padding-right: 0 !important;
		    }

			input {
				display: none;
			}
		}

		.rw-sliding-button.selected {
		  background: #000 !important;
		}

		.rw-sliding-button.selected label {
		  color: #fff !important;
		  font-weight: 700;
		}

		.rw-sliding-button label:hover {
		  cursor: pointer;
		}

		.rw-sliding-button.disabled {
		  cursor: not-allowed;
		  pointer-events: none;
		}
		.rw-sliding-button.disabled:not(.selected) label {
		  opacity: 0.35;
		}

	}
}

/* Faded look for selects showing a non-applicable placeholder (e.g. Bottom Seal "None"). */
select.is-placeholder {
  color: #999;
  opacity: 0.7;
}

/* Cap visible width of selects with long labels. The full label still shows
   inside the opened dropdown menu (browsers render <option> at intrinsic width),
   only the closed-state display gets truncated with an ellipsis. */
select.long-select {
  max-width: 240px;
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}





#configurator div.color-button:hover {
	cursor: pointer;
}


#configurator div.color-button--brown{
    background: #654321;
    border: 2px solid #4a3018;

    &:active{
        background: #4a3018;
    }
}
#configurator div.color-button--anthracite{
	background: #708090;
	border: 2px solid #151B54;

	&:active{
		background:#2d333a;
	}
}
#configurator div.color-button--white{
	background: #fff;
    	border: 2px solid grey;

     &:active{
	    background: #b8b8b8;
     }
}
#configurator div.color-button--silver{
	background: #C0C0C0;
	border: 2px solid #a0a0a0;

	&:active{
		background: #a8a8a8;
	}
}
#configurator div.color-button--iron-ore{
	background: #43464B;
	border: 2px solid #2c2e31;

	&:active{
		background: #2c2e31;
	}
}
#configurator div.color-button--sandstone{
	background: #D2B48C;
	border: 2px solid #a8895f;

	&:active{
		background: #a8895f;
	}
}
#configurator div.color-button--black{
	background: #000000;
	border: 2px solid #333333;

	&:active{
		background: #1a1a1a;
	}
}
#configurator div.color-button--almond{
	background: #EFDECD;
	border: 2px solid #c9b59a;

	&:active{
		background: #c9b59a;
	}
}

#configurator .color-row {
	display: flex;
	align-items: center;
	gap: 4px;
	margin-bottom: 6px;
	flex-wrap: nowrap;
	min-height: 54px;
}

#configurator .color-divider {
	width: 1px;
	align-self: stretch;
	background: #c9c9c9;
	margin: 4px 2px;
}

/* [COLOUR-GROUPS] primary/secondary swatch groups, click-to-expand */
#configurator .color-group {
	display: flex;
	align-items: center;
	height: 50px;
	position: relative;
	transition: gap 0.25s ease;
}

#configurator .color-group.expanded {
	gap: 4px;
}

#configurator .color-group.collapsed {
	gap: 0;
	cursor: pointer;
	padding: 0 2px;
}

/* Collapsed group: stack the swatches with overlap so they "peek". */
#configurator .color-group.collapsed .color-button-container {
	margin-left: -26px;
	transition: margin-left 0.25s ease;
	pointer-events: none; /* clicks go to the group, not individual swatches */
}

#configurator .color-group.collapsed .color-button-container:first-child {
	margin-left: 0;
}

#configurator .color-group.expanded .color-button-container {
	margin-left: 0;
	transition: margin-left 0.25s ease;
}

/* "View Other Colors" tooltip on a collapsed group (hover the whole stack). */
#configurator .color-group.collapsed::after {
	content: "View Other Colors";
	position: absolute;
	bottom: calc(100% + 6px);
	left: 50%;
	transform: translateX(-50%);
	background: #2a2a2a;
	color: #fff;
	font-size: 12px;
	font-weight: 500;
	padding: 4px 8px;
	border-radius: 4px;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease;
	z-index: 10;
}

#configurator .color-group.collapsed:hover::after {
	opacity: 1;
}

/* Tooltip with the colour name on hover (uses data-tooltip attr).
   Applies to any swatch in #COLOR_ROW, except when nested in a collapsed
   group (the group itself shows "View Other Colors" instead). */
#configurator #COLOR_ROW .color-button {
	position: relative;
}

#configurator #COLOR_ROW .color-button::after {
	content: attr(data-tooltip);
	position: absolute;
	bottom: calc(100% + 6px);
	left: 50%;
	transform: translateX(-50%);
	background: #2a2a2a;
	color: #fff;
	font-size: 12px;
	font-weight: 500;
	padding: 4px 8px;
	border-radius: 4px;
	white-space: nowrap;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.15s ease;
	z-index: 10;
}

#configurator #COLOR_ROW .color-button:hover::after {
	opacity: 1;
}

/* Suppress per-swatch tooltip inside a collapsed group — the group's
   "View Other Colors" tooltip handles that case. */
#configurator .color-group.collapsed .color-button::after {
	content: none;
}

/* Hide the bottom-anchored colour name label when in tooltip mode — the
   tooltip replaces it for the per-model dynamic swatches. */
#configurator #COLOR_ROW .color-button label.door-color-text {
	display: none;
}


#configurator .color-button {
  label.rw-text.door-color-text.selected {
     font-weight: bold;
	font-size: 14px;
  }
}

#configurator .color-button {
  label.rw-text.door-color-text {
     font-weight: normal;
	font-size: 14px;
  }
}



#configurator div.dimension-layout{
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap:6px;
}

/* Default: 3 per row */
#configurator .dimension-layout .rw-button {
    flex: 0 0 calc(33.333% - 6px);
    min-width: 0;
    max-width: calc(33.333% - 6px);
    box-sizing: border-box;
}


.dim-button-container{
display:flex;justify-content:space-evenly;
height: 75px;
	button{
	width:15%;
	border-radius:4px;
	border:1px solid lightblue;
	box-shadow: var(--box-shadow--primary-button);
	align-items: center;
     justify-content: center;
}
}


.rw-image-input{
  display:flex;
  justify-content:space-between;
height:100px;
  a{
    width:25%;
  }
  img{
	width:100%;
height:100%;
}
  .overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  transition: .5s ease;
  background-color: #008CBA;
}

  .image-input-cell{
    display: flex;
    flex-direction: column;
    width: fit-content;
    height: 100%;
    justify-content: center;
    padding: 8px;
  }

}

.overlay:hover {
  opacity: 0.25;
}

.rw-text{
	font-size: 1rem;
	line-height: 1.5rem;
	font-weight:bold;
}

#DOOR_SUMMARY_LABEL {
	font-size: 1.1rem;
}

#DOOR_SUMMARY_VALUE {
	font-size: 14px;
     font-family: 'Karla', Arial, sans-serif;
	line-height: 1.5rem;
	margin: 0px, 0px, 5px;
	color: #333333
}

.config-title-style {
	font-size: 14px;
     font-family: 'Karla', Arial, sans-serif;
	line-height: 1.5rem;
	margin: 0px, 0px, 5px;
	font-weight: bold;
	color: #333333
}

.config-option-title-style {
	margin-top: 12px;
	font-size: 14px;
     font-family: 'Karla', Arial, sans-serif;
	line-height: 1.5rem;
	margin: 0px, 0px, 5px;
	font-weight: bold;
	color: #333333
}

.config-option-label-style {
	font-size: 1.1rem;
	line-height: 1.5rem;
	font-style: italic;
	font-weight: normal;
}




#rw-diff-text {
	text-align: center;
}


.rw-warning{
color:red;
}

.rw-button-back {

        background: linear-gradient(#ff4747 0%, #d72430 100%);
	clip-path: polygon(100% 0%,
                   100% 100%,
                    0% 50%);
    }
.rw-button-forward {

        background: linear-gradient(#ff4747 0%, #d72430 100%);
	clip-path: polygon(0% 0%,
                   100% 50%,
                    0% 100%);
}
.rw-arrow-button{
 color: rgba(0,0,0,0);
        border: transparent;
        border-radius: 4px;
        min-height: 50px;
    min-width: 30px;
max-width:30px;
}
.rw-configurator{
width:100%;
display:flex;
flex-direction:column;
row-gap:30px;

}

.rw-configurator__layout {
     display: flex;
     justify-content:space-evenly;
     align-items:flex-start;
     margin-top:20px;
}

.rw-configurator__select{
    width:auto;
    display:flex;
    flex-direction:row;
    justify-content:space-evenly;
    /*border-bottom: 1px solid black;
    gap:10px; */
    overflow-x: auto;
}

/* Optional: Beauty scrollbar */
#NAVIGATION_SPC::-webkit-scrollbar {
    height: 6px;
}

#NAVIGATION_SPC::-webkit-scrollbar-thumb {
    background: #999;
    border-radius: 10px;
}


.radio-layout{
	display:flex;
	flex-direction:column;
	align-items: center;

}

.rw-configurator select.spc__select, .rw-configurator input.spc__select{
width:210px;
}
.horizontal-inputs{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
  column-gap:12px;
  width:100%;
   select {
    width:100%;
   }

}
.horizontal-inputs--quantity{
justify-content:flex-start;
column-gap:0px;

div:nth-child(1){
flex-grow:3;
}
	div:nth-child(2){
		flex-grow:1;
	}
}
.horizontal-inputs select.spc__select, .horizontal-inputs input.spc__select{
width:auto;
}

.horizontal-inputs.jamb-seal-inputs{
	flex-direction:column;

	div {
		width: 100%;
	}

	.jamb-seal-design {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		column-gap: 12px;
		width: 100%;
	}
}

.rw-button-container{
    display: flex;
    justify-content: space-evenly;
    margin-top: 2rem;
}
.rw-configurator__page{
    display:flex;
    flex-direction:column;
    flex-wrap:wrap;
    row-gap:8px;
    width:100%;
    padding-top: 10px;
    padding-bottom: 20px;


	input {
		width: 100%;
		box-sizing: border-box;
	}
}

.rw-doorsize-input{
display:flex;
align-items:baseline;
}
.rw-doorsize-label{
	width:20%;
}
.rw-doorsize{
width:50%;
}
.rw-configurator__page--sections{
display:flex;
flex-direction:row;
column-gap:20px;
}
.sectionoptions{
display:flex;
flex-direction:column;
row-gap:8px;
}
.springs-scroll{
	height:100%;
	overflow:scroll;
}
.unselectable-text {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
option--disabled {
	display:none;
}

<!-- Implementing CSS Ivan-->
.chevron-model-container {

}

.chevron-outer-container {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	right: 10px;
	width: 30px;
	height: 30px;
	border-radius: 50%;
	background-color: white;
	box-sizing: border-box;
	padding: 5px;
}

.operator-carousel-outer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}


#operator-carousel-container {
	display: flex;
	transition: transform 0.3s ease;
	/*flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 300px;
	transition: transform 0.4s ease;*/
}

#operator-carousel-container.no-transition {
	transition: none !important;
}


.operator-group-container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	min-height: 100px;
	width: 100%;
	position: relative;

	h2 {
		font-size: 1.2rem;
		line-height: 1.5rem;
		font-weight: normal;
		color: #3f3f3f;
		text-align: center;
	}

}

.carousel-container-slide {
	 width: 100%;
	 overflow: hidden;
	 position: relative;
}

.operator-main-title {
	width: 100%;
	font-size: 1.2rem;
	line-height: 1.5rem;
	font-weight: normal;
	color: #3f3f3f;
	text-align: center;
}


.carousel-operator-item {
  flex: 0 0 100%;
  max-width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  transition: opacity 1s ease;
  position: relative;
}


.carousel-operator-item h3 {
  position: absolute;
  bottom: 5px;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.carousel-operator-image {
  max-width: 200px;
  max-height: 200px;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  //align-items: center;
}

.carousel-operator-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}


.carousel-operator-item.active {
    opacity: 1;
}


.next-button-carousel {
	display:flex;
	justify-content: center;
	align-items: center;
	height: 30px;
	width: 30px;
	position: absolute;
	right: 15%;
	bottom: 0px;
}

.next-button-carousel:hover {
	cursor: pointer;
}


.prev-button-carousel {
	display:flex;
	justify-content: center;
	align-items: center;
	height: 30px;
	width: 30px;
	position: absolute;
	left: 15%;
	bottom: 0px
}

.prev-button-carousel:hover {
	cursor: pointer;
}

.chevron-icon-prev {
	width: 25px
	height: 25px;
	fill: #000;
}


.setOpacityZero {
	//opacity: 0;
}

#configurator div.rw-button{
	height: var(--height--button);

	& label{
	    display: flex;
	    justify-content: center;
	    align-items: center;
         padding: 5px;
	    font-size: 14px;
      text-wrap:auto;
	}

	& label:hover{
	    cursor: pointer;
	}

	& input{
	    display:none;
	}
}

.carousel-operator-item h3 {
  font-size: 14px;
}

.next-button-carousel {
	height: 25px;
	width: 25px;
}

.prev-button-carousel {
	height: 25px;
	width: 25px;
}

.chevron-icon-prev {
	width: 20px
	height: 20px;
}

.config-option-label-style {
	font-size: 0.85rem;
}


.window-position-container {
	width: 100%;
}

#DOOR_PROPERTIES{
   display: flex;
    justify-content: flex-end; /* price always on the right */
    align-items: center;       /* vertically center price */
    padding-top: 20px;         /* keep spacing from top */
    padding-left: 10px;        /* optional small side padding */
    padding-right: 10px;       /* optional small side padding */
    box-sizing: border-box;    /* include padding in width */
    width: 100%;

}

/* qty button css */
.cobalt.autodesk360 .quantity-field {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: var(--height--button);
}

.cobalt.autodesk360 .quantity-field .value-button{
  border: 1px solid #000;
  margin: 0px;
  background: #eee;
  outline: none;
  cursor: pointer;
  width: 50px !important;
  min-width: 30px !important;
  color: #000;
}

.cobalt.autodesk360 .quantity-field .value-button:hover {
  background: #E4E4E4
}

.cobalt.autodesk360 .quantity-field .value-button:active{
  background: rgb(210, 210, 210);
}

.cobalt.autodesk360 .quantity-field .decrease-button {
  border-radius: 8px 0 0 8px;
}

.cobalt.autodesk360 .quantity-field .increase-button {
  margin-left: -4px;
  border-radius: 0 8px 8px 0;
}

.cobalt.autodesk360 .quantity-field .number{
  display: inline-block;
  text-align: center;
  border: none;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  margin: 0px;
  width: 40px;
  height: 100%;
  line-height: 35px;
  font-size: 11pt;
  box-sizing: border-box;
  background: white;
  font-family: calibri;
}

.cobalt.autodesk360 .quantity-field .number::selection{
  background: none;
}


@media (max-width: 1024px) {

  #configurator div.rw-configurator__layout{
    height: calc(100vh - 160px);
  }

    #configurator div.rw-configurator__layout--right{
        padding: 0 20px 0 20px;
        flex: 1 1 0;
    }

    #DOOR_PROPERTIES {
      padding-right:50px;
    }

    #configurator div.dimension-layout {
      justify-content: space-around;
    }

    #configurator .dimension-layout .rw-button {
        flex: 0 1 40%
    }
    #configurator div.panel-layout{
          grid-template-columns: repeat(2, 1fr);
          width: 100%;

    }

    .rw-configurator__select{
      padding: 0 20px;
    }
}


@media (min-width: 1025px) and (max-width: 1600px) {

 #configurator div.rw-configurator__layout{
    height: calc(100vh - 150px);
  }

	#configurator div.color-button-container{
		width:50px;
		height:50px;
	}

	#configurator div.color-button .color-image, .stacked-optional-img{
		width:40px;
		height:40px;
	}

	.colorChooser{
		gap: 0px;
	}

}

.rw-button-container-inner {
	   display: flex;
	   justify-content: center;
	   align-items: center;
	   padding: 5px;
	   background-color: #fff;
	   border-radius: 13px;
		border: 1px solid black;
}

.rw-button-container-inner.selected {
	background-color: yellow;
}


@media (min-width: 1600px) and (max-width: 2600px) {



}

#GLAZING_OPTIONS .dimension-layout {
    width: 100%;
    justify-content: flex-start;
}

#GLAZING_OPTIONS .dimension-layout .rw-button {
    flex: 0 0 calc(33.333% - 6px);
    max-width: calc(33.333% - 6px);
    min-width: 0;
    box-sizing: border-box;
}

/* Glazing colour button row */
#GLAZING_OPTIONS > div[style*="display:flex"] {
    gap: 6px !important;
}

#GLAZING_OPTIONS > div[style*="display:flex"] .rw-button {
    flex: 0 0 calc(33.333% - 6px);
    max-width: calc(33.333% - 6px);
    min-width: 0;
    box-sizing: border-box;
}

/* Remove position container from flow when hidden so it doesn't push canvas down */
.postion-container.hidden {
    display: none !important;
}

#CANVAS_PLUGIN {
    flex: 1;
    min-height: 0;
    display: flex !important;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
}

#CONFIG_CANVAS {
    display: block;
    width: auto !important;
    height: auto !important;
    max-width: 100%;
    max-height: 100%;
    aspect-ratio: 1400 / 1000;
}

@media (max-width: 1366px) {
    .postion-container .window-position-container {
        max-width: 100%;
    }

    #configurator div.rw-configurator__layout--left {
        width: 55%;
    }

    #configurator div.rw-configurator__layout--right {
        width: 45%;
    }
}

@media (max-width: 900px) {
    #configurator div.rw-configurator__layout {
        flex-direction: column;
        height: auto;
        overflow: visible;
    }

    #configurator div.rw-configurator__layout--left,
    #configurator div.rw-configurator__layout--right {
        width: 100%;
        border-radius: 20px;
        height: auto;
    }

    #CANVAS_PLUGIN {
        min-height: 300px;
    }

    #CONFIG_CANVAS {
        max-height: 50vw;
    }
}

/* ===== [SECTION-OPTIONS-RESPONSIVE] keep Section Options rows tidy at any width ===== */
#SECTION_OPTIONS .dimension-layout {
    flex-wrap: wrap;
    gap: 8px;
}
#SECTION_OPTIONS select {
    box-sizing: border-box;
}
/* Compound rows (Exhaust Port / Bar Latch / One Point Latch) wrap their dropdowns
   instead of overflowing when the right pane is narrow. */
#SECTION_OPTIONS > div[style*="display:flex"] {
    flex-wrap: wrap;
    row-gap: 8px;
}

/* Section Options buttons — uniform sizing, short labels stay compact, long ones wrap cleanly. */
#SECTION_OPTIONS .dimension-layout {
    gap: 6px;
}
#SECTION_OPTIONS .dimension-layout .rw-button {
    flex: 0 0 auto;
    width: auto;
    min-width: 80px;
    max-width: 220px;
    height: auto;
    min-height: var(--height--button);
    padding: 6px 14px;
    white-space: normal;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
#SECTION_OPTIONS .dimension-layout .rw-button label {
    line-height: 1.25;
    height: auto;
    white-space: normal;
    text-align: center;
    padding: 0;
    cursor: pointer;
}

@media (max-width: 1366px) {
    /* Compound row label width softens on narrow screens so dropdowns get more room. */
    #SECTION_OPTIONS > div[style*="display:flex"] > span.config-option-title-style {
        min-width: 100px !important;
    }
}

@media (max-width: 900px) {
    #SECTION_OPTIONS > div[style*="display:flex"] > span.config-option-title-style {
        min-width: 100% !important;
    }
}

/* [WEIGHT-MODIFIER] Weight Modifier subsection on the Advanced tab. Inline
   Label-Value summary above a flat slider (no card / boxes). Slider styled
   to match the Landmark example: thin track, purple fill to the thumb. */
.weight-modifier {
    margin-top: 18px;
    padding-top: 12px;
    border-top: 1px solid #ddd;
}
.weight-modifier-title {
    font-weight: 700;
    font-size: 15px;
    margin-bottom: 8px;
    color: #333;
}
.weight-modifier-summary {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #333;
    margin-bottom: 10px;
}
.weight-modifier-stat {
    white-space: nowrap;
}
.weight-modifier-stat--result {
    font-weight: 700;
}
.weight-modifier-divider {
    color: #999;
}
/* Slider reuses the Landmark .range-slider base (grey 10px track, 20px thumb,
   opacity hover). These overrides switch the thumb to a purple circle and
   render a purple progress fill on the left side of the track up to the thumb.
   --fill is set in JS as a 0-100% string based on slider position. */
.weight-modifier-slider {
    background: linear-gradient(
        to right,
        #b86bd1 0%,
        #b86bd1 var(--fill, 50%),
        transparent var(--fill, 50%),
        transparent 100%
    ) !important;
    border: 1px solid #000 !important;
    padding: 0 !important;
}
.weight-modifier-slider::-webkit-slider-thumb {
    border-radius: 50%;
    background: #b86bd1;
}
.weight-modifier-slider::-moz-range-thumb {
    border-radius: 50%;
    background: #b86bd1;
}
.weight-modifier-slider::-moz-range-progress {
    background: #b86bd1;
}
.weight-modifier-slider::-ms-fill-lower {
    background: #b86bd1;
}

/* [HARDWARE-TAB-FACE-ONLY] hide the Hardware tab in the nav when Door Face Only is selected.
   Toggled via the .face-only class added to #configurator by load_html.js. The framework
   wraps each tab in a div.radio-layout with id="tab_N" matching the section's index.
   #section_select uses justify-content: space-evenly, which would leave wide gaps when
   a tab is removed — collapse the missing tab visually rather than hiding it via display:none. */
.face-only #tab_2 {
    visibility: hidden !important;
    width: 0 !important;
    min-width: 0 !important;
    max-width: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    pointer-events: none !important;
}

/* [HARDWARE-LAYOUT] When the Hardware tab is active, hide the canvas + window-
   position picker on the left pane. The Drums & Cables and Springing Solutions
   tables get moved into #HW_LEFT_PANE_LANDING (which JS un-hides). The nav bar
   at the top of the left pane stays visible. The left pane keeps its grey
   radial gradient — table cards have their own borders + light fill so they
   stay readable against it. */
#configurator.hardware-active #CANVAS_PLUGIN,
#configurator.hardware-active .postion-container {
    display: none !important;
}
#configurator.hardware-active #HW_LEFT_PANE_LANDING {
    flex: 1 1 auto;
    overflow: hidden;
    padding: 0 24px;
}
#configurator.hardware-active #HW_LEFT_PANE_LANDING #drums_cables_section,
#configurator.hardware-active #HW_LEFT_PANE_LANDING #springing_solutions_section {
    border: 1px solid #d0d4d9;
    border-radius: 8px;
    padding: 14px 18px;
    margin-top: 18px;
    background: #fafbfc;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}
#configurator.hardware-active #HW_LEFT_PANE_LANDING #drums_cables_section:first-child {
    margin-top: 10px;
}
#configurator.hardware-active #HW_LEFT_PANE_LANDING #springing_solutions_section {
    margin-bottom: 60px;
}
/* Section headings inside each card — thinner spacing to save vertical room. */
#configurator.hardware-active #HW_LEFT_PANE_LANDING #drums_cables_section > div:first-child,
#configurator.hardware-active #HW_LEFT_PANE_LANDING #springing_solutions_section > div:first-child {
    border-bottom: 1px solid #e3e6ea;
    padding-bottom: 6px;
    margin-bottom: 8px;
    font-size: 14px;
}
/* Shrink table cells when on the left pane so both tables fit without scrolling. */
#configurator.hardware-active #HW_LEFT_PANE_LANDING .hw-option-table {
    font-size: 12px;
}
#configurator.hardware-active #HW_LEFT_PANE_LANDING .hw-option-table th,
#configurator.hardware-active #HW_LEFT_PANE_LANDING .hw-option-table td {
    padding: 7px 10px !important;
}

`
  const stylesheet = document.createElement('style')
  stylesheet.setAttribute('id', 'spcSheet')
  stylesheet.innerText = styles;
  document.head.appendChild(stylesheet);


}
