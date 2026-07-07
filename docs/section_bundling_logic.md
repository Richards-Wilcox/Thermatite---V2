# Section Bundling Logic

How sections are stacked and paired into ship bundles.
Source: [`src/logic/section_bundles.js`](../src/logic/section_bundles.js) — `getSectionBundle()` and `bundleByHeight()`.

---

## 1. Section count (NUM_OF_SEC)

One section added per 2 ft of height. Each band runs **X'1" → (X+2)'0"** (boundary sits on the even foot).
`getChartNumSections(h)` = `h ≤ 48 → 2`, else `2 + ceil((h − 48) / 24)`.

| Height band | Sections |
|---|---|
| ≤ 4'0" | 2 |
| 4'1" – 6'0" | 3 |
| 6'1" – 8'0" | 4 |
| 8'1" – 10'0" | 5 |
| … +2 ft | +1 |
| 30'1" – 32'0" | 16 |

---

## 2. Section stack order

Tallest sections on the **bottom**, shortest on **top** (`getSectionBundle()`).

```
[ tallest × tallestQty ,  shortest × shortestQty ]
   index 0 = BTM_SECTION  ........  last index = TOP
```

Section heights are always 21" or 24" (resolved from the stack chart).

---

## 3. Pairing rules (`bundleByHeight()`), in order

1. **Ship-alone override** — if `WIDTH ≥ 199"` **or** `HEIGHT > 146"` (12'2"): every section ships single. Stop.
2. **Bottom rule** — if **tallestQty is odd** → bottom section ships alone, pairing starts above it. If even → bottom can pair.
3. **Forward same-height match** — walk up the stack; pair each section with the next unused section of the **same height** (24+24, 21+21).
4. **Weight cap** — a pair only forms if combined ship weight `< 150 lbs`; otherwise both ship single.

> No special "intermediate" logic — middle sections pair by height like everything else.
> **Top** isn't special either: it pairs only if another same-height section is left over.

---

## 4. Examples

| Stack (bottom→top) | tallestQty | Bottom | Result | Why |
|---|---|---|---|---|
| `[24,24]` | 2 (even) | pairs | `(24+24)` | bottom pairs |
| `[24,24,24,24]` | 4 (even) | pairs | `(24+24)(24+24)` | all pair |
| `[24,24,24]` | 3 (odd) | **alone** | `(24) (24+24)` | odd → bottom single |
| `[24,24,24,24,24]` | 5 (odd) | **alone** | `(24) (24+24)(24+24)` | odd → bottom single, rest pair |
| `[24,24,21,21]` | 2 (even) | pairs | `(24+24)(21+21)` | bottom + top both pair |
| `[24,24,24,21,21]` | 3 (odd) | **alone** | `(24) (24+24)(21+21)` | bottom single, 2×24 pair, 2×21 pair |
| `[24,24,24,21]` | 3 (odd) | **alone** | `(24) (24+24) (21)` | lone 21" top has no match → single |
| any, `WIDTH ≥ 199"` | — | — | all singles | width override |
| any, `HEIGHT > 146"` | — | — | all singles | height override |
| same-height pair `≥ 150 lbs` | — | — | split to singles | weight cap |

---

## 5. Bundle output

Each bundle = `{ sections: [...], indexes: [...], weight }`.
`indexes` are **1-based** (1 = bottom). Bottom section weight uses `isBottom = true`.

## 6. Known issue

`getEndCapsPartNum()` is leftover **Landmark** code (models `A`/`D`, parts `426-08xx`) and always returns `null` for Thermatite models. The correct path is `getThermatiteEndCap()`. The per-bundle `BUNDLE*_SC*_END_CAPS_SPNUM` nodes still call the dead function.
