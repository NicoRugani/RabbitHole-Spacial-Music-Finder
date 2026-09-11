// handle graph data storange in browser local storage

const STORAGE_KEY = 'rabbit-hole-graph-data';

export function saveGraphData(nodes, edges) {
    const graphData = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(graphData));
}


