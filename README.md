# X Detailing tracking map — Codex handoff

Visual layer only. The roads, GPS, and camera stay a **native live map**. Do not ship `tracking-map-preview.png` as the map.

## What you connect

| Input | Rule |
|---|---|
| Employee accepts | Start GPS from that employee's phone. Show their code: `VAN 1` or `VAN 3`. |
| Before accept | No van marker. Sheet says **جاري التعيين**. |
| Every GPS fix | Move the van marker to that coordinate. Do not tween it. Target interval: 4 seconds. |
| Job completes | Remove the van, stop the phone from sending location, sheet says the visit is closed. |
| Customer coordinate | `tracking-customer-pin.svg`. |
| A different route end | `tracking-destination-pin.svg`. If it is the same point, use only the customer pin. |

## Assets

| File | Place | Anchor | Display |
|---|---|---|---|
| `assets/tracking-van-marker@3x.png` | **Primary van marker.** Realistic dark Expert, cyan X, nose up. | `0.5, 0.5` | 17 × 36 pt |
| `assets/tracking-van-marker@2x.png` | Same marker, 34 × 72 px | `0.5, 0.5` | 17 × 36 pt |
| `assets/tracking-van-marker@1x.png` | Same marker, 17 × 36 px | `0.5, 0.5` | 17 × 36 pt |
| `assets/tracking-van-marker.svg` | Silhouette fallback only. Do not use if the PNG loads. | `0.5, 0.5` | 17 × 36 pt |
| `assets/tracking-van-marker-preview.png` | Inspection sheet. Not a map asset. | | |
| `assets/tracking-customer-pin.svg` | Customer address | `0.5, 0.5` | 32 pt |
| `assets/tracking-destination-pin.svg` | Separate route end only | `0.5, 0.5` | 28 pt |
| `assets/tracking-live-indicator.svg` | Green dot beside the live label | center | 16 pt |
| `assets/tracking-live-pulse.svg` | Pulse under the van, not rotated | `0.5, 0.5` | 72 pt |
| `assets/tracking-recenter.svg` | Inside a 44 pt circle, bottom-end of the map | n/a | 24 pt glyph |

The van nose points **up** at rotation `0`. Set `flat` and `rotation` to the GPS heading. Do not rotate the pulse under it.

**Primary file:** `assets/tracking-van-marker@3x.png`. It is a tight transparent render, 51 × 108 px, shown at 17 × 36 pt. It stays readable from 32 pt to 44 pt on the long side. The SVG is a silhouette backup only.

PNG files have a transparent background. SVG is the master if you redraw.

## Map style

Read `tracking-map-spec.json`.

- **Google:** `PROVIDER_GOOGLE` + `customMapStyle` = `map.googleMapStyle`.
- **Apple:** the map cannot recolor roads.

DESIRED VISUAL EFFECT: night land `#070D18`, roads `#1E3354` / `#314868`, labels `#8EA0B8`, water `#0A1626`.

Closest production-safe Apple implementation: default map, then the cyan route and these markers on top. Do not fake the basemap with an image.

DESIRED VISUAL EFFECT for the route: neon line with a glow.

Closest implementation: two `Polyline`s on the same coordinates. Glow first (`#3AD7FF`, width 10, opacity 0.22), core on top (width 4, opacity 0.95). Delayed state uses `#F0A43A` and dash `[7, 8]`.

## Camera

- Live: `animateCamera` to the latest van fix, zoom 15.
- Recenter: `fitToCoordinates([van, customer])` with `edgePadding` 48 and `maxZoom` 16.
- Do not rotate the map with the vehicle. Only the van marker rotates.

## Screen layout

See `tracking-map-layout.json`.

Arabic is RTL for text and the sheet. Do not mirror the map.

Approved bottom of the screen, while the job is live:

1. Driver card: call (`tel:`), driver name, star rating, vehicle line, van code.
2. Three figures: estimated km, minutes left, progress percent. Recompute from the remaining route, do not hardcode 3.8 / 12 / 22.
3. **تواصل مع الدعم الفني** opens the AI support chat. Leave that button under the stats.

`VAN 1` in the approved preview is الكابتن أحمد العلي, rating 4.9. `VAN 3` is الكابتن راشد النعيمي, rating 4.8. Replace with the real employee record.

## Drop-in

`TrackingMapVisual.tsx` is a React Native map body using `react-native-maps`. Wire `van`, `customer`, and `heading` to the live job. It does not include the driver sheet.

## Preview

`tracking-map-preview.png` shows the approved composition. It is a reference, not an asset to stretch behind the map.
