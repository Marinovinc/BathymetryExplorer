"""
Simple HTTP server to serve BathymetryExplorer
Run this and open http://localhost:8000
"""
import http.server
import socketserver
import os
import webbrowser

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

os.chdir(DIRECTORY)

Handler = http.server.SimpleHTTPRequestHandler

print(f"Serving BathymetryExplorer at http://localhost:{PORT}")
print(f"Directory: {DIRECTORY}")
print("Press Ctrl+C to stop")

# Open browser
webbrowser.open(f'http://localhost:{PORT}')

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
