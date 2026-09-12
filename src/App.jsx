
// loads tools and prepairs the first songs graph data for react flow to render.
import {
  Background,
  Controls,
  Panel,
  useEdgesState,
  Handle,
  Position,
  ReactFlow,
  // functions
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import {useState, useEffect, useRef} from 'react';
const startingSong = {id:1, title: 
"Don't Stop Believin'", artist: "Journey", album: "Evolution", genre: "Rock", year: 1981
}; // temorary placeholder song data to display first somng while working on real time song data implimentation.
import { saveGraphData, loadGraphData } from './storage/graphStorage.js';
import SongDetails from './components/SongDetails.jsx';
import SongLibrary from './components/SongLibrary.jsx';
import Recommendations from './components/Recommendations.jsx';

// React Flow adds a position and graph identity around our existing song data.
const initialNodes = [
  {
    id: String(startingSong.id),
    type: 'song',
    position: { x: 0, y: 0 },
    data: startingSong,
  },
];

function SongNode({ data }) {
  return (
    <article className="song-node">
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <span className="song-genre">{data.genre}</span>
      <h2>{data.title}</h2>
      <p>{data.artist}</p>
      <p className="song-album">{data.album} · {data.year}</p>
    </article>
  );
}

// Keep this mapping outside App so its identity stays stable between renders.
// creates an object
// song is the property name, SongNode is the function stored and its value. React Flow will use this mapping to render the correct node type.
const nodeTypes = { song: SongNode };
const fitViewOptions = { padding: 0.4, maxZoom: 1 };


// FitWebButton is a button that when clicked, will fit the entire graph into the view.
function FitWebButton() {
  const { fitView } = useReactFlow();

  return (
    <button
      className="fit-web"
      onClick={() => fitView({ ...fitViewOptions, duration: 350 })}
    >
      Fit Web
    </button>
  );
}

// App is the main component that renders the entire application. 

// defines app and makes it the files default export.
export default function App() { 

const [startingGraph] = useState(() => {
    try {
      const savedGraph = loadGraphData();

      return {
        nodes: savedGraph
          ? savedGraph.nodes.map(node => ({ ...node, selected: false, dragging: false }))
          // If there's no saved data, fall back to the initial placeholder nodes.
          : initialNodes,
        // Same idea for edges: copy saved edges and add a "selected" flag.
        edges: savedGraph
          ? savedGraph.edges.map(edge => ({ ...edge, selected: false }))
          // No saved edges, so start with an empty list.
          : [],

      loadError: null,
      };
    } catch {
      // If anything above throws (e.g. corrupted storage), return a safe
      // empty graph plus an error message so the UI can warn the user.
      return {
        nodes: [],
        edges: [],
        loadError: 'Your saved graph could not be loaded. Saving is paused.'
      };
    }
  });


  const [loadError, setLoadError] = useState(startingGraph.loadError);
  const [ saveError, setSaveError] = useState(null);

  const [songNodes, setSongNodes, onNodesChange] = useNodesState(startingGraph.nodes);// uses state to remember the current nodes.
  const [songEdges, setSongEdges, onEdgesChange] = useEdgesState(startingGraph.edges); 
  const selectedNode = songNodes.find(node => node.selected); //returns first node thats sleected = true
  const selectedSong = selectedNode?.data;
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const graphSectionRef = useRef(null);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const[recommendationsError, setRecommendationsError] = useState(null);

  useEffect(() => {
    if(loadError || songNodes.some(node => node.dragging)){
      return;
    }
    const saved = saveGraphData(songNodes, songEdges);

    setSaveError(
      saved ? null : 'your graph could not be saved.'
    );
  }, [songNodes, songEdges, loadError]);



  function handleNodeClick(event, node){
    setShowRecommendations(false); // hides the recommendations panel when a new song is selected.
  }

  function handleLibrarySelect(nodeId){
    const targetNode = songNodes.find(node => node.id === nodeId);
    if(!targetNode || !reactFlowInstance) return; 

    setShowRecommendations(false);

    setSongNodes(currentNodes =>
      currentNodes.map(node => ({
        ...node,
        selected: node.id === nodeId, // sets the selected property of the clicked node to true and all others to false.
      }))
    );

    graphSectionRef.current?.scrollIntoView({ //
      behavior: 'smooth',
      block: 'nearest',
    });

    reactFlowInstance.fitView({
      nodes: [{id: nodeId}],
      padding: 0.4,
      maxZoom: 1,
      duration: 650,
    });
  }  




  function handleDeselect(){
    setShowRecommendations(false);
    setSongNodes(currentNodes => currentNodes.map(node => ({ ...node, selected: false }))); //sets all nodes to unselected.
    
  }

  function handleAddtoGraph(song){
    const sourceNode = selectedNode; // find the source node

    const alreadyAdded = songNodes.some(node => node.data.id === song.id); // check if the song is already in the graph

    if(!sourceNode || alreadyAdded) return; // if no source node or song is already in the graph, do nothing

    const branchCount = songEdges.filter(edge => edge.source === sourceNode.id).length; // count how many edges are already connected to the source node

    const newNode = {
      id: String(song.id),
      type: 'song',
      position: {
        x: sourceNode.position.x + 350, // position the new node to the right of the source node
        y: sourceNode.position.y + branchCount * 250, // stagger the new nodes vertically based on how many edges are already connected
      },
      data: song,
    };


    const newEdge = {
      id: `edge-${sourceNode.id}-${newNode.id}`, // create a unique id for the new edge
      source: sourceNode.id,
      target: newNode.id,
    };

    setSongNodes(currentNodes => [ // add the new node to the graph
      ...currentNodes.map(node => ({
        ...node,
        selected: false, // unselect all nodes when a new node is added
      })),
      {...newNode, selected: true}, // select the new node when it is added
    ]);

    setSongEdges(currentEdges => [...currentEdges, newEdge]); // add the new edge to the graph
    setShowRecommendations(false); 
    // Camera pans to the new node when it is added to the graph.
    if(reactFlowInstance){
      reactFlowInstance.fitView({
        nodes: [{id: newNode.id}],
        padding: 0.4,
        maxZoom: 1,
        duration: 650,
      });
    }
  }

  function handleStartOver(){
      if(!window.confirm('Start over? This will clear your current graph.')) return;

      if(!saveGraphData(initialNodes, [])){
        setSaveError('Your graph could not be cleared.');
      } else {
        setSongNodes(initialNodes);
        setSongEdges([]);
        setShowRecommendations(false);
        setSaveError(null);
        setLoadError(null);
      }
    }

    async function handleFindRecommendations(){
      if(!selectedSong) return;
      setShowRecommendations(true);
      setRecommendationsError(null);
      setRecommendationsLoading(true);

      try{
        const excludeIds = songNodes.map(node => node.data.id);
        const response = await fetch(`/api/songs/${selectedSong.id}/recommendations?exclude=${excludeIds.join(',')}`); // builds the url: selectedSong.id = the id of the selected song, excludeIds.join(',') = a list of all the ids in the graph.

        if(!response.ok){
          throw new Error(`Server responded with ${response.status}`);
        }

        const data =  await response.json(); 
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error(error);
        setRecommendationsError('failed to load recommendations.');
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    }
    

  return (
    <main className="app">
      <header className="app-header">
        {loadError && <p role = "alert">{loadError}</p>}
        {saveError && <p role = "alert">{saveError}</p>}
        <h1>RabbitHole<span> / music map</span></h1>
        <span className="demo-label">Sample songs</span>
        <button onClick={handleStartOver}>Start Over</button>
      </header>
      <div className="workspace">
        <section ref = {graphSectionRef} className="graph" aria-label="Interactive music map">
        <ReactFlow
          nodes={songNodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          nodesConnectable={false}//disables the ablity to draw new edges between nodes. 
          deleteKeyCode={null} //disables the ability to delete nodes with the delete key.
          minZoom={0.2} //min and max zoom levels for the graph.
          maxZoom={2}
          fitView // automatically zooms and pans the graph to fit all nodes in view.
          fitViewOptions={fitViewOptions}// padding and fitting options for the fitView function.
          colorMode="system"
          onNodeClick={handleNodeClick}
          onPaneClick={handleDeselect} //deselects the currently selected song when the user clicks on the background of the graph.
          edges = {songEdges}
          onEdgesChange = {onEdgesChange}
          onInit={setReactFlowInstance}
          multiSelectionKeyCode={null} 
          selectionKeyCode = {null} 
        >
          <Background color="#34445f" gap={28} size={2} />
          <Controls showInteractive={false} showFitView={false} />
          <Panel position="bottom-right"><FitWebButton /></Panel>
          <Panel position="bottom-center" className="map-hint">
            Drag the map to explore · Scroll to zoom · Drag a song to move it
          </Panel>
        </ReactFlow>
        </section>

        <div className="sidebar">
          <SongDetails
            song={selectedSong}
            onDeselect={handleDeselect}
            onFindRecommendations={handleFindRecommendations}
          />

          {showRecommendations && selectedSong && ( // only show recommendations after the user requests them for a selected song.
            <Recommendations
              songs={recommendations}
              loading={recommendationsLoading}
              error={recommendationsError}
              onAddToGraph={handleAddtoGraph}
            />
          )}
          <SongLibrary
            nodes={songNodes}
            selectedSongId={selectedSong?.id}
            onSelect={handleLibrarySelect}
            disabled={!reactFlowInstance} 
          />
        </div>
      </div>
    </main>
  );
}

