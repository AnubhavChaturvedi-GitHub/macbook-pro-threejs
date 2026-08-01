# MacBook Pro — three.js source

A dimensionally accurate MacBook Pro 14″/16″ built procedurally in three.js.
Everything is generated in code — no external meshes, no image files. One
self-contained HTML file.

**Open it:** double-click `index.html`. Needs internet (three.js r169 loads from
jsDelivr via an importmap). No build step, no server, no dependencies.

**Units: 1 world unit = 1 centimetre.** Every dimension traces to Apple's
published spec, so don't "clean up" the numbers.

---

## Files

| File | |
|---|---|
| `index.html` | the whole model + viewer, 1586 lines |
| `export-glb.js` | console snippet that re-exports the GLB |
| `export-receiver.py` | tiny localhost sink that writes the GLB to disk |

---

## Where things are in `index.html`

| Line | |
|---|---|
| 149 | `SPECS` — enclosure, display, trackpad, bezel dims for 14″ and 16″ |
| 176 | `FINISHES` — Space Black / Silver colour + roughness sets |
| 182 | Magic Keyboard metrics — pitch, gap, cap height, pocket depth |
| 208–260 | geometry helpers — `roundedPath`, `slabGeo`, `domedPanel` |
| 329 | `makeStudioEnv()` — the equirect studio environment |
| 362 | `makeScreenTexture()` — wallpaper, menu bar, dock |
| 695 | speaker-grille perforation map |
| 725 | notch camera lens texture |
| 761 | function-row icons (all drawn as vectors) |
| 890 | `ROWS` — the full keyboard layout |
| 1019 | **`buildMacBook(spec, finish)`** — builds one machine, returns a Group |
| 1372 | scene, renderer, lights, controls |
| 1454 | `frameCamera()` — aspect-aware fit |

### Inside `buildMacBook`

`base body` (1078) → `bottom case` (1115) → `keys` (1144) → `trackpad` (1185)
→ `speaker grilles` (1191) → `ports` (1205) → `lid` (1248) → `rear hinge` (1328)

Returns a Group with `userData = { mats, lid, sp }`. **`userData.lid` is the
hinge pivot** — set `lid.rotation.x = -angle` to open it. 0 = closed, and closed
stacks to exactly the spec thickness.

---

## Things that will bite you

These each cost a debugging cycle. They are not hypothetical.

**`ShapeGeometry` emits UVs in model space, not 0–1.** Any face that carries a
texture must use `PlaneGeometry`. The speaker grille was built with
`ShapeGeometry` and the map clamped after one centimetre, so the perforation
field was a 1 cm patch instead of running the length of the keyboard.

**Don't use `RoomEnvironment`.** Its ceiling panel is extremely bright, so every
up-facing surface mirrors it — a Space Black lid renders *white* (measured
206,206,207). That's why `makeStudioEnv()` exists: dim zenith, dark floor,
softboxes at ~45°. If you change lighting, verify by probing the pixel with
`gl.readPixels`, not by eye.

**The enclosure uses material groups.** `ExtrudeGeometry` puts cap faces in
group 0 and every side wall, bevel and pocket wall in group 1, so the mesh takes
`shell = [mats.body, mats.edge]`. That's what produces the machined chamfer.
Assigning a single material kills it.

**The pockets are real holes.** The keyboard well and trackpad are cut through
the deck as `Shape.holes`, with floor panels behind them and caps underneath.
Moving the trackpad means moving the hole too, or you get a see-through slot.

**Canvas `letterSpacing` shifts centred text left** by half a space (it appends a
trailing gap that `textAlign:'center'` measures in). Offset by `ls/2`.

**Don't composite bright overlapping bands with `'lighter'`** — they sum to a
pastel wash. The wallpaper ribbons are painted back-to-front with `source-over`.

**Keep `camera.near` well away from 0.** The lid stacks six coplanar layers
~0.006 cm apart; a tight near plane makes them speckle.

**Low `clearcoat` on the keycaps.** Fresnel drives clearcoat to 1 at grazing
angles and the caps turn white, which anodised keys never do.

---

## Debug handle

`window.mbp` = `{ THREE, scene, camera, controls, renderer, state, rebuild,
frameCamera, buildMacBook, SPECS, FINISHES }`

Build a machine without touching the live scene:

```js
const g = mbp.buildMacBook(mbp.SPECS['14'], mbp.FINISHES.silver);
```

---

## Re-exporting the GLB

```bash
python3 export-receiver.py
```

Then open `index.html`, paste `export-glb.js` into the console, and poll
`window.__glb` until `status: "done"`. Writes to `~/Desktop/MacBook Pro.glb`.

The receiver only exists because a `file://` page can't write to disk. It binds
to 127.0.0.1, accepts one POST, writes the body, and that's it — nothing leaves
the machine. Ctrl-C it when you're done.

### If you need a lighter file

The current export is ~44 MB: 3.5 MB of textures and **14.3 MB of geometry**
(the enclosure runs 30 curve segments and there are ~90 individually bevelled
keycaps, doubled across the two variants). To slim it:

- drop `curveSegments` on `slabGeo` calls for parts that never get close-ups
- instance the keycaps instead of building a slab each
- replace the wallpaper's dither pass with an in-shader dither — the baked noise
  is what makes that one texture 3.16 MB, since noise doesn't PNG-compress
