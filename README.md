# Thermatite Door Configurator

A browser-based configurator for Thermatite industrial overhead doors. Users pick a door model, dimensions, and options; the app validates the combination against engineering rules, renders a live preview, and reports pricing and weight.

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

## Door models

The configurator supports the **T-series** door family: T150, T175, T200, T300, T200-20, T200C, T150U, T175U, T200U, U200C.

Each model has its own constraints for:
- Width / height ranges
- Number of sections
- Allowed truss styles (varies by wind load: basic / 15psf / 20psf and section count: ≤5 vs >5)
- End cap availability
- Patterns, colours, hardware

## Form structure

The form is split into tabbed sections rendered into the right pane:

- **Door Model** — model, dimensions, sections, pattern, colour, end caps, top weather seal, bottom retainer
- **Advanced** — bottom seal, wind load, truss style, roller style, hinges, step plate, exhaust port, bar latch, one-point latch
- **Glazing** — window selection, colour, tempering
- **Hardware** — lift type, highlift, jamb, hanger angle, shaft type
- **Operator Options** — operator selection, transmitter, control panel, keyless entry
- **Annotations** — tags / contractor / architect / reference / client

## Running locally

This is a client-side bundle injected into a host configurator framework. `load_html.js` defines `loadForm()` which builds the form markup and appends it to `.concept-ui-form.scrollable` in the host page. There is no build step.

## Truss style rules

The most complex logic lives in [`src/logic/truss_style_logic.js`](src/logic/truss_style_logic.js). It encodes which of the 11 truss style codes are allowed for each `(model, wind, section bucket, width interval)` combination, derived from the engineering tables in `data/truss_excel/`.

Each rule slice has the shape:
```js
{ model, wind, secBucket, intervals: [{ hi, exclude, allowedExtras? }, ...] }
```

A width `w` matches the interval where `prevHi < w ≤ hi`. The allowed styles are the full 11-style universe minus `exclude`, minus opt-in codes not present in `allowedExtras`, minus codes that don't apply to the section count.

## Testing

Browser-runnable tests in `tests/` introspect `TRUSS_STYLE_RULES` and assert boundary behavior for every slice. Paste the file contents into the configurator's DevTools console to run.
