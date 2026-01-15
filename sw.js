/**
 * Service Worker - BathymetryExplorer PWA
 * Gestisce caching offline per mappe batimetriche
 */

const CACHE_VERSION = 'v2.0.9';
const CACHE_NAME = `bathyexplorer-${CACHE_VERSION}`;
const TILES_CACHE = `bathyexplorer-tiles-${CACHE_VERSION}`;

// File dell'app da cachare immediatamente
const APP_SHELL = [
    './',
    './index.html',
    './zones_data.js',
    './manifest.json'
];

// Domini delle tile da cachare
const TILE_DOMAINS = [
    'tile.openstreetmap.org',
    'server.arcgisonline.com',
    'tiles.emodnet-bathymetry.eu',
    'gis.ngdc.noaa.gov',
    'basemap.nationalmap.gov',
    'pae-paha.pacioos.hawaii.edu'
];

// Install - Cache app shell
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(APP_SHELL);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate - Pulisci vecchie cache
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && cacheName !== TILES_CACHE) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch - Strategia di caching
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Ignora richieste non-GET
    if (event.request.method !== 'GET') return;

    // Strategia per tile delle mappe: Cache-first
    if (isTileRequest(url)) {
        event.respondWith(
            caches.open(TILES_CACHE).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(event.request).then(networkResponse => {
                        // Salva in cache solo se risposta OK
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Offline e non in cache - ritorna placeholder
                        return new Response('Tile non disponibile offline', {
                            status: 503,
                            statusText: 'Offline'
                        });
                    });
                });
            })
        );
        return;
    }

    // Strategia per app shell: Cache-first, fallback network
    if (isAppShellRequest(url)) {
        event.respondWith(
            caches.match(event.request).then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
        );
        return;
    }

    // Default: Network-first (per dati dinamici come SST)
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});

// Verifica se la richiesta e per una tile mappa
function isTileRequest(url) {
    return TILE_DOMAINS.some(domain => url.hostname.includes(domain));
}

// Verifica se la richiesta e per l'app shell
function isAppShellRequest(url) {
    return url.pathname.endsWith('.html') ||
           url.pathname.endsWith('.js') ||
           url.pathname.endsWith('.json') ||
           url.pathname === '/' ||
           url.pathname === './';
}

// Message handler per comunicazione con la pagina
self.addEventListener('message', event => {
    if (event.data.action === 'downloadArea') {
        // Pre-download tile per un'area specifica
        downloadAreaTiles(event.data.bounds, event.data.zoom);
    }

    if (event.data.action === 'getCacheSize') {
        getCacheSize().then(size => {
            event.ports[0].postMessage({ size: size });
        });
    }

    if (event.data.action === 'clearTilesCache') {
        caches.delete(TILES_CACHE).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Scarica tile per un'area specifica (per uso offline)
async function downloadAreaTiles(bounds, maxZoom) {
    const cache = await caches.open(TILES_CACHE);
    const tileUrls = generateTileUrls(bounds, maxZoom);

    let downloaded = 0;
    const total = tileUrls.length;

    for (const url of tileUrls) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
                downloaded++;
            }
        } catch (e) {
            console.log('[SW] Failed to download:', url);
        }

        // Notifica progresso ogni 10 tile
        if (downloaded % 10 === 0) {
            self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    client.postMessage({
                        type: 'downloadProgress',
                        downloaded: downloaded,
                        total: total
                    });
                });
            });
        }
    }

    // Notifica completamento
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'downloadComplete',
                downloaded: downloaded,
                total: total
            });
        });
    });
}

// Genera URL delle tile per un'area e livello zoom
function generateTileUrls(bounds, maxZoom) {
    const urls = [];
    const baseUrl = 'https://tile.openstreetmap.org';

    for (let z = 8; z <= maxZoom; z++) {
        const minTile = latLngToTile(bounds.north, bounds.west, z);
        const maxTile = latLngToTile(bounds.south, bounds.east, z);

        for (let x = minTile.x; x <= maxTile.x; x++) {
            for (let y = minTile.y; y <= maxTile.y; y++) {
                urls.push(`${baseUrl}/${z}/${x}/${y}.png`);
            }
        }
    }

    return urls;
}

// Converti lat/lng in coordinate tile
function latLngToTile(lat, lng, zoom) {
    const n = Math.pow(2, zoom);
    const x = Math.floor((lng + 180) / 360 * n);
    const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
    return { x: x, y: y };
}

// Calcola dimensione cache
async function getCacheSize() {
    const cache = await caches.open(TILES_CACHE);
    const keys = await cache.keys();
    let totalSize = 0;

    for (const request of keys) {
        const response = await cache.match(request);
        if (response) {
            const blob = await response.clone().blob();
            totalSize += blob.size;
        }
    }

    return totalSize;
}
