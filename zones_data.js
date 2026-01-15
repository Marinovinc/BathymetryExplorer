/**
 * BathymetryExplorer - Dati Campi di Gara
 *
 * Questo file contiene i dati dei campi di gara per tornei di pesca.
 * Modificare questo file per aggiungere/rimuovere campi.
 *
 * Struttura:
 * - id: identificativo univoco (senza spazi, lowercase)
 * - name: nome del campo di gara
 * - tournament: nome del torneo
 * - year: anno del torneo
 * - gatheringPoint: punto di raduno { lat, lng, name }
 * - vertices: array di vertici del poligono [{ lat, lng }, ...]
 * - color: colore del poligono (hex)
 */

const ZONES_DATA = [
    {
        id: 'forio-biggame-2026',
        name: 'Campo Gara Big Game Forio',
        tournament: 'Big Game Forio',
        year: 2026,
        gatheringPoint: {
            lat: 40.72481667,
            lng: 13.69851667,
            name: 'Punto di Raduno'
        },
        vertices: [
            { lat: 40.76231667, lng: 13.65295000 },  // V1 - Nord-Ovest
            { lat: 40.63611667, lng: 13.41883333 },  // V2 - Sud-Ovest
            { lat: 40.46316667, lng: 13.60066667 },  // V3 - Sud
            { lat: 40.58590000, lng: 13.83103333 }   // V4 - Est
        ],
        color: '#8b5cf6',
        centerMeta: {
            lat: 40.61187500,
            lng: 13.62587083,
            radiusNm: 15,
            type: 'circle',
            unit: 'nm'
        }
    },
    {
        id: 'procida-drifting-2026',
        name: 'Campo Gara Drifting Procida',
        tournament: 'Drifting Cup Procida',
        year: 2026,
        gatheringPoint: {
            lat: 40.7633,
            lng: 14.0147,
            name: 'Porto di Procida'
        },
        vertices: [
            { lat: 40.82, lng: 13.95 },
            { lat: 40.82, lng: 14.10 },
            { lat: 40.70, lng: 14.10 },
            { lat: 40.70, lng: 13.95 }
        ],
        color: '#22c55e',
        centerMeta: {
            lat: 40.76,
            lng: 14.025,
            radiusNm: 5,
            type: 'circle',
            unit: 'nm'
        }
    },
    {
        id: 'capri-traina-2026',
        name: 'Campo Gara Traina Capri',
        tournament: 'Capri Trolling Championship',
        year: 2026,
        gatheringPoint: {
            lat: 40.5531,
            lng: 14.2225,
            name: 'Marina Grande Capri'
        },
        vertices: [
            { lat: 40.60, lng: 14.15 },
            { lat: 40.60, lng: 14.30 },
            { lat: 40.50, lng: 14.30 },
            { lat: 40.50, lng: 14.15 }
        ],
        color: '#f59e0b',
        centerMeta: {
            lat: 40.55,
            lng: 14.225,
            radiusNm: 5,
            type: 'circle',
            unit: 'nm'
        }
    },
    {
        id: 'quepos-owc-2026',
        name: 'Offshore World Championship',
        tournament: 'Offshore World Championship',
        year: 2026,
        description: '50-mile radius from Marina Pez Vela - Apr 19-23, 2026',
        gatheringPoint: {
            lat: 9.4264,
            lng: -84.1728,
            name: 'Marina Pez Vela'
        },
        vertices: [
            // Semicerchio 50nm SOLO OCEANO - evita Penisola Nicoya
            // Marina Pez Vela come punto di partenza sulla costa
            { lat: 9.4264, lng: -84.1728 },  // Marina (sulla costa)
            { lat: 9.10, lng: -84.30 },      // Sud lungo costa
            { lat: 8.80, lng: -84.60 },      // SSW - verso oceano
            { lat: 8.60, lng: -85.00 },      // S - nel Pacifico
            { lat: 8.60, lng: -85.40 },      // SW - profondo oceano
            { lat: 9.00, lng: -85.70 },      // W - punto più ovest
            { lat: 9.4264, lng: -85.80 },    // W centro - ~50nm dalla marina
            { lat: 9.90, lng: -85.70 },      // NW - risale
            { lat: 10.20, lng: -85.40 },     // NW - nel Pacifico aperto
            { lat: 10.30, lng: -85.10 },     // N - oceano (ovest di Nicoya)
            { lat: 10.05, lng: -84.90 },     // NE - oceano (punta Nicoya)
            { lat: 9.70, lng: -84.70 }       // E - Golfo Nicoya (acqua)
        ],
        color: '#0ea5e9',
        centerMeta: {
            lat: 9.4264,
            lng: -84.1728,
            radiusNm: 50,
            type: 'semicircle_west',
            unit: 'nm'
        }
    },
    {
        id: 'quepos-bisbees-2026',
        name: "Bisbee's Costa Rica Offshore",
        tournament: "Bisbee's Costa Rica Offshore",
        year: 2026,
        description: 'World richest fishing tournament - Apr 14-18, 2026',
        gatheringPoint: {
            lat: 9.4264,
            lng: -84.1728,
            name: 'Marina Pez Vela'
        },
        vertices: [
            // Semicerchio 50nm SOLO OCEANO - evita Penisola Nicoya
            { lat: 9.4264, lng: -84.1728 },  // Marina (sulla costa)
            { lat: 9.10, lng: -84.30 },      // Sud lungo costa
            { lat: 8.80, lng: -84.60 },      // SSW - verso oceano
            { lat: 8.60, lng: -85.00 },      // S - nel Pacifico
            { lat: 8.60, lng: -85.40 },      // SW - profondo oceano
            { lat: 9.00, lng: -85.70 },      // W - punto più ovest
            { lat: 9.4264, lng: -85.80 },    // W centro - ~50nm dalla marina
            { lat: 9.90, lng: -85.70 },      // NW - risale
            { lat: 10.20, lng: -85.40 },     // NW - nel Pacifico aperto
            { lat: 10.30, lng: -85.10 },     // N - oceano (ovest di Nicoya)
            { lat: 10.05, lng: -84.90 },     // NE - oceano (punta Nicoya)
            { lat: 9.70, lng: -84.70 }       // E - Golfo Nicoya (acqua)
        ],
        color: '#ef4444',
        centerMeta: {
            lat: 9.4264,
            lng: -84.1728,
            radiusNm: 50,
            type: 'semicircle_west',
            unit: 'nm'
        }
    }
];

// Non modificare sotto questa linea
if (typeof window !== 'undefined') {
    window.ZONES_DATA = ZONES_DATA;
}
