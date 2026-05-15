# Thermatite V2 Configurator

## Project layout

```
load_html/
├── src/
│   ├── load/            DOM construction + initial state wiring
│   │   ├── load_html.js         Builds the entire configurator form as one HTML string
│   │   ├── load_canvas.js       Sets up the door preview canvas
│   │   ├── load_styles.js       Injects stylesheet
│   │   ├── load_drive_inputs.js Wires driver inputs (model / wind / sections / width)
│   │   ├── load_global_nodes.js Global DOM node references
│   │   └── load_jde_nodes.js    JDE-specific node references
│   ├── controllers/     Runtime behavior + cross-field reactions
│   │   ├── canvas_controller.js
│   │   ├── global_data_controller.js
│   │   ├── price_controller.js
│   │   └── weight_controller.js
│   └── logic/           Pure rules and validation
│       ├── truss_style_logic.js  Allowed truss styles per model/wind/sections/width
│       ├── truss_schedule.js     Truss scheduling
│       ├── section_bundles.js    Section bundling rules
│       ├── glazing_code.js       Window/glazing options
│       └── final_validation.js   End-to-end validation
├── tests/               Browser-runnable test files
├── tools/
│   └── scrape_truss.js  DevTools-pasteable scraper for capturing config snapshots
├── data/
│   └── truss_excel/     Source CSVs the truss rules were derived from
└── docs/                Notes and changelog
```
