# MacBook Pro in Three.js: A Dimensionally Accurate 3D Model

> A photoreal MacBook Pro 14 inch and 16 inch built entirely in code with Three.js. No external meshes, no texture files, no build step. One self-contained HTML file where every measurement traces back to Apple's published specification.

[![Three.js](https://img.shields.io/badge/Three.js-r169-000000?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![No Build Step](https://img.shields.io/badge/Build_Step-None-success?style=for-the-badge)](index.html)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](index.html)

## What it does

Most 3D laptop models on the web are downloaded meshes with baked textures. This one is generated procedurally at runtime: the enclosure, display, keyboard, trackpad, ports and hinge are all constructed from geometry defined in code, using real dimensions.

**One world unit equals one centimetre.** Every dimension in the `SPECS` object comes from Apple's published spec sheet, which is why the numbers look oddly precise. Do not round them.

## Run it

Double-click `index.html`. That is the whole setup.

It needs an internet connection because Three.js r169 loads from jsDelivr via an importmap. There is no build step, no server and no dependencies to install.

## Files

| File | Purpose |
|---|---|
| `index.html` | The complete model and viewer, roughly 1,586 lines |
| `MacBook Pro.glb` | Pre-exported GLB if you want the mesh in another tool |
| `export-glb.js` | Console snippet that re-exports the GLB |
| `export-receiver.py` | Small localhost sink that writes the exported GLB to disk |

## Where things live in `index.html`

| Around line | What is there |
|---|---|
| 149 | `SPECS`, the enclosure, display, trackpad and bezel dimensions for both sizes |

Search for `SPECS` to find the single source of truth for every measurement. Change the size variant there and the whole model rebuilds.

## Exporting the GLB

1. Open `index.html` in a browser.
2. Start the receiver: `python3 export-receiver.py`
3. Paste the contents of `export-glb.js` into the browser console.

The GLB is written next to the receiver script.

## Use cases

- Product mockups and hero shots for websites
- Learning procedural geometry in Three.js
- A realistic prop for WebGL scenes and 3D portfolios
- Source mesh for Blender, Spline or any GLB-compatible tool

## Tech stack

Three.js r169, vanilla JavaScript, WebGL, Python (export receiver only).

## Contributing

Pull requests welcome. If you adjust a dimension, cite the Apple spec page in the PR so accuracy stays verifiable.

## License

See the repository license file.

## Author

**Anubhav Chaturvedi**, founder of [NetHyTech](https://www.youtube.com/@NetHyTech), a developer community of 30,000+ members.

[![YouTube](https://img.shields.io/badge/YouTube-NetHyTech-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://www.youtube.com/@NetHyTech)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/anubhav-chaturvedi-/)

If this project saved you time, a star on the repo helps other people find it.
