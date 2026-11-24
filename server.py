#!/usr/bin/env python3
"""
Minimal zero-dependency server for the White-Label Global Wine Cellar Atlas PWA.
- Serves all static files from the repository root.
- POST /save-wines-json : writes JSON body (with 'wines' array) to data/wines.json
- POST /save-brand-json : writes white-label brand config JSON to config/brand.json

Run:
    python3 server.py
Open:
    http://localhost:8000/index.html
    http://localhost:8000/wine-map.html
    http://localhost:8000/cellar-manager.html
"""

import json
import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
WINES_JSON = os.path.join(ROOT_DIR, "data", "wines.json")
BRAND_JSON = os.path.join(ROOT_DIR, "config", "brand.json")


class AtlasHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def guess_type(self, path):
        if path.endswith("manifest.json") or path.endswith("/manifest.json"):
            return "application/manifest+json"
        if path.endswith(".webp"):
            return "image/webp"
        return super().guess_type(path)

    def _send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        clean_path = self.path.split("?", 1)[0].rstrip("/")
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            raw_body = self.rfile.read(content_length)
            data = json.loads(raw_body.decode("utf-8"))
        except (ValueError, json.JSONDecodeError) as exc:
            self._send_json(400, {"ok": False, "error": f"Invalid JSON: {exc}"})
            return

        if clean_path == "/save-wines-json":
            if not isinstance(data, dict) or not isinstance(data.get("wines"), list):
                self._send_json(400, {"ok": False, "error": "Payload must be an object with a 'wines' array."})
                return
            try:
                os.makedirs(os.path.dirname(WINES_JSON), exist_ok=True)
                with open(WINES_JSON, "w", encoding="utf-8") as fh:
                    json.dump(data, fh, ensure_ascii=False, indent=2)
                self._send_json(200, {"ok": True, "path": "data/wines.json", "count": len(data["wines"])})
            except OSError as exc:
                self._send_json(500, {"ok": False, "error": f"Write failed: {exc}"})
            return

        if clean_path == "/save-brand-json":
            if not isinstance(data, dict) or not data.get("venueName"):
                self._send_json(400, {"ok": False, "error": "Payload must be an object with a 'venueName'."})
                return
            try:
                os.makedirs(os.path.dirname(BRAND_JSON), exist_ok=True)
                with open(BRAND_JSON, "w", encoding="utf-8") as fh:
                    json.dump(data, fh, ensure_ascii=False, indent=2)
                self._send_json(200, {"ok": True, "path": "config/brand.json"})
            except OSError as exc:
                self._send_json(500, {"ok": False, "error": f"Write failed: {exc}"})
            return

        self._send_json(404, {"ok": False, "error": "Endpoint not found"})

    def log_message(self, format_str, *args):
        print("[%s] %s" % (self.log_date_time_string(), format_str % args))


def main():
    port = int(os.environ.get("PORT", sys.argv[1] if len(sys.argv) > 1 else 8000))
    server = HTTPServer(("", port), AtlasHandler)
    print(f"Global Wine Atlas PWA running at http://localhost:{port}")
    print(f"  Landing Page   : http://localhost:{port}/index.html")
    print(f"  World Atlas    : http://localhost:{port}/wine-map.html")
    print(f"  Cellar Manager : http://localhost:{port}/cellar-manager.html")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server.")
        server.shutdown()


if __name__ == "__main__":
    main()
