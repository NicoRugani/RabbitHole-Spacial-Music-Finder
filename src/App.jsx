
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
import {useState, useEffect} from 'react';
import { songs } from '../data/songs.js';
import { saveGraphData, loadGraphData } from '../data/graphStorage.js';
import SongDetails from './components/SongDetails.jsx';
import Recommendations from './components/Recommendations.jsx';

// React Flow adds a position and graph identity around our existing song data.
const initialNodes = [
  {
    id: String(songs[0].id),
    type: 'song',
    position: { x: 0, y: 0 },
    data: songs[0],
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
      const savedGraphData = loadGraphData();

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



  const [songNodes, setSongNodes, onNodesChange] = useNodesState(startingGraph.nodes);// uses state to remember the current nodes.
  const [songEdges, setSongEdges, onEdgesChange] = useEdgesState([]); 
  const [selectedSong, setSelectedSong] = useState(null); //uses state to remember the currently selected song.
  const [showRecommendations, setShowRecommendations] = useState(false);

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
    setSelectedSong(node.data); //updates the state and requests a re-render of the app.
    setShowRecommendations(false); // hides the recommendations panel when a new song is selected.
  }

  const recommendations = selectedSong // gets 3 songs that are not currently in the graph
    ? songs
    .filter(song =>
      !songNodes.some(node=>node.data.id === song.id) //.some checks if any node in the graph has the same id as the song being checked. 
    ).slice(0, 3)
    : []; 

  function handleDeselect(){
    setSelectedSong(null);
    setShowRecommendations(false);
    setSongNodes(currentNodes => currentNodes.map(node => ({ ...node, selected: false }))); //sets all nodes to unselected.
    
  }

  function handleAddtoGraph(song){
    const sourceNode = songNodes.find(node => node.data.id === selectedSong?.id); // find the source node

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

    function handleStartOver(){
      if(!window.confirm('Start over? This will clear your current graph.')) return;

      if(!saveGraphData(initialNodes, [])){
        setSaveError('Your graph could not be cleared.');
      } else {
        setSongNodes(initialNodes);
        setSongEdges([]);
        setSelectedSong(null);
        setShowRecommendations(false);
        setSaveError(null);
      }
    }

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
    setSelectedSong(song);
    setShowRecommendations(false); 


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
        <section className="graph" aria-label="Interactive music map">
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
            onFindRecommendations={() => setShowRecommendations(true)}
          />

          {showRecommendations && selectedSong && ( // only show recommendations after the user requests them for a selected song.
            <Recommendations
              songs={recommendations}
              onAddToGraph={handleAddtoGraph}
            />
          )}
        </div>
      </div>
    </main>
  );
}
