import http.server, socketserver, os, sys
DEST = os.path.expanduser('~/Desktop/MacBook Pro.glb')
class H(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
    def do_OPTIONS(self):
        self.send_response(204); self._cors(); self.end_headers()
    def do_POST(self):
        n = int(self.headers.get('Content-Length', '0'))
        data = self.rfile.read(n)
        with open(DEST, 'wb') as f:
            f.write(data)
        self.send_response(200); self._cors()
        self.send_header('Content-Type', 'text/plain'); self.end_headers()
        self.wfile.write(b'ok ' + str(len(data)).encode())
        print('WROTE', len(data), 'bytes ->', DEST, flush=True)
    def log_message(self, *a): pass
socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('127.0.0.1', 8777), H) as s:
    s.serve_forever()
