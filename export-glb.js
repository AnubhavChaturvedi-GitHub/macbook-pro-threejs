/* ---------------------------------------------------------------------------
   Re-export the model to ~/Desktop/MacBook Pro.glb

   1. Run the receiver first, in a terminal:   python3 export-receiver.py
   2. Open index.html in a browser.
   3. Paste this whole file into the DevTools console and press Enter.
   4. Poll `window.__glb` until status is "done".
   5. Ctrl-C the receiver.

   The receiver exists because a file:// page cannot write to disk. It listens
   on 127.0.0.1:8777, takes one POST and writes the body straight to the
   Desktop. Nothing leaves the machine.
--------------------------------------------------------------------------- */

(function () {
  const m = window.mbp;                       // debug handle exposed by index.html
  if (!m || !m.buildMacBook) return 'NOT READY — let the page finish loading';

  window.__glb = { status: 'running' };

  (async () => {
    try {
      const { GLTFExporter } = await import('three/addons/exporters/GLTFExporter.js');
      const T = m.THREE;

      const root = new T.Scene();
      root.name = 'MacBook_Pro';

      const sp = m.SPECS['14'];               // swap to m.SPECS['16'] for the 16"
      const variants = [
        ['MacBook_Pro_14_Space_Black', m.FINISHES.black,  -(sp.w / 2 + 3)],
        ['MacBook_Pro_14_Silver',      m.FINISHES.silver,  (sp.w / 2 + 3)]
      ];

      for (const [name, fin, dx] of variants) {
        const g = m.buildMacBook(sp, fin);
        g.name = name;
        g.position.x = dx;
        g.userData.lid.rotation.x = -T.MathUtils.degToRad(108);   // lid angle
        // the screen-spill PointLight is scene lighting, not part of the asset
        g.traverse(o => { if (o.isPointLight) o.parent.remove(o); });
        root.add(g);
      }

      const buf = await new GLTFExporter().parseAsync(root, {
        binary: true, onlyVisible: true
      });
      window.__glb.bytes = buf.byteLength;

      const res = await fetch('http://127.0.0.1:8777/', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },   // keeps it a simple request
        body: buf
      });
      window.__glb.server = await res.text();
      window.__glb.status = 'done';
    } catch (e) {
      window.__glb.status = 'error';
      window.__glb.error = String((e && e.stack) || e);
    }
  })();

  return 'started — check window.__glb';
})();
