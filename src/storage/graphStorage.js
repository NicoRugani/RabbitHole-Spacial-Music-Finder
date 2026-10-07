// handle graph data storange in browser local storage

const STORAGE_KEY = 'rabbit-hole-graph-data';
//bumped to 2 when songs moved from sample ids to iTunes track ids
const STORAGE_VERSION = 2;

export function saveGraphData(nodes, edges) {
    try{
        const graphData = { version: STORAGE_VERSION, nodes, edges };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(graphData));
        return true;
    } catch (error) {
        console.error('Error saving graph data:', error);
        return false;
    }
}

export function loadGraphData(){

    try{
        const savedGraphData = localStorage.getItem(STORAGE_KEY);
        if(savedGraphData === null) return null;
        const graphData = JSON.parse(savedGraphData);

        //a graph saved by an older version is discarded, not an error: the song ids changed meaning
        if(graphData !== null && graphData.version !== STORAGE_VERSION) return null;

        if(graphData === null || !Array.isArray(graphData.nodes) || !Array.isArray(graphData.edges)) {
            throw new Error('Invalid graph data format');
        }
        return graphData;
    } catch (error) {
        console.error('Error loading graph data:', error);
        throw error;
    }
    
}


