/* =========================================================================
   Thermatite — truss_style_logic.js
   =========================================================================
   Filters the TRUSS_STYLE <select> based on (DOOR_MODEL, WindLoad, WIDTH,
   NUM_OF_SEC). Rule data lives in TRUSS_STYLE_RULES below — one entry per
   (model, wind, secBucket) slice. Each interval lists style CODES to EXCLUDE
   from the master 11-style dropdown for that width range.

   DATA SOURCE
     truss.csv (per slice) — collapsed at transcription time so each interval
     captures a distinct exclusion list (consecutive identical rows merged,
     small width gaps closed by extending the lower bucket up).

   STYLE CODES
     CSV uses short codes (e.g. "T2.5x18TopBtmLTE5SEC"). The dropdown uses
     long human-readable values (e.g. "T 2.5 x 18 Top and Bottom only" — see
     load_html.js:518-528). TRUSS_STYLE_CODE_TO_OPTION maps one to the other.

   SECTION AUTO-EXCLUSION
     Codes containing "GT5" only apply when sections > 5; "LTE5" only when
     sections <= 5. These are auto-excluded based on the user's NUM_OF_SEC,
     stacked on top of the rule's engineering exclusions.

   SPECIAL STATUSES
     NO_OPTIONS        - dropdown shows "No truss style available"
     EXCEEDS_CAPACITY  - dropdown shows "Door width exceeds capacity"
   ========================================================================= */

const TRUSS_STYLE_CODE_TO_OPTION = {
  "None":                          "none",
  "T2.5x18Top":                    "T 2.5 x 18 Top Section only",
  "T2.5x18TopBtmLTE5SEC":          "T 2.5 x 18 Top and Bottom only",
  "T2.5x18TopBtmEvery2ndGT5SEC":   "T 2.5 x 18 Top, bottom, and every 2nd section",
  "T2.5x18EverySection":           "T 2.5 x 18 Every section",
  "T3.625x18TopBtmLTE5SEC":        "T 3.625 x 18 Top and bottom",
  "T3.625x18TopBtmEvery2ndGT5SEC": "T 3.625 x 18 Top, bottom and every 2nd section",
  "T3.625x18EverySection":         "T 3.625 x 18 Every section",
  "T4.0x16TopBtmLTE5SEC":          "T 4.0 x 16 Top and bottom",
  "T4.0x16TopBtmEvery2ndGT5EC":    "T 4.0 x 16 Top, bottom and every 2nd section",
  "T4.0x16EverySection":           "T 4.0 x 16 Every section",
  "HatTruss":                      "0.049 Hat Truss",
  "HatTruss_UbarTruss":            "0.049 Hat Truss and Ubar Truss",
  // U-series codes. User-facing labels are placeholders — to be confirmed.
  "1_16GaSTDTrussEvery2ndSection":  "1 16Ga STD Truss Every 2nd Section",
  "1_16GaSTDTrussEverySection":     "1 16Ga STD Truss Every Section",
  "2_16GaSTDTrussesEverySection":   "2 16Ga STD Trusses Every Section",
  "1_HatTrussPerSection":           "1 Hat Truss Per Section",
  "1_HatTruss18GaU-barperSection":  "1 Hat Truss 18Ga U-bar per Section",
  "U_UBAR":                         "U Ubar",
  "U_UBAR_20ga_Top":                "U Ubar 20ga Top",
  "U_UBAR_20ga_ES":                 "U Ubar 20ga Every Section",
  "U_UBAR_18ga_ES":                 "U Ubar 18ga Every Section",
};

const TRUSS_STYLE_ALL_CODES = Object.keys(TRUSS_STYLE_CODE_TO_OPTION);

const TRUSS_STYLE_NO_OPTIONS = "__NO_OPTIONS__";
const TRUSS_STYLE_EXCEEDS_CAPACITY = "__EXCEEDS_CAPACITY__";

// Codes that are NEVER allowed unless an interval explicitly opts them in
// via `allowedExtras`. HatTruss / HatTruss_UbarTruss only apply to wide T175+
// doors; without this gate they would leak into every model's dropdown.
const TRUSS_STYLE_OPT_IN_CODES = [
  "HatTruss", "HatTruss_UbarTruss",
  // U-series codes are opt-in so they never appear in T-series (T150/T175/T200/T300/T200-20/T200C) slices.
  // Each U-series slice opts in the specific codes it needs via `allowedExtras`.
  "1_16GaSTDTrussEvery2ndSection",
  "1_16GaSTDTrussEverySection",
  "2_16GaSTDTrussesEverySection",
  "1_HatTrussPerSection",
  "1_HatTruss18GaU-barperSection",
  "U_UBAR",
  "U_UBAR_20ga_Top",
  "U_UBAR_20ga_ES",
  "U_UBAR_18ga_ES",
];

// Rule slices. secBucket: "lte5" if sections <= 5, "gt5" if > 5.
// Each interval { hi, exclude } means prevHi < width <= hi (first interval's
// effective lower bound is 0). exclude is either an array of style codes or
// one of the special status sentinels.
const TRUSS_STYLE_RULES = [
  {
    // T150 / basic (10psf) / sections <= 5. Source: T150-basic-lte5.csv.
    // T150 max width is 24'2" (290"). Intervals capped at 290.
    model: "T150", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 176 /* 14'8"  */, exclude: ["T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 224 /* 18'8"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 240 /* 20'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 245 /* 20'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 262 /* 21'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 265 /* 22'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 278 /* 23'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
    ],
  },
  {
    // T150 / basic (10psf) / sections > 5. Source: T150-10-gte5.csv.
    // T150 max width is 24'2" (290"). Intervals capped at 290.
    model: "T150", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 152 /* 12'8"  */, exclude: [] },
      { hi: 164 /* 13'8"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 168 /* 14'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 169 /* 14'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 176 /* 14'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 182 /* 15'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 191 /* 15'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 202 /* 16'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 211 /* 17'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 218 /* 18'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection"] },
      { hi: 240 /* 20'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC", "T3.625x18EverySection"] },
    ],
  },
  {
    // T150 / 15psf / sections <= 5. Source: T150-15-lte5.csv.
    // T150 max width is 24'2" (290"). Intervals capped at 290.
    model: "T150", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 181 /* 15'1"  */, exclude: ["T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 210 /* 17'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top"] },
      { hi: 241 /* 20'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 246 /* 20'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 263 /* 21'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 266 /* 22'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 280 /* 23'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
    ],
  },
  {
    // T150 / 15psf / sections > 5. Source: T150-15-gte5.csv.
    // T150 max width is 24'2" (290"). Intervals capped at 290.
    model: "T150", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 181 /* 15'1"  */, exclude: [] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top"] },
      { hi: 241 /* 20'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 263 /* 21'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 280 /* 23'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection"] },
    ],
  },
  {
    // T150 / 20psf / sections ≤ 5. Source: T150-20psf-Less than 5.csv.
    // T150 max width is 24'2" (290"); intervals beyond that are unreachable.
    model: "T150", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 127 /* 10'7"  */, exclude: [] },
      { hi: 156 /* 13'0"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 168 /* 14'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 173 /* 14'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 174 /* 14'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 181 /* 15'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 193 /* 16'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 204 /* 17'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection"] },
      { hi: 211 /* 17'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 245 /* 20'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC", "T3.625x18EverySection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150 / 20psf / sections > 5. Source: T150-20psf-Greaterthan5.csv.
    // T150 max width is 24'2" (290"); intervals beyond that are unreachable.
    model: "T150", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 127 /* 10'7"  */, exclude: [] },
      { hi: 156 /* 13'0"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 184 /* 15'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 186 /* 15'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 193 /* 16'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 194 /* 16'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 216 /* 18'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 222 /* 18'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 239 /* 19'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / basic (10psf) / sections <= 5. Source: T175-basic-lte5.csv.
    // T175 max width is 40'2" (482"). Past 432": EXCEEDS_CAPACITY.
    model: "T175", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 204 /* 17'0"  */, exclude: [] },
      { hi: 256 /* 21'4"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 275 /* 22'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 302 /* 25'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 305 /* 25'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 308 /* 25'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 316 /* 26'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 368 /* 30'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 410 /* 34'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 432 /* 36'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / basic (10psf) / sections > 5. Source: T175-10-gte5.csv.
    model: "T175", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 184 /* 15'4"  */, exclude: [] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 276 /* 23'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 304 /* 25'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 306 /* 25'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 308 /* 25'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 368 /* 30'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 421 /* 35'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 461 /* 38'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / 15psf / sections <= 5. Source: T175-15-lte5.csv.
    model: "T175", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 187 /* 15'7"  */, exclude: [] },
      { hi: 216 /* 18'0"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 226 /* 18'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 229 /* 19'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 243 /* 20'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 249 /* 20'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 253 /* 21'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 275 /* 22'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18EverySection"] },
      { hi: 301 /* 25'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 361 /* 30'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 421 /* 35'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / 15psf / sections > 5. Source: T175-15-gte5.csv.
    model: "T175", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 187 /* 15'7"  */, exclude: [] },
      { hi: 229 /* 19'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 243 /* 20'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 275 /* 22'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 301 /* 25'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 361 /* 30'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 421 /* 35'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / 20psf / sections <= 5. Source: T175-20-lte5.csv.
    model: "T175", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 161 /* 13'5"  */, exclude: [] },
      { hi: 185 /* 15'5"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 193 /* 16'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 197 /* 16'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 208 /* 17'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 213 /* 17'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 220 /* 18'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 235 /* 19'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection"] },
      { hi: 260 /* 21'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 306 /* 25'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 363 /* 30'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175 / 20psf / sections > 5. Source: T175-20-gte5.csv.
    model: "T175", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 161 /* 13'5"  */, exclude: [] },
      { hi: 197 /* 16'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 220 /* 18'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 235 /* 19'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 260 /* 21'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 306 /* 25'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 363 /* 30'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 482 /* 40'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200 / basic (10psf) / sections <= 5. Source: T200-10-lte5.csv.
    // T200 max width is 38'0" (456"). Past 408": EXCEEDS_CAPACITY.
    model: "T200", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 204 /* 17'0"  */, exclude: [] },
      { hi: 253 /* 21'1"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 271 /* 22'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 275 /* 22'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 305 /* 25'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 308 /* 25'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 335 /* 27'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 368 /* 30'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 408 /* 34'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200 / basic (10psf) / sections > 5. Source: T200-10-gte5.csv.
    model: "T200", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 184 /* 15'4"  */, exclude: [] },
      { hi: 271 /* 22'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 275 /* 22'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 305 /* 25'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 308 /* 25'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 335 /* 27'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 368 /* 30'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC", "T3.625x18EverySection"] },
      { hi: 408 /* 34'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200 / 15psf / sections <= 5. Source: T200-15-lte5.csv.
    // CSV declares EXCEEDS_CAPACITY beyond 403.
    model: "T200", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 204 /* 17'0"  */, exclude: [] },
      { hi: 213 /* 17'9"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 216 /* 18'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 220 /* 18'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 234 /* 19'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 244 /* 20'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 264 /* 22'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 300 /* 25'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 337 /* 28'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 402 /* 33'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200 / 15psf / sections > 5. Source: T200-15-gte5.csv.
    model: "T200", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 184 /* 15'4"  */, exclude: [] },
      { hi: 217 /* 18'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 220 /* 18'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 244 /* 20'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 264 /* 22'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 300 /* 25'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 337 /* 28'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 402 /* 33'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200 / 20psf / sections <= 5. Source: T200-20-lte5.csv.
    model: "T200", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 184 /* 15'4"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 186 /* 15'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 189 /* 15'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 201 /* 16'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 223 /* 18'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 258 /* 21'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 286 /* 23'10" */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 348 /* 29'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200 / 20psf / sections > 5. Source: T200-20-gte5.csv.
    model: "T200", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 181 /* 15'1"  */, exclude: [] },
      { hi: 186 /* 15'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 189 /* 15'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 209 /* 17'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 223 /* 18'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 258 /* 21'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 286 /* 23'10" */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 348 /* 29'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T300 / basic (10psf) + 15psf / sections ≤ 5.
    // Sources: T300/T300-basic-lte5.csv, T300/T300-15psf-lte5.csv (scraped & normalized).
    // Both wind loads share identical transitions for this slice.
    // T300 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomaly flagged for later review:
    //   - trailing row at 479-482 shows full 11 styles after a EXCEEDS_CAPACITY band
    //     (treated as data noise; ignored. Cap remains at 456".)
    model: "T300", wind: ["basic", "15psf"], secBucket: "lte5",
    intervals: [
      { hi: 245 /* 20'5"  */, exclude: [] },
      { hi: 262 /* 21'10" */, exclude: ["None", "T2.5x18Top"] },
      { hi: 269 /* 22'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 271 /* 22'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 281 /* 23'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 282 /* 23'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 283 /* 23'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 299 /* 24'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection"] },
      { hi: 301 /* 25'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection", "T3.625x18EverySection"] },
      { hi: 305 /* 25'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 361 /* 30'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 403 /* 33'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T300 / 20psf / sections ≤ 5. Source: T300/T300-20psf-lte5.csv (scraped & normalized).
    // T300 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomalies flagged for later review:
    //   - rows 287-288 (HatTruss) and 288-289 (HatTruss) appear before 289-290 (HatTruss_UbarTruss)
    //     in the data; treated as a clean transition at 287" from HatTruss → HatTruss_UbarTruss.
    //   - trailing row at 479-482 shows full 11 styles after a EXCEEDS_CAPACITY band (ignored).
    model: "T300", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 211 /* 17'7"  */, exclude: [] },
      { hi: 223 /* 18'7"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 231 /* 19'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 234 /* 19'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 240 /* 20'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 243 /* 20'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 245 /* 20'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 258 /* 21'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection"] },
      { hi: 263 /* 21'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18EverySection", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 287 /* 23'11" */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 349 /* 29'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T300 / basic (10psf) / sections > 5. Source: T300/T300-10-gte5.csv (scraped & normalized).
    // T300 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomalies flagged for later review:
    //   - 269-275 has style-set swap (T3.625x18TopBtmEvery2ndGT5SEC → T3.625x18TopBtmLTE5SEC,
    //     same count=6); treated as continuous count=6 band, swap noted but not encoded.
    //   - 316-329 spec-table discontinuity: count drops 4 → 2 at 289, then JUMPS to 3 at 316
    //     (adds back T2.5x18EverySection, T3.625x18EverySection). Encoded as-is.
    //   - 287-289 rows out of order (288-289 HatTruss appears before 287-288); treated as
    //     clean transition.
    //   - trailing row at 479-482 shows full 11 styles after HatTruss/UbarTruss band; ignored.
    //     Cap remains at 456".
    model: "T300", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 252 /* 21'0"  */, exclude: [] },
      // 253–277: 6 styles (drops None, T2.5x18Top, T2.5x18TopBtmLTE5SEC, T3.625x18TopBtmLTE5SEC, T4.0x16TopBtmLTE5SEC).
      { hi: 277 /* 23'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      // 278–289: 4 styles (also drops T2.5x18TopBtmEvery2ndGT5SEC, T2.5x18EverySection).
      { hi: 289 /* 24'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      // 289–316: 2 styles (also drops T3.625x18TopBtmEvery2ndGT5SEC, T3.625x18EverySection).
      { hi: 316 /* 26'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 316–329: discontinuity — 3 styles: T2.5x18EverySection, T3.625x18EverySection, T4.0x16EverySection.
      { hi: 329 /* 27'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      // 329–362: 2 styles (T3.625x18EverySection, T4.0x16EverySection).
      { hi: 362 /* 30'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      // 362–408: 1 style (T4.0x16EverySection only).
      { hi: 408 /* 34'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T300 / 15psf / sections > 5. Source: T300/T300-15-gte5.csv (scraped & normalized).
    // T300 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV has several single-row count anomalies; treated as data noise and
    // smoothed into the surrounding band. Specifically:
    //   - 305-306 (count=5) and 306-307 (count=4) dip mid-band; smoothed to count=6.
    //   - 322-323 (count=4) and 335-338 (count=4) single-row dips; smoothed to count=5/6.
    //   - trailing row at 479-482 shows full 11 styles after HatTruss/UbarTruss band; ignored.
    model: "T300", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 300 /* 25'0"  */, exclude: [] },
      // 301–331: 6 styles.
      { hi: 331 /* 27'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      // 332–341: 5 styles (also drops T2.5x18TopBtmEvery2ndGT5SEC).
      { hi: 341 /* 28'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      // 342–346: 4 styles (also drops T3.625x18TopBtmEvery2ndGT5SEC).
      { hi: 346 /* 28'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      // 347–373: 1 style (T4.0x16EverySection only).
      { hi: 373 /* 31'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      // 374–408: HatTruss only.
      { hi: 408 /* 34'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      // 409–456: HatTruss_UbarTruss.
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T300 / 20psf / sections > 5. Source: T300/T300-20-gte5.csv (scraped & normalized).
    // T300 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: rows 287-289 out of order in source (288-289 HatTruss before 287-288
    // HatTruss_UbarTruss); treated as clean transition at 287".
    // Trailing row at 479-482 shows full 11 styles after EXCEEDS_CAPACITY band; ignored.
    model: "T300", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 211 /* 17'7"  */, exclude: [] },
      // 212–234: 6 styles.
      { hi: 234 /* 19'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      // 235–240: 5 styles (also drops T2.5x18TopBtmEvery2ndGT5SEC).
      { hi: 240 /* 20'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      // 241–245: 4 styles (also drops T3.625x18TopBtmEvery2ndGT5SEC).
      { hi: 245 /* 20'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      // 246–258: 3 styles (also drops T2.5x18EverySection).
      { hi: 258 /* 21'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      // 259–263: 1 style (T4.0x16EverySection only).
      { hi: 263 /* 21'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      // 264–287: HatTruss only.
      { hi: 287 /* 23'11" */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      // 287–349: HatTruss_UbarTruss.
      { hi: 349 /* 29'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      // 350–456: EXCEEDS_CAPACITY.
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200-20 / basic (10psf) / sections ≤ 5. Source: T200-20/T200-20-basic-lte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomalies:
    //   - 316-329 discontinuity: count=3 with different style set (adds back T2.5x18EverySection,
    //     T3.625x18EverySection). Encoded as-is.
    //   - HatTruss_UbarTruss band (462-479) is past the 456" cap; only HatTruss interval encoded.
    //   - trailing row at 479-482 shows full 11 styles; ignored.
    model: "T200-20", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 252 /* 21'0"  */, exclude: [] },
      { hi: 277 /* 23'1"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 289 /* 24'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 316 /* 26'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 316-329 discontinuity: T2.5x18EverySection, T3.625x18EverySection, T4.0x16EverySection.
      { hi: 329 /* 27'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 362 /* 30'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 408 /* 34'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
    ],
  },
  {
    // T200-20 / basic (10psf) / sections > 5. Source: T200-20/T200-20-basic-gte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomalies:
    //   - 270-276 style-set swap (T3.625x18TopBtmEvery2ndGT5SEC ↔ T3.625x18TopBtmLTE5SEC, same count=6).
    //     Smoothed into continuous count=6 band.
    //   - 322-329 discontinuity (3-style set with T2.5x18EverySection added back). Encoded.
    //   - HatTruss_UbarTruss band beyond 456" cap; only HatTruss encoded.
    model: "T200-20", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 253 /* 21'1"  */, exclude: [] },
      { hi: 280 /* 23'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 290 /* 24'2"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 322-330 discontinuity.
      { hi: 330 /* 27'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 363 /* 30'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 409 /* 34'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
    ],
  },
  {
    // T200-20 / 15psf / sections ≤ 5. Source: T200-20/T200-20-15-lte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY (explicit in source).
    // NOTE: source CSV anomalies:
    //   - 254-255 single-row dip to count=2 (drops T4.0x16TopBtmEvery2ndGT5EC); smoothed.
    //   - 258-274 discontinuity: 3 styles = T2.5x18EverySection, T3.625x18EverySection, T4.0x16EverySection.
    model: "T200-20", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 220 /* 18'4"  */, exclude: [] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top"] },
      { hi: 233 /* 19'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 257 /* 21'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 258-274 discontinuity.
      { hi: 274 /* 22'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 294 /* 24'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 332 /* 27'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 389 /* 32'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200-20 / 15psf / sections > 5. Source: T200-20/T200-20-15-gte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: 258-274 discontinuity (3-style set with T2.5x18EverySection added back).
    model: "T200-20", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 220 /* 18'4"  */, exclude: [] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 233 /* 19'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 257 /* 21'5"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 258-274 discontinuity.
      { hi: 274 /* 22'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 294 /* 24'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 332 /* 27'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 389 /* 32'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200-20 / 20psf / sections ≤ 5. Source: T200-20/T200-20-20-lte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY (source declares 400+).
    // NOTE: source CSV anomalies:
    //   - Big jump from 11 → 3 styles at width 200 (T4.0x16 family only); encoded as-is.
    //   - 287-289 out-of-order HatTruss/T4.0x16EverySection rows; smoothed as HatTruss from 287.
    model: "T200-20", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 199 /* 16'7"  */, exclude: [] },
      // 200-222: 3 styles = T4.0x16TopBtmLTE5SEC, T4.0x16TopBtmEvery2ndGT5EC, T4.0x16EverySection.
      { hi: 222 /* 18'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      // 223-236 discontinuity: T2.5x18EverySection, T3.625x18EverySection, T4.0x16EverySection.
      { hi: 236 /* 19'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 253 /* 21'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 286 /* 23'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 337 /* 28'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 399 /* 33'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200-20 / 20psf / sections > 5. Source: T200-20/T200-20-20-gte5.csv.
    // T200-20 max width is 38'0" (456"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: source CSV anomalies:
    //   - Big jump from 11 → 2 styles at width 200 (T4.0x16TopBtmEvery2ndGT5EC + T4.0x16EverySection).
    //   - 287-289 out-of-order HatTruss/T4.0x16EverySection rows; smoothed as HatTruss from 287.
    model: "T200-20", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 199 /* 16'7"  */, exclude: [] },
      // 200-222: 2 styles = T4.0x16TopBtmEvery2ndGT5EC, T4.0x16EverySection.
      { hi: 222 /* 18'6"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      // 223-236 discontinuity.
      { hi: 236 /* 19'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 253 /* 21'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 286 /* 23'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmLTE5SEC", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 337 /* 28'1"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 399 /* 33'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
      { hi: 456 /* 38'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200C / basic (10psf) / sections ≤ 5. Source: T200C/T200C-basic-lte5.csv.
    // T200C max width is 32'0" (384"). Beyond that: EXCEEDS_CAPACITY.
    // Source data declares EXCEEDS starting at 376" (just before model cap).
    // NOTE: trailing row at 479-482 shows full 11 styles; ignored.
    model: "T200C", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 202 /* 16'10" */, exclude: [] },
      { hi: 223 /* 18'7"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 237 /* 19'9"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 252 /* 21'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 260 /* 21'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 267 /* 22'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 280 /* 23'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 313 /* 26'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 348 /* 29'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 375 /* 31'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200C / basic (10psf) / sections > 5. Source: T200C/T200C-basic-gte5.csv.
    // T200C max width is 32'0" (384"). Beyond that: EXCEEDS_CAPACITY.
    // GT5 baseline is 8 styles (LTE5-only styles excluded by section bucket).
    model: "T200C", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 202 /* 16'10" */, exclude: ["T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 260 /* 21'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 267 /* 22'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 280 /* 23'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 313 /* 26'1"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 322 /* 26'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 348 /* 29'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
    ],
  },
  {
    // T200C / 15psf / sections ≤ 5. Source: T200C/T200C-15-lte5.csv.
    // T200C max width is 32'0" (384"). Beyond that: EXCEEDS_CAPACITY.
    // NOTE: trailing row anomaly shows only "None" (count=1) at 479-482; ignored.
    model: "T200C", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 164 /* 13'8"  */, exclude: [] },
      { hi: 183 /* 15'3"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 192 /* 16'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 211 /* 17'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 214 /* 17'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 259 /* 21'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 262 /* 21'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 288 /* 24'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 360 /* 30'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200C / 15psf / sections > 5. Source: T200C/T200C-15-gte5.csv.
    // T200C max width is 32'0" (384"). Beyond that: EXCEEDS_CAPACITY.
    // GT5 baseline is 8 styles.
    model: "T200C", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 164 /* 13'8"  */, exclude: ["T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 211 /* 17'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 214 /* 17'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 227 /* 18'11" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 259 /* 21'7"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 262 /* 21'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 288 /* 24'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 360 /* 30'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["HatTruss_UbarTruss"] },
    ],
  },
  {
    // T200C / 20psf / sections ≤ 5. Source: T200C/T200C-20-lte5.csv.
    // T200C max width is 32'0" (384"). Source declares EXCEEDS_CAPACITY at 246".
    model: "T200C", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 138 /* 11'6"  */, exclude: [] },
      { hi: 159 /* 13'3"  */, exclude: ["None", "T2.5x18Top"] },
      { hi: 166 /* 13'10" */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC"] },
      { hi: 180 /* 15'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC"] },
      { hi: 183 /* 15'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 188 /* 15'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 195 /* 16'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 216 /* 18'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      { hi: 219 /* 18'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 244 /* 20'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200C / 20psf / sections > 5. Source: T200C/T200C-20-gte5.csv.
    // T200C max width is 32'0" (384"). Source declares EXCEEDS_CAPACITY at 246".
    // GT5 baseline is 8 styles.
    model: "T200C", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 138 /* 11'6"  */, exclude: ["T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 183 /* 15'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC"] },
      { hi: 188 /* 15'8"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection"] },
      { hi: 195 /* 16'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC"] },
      { hi: 216 /* 18'0"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection"] },
      { hi: 219 /* 18'3"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmLTE5SEC"] },
      { hi: 244 /* 20'4"  */, exclude: ["None", "T2.5x18Top", "T2.5x18TopBtmLTE5SEC", "T3.625x18TopBtmLTE5SEC", "T4.0x16TopBtmLTE5SEC", "T2.5x18TopBtmEvery2ndGT5SEC", "T2.5x18EverySection", "T3.625x18TopBtmEvery2ndGT5SEC", "T3.625x18EverySection", "T4.0x16TopBtmEvery2ndGT5EC"] },
      { hi: 384 /* 32'0"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  // ===== U-series =====
  // Style codes for U-series rules:
  //   None, 1_16GaSTDTrussEvery2ndSection, 1_16GaSTDTrussEverySection,
  //   2_16GaSTDTrussesEverySection, 1_HatTrussPerSection,
  //   1_HatTruss18GaU-barperSection, U_UBAR, U_UBAR_20ga_Top, U_UBAR_20ga_ES, U_UBAR_18ga_ES
  //
  // Convention: leading 0-style row (e.g. 0-122") and trailing 0-style row are encoded as EXCEEDS_CAPACITY.
  // Width gaps (e.g. T200U 242-246 missing from range1) inherit the previous interval's styles (carry-forward).
  // Rows where the CSV shows "EXCEEDS_CAPACITY | <Style>" are treated as the style being allowed (per user spec).

  // ---------- T150U ----------
  {
    // T150U / basic (10psf) / sections ≤ 5. Source: T150U/T150U-basic-lte5.csv. Max width 24'2" (290").
    model: "T150U", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150U / basic (10psf) / sections > 5. Source: T150U/T150U-basic-gte5.csv. Identical to lte5.
    model: "T150U", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150U / 15psf / sections ≤ 5. Source: T150U/T150U-15-lte5.csv.
    model: "T150U", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 210 /* 17'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150U / 15psf / sections > 5. Source: T150U/T150U-15-gte5.csv. Identical to lte5.
    model: "T150U", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 210 /* 17'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150U / 20psf / sections ≤ 5. Source: T150U/T150U-20-lte5.csv. Only 1 style per width (no U_UBAR variants).
    model: "T150U", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T150U / 20psf / sections > 5. Source: T150U/T150U-20-gte5.csv. Identical to lte5.
    model: "T150U", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 122 /* 10'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 182 /* 15'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 254 /* 21'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },

  // ---------- T175U ----------
  {
    // T175U / basic (10psf) / sections ≤ 5. Source: T175U/T175U-basic-lte5.csv. Max width 38'2" (458").
    model: "T175U", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 186 /* 15'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 266 /* 22'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 302 /* 25'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 362 /* 30'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 422 /* 35'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175U / basic / sections > 5. Source: T175U/T175U-basic-gte5.csv. Identical to lte5.
    model: "T175U", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 186 /* 15'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 266 /* 22'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 302 /* 25'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 362 /* 30'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 422 /* 35'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175U / 15psf / sections ≤ 5. Source: T175U/T175U-15-lte5.csv.
    // Row width 410-422 shows "EXCEEDS_CAPACITY | U_UBAR" — per spec, U_UBAR is allowed.
    model: "T175U", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 302 /* 25'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 318 /* 26'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 362 /* 30'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 410 /* 34'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 422 /* 35'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175U / 15psf / sections > 5. Source: T175U/T175U-15-gte5.csv.
    // Width 170-186 row shows count=0; per carry-forward spec, inherit prior interval's styles.
    model: "T175U", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 186 /* 15'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 302 /* 25'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 318 /* 26'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 362 /* 30'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 410 /* 34'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 422 /* 35'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175U / 20psf / sections ≤ 5. Source: T175U/T175U-20-lte5.csv. Only 1 style per width.
    // Rows 318-422 show "EXCEEDS_CAPACITY" alone (count=1, styles="EXCEEDS_CAPACITY"); encoded as EXCEEDS_CAPACITY.
    model: "T175U", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 150 /* 12'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 186 /* 15'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 282 /* 23'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 318 /* 26'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T175U / 20psf / sections > 5. Source: T175U/T175U-20-gte5.csv. Identical to lte5.
    model: "T175U", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 150 /* 12'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 186 /* 15'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 198 /* 16'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 282 /* 23'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 318 /* 26'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection"] },
      { hi: 458 /* 38'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },

  // ---------- T200U ----------
  {
    // T200U / basic (10psf) / sections ≤ 5. Source: T200U/T200U-basic-lte5.csv. Max width ~37'2" (446").
    // Width 0-146 shows only 3 styles (None | U_UBAR | U_UBAR_20ga_Top) — U_UBAR_20ga_ES/18ga_ES not allowed yet.
    // Width 242-246 missing from range1 (jumps 218-242 then 246-278); range2 fills 242-246 with {1_HatTrussPerSection, U_UBAR}.
    // Width 290-302 has count=0; carry-forward from previous (242-246: HatTruss+U_UBAR).
    model: "T200U", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top"] },
      { hi: 194 /* 16'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 218 /* 18'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 246 /* 20'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR"] },
      { hi: 338 /* 28'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 398 /* 33'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200U / basic / sections > 5. Source: T200U/T200U-basic-gte5.csv.
    // File only shows widths 242-446 (narrower widths absent — assumed identical to lte5).
    model: "T200U", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top"] },
      { hi: 194 /* 16'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 218 /* 18'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 246 /* 20'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 338 /* 28'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 398 /* 33'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200U / 15psf / sections ≤ 5. Source: T200U/T200U-15-lte5.csv.
    // Width 338-398 shows "EXCEEDS_CAPACITY | U_UBAR" — per spec, U_UBAR is allowed.
    model: "T200U", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top"] },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 200 /* 16'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 218 /* 18'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 338 /* 28'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 398 /* 33'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200U / 15psf / sections > 5. Source: T200U/T200U-15-gte5.csv. Identical to lte5.
    model: "T200U", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top"] },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 200 /* 16'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 218 /* 18'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 242 /* 20'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR"] },
      { hi: 338 /* 28'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection", "U_UBAR"] },
      { hi: 398 /* 33'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200U / 20psf / sections ≤ 5. Source: T200U/T200U-20-lte5.csv. Only 1 style per width (no U_UBAR variants).
    model: "T200U", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 200 /* 16'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 278 /* 23'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // T200U / 20psf / sections > 5. Source: T200U/T200U-20-gte5.csv. Identical to lte5.
    model: "T200U", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 170 /* 14'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 200 /* 16'8"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["2_16GaSTDTrussesEverySection"] },
      { hi: 278 /* 23'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 290 /* 24'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTruss18GaU-barperSection"] },
      { hi: 446 /* 37'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },

  // ---------- U200C ----------
  {
    // U200C / basic (10psf) / sections ≤ 5. Source: U200C/U200C-basic-lte5.csv. Max width 32'2" (386").
    // Width 187-192 has 0 styles — encoded as NO_OPTIONS between bands.
    // Width 222-230 absent — carry-forward from 192-222 (5 styles).
    model: "U200C", wind: "basic", secBucket: "lte5",
    intervals: [
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 222 /* 18'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 330 /* 27'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // U200C / basic / sections > 5. Source: U200C/U200C-basic-gte5.csv.
    // Width 0-137 shows count=1 styles="None" — only None allowed.
    model: "U200C", wind: "basic", secBucket: "gt5",
    intervals: [
      { hi: 137 /* 11'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 222 /* 18'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 330 /* 27'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // U200C / 15psf / sections ≤ 5. Source: U200C/U200C-15-lte5.csv.
    // Row range2 width missing (",,U200C-GT18-6-LTE-19-2,5,...") implies interval 222-230 inherits.
    model: "U200C", wind: "15psf", secBucket: "lte5",
    intervals: [
      { hi: 137 /* 11'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 194 /* 16'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 230 /* 19'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 283 /* 23'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 330 /* 27'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // U200C / 15psf / sections > 5. Source: U200C/U200C-15-gte5.csv.
    // Width 230-273 has 5 styles (HatTrussPerSection + 4 U_UBAR variants) — different from lte5 at same width.
    model: "U200C", wind: "15psf", secBucket: "gt5",
    intervals: [
      { hi: 137 /* 11'5"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)) },
      { hi: 146 /* 12'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => c !== "None" && !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 162 /* 13'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 194 /* 16'2"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 273 /* 22'9"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection", "U_UBAR", "U_UBAR_20ga_Top", "U_UBAR_20ga_ES", "U_UBAR_18ga_ES"] },
      { hi: 283 /* 23'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 330 /* 27'6"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // U200C / 20psf / sections ≤ 5. Source: U200C/U200C-20-lte5.csv. Only 1 style per width.
    model: "U200C", wind: "20psf", secBucket: "lte5",
    intervals: [
      { hi: 159 /* 13'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 273 /* 22'9"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 328 /* 27'4"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
  {
    // U200C / 20psf / sections > 5. Source: U200C/U200C-20-gte5.csv. Identical to lte5 (file has same shape).
    model: "U200C", wind: "20psf", secBucket: "gt5",
    intervals: [
      { hi: 159 /* 13'3"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEvery2ndSection"] },
      { hi: 187 /* 15'7"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection"] },
      { hi: 192 /* 16'0"  */, exclude: TRUSS_STYLE_NO_OPTIONS },
      { hi: 273 /* 22'9"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_HatTrussPerSection"] },
      { hi: 328 /* 27'4"  */, exclude: TRUSS_STYLE_ALL_CODES.filter(c => !TRUSS_STYLE_OPT_IN_CODES.includes(c)), allowedExtras: ["1_16GaSTDTrussEverySection", "1_HatTrussPerSection"] },
      { hi: 386 /* 32'2"  */, exclude: TRUSS_STYLE_EXCEEDS_CAPACITY },
    ],
  },
];

function findTrussStyleRule(model, wind, sections) {
  const secBucket = sections <= 5 ? "lte5" : "gt5";
  // `wind` can be a string or an array of strings (when the spec data is identical
  // across multiple wind loads). secBucket: "any" matches either ≤5 or >5.
  const windMatches = (r) => Array.isArray(r.wind) ? r.wind.includes(wind) : r.wind === wind;
  return TRUSS_STYLE_RULES.find(r =>
    r.model === model && windMatches(r) &&
    (r.secBucket === secBucket || r.secBucket === "any")
  );
}

function findTrussStyleInterval(intervals, widthIn) {
  for (const iv of intervals) {
    if (widthIn <= iv.hi) return iv;
  }
  return null;
}

// Auto-exclude codes whose section gate doesn't match the user's section count.
function trussStyleSectionAutoExclude(sections) {
  return TRUSS_STYLE_ALL_CODES.filter(code => {
    if (sections <= 5 && code.includes("GT5")) return true;
    if (sections > 5  && code.includes("LTE5")) return true;
    return false;
  });
}


// Returns one of:
//   { kind: "ALLOWED", styles: [...dropdown values] }
//   { kind: "NO_OPTIONS" }
//   { kind: "EXCEEDS_CAPACITY" }
//   { kind: "NO_RULE" }   — no slice defined for this combination yet
function lookupTrussStyle({ model, wind, widthIn, sections }) {
  const rule = findTrussStyleRule(model, wind, sections);
  if (!rule) return { kind: "NO_RULE" };
  const interval = findTrussStyleInterval(rule.intervals, widthIn);
  if (!interval) return { kind: "NO_RULE" };
  if (interval.exclude === TRUSS_STYLE_EXCEEDS_CAPACITY) return { kind: "EXCEEDS_CAPACITY" };
  if (interval.exclude === TRUSS_STYLE_NO_OPTIONS) return { kind: "NO_OPTIONS" };

  const allowedExtras = new Set(interval.allowedExtras || []);
  const optInExcluded = TRUSS_STYLE_OPT_IN_CODES.filter(c => !allowedExtras.has(c));
  const excluded = new Set([
    ...interval.exclude,
    ...trussStyleSectionAutoExclude(sections),
    ...optInExcluded,
  ]);
  const styles = TRUSS_STYLE_ALL_CODES
    .filter(code => !excluded.has(code))
    .map(code => TRUSS_STYLE_CODE_TO_OPTION[code]);
  return { kind: "ALLOWED", styles };
}

function applyTrussStyleResult(result) {
  const $sel = $("#TRUSS_STYLE");
  if (!$sel.length) return;

  // NO_RULE → no constraint defined yet; leave whatever default options are already in the
  // dropdown untouched so the user still has the full list available.
  if (result.kind === "NO_RULE") return;

  const previous = $sel.val();
  $sel.empty();

  if (result.kind === "ALLOWED") {
    result.styles.forEach(v => $sel.append(`<option value="${v}">${v}</option>`));
    if (result.styles.includes(previous)) $sel.val(previous);
    return;
  }

  const message = {
    NO_OPTIONS:        "No truss style available",
    EXCEEDS_CAPACITY:  "Door width exceeds capacity",
  }[result.kind];
  $sel.append(`<option value="" disabled selected>${message}</option>`);
}

// Reads NUM_OF_SEC, falling back to the DOM and then to the height-derived
// table so the truss logic always has a defined sections value.
function getTrussStyleSectionCount() {
  let sections = parseInt(getState("NUM_OF_SEC"));
  if (!Number.isNaN(sections)) return sections;

  sections = parseInt($("#NUM_OF_SEC").val());
  if (!Number.isNaN(sections)) return sections;

  // Last resort: derive from height via HEIGHT_SECTIONS (defined in load_html.js).
  const heightIn = parseInt(getState("HEIGHT"));
  if (!Number.isNaN(heightIn) && typeof HEIGHT_SECTIONS !== "undefined") {
    const heightFt = Math.round(heightIn / 12);
    const list = HEIGHT_SECTIONS[heightFt];
    if (list && list.length) return list[0];
  }
  return 4;
}

// Make sure the NUM_OF_SEC <select> visibly has a value selected. If for some
// reason it doesn't (empty, no selection), force the first option.
function ensureSectionsSelected() {
  const $sel = $("#NUM_OF_SEC");
  if (!$sel.length) return;
  if ($sel.val() == null || $sel.val() === "") {
    const first = $sel.find("option").first().val();
    if (first != null) $sel.val(first).trigger("change");
  }
}

// Read the current door width in inches directly from the form. We can't rely on the
// framework's WIDTH node because loadGlobalNodes() is disabled — that node never updates.
function getTrussStyleWidthInches() {
  if ($("#custom_dimensions").is(":checked")) {
    const wFt = parseInt($("#CUSTOM_WIDTH_FEET").val()) || 0;
    const wIn = parseInt($("#CUSTOM_WIDTH_INCHES").val()) || 0;
    return wFt * 12 + wIn;
  }
  const sel = $("input[name='SIZE']:checked");
  const wFt = Number(sel.attr("width")) || 0;
  const wIn = Number(sel.attr("widthInches")) || 0;
  return wFt * 12 + wIn;
}

function runTrussStyleLogic() {
  ensureSectionsSelected();
  const model    = $("input[name='DOOR_MODEL']:checked").val();
  const wind     = $("input[name='WindLoad']:checked").val();
  const widthIn  = getTrussStyleWidthInches();
  const sections = getTrussStyleSectionCount();
  const result   = lookupTrussStyle({ model, wind, widthIn, sections });
  console.log("[TRUSS_STYLE] inputs:", { model, wind, widthIn, sections }, "result:", result);
  applyTrussStyleResult(result);
}

function loadTrussStyleLogic() {
  console.log("[TRUSS_STYLE] loadTrussStyleLogic() called");

  // Listen directly for DOM changes on every axis that affects the rule.
  // Avoids relying on the framework's addLogic/nodeset which silently fails
  // when the logic id has no matching DOM element.
  const triggers = [
    "input[name='DOOR_MODEL']",
    "input[name='WindLoad']",
    "#NUM_OF_SEC",
    "#CUSTOM_WIDTH_FEET",
    "#CUSTOM_WIDTH_INCHES",
    "input[name='SIZE']",
    "#custom_dimensions",
  ].join(", ");

  $(document).on("change", triggers, function () {
    console.log("[TRUSS_STYLE] change on", this.name || this.id);
    runTrussStyleLogic();
  });

  // Initial fire so the dropdown filters on page load (not just on changes).
  setTimeout(() => {
    console.log("[TRUSS_STYLE] initial fire");
    runTrussStyleLogic();
  }, 0);
}
