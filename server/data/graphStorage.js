// handle graph data storange in browser local storage

const STORAGE_KEY = 'rabbit-hole-graph-data';

export function saveGraphData(nodes, edges) {
    try{
        const graphData = { version: 1, nodes, edges };
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

        if(graphData === null || graphData.version !== 1 || !Array.isArray(graphData.nodes) || !Array.isArray(graphData.edges)) {
            throw new Error('Invalid graph data format');
        }
        return graphData;
    } catch (error) {
        console.error('Error loading graph data:', error);
        throw error;
    }
    
}


